#!/usr/bin/env bash
set -euo pipefail

export PATH="/usr/local/bin:/usr/bin:$PATH"

if [ "$#" -ne 1 ]; then
  echo "Usage: remote_deploy.sh <release_source_dir>"
  exit 1
fi

SOURCE_DIR="$1"
APP_ROOT="/var/www/skierglistan"
RELEASES_DIR="$APP_ROOT/releases"
SHARED_DIR="$APP_ROOT/shared"
TIMESTAMP="$(date +%Y%m%d%H%M%S)"
RELEASE_DIR="$RELEASES_DIR/$TIMESTAMP"

if [ ! -d "$SOURCE_DIR" ]; then
  echo "Source directory not found: $SOURCE_DIR"
  exit 1
fi

mkdir -p "$RELEASE_DIR"
rsync -a --delete "$SOURCE_DIR/" "$RELEASE_DIR/"

if [ ! -f "$SHARED_DIR/env/backend.env" ]; then
  echo "Missing backend env file at $SHARED_DIR/env/backend.env"
  exit 1
fi

cp "$SHARED_DIR/env/backend.env" "$RELEASE_DIR/backend/.env"

cd "$RELEASE_DIR/backend"
npm ci --omit=dev
npm run migrate:up

if pm2 describe skierglistan >/dev/null 2>&1; then
  pm2 restart skierglistan --update-env
else
  pm2 start dist/index.js --name skierglistan
fi
pm2 save

rm -rf "$SHARED_DIR/frontend"
mkdir -p "$SHARED_DIR/frontend"
FRONTEND_BUILD_DIR="$RELEASE_DIR/frontend/dist/skierglistan/browser"
if [ -d "$FRONTEND_BUILD_DIR" ]; then
  cp -R "$FRONTEND_BUILD_DIR/." "$SHARED_DIR/frontend/"
else
  echo "Missing frontend build at $FRONTEND_BUILD_DIR"
  exit 1
fi

ln -sfn "$RELEASE_DIR" "$APP_ROOT/current"

cd "$RELEASES_DIR"
ls -1t | tail -n +6 | xargs -r rm -rf

