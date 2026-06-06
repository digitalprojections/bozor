# Bozor — Online Marketplace

A full-featured auction and marketplace platform built with **Laravel 11**, **React 18**, **Inertia.js**, and **TypeScript**.

Users can list items for auction or direct sale, place bids, buy now, manage their profile and settings, add listings to a watchlist, and receive email notifications on watchlist updates.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel, PHP 8.4 |
| Frontend | React 18, TypeScript, Inertia.js |
| Styling | Tailwind CSS, shadcn/ui |
| Auth | Laravel Fortify |
| Database | PostgreSQL |
| File Storage | AWS S3 |
| Email | AWS SES |
| Queue | Redis-backed Laravel queues |
| Build | Vite |
| Deploy | DockerHub image → EC2 Docker Compose |

---

## Local Development Setup

### Prerequisites
- PHP 8.4+, Composer
- Node.js 20+, npm
- Docker Desktop, for the one-command local Docker stack

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

### Local Docker

Run the local Docker-only stack with PostgreSQL:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/deploy-local.ps1
```

Defaults:
- App: `http://localhost:8080`
- PostgreSQL host port: `5433`
- Compose project: `bozorlocal`

Optional ports:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/deploy-local.ps1 -HttpPort 8081 -DbPort 5434
```

---

## Key Features

- **Marketplace** — Browse, search, and filter active listings
- **Auctions** — Place bids with dynamic highest-bid pricing that reverts automatically if the top bid is removed
- **Auction End Times** — Listing forms submit browser-local auction end times with the browser timezone offset, and the database stores the calculated UTC time
- **Buy Now** — Instant purchase at a fixed price
- **Watchlist** — Heart icon on every listing card; manage from `/watchlist`
- **Email Notifications** — Queued SES emails on price drops, status changes, and new bids for watched listings
- **Profile** — Public seller profile with ratings and verification badge
- **Settings** — Profile edit with required personal address fields, password change, two-factor auth, appearance

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

## Production Docker Deployment

### Architecture
```
DockerHub image → EC2 Docker Compose (app + PostgreSQL + Redis + Caddy)
                   ↘ S3 (file uploads)
                       SES (transactional email)
```

### Staging First

Use staging as the release candidate environment before production. Staging should have its own domain, database, bucket, OAuth redirect, and mail behavior so tests never mutate production data.

Recommended flow:

```powershell
# 1. Deploy the candidate image to staging
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/deploy-staging.ps1

# 2. Smoke test staging:
#    - https://staging.bazaarjapan.link/health
#    - login / Google callback
#    - create listing with image upload
#    - bid / buy-now path
#    - admin flows touched by the change

# 3. Promote only after staging passes
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/deploy-production.ps1
```

Create `/home/ec2-user/bozor-staging/.env.staging` from `.env.staging.example` on the staging server. For the current same-EC2 setup, `staging.bazaarjapan.link` points to the same public IP as `bazaarjapan.link`; production Caddy is the only container binding ports 80/443 and routes staging traffic to the staging app over the shared `bozor-public` Docker network.

### One-Command Deploy

The production sequence builds the app image, tags it, pushes it to DockerHub, pins the EC2 `.env` to that exact tag, pulls it on EC2, recreates the stack, runs migrations/cache commands, and verifies `/health`.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/deploy-production.ps1
```

This is a wrapper around `scripts/deploy-dockerhub.ps1`. Use the lower-level script only when you need custom parameters:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/deploy-dockerhub.ps1 -ImageTag manual-tag
```

Before deploying, make sure:
- Docker Desktop is running locally
- DockerHub login is active locally
- `bozorkey.pem` exists in the repo root, or pass `-KeyPath`
- EC2 has `docker-compose` installed
- `/home/ec2-user/.env` has the production secrets

### IAM User
Create an IAM user with programmatic access and attach:
- `AmazonS3FullAccess` (or scoped to your bucket)
- `AmazonSESFullAccess`

Save the access key and secret — these become GitHub secrets.

### S3 Bucket
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

### SES (Simple Email Service)
1. Go to SES → Verified Identities → **Verify your domain**
2. Add the DNS records (DKIM, MAIL FROM) to your domain registrar
3. Request **production access** (to send to any address, not just verified ones)

### EC2 Instance
1. Launch an EC2 instance (t3.small or larger)
2. Security group inbound rules: SSH (22), HTTP (80), HTTPS (443)
3. Create and download a **key pair** (`.pem`)
4. Assign an **Elastic IP**
5. Point your domain's A record to the Elastic IP

### `.env` on the Server
Production deploy reads `/home/ec2-user/.env` on EC2:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://bazaarjapan.link
APP_DOMAIN=bazaarjapan.link

DB_DATABASE=...
DB_USERNAME=...
DB_PASSWORD=...

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

# Local Docker
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/deploy-local.ps1

# Production DockerHub -> EC2
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/deploy-production.ps1

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
