<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class LightsailDeploymentScriptTest extends TestCase
{
    public function test_lightsail_deploy_requires_explicit_host_and_uses_lightsail_defaults(): void
    {
        $script = file_get_contents(dirname(__DIR__, 2).'/scripts/deploy-lightsail.ps1');

        $this->assertStringContainsString('[Parameter(Mandatory = $true)]', $script);
        $this->assertStringContainsString('[string]$HostName', $script);
        $this->assertStringContainsString('[string]$User = "ubuntu"', $script);
        $this->assertStringContainsString('scripts/deploy-dockerhub.ps1', $script);
        $this->assertStringContainsString('docker-compose.lightsail.yml', $script);
        $this->assertStringContainsString('http://127.0.0.1:8088/health', $script);
        $this->assertStringContainsString('docker compose', $script);
        $this->assertStringContainsString('"bozor"', $script);
        $this->assertStringNotContainsString('"ec2-user"', $script);
    }

    public function test_shared_dockerhub_deploy_keeps_remote_compose_command_configurable(): void
    {
        $script = file_get_contents(dirname(__DIR__, 2).'/scripts/deploy-dockerhub.ps1');

        $this->assertStringContainsString('[string]$RemoteComposeCommand = "docker-compose"', $script);
        $this->assertStringContainsString('$RemoteComposeCommand --env-file $RemoteEnvFile', $script);
    }

    public function test_lightsail_compose_uses_localhost_port_without_caddy(): void
    {
        $compose = file_get_contents(dirname(__DIR__, 2).'/docker-compose.lightsail.yml');

        $this->assertStringContainsString('${APP_HTTP_BIND:-127.0.0.1}:${APP_HTTP_PORT:-8088}:80', $compose);
        $this->assertStringContainsString('postgres:16-alpine', $compose);
        $this->assertStringContainsString('redis:7-alpine', $compose);
        $this->assertStringNotContainsString('caddy:2-alpine', $compose);
    }

    public function test_lightsail_provision_and_nginx_scripts_are_explicit_host_tools(): void
    {
        $provision = file_get_contents(dirname(__DIR__, 2).'/scripts/provision-lightsail-docker.ps1');
        $nginx = file_get_contents(dirname(__DIR__, 2).'/scripts/install-lightsail-nginx-site.ps1');

        $this->assertStringContainsString('[Parameter(Mandatory = $true)]', $provision);
        $this->assertStringContainsString('docker.io docker-compose-v2', $provision);
        $this->assertStringContainsString('/swapfile', $provision);
        $this->assertStringContainsString('[Parameter(Mandatory = $true)]', $nginx);
        $this->assertStringContainsString('lightsail-bazaarjapan.conf', $nginx);
        $this->assertStringContainsString('sudo nginx -t', $nginx);
    }

    public function test_existing_image_lightsail_start_does_not_push_new_image(): void
    {
        $script = file_get_contents(dirname(__DIR__, 2).'/scripts/start-lightsail-existing-image.ps1');

        $this->assertStringContainsString('[Parameter(Mandatory = $true)]', $script);
        $this->assertStringContainsString('[string]$AppImage', $script);
        $this->assertStringContainsString('$RemoteDir/docker/nginx', $script);
        $this->assertStringContainsString('docker compose --env-file $RemoteEnvFile', $script);
        $this->assertStringContainsString('docker compose --env-file $RemoteEnvFile -p $ComposeProjectName -f $ComposeFile pull app', $script);
        $this->assertStringNotContainsString('docker push', $script);
        $this->assertStringNotContainsString('docker build', $script);
    }

    public function test_migration_script_targets_active_ec2_volumes_and_ignored_backup_folder(): void
    {
        $script = file_get_contents(dirname(__DIR__, 2).'/scripts/migrate-ec2-to-lightsail.ps1');
        $gitignore = file_get_contents(dirname(__DIR__, 2).'/.gitignore');

        $this->assertStringContainsString('pg_dump', $script);
        $this->assertStringContainsString('pg_restore', $script);
        $this->assertStringNotContainsString('ec2-user_postgres_data', $script);
        $this->assertStringContainsString('ec2-user_redis_data', $script);
        $this->assertStringContainsString('ec2-user_app_public_storage', $script);
        $this->assertStringContainsString('$TargetPostgresContainer', $script);
        $this->assertStringContainsString('.migration/bozor-lightsail', $script);
        $this->assertStringContainsString('.migration/', $gitignore);
    }
}
