# AWS EC2 Docker Deployment - Quick Start Guide

Complete deployment checklist for Bozor to AWS EC2 via Docker.

## ✅ Pre-Deployment Checklist

### 1. AWS Account Setup
- [ ] Create AWS account
- [ ] Create IAM user for deployment
- [ ] Generate AWS Access Key ID and Secret Access Key
- [ ] Create S3 bucket for file storage (`bozor-app-storage-prod`)
- [ ] Create ECR repository (`bozor`)
- [ ] Configure SES for email (verify domain/email addresses)

### 2. Local Preparation
- [ ] Update `.env.production.example` with your values
- [ ] Install Docker locally for testing
- [ ] Confirm `APP_IMAGE` points to the Docker Hub image you want to publish
- [ ] Build frontend assets: `npm run build`
- [ ] Test Docker build: `docker build -f Dockerfile.prod -t bozor:test .`
- [ ] Commit and push code to GitHub `main` branch

### 3. GitHub Setup
- [ ] Add SSH deploy key to GitHub (Settings → Deploy Keys)
- [ ] Create GitHub Secrets (Settings → Secrets and variables → Actions):

```
AWS_ACCESS_KEY_ID              # Your AWS IAM access key
AWS_SECRET_ACCESS_KEY          # Your AWS IAM secret key
AWS_ACCOUNT_ID                 # Your 12-digit AWS account ID
ECR_REPOSITORY                 # bozor
AWS_REGION                     # us-east-1
EC2_HOST                       # Your EC2 public IP or DNS
EC2_USER                       # ubuntu
EC2_SSH_KEY                    # Contents of your PEM file
SLACK_WEBHOOK                  # Optional: for deployment notifications
```

---

## 🚀 Deployment Steps

### Step 1: Create AWS Infrastructure (One-Time)

```bash
# Create S3 bucket
aws s3 mb s3://bozor-app-storage-prod --region us-east-1

# Create ECR repository
aws ecr create-repository --repository-name bozor --region us-east-1

# Create IAM user (save access keys)
aws iam create-user --user-name bozor-app
aws iam create-access-key --user-name bozor-app

# Attach policies to IAM user (copy commands from AWS_DEPLOYMENT.md)
```

### Step 2: Create EC2 Instance

```bash
# Use AWS Console or CLI
# Recommended: Ubuntu 22.04 LTS, t3.medium instance type
# Security group: Allow SSH (22), HTTP (80), HTTPS (443) from 0.0.0.0/0

# After instance is running, note the public IP/DNS
```

### Step 3: Initial EC2 Setup

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>

# Run setup script
curl -O https://raw.githubusercontent.com/your-username/bozor/main/scripts/setup-ec2.sh
bash setup-ec2.sh

# Exit and set GitHub secret: EC2_HOST to the public IP/DNS
```

### Step 4: Configure Environment

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@<EC2_HOST>

# Edit environment file
nano /home/ubuntu/bozor/.env

# Required values to update:
# - APP_KEY: Run `php artisan key:generate` locally and copy
# - APP_URL: Your domain (https://yourdomain.com)
# - DB_PASSWORD: Strong password
# - AWS_ACCESS_KEY_ID: From IAM user
# - AWS_SECRET_ACCESS_KEY: From IAM user
# - AWS_BUCKET: bozor-app-storage-prod
# - MAIL_FROM_ADDRESS: Your email
```

### Step 5: First Deployment

```bash
# Navigate to app directory
cd /home/ubuntu/bozor

# Build and start containers locally on the server
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Verify containers are running
docker-compose -f docker-compose.prod.yml ps

# Run migrations and seeders
docker-compose -f docker-compose.prod.yml exec app php artisan migrate --force
docker-compose -f docker-compose.prod.yml exec app php artisan db:seed --class=CategorySeeder

# Check logs
docker-compose -f docker-compose.prod.yml logs -f app
```

### Optional: Build and Push via Docker Hub

