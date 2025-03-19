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
            $table->string('status'); 
            $table->string('totaldiscounts');
            $table->string('subtotal');
            $table->string('total');
            $table->string('direction_delivery')->nullable();
            // $table->string('payment_status')->nullable();
            $table->string('order_origin')->nullable();
            $table->foreignId('payments_method_id')->nullable()->constrained();
            $table->foreignId('user_id')->nullable()->constrained();
            $table->foreignId('client_id')->nullable()->constrained();
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
