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
            $table->string('title');
            $table->string('slug');
            $table->longText('content'); // JSON Craft.js
            $table->boolean('is_default')->default(false); // Página protegida si son true
            $table->boolean('is_published')->default(true);
            $table->boolean('is_homepage')->default(false);
            $table->integer('sort_order')->default(0);
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
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
