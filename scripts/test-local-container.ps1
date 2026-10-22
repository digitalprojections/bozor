param([string]$Filter = '')
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
docker exec bozor-app php scripts/verify-image-runtime.php
if ($LASTEXITCODE -ne 0) { throw 'The existing test container is missing required image support.' }
New-Item -ItemType Directory -Path test-results -Force | Out-Null
$testArgs = @('--do-not-cache-result', '--log-junit', '/tmp/local-regression.xml')
if ($Filter) { $testArgs += @('--filter', $Filter) }
# Exercise the existing container without replacing its app data or Redis sessions.
docker exec -e APP_ENV=testing -e DB_CONNECTION=sqlite -e DB_DATABASE=:memory: -e CACHE_STORE=array -e SESSION_DRIVER=array -e QUEUE_CONNECTION=sync -e MAIL_MAILER=array -e APP_CONFIG_CACHE=/tmp/qa-config.php -e APP_SERVICES_CACHE=/tmp/qa-services.php -e APP_PACKAGES_CACHE=/tmp/qa-packages.php -e VIEW_COMPILED_PATH=/tmp -e LOG_CHANNEL=stderr bozor-app php -d short_open_tag=0 vendor/bin/phpunit @testArgs
$testExitCode = $LASTEXITCODE
docker cp bozor-app:/tmp/local-regression.xml test-results/local-regression.xml
if ($LASTEXITCODE -ne 0) { throw 'Unable to save the local regression report.' }
if ($testExitCode -ne 0) { throw 'Local regression checks failed; see test-results/local-regression.xml.' }
