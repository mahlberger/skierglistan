#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run as root"
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

apt update
apt install -y ca-certificates curl gnupg git unzip postgresql-client nginx certbot python3-certbot-nginx ufw

mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" > /etc/apt/sources.list.d/nodesource.list
apt update
apt install -y nodejs npm
npm install -g pm2

id deploy >/dev/null 2>&1 || adduser --disabled-password --gecos "" deploy
usermod -aG sudo deploy

mkdir -p /var/www/skierglistan/releases
mkdir -p /var/www/skierglistan/shared/env
mkdir -p /var/www/skierglistan/shared/frontend
chown -R deploy:deploy /var/www/skierglistan

ufw allow OpenSSH
ufw allow http
ufw allow https
ufw --force enable

systemctl enable nginx
systemctl restart nginx

