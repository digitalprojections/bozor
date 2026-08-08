param(
    [Parameter(Mandatory = $true)]
    [string]$TargetHost,
    [string]$SourceHost = "bazaarjapan.link",
    [string]$SourceUser = "ec2-user",
    [string]$SourceKeyPath = "C:\Users\denta\source\repos\bozor\bozorkey.pem",
    [string]$SourceRemoteDir = "/home/ec2-user",
    [string]$TargetUser = "ubuntu",
    [string]$TargetKeyPath = "C:\Users\denta\source\repos\LightsailDefaultKey-ap-northeast-1.pem",
    [string]$TargetRemoteDir = "/home/ubuntu/bozor",
    [string]$LocalBackupDir = ".migration/bozor-lightsail",
    [string]$SourcePostgresContainer = "bozor-postgres",
    [string]$TargetPostgresContainer = "bozor-postgres",
    [string]$TargetComposeFile = "docker-compose.lightsail.yml",
    [string]$TargetRemoteEnvFile = ".env",
    [string]$TargetComposeProjectName = "bozor",
    [switch]$CopyRemoteEnv,
    [switch]$SkipBackup,
    [switch]$SkipRestore
)

$ErrorActionPreference = "Stop"

$sourceRemote = "${SourceUser}@${SourceHost}"
$targetRemote = "${TargetUser}@${TargetHost}"
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$remoteBackupDir = "/tmp/bozor-migration-$stamp"
$localBackupPath = Join-Path $LocalBackupDir $stamp
$postgresDumpFile = "postgres.dump"

$volumes = @(
    @{ Source = "ec2-user_redis_data"; Target = "bozor_redis_data"; File = "redis_data.tgz" },
    @{ Source = "ec2-user_app_public_storage"; Target = "bozor_app_public_storage"; File = "app_public_storage.tgz" },
    @{ Source = "ec2-user_app_logs"; Target = "bozor_app_logs"; File = "app_logs.tgz" },
    @{ Source = "ec2-user_caddy_data"; Target = "bozor_caddy_data"; File = "caddy_data.tgz" },
    @{ Source = "ec2-user_caddy_config"; Target = "bozor_caddy_config"; File = "caddy_config.tgz" }
)

function Assert-LocalPath {
    param(
        [string]$Path,
        [string]$Label
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "$Label was not found at $Path"
    }
}

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

Assert-LocalPath $SourceKeyPath "Source SSH key"
Assert-LocalPath $TargetKeyPath "Target SSH key"

New-Item -ItemType Directory -Force -Path $localBackupPath | Out-Null

if (-not $SkipBackup) {
    Invoke-CheckedNative "Create source backup directory" {
        ssh -i $SourceKeyPath -o StrictHostKeyChecking=no $sourceRemote "mkdir -p $remoteBackupDir"
    }

    Invoke-CheckedNative "Dump source Postgres database" {
        ssh -i $SourceKeyPath -o StrictHostKeyChecking=no $sourceRemote "docker exec $SourcePostgresContainer sh -c 'pg_dump -U ""`$POSTGRES_USER"" -d ""`$POSTGRES_DB"" -Fc' > ${remoteBackupDir}/${postgresDumpFile}"
    }
    Invoke-CheckedNative "Download $postgresDumpFile" {
        scp -i $SourceKeyPath "${sourceRemote}:${remoteBackupDir}/${postgresDumpFile}" $localBackupPath
    }

    Invoke-CheckedNative "Flush source Redis snapshot" {
        ssh -i $SourceKeyPath -o StrictHostKeyChecking=no $sourceRemote "docker exec bozor-redis redis-cli SAVE"
    }

    foreach ($volume in $volumes) {
        $sourceVolume = $volume.Source
        $archiveFile = $volume.File
        Invoke-CheckedNative "Archive $sourceVolume" {
            ssh -i $SourceKeyPath -o StrictHostKeyChecking=no $sourceRemote "docker run --rm -v ${sourceVolume}:/volume:ro -v ${remoteBackupDir}:/backup alpine sh -c 'cd /volume && tar czf /backup/${archiveFile} .'"
        }
        Invoke-CheckedNative "Download $archiveFile" {
            scp -i $SourceKeyPath "${sourceRemote}:${remoteBackupDir}/${archiveFile}" $localBackupPath
        }
    }

    if ($CopyRemoteEnv) {
        Invoke-CheckedNative "Download production .env" {
            scp -i $SourceKeyPath "${sourceRemote}:${SourceRemoteDir}/.env" (Join-Path $localBackupPath ".env")
        }
    }
}

Invoke-CheckedNative "Prepare target directories" {
    ssh -i $TargetKeyPath -o StrictHostKeyChecking=no $targetRemote "mkdir -p $TargetRemoteDir $remoteBackupDir"
}

foreach ($volume in $volumes) {
    $archiveFile = $volume.File
    Invoke-CheckedNative "Upload $archiveFile" {
        scp -i $TargetKeyPath (Join-Path $localBackupPath $archiveFile) "${targetRemote}:${remoteBackupDir}/${archiveFile}"
    }
}

Invoke-CheckedNative "Upload $postgresDumpFile" {
    scp -i $TargetKeyPath (Join-Path $localBackupPath $postgresDumpFile) "${targetRemote}:${remoteBackupDir}/${postgresDumpFile}"
}

if ($CopyRemoteEnv) {
    Invoke-CheckedNative "Upload production .env" {
        scp -i $TargetKeyPath (Join-Path $localBackupPath ".env") "${targetRemote}:${TargetRemoteDir}/.env"
    }
}

if (-not $SkipRestore) {
    Invoke-CheckedNative "Stop target app and Redis before data restore" {
        ssh -i $TargetKeyPath -o StrictHostKeyChecking=no $targetRemote "cd $TargetRemoteDir && docker compose --env-file $TargetRemoteEnvFile -p $TargetComposeProjectName -f $TargetComposeFile stop app redis"
    }

    foreach ($volume in $volumes) {
        $targetVolume = $volume.Target
        $archiveFile = $volume.File
        Invoke-CheckedNative "Restore $targetVolume" {
            ssh -i $TargetKeyPath -o StrictHostKeyChecking=no $targetRemote "docker volume create $targetVolume >/dev/null && docker run --rm -v ${targetVolume}:/volume -v ${remoteBackupDir}:/backup alpine sh -c 'rm -rf /volume/* /volume/.[!.]* /volume/..?* 2>/dev/null || true; tar xzf /backup/${archiveFile} -C /volume'"
        }
    }

    Invoke-CheckedNative "Restore target Postgres database" {
        ssh -i $TargetKeyPath -o StrictHostKeyChecking=no $targetRemote "docker exec $TargetPostgresContainer sh -c 'pg_restore --clean --if-exists --no-owner -U ""`$POSTGRES_USER"" -d ""`$POSTGRES_DB""' < ${remoteBackupDir}/${postgresDumpFile}"
    }

    Invoke-CheckedNative "Restart target stack after data restore" {
        ssh -i $TargetKeyPath -o StrictHostKeyChecking=no $targetRemote "cd $TargetRemoteDir && docker compose --env-file $TargetRemoteEnvFile -p $TargetComposeProjectName -f $TargetComposeFile up -d --force-recreate"
    }
}

Write-Host "Migration payload prepared for $TargetHost"
Write-Host "Local backup: $localBackupPath"
