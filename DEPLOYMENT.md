# Deployment Manual (Manual)

This document provides step-by-step instructions for manually deploying the Bozor application.

## 1. Local Preparation
Before uploading, build your production assets:
```powershell
npm run build
```

## 2. Server setup
### Prerequisites
- PHP 8.2+
- Node.js & NPM
- Composer
- MySQL/MariaDB

### Steps
1. **Upload Files**: Transfer project files to the server (exclude `node_modules`, `vendor`, `.env`).
2. **Install Dependencies**:
   ```bash
   composer install --optimize-autoloader --no-dev
   ```
3. **Environment Config**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   *Edit `.env` to set `APP_DEBUG=false`, `APP_ENV=production`, and database credentials.*
4. **Database Migrations & Seeding**:
   ```bash
   php artisan migrate --force
   php artisan db:seed --class=CategorySeeder
   ```
5. **Optimization**:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   php artisan storage:link
   ```
6. **Permissions**:
   ```bash
   chmod -R 775 storage bootstrap/cache
   chown -R www-data:www-data .
   ```

---
*Created on 2026-03-29*
