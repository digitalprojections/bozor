#!/bin/bash
set -e

echo "🚀 Starting Bozor application..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL..."
while ! pg_isready -h postgres -U "$DB_USERNAME" > /dev/null 2>&1; do
  sleep 1
done
echo "✅ PostgreSQL is ready"

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
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

echo "✅ Application startup complete!"
echo "🌐 Server running at $APP_URL"

exec "$@"
