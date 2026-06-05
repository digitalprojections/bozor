<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Listing;
use App\Models\ListingMessage;
use App\Models\Transaction;
use App\Models\User;
use App\Notifications\MessageReceived;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ListingMessageTest extends TestCase
{
    use RefreshDatabase;

    public function test_listing_questions_are_public_before_purchase(): void
    {
        Notification::fake();

        $seller = User::factory()->create();
        $buyer = User::factory()->create(['name' => 'Buyer Person']);
        $viewer = User::factory()->create();
        $listing = $this->createListing($seller);

        $this->actingAs($buyer)
            ->post(route('listings.messages.store', $listing), [
                'question' => 'Is pickup available?',
            ])
            ->assertSessionHasNoErrors();

        Notification::assertSentTo($seller, MessageReceived::class);

        $this->actingAs($viewer)
            ->get(route('listings.show', $listing))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('messages', 1)
                ->where('messages.0.question', 'Is pickup available?')
                ->where('messages.0.questioner.name', 'B**** P****')
            );
    }

    public function test_buying_listing_moves_buyer_questions_to_private_transaction_thread(): void
    {
        Notification::fake();

        $seller = User::factory()->create();
        $buyer = User::factory()->create();
        $viewer = User::factory()->create();
        $listing = $this->createListing($seller, [
            'price' => 4500,
            'buy_now_price' => null,
            'is_auction' => false,
        ]);

        $message = ListingMessage::create([
            'listing_id' => $listing->id,
            'questioner_id' => $buyer->id,
            'seller_id' => $seller->id,
            'question' => 'Can you ship tomorrow?',
        ]);

        $this->actingAs($buyer)->post(route('listings.buy-now', $listing));
        $transaction = Transaction::firstOrFail();

        $this->assertSame($transaction->id, $message->fresh()->transaction_id);

        $this->actingAs($viewer)
            ->get(route('listings.show', $listing))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('messages', 0)
            );

        $this->actingAs($buyer)
            ->get(route('transactions.show', $transaction))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('transaction.messages', 1)
                ->where('transaction.messages.0.question', 'Can you ship tomorrow?')
            );
    }

    public function test_only_seller_can_answer_a_message(): void
    {
        Notification::fake();

        $seller = User::factory()->create();
        $buyer = User::factory()->create();
        $other = User::factory()->create();
        $listing = $this->createListing($seller);
        $message = ListingMessage::create([
            'listing_id' => $listing->id,
            'questioner_id' => $buyer->id,
            'seller_id' => $seller->id,
            'question' => 'Any scratches?',
        ]);

        $this->actingAs($other)
            ->patch(route('listing-messages.answer', $message), [
                'answer' => 'No.',
            ])
            ->assertForbidden();

        $this->actingAs($seller)
            ->patch(route('listing-messages.answer', $message), [
                'answer' => 'No visible scratches.',
            ])
            ->assertSessionHasNoErrors();

        $this->assertSame('No visible scratches.', $message->fresh()->answer);
        Notification::assertSentTo($buyer, MessageReceived::class);
    }

    public function test_private_transaction_messages_require_the_buyer(): void
    {
        Notification::fake();

        $seller = User::factory()->create();
        $buyer = User::factory()->create();
        $other = User::factory()->create();
        $transaction = Transaction::create([
            'listing_id' => $this->createListing($seller)->id,
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'amount' => 1000,
            'status' => Transaction::STATUS_PENDING_PAYMENT,
        ]);

        $this->actingAs($seller)
            ->post(route('transactions.messages.store', $transaction), [
                'question' => 'Seller cannot open new question rows.',
            ])
            ->assertForbidden();

        $this->actingAs($other)
            ->post(route('transactions.messages.store', $transaction), [
                'question' => 'Can I join?',
            ])
            ->assertForbidden();

        $this->actingAs($buyer)
            ->post(route('transactions.messages.store', $transaction), [
                'question' => 'Please send the tracking number here.',
            ])
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('listing_messages', [
            'transaction_id' => $transaction->id,
            'question' => 'Please send the tracking number here.',
        ]);
    }

    private function createListing(User $seller, array $attributes = []): Listing
    {
        $category = Category::create([
            'name' => 'Electronics',
            'slug' => 'electronics-'.uniqid(),
        ]);

        return Listing::factory()->create(array_merge([
            'user_id' => $seller->id,
            'category_id' => $category->id,
            'condition' => 'used_good',
            'status' => 'active',
        ], $attributes));
    }
}
