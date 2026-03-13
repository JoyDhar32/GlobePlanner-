<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('destination');
            $table->string('destination_place_id')->nullable();
            $table->integer('travelers')->default(1);
            $table->integer('duration_days');
            $table->enum('category', ['standard', 'premium', 'luxury'])->default('standard');
            $table->enum('budget', ['low', 'medium', 'high'])->default('medium');
            $table->json('attractions')->nullable();
            $table->json('hotels')->nullable();
            $table->json('itinerary')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trips');
    }
};
