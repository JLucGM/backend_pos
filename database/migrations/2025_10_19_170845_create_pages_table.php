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
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('title')->comment('Título de la página');
            $table->string('slug')->comment('URL amigable de la página');
            $table->longText('content')->nullable()->comment('Contenido de la página');
            $table->longText('layout')->nullable()->comment('Diseño de la página en JSON');
            $table->boolean('is_deletable')->default(false)->comment('Página eliminable si es true');
            $table->boolean('is_editable')->default(false)->comment('Página editable si es true');
            $table->boolean('is_published')->default(false)->comment('Estado de publicación');
            $table->boolean('is_homepage')->default(false)->comment('Página de inicio');
            $table->integer('sort_order')->default(0)->comment('Orden de clasificación');
            $table->boolean('uses_template')->default(false)->comment('Indica si usa plantilla');
            $table->enum('page_type', ['essential','policy','custom','link_bio'])->nullable()->comment('Tipo de página para diferenciar entre páginas esenciales, políticas, personalizadas y de enlace bio');
             $table->json('theme_settings')->nullable()->comment('Copia de la configuración del tema para personalización');
            $table->foreignId('company_id')->constrained()->onDelete('cascade')->comment('ID de la empresa');
            $table->foreignId('template_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('theme_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
            $table->unique(['company_id', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};
