param([string]$Image = 'bozor-app-local:1.0.2')
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
$inspection = docker inspect bozor-app | ConvertFrom-Json
if ($LASTEXITCODE -ne 0) { throw 'The existing bozor-app test container is required.' }
$current = @{}
foreach ($entry in $inspection[0].Config.Env) {
    $parts = $entry.Split('=', 2)
    if ($parts[0] -match '^(APP_|DB_|MAIL_|AWS_|GOOGLE_|SESSION_|CACHE_|REDIS_|LOG_|QUEUE_|FILESYSTEM_|TRUSTED_|VITE_|BCRYPT_)') {
        $current[$parts[0]] = $parts[1]
    }
}
if ($current.DB_DATABASE -ne 'bozor_local_test' -or $current.APP_URL -ne 'http://127.0.0.1:8087') {
    throw 'This script only updates the existing local test app on port 8087.'
}
$changes = git status --porcelain
if ($changes) { throw 'Commit workspace changes before updating the local container.' }
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 8087)
if ($inspection[0].State.Running -ne $true) {
    try { $listener.Start() } finally { $listener.Stop() }
}
New-Item -ItemType Directory -Path test-results -Force | Out-Null
docker exec bozor-postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d bozor_local_test -Fc -f /tmp/bozor-before-local-update.dump'
if ($LASTEXITCODE -ne 0) { throw 'Local database backup failed.' }
docker cp bozor-postgres:/tmp/bozor-before-local-update.dump test-results/bozor-before-local-update.dump
if ($LASTEXITCODE -ne 0) { throw 'Saving local database backup failed.' }
docker tag $inspection[0].Image bozor-app-local:before-local-update
if ($LASTEXITCODE -ne 0) { throw 'Retaining the old local image failed.' }
docker build -f Dockerfile.prod -t $Image .
if ($LASTEXITCODE -ne 0) { throw 'Local image build failed.' }
$override = Join-Path (Get-Location) 'test-results/local-update.override.yml'
@"
services:
  app:
    image: $Image
    networks: !override [bozor]
    environment:
      APP_URL: http://127.0.0.1:8087
      MAIL_MAILER: array
    ports:
      - "127.0.0.1:8087:80"
"@ | Set-Content -LiteralPath $override -Encoding utf8
$saved = @{}
try {
    foreach ($key in $current.Keys) {
        $saved[$key] = [Environment]::GetEnvironmentVariable($key, 'Process')
        [Environment]::SetEnvironmentVariable($key, $current[$key], 'Process')
    }
    docker compose -p bozor -f docker-compose.prod.yml -f $override up -d --no-deps --pull never app
    if ($LASTEXITCODE -ne 0) { throw 'Local container update failed.' }
} finally {
    foreach ($key in $saved.Keys) { [Environment]::SetEnvironmentVariable($key, $saved[$key], 'Process') }
}
Write-Host 'Updated the existing local Bozor app at http://127.0.0.1:8087; database and storage volumes retained.'
