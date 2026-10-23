<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const INDEXES = [
        'users' => ['is_guest', 'created_at'],
        'listings' => ['listing_type', 'deleted_at', 'created_at'],
        'transactions' => ['created_at'],
        'bids' => ['created_at'],
        'ad_orders' => ['created_at'],
        'listing_messages' => ['created_at'],
        'ratings' => ['created_at'],
        'feature_requests' => ['created_at'],
    ];

    public function up(): void
    {
        foreach (self::INDEXES as $name => $columns) {
            Schema::table($name, fn (Blueprint $table) => $table->index($columns, 'stats_'.$name.'_created'));
        }
    }

    public function down(): void
    {
        foreach (self::INDEXES as $name => $columns) {
            Schema::table($name, fn (Blueprint $table) => $table->dropIndex('stats_'.$name.'_created'));
        }
    }
};
