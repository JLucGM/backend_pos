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
        Schema::create('company_currencies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('currency_id')->constrained()->onDelete('cascade');
            
            // La tasa de cambio respecto a la moneda base (ej. 1 USD = 45.50 VES)
            $table->decimal('exchange_rate', 15, 8)->default(1.00000000);
            
            // Gestión de roles de la moneda
            $table->boolean('is_base')->default(false); // Moneda en la que se definen precios (ej. USD)
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
            
            // Unicidad por empresa y moneda
            $table->unique(['company_id', 'currency_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_currencies');
    }
};
