<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Listing;
use App\Models\ListingReport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ListingReportTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_report_a_listing_for_admin_review(): void
    {
        $reporter = User::factory()->create();
        $listing = $this->listingFor(User::factory()->create());

        $this
            ->actingAs($reporter)
            ->post(route('listings.reports.store', $listing), [
                'reason' => 'fraud_or_scam',
                'details' => 'The listing asks for off-platform payment and appears to be fraudulent.',
                'acknowledged' => true,
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $this->assertDatabaseHas('listing_reports', [
            'listing_id' => $listing->id,
            'reporter_id' => $reporter->id,
            'reported_user_id' => $listing->user_id,
            'reason' => 'fraud_or_scam',
            'status' => ListingReport::STATUS_PENDING,
        ]);
    }

    public function test_listing_owner_cannot_report_their_own_listing(): void
    {
        $owner = User::factory()->create();
        $listing = $this->listingFor($owner);

        $this
            ->actingAs($owner)
            ->post(route('listings.reports.store', $listing), [
                'reason' => 'other',
                'details' => 'This should not be accepted because it is my own listing.',
                'acknowledged' => true,
            ])
            ->assertSessionHasErrors('report');

        $this->assertDatabaseCount('listing_reports', 0);
    }

    public function test_admin_can_view_reports(): void
    {
        $this->withoutVite();

        $admin = User::factory()->create(['email' => 'fuzalov@gmail.com']);
        $reporter = User::factory()->create();
        $listing = $this->listingFor(User::factory()->create());
        ListingReport::create([
            'listing_id' => $listing->id,
            'reporter_id' => $reporter->id,
            'reported_user_id' => $listing->user_id,
            'reason' => 'counterfeit',
            'details' => 'The item uses a protected brand name and the photos look copied.',
        ]);

        $this
            ->actingAs($admin)
            ->get(route('admin.reports.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/reports/index')
                ->has('reports.data', 1)
                ->where('counts.pending', 1)
            );
    }

    public function test_admin_can_moderate_listing_and_account_from_report(): void
    {
        $admin = User::factory()->create(['email' => 'fuzalov@gmail.com']);
        $seller = User::factory()->create();
        $reporter = User::factory()->create();
        $listing = $this->listingFor($seller);
        $report = ListingReport::create([
            'listing_id' => $listing->id,
            'reporter_id' => $reporter->id,
            'reported_user_id' => $seller->id,
            'reason' => 'prohibited_item',
            'details' => 'The listed item appears to be prohibited and should be removed.',
        ]);

        $this
            ->actingAs($admin)
            ->post(route('admin.reports.listing-action', $report), [
                'action' => 'take_down',
            ])
            ->assertRedirect();

        $this->assertSame('archived', $listing->refresh()->status);

        $this
            ->actingAs($admin)
            ->post(route('admin.reports.user-action', [$report, $seller]), [
                'action' => 'disable',
                'disabled_reason' => 'Repeated prohibited item reports.',
            ])
            ->assertRedirect();

        $seller->refresh();
        $this->assertNotNull($seller->disabled_at);
        $this->assertSame('Repeated prohibited item reports.', $seller->disabled_reason);
    }

    private function listingFor(User $user): Listing
    {
        $category = Category::create([
            'name' => 'Electronics',
            'slug' => 'electronics-'.uniqid(),
        ]);

        return Listing::factory()->create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'condition' => 'used_good',
        ]);
    }
}
