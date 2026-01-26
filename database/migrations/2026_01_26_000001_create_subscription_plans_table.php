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
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Básico, Pro, Premium
            $table->string('slug')->unique(); // basic, pro, premium
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2); // Precio mensual
            $table->decimal('yearly_price', 10, 2)->nullable(); // Precio anual (opcional)
            $table->string('currency', 3)->default('USD');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_trial')->default(false); // Plan de prueba gratuito
            $table->boolean('is_featured')->default(false); // Plan destacado/popular
            $table->integer('trial_days')->default(0); // Días de prueba
            $table->json('features')->nullable(); // Características del plan en JSON
            $table->json('limits')->nullable(); // Límites del plan (órdenes, productos, etc.)
            $table->integer('sort_order')->default(0); // Orden de visualización
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
    }
};