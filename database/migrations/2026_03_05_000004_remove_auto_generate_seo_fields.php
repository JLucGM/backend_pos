<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('auto_generate_seo');
        });

        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn('auto_generate_seo');
        });

        Schema::table('collections', function (Blueprint $table) {
            $table->dropColumn('auto_generate_seo');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('auto_generate_seo')->default(true);
        });

        Schema::table('pages', function (Blueprint $table) {
            $table->boolean('auto_generate_seo')->default(true);
        });

        Schema::table('collections', function (Blueprint $table) {
            $table->boolean('auto_generate_seo')->default(true);
        });
    }
};