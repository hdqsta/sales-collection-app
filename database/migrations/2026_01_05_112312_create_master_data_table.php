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
        Schema::create('master_data', function (Blueprint $table) {
    $table->string('master_data_id', 20)->primary();
    $table->string('customer_id', 20);
    $table->string('periode', 20);
    $table->date('tanggal_upload');
    $table->string('upload_by', 20);
    $table->string('no_kontrak', 50);
    $table->date('tanggal_mulai_kontrak');
    $table->date('tanggal_berakhir_kontrak');
    $table->enum('periode_pembayaran', ['bulanan', 'triwulan', 'tahunan']);
    $table->decimal('nilai_kontrak', 15, 2);
    $table->enum('status_kontrak', ['aktif', 'expired', 'terminated']);
    $table->text('keterangan')->nullable();
    $table->string('file_source', 255)->nullable();
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_data');
    }
};
