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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->enum('status', ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded'])->default('pending');
            $table->enum('payment_status', ['pending', 'paid'])->default('pending');
            $table->enum('delivery_type', ['pickup', 'delivery'])->default('delivery');
            $table->decimal('totaldiscounts', 10, 2)->default(0.00);
            $table->decimal('totalshipping', 10, 2)->default(0.00);
            $table->decimal('subtotal', 10, 2)->default(0.00);
            $table->decimal('total', 10, 2)->default(0.00);
            $table->decimal('tax_amount', 10, 2)->default(0.00); // Nuevo campo para el monto de impuestos
            $table->string('order_origin')->nullable();
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('payments_method_id')->nullable()->constrained();
            $table->foreignId('user_id')->nullable()->constrained();
            $table->foreignId('delivery_location_id')->nullable()->constrained('delivery_locations')->onDelete('set null');
            $table->foreignId('shipping_rate_id')->nullable()->constrained('shipping_rates')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
