#!/usr/bin/env bash
# EC2 Bootstrap Script for Bozor (Ubuntu 24.04)
# Run once as root after launching the instance:
#   sudo bash bootstrap.sh

set -e

DOMAIN="yourdomain.com"
APP_DIR="/var/www/bozor"
REPO_URL="git@github.com:YOUR_ORG/bozor.git"
PHP_VERSION="8.4"

echo "==> Updating system packages..."
apt-get update && apt-get upgrade -y

echo "==> Installing Nginx, PHP ${PHP_VERSION}, and extensions..."
add-apt-repository ppa:ondrej/php -y
apt-get update
apt-get install -y \
    nginx \
    php${PHP_VERSION}-fpm \
    php${PHP_VERSION}-cli \
    php${PHP_VERSION}-mbstring \
    php${PHP_VERSION}-xml \
    php${PHP_VERSION}-sqlite3 \
    php${PHP_VERSION}-curl \
    php${PHP_VERSION}-zip \
    php${PHP_VERSION}-gd \
    php${PHP_VERSION}-bcmath \
    unzip curl git

echo "==> Installing Composer..."
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

echo "==> Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "==> Cloning repository..."
mkdir -p /var/www
git clone "${REPO_URL}" "${APP_DIR}"
cd "${APP_DIR}"

echo "==> Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

echo "==> Configuring environment..."
cp .env.example .env
# !! Edit /var/www/bozor/.env with your actual production values before continuing !!
echo ""
echo "  ACTION REQUIRED: Fill in /var/www/bozor/.env with your production values"
echo "  (APP_KEY, APP_URL, AWS_*, MAIL_*, etc.) then press ENTER to continue."
read -r

echo "==> Generating app key..."
php artisan key:generate

echo "==> Creating SQLite database..."
mkdir -p database
touch database/database.sqlite

echo "==> Running migrations..."
php artisan migrate --force

echo "==> Restoring custom routes index..."
if [ ! -f resources/js/routes/index.ts ]; then
    cp resources/js/routes/index.ts.example resources/js/routes/index.ts
fi

echo "==> Linking storage..."
php artisan storage:link

echo "==> Caching config, routes, views..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

echo "==> Setting permissions..."
chown -R www-data:www-data "${APP_DIR}"
chmod -R 775 "${APP_DIR}/storage"
chmod -R 775 "${APP_DIR}/bootstrap/cache"

echo "==> Configuring Nginx..."
cat > /etc/nginx/sites-available/bozor <<NGINX
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    root ${APP_DIR}/public;
    index index.php index.html;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    charset utf-8;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php${PHP_VERSION}-fpm.sock;
        fastcgi_param SCRIPT_FILENAME \$realpath_root\$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/bozor /etc/nginx/sites-enabled/bozor
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "==> Installing Certbot for SSL..."
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d "${DOMAIN}" -d "www.${DOMAIN}" --non-interactive --agree-tos -m "admin@${DOMAIN}"

echo "==> Installing queue worker systemd service..."
cat > /etc/systemd/system/bozor-worker.service <<SERVICE
[Unit]
Description=Bozor Queue Worker
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/php artisan queue:work --sleep=3 --tries=3 --max-time=3600
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SERVICE

systemctl daemon-reload
systemctl enable bozor-worker
systemctl start bozor-worker

echo ""
echo "==> Bootstrap complete!"
echo "    Visit: https://${DOMAIN}"
echo "    Queue worker: systemctl status bozor-worker"
