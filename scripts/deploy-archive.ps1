param(
    [string]$HostName = '57.180.42.104',
    [string]$KeyPath = 'C:\Users\denta\source\repos\LightsailDefaultKey-ap-northeast-1.pem'
)
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
function Invoke-Checked([scriptblock]$Command) {
    & $Command
    if ($LASTEXITCODE -ne 0) { throw "Release command failed with exit code $LASTEXITCODE" }
}
if (git status --porcelain) { throw 'Commit all changes before deploying.' }
$version = (Get-Content package.json -Raw | ConvertFrom-Json).version
$sha = (git rev-parse --short HEAD).Trim()
$image = "fuzalov/bozor-app:$version-$sha"
$remote = "ubuntu@$HostName"
$release = "/home/ubuntu/bozor/.releases/$version-$sha"
$artifact = "local-artifacts/$version-$sha"
New-Item -ItemType Directory -Force $artifact | Out-Null
Invoke-Checked { docker build -f Dockerfile.prod -t $image . }
Invoke-Checked { docker save -o "$artifact/image.tar" $image }
$digest = (Get-FileHash "$artifact/image.tar" -Algorithm SHA256).Hash.ToLowerInvariant()
$imageId = (docker image inspect $image --format '{{.Id}}').Trim()
Invoke-Checked { ssh -o BatchMode=yes -i $KeyPath $remote "mkdir -p $release && chmod 700 $release" }
Invoke-Checked { scp -i $KeyPath "$artifact/image.tar" "${remote}:$release/image.tar" }
$script = @'
#!/bin/bash
set -euo pipefail
cd /home/ubuntu/bozor
release="$1"
image="$2"
digest="$3"
expected_id="$4"
echo "$digest  $release/image.tar" | sha256sum -c -
docker load -i "$release/image.tar"
test "$(docker image inspect "$image" --format '{{.Id}}')" = "$expected_id"
cp .env "$release/env.before"
cp docker-compose.lightsail.yml "$release/compose.before.yml"
docker inspect bozor-app --format '{{.Config.Image}}' > "$release/previous-image.txt"
docker tag "$(cat "$release/previous-image.txt")" "bozor-rollback:$(basename "$release")"
docker exec bozor-postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' > "$release/database.dump"
test -s "$release/database.dump"
rollback() {
    cp "$release/env.before" .env
    docker compose --env-file .env -p bozor -f docker-compose.lightsail.yml up -d --no-deps --pull never app
    echo "Deployment failed; previous app image restored. Database backup: $release/database.dump" >&2
}
trap rollback ERR
sed -i '/^APP_IMAGE=/d' .env
printf '\nAPP_IMAGE=%s\n' "$image" >> .env
docker compose --env-file .env -p bozor -f docker-compose.lightsail.yml up -d --no-deps --pull never app
healthy=false
for attempt in $(seq 1 60); do
    if [ "$(docker inspect bozor-app --format '{{.State.Health.Status}}')" = healthy ]; then healthy=true; break; fi
    sleep 2
done
test "$healthy" = true
test "$(docker inspect bozor-app --format '{{.Image}}')" = "$expected_id"
curl --fail --silent --show-error http://127.0.0.1:8088/health
curl --fail --silent --show-error https://bazaarjapan.link/up > /dev/null
docker exec bozor-app php artisan migrate:status
trap - ERR
printf '\nDeployed %s (%s)\nBackup: %s\n' "$image" "$expected_id" "$release"
'@
[IO.File]::WriteAllText((Join-Path (Get-Location) "$artifact/release.sh"), $script.Replace("`r`n", "`n"), [Text.UTF8Encoding]::new($false))
Invoke-Checked { scp -i $KeyPath "$artifact/release.sh" "${remote}:$release/release.sh" }
Invoke-Checked { ssh -o BatchMode=yes -i $KeyPath $remote "bash $release/release.sh $release $image $digest $imageId" }
@{ version=$version; commit=$sha; image=$image; imageId=$imageId; archiveSha256=$digest; backup=$release } |
    ConvertTo-Json | Set-Content "$artifact/receipt.json"
