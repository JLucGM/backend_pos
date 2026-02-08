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
        Schema::create('shipping_rates', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255); // Nombre de la tarifa, e.g., "Estandar"
            $table->string('slug')->unique();
            $table->decimal('price', 10, 2)->default(0.00); // Precio de la tarifa, e.g., 2.00
            $table->text('description')->nullable(); // Descripción, e.g., "Cubre zonas urbanas y suburbs"
            $table->boolean('is_active')->default(false);
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade'); // Asignado a empresa, como en products
            $table->foreignId('store_id')->nullable()->constrained()->onDelete('cascade');

            $table->timestamps();
            // Restricciones para unicidad por empresa
            $table->unique(['name', 'company_id']);
            $table->index('company_id'); // Para consultas rápidas por empresa
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping_rates');
    }
};
