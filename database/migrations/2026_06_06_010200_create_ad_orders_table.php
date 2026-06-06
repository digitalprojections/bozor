<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ad_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ad_campaign_id')->unique()->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->unsignedInteger('amount_jpy');
            $table->string('status')->default('unpaid')->index();
            $table->string('payment_reference')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->foreignId('confirmed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ad_orders');
    }
};
