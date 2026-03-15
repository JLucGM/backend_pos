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
        Schema::create('store_schedules', function (Blueprint $row) {
            $row->id();
            $row->foreignId('store_id')->constrained()->onDelete('cascade');
            $row->integer('day_of_week'); // 0-6 (Domingo a Sábado)
            $row->time('open_time')->nullable();
            $row->time('close_time')->nullable();
            $row->boolean('is_closed')->default(false);
            $row->timestamps();
            
            $row->unique(['store_id', 'day_of_week']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_schedules');
    }
};
