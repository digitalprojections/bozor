<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ListingMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'listing_id',
        'questioner_id',
        'seller_id',
        'transaction_id',
        'question',
        'answer',
        'answered_at',
    ];

    protected $casts = [
        'answered_at' => 'datetime',
    ];

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }

    public function questioner()
    {
        return $this->belongsTo(User::class, 'questioner_id');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function scopeVisibleTo(Builder $query, ?User $user): Builder
    {
        return $query->where(function (Builder $query) use ($user) {
            $query->whereNull('transaction_id');

            if ($user) {
                $query->orWhere(function (Builder $query) use ($user) {
                    $query->whereNotNull('transaction_id')
                        ->where(function (Builder $query) use ($user) {
                            $query->where('questioner_id', $user->id)
                                ->orWhere('seller_id', $user->id);
                        });
                });
            }
        });
    }
}
