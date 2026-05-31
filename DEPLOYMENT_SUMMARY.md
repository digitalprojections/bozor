# Bozor - AWS EC2 Docker Deployment Summary

## 📦 Deployment Files Created/Updated

### Configuration Files

| File | Purpose |
|------|---------|
| [Dockerfile.prod](Dockerfile.prod) | Multi-stage Docker build for production |
| [docker-compose.prod.yml](docker-compose.prod.yml) | Docker Compose configuration with PostgreSQL, Redis, Nginx |
| `.env.production.example` | Production environment template |
| [docker/nginx/default.conf](docker/nginx/default.conf) | Nginx reverse proxy configuration |
| [docker/supervisor/supervisord.conf](docker/supervisor/supervisord.conf) | Supervisor configuration for processes |
| [docker/entrypoint.sh](docker/entrypoint.sh) | Container startup script |
| [.dockerignore](.dockerignore) | Docker build optimization |

### Deployment Guides

| File | Purpose |
|------|---------|
| [DEPLOYMENT_QUICK_START.md](DEPLOYMENT_QUICK_START.md) | ⭐ **START HERE** - Quick deployment checklist |
| [AWS_DEPLOYMENT.md](AWS_DEPLOYMENT.md) | Complete AWS infrastructure and deployment guide |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Manual deployment guide (legacy) |

### Deployment Scripts

| File | Purpose |
|------|---------|
| [scripts/setup-ec2.sh](scripts/setup-ec2.sh) | Initial EC2 instance setup |
| [scripts/deploy.sh](scripts/deploy.sh) | Manual deployment script |

### CI/CD

| File | Purpose |
|------|---------|
| [.github/workflows/deploy.yml](.github/workflows/deploy.yml) | GitHub Actions automated deployment |

---

## 🚀 Architecture

### Components

```
Client → CDN → CloudFront
           ↓
         Nginx (SSL/TLS)
           ↓
         PHP-FPM
           ↓
PostgreSQL + Redis
           ↓
AWS S3 (File Storage)
AWS SES (Email)
CloudWatch (Monitoring)
```

### Docker Services

- **app**: PHP 8.4 + Laravel + Vite frontend (`fuzalov/bozor-app:latest` by default)
- **postgres**: PostgreSQL 16 database
- **redis**: Redis cache and queue
- **nginx**: Reverse proxy (configured via supervisord in app container)

---

## ✨ Key Features

✅ **Multi-stage Docker build** - Optimized image size
✅ **PostgreSQL + Redis** - Production-ready database and caching
✅ **AWS S3 integration** - Scalable file storage
✅ **AWS SES** - Reliable email delivery
✅ **GitHub Actions CI/CD** - Automated deployment on push
✅ **SSL/TLS ready** - Let's Encrypt support
✅ **Health checks** - Container health monitoring
✅ **Zero-downtime deployment** - Docker Compose orchestration
✅ **Automatic database migrations** - Migrations on deploy
✅ **Supervisor process management** - PHP-FPM, Nginx, Queue Worker, Scheduler

---

## 🎯 Deployment Workflow

### Automated (Recommended)

```
Local: git push origin main
         ↓
GitHub: Webhook triggers
         ↓
GitHub Actions:
  1. Build frontend (Vite)
  2. Build Docker image
  3. Push to ECR
  4. SSH deploy to EC2
  5. docker-compose up -d
  6. Run migrations
  7. Clear caches
         ↓
Production: App is live with new changes
```

### Manual

```bash
ssh ubuntu@<EC2_HOST>
cd /home/ubuntu/bozor
git pull origin main
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml exec app php artisan migrate --force
```

### Docker Hub

For manual Docker Hub deploys from Windows, use the helper script. It builds and pushes both `latest` and an immutable tag, uploads compose/Caddy config, updates only `APP_IMAGE` in the EC2 `.env`, and preserves production-only values such as `APP_DOMAIN`, DB credentials, and OAuth redirects.

```powershell
.\scripts\deploy-dockerhub.ps1
```

```bash
# Build and push from local checkout
docker compose -f docker-compose.prod.yml build app
docker compose -f docker-compose.prod.yml push app
docker tag fuzalov/bozor-app:latest fuzalov/bozor-app:<git-sha-or-release>
docker push fuzalov/bozor-app:<git-sha-or-release>

# Pull and run on the server
docker compose -f docker-compose.prod.yml pull app
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml exec app php artisan migrate --force
```

---

## 📋 Pre-Deployment Checklist

### AWS Account

- [ ] AWS account created
- [ ] IAM user created (`bozor-app`)
- [ ] Access keys generated
- [ ] S3 bucket created (`bozor-app-storage-prod`)
- [ ] ECR repository created (`bozor`)
- [ ] SES configured and domain verified

### GitHub

