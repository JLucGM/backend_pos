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
        Schema::create('inventory_transfer_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_transfer_id')->constrained()->onDelete('cascade');
            $table->string('status');
            $table->integer('shipped_quantity')->nullable();
            $table->integer('received_quantity')->nullable();
            $table->foreignId('user_id')->constrained();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_transfer_histories');
    }

};
