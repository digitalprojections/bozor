param(
    [ValidateSet('Update', 'Status', 'Test')]
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
        if ($parts[0] -match '^(APP_|DB_|MAIL_|AWS_|GOOGLE_|SESSION_|CACHE_|REDIS_|LOG_|QUEUE_|FILESYSTEM_|TRUSTED_|VITE_|BCRYPT_)') {
            $current[$parts[0]] = $parts[1]
        }
    }
    if ($current.DB_DATABASE -ne 'bozor_local_test') { throw 'Refusing to change a stack outside the known local test database.' }
    if ($Action -eq 'Test') {
        New-Item -ItemType Directory -Path test-results -Force | Out-Null
        docker exec bozor-app composer install --no-interaction --prefer-dist --no-progress
        if ($LASTEXITCODE -ne 0) { throw 'Unable to install locked local test dependencies.' }
        docker exec bozor-app php -r 'exit(function_exists("imagejpeg") && function_exists("imagecreatefromwebp") ? 0 : 1);'
        if ($LASTEXITCODE -ne 0) {
            docker exec bozor-app sh -c 'apk add --no-cache libpng libjpeg-turbo libwebp freetype && apk add --no-cache --virtual .qa-gd-build-deps $PHPIZE_DEPS libpng-dev libjpeg-turbo-dev libwebp-dev freetype-dev && docker-php-ext-configure gd --with-jpeg --with-webp --with-freetype && docker-php-ext-install gd && apk del .qa-gd-build-deps'
            if ($LASTEXITCODE -ne 0) { throw 'Unable to prepare local GD test support.' }
        }
        # The app database, Redis sessions/cache, and real mail are never used by this test process.
        docker exec -e APP_ENV=testing -e DB_CONNECTION=sqlite -e DB_DATABASE=:memory: -e CACHE_STORE=array -e SESSION_DRIVER=array -e QUEUE_CONNECTION=sync -e MAIL_MAILER=array -e APP_CONFIG_CACHE=/tmp/qa-config.php -e APP_SERVICES_CACHE=/tmp/qa-services.php -e APP_PACKAGES_CACHE=/tmp/qa-packages.php -e VIEW_COMPILED_PATH=/tmp -e LOG_CHANNEL=stderr bozor-app php -d short_open_tag=0 vendor/bin/phpunit --do-not-cache-result --log-junit /tmp/registration-regression.xml
        $testExitCode = $LASTEXITCODE
        docker cp bozor-app:/tmp/registration-regression.xml test-results/registration-regression.xml
        if ($LASTEXITCODE -ne 0) { throw 'Unable to save the regression report.' }
        if ($testExitCode -ne 0) { throw 'Backend regression checks failed; see test-results/registration-regression.xml.' }
        return
    }
    $ownsTestPort = $inspection[0].NetworkSettings.Ports.'80/tcp' | Where-Object { $_.HostIp -eq '127.0.0.1' -and $_.HostPort -eq '8087' }
    if (-not $ownsTestPort) {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 8087)
        try { $listener.Start() } finally { $listener.Stop() }
    }
    New-Item -ItemType Directory -Path test-results -Force | Out-Null
    docker exec bozor-postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d bozor_local_test -Fc -f /tmp/bozor-registration-before.dump'
    if ($LASTEXITCODE -ne 0) { throw 'Local database backup failed.' }
    docker cp bozor-postgres:/tmp/bozor-registration-before.dump test-results/bozor-registration-before.dump
    if ($LASTEXITCODE -ne 0) { throw 'Unable to save local database backup.' }
    docker image inspect $inspection[0].Image *> $null
    if ($LASTEXITCODE -eq 0) {
        docker tag $inspection[0].Image bozor-app-local:before-registration-qa
    } else {
        docker exec bozor-app tar -czf /tmp/bozor-registration-code-before.tar.gz -C /var/www/html app bootstrap config database/migrations lang public/build resources routes composer.json composer.lock package.json
        if ($LASTEXITCODE -ne 0) { throw 'Unable to archive existing app code.' }
        docker cp bozor-app:/tmp/bozor-registration-code-before.tar.gz test-results/bozor-registration-code-before.tar.gz
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
