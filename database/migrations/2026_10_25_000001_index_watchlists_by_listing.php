<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('watchlists', fn (Blueprint $table) => $table->index('listing_id', 'watchlists_listing_count_index'));
    }

    public function down(): void
    {
        Schema::table('watchlists', fn (Blueprint $table) => $table->dropIndex('watchlists_listing_count_index'));
    }
};
