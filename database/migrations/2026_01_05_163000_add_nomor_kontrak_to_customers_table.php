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
        Schema::table('customers', function (Blueprint $table) {
            // Menambahkan kolom nomor_kontrak setelah nama_pelanggan
            $table->string('nomor_kontrak')->nullable()->after('nama_pelanggan');
        });
    }

    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('nomor_kontrak');
        });
    }
};
