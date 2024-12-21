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
        Schema::create('payments_method_details', function (Blueprint $table) {
            $table->id();
            $table->string('data_types'); //Tipo de dato (email, cuenta, banco, etc.).
            $table->string('value'); // Valor del tipo de dato (joedoe@mail.com, 1223456, Bank of america, etc)
            $table->foreignId('payments_method_id')->nullable()->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments_method_details');
    }
};
