<?php

namespace App\Notifications;

use App\Models\ListingMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class MessageReceived extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly ListingMessage $message,
        private readonly string $event,
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $this->message->loadMissing('listing', 'questioner', 'seller');

        return [
            'event' => $this->event,
            'message_id' => $this->message->id,
            'listing_id' => $this->message->listing_id,
            'listing_title' => $this->message->listing->title,
            'transaction_id' => $this->message->transaction_id,
            'questioner_id' => $this->message->questioner_id,
            'seller_id' => $this->message->seller_id,
            'sender_name' => $this->event === 'listing_question_answered'
                ? $this->message->seller->masked_name
                : $this->message->questioner->masked_name,
        ];
    }
}
