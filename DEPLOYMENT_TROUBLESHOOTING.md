# AWS EC2 Docker Deployment Troubleshooting Guide

## 🔍 Debugging Steps

Always start with these basics:

```bash
# 1. SSH into EC2
ssh -i your-key.pem ubuntu@<EC2_HOST>

# 2. Check container status
cd /home/ubuntu/bozor
docker-compose -f docker-compose.prod.yml ps

# 3. View logs
docker-compose -f docker-compose.prod.yml logs -f app

# 4. Verify services are running
docker ps

# 5. Check disk space
df -h

# 6. Check memory usage
free -h
```

---

## 🚫 Common Issues & Solutions

### 1. Container Won't Start

**Error Message:**
```
ERROR: Service 'app' failed to build
```

**Debugging:**
```bash
# View full build logs
docker-compose -f docker-compose.prod.yml build --no-cache

# Try to run container manually
docker run -it bozor:latest bash
```

**Common Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| **Old Docker image** | `docker-compose -f docker-compose.prod.yml build --no-cache` |
| **Missing environment variables** | Check `.env` file: `docker-compose -f docker-compose.prod.yml config` |
| **Insufficient disk space** | Run `docker system prune -a` to free space |
| **npm/composer install failed** | Rebuild: `docker-compose -f docker-compose.prod.yml build` |
| **Port already in use** | Change ports in `docker-compose.prod.yml` or kill: `sudo lsof -i :80` |

---

### 2. Database Connection Errors

**Error Message:**
```
SQLSTATE[08006] [7] could not connect to server
```

**Debugging:**
```bash
# Check if PostgreSQL is running
docker-compose -f docker-compose.prod.yml ps postgres

# Test connection
docker-compose -f docker-compose.prod.yml exec app ping postgres

# Check logs
docker-compose -f docker-compose.prod.yml logs postgres

# Verify environment variables
docker-compose -f docker-compose.prod.yml exec app env | grep DB_
```

**Common Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| **PostgreSQL not running** | `docker-compose -f docker-compose.prod.yml up -d postgres` |
| **Wrong credentials** | Update `DB_USERNAME` and `DB_PASSWORD` in `.env` |
| **Wrong host** | Ensure `DB_HOST=postgres` (not localhost or IP) |
| **Missing DB_DATABASE** | Check `.env` - should be `bozor_prod` or similar |
| **Port conflict** | Change PostgreSQL port in `docker-compose.prod.yml` |

**Solution Steps:**
```bash
# 1. Stop all containers
docker-compose -f docker-compose.prod.yml down

# 2. Remove volumes to reset database
docker volume rm bozor_postgres_data

# 3. Update .env with correct credentials
nano .env

# 4. Restart services
docker-compose -f docker-compose.prod.yml up -d

# 5. Run migrations
docker-compose -f docker-compose.prod.yml exec app php artisan migrate --force
```

---

### 3. 502 Bad Gateway Error

**What it means:** Nginx can't connect to PHP-FPM

**Debugging:**
```bash
# Check Nginx logs
docker-compose -f docker-compose.prod.yml exec app tail -f /var/log/nginx/error.log

# Check PHP-FPM status
docker-compose -f docker-compose.prod.yml exec app ps aux | grep php

# Check process supervisor
docker-compose -f docker-compose.prod.yml exec app supervisorctl status
```

**Common Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| **PHP-FPM crashed** | `docker-compose -f docker-compose.prod.yml restart app` |
| **Out of memory** | Increase `mem_limit` in `docker-compose.prod.yml` or upgrade instance |
| **File permissions** | Fix: `docker-compose -f docker-compose.prod.yml exec app chown -R www-data:www-data /var/www/html` |
| **Too many processes** | Reduce worker count in `docker/supervisor/supervisord.conf` |

**Fix:**
```bash
# Restart container
docker-compose -f docker-compose.prod.yml restart app

# Check if it stays running
sleep 5 && docker-compose -f docker-compose.prod.yml ps app

# View logs to see error
docker-compose -f docker-compose.prod.yml logs -f app
```

---

### 4. File Upload Failures

**Error Message:**
```
The upload failed with error: Disk "s3" does not have a configured driver
```

**Debugging:**
```bash
# Check S3 environment variables
docker-compose -f docker-compose.prod.yml exec app env | grep AWS_

# Test S3 connection
docker-compose -f docker-compose.prod.yml exec app \
  php artisan tinker --execute="Storage::disk('s3')->listContents('/');"

# Check Laravel filesystem config
docker-compose -f docker-compose.prod.yml exec app cat config/filesystems.php
```

