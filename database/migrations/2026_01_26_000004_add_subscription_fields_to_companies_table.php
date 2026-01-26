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
        Schema::table('companies', function (Blueprint $table) {
            $table->foreignId('current_subscription_id')->nullable()->constrained('subscriptions')->onDelete('set null');
            $table->boolean('is_trial')->default(true); // Si está en período de prueba
            $table->timestamp('trial_ends_at')->nullable(); // Cuándo termina la prueba
            $table->json('subscription_limits')->nullable(); // Límites actuales basados en la suscripción
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropForeign(['current_subscription_id']);
            $table->dropColumn(['current_subscription_id', 'is_trial', 'trial_ends_at', 'subscription_limits']);
        });
    }
};