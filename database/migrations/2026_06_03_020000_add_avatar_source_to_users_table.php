<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasColumn('users', 'google_avatar')) {
            Schema::table('users', function (Blueprint $table) {
                $table->text('google_avatar')->nullable()->after('avatar');
            });
        }

        if (! Schema::hasColumn('users', 'avatar_source')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('avatar_source')->default('generated')->after('google_avatar');
            });
        }

        DB::table('users')
            ->whereNotNull('avatar')
            ->where(function ($query) {
                $query->where('avatar', 'like', 'http://%')
                    ->orWhere('avatar', 'like', 'https://%');
            })
            ->update([
                'google_avatar' => DB::raw('avatar'),
                'avatar_source' => 'google',
            ]);

        DB::table('users')
            ->whereNotNull('avatar')
            ->where('avatar', 'not like', 'http://%')
            ->where('avatar', 'not like', 'https://%')
            ->update(['avatar_source' => 'uploaded']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $columns = array_filter(
            ['google_avatar', 'avatar_source'],
            fn (string $column) => Schema::hasColumn('users', $column)
        );

        if ($columns) {
            Schema::table('users', function (Blueprint $table) use ($columns) {
                $table->dropColumn($columns);
            });
        }
    }
};
