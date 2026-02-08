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
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255); //Nombre del atributo (por ejemplo, "Talla", "Color", "Material").
            $table->string('slug');
            $table->string('phone')->nullable();

            $table->boolean('is_ecommerce_active')->default(false)->comment('Permite activar en ecommerce');
            $table->boolean('allow_delivery')->default(false)->comment('Permite envío a esta tienda');
            $table->boolean('allow_pickup')->default(false)->comment('Permite recogida en tienda');
            $table->boolean('allow_shipping')->default(false)->comment('Permite envío por correo a esta tienda');
            // $table->boolean('is_active')->default(false)->comment('Tienda activa o inactiva');

            $table->text('address')->nullable();
            $table->foreignId('country_id')->nullable()->constrained();
            $table->foreignId('state_id')->nullable()->constrained();
            $table->foreignId('city_id')->nullable()->constrained();
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
