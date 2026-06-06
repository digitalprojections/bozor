param(
    [string]$HostName = "bazaarjapan.link",
    [string]$User = "ec2-user",
    [string]$KeyPath = "bozorkey.pem",
    [string]$RemoteDir = "/home/ec2-user",
    [string]$ImageRepo = "fuzalov/bozor-app",
    [string]$ImageTag = "",
    [string]$EnvironmentName = "production",
    [string]$ComposeFile = "docker-compose.prod.yml",
    [string]$RemoteEnvFile = ".env",
    [string]$ComposeProjectName = "bozor",
    [string]$AppContainerName = "bozor-app",
    [string]$HealthUrl = "https://bazaarjapan.link/health",
    [string]$PublicNetworkName = "bozor-public",
    [switch]$SkipRemoteImagePrune,
    [switch]$UploadCaddyConfig
)

$ErrorActionPreference = "Stop"

if (-not $ImageTag) {
    $shortSha = (git rev-parse --short HEAD).Trim()
    $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $ImageTag = "$shortSha-$stamp"
}

$image = "${ImageRepo}:${ImageTag}"
$latestTag = if ($EnvironmentName -eq "production") { "latest" } else { $EnvironmentName }
$latest = "${ImageRepo}:${latestTag}"
$remote = "${User}@${HostName}"
$backupStamp = Get-Date -Format "yyyyMMdd-HHmmss"

Write-Host "Building $latest"
$previousAppImage = $env:APP_IMAGE
$env:APP_IMAGE = $latest
try {
    docker compose -f $ComposeFile build app
}
finally {
    if ($null -eq $previousAppImage) {
        Remove-Item Env:\APP_IMAGE -ErrorAction SilentlyContinue
    } else {
        $env:APP_IMAGE = $previousAppImage
    }
}

Write-Host "Tagging $image"
docker tag $latest $image

Write-Host "Pushing $latest"
docker push $latest

Write-Host "Pushing $image"
docker push $image

Write-Host "Backing up remote deployment files"
ssh -i $KeyPath $remote "mkdir -p $RemoteDir && cd $RemoteDir && if [ -f $ComposeFile ]; then cp $ComposeFile $ComposeFile.backup-$backupStamp; fi && if [ -f $RemoteEnvFile ]; then cp $RemoteEnvFile $RemoteEnvFile.backup-$backupStamp; fi && mkdir -p docker/caddy"

Write-Host "Uploading compose and Caddy config"
scp -i $KeyPath $ComposeFile "${remote}:${RemoteDir}/$ComposeFile"
if ($UploadCaddyConfig) {
    scp -i $KeyPath docker/caddy/Caddyfile "${remote}:${RemoteDir}/docker/caddy/Caddyfile"
}

Write-Host "Pinning remote APP_IMAGE=$image"
ssh -i $KeyPath $remote "cd $RemoteDir && touch $RemoteEnvFile && sed -i '/^APP_IMAGE=/d' $RemoteEnvFile && printf '\nAPP_IMAGE=$image\n' >> $RemoteEnvFile"

if (-not $SkipRemoteImagePrune) {
    Write-Host "Pruning unused remote Docker images before pull"
    ssh -i $KeyPath $remote "docker image prune -a -f && df -h /"
}

Write-Host "Pulling and recreating stack"
ssh -i $KeyPath $remote "docker network create $PublicNetworkName 2>/dev/null || true && cd $RemoteDir && docker-compose --env-file $RemoteEnvFile -p $ComposeProjectName -f $ComposeFile pull app && docker-compose --env-file $RemoteEnvFile -p $ComposeProjectName -f $ComposeFile up -d --force-recreate"

Write-Host "Running Laravel post-deploy commands"
ssh -i $KeyPath $remote "cd $RemoteDir && docker-compose --env-file $RemoteEnvFile -p $ComposeProjectName -f $ComposeFile exec -T app php artisan migrate --force && docker-compose --env-file $RemoteEnvFile -p $ComposeProjectName -f $ComposeFile exec -T app php artisan config:cache && docker-compose --env-file $RemoteEnvFile -p $ComposeProjectName -f $ComposeFile exec -T app php artisan route:cache && docker-compose --env-file $RemoteEnvFile -p $ComposeProjectName -f $ComposeFile exec -T app php artisan view:cache"

Write-Host "Verifying deployment"
ssh -i $KeyPath $remote "docker inspect $AppContainerName --format='{{.Config.Image}} {{.State.Health.Status}}'"
ssh -i $KeyPath $remote "curl -k -sS -o /dev/null -w '%{http_code}\n' $HealthUrl"

Write-Host "Deployed $image"
