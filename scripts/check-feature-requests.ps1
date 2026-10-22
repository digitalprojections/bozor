$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
npm.cmd run test:feature-requests
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm.cmd run types
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
docker run --rm --entrypoint /usr/bin/env --mount "type=bind,source=$((Get-Location).Path),target=/var/www/html" -e DB_CONNECTION=sqlite -e DB_DATABASE=:memory: -e APP_ENV=testing bozor-app-local php -d short_open_tag=0 vendor/bin/phpunit --filter=FeatureRequestTest --do-not-cache-result
exit $LASTEXITCODE
