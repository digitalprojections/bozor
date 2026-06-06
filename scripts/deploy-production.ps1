param(
    [string]$HostName = "bazaarjapan.link",
    [string]$User = "ec2-user",
    [string]$KeyPath = "bozorkey.pem",
    [string]$RemoteDir = "/home/ec2-user",
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
    $ImageRepo
)

if ($ImageTag) {
    $args += @("-ImageTag", $ImageTag)
}

Write-Host "Running production DockerHub deploy sequence"
& powershell @args
