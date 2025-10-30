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
        Schema::create('refund_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('refund_id')->constrained()->onDelete('cascade');
            $table->foreignId('order_item_id')->constrained()->onDelete('cascade');
            $table->integer('quantity');
            $table->enum('restock_action', ['return_to_stock', 'discard', 'none'])->default('none');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('refund_items');
    }
};
