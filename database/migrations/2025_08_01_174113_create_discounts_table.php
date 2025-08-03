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
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->enum('discount_type', ['percentage', 'fixed_amount']); // 'percentage' o 'fixed_amount'
            $table->decimal('value', 8, 2); // Valor del descuento (ej. 10 para 10%, 5.00 para $5)
            $table->enum('applies_to', ['product', 'category', 'order_total']); // 'product', 'category', 'order_total'
            $table->timestamp('start_date')->nullable();
            $table->boolean('automatic')->default(false);
            $table->timestamp('end_date')->nullable();
            $table->decimal('minimum_order_amount', 10, 2)->nullable(); // Monto mínimo de pedido para aplicar el descuento
            $table->integer('usage_limit')->nullable(); // Límite de usos del descuento
            $table->string('code')->unique()->nullable(); // Código del cupón
            $table->boolean('is_active')->default(false);
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discounts');
    }
};
