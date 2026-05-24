# 🚀 Bozor AWS EC2 Docker Deployment - Complete Guide

Complete deployment setup for Bozor (Laravel + React + Inertia) to AWS EC2 using Docker, PostgreSQL, Redis, and GitHub Actions CI/CD.

## 📖 Documentation Index

Start here based on your needs:

### 🟢 Just Getting Started?
👉 **Read:** [DEPLOYMENT_QUICK_START.md](DEPLOYMENT_QUICK_START.md)
- Deployment checklist
- Step-by-step setup instructions
- Common commands quick reference

### 📋 Complete Infrastructure Setup?
👉 **Read:** [AWS_DEPLOYMENT.md](AWS_DEPLOYMENT.md)
- AWS account configuration
- EC2 instance setup
- Docker configuration details
- SSL certificate setup
- Monitoring and backups

### 🔧 Configuring GitHub Actions?
👉 **Read:** [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md)
- Exactly what secrets to add
- Where to get each value
- How to verify configuration
- Security best practices

### 🐛 Something Broken?
👉 **Read:** [DEPLOYMENT_TROUBLESHOOTING.md](DEPLOYMENT_TROUBLESHOOTING.md)
- Common issues and solutions
- Debugging steps
- Emergency procedures
- Advanced debugging techniques

### 📊 Overview & Files?
👉 **Read:** [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)
- Architecture overview
- All deployment files listed
- Key features and components
- Scaling recommendations

---

## 🎯 Quick Start Path (15-30 mins)

```
1. Read DEPLOYMENT_QUICK_START.md
   ↓
2. Create AWS infrastructure
   - S3 bucket
   - ECR repository
   - IAM user
   ↓
3. Launch EC2 instance
   ↓
4. Run setup-ec2.sh script
   ↓
5. Configure .env file
   ↓
6. First deployment
   ↓
7. Setup SSL
   ↓
8. Verify at https://yourdomain.com
```

---

## 🗂️ Deployment Files Overview

### Configuration Files
- `Dockerfile.prod` - Production Docker image
- `docker-compose.prod.yml` - Docker Compose configuration
- `.env.production.example` - Environment template
- `docker/nginx/default.conf` - Nginx configuration
- `docker/supervisor/supervisord.conf` - Process management
- `docker/entrypoint.sh` - Container startup script

### Documentation
| File | Purpose |
|------|---------|
| `DEPLOYMENT_QUICK_START.md` | ⭐ Start here! |
| `AWS_DEPLOYMENT.md` | Complete AWS setup |
| `GITHUB_SECRETS_SETUP.md` | Configure secrets |
| `DEPLOYMENT_TROUBLESHOOTING.md` | Fix issues |
| `DEPLOYMENT_SUMMARY.md` | Overview & architecture |
| `DEPLOYMENT.md` | Manual deployment |

### Scripts
- `scripts/setup-ec2.sh` - Initial EC2 setup
- `scripts/deploy.sh` - Manual deployment script

### CI/CD
- `.github/workflows/deploy.yml` - GitHub Actions automation

---

## 🏗️ Architecture

```
┌─────────────────┐
│  Your Computer  │
│  (git push)     │
└────────┬────────┘
         │
         ↓
┌──────────────────────┐
│   GitHub Actions     │
│  • Build frontend    │
│  • Build Docker img  │
│  • Push to ECR       │
└────────┬─────────────┘
         │
         ↓
┌──────────────────────┐
│   Amazon ECR         │
│  (Docker registry)   │
└────────┬─────────────┘
         │
         ↓
┌──────────────────────────────────────┐
│   AWS EC2 Instance (Ubuntu 22.04)    │
│                                      │
│  ┌─────────────────────────────────┐ │
│  │  Nginx (Port 80/443)            │ │
│  │  ↓                              │ │
│  │  PHP-FPM (Port 9000)            │ │
│  │  ↓                              │ │
│  │  Laravel App                    │ │
│  └─────────────────────────────────┘ │
│                                      │
│  PostgreSQL (Port 5432)              │
│  Redis (Port 6379)                   │
│                                      │
└──────────────────────────────────────┘
         │
    ┌────┴─────────────┐
    ↓                  ↓
 AWS S3            AWS SES
(File storage)    (Email)
```

---

## ✨ Key Features Included

✅ **Multi-stage Docker builds** - Optimized images
✅ **PostgreSQL 16** - Production database
✅ **Redis 7** - Caching & queues
✅ **Nginx** - Reverse proxy & SSL
✅ **Laravel Queue Worker** - Background jobs
✅ **Laravel Scheduler** - Cron tasks
✅ **AWS S3 integration** - File storage
✅ **AWS SES** - Email delivery
✅ **GitHub Actions** - Automatic deployment
✅ **Health checks** - Monitoring
✅ **Supervisor** - Process management
✅ **Zero-downtime deployments** - Blue-green ready
✅ **SSL/TLS ready** - Let's Encrypt
✅ **Automatic migrations** - Deploy with DB changes

---

## 🔄 Deployment Flow

### Automatic (GitHub Actions)

```
git push origin main
    ↓
GitHub detects push
    ↓
Actions workflow runs:
  ├─ Build frontend (Vite)
  ├─ Build Docker image
  ├─ Push to ECR
  └─ Deploy to EC2
    ↓
EC2 pulls image
    ↓
docker-compose up -d
    ↓
php artisan migrate
    ↓
Caches cleared
    ↓
Application live!
```

