<?php

namespace Tests\Feature;

use App\Models\Listing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicListingLikesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        \App\Models\Category::create(['name' => 'Test', 'slug' => 'test']);
    }

    public function test_visitors_see_real_counts_without_watcher_identities(): void
    {
        $this->withoutVite();
        $listing = Listing::factory()->create(['status' => 'active']);
        $listing->watchedBy()->attach(User::factory()->count(2)->create()->modelKeys());
        $this->get('/marketplace')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->where('listings.data.0.watched_by_count', 2)
            ->missing('listings.data.0.watched_by'));
        $this->get('/listings/'.$listing->id)->assertOk()->assertInertia(fn (Assert $page) => $page
            ->where('listing.watched_by_count', 2)->missing('listing.watched_by'));
    }

    public function test_toggle_returns_authoritative_count_and_removal_restores_it(): void
    {
        Notification::fake();
        $listing = Listing::factory()->create(['status' => 'active']);
        $user = User::factory()->create();
        $this->actingAs($user)->postJson('/watchlist/'.$listing->id.'/toggle')
            ->assertOk()->assertJsonPath('is_watched', true)->assertJsonPath('watched_by_count', 1);
        $this->postJson('/watchlist/'.$listing->id.'/toggle')
            ->assertOk()->assertJsonPath('is_watched', false)->assertJsonPath('watched_by_count', 0);
        $this->assertDatabaseCount('watchlists', 0);
    }

    public function test_zero_is_public_and_unauthenticated_users_cannot_add_likes(): void
    {
        $this->withoutVite();
        $listing = Listing::factory()->create(['status' => 'active']);
        $this->get('/marketplace')->assertInertia(fn (Assert $page) => $page
            ->where('listings.data.0.watched_by_count', 0));
        $this->post('/watchlist/'.$listing->id.'/toggle')->assertRedirect();
        $this->assertDatabaseCount('watchlists', 0);
    }
}
