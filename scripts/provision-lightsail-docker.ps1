param(
    [Parameter(Mandatory = $true)]
    [string]$HostName,
    [string]$User = "ubuntu",
    [string]$KeyPath = "C:\Users\denta\source\repos\LightsailDefaultKey-ap-northeast-1.pem",
    [string]$RemoteDir = "/home/ubuntu/bozor",
    [int]$SwapSizeGb = 2
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

$remote = "${User}@${HostName}"
$swapSize = "${SwapSizeGb}G"

Invoke-CheckedNative "Install Docker and Compose on Lightsail" {
    ssh -i $KeyPath -o StrictHostKeyChecking=no $remote "sudo apt-get update && sudo apt-get install -y docker.io docker-compose-v2 && sudo systemctl enable --now docker"
}

Invoke-CheckedNative "Prepare Lightsail swap and deployment directory" {
    ssh -i $KeyPath -o StrictHostKeyChecking=no $remote "if [ ! -f /swapfile ]; then sudo fallocate -l $swapSize /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile && echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab >/dev/null; fi && mkdir -p $RemoteDir"
}

Invoke-CheckedNative "Verify Lightsail Docker" {
    ssh -i $KeyPath -o StrictHostKeyChecking=no $remote "docker --version && docker compose version && free -h && df -h /"
}
