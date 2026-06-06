param(
    [string]$ProjectName = "bozorlocal",
    [string]$ComposeFile = "docker-compose.local.yml",
    [string]$HttpPort = "",
    [string]$DbPort = ""
)

$ErrorActionPreference = "Stop"

if ($HttpPort) {
    $env:HTTP_PORT = $HttpPort
}

if ($DbPort) {
    $env:LOCAL_DB_PORT = $DbPort
}

Write-Host "Building and starting local Docker stack"
docker compose -p $ProjectName -f $ComposeFile up -d --build

Write-Host "Running local migrations"
docker compose -p $ProjectName -f $ComposeFile exec -T app php artisan migrate

Write-Host "Linking local storage"
docker compose -p $ProjectName -f $ComposeFile exec -T app php artisan storage:link

Write-Host "Verifying local deployment"
docker inspect bozor-app-local --format='{{.Config.Image}} {{.State.Health.Status}}'

$port = if ($env:HTTP_PORT) { $env:HTTP_PORT } else { "8080" }
Write-Host "Local app is running at http://localhost:$port"
