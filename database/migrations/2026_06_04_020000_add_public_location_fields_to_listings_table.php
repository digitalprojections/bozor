<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->string('public_prefecture')->nullable()->after('location');
            $table->string('public_city')->nullable()->after('public_prefecture');
        });

        DB::statement(
            'update listings set public_prefecture = (select users.prefecture from users where users.id = listings.user_id), public_city = (select users.city from users where users.id = listings.user_id) where public_prefecture is null and public_city is null'
        );
    }

    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn(['public_prefecture', 'public_city']);
        });
    }
};
