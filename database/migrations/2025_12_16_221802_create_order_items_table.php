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
            $table->decimal('price_product', 10, 2)->default(0.00);
            $table->unsignedInteger('quantity');
            $table->decimal('subtotal', 10, 2)->default(0.00);
            $table->decimal('tax_amount', 10, 2)->default(0.00);
            $table->foreignId('order_id')->constrained()->onDelete('cascade'); // Una orden no debe existir sin sus items
            $table->foreignId('product_id')->nullable()->constrained()->onDelete('set null'); // Esta es la clave
            $table->foreignId('combination_id')->nullable()->constrained()->onDelete('set null'); // Y esta, si aplica
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
