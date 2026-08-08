param(
    [Parameter(Mandatory = $true)]
    [string]$HostName,
    [string]$User = "ubuntu",
    [string]$KeyPath = "C:\Users\denta\source\repos\LightsailDefaultKey-ap-northeast-1.pem",
    [string]$RemoteDir = "/home/ubuntu/bozor",
    [string]$ImageRepo = "fuzalov/bozor-app",
    [string]$ImageTag = "",
    [string]$HealthUrl = "http://127.0.0.1:8088/health",
    [switch]$SkipLocalDockerCleanup,
    [switch]$SkipRemoteImagePrune
)

$ErrorActionPreference = "Stop"

$deployArgs = @(
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    "scripts/deploy-dockerhub.ps1",
    "-HostName",
    $HostName,
    "-User",
    $User,
    "-KeyPath",
    $KeyPath,
    "-RemoteDir",
    $RemoteDir,
    "-ImageRepo",
    $ImageRepo,
    "-ComposeFile",
    "docker-compose.lightsail.yml",
    "-EnvironmentName",
    "production",
    "-ComposeProjectName",
    "bozor",
    "-RemoteEnvFile",
    ".env",
    "-AppContainerName",
    "bozor-app",
    "-HealthUrl",
    $HealthUrl,
    "-PublicNetworkName",
    "bozor-public",
    "-RemoteComposeCommand",
    "docker compose"
)

if ($ImageTag) {
    $deployArgs += @("-ImageTag", $ImageTag)
}

if ($SkipLocalDockerCleanup) {
    $deployArgs += "-SkipLocalDockerCleanup"
}

if ($SkipRemoteImagePrune) {
    $deployArgs += "-SkipRemoteImagePrune"
}

Write-Host "Running Lightsail DockerHub deploy sequence"
& powershell @deployArgs

if ($LASTEXITCODE -ne 0) {
    throw "Lightsail deploy failed with exit code $LASTEXITCODE"
}
