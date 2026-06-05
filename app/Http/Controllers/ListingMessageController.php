<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\ListingMessage;
use App\Models\Transaction;
use App\Notifications\MessageReceived;
use Illuminate\Http\Request;
use Throwable;

class ListingMessageController extends Controller
{
    public function storeForListing(Request $request, Listing $listing)
    {
        $this->ensureCanAskPublicQuestion($request, $listing);

        $validated = $request->validate([
            'question' => ['required', 'string', 'max:2000'],
        ]);

        $message = ListingMessage::create([
            'listing_id' => $listing->id,
            'questioner_id' => $request->user()->id,
            'seller_id' => $listing->user_id,
            'question' => $validated['question'],
        ]);

        $this->notifySafely($listing->user, new MessageReceived($message, 'listing_question_created'));

        return back()->with('success', __('Your question was sent.'));
    }

    public function storeForTransaction(Request $request, Transaction $transaction)
    {
        $this->ensureParticipant($request, $transaction);

        if ((int) $request->user()->id !== (int) $transaction->buyer_id) {
            abort(403);
        }

        $validated = $request->validate([
            'question' => ['required', 'string', 'max:2000'],
        ]);

        $message = ListingMessage::create([
            'listing_id' => $transaction->listing_id,
            'questioner_id' => $transaction->buyer_id,
            'seller_id' => $transaction->seller_id,
            'transaction_id' => $transaction->id,
            'question' => $validated['question'],
        ]);

        $transaction->loadMissing('seller');
        $this->notifySafely($transaction->seller, new MessageReceived($message, 'listing_question_created'));

        return back()->with('success', __('Your message was sent.'));
    }

    public function answer(Request $request, ListingMessage $message)
    {
        if ((int) $request->user()->id !== (int) $message->seller_id) {
            abort(403);
        }

        if ($message->transaction_id) {
            $message->loadMissing('transaction');
            $this->ensureParticipant($request, $message->transaction);
        }

        $validated = $request->validate([
            'answer' => ['required', 'string', 'max:2000'],
        ]);

        $message->update([
            'answer' => $validated['answer'],
            'answered_at' => now(),
        ]);

        $message->loadMissing('questioner');
        $this->notifySafely($message->questioner, new MessageReceived($message, 'listing_question_answered'));

        return back()->with('success', __('Your answer was sent.'));
    }

    private function ensureCanAskPublicQuestion(Request $request, Listing $listing): void
    {
        if ((int) $listing->user_id === (int) $request->user()->id) {
            abort(403);
        }

        if ($listing->status !== 'active') {
            abort(409, __('Questions on sold listings are private to the buyer and seller.'));
        }
    }

    private function ensureParticipant(Request $request, Transaction $transaction): void
    {
        if (! in_array((int) $request->user()->id, [(int) $transaction->buyer_id, (int) $transaction->seller_id], true)) {
            abort(403);
        }
    }

    private function notifySafely($notifiable, $notification): void
    {
        try {
            $notifiable->notify($notification);
        } catch (Throwable $exception) {
            report($exception);
        }
    }
}