**Common Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| **AWS credentials invalid** | Regenerate and update `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` |
| **S3 bucket doesn't exist** | Create bucket in AWS console or via CLI |
| **Bucket permissions** | Verify IAM user has S3 permissions |
| **Wrong region** | Ensure `AWS_DEFAULT_REGION` matches bucket region |
| **`FILESYSTEM_DISK` not set to s3** | Add to `.env`: `FILESYSTEM_DISK=s3` |

**Fix:**
```bash
# 1. Verify AWS credentials
docker-compose -f docker-compose.prod.yml exec app \
  php -r 'echo getenv("AWS_BUCKET");'

# 2. Test S3 access
aws s3 ls s3://bozor-app-storage-prod/ --region us-east-1

# 3. Restart container
docker-compose -f docker-compose.prod.yml restart app

# 4. Test upload
curl -X POST http://localhost/api/upload -F "file=@test.txt"
```

---

### 5. Email Not Sending

**Error:** Emails not delivered or silent failures

**Debugging:**
```bash
# Check mail configuration
docker-compose -f docker-compose.prod.yml exec app \
  php artisan config:show mail

# Check SES configuration
docker-compose -f docker-compose.prod.yml exec app env | grep MAIL_

# Send test email
docker-compose -f docker-compose.prod.yml exec app \
  php artisan tinker --execute="Mail::raw('Test', function(\$message) { \$message->to('test@example.com'); });"

# Check Laravel logs
docker-compose -f docker-compose.prod.yml exec app tail -f storage/logs/laravel.log | grep -i mail
```

**Common Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| **SES not verified** | Verify sender domain in AWS SES console |
| **Wrong credentials** | Check `MAIL_FROM_ADDRESS` is verified in SES |
| **Sandbox mode** | Request production access in SES console |
| **Rate limit exceeded** | SES has sending limits; verify quota |
| **Wrong region** | Ensure `AWS_SES_REGION` matches where domain is verified |

**Fix:**
```bash
# 1. Verify SES sender
aws ses verify-email-identity --email-address noreply@yourdomain.com

# 2. Update .env
MAIL_MAILER=ses
MAIL_FROM_ADDRESS=noreply@yourdomain.com
AWS_SES_REGION=us-east-1

# 3. Restart container
docker-compose -f docker-compose.prod.yml restart app

# 4. Test again
docker-compose -f docker-compose.prod.yml exec app php artisan tinker
```

---

### 6. Out of Disk Space

**Error:**
```
No space left on device
```

**Debugging:**
```bash
# Check disk usage
df -h

# Find large files
du -sh /var/lib/docker/*

# List Docker volumes
docker volume ls
```

**Solutions:**

```bash
# Clean up unused images and containers
docker system prune -a

# Remove specific volume
docker volume rm bozor_postgres_data

# Resize volume (requires EC2 stop/restart)
# See AWS documentation for EBS volume resize

# Check application logs size
du -sh /home/ubuntu/bozor/storage/logs

# Clear old logs
rm /home/ubuntu/bozor/storage/logs/laravel-*.log
```

---

### 7. GitHub Actions Deployment Fails

**Error in Actions workflow**

**Debugging:**
```bash
# Check GitHub Actions logs in:
# GitHub repo → Actions → Click failed workflow → Click job → View logs

# Common errors:

# "Permission denied (publickey)"
# → Check EC2_SSH_KEY secret is correct PEM file

# "Unknown host"
# → Check EC2_HOST is correct public IP/DNS

# "docker: command not found"
# → Docker not installed on EC2 - run setup script

# "out of memory"
# → Upgrade EC2 instance type or increase memory limit
```

**Fix:**
```bash
# Re-run failed workflow:
# GitHub → Actions → Failed workflow → Re-run jobs

# Or push again to trigger:
git commit --allow-empty -m "Retry deployment"
git push origin main
```

---

### 8. SSL Certificate Issues

**Error:**
```
ERR_SSL_PROTOCOL_ERROR or Mixed Content blocked
```

**Debugging:**
```bash
# Check certificate expiry
sudo openssl s_client -connect localhost:443 -showcerts < /dev/null

# Check Nginx logs
docker-compose -f docker-compose.prod.yml exec app \
  tail -f /var/log/nginx/error.log
```

