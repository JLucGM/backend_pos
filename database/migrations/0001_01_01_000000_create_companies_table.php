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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Nombre de la empresa, debe ser único
            $table->string('slug')->unique()->nullable(); // Para subdominios, opcional
            // $table->string('email');
            // $table->string('phone')->nullable();
            // $table->string('address')->nullable();
            $table->string('subdomain')->nullable();
            $table->string('domain')->nullable();
            $table->string('is_status')->nullable();
            // $table->foreignId('country_id')->nullable()->constrained();
            // $table->foreignId('state_id')->nullable()->constrained();
            // $table->foreignId('city_id')->nullable()->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
