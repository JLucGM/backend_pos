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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('slug');

            $table->morphs('payable');
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['pending', 'completed', 'failed']);
            
            $table->foreignId('user_id')->constrained();
            $table->foreignId('payments_method_id')->nullable()->constrained();
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamps();
            // $table->index(['payable_type', 'payable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
