param(
    [Parameter(Mandatory = $true)]
    [string]$HostName,
    [Parameter(Mandatory = $true)]
    [string]$AppImage,
    [string]$User = "ubuntu",
    [string]$KeyPath = "C:\Users\denta\source\repos\LightsailDefaultKey-ap-northeast-1.pem",
    [string]$RemoteDir = "/home/ubuntu/bozor",
    [string]$ComposeFile = "docker-compose.lightsail.yml",
    [string]$RemoteEnvFile = ".env",
    [string]$ComposeProjectName = "bozor",
    [string]$HealthUrl = "http://127.0.0.1:8088/health"
)

$ErrorActionPreference = "Stop"

function Invoke-CheckedNative {
    param(
        [string]$Description,
        [scriptblock]$Command
    )

    & $Command

    if ($LASTEXITCODE -ne 0) {
        throw "$Description failed with exit code $LASTEXITCODE"
    }
}

$remote = "${User}@${HostName}"

Invoke-CheckedNative "Prepare Lightsail deployment directories" {
    ssh -i $KeyPath -o StrictHostKeyChecking=no $remote "mkdir -p $RemoteDir $RemoteDir/docker/nginx $RemoteDir/docker/supervisor"
}

Invoke-CheckedNative "Upload Lightsail compose file" {
    scp -i $KeyPath $ComposeFile "${remote}:${RemoteDir}/$ComposeFile"
}

Invoke-CheckedNative "Upload nginx runtime config" {
    scp -i $KeyPath docker/nginx/default.conf "${remote}:${RemoteDir}/docker/nginx/default.conf"
}

Invoke-CheckedNative "Upload supervisor runtime config" {
    scp -i $KeyPath docker/supervisor/supervisord.conf "${remote}:${RemoteDir}/docker/supervisor/supervisord.conf"
}

Invoke-CheckedNative "Pin existing production image" {
    ssh -i $KeyPath -o StrictHostKeyChecking=no $remote "cd $RemoteDir && touch $RemoteEnvFile && sed -i '/^APP_IMAGE=/d' $RemoteEnvFile && printf '\nAPP_IMAGE=$AppImage\n' >> $RemoteEnvFile"
}

Invoke-CheckedNative "Start Lightsail stack from existing image" {
    ssh -i $KeyPath -o StrictHostKeyChecking=no $remote "cd $RemoteDir && docker compose --env-file $RemoteEnvFile -p $ComposeProjectName -f $ComposeFile pull app && docker compose --env-file $RemoteEnvFile -p $ComposeProjectName -f $ComposeFile up -d --force-recreate"
}

Invoke-CheckedNative "Run Laravel cache warmup" {
    ssh -i $KeyPath -o StrictHostKeyChecking=no $remote "cd $RemoteDir && docker compose --env-file $RemoteEnvFile -p $ComposeProjectName -f $ComposeFile exec -T app php artisan config:cache && docker compose --env-file $RemoteEnvFile -p $ComposeProjectName -f $ComposeFile exec -T app php artisan route:cache && docker compose --env-file $RemoteEnvFile -p $ComposeProjectName -f $ComposeFile exec -T app php artisan view:cache"
}

Invoke-CheckedNative "Verify Lightsail app health" {
    ssh -i $KeyPath -o StrictHostKeyChecking=no $remote "docker inspect bozor-app --format='{{.Config.Image}} {{.State.Health.Status}}' && curl -sS -o /dev/null -w '%{http_code}\n' $HealthUrl"
}

Write-Host "Started $AppImage on $HostName"
