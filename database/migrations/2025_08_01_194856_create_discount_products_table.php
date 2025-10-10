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
        Schema::create('discount_product', function (Blueprint $table) {  // O cambia a 'discount_products' para plural
            $table->id();
            $table->foreignId('discount_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('combination_id')->nullable()->constrained('combinations')->onDelete('set null');
            $table->timestamps();
            $table->unique(['discount_id', 'product_id', 'combination_id']);
            // Opcional: Especifica engine si hay problemas
            // $table->engine = 'InnoDB';
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discount_products');
    }
};
