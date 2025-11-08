# AWS Lightsail Deployment

This guide describes how to deploy the application to a single AWS Lightsail instance with a managed Lightsail PostgreSQL database. The flow keeps costs low while providing automated delivery from the main branch.

## Architecture Overview

- Lightsail Instance (Ubuntu 24.04) hosts both the backend API and the Angular frontend.
- Lightsail Managed Database (PostgreSQL 15) stores application data.
- Nginx serves the Angular build and proxies API requests to the backend service.
- System environment variables are stored on the instance under `/var/www/skierglistan/shared/env/backend.env`.
- GitHub Actions performs remote deployments via SSH, builds locally, and restarts services with `pm2`.

## Prerequisites

- AWS account with IAM user configured for Lightsail access.
- Registered domain managed by Route 53 or another DNS provider.
- GitHub repository with secrets defined:
  - `LIGHTSAIL_HOST`: Lightsail instance public IP or DNS name.
  - `LIGHTSAIL_DEPLOY_USER`: SSH user with deploy permissions.
  - `LIGHTSAIL_SSH_KEY`: Private key for the deploy user (OpenSSH format).
  - `LIGHTSAIL_DB_ENDPOINT`: Database endpoint without port.
  - `LIGHTSAIL_DB_PORT`: Database port.
  - `LIGHTSAIL_DB_NAME`: Database name.
  - `LIGHTSAIL_DB_USER`: Database user.
  - `LIGHTSAIL_DB_PASSWORD`: Database password.
  - `LIGHTSAIL_DOMAIN`: Public domain used for the application.
  - `LIGHTSAIL_EMAIL`: Email used for Let’s Encrypt registration.

## Provision Infrastructure

1. Create a Lightsail PostgreSQL database in the same region as the application instance. Note the endpoint, port, database name, user, and password. Disable public access if using a private networking plan.
2. Create a Lightsail instance using Ubuntu 24.04 on the smallest plan that meets resource needs. Attach a static IP and enable the default firewall rules for HTTP (80), HTTPS (443), and API traffic (3000).
3. Configure DNS records so the application domain resolves to the Lightsail static IP.
4. Create an SSH keypair dedicated to deployments. Add the public key to `/home/ubuntu/.ssh/authorized_keys` or the target deploy user.
5. Create the `deploy` user on the instance:
   ```bash
   sudo adduser deploy
   sudo usermod -aG sudo deploy
   sudo -u deploy mkdir -p /home/deploy/.ssh
   sudo cp /home/ubuntu/.ssh/authorized_keys /home/deploy/.ssh/
   sudo chown -R deploy:deploy /home/deploy/.ssh
   ```
6. Configure AWS CLI locally with permissions to manage Lightsail if not already done.

## Bootstrap the Instance

Run the bootstrap script once per instance from the repository root:

```bash
scp scripts/deploy/lightsail_bootstrap.sh $LIGHTSAIL_DEPLOY_USER@$LIGHTSAIL_HOST:/tmp/bootstrap.sh
ssh $LIGHTSAIL_DEPLOY_USER@$LIGHTSAIL_HOST 'chmod +x /tmp/bootstrap.sh && sudo /tmp/bootstrap.sh'
```

The script installs Node.js 20, pm2, nginx, certbot, git, and the PostgreSQL client, prepares the `/var/www/skierglistan` directory layout, and enables persistent directories for shared environment files and the Angular build.

## Configure Environment Variables

Store runtime configuration in `/var/www/skierglistan/shared/env/backend.env` using the deploy user. Reloading requires a restart of the pm2 process.

```
NODE_ENV=production
PORT=3000
DB_HOST=<database endpoint>
DB_PORT=<database port>
DB_NAME=<database name>
DB_USER=<database user>
DB_PASSWORD=<database password>
DB_SSL=true
DB_MAX_CONNECTIONS=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=2000
APP_DOMAIN=<application domain>
CORS_ALLOWED_ORIGINS=<comma separated list including https://<application domain>>
```

## Configure Nginx

After bootstrapping, copy the nginx server block and enable TLS:

```bash
scp scripts/deploy/nginx_skierglistan.conf $LIGHTSAIL_DEPLOY_USER@$LIGHTSAIL_HOST:/tmp/skierglistan.conf
ssh $LIGHTSAIL_DEPLOY_USER@$LIGHTSAIL_HOST 'sudo mv /tmp/skierglistan.conf /etc/nginx/sites-available/skierglistan && sudo ln -sf /etc/nginx/sites-available/skierglistan /etc/nginx/sites-enabled/skierglistan && sudo nginx -t && sudo systemctl reload nginx'
ssh $LIGHTSAIL_DEPLOY_USER@$LIGHTSAIL_HOST "sudo certbot --nginx -d $LIGHTSAIL_DOMAIN -m $LIGHTSAIL_EMAIL --agree-tos --non-interactive"
```

## Automated Deployment Flow

1. Developer merges to `main`.
2. GitHub Actions workflow builds backend and frontend artifacts.
3. Workflow uploads the built files to the Lightsail instance using `rsync`.
4. Workflow runs `scripts/deploy/remote_deploy.sh` remotely to install dependencies, run migrations, update the Angular build, and restart the backend via pm2.

## First Deployment

1. Run the bootstrap and nginx configuration steps.
2. Place the backend environment file.
3. Run the GitHub Actions workflow manually (or push to `main`) to perform the first deployment.
4. Confirm services:
   - API health check at `https://<domain>/api/health`.
   - Frontend loads at `https://<domain>/`.

## Maintenance

- Update instance packages monthly: `sudo apt update && sudo apt upgrade -y`.
- Renew TLS certificates automatically via certbot timer; confirm with `systemctl status certbot.timer`.
- Review pm2 logs using `pm2 logs skierglistan`.
- Validate automated deployments after major dependency upgrades.


