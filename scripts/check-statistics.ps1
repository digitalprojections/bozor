$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
npm.cmd run test:statistics
if ($LASTEXITCODE -ne 0) { throw 'Statistics translation checks failed.' }
npm.cmd run types
if ($LASTEXITCODE -ne 0) { throw 'Type checks failed.' }
& "$PSScriptRoot/test-local-container.ps1" -Filter AdminStatisticsTest
