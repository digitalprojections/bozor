<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Listing;
use App\Models\Transaction;
use App\Models\User;
use App\Notifications\NewFollower;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProfileFollowTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_follow_another_user_and_followed_user_is_notified(): void
    {
        Notification::fake();

        $follower = User::factory()->create(['name' => 'Follower Person']);
        $followed = User::factory()->create(['name' => 'Followed Person']);

        $this->actingAs($follower)
            ->post(route('profile.follow', $followed))
            ->assertRedirect();

        $this->assertDatabaseHas('user_follows', [
            'follower_id' => $follower->id,
            'followed_id' => $followed->id,
        ]);

        Notification::assertSentTo($followed, NewFollower::class);

        $this->actingAs($follower)
            ->get(route('profile.show', $followed))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('profile/show')
                ->where('profileUser.followers_count', 1)
                ->where('profileUser.is_following', true)
                ->where('profileUser.followers.0.name', 'Follower Person')
            );
    }

    public function test_follower_names_are_masked_when_viewer_has_no_transaction_with_them(): void
    {
        $follower = User::factory()->create(['name' => 'Follower Person']);
        $followed = User::factory()->create(['name' => 'Followed Person']);
        $viewer = User::factory()->create();

        $follower->following()->attach($followed->id);

        $this->actingAs($viewer)
            ->get(route('profile.show', $followed))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('profile/show')
                ->where('profileUser.followers.0.name', 'F**** P****')
            );
    }

    public function test_follower_names_are_visible_when_viewer_has_transaction_with_them(): void
    {
        $follower = User::factory()->create(['name' => 'Follower Person']);
        $followed = User::factory()->create(['name' => 'Followed Person']);
        $viewer = User::factory()->create();

        $follower->following()->attach($followed->id);

        Transaction::create([
            'listing_id' => $this->createListing($follower)->id,
            'buyer_id' => $viewer->id,
            'seller_id' => $follower->id,
            'amount' => 1000,
            'status' => Transaction::STATUS_RECEIVED,
        ]);

        $this->actingAs($viewer)
            ->get(route('profile.show', $followed))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('profile/show')
                ->where('profileUser.followers.0.name', 'Follower Person')
            );
    }

    public function test_user_can_unfollow_another_user(): void
    {
        $follower = User::factory()->create();
        $followed = User::factory()->create();

        $follower->following()->attach($followed->id);

        $this->actingAs($follower)
            ->delete(route('profile.unfollow', $followed))
            ->assertRedirect();

        $this->assertDatabaseMissing('user_follows', [
            'follower_id' => $follower->id,
            'followed_id' => $followed->id,
        ]);
    }

    private function createListing(User $seller): Listing
    {
        $category = Category::create([
            'name' => 'Electronics',
            'slug' => 'electronics-'.uniqid(),
        ]);

        return Listing::factory()->create([
            'user_id' => $seller->id,
            'category_id' => $category->id,
        ]);
    }
}
