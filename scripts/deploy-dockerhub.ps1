param(
    [string]$HostName = "bazaarjapan.link",
    [string]$User = "ec2-user",
    [string]$KeyPath = "bozorkey.pem",
    [string]$RemoteDir = "/home/ec2-user",
    [string]$ImageRepo = "fuzalov/bozor-app",
    [string]$ImageTag = ""
)

$ErrorActionPreference = "Stop"

if (-not $ImageTag) {
    $shortSha = (git rev-parse --short HEAD).Trim()
    $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $ImageTag = "$shortSha-$stamp"
}

$image = "${ImageRepo}:${ImageTag}"
$latest = "${ImageRepo}:latest"
$remote = "${User}@${HostName}"
$backupStamp = Get-Date -Format "yyyyMMdd-HHmmss"

Write-Host "Building $latest"
docker compose -f docker-compose.prod.yml build app

Write-Host "Tagging $image"
docker tag $latest $image

Write-Host "Pushing $latest"
docker push $latest

Write-Host "Pushing $image"
docker push $image

Write-Host "Backing up remote deployment files"
ssh -i $KeyPath $remote "cd $RemoteDir && cp docker-compose.prod.yml docker-compose.prod.yml.backup-$backupStamp && cp .env .env.backup-$backupStamp && mkdir -p docker/caddy"

Write-Host "Uploading compose and Caddy config"
scp -i $KeyPath docker-compose.prod.yml "${remote}:${RemoteDir}/docker-compose.prod.yml"
scp -i $KeyPath docker/caddy/Caddyfile "${remote}:${RemoteDir}/docker/caddy/Caddyfile"

Write-Host "Pinning remote APP_IMAGE=$image"
ssh -i $KeyPath $remote "cd $RemoteDir && sed -i '/^APP_IMAGE=/d' .env && printf '\nAPP_IMAGE=$image\n' >> .env"

Write-Host "Pulling and recreating stack"
ssh -i $KeyPath $remote "cd $RemoteDir && docker-compose -f docker-compose.prod.yml pull app && docker-compose -f docker-compose.prod.yml up -d --force-recreate"

Write-Host "Running Laravel post-deploy commands"
ssh -i $KeyPath $remote "cd $RemoteDir && docker-compose -f docker-compose.prod.yml exec -T app php artisan migrate --force && docker-compose -f docker-compose.prod.yml exec -T app php artisan config:cache && docker-compose -f docker-compose.prod.yml exec -T app php artisan route:cache && docker-compose -f docker-compose.prod.yml exec -T app php artisan view:cache"

Write-Host "Verifying deployment"
ssh -i $KeyPath $remote "docker inspect bozor-app --format='{{.Config.Image}} {{.State.Health.Status}}'"
ssh -i $KeyPath $remote "curl -k -sS -o /dev/null -w '%{http_code}\n' https://bazaarjapan.link/health"

Write-Host "Deployed $image"
