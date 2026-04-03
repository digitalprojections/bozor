<?php

namespace App\Notifications\Seller;

use App\Models\Listing;
use App\Models\Bid;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BidReceived extends Notification implements ShouldQueue
{
    use Queueable;

    protected $listing;
    protected $bid;

    /**
     * Create a new notification instance.
     */
    public function __construct(Listing $listing, Bid $bid)
    {
        $this->listing = $listing;
        $this->bid = $bid;
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
            ->subject('New bid on your listing: ' . $this->listing->title)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Great news! Someone just placed a bid of ¥' . number_format($this->bid->amount) . ' on your listing "' . $this->listing->title . '".')
            ->action('View Listing', route('listings.show', $this->listing->id))
            ->line('Keep an eye on your auction!');
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
            'bid_amount' => $this->bid->amount,
            'bidder_id' => $this->bid->user_id,
            'event' => 'bid_received',
        ];
    }
}
