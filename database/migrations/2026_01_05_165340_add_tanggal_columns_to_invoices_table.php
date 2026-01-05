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
        Schema::table('invoices', function (Blueprint $table) {
            // Tambahkan kolom tanggal_terbit dan tanggal_jatuh_tempo
            // Kita pakai dateTime karena data seeder menyertakan jam/menit
            $table->dateTime('tanggal_terbit')->nullable()->after('status_pembayaran');
            
            // Cek dulu apakah tanggal_jatuh_tempo sudah ada atau belum agar tidak error double
            if (!Schema::hasColumn('invoices', 'tanggal_jatuh_tempo')) {
                $table->dateTime('tanggal_jatuh_tempo')->nullable()->after('tanggal_terbit');
            }
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['tanggal_terbit', 'tanggal_jatuh_tempo']);
        });
    }
};
