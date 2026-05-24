#!/bin/bash
set -e

echo "🚀 Setting up Bozor EC2 deployment..."

# Variables
DEPLOY_DIR="/home/ubuntu/bozor"
APP_USER="ubuntu"
REPO_URL="https://github.com/yourusername/bozor.git"

# Update system
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $APP_USER

# Install Docker Compose
echo "🔧 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install AWS CLI
echo "☁️  Installing AWS CLI..."
sudo apt-get install -y awscli

# Install Git
echo "📝 Installing Git..."
sudo apt-get install -y git

# Create deployment directory
echo "📁 Creating deployment directory..."
sudo mkdir -p $DEPLOY_DIR
sudo chown -R $APP_USER:$APP_USER $DEPLOY_DIR

# Clone repository
echo "📥 Cloning repository..."
cd $DEPLOY_DIR
git clone $REPO_URL .

# Create necessary directories
echo "🔨 Creating application directories..."
mkdir -p storage/app storage/logs bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Copy environment file
echo "⚙️  Setting up environment..."
if [ ! -f .env ]; then
    cp .env.production.example .env
    echo "⚠️  Please update .env with your production values"
fi

# Create docker volumes
echo "📦 Creating Docker volumes..."
docker volume create bozor_postgres_data
docker volume create bozor_redis_data

# Create .dockerignore if needed
cat > .dockerignore << 'EOF'
.git
.gitignore
.env.*.php
.env.*.example
node_modules
vendor
storage/logs/*
bootstrap/cache/*
*.md
.editorconfig
EOF

# Create deployment config directory
mkdir -p /etc/bozor
sudo chown -R $APP_USER:$APP_USER /etc/bozor

echo "✅ EC2 setup complete!"
echo ""
echo "Next steps:"
echo "1. Update /home/$APP_USER/bozor/.env with production values"
echo "2. Configure AWS credentials: aws configure"
echo "3. Pull Docker image and start containers:"
echo "   docker-compose -f docker-compose.prod.yml up -d"
echo "4. Run migrations: docker-compose -f docker-compose.prod.yml exec app php artisan migrate --force"
echo "5. Set up SSL with Certbot: sudo apt-get install certbot python3-certbot-nginx"
