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
        Schema::create('themes', function (Blueprint $table) {
             $table->id();
            $table->string('name')->unique(); // Nombre del tema, por ejemplo "Tema Minimalista"
            $table->string('slug')->unique(); // Identificador único para URL o referencia
            $table->text('description')->nullable(); // Descripción opcional del tema
            $table->json('settings')->nullable(); // Configuraciones específicas del tema en formato JSON
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('themes');
    }
};
