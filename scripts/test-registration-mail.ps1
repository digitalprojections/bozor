param(
    [ValidateSet('Start', 'Stop')]
    [string]$Action = 'Start'
)
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot -Parent
$toolDir = Join-Path $env:USERPROFILE '.codex/tools/mailpit/1.31.6'
$binary = Join-Path $toolDir 'mailpit.exe'
$results = Join-Path $repo 'test-results'
$pidFile = Join-Path $results 'mailpit.pid'
$inspection = docker inspect bozor-app | ConvertFrom-Json
if ($LASTEXITCODE -ne 0 -or $inspection[0].Config.Env -notcontains 'DB_DATABASE=bozor_local_test') {
    throw 'This tool requires the existing bozor-app with its known local test database.'
}
New-Item -ItemType Directory -Force $results | Out-Null
if ($Action -eq 'Stop') {
    if ($inspection[0].State.Running) {
        docker exec bozor-app php /tmp/local-mail-verification.php Disable
        if ($LASTEXITCODE -ne 0) { throw 'Unable to restore local mail configuration.' }
    }
    if (Test-Path -LiteralPath $pidFile) {
        $capturePid = [int](Get-Content -LiteralPath $pidFile)
        $capture = Get-Process -Id $capturePid -ErrorAction SilentlyContinue
        if ($capture -and $capture.Path -eq $binary) { Stop-Process -Id $capturePid }
        Remove-Item -LiteralPath $pidFile
    }
    docker stop bozor-app
    if ($LASTEXITCODE -ne 0) { throw 'Unable to stop the tested app.' }
    return
}
if (-not (Test-Path -LiteralPath $binary)) {
    New-Item -ItemType Directory -Force $toolDir | Out-Null
    $archive = Join-Path $toolDir 'mailpit.zip'
    Invoke-WebRequest -Uri 'https://github.com/axllent/mailpit/releases/download/v1.31.6/mailpit-windows-amd64.zip' -OutFile $archive
    if ((Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash -ne '5D5AD094BFB3BAC9004F9D1105D2335FEA9F8952C09951DF73AE0A280E34D3B1') {
        throw 'Mailpit archive checksum mismatch.'
    }
    Expand-Archive -LiteralPath $archive -DestinationPath $toolDir -Force
}
$running = $null
if (Test-Path -LiteralPath $pidFile) {
    $running = Get-Process -Id ([int](Get-Content -LiteralPath $pidFile)) -ErrorAction SilentlyContinue
    if ($running -and $running.Path -ne $binary) { throw 'The stored Mailpit PID belongs to another process.' }
}
if (-not $running) {
    foreach ($port in @(1025, 8025)) {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
        try { $listener.Start() } finally { $listener.Stop() }
    }
    $capture = Start-Process -FilePath $binary -ArgumentList @('--listen', '127.0.0.1:8025', '--smtp', '127.0.0.1:1025', '--disable-version-check', '--database', (Join-Path $results 'mailpit.db')) -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $results 'mailpit-stdout.log') -RedirectStandardError (Join-Path $results 'mailpit-stderr.log')
    $capture.Id | Set-Content -LiteralPath $pidFile
}
if (-not $inspection[0].State.Running) {
    docker start bozor-app
    if ($LASTEXITCODE -ne 0) { throw 'Unable to start the existing app.' }
}
$ready = $false
for ($attempt = 0; $attempt -lt 30; $attempt++) {
    docker exec bozor-app curl -fsS http://localhost/up *> $null
    if ($LASTEXITCODE -eq 0) { $ready = $true; break }
    Start-Sleep -Seconds 1
}
if (-not $ready) { throw 'The existing app did not become ready.' }
docker cp (Join-Path $PSScriptRoot 'local-mail-verification.php') bozor-app:/tmp/local-mail-verification.php
if ($LASTEXITCODE -ne 0) { throw 'Unable to copy the local mail helper.' }
docker exec bozor-app php /tmp/local-mail-verification.php Enable
if ($LASTEXITCODE -ne 0) { throw 'Unable to enable the local SMTP capture.' }
Write-Host 'Fake inbox: http://127.0.0.1:8025/ ; app: http://127.0.0.1:8087/register'
