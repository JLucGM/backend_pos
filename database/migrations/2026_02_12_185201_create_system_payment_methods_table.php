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
        Schema::create('system_payment_methods', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // ej: "PayPal", "Stripe", "Pago Móvil"
            $table->string('slug')->unique(); // ej: "paypal", "stripe", "mobile-payment"
            $table->enum('type', ['paypal', 'stripe', 'bank_transfer', 'mobile_payment', 'other']);
            $table->text('description')->nullable(); // Descripción visible para usuarios
            $table->text('instructions')->nullable(); // Instrucciones de pago
            $table->json('bank_info')->nullable(); // Información bancaria (cuenta, titular, RIF, etc.)
            $table->string('icon')->nullable(); // Clase de ícono: 'smartphone', 'building', 'credit-card'
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_payment_methods');
    }
};