The default production image is `fuzalov/bozor-app:latest`. Set `APP_IMAGE` in the EC2 `.env` before building if you use a different Docker Hub namespace or tag. For production deploys, also push an immutable tag such as the git SHA or release number so the exact image can be identified later.

Do not upload local `.env` to EC2. Keep local values like `localhost` in local `.env`, and keep production domain, DB, and OAuth values in the EC2 `.env`.

```powershell
.\scripts\deploy-dockerhub.ps1
```

```bash
# From your local checkout
docker compose -f docker-compose.prod.yml build app
docker compose -f docker-compose.prod.yml push app
docker tag fuzalov/bozor-app:latest fuzalov/bozor-app:<git-sha-or-release>
docker push fuzalov/bozor-app:<git-sha-or-release>

# On the server
docker compose -f docker-compose.prod.yml pull app
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml exec app php artisan migrate --force
```

### Step 6: DNS & SSL Setup

```bash
# Point your domain A record to EC2 public IP

# SSH into instance and setup SSL
ssh -i your-key.pem ubuntu@<EC2_HOST>

# Install Certbot
sudo apt install -y certbot python3-certbot-standalone

# Generate certificate (replace with your domain)
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Add SSL config to docker/nginx/default.conf (see AWS_DEPLOYMENT.md)
# Rebuild and restart containers
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

# Set up auto-renewal cron job (see AWS_DEPLOYMENT.md)
```

### Step 7: Future Deployments

After the initial setup, all future deployments happen automatically:

1. Make changes locally
2. Commit and push to `main` branch
3. GitHub Actions workflow triggers automatically
4. Application deploys to EC2

---

## 📊 Architecture Overview

```
GitHub Repository
    ↓
GitHub Actions Workflow (.github/workflows/deploy.yml)
    ↓
    ├─ Build Frontend (Vite)
    ├─ Build Docker Image (Dockerfile.prod)
    └─ Push to ECR
         ↓
EC2 Instance
    ├─ Nginx (reverse proxy + SSL)
    ├─ PHP-FPM (Laravel app)
    ├─ PostgreSQL (database)
    └─ Redis (cache + queue)
         ↓
AWS Services
    ├─ S3 (file storage)
    ├─ SES (email)
    └─ CloudWatch (monitoring)
```

---

## 🔧 Common Commands

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@<EC2_HOST>

# View running containers
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f app

# Run artisan command
docker-compose -f docker-compose.prod.yml exec app php artisan <command>

# Database backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U bozor_user bozor_prod > backup.sql

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Update code and redeploy
git pull origin main
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml exec app php artisan migrate --force

# Build and push Docker Hub image
docker compose -f docker-compose.prod.yml build app
docker compose -f docker-compose.prod.yml push app
docker tag fuzalov/bozor-app:latest fuzalov/bozor-app:<git-sha-or-release>
docker push fuzalov/bozor-app:<git-sha-or-release>
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Container fails to start | Check logs: `docker-compose logs app` |
| Database connection error | Verify DB_HOST and DB_PASSWORD in .env |
| 502 Bad Gateway | Check PHP-FPM and Nginx logs |
| Out of disk space | Run `docker system prune -a` |
| SSL certificate issues | Check certificate path in nginx config |
| File uploads fail | Verify S3 credentials and bucket permissions |

---

## 📚 Additional Resources

- [Complete AWS Deployment Guide](AWS_DEPLOYMENT.md)
- [Docker Documentation](https://docs.docker.com)
- [Laravel Deployment](https://laravel.com/docs/deployment)
- [GitHub Actions](https://docs.github.com/actions)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)

---

## 🔐 Security Reminders

⚠️ **NEVER commit `.env` files to Git**
⚠️ **Keep your EC2 SSH key safe** - it's your master key
⚠️ **Use strong passwords** for database and AWS users
⚠️ **Enable CloudWatch monitoring** for production alerts
⚠️ **Regularly backup your database** to S3
⚠️ **Keep Docker images updated**

---

*Last updated: May 2026*
