# Bozor — Online Marketplace

A full-featured auction and marketplace platform built with **Laravel 11**, **React 18**, **Inertia.js**, and **TypeScript**.

Users can list items for auction or direct sale, place bids, buy now, manage their profile and settings, add listings to a watchlist, and receive email notifications on watchlist updates.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 11, PHP 8.4 |
| Frontend | React 18, TypeScript, Inertia.js |
| Styling | Tailwind CSS, shadcn/ui |
| Auth | Laravel Fortify |
| Database | SQLite |
| File Storage | AWS S3 |
| Email | AWS SES |
| Queue | Database-backed (Laravel queues) |
| Build | Vite |
| Deploy | GitHub Actions → EC2 via SSH |

---

## Local Development Setup

### Prerequisites
- PHP 8.4+, Composer
- Node.js 20+, npm

### Steps

```bash
# 1. Clone the repo
git clone <repo-url> && cd bozor

# 2. Install dependencies
composer install
npm install

# 3. Set up environment (use local/log drivers for dev)
cp .env.example .env
# Edit .env: set FILESYSTEM_DISK=local, MAIL_MAILER=log
php artisan key:generate

# 4. Restore the custom routes index (gitignored)
cp resources/js/routes/index.ts.example resources/js/routes/index.ts

# 5. Run migrations + link storage
php artisan migrate
php artisan storage:link

# 6. Start dev servers (each in a separate terminal)
php artisan serve
npm run dev

# Optional: process queued email notifications
php artisan queue:work
```

Visit **http://127.0.0.1:8000**

---

## Key Features

- **Marketplace** — Browse, search, and filter active listings
- **Auctions** — Place bids with real-time high-bid tracking
- **Buy Now** — Instant purchase at a fixed price
- **Watchlist** — Heart icon on every listing card; manage from `/watchlist`
- **Email Notifications** — Queued SES emails on price drops, status changes, and new bids for watched listings
- **Profile** — Public seller profile with ratings and verification badge
- **Settings** — Profile edit, password change, two-factor auth, appearance

---

## Environment Variables

| Variable | Local | Production |
|---|---|---|
| `FILESYSTEM_DISK` | `local` | `s3` |
| `MAIL_MAILER` | `log` | `ses` |
| `AWS_ACCESS_KEY_ID` | — | IAM key |
| `AWS_SECRET_ACCESS_KEY` | — | IAM secret |
| `AWS_DEFAULT_REGION` | — | e.g. `ap-northeast-1` |
| `AWS_BUCKET` | — | S3 bucket name |
| `AWS_URL` | — | Public S3 base URL (optional CDN URL) |
| `MAIL_FROM_ADDRESS` | any | SES-verified address |

---

## AWS Deployment

### Architecture
```
GitHub → Actions CI → EC2 (Nginx + PHP-FPM + SQLite)
                   ↘ S3 (file uploads)
                       SES (transactional email)
```

### 1. IAM User
Create an IAM user with programmatic access and attach:
- `AmazonS3FullAccess` (or scoped to your bucket)
- `AmazonSESFullAccess`

Save the access key and secret — these become GitHub secrets.

### 2. S3 Bucket
1. Create a bucket (e.g. `bozor-uploads`) in your target region
2. **Block all public access** (uploads are served via pre-signed URLs or public prefix policy)
3. Add a bucket policy to allow public read on `listings/*` (listing images):

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::bozor-uploads/listings/*"
  }]
}
```

### 3. SES (Simple Email Service)
1. Go to SES → Verified Identities → **Verify your domain**
2. Add the DNS records (DKIM, MAIL FROM) to your domain registrar
3. Request **production access** (to send to any address, not just verified ones)

### 4. EC2 Instance
1. Launch an **Ubuntu 24.04** instance (t3.small or larger)
2. Security group inbound rules: SSH (22), HTTP (80), HTTPS (443)
3. Create and download a **key pair** (`.pem`)
4. Assign an **Elastic IP**
5. Point your domain's A record to the Elastic IP

### 5. Server Bootstrap
```bash
# SSH into your instance
ssh -i your-key.pem ubuntu@<ELASTIC_IP>

# Download and run the bootstrap script
curl -O https://raw.githubusercontent.com/YOUR_ORG/bozor/main/scripts/bootstrap-ec2.sh
sudo bash bootstrap-ec2.sh
```

The script installs Nginx, PHP 8.4, Composer, Node 20, clones the repo, sets up SSL via Certbot, and creates a systemd service for the queue worker.

> Edit `DOMAIN` and `REPO_URL` at the top of the script before running.

### 6. `.env` on the Server
After the bootstrap script pauses, edit `/var/www/bozor/.env`:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

FILESYSTEM_DISK=s3
MAIL_MAILER=ses

AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_DEFAULT_REGION=ap-northeast-1
AWS_BUCKET=bozor-uploads
AWS_URL=https://bozor-uploads.s3.ap-northeast-1.amazonaws.com

MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME=Bozor
```

### 7. GitHub Actions Secrets
Add these in **Settings → Secrets and variables → Actions**:

| Secret | Value |
|---|---|
| `EC2_HOST` | Elastic IP |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_KEY` | Contents of `.pem` file |
| `AWS_ACCESS_KEY_ID` | IAM key |
| `AWS_SECRET_ACCESS_KEY` | IAM secret |
| `AWS_DEFAULT_REGION` | e.g. `ap-northeast-1` |
| `AWS_BUCKET` | S3 bucket name |
| `APP_KEY` | `php artisan key:generate --show` |
| `APP_URL` | `https://yourdomain.com` |
| `MAIL_FROM_ADDRESS` | SES-verified address |

Push to `main` to trigger the first automated deployment.

---

## Route File Note

`resources/js/routes/index.ts` is **gitignored** because the wayfinder generator overwrites it.
The tracked template lives at `resources/js/routes/index.ts.example`.

**Restore after cloning or after running `php artisan wayfinder:generate`:**
```bash
cp resources/js/routes/index.ts.example resources/js/routes/index.ts
```

**Update the example when you add new route modules:**
```bash
cp resources/js/routes/index.ts resources/js/routes/index.ts.example
git add resources/js/routes/index.ts.example && git commit -m "chore: update routes index example"
```

---

## Useful Commands

```bash
# Dev
php artisan serve && npm run dev
php artisan queue:work          # Email notification worker

# Wayfinder (always restore index.ts after running)
php artisan wayfinder:generate
cp resources/js/routes/index.ts.example resources/js/routes/index.ts

# Database
php artisan migrate
php artisan migrate:fresh --seed

# Production (run on EC2)
php artisan config:cache
php artisan route:cache
php artisan view:cache
sudo systemctl restart bozor-worker
```
