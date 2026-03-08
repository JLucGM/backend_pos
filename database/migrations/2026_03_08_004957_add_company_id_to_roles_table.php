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
        Schema::table('roles', function (Blueprint $table) {
            if (!Schema::hasColumn('roles', 'company_id')) {
                $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade')->after('guard_name');
            }
            
            // Intentar eliminar el índice único antiguo si existe
            try {
                $table->dropUnique(['name', 'guard_name']);
            } catch (\Exception $e) {
                // En algunos drivers como SQLite esto podría fallar, lo ignoramos
            }

            // Crear el nuevo índice único que incluye la compañía
            $table->unique(['name', 'guard_name', 'company_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->dropUnique(['name', 'guard_name', 'company_id']);
            $table->unique(['name', 'guard_name']);
            $table->dropColumn('company_id');
        });
    }
};
