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
            $table->string('listing_type')->default('item')->after('status')->index();
            $table->string('ad_placement')->nullable()->after('listing_type')->index();
            $table->string('ad_target_url')->nullable()->after('ad_placement');
            $table->timestamp('ad_starts_at')->nullable()->after('ad_target_url')->index();
            $table->timestamp('ad_ends_at')->nullable()->after('ad_starts_at')->index();
            $table->unsignedInteger('ad_priority')->default(0)->after('ad_ends_at');
            $table->unsignedInteger('ad_price_jpy')->nullable()->after('ad_priority');
            $table->unsignedInteger('ad_budget_jpy')->nullable()->after('ad_price_jpy');
            $table->unsignedBigInteger('ad_impressions')->default(0)->after('ad_budget_jpy');
            $table->unsignedBigInteger('ad_clicks')->default(0)->after('ad_impressions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn([
                'listing_type',
                'ad_placement',
                'ad_target_url',
                'ad_starts_at',
                'ad_ends_at',
                'ad_priority',
                'ad_price_jpy',
                'ad_budget_jpy',
                'ad_impressions',
                'ad_clicks',
            ]);
        });
    }
};
