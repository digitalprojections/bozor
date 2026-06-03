<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    public const TYPE_BUY_NOW = 'buy_now';

    public const TYPE_AUCTION = 'auction';

    public const STATUS_PENDING_PAYMENT = 'pending_payment';

    public const STATUS_PAID = 'paid';

    public const STATUS_SHIPPED = 'shipped';

    public const STATUS_DELIVERED = 'delivered';

    public const STATUS_RECEIVED = 'received';

    public const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'listing_id',
        'buyer_id',
        'seller_id',
        'transaction_package_id',
        'amount',
        'status',
        'purchase_type',
        'tracking_number',
        'shipping_method',
        'paid_at',
        'shipped_at',
        'delivered_at',
        'received_at',
        'completed_at',
    ];

    protected $casts = [
        'amount' => 'integer',
        'paid_at' => 'datetime',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
        'received_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function package()
    {
        return $this->belongsTo(TransactionPackage::class, 'transaction_package_id');
    }
}
