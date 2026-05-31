<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Listing;
use App\Models\Rating;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProfilePrivacyTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_profile_masks_user_and_rating_names_for_other_users(): void
    {
        $profileUser = User::factory()->create(['name' => 'Alice Seller']);
        $rater = User::factory()->create(['name' => 'Bob Buyer']);

        $transaction = Transaction::create([
            'listing_id' => $this->createListing($profileUser)->id,
            'buyer_id' => $rater->id,
            'seller_id' => $profileUser->id,
            'amount' => 1000,
            'status' => Transaction::STATUS_RECEIVED,
        ]);

        Rating::create([
            'transaction_id' => $transaction->id,
            'rater_id' => $rater->id,
            'rated_user_id' => $profileUser->id,
            'score' => 5,
        ]);

        $this->actingAs(User::factory()->create())
            ->get(route('profile.show', $profileUser))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('profile/show')
                ->where('profileUser.name', 'A**** S****')
                ->where('profileUser.received_ratings.0.rater.name', 'B**** B****')
            );
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
