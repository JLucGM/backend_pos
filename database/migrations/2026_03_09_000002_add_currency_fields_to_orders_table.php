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
        Schema::table('orders', function (Blueprint $table) {
            // La moneda en la que se realizó la venta
            $table->foreignId('currency_id')->nullable()->constrained('currencies')->onDelete('set null');
            
            // Tasa capturada al momento de la venta
            $table->decimal('exchange_rate', 15, 8)->nullable();
            
            // Total en la moneda base para reportes unificados
            $table->decimal('total_base_currency', 10, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('currency_id');
            $table->dropColumn(['exchange_rate', 'total_base_currency']);
        });
    }
};
