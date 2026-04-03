<?php

namespace App\Notifications\Seller;

use App\Models\Listing;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewWatcher extends Notification implements ShouldQueue
{
    use Queueable;

    protected $listing;
    protected $watcher;

    /**
     * Create a new notification instance.
     */
    public function __construct(Listing $listing, User $watcher)
    {
        $this->listing = $listing;
        $this->watcher = $watcher;
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
            ->subject('Someone is watching your listing: ' . $this->listing->title)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Someone just added your listing "' . $this->listing->title . '" to their watchlist.')
            ->action('View Listing', route('listings.show', $this->listing->id))
            ->line('Bozor Japan - Your marketplace for everything.');
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
            'watcher_id' => $this->watcher->id,
            'watcher_name' => $this->watcher->name,
            'event' => 'new_watcher',
        ];
    }
}