### Manual Deployment

```bash
ssh ubuntu@<EC2_HOST>
cd /home/ubuntu/bozor
git pull origin main
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml exec app php artisan migrate --force
```

---

## 📋 Pre-Deployment Requirements

### AWS Account
- [ ] AWS account created
- [ ] IAM user for deployment
- [ ] AWS access keys generated
- [ ] S3 bucket created
- [ ] ECR repository created
- [ ] SES configured

### GitHub
- [ ] Repository on GitHub
- [ ] `.gitignore` includes `.env.production`
- [ ] All secrets configured
- [ ] SSH deploy key added

### EC2 Instance
- [ ] Instance running (Ubuntu 22.04 LTS)
- [ ] t3.medium or larger
- [ ] Security group configured
- [ ] Docker installed
- [ ] Application cloned

### Domain & SSL
- [ ] Domain A record pointing to EC2
- [ ] SSL certificate generated
- [ ] Certificate auto-renewal configured

---

## 🛠️ Common Commands

### Status & Logs

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@<EC2_HOST>

# View all containers
docker-compose -f docker-compose.prod.yml ps

# View application logs
docker-compose -f docker-compose.prod.yml logs -f app

# Database access
docker-compose -f docker-compose.prod.yml exec postgres psql -U bozor_user -d bozor_prod
```

### Laravel Commands

```bash
# Run migrations
docker-compose -f docker-compose.prod.yml exec app php artisan migrate

# Run seeders
docker-compose -f docker-compose.prod.yml exec app php artisan db:seed

# Run artisan command
docker-compose -f docker-compose.prod.yml exec app php artisan <command>

# Queue status
docker-compose -f docker-compose.prod.yml exec app php artisan queue:failed
```

### Deployment

```bash
# Manual deploy
git pull origin main
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml exec app php artisan migrate --force

# Restart
docker-compose -f docker-compose.prod.yml restart

# Stop
docker-compose -f docker-compose.prod.yml down

# Cleanup
docker system prune -a
```

---

## 🔐 Security Checklist

- [ ] `.env.production` in `.gitignore`
- [ ] Secrets stored in GitHub Actions only
- [ ] AWS access keys rotated every 90 days
- [ ] SSH key permissions: `chmod 600 key.pem`
- [ ] EC2 security group restricted
- [ ] SSL/TLS enabled on all endpoints
- [ ] Database backups automated
- [ ] CloudWatch monitoring enabled
- [ ] Application logs retention configured
- [ ] MFA enabled on AWS account

---

## 📊 Cost Estimation

| Component | Monthly Cost (Estimate) |
|-----------|-------------------------|
| EC2 t3.medium | $30 |
| PostgreSQL RDS (optional) | $30-50 |
| S3 storage (0-100 GB) | $2-10 |
| Bandwidth (0-100 GB) | $0-10 |
| **Total** | **~$60-100** |

*Costs vary by region and usage. Use AWS Calculator for accurate estimates.*

---

## 🚀 Performance Tips

1. **Use CloudFront** for static assets
2. **Enable caching** headers in Nginx
3. **Compress responses** with gzip
4. **Optimize images** before uploading
5. **Use Redis** for sessions and caching
6. **Enable database indexes** for queries
7. **Monitor with CloudWatch** for bottlenecks
8. **Use RDS** if database becomes bottleneck
9. **Enable ElastiCache** for Redis if needed
10. **Consider CDN** for global users

---

## 📞 Support Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Docker Documentation](https://docs.docker.com)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## 🎯 Next Steps

1. **Start with** [DEPLOYMENT_QUICK_START.md](DEPLOYMENT_QUICK_START.md)
2. **Create AWS infrastructure** following the checklist
3. **Set up GitHub Secrets** using [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md)
4. **Deploy to EC2** manually or via GitHub Actions
5. **Configure SSL** with Let's Encrypt
6. **Monitor application** with CloudWatch
7. **Set up backups** for database
8. **Optimize** based on performance metrics

---

## ✅ Deployment Verification

After deploying, verify:

```bash
# Health check endpoint
curl -I https://yourdomain.com/health

# Application loads
curl -I https://yourdomain.com

# Database connected
curl https://yourdomain.com/api/listings  # or your API endpoint

# Static assets loading
curl -I https://yourdomain.com/build/assets/app.js

# Email configured
# Send test email from admin panel

# File upload working
# Upload test file and verify in S3
```

---

## 💡 Pro Tips

- **Keep`.env.production` local only**, never commit
- **Test Docker locally** before pushing to production
- **Use staging branch** for testing before main
- **Monitor CloudWatch logs** daily in first week
- **Set up database backups** immediately
- **Use AWS Secrets Manager** for extra security
- **Enable CloudTrail** for audit logging
- **Implement rate limiting** for API endpoints
- **Use CloudFlare** for DDoS protection
- **Set up alerts** for CPU, memory, disk usage

---

*Bozor AWS EC2 Docker Deployment Setup*
*Created: May 24, 2026*
*Last Updated: May 24, 2026*

**Questions?** See [DEPLOYMENT_TROUBLESHOOTING.md](DEPLOYMENT_TROUBLESHOOTING.md)
