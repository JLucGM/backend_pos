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
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Nombre de la plantilla');
            $table->string('slug')->unique()->comment('Slug único para la plantilla');
            $table->text('description')->nullable()->comment('Descripción de la plantilla');
            $table->json('layout_structure')->nullable()->comment('Estructura base en JSON');
            $table->json('default_blocks')->nullable()->comment('Bloques predefinidos');
            $table->boolean('is_global')->default(false)->comment('Plantilla disponible para todos');
            $table->foreignId('theme_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->index(['company_id', 'is_global']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('templates');
    }
};
