#!/bin/bash
set -e

# Deployment script for manual deployment to EC2
# Usage: ./scripts/deploy.sh <environment>

ENVIRONMENT=${1:-production}
DEPLOY_HOST=${EC2_HOST:-your-ec2-instance.compute.amazonaws.com}
DEPLOY_USER=${EC2_USER:-ubuntu}
DEPLOY_KEY=${EC2_KEY:-~/.ssh/bozor-deploy-key.pem}
APP_DIR="/home/$DEPLOY_USER/bozor"

echo "🚀 Deploying Bozor to $ENVIRONMENT..."

# Build frontend assets
echo "📦 Building frontend assets..."
npm run build

# Create deployment package
echo "📦 Creating deployment package..."
DEPLOY_PACKAGE="bozor-$(date +%s).tar.gz"
tar --exclude-from=.gitignore \
    --exclude=.git \
    --exclude=node_modules \
    --exclude=vendor \
    --exclude=.env \
    --exclude=storage/logs/* \
    --exclude=bootstrap/cache/* \
    -czf "$DEPLOY_PACKAGE" .

# Transfer to EC2
echo "📤 Uploading to EC2..."
scp -i "$DEPLOY_KEY" "$DEPLOY_PACKAGE" "$DEPLOY_USER@$DEPLOY_HOST:$APP_DIR/"

# Extract and deploy
echo "⚙️  Deploying on EC2..."
ssh -i "$DEPLOY_KEY" "$DEPLOY_USER@$DEPLOY_HOST" << EOF
  set -e
  cd $APP_DIR
  
  # Backup current version
  if [ -d current ]; then
    echo "💾 Backing up current version..."
    sudo mv current "backups/bozor-\$(date +%Y%m%d-%H%M%S)" || true
  fi
  
  # Extract new version
  tar -xzf "$DEPLOY_PACKAGE"
  
  # Load environment
  export \$(grep -v '^#' .env | xargs)
  
  # Refresh containers
  docker-compose -f docker-compose.prod.yml down || true
  docker-compose -f docker-compose.prod.yml up -d
  
  # Run migrations
  docker-compose -f docker-compose.prod.yml exec -T app php artisan migrate --force
  
  # Clear caches
  docker-compose -f docker-compose.prod.yml exec -T app php artisan config:cache
  docker-compose -f docker-compose.prod.yml exec -T app php artisan route:cache
  docker-compose -f docker-compose.prod.yml exec -T app php artisan view:cache
  
  # Cleanup
  rm "$DEPLOY_PACKAGE"
  
  echo "✅ Deployment complete!"
EOF

# Cleanup
rm "$DEPLOY_PACKAGE"

echo "✅ Deployment finished!"