- [ ] Repository pushed to GitHub
- [ ] `.env.production` added to `.gitignore`
- [ ] SSH deploy key added (Settings → Deploy Keys)
- [ ] GitHub Secrets configured:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_ACCOUNT_ID`
  - `AWS_REGION`
  - `EC2_HOST`
  - `EC2_USER`
  - `EC2_SSH_KEY`

### AWS Infrastructure

- [ ] EC2 instance launched (Ubuntu 22.04 LTS, t3.medium+)
- [ ] Security group configured (allow 22, 80, 443)
- [ ] Domain DNS A record pointing to EC2 public IP
- [ ] SSL certificate generated (Let's Encrypt)

### EC2 Instance

- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] AWS CLI configured
- [ ] Repository cloned to `/home/ubuntu/bozor`
- [ ] `.env` configured with production values
- [ ] Database initialized with migrations
- [ ] Application verified at `https://yourdomain.com`

---

## 🔧 Common Tasks

### View Application Status

```bash
ssh ubuntu@<EC2_HOST>
cd /home/ubuntu/bozor
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f app
```

### Run Artisan Commands

```bash
docker-compose -f docker-compose.prod.yml exec app php artisan <command>
```

### Database Operations

```bash
# Connect to database
docker-compose -f docker-compose.prod.yml exec postgres psql -U bozor_user -d bozor_prod

# Create backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U bozor_user bozor_prod > backup.sql

# Restore backup
cat backup.sql | docker-compose -f docker-compose.prod.yml exec -T postgres psql -U bozor_user -d bozor_prod
```

### Deployment Troubleshooting

```bash
# Rebuild image
docker-compose -f docker-compose.prod.yml build --no-cache

# Restart services
docker-compose -f docker-compose.prod.yml restart

# View environment
docker-compose -f docker-compose.prod.yml config

# Prune unused images
docker system prune -a
```

---

## 🔐 Security Considerations

### Secrets Management

- **Never commit** `.env.production` to Git
- **Store credentials** in GitHub Secrets only
- **Rotate IAM keys** regularly
- **Use strong passwords** (20+ characters)
- **Enable CloudTrail** for AWS audit logging

### Network Security

- **Security Groups** restrict access (SSH from admin IP only)
- **SSL/TLS certificates** auto-renewed monthly
- **Firewall rules** on EC2 instance
- **AWS Secrets Manager** for sensitive config (optional)

### Application Security

- **CSRF protection** enabled by default
- **SQL injection** prevention via Eloquent ORM
- **XSS protection** via Blade templating
- **Rate limiting** configured in `config/rate-limit.php`
- **CORS** configured in `.env`

---

## 📊 Monitoring & Alerting

### CloudWatch

```bash
# View application logs
aws logs tail /aws/ec2/bozor-app --follow

# Create alarm for high CPU
aws cloudwatch put-metric-alarm \
  --alarm-name bozor-high-cpu \
  --alarm-description "Alert when CPU > 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

### Health Checks

Application health endpoint: `GET /health`

Returns: `healthy` with status 200

---

## 🚀 Scaling Recommendations

### For Increased Traffic

1. **Upgrade instance type**: `t3.medium` → `t3.large` → `m5.xlarge`
2. **Enable CloudFront** for static assets
3. **Add read replicas** for database
4. **Auto-scaling group** with load balancer (future)
5. **ElastiCache** for Redis (optional)
6. **CloudFlare** for DDoS protection

### Cost Optimization

- Use AWS Savings Plans for compute
- Enable S3 Intelligent-Tiering
- Archive old database backups to Glacier
- Right-size EC2 instance for actual usage
- Monitor CloudWatch for waste

---

## 📚 Documentation

- [Quick Start Guide](DEPLOYMENT_QUICK_START.md) - Follow this first!
- [AWS Deployment Guide](AWS_DEPLOYMENT.md) - Detailed infrastructure setup
- [Laravel Deployment](https://laravel.com/docs/deployment)
- [Docker Documentation](https://docs.docker.com)
- [GitHub Actions](https://docs.github.com/actions)

---

## 🆘 Support & Troubleshooting

See [DEPLOYMENT_QUICK_START.md#-troubleshooting](DEPLOYMENT_QUICK_START.md#-troubleshooting) for common issues.

For advanced troubleshooting, check:
- Docker logs: `docker-compose logs <service>`
- Laravel logs: `storage/logs/laravel.log`
- Nginx logs: `/var/log/nginx/error.log`
- PostgreSQL logs: Check container logs
- CloudWatch logs: AWS Console

---

## ✅ Next Steps

1. **Read** [DEPLOYMENT_QUICK_START.md](DEPLOYMENT_QUICK_START.md)
2. **Create** AWS infrastructure following the guide
3. **Configure** GitHub Secrets
4. **Deploy** first version to EC2
5. **Verify** application is running at your domain
6. **Monitor** application in production
7. **Setup** automated backups and monitoring
8. **Celebrate** 🎉

---

*Deployment infrastructure set up: May 24, 2026*
