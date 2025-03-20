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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->string('name_product');
            $table->string('price_product');
            $table->string('quantity');
            $table->string('subtotal');
            // $table->string('tax');
            $table->foreignId('order_id')->nullable()->constrained();
            // Eliminar las siguientes líneas:
            // $table->foreignId('product_id')->nullable()->constrained()->onDelete('set null');
            // $table->foreignId('combination_id')->nullable()->constrained()->onDelete('cascade');
            $table->json('product_details')->nullable(); // Nuevo campo para detalles del producto y combinación
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
