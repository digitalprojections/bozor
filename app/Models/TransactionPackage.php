<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionPackage extends Model
{
    protected $fillable = [
        'buyer_id',
        'seller_id',
        'shipping_cost_type',
        'shipping_cost',
        'shipping_method',
        'tracking_number',
        'shipped_at',
        'delivered_at',
        'received_at',
    ];

    protected $casts = [
        'shipping_cost' => 'integer',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
        'received_at' => 'datetime',
    ];

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
