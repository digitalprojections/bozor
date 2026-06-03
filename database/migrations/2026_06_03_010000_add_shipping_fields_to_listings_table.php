<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->string('shipping_payer')->default('seller')->after('location');
            $table->string('shipping_method')->default('kuroneko_yamato')->after('shipping_payer');
            $table->string('shipping_cost_type')->default('free')->after('shipping_method');
            $table->integer('shipping_cost')->nullable()->after('shipping_cost_type');
        });
    }

    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn([
                'shipping_payer',
                'shipping_method',
                'shipping_cost_type',
                'shipping_cost',
            ]);
        });
    }
};
