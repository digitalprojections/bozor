<?php

namespace App\Notifications\Seller;

use App\Models\Listing;
use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ListingSold extends Notification implements ShouldQueue
{
    use Queueable;

    protected $listing;
    protected $transaction;

    /**
     * Create a new notification instance.
     */
    public function __construct(Listing $listing, Transaction $transaction)
    {
        $this->listing = $listing;
        $this->transaction = $transaction;
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
        $price = $this->transaction->amount;

        return (new MailMessage)
            ->subject('Congratulations! Your item has been sold: ' . $this->listing->title)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Your listing "' . $this->listing->title . '" has been sold for ¥' . number_format($price) . '.')
            ->line('Please check the transaction details and keep an eye out for payment confirmation.')
            ->action('View Transaction', route('transactions.show', $this->transaction->id))
            ->line('Thank you for selling on Bozor Japan!');
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
            'transaction_id' => $this->transaction->id,
            'amount' => $this->transaction->amount,
            'buyer_id' => $this->transaction->buyer_id,
            'event' => 'listing_sold',
        ];
    }
}
