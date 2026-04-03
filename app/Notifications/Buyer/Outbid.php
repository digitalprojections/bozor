<?php

namespace App\Notifications\Buyer;

use App\Models\Listing;
use App\Models\Bid;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class Outbid extends Notification implements ShouldQueue
{
    use Queueable;

    protected $listing;
    protected $newBid;

    /**
     * Create a new notification instance.
     */
    public function __construct(Listing $listing, Bid $newBid)
    {
        $this->listing = $listing;
        $this->newBid = $newBid;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('You have been outbid! ' . $this->listing->title)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Someone has placed a higher bid on "' . $this->listing->title . '".')
            ->line('Current high bid: ¥' . number_format($this->newBid->amount) . '.')
            ->action('Place a Higher Bid', route('listings.show', $this->listing->id))
            ->line('Don\'t let this one get away!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'listing_id' => $this->listing->id,
            'listing_title' => $this->listing->title,
            'new_bid_amount' => $this->newBid->amount,
            'new_bid_id' => $this->newBid->id,
            'event' => 'outbid',
        ];
    }
}
