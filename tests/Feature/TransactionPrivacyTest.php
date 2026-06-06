<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Listing;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TransactionPrivacyTest extends TestCase
{
    use RefreshDatabase;

    public function test_transaction_participants_can_see_each_others_full_names(): void
    {
        $buyer = User::factory()->create([
            'name' => 'Buyer Person',
            'postal_code' => '150-0002',
            'prefecture' => 'Tokyo',
            'city' => 'Shibuya',
            'address_line1' => '1-1-1 Shibuya',
            'address_line2' => 'Room 101',
            'phone' => '03-1111-2222',
        ]);
        $seller = User::factory()->create([
            'name' => 'Seller Person',
            'postal_code' => '160-0022',
            'prefecture' => 'Tokyo',
            'city' => 'Shinjuku',
            'address_line1' => '2-2-2 Shinjuku',
            'address_line2' => 'Suite 202',
            'phone' => '03-3333-4444',
        ]);
        $transaction = Transaction::create([
            'listing_id' => $this->createListing($seller)->id,
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'amount' => 1000,
            'status' => Transaction::STATUS_PENDING_PAYMENT,
        ]);

        $this->actingAs($buyer)
            ->get(route('transactions.show', $transaction))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('transactions/show')
                ->where('transaction.buyer.name', 'Buyer Person')
                ->where('transaction.seller.name', 'Seller Person')
                ->where('transaction.buyer.contact.first_name', 'Buyer')
                ->where('transaction.buyer.contact.family_name', 'Person')
                ->where('transaction.buyer.contact.postal_code', '150-0002')
                ->where('transaction.buyer.contact.address_line1', '1-1-1 Shibuya')
                ->where('transaction.buyer.contact.phone', '03-1111-2222')
                ->where('transaction.seller.contact.first_name', 'Seller')
                ->where('transaction.seller.contact.family_name', 'Person')
                ->where('transaction.seller.contact.postal_code', '160-0022')
                ->where('transaction.seller.contact.address_line1', '2-2-2 Shinjuku')
                ->where('transaction.seller.contact.phone', '03-3333-4444')
            );
    }

    public function test_transaction_viewers_outside_the_transaction_see_masked_names(): void
    {
        $buyer = User::factory()->create(['name' => 'Buyer Person']);
        $seller = User::factory()->create(['name' => 'Seller Person']);
        $transaction = Transaction::create([
            'listing_id' => $this->createListing($seller)->id,
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'amount' => 1000,
            'status' => Transaction::STATUS_PENDING_PAYMENT,
        ]);

        $this->actingAs(User::factory()->create())
            ->get(route('transactions.show', $transaction))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('transactions/show')
                ->where('transaction.buyer.name', 'B**** P****')
                ->where('transaction.seller.name', 'S**** P****')
                ->where('transaction.buyer.contact', null)
                ->where('transaction.seller.contact', null)
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
