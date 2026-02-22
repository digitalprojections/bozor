<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->integer('buy_now_price')->nullable()->after('price');
            $table->boolean('is_auction')->default(false)->after('buy_now_price');
            $table->timestamp('auction_end_date')->nullable()->after('is_auction');
            $table->integer('current_high_bid')->default(0)->after('auction_end_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn(['buy_now_price', 'is_auction', 'auction_end_date', 'current_high_bid']);
        });
    }
};
