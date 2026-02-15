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
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tournament_id')->constrained('tournaments')->onDelete('cascade');
            $table->foreignId('athlete1_id')->constrained('athletes')->onDelete('cascade');
            $table->foreignId('athlete2_id')->constrained('athletes')->onDelete('cascade');
            $table->string('category'); // 1, 2, 3, 4, 5, 6, 7, OPEN, MASTER, JUNIOR
            $table->string('status')->default('Registrado');
            $table->timestamps();

            // Un atleta no debería estar en dos duplas diferentes en el mismo torneo y categoría (opcional, dependiendo de reglas)
            // $table->unique(['tournament_id', 'athlete1_id', 'category']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};
