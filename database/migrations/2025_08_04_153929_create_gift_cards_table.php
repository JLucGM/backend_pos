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
        Schema::create('gift_cards', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // Código único de la tarjeta de regalo
            $table->string('slug')->unique();
            $table->text('description')->nullable(); // Descripción opcional de la tarjeta
            $table->decimal('initial_balance', 10, 2); // Saldo inicial de la tarjeta
            $table->decimal('current_balance', 10, 2); // Saldo actual de la tarjeta
            $table->date('expiration_date')->nullable(); // Fecha de vencimiento (opcional)
            $table->boolean('is_active')->default(false); // Indica si la tarjeta está activa
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade'); // Relación con la empresa
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null'); // Usuario que la compró o a quien se le asignó (opcional)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gift_cards');
    }
};
