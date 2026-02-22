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
        Schema::create('ratings', function (Blueprint $col) {
            $col->id();
            $col->foreignId('transaction_id')->constrained()->cascadeOnDelete();
            $col->foreignId('rater_id')->constrained('users')->cascadeOnDelete();
            $col->foreignId('rated_user_id')->constrained('users')->cascadeOnDelete();
            $col->unsignedTinyInteger('score'); // 1-5
            $col->text('comment')->nullable();
            $col->timestamps();

            // Ensure one user can only rate another once per transaction
            $col->unique(['transaction_id', 'rater_id', 'rated_user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};
