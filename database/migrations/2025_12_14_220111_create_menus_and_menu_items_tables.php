<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ===================================
        // Tabla: menus
        // ===================================
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            // Asumiendo multi-tenant por tu tabla 'companies'
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade'); 
            $table->string('name'); // Ejemplo: "Menú Principal", "Enlaces Legales"
            $table->timestamps();
        });

        // ===================================
        // Tabla: menu_items
        // ===================================
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            // Clave foránea al menú padre
            $table->foreignId('menu_id')->constrained('menus')->onDelete('cascade');
            
            // Relación recursiva para submenús
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->foreign('parent_id')->references('id')->on('menu_items')->onDelete('cascade');

            $table->string('title'); // Texto que se muestra
            $table->string('url')->nullable(); // Destino del enlace
            $table->integer('order')->default(0); // Orden de los elementos
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_items');
        Schema::dropIfExists('menus');
    }
};
