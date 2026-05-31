#!/bin/bash
set -e

echo "🚀 Starting Bozor application..."

# Wait for PostgreSQL only when the app is configured to use it.
if [ "$DB_CONNECTION" = "pgsql" ]; then
  echo "⏳ Waiting for PostgreSQL..."
  while ! pg_isready -h "${DB_HOST:-postgres}" -U "$DB_USERNAME" > /dev/null 2>&1; do
    sleep 1
  done
  echo "✅ PostgreSQL is ready"
fi

if [ "$DB_CONNECTION" = "sqlite" ]; then
  DB_PATH="${DB_DATABASE:-/var/www/html/database/database.sqlite}"
  echo "🗄️ Preparing SQLite database at $DB_PATH"
  mkdir -p "$(dirname "$DB_PATH")"
  touch "$DB_PATH"
fi

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
  echo "🔑 Generating application key..."
  php artisan key:generate --force
fi

# Run migrations
echo "📊 Running database migrations..."
php artisan migrate --force

# Seed the database if needed
if [ "$SEED_DATABASE" = "true" ]; then
  echo "🌱 Seeding database..."
  php artisan db:seed
fi

# Clear caches
echo "🧹 Clearing caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create storage link
echo "🔗 Creating storage link..."
php artisan storage:link || true

# Set permissions
echo "📝 Setting permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database

echo "✅ Application startup complete!"
echo "🌐 Server running at $APP_URL"

exec "$@"
