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
        Schema::create('combination_attribute_value', function (Blueprint $table) {
            $table->id();
            $table->foreignId('combination_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('attribute_value_id')->nullable()->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('combination_attribute_value');
    }
};
