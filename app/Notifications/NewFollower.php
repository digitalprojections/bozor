<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewFollower extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly User $follower,
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $followerName = $notifiable instanceof User && $notifiable->hasTransactionWith($this->follower)
            ? $this->follower->name
            : $this->follower->masked_name;

        return (new MailMessage)
            ->subject('You have a new follower on Bozor Japan')
            ->greeting('Hello '.$notifiable->name.'!')
            ->line($followerName.' started following you.')
            ->action('View Profile', route('profile.show', $this->follower->id))
            ->line('Bozor Japan - Your marketplace for everything.');
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $followerName = $notifiable instanceof User && $notifiable->hasTransactionWith($this->follower)
            ? $this->follower->name
            : $this->follower->masked_name;

        return [
            'event' => 'new_follower',
            'follower_id' => $this->follower->id,
            'follower_name' => $followerName,
        ];
    }
}
