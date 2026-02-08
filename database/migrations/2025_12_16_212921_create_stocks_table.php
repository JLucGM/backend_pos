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
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->integer('quantity')->default(0); //cantidad de productos entrantes o salida
            // $table->integer('reserved_quantity')->default(0)->comment('Cantidad reservada para pedidos pendientes');
            $table->string('product_barcode')->nullable();
            $table->string('product_sku')->nullable();
            
            $table->foreignId('store_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->nullable()->constrained(); //id del producto
            $table->foreignId('combination_id')->nullable()->constrained()->onDelete('cascade'); //id del producto
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};
