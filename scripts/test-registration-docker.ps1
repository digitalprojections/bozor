param(
    [ValidateSet('Update', 'Status')]
    [string]$Action = 'Status'
)
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot -Parent
Push-Location $repo
try {
    if ($Action -eq 'Status') {
        docker compose -p bozor -f docker-compose.prod.yml ps
        if ($LASTEXITCODE -ne 0) { throw 'Unable to inspect existing stack.' }
        return
    }
    $inspection = docker inspect bozor-app | ConvertFrom-Json
    if ($LASTEXITCODE -ne 0) { throw 'The existing bozor-app container is required.' }
    $current = @{}
    foreach ($entry in $inspection[0].Config.Env) {
        $parts = $entry.Split('=', 2)
        $current[$parts[0]] = $parts[1]
    }
    if ($current.DB_DATABASE -ne 'bozor_local_test') { throw 'Refusing to change a stack outside the known local test database.' }
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 8087)
    try { $listener.Start() } finally { $listener.Stop() }
    New-Item -ItemType Directory -Path test-results -Force | Out-Null
    docker exec bozor-postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d bozor_local_test -Fc -f /tmp/bozor-registration-before.dump'
    if ($LASTEXITCODE -ne 0) { throw 'Local database backup failed.' }
    docker cp bozor-postgres:/tmp/bozor-registration-before.dump test-results/bozor-registration-before.dump
    if ($LASTEXITCODE -ne 0) { throw 'Unable to save local database backup.' }
    docker image inspect $inspection[0].Image *> $null
    if ($LASTEXITCODE -eq 0) {
        docker tag $inspection[0].Image bozor-app-local:before-registration-qa
    } else {
        docker export --output test-results/bozor-app-before.tar bozor-app
    }
    if ($LASTEXITCODE -ne 0) { throw 'Unable to retain the previous app image.' }
    $override = Join-Path $repo 'test-results/registration-compose.override.yml'
    $overrideText = @"
services:
  app:
    image: bozor-app-local:1.0.1
    networks: !override [bozor]
    environment:
      APP_URL: http://127.0.0.1:8087
      MAIL_MAILER: array
    ports:
      - "127.0.0.1:8087:80"
"@
    $overrideText | Set-Content -LiteralPath $override -Encoding utf8
    $saved = @{}
    try {
        foreach ($key in $current.Keys) {
            $saved[$key] = [Environment]::GetEnvironmentVariable($key, 'Process')
            [Environment]::SetEnvironmentVariable($key, $current[$key], 'Process')
        }
        docker compose -p bozor -f docker-compose.prod.yml -f $override up -d --no-deps --pull never app
        if ($LASTEXITCODE -ne 0) { throw 'Existing app container update failed.' }
    } finally {
        foreach ($key in $saved.Keys) { [Environment]::SetEnvironmentVariable($key, $saved[$key], 'Process') }
    }
    Write-Host 'Updated existing bozor-app. Database and storage volumes retained. Local URL: http://127.0.0.1:8087/register'
} finally { Pop-Location }
