param(
    [string]$HostName = "bazaarjapan.link",
    [string]$User = "ec2-user",
    [string]$KeyPath = "bozorkey.pem",
    [string]$RemoteDir = "/home/ec2-user/bozor-staging",
    [string]$ImageRepo = "fuzalov/bozor-app",
    [string]$ImageTag = ""
)

$ErrorActionPreference = "Stop"

$args = @(
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
    "-EnvironmentName",
    "staging",
    "-ComposeFile",
    "docker-compose.staging.yml",
    "-ComposeProjectName",
    "bozor-staging",
    "-RemoteEnvFile",
    ".env.staging",
    "-AppContainerName",
    "bozor-staging-app",
    "-HealthUrl",
    "https://staging.bazaarjapan.link/health"
)

if ($ImageTag) {
    $args += @("-ImageTag", $ImageTag)
}

Write-Host "Running staging DockerHub deploy sequence"
& powershell @args
