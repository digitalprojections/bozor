<?php

namespace Tests\Feature;

use App\Models\AdCampaign;
use App\Models\AdOrder;
use App\Models\AdvertiserProfile;
use App\Models\User;
use App\Services\AdService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdvertisingWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_apply_for_advertiser_account(): void
    {
        $user = User::factory()->create();

        $this
            ->actingAs($user)
            ->post(route('advertising.apply'), [
                'business_name' => 'Tokyo Camera Shop',
                'website_url' => 'https://example.com',
                'contact_email' => 'ads@example.com',
                'contact_phone' => '090-0000-0000',
                'business_description' => 'Camera equipment seller in Tokyo.',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $this->assertDatabaseHas('advertiser_profiles', [
            'user_id' => $user->id,
            'business_name' => 'Tokyo Camera Shop',
            'status' => AdvertiserProfile::STATUS_PENDING,
        ]);
    }

    public function test_approved_advertiser_can_create_campaign_and_submit_payment_reference(): void
    {
        $user = User::factory()->create();
        $profile = AdvertiserProfile::create([
            'user_id' => $user->id,
            'business_name' => 'Tokyo Camera Shop',
            'contact_email' => 'ads@example.com',
            'status' => AdvertiserProfile::STATUS_APPROVED,
        ]);

        $this
            ->actingAs($user)
            ->post(route('advertising.campaigns.store'), [
                'title' => 'Used cameras this week',
                'description' => 'Shop inspected used cameras and lenses.',
                'target_url' => 'https://example.com/cameras',
                'package_key' => 'top_banner_week',
                'starts_at' => now()->addDay()->toDateString(),
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('advertising.index'));

        $campaign = AdCampaign::query()->firstOrFail();
        $this->assertSame($profile->id, $campaign->advertiser_profile_id);
        $this->assertSame(AdCampaign::STATUS_PENDING_PAYMENT, $campaign->status);
        $this->assertSame('top_banner', $campaign->placement);

        $this->assertDatabaseHas('ad_orders', [
            'ad_campaign_id' => $campaign->id,
            'amount_jpy' => 9800,
            'status' => AdOrder::STATUS_UNPAID,
        ]);

        $this
            ->actingAs($user)
            ->post(route('advertising.campaigns.payment', $campaign), [
                'payment_reference' => 'BANK-TRANSFER-123',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $this->assertSame(AdCampaign::STATUS_PENDING_REVIEW, $campaign->refresh()->status);
        $this->assertSame(AdOrder::STATUS_PENDING_CONFIRMATION, $campaign->order->status);
    }

    public function test_admin_can_approve_paid_campaign_and_service_displays_it(): void
    {
        $admin = User::factory()->create(['email' => 'fuzalov@gmail.com']);
        $user = User::factory()->create();
        $profile = AdvertiserProfile::create([
            'user_id' => $user->id,
            'business_name' => 'Tokyo Camera Shop',
            'contact_email' => 'ads@example.com',
            'status' => AdvertiserProfile::STATUS_APPROVED,
        ]);
        $campaign = AdCampaign::create([
            'advertiser_profile_id' => $profile->id,
            'user_id' => $user->id,
            'title' => 'Used cameras this week',
            'description' => 'Shop inspected used cameras and lenses.',
            'target_url' => 'https://example.com/cameras',
            'placement' => 'top_banner',
            'package_key' => 'top_banner_week',
            'status' => AdCampaign::STATUS_PENDING_REVIEW,
            'starts_at' => now()->subHour(),
            'ends_at' => now()->addWeek(),
            'price_jpy' => 9800,
        ]);
        $campaign->order()->create([
            'user_id' => $user->id,
            'amount_jpy' => 9800,
            'status' => AdOrder::STATUS_PENDING_CONFIRMATION,
            'payment_reference' => 'BANK-TRANSFER-123',
        ]);

        $this
            ->actingAs($admin)
            ->patch(route('admin.advertising.campaigns.update', $campaign), [
                'status' => AdCampaign::STATUS_ACTIVE,
                'order_status' => AdOrder::STATUS_PAID,
                'starts_at' => now()->subHour()->format('Y-m-d H:i:s'),
                'ends_at' => now()->addWeek()->format('Y-m-d H:i:s'),
                'priority' => 10,
                'admin_notes' => 'Approved.',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $ads = app(AdService::class)->layoutAds();

        $this->assertCount(1, $ads['top_banner']);
        $this->assertSame('Used cameras this week', $ads['top_banner'][0]['title']);
        $this->assertSame('Tokyo Camera Shop', $ads['top_banner'][0]['advertiser']);
    }

    public function test_admin_can_view_advertising_queue(): void
    {
        $this->withoutVite();

        $admin = User::factory()->create(['email' => 'fuzalov@gmail.com']);
        $user = User::factory()->create();
        AdvertiserProfile::create([
            'user_id' => $user->id,
            'business_name' => 'Tokyo Camera Shop',
            'contact_email' => 'ads@example.com',
            'status' => AdvertiserProfile::STATUS_PENDING,
        ]);

        $this
            ->actingAs($admin)
            ->get(route('admin.advertising.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/advertising/index')
                ->has('profiles.data', 1)
            );
    }
}
