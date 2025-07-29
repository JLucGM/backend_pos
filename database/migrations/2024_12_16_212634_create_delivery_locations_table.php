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
        Schema::create('delivery_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // El usuario que crea la dirección
            $table->string('address_line_1'); // Calle y número
            $table->string('address_line_2')->nullable(); // Apartamento, suite, etc.
            $table->string('postal_code')->nullable();
            $table->string('phone_number')->nullable(); // Número de teléfono para la entrega
            $table->string('notes')->nullable(); // Notas adicionales para el delivery
            $table->boolean('is_default')->default(false); // Si es la dirección predeterminada del usuario
            $table->foreignId('country_id')->nullable()->constrained();
            $table->foreignId('state_id')->nullable()->constrained();
            $table->foreignId('city_id')->nullable()->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delivery_locations');
    }
};
