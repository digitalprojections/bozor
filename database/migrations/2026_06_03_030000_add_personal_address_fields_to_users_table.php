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
        Schema::table('users', function (Blueprint $table) {
            $table->string('postal_code')->nullable()->after('store_banner');
            $table->string('prefecture')->nullable()->after('postal_code');
            $table->string('city')->nullable()->after('prefecture');
            $table->string('address_line1')->nullable()->after('city');
            $table->string('address_line2')->nullable()->after('address_line1');
            $table->string('phone')->nullable()->after('address_line2');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'postal_code',
                'prefecture',
                'city',
                'address_line1',
                'address_line2',
                'phone',
            ]);
        });
    }
};
