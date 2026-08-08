param(
    [Parameter(Mandatory = $true)]
    [string]$HostName,
    [string]$User = "ubuntu",
    [string]$KeyPath = "C:\Users\denta\source\repos\LightsailDefaultKey-ap-northeast-1.pem",
    [string]$SiteConfig = "docker/nginx/lightsail-bazaarjapan.conf",
    [string]$RemoteConfig = "/etc/nginx/sites-available/bazaarjapan.link"
)

$ErrorActionPreference = "Stop"

function Invoke-CheckedNative {
    param(
        [string]$Description,
        [scriptblock]$Command
    )

    & $Command

    if ($LASTEXITCODE -ne 0) {
        throw "$Description failed with exit code $LASTEXITCODE"
    }
}

if (-not (Test-Path -LiteralPath $SiteConfig)) {
    throw "Site config was not found at $SiteConfig"
}

$remote = "${User}@${HostName}"
$tempConfig = "/tmp/bazaarjapan.link.nginx.conf"

Invoke-CheckedNative "Upload nginx site config" {
    scp -i $KeyPath $SiteConfig "${remote}:${tempConfig}"
}

Invoke-CheckedNative "Install nginx site config" {
    ssh -i $KeyPath -o StrictHostKeyChecking=no $remote "sudo mv $tempConfig $RemoteConfig && sudo ln -sf $RemoteConfig /etc/nginx/sites-enabled/bazaarjapan.link && sudo nginx -t && sudo systemctl reload nginx"
}
