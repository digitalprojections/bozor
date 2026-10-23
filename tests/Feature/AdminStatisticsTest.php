<?php

namespace Tests\Feature;

use App\Models\AdCampaign;
use App\Models\AdOrder;
use App\Models\AdvertiserProfile;
use App\Models\Category;
use App\Models\FeatureRequest;
use App\Models\Listing;
use App\Models\Transaction;
use App\Models\User;
use App\Models\VisitorCounter;
use App\Services\AdminStatistics;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminStatisticsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->travelTo(CarbonImmutable::parse('2026-10-23 12:00:00', 'UTC'));
        $this->withoutVite();
        Category::create(['name' => 'Default', 'slug' => 'default']);
    }

    public function test_guest_and_regular_user_cannot_access_statistics(): void
    {
        $this->get('/admin/statistics')->assertRedirect('/login');
        $this->actingAs(User::factory()->create())->get('/admin/statistics')->assertForbidden();
    }

    public function test_disabled_admin_cannot_access_statistics(): void
    {
        $this->actingAs(User::factory()->create(['email' => 'fuzalov@gmail.com', 'disabled_at' => now()]))
            ->getJson('/admin/statistics')->assertForbidden();
    }

    public function test_admin_can_view_private_statistics_in_every_language(): void
    {
        $this->actingAs(User::factory()->create(['email' => 'fuzalov@gmail.com']));
        foreach (['en', 'ja', 'uz', 'ru'] as $locale) {
            $this->get('/admin/statistics?days=7&lang='.$locale)->assertOk()
                ->assertHeader('Cache-Control', 'no-store, private')
                ->assertInertia(fn (Assert $page) => $page->component('admin/statistics')
                    ->where('locale', $locale)->where('statistics.range.days', 7)
                    ->has('statistics.trend', 7));
        }
    }

    public function test_statistics_are_not_shared_with_public_pages(): void
    {
        $this->get('/')->assertInertia(fn (Assert $page) => $page->missing('statistics'));
    }

    public function test_invalid_period_is_rejected(): void
    {
        $this->actingAs(User::factory()->create(['email' => 'fuzalov@gmail.com']))
            ->getJson('/admin/statistics?days=999')->assertUnprocessable()->assertJsonValidationErrors('days');
    }

    public function test_period_boundaries_exclude_guests_and_compare_previous_period(): void
    {
        User::factory()->create(['created_at' => '2026-10-17 00:00:00']);
        User::factory()->create(['created_at' => '2026-10-23 23:59:59']);
        User::factory()->create(['created_at' => '2026-10-16 23:59:59']);
        User::factory()->create(['created_at' => '2026-10-24 00:00:00']);
        User::factory()->create(['is_guest' => true, 'created_at' => '2026-10-20 00:00:00']);
        $data = app(AdminStatistics::class)->build(7);
        $this->assertSame(2, $data['period']['users']);
        $this->assertSame(1, $data['previous']['users']);
        $this->assertSame(4, $data['snapshot']['users']);
        $this->assertSame('2026-10-17', $data['range']['start']);
        $this->assertSame('UTC', $data['range']['timezone']);
    }

    public function test_listing_counts_exclude_ads_and_deleted_records_without_category_duplicates(): void
    {
        $first = Category::create(['name' => 'First', 'slug' => 'first']);
        $second = Category::create(['name' => 'Second', 'slug' => 'second']);
        $listing = Listing::factory()->create(['category_id' => $first->id, 'is_auction' => true]);
        $listing->categories()->attach([$first->id, $second->id]);
        Listing::factory()->create(['listing_type' => 'ad']);
        $deleted = Listing::factory()->create();
        $deleted->delete();
        $data = app(AdminStatistics::class)->build(7);
        $this->assertSame(1, $data['period']['listings']);
        $this->assertSame(1, $data['snapshot']['listings']);
        $this->assertSame(1, $data['snapshot']['auctions']);
        $this->assertCount(2, $data['categories']);
        $this->assertSame(1, $data['categories'][0]['count']);
    }

    public function test_transaction_values_count_only_completed_cohort_records(): void
    {
        $seller = User::factory()->create();
        $buyer = User::factory()->create();
        foreach (['received' => 1000, 'paid' => 2000, 'cancelled' => 3000] as $status => $amount) {
            $listing = Listing::factory()->create(['user_id' => $seller->id]);
            Transaction::create(['listing_id' => $listing->id, 'buyer_id' => $buyer->id, 'seller_id' => $seller->id, 'amount' => $amount, 'status' => $status]);
        }
        $data = app(AdminStatistics::class)->build(7);
        $this->assertSame(3, $data['period']['transactions']);
        $this->assertSame(1, $data['period']['completed']);
        $this->assertSame(1000, $data['period']['completed_value']);
        $this->assertSame(1, $data['period']['cancelled']);
        $this->assertSame(1, $data['period']['buyers']);
        $this->assertSame(1000.0, $data['period']['average_value']);
    }

    public function test_advertising_values_exclude_unpaid_and_refunded_orders(): void
    {
        $user = User::factory()->create();
        $profile = AdvertiserProfile::create(['user_id' => $user->id, 'business_name' => 'Test', 'contact_email' => 'private@example.test', 'status' => 'approved']);
        foreach (['paid' => 5000, 'unpaid' => 6000, 'refunded' => 7000] as $status => $amount) {
            $campaign = AdCampaign::create(['advertiser_profile_id' => $profile->id, 'user_id' => $user->id, 'title' => 'Test', 'description' => 'Test campaign', 'image_path' => 'test.png', 'target_url' => 'https://example.test', 'placement' => 'top_banner', 'package_key' => 'test', 'price_jpy' => $amount, 'status' => 'active']);
            AdOrder::create(['ad_campaign_id' => $campaign->id, 'user_id' => $user->id, 'amount_jpy' => $amount, 'status' => $status]);
        }
        $data = app(AdminStatistics::class)->build(7);
        $this->assertSame(5000, $data['period']['ad_paid_value']);
        $this->assertStringNotContainsString('private@example.test', json_encode($data));
    }

    public function test_empty_activity_is_zero_filled_and_missing_rating_is_not_zero_stars(): void
    {
        $data = app(AdminStatistics::class)->build(7);
        $this->assertCount(7, $data['trend']);
        $this->assertSame('2026-10-17', $data['trend'][0]['date']);
        $this->assertSame('2026-10-23', $data['trend'][6]['date']);
        $this->assertSame(0, array_sum(array_column($data['trend'], 'users')));
        $this->assertNull($data['period']['average_rating']);
        $this->assertSame(0.0, $data['period']['average_value']);
        $this->assertSame(0, $data['visitors']);
    }

    public function test_visitor_total_and_feature_request_languages_are_reported_without_personal_data(): void
    {
        VisitorCounter::create(['name' => 'site_human_visitors', 'count' => 123]);
        $user = User::factory()->create(['email' => 'hidden@example.test']);
        FeatureRequest::create(['user_id' => $user->id, 'title' => 'Private title', 'description' => 'Private details', 'locale' => 'uz']);
        $data = app(AdminStatistics::class)->build(7);
        $this->assertSame(123, $data['visitors']);
        $this->assertSame([['label' => 'uz', 'count' => 1]], $data['request_languages']);
        $this->assertStringNotContainsString('hidden@example.test', json_encode($data));
        $this->assertStringNotContainsString('Private details', json_encode($data));
    }

    public function test_query_count_is_bounded_independently_of_record_count(): void
    {
        User::factory()->count(40)->create();
        DB::enableQueryLog();
        app(AdminStatistics::class)->build(30);
        $queries = DB::getQueryLog();
        DB::disableQueryLog();
        $this->assertLessThanOrEqual(30, count($queries));
    }
}
