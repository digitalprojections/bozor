$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
npm.cmd run test:feature-requests
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm.cmd run types
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
& "$PSScriptRoot/test-local-container.ps1" -Filter FeatureRequestTest
