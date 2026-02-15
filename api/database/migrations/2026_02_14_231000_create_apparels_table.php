<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('apparels', function (Blueprint $table) {
            $table->id();
            $table->string('shirt_id')->unique(); // El ID de la franela (ej. 0102)
            $table->foreignId('athlete_id')->nullable()->unique()->constrained('athletes')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('apparels');
    }
};
