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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('product_name', 255);
            $table->string('slug');
            $table->text('product_description')->nullable();
            $table->string('product_price');
            // $table->integer('product_barcode')->nullable();
            // $table->string('product_sku')->nullable();
            $table->string('product_price_discount')->nullable();
            $table->tinyInteger('status')->default(1);
            $table->tinyInteger('product_status_pos')->default(0);
            $table->foreignId('tax_id')->nullable()->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