**Common Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| **Certificate expired** | Renew: `sudo certbot renew --force-renewal` |
| **Wrong domain** | Regenerate with correct domain |
| **Certificate path wrong in nginx.conf** | Update docker/nginx/default.conf paths |
| **Not mounting /etc/letsencrypt** | Add volume to docker-compose.prod.yml |

**Fix:**
```bash
# 1. Renew certificate
sudo certbot renew

# 2. Restart Nginx
docker-compose -f docker-compose.prod.yml restart app

# 3. Test SSL
curl -I https://yourdomain.com
```

---

### 9. Queue Worker Not Processing Jobs

**Error:** Jobs stuck in queue

**Debugging:**
```bash
# Check worker status
docker-compose -f docker-compose.prod.yml exec app supervisorctl status

# Check queue
docker-compose -f docker-compose.prod.yml exec app \
  php artisan queue:failed

# Check logs
docker-compose -f docker-compose.prod.yml exec app \
  tail -f storage/logs/laravel-*.log | grep -i queue

# Check Redis connection
docker-compose -f docker-compose.prod.yml exec app \
  redis-cli -h redis ping
```

**Common Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| **Worker not running** | `docker-compose -f docker-compose.prod.yml exec app supervisorctl start laravel-worker:*` |
| **Redis not accessible** | `docker-compose -f docker-compose.prod.yml exec app ping redis` |
| **Jobs failing silently** | Check Laravel logs, increase verbosity |
| **Memory leak** | Restart worker: `supervisorctl restart laravel-worker:*` |

---

### 10. Laravel Scheduler Not Running

**Error:** Scheduled tasks not executing

**Debugging:**
```bash
# Check scheduler running
docker-compose -f docker-compose.prod.yml exec app supervisorctl status laravel-scheduler

# Check logs
docker-compose -f docker-compose.prod.yml exec app \
  tail -f storage/logs/laravel-*.log | grep -i schedule

# Test manually
docker-compose -f docker-compose.prod.yml exec app php artisan schedule:run
```

**Fix:**
```bash
# Ensure cron is installed
docker-compose -f docker-compose.prod.yml exec app \
  apk add --no-cache dcron

# Restart scheduler
docker-compose -f docker-compose.prod.yml exec app \
  supervisorctl restart laravel-scheduler
```

---

## 🆘 Advanced Debugging

### Interactive Bash Shell

```bash
# Get shell in running container
docker-compose -f docker-compose.prod.yml exec app bash

# Once inside, you can run:
php artisan tinker
laravel new --help
composer show
npm list
```

### Monitor Real-Time Events

```bash
# Watch containers
watch 'docker-compose -f docker-compose.prod.yml ps'

# Monitor resource usage
docker stats

# Real-time logs (all services)
docker-compose -f docker-compose.prod.yml logs -f
```

### Capture Full Application State

```bash
# Export complete diagnostics
mkdir diagnostic_report
docker-compose -f docker-compose.prod.yml logs > diagnostic_report/logs.txt
docker-compose -f docker-compose.prod.yml ps > diagnostic_report/containers.txt
df -h > diagnostic_report/disk.txt
free -h > diagnostic_report/memory.txt
docker images > diagnostic_report/images.txt
```

---

## 📞 Getting Help

1. **Check logs first** - Always start with `docker-compose logs`
2. **Search GitHub Issues** - Your problem may be solved already
3. **Read error messages carefully** - They usually indicate the problem
4. **Try the minimal reproduction** - Test in isolation
5. **Check AWS documentation** - For cloud-specific issues

---

## 🔄 Emergency Procedures

### Rollback to Previous Version

```bash
# If current deployment breaks production
cd /home/ubuntu/bozor

# Stop current containers
docker-compose -f docker-compose.prod.yml down

# Restore previous code
git checkout HEAD~1

# Restart
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### Database Emergency Restore

```bash
# If database is corrupted
cd /home/ubuntu/bozor

# Restore from backup
docker-compose -f docker-compose.prod.yml exec postgres \
  psql -U bozor_user bozor_prod < backup_latest.sql
```

### Full Application Reset

```bash
# Complete system reset (WARNING: Deletes all data)
docker-compose -f docker-compose.prod.yml down -v  # -v removes volumes
docker volume prune -f
docker image prune -a -f
docker system prune -a -f

# Rebuild and restart
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

---

**Remember:** When in doubt, check the logs! 📋

*Last updated: May 2026*
