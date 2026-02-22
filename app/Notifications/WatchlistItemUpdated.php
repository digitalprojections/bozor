<?php

namespace App\Notifications;

use App\Models\Listing;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WatchlistItemUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    public Listing $listing;
    public array $changes;

    /**
     * Create a new notification instance.
     *
     * @param Listing $listing The updated listing.
     * @param array $changes Human-readable description of what changed, e.g. ['price' => ['old' => 1000, 'new' => 900]]
     */
    public function __construct(Listing $listing, array $changes)
    {
        $this->listing = $listing;
        $this->changes = $changes;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $listingUrl = url('/listings/' . $this->listing->id);
        $watchlistUrl = url('/watchlist');

        $mail = (new MailMessage)
            ->subject('Update on a listing you are watching: ' . $this->listing->title)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('A listing you are watching has been updated.');

        // Describe each change
        foreach ($this->changes as $field => $change) {
            if ($field === 'price') {
                $old = '¥' . number_format($change['old']);
                $new = '¥' . number_format($change['new']);
                $direction = $change['new'] < $change['old'] ? '⬇️ Price dropped!' : '⬆️ Price increased';
                $mail->line("{$direction} {$old} → {$new}");
            }
            elseif ($field === 'new_bid') {
                $amount = '¥' . number_format($change['amount']);
                $mail->line("🔔 A new bid of {$amount} has been placed on this auction.");
            }
            elseif ($field === 'status') {
                $mail->line('Status changed from "' . $change['old'] . '" to "' . $change['new'] . '".');
            }
            else {
                $mail->line(ucfirst(str_replace('_', ' ', $field)) . ' was updated.');
            }
        }

        return $mail
            ->action('View Listing', $listingUrl)
            ->line('You can manage your watchlist at any time.')
            ->salutation('— ' . config('app.name'));
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'listing_id' => $this->listing->id,
            'listing_title' => $this->listing->title,
            'changes' => $this->changes,
        ];
    }
}
