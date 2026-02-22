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
        Schema::table('transactions', function (Blueprint $table) {
            // Change status from enum to string for more flexibility if needed, 
            // but for now we'll just keep adding fields to support the stepper.
            $table->string('tracking_number')->nullable()->after('status');
            $table->string('shipping_method')->nullable()->after('tracking_number');

            $table->timestamp('paid_at')->nullable()->after('shipping_method');
            $table->timestamp('shipped_at')->nullable()->after('paid_at');
            $table->timestamp('delivered_at')->nullable()->after('shipped_at');
            $table->timestamp('received_at')->nullable()->after('delivered_at');

        // Update status default or allowed values if necessary. 
        // Existing: ['pending', 'completed', 'cancelled']
        // We can treat 'completed' as 'received' for backward compatibility.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn([
                'tracking_number',
                'shipping_method',
                'paid_at',
                'shipped_at',
                'delivered_at',
                'received_at'
            ]);
        });
    }
};
