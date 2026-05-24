# AWS EC2 Docker Deployment Guide for Bozor

This guide walks you through deploying the Bozor Laravel + React application to AWS EC2 using Docker.

## Table of Contents

1. [AWS Infrastructure Setup](#aws-infrastructure-setup)
2. [EC2 Instance Setup](#ec2-instance-setup)
3. [Docker Configuration](#docker-configuration)
4. [GitHub Actions CI/CD](#github-actions-cicd)
5. [DNS & SSL Setup](#dns--ssl-setup)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## AWS Infrastructure Setup

### 1. Create S3 Bucket for Application Storage

```bash
# Create bucket
aws s3 mb s3://bozor-app-storage-prod --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket bozor-app-storage-prod \
  --versioning-configuration Status=Enabled

# Block public access (security)
aws s3api put-public-access-block \
  --bucket bozor-app-storage-prod \
  --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Enable CORS for image serving
cat > /tmp/cors.json << 'EOF'
{
  "CORSRules": [{
    "AllowedOrigins": ["https://yourdomain.com"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }]
}
EOF
aws s3api put-bucket-cors --bucket bozor-app-storage-prod --cors-configuration file:///tmp/cors.json
```

### 2. Create RDS PostgreSQL Database (Optional - Alternative to Docker PostgreSQL)

If you want to use AWS RDS instead of Docker PostgreSQL:

```bash
aws rds create-db-instance \
  --db-instance-identifier bozor-postgres \
  --db-instance-class db.t4g.micro \
  --engine postgres \
  --engine-version 16.1 \
  --master-username bozor_user \
  --master-user-password 'YourSecurePassword123!' \
  --allocated-storage 20 \
  --storage-type gp3 \
  --publicly-accessible false \
  --vpc-security-group-ids sg-xxxxxxxxx \
  --region us-east-1
```

### 3. Create IAM User for Application

```bash
# Create user
aws iam create-user --user-name bozor-app

# Create access keys
aws iam create-access-key --user-name bozor-app

# Attach policy for S3 access
aws iam put-user-policy --user-name bozor-app --policy-name S3Access --policy-document '{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:*"],
    "Resource": [
      "arn:aws:s3:::bozor-app-storage-prod",
      "arn:aws:s3:::bozor-app-storage-prod/*"
    ]
  }]
}'

# Attach policy for SES (email)
aws iam put-user-policy --user-name bozor-app --policy-name SESAccess --policy-document '{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "ses:*",
    "Resource": "*"
  }]
}'
```

### 4. Create ECR Repository

```bash
aws ecr create-repository \
  --repository-name bozor \
  --image-tag-mutability MUTABLE \
  --region us-east-1
```

---

## EC2 Instance Setup

### 1. Launch EC2 Instance

```bash
# Create key pair
aws ec2 create-key-pair \
  --key-name bozor-deploy-key \
  --query 'KeyMaterial' \
  --output text > bozor-deploy-key.pem
chmod 400 bozor-deploy-key.pem

# Create security group
SECURITY_GROUP=$(aws ec2 create-security-group \
  --group-name bozor-sg \
  --description "Bozor application security group" \
  --query 'GroupId' \
  --output text)

# Allow SSH
aws ec2 authorize-security-group-ingress \
  --group-id $SECURITY_GROUP \
  --protocol tcp --port 22 \
  --cidr 0.0.0.0/0

# Allow HTTP
aws ec2 authorize-security-group-ingress \
  --group-id $SECURITY_GROUP \
  --protocol tcp --port 80 \
  --cidr 0.0.0.0/0

# Allow HTTPS
aws ec2 authorize-security-group-ingress \
  --group-id $SECURITY_GROUP \
  --protocol tcp --port 443 \
  --cidr 0.0.0.0/0

# Launch instance (Ubuntu 22.04 LTS)
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.medium \
  --key-name bozor-deploy-key \
  --security-group-ids $SECURITY_GROUP \
  --associate-public-ip-address \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=Bozor-Production}]' \
  --region us-east-1
```

### 2. Connect to EC2 Instance

```bash
# SSH into instance
ssh -i bozor-deploy-key.pem ubuntu@<ec2-public-ip>
```

### 3. Install Docker and Docker Compose

```bash
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 4. Install AWS CLI

```bash
sudo apt install -y awscli

# Configure AWS credentials
aws configure
# Enter your IAM user credentials (AWS Access Key ID and Secret Access Key)
```

### 5. Clone Application Repository

```bash
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/bozor.git
cd bozor

# Create environment file
cp .env.production.example .env.production

# Edit with your production values
nano .env.production
```

### 6. Create .dockerignore File

Create a `.dockerignore` file to optimize Docker builds:

```dockerfile
node_modules
vendor
.git
.gitignore
.env
.env.*
!.env.production.example
storage/logs/*
bootstrap/cache/*
*.md
.github
tests
docker-compose.yaml
Dockerfile.prod
node_modules/
```

---

## Docker Configuration

### 1. Update composer.json for S3 Filesystem

Your `composer.json` already includes Laravel Framework which supports S3 out of the box through the `league/flysystem-aws-s3-v3` package. Add it if not present:

```bash
composer require league/flysystem-aws-s3-v3
```

### 2. Configure Laravel Filesystem

Update `config/filesystems.php`:

```php
'disks' => [
    // ... other disks ...
    
    's3' => [
        'driver' => 's3',
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
        'bucket' => env('AWS_BUCKET'),
        'url' => env('AWS_URL'),
        'endpoint' => env('AWS_ENDPOINT'),
        'use_path_style_endpoint' => false,
    ],
],
```

### 3. Build and Start Containers

```bash
cd /home/ubuntu/bozor

# Build the Docker image
docker-compose -f docker-compose.prod.yml build

# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f app
```

### 4. Initialize Database

```bash
# Run migrations
docker-compose -f docker-compose.prod.yml exec app php artisan migrate --force

# Seed database (if needed)
docker-compose -f docker-compose.prod.yml exec app php artisan db:seed

# Create storage link
docker-compose -f docker-compose.prod.yml exec app php artisan storage:link
```

---

## GitHub Actions CI/CD

### 1. Configure GitHub Secrets

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

```
AWS_ACCESS_KEY_ID          # From AWS IAM user
AWS_SECRET_ACCESS_KEY      # From AWS IAM user
AWS_ACCOUNT_ID             # Your AWS account ID (12 digits)
ECR_REPOSITORY             # bozor (or your repo name)
EC2_SSH_KEY                # Contents of bozor-deploy-key.pem
EC2_HOST                   # Public IP or DNS of EC2 instance
EC2_USER                   # ubuntu (default for Ubuntu AMI)
SLACK_WEBHOOK              # (Optional) For deployment notifications
```

### 2. How It Works

The GitHub Actions workflow:

1. **Triggers** on push to `main` or `production` branches
2. **Builds** Docker image from your Dockerfile.prod
3. **Pushes** image to Amazon ECR
4. **Deploys** to EC2 by:
   - SSHing into the instance
   - Pulling the latest image from ECR
   - Running `docker-compose up -d` to start/update containers
   - Running database migrations
   - Clearing caches
5. **Notifies** Slack of success/failure (if webhook configured)

### 3. Manual Deployment

If you need to deploy manually:

```bash
# SSH into EC2
ssh -i bozor-deploy-key.pem ubuntu@<ec2-public-ip>

cd /home/ubuntu/bozor

# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml exec app php artisan migrate --force
```

---

## DNS & SSL Setup

### 1. Point Domain to EC2

1. Go to your domain registrar (Route53, Namecheap, etc.)
2. Create an A record pointing to your EC2's public IP
3. Wait for DNS propagation (5-30 minutes)

### 2. SSL Certificate with Let's Encrypt

```bash
ssh -i bozor-deploy-key.pem ubuntu@<ec2-public-ip>

# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate certificate (replace with your domain)
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Update Nginx config (docker/nginx/default.conf)
# Add SSL configuration
```

Update [docker/nginx/default.conf](docker/nginx/default.conf):

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # ... rest of configuration
}
```

Mount certificates in [docker-compose.prod.yml](docker-compose.prod.yml):

```yaml
app:
  volumes:
    - /etc/letsencrypt:/etc/letsencrypt:ro
    # ... other volumes
```

### 3. Auto-Renew Certificates

```bash
# Edit crontab
sudo crontab -e

# Add renewal job
0 3 * * * certbot renew --quiet && docker-compose -f /home/ubuntu/bozor/docker-compose.prod.yml restart app
```

---

## Monitoring & Maintenance

### 1. Check Application Health

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f app

# Check running containers
docker-compose -f docker-compose.prod.yml ps

# Check disk space
df -h

# Check memory/CPU
docker stats

# Check database
docker-compose -f docker-compose.prod.yml exec postgres psql -U bozor_user -d bozor_prod
```

### 2. Database Backups

```bash
# Create backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U bozor_user bozor_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Upload to S3
aws s3 cp backup_*.sql s3://bozor-app-backups/

# Automated daily backup
echo "0 2 * * * cd /home/ubuntu/bozor && docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U bozor_user bozor_prod | aws s3 cp - s3://bozor-app-backups/backup_\$(date +\%Y\%m\%d_\%H\%M\%S).sql" | sudo crontab -
```

### 3. Update Application

```bash
cd /home/ubuntu/bozor

# Pull latest code
git pull origin main

# Rebuild image
docker-compose -f docker-compose.prod.yml build

# Restart containers
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec app php artisan migrate --force
```

### 4. View Laravel Logs

```bash
# Real-time logs
docker-compose -f docker-compose.prod.yml exec app tail -f storage/logs/laravel.log

# Or use Tail from AWS CloudWatch
aws logs tail /ecs/bozor-app --follow
```

### 5. Restart Services

```bash
# Restart all containers
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart app

# Stop all
docker-compose -f docker-compose.prod.yml down

# Start all
docker-compose -f docker-compose.prod.yml up -d
```

---

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs app

# Rebuild without cache
docker-compose -f docker-compose.prod.yml build --no-cache
```

### Database connection errors

```bash
# Check PostgreSQL is running
docker-compose -f docker-compose.prod.yml ps postgres

# Check network connectivity
docker-compose -f docker-compose.prod.yml exec app ping postgres

# Verify environment variables
docker-compose -f docker-compose.prod.yml config
```

### Out of disk space

```bash
# Clean up Docker images
docker system prune -a

# Remove dangling volumes
docker volume prune
```

### Memory issues

```bash
# Increase instance type
# Stop container → Stop instance → Change instance type → Start instance

# Or increase container memory limits in docker-compose.prod.yml:
app:
  mem_limit: 1g
```

---

## Security Best Practices

- ✅ Never commit `.env.production` to Git - only commit `.env.production.example`
- ✅ Use strong passwords for database and IAM users
- ✅ Enable AWS CloudTrail for audit logging
- ✅ Use Security Groups to restrict access
- ✅ Enable automatic SSL certificate renewal
- ✅ Keep Docker images updated
- ✅ Regularly backup database to S3
- ✅ Monitor CloudWatch logs and set up alarms
- ✅ Implement rate limiting and DDoS protection (CloudFlare)
- ✅ Use AWS Secrets Manager for sensitive data

---

## Next Steps

1. Create AWS S3 bucket and ECR repository
2. Launch EC2 instance and configure Docker
3. Add GitHub Secrets for CI/CD
4. Push code to trigger first deployment
5. Configure DNS and SSL
6. Set up monitoring and backups

For questions, refer to:
- [Docker Documentation](https://docs.docker.com)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Laravel Deployment Guide](https://laravel.com/docs/deployment)
