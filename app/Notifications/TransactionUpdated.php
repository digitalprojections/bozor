<?php

namespace App\Notifications;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TransactionUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    protected $transaction;
    protected $status;
    protected $role; // 'seller' or 'buyer'

    /**
     * Create a new notification instance.
     */
    public function __construct(Transaction $transaction, string $status, string $role)
    {
        $this->transaction = $transaction;
        $this->status = $status;
        $this->role = $role;
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
        $listingTitle = $this->transaction->listing->title;
        $mail = (new MailMessage)
            ->subject('Transaction Update: ' . $listingTitle)
            ->greeting('Hello ' . $notifiable->name . '!');

        if ($this->role === 'seller') {
            switch ($this->status) {
                case Transaction::STATUS_PAID:
                    $mail->line('Good news! The buyer has marked the item "' . $listingTitle . '" as paid.')
                         ->line('Please verify the payment and proceed with shipping.');
                    break;
                case Transaction::STATUS_RECEIVED:
                    $mail->line('Transaction Completed! The buyer has received the item "' . $listingTitle . '".')
                         ->line('We hope you had a great selling experience!');
                    break;
                case Transaction::STATUS_CANCELLED:
                    $mail->line('Account notification: The transaction for "' . $listingTitle . '" has been cancelled by the buyer.');
                    break;
            }
        } elseif ($this->role === 'buyer') {
            switch ($this->status) {
                case Transaction::STATUS_SHIPPED:
                    $mail->line('Great news! The seller has shipped your item "' . $listingTitle . '".')
                         ->line('Shipping method: ' . ($this->transaction->shipping_method ?? 'Standard'))
                         ->line('Tracking number: ' . ($this->transaction->tracking_number ?? 'Not provided'));
                    break;
                case Transaction::STATUS_CANCELLED:
                    $mail->line('Account notification: The transaction for "' . $listingTitle . '" has been cancelled by the seller.');
                    break;
            }
        }

        return $mail->action('View Transaction', route('transactions.show', $this->transaction->id))
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
            'transaction_id' => $this->transaction->id,
            'listing_id' => $this->transaction->listing_id,
            'listing_title' => $this->transaction->listing->title,
            'status' => $this->status,
            'role' => $this->role,
            'event' => 'transaction_updated',
        ];
    }
}
