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
        Schema::create('subscription_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_id')->constrained()->onDelete('cascade');
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->string('payment_method'); // paypal, stripe, offline
            $table->string('payment_provider')->nullable(); // PayPal, Stripe, etc.
            $table->string('transaction_id')->nullable(); // ID de la transacción externa
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('USD');
            $table->enum('status', ['pending', 'completed', 'failed', 'cancelled', 'refunded'])->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->json('payment_data')->nullable(); // Datos adicionales del pago
            $table->text('notes')->nullable(); // Notas para pagos offline
            $table->timestamps();

            // Índices
            $table->index(['subscription_id', 'status']);
            $table->index(['company_id', 'status']);
            $table->index('transaction_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_payments');
    }
};