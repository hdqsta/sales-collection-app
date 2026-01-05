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
        Schema::create('collection_letters', function (Blueprint $table) {
    $table->string('letter_id', 20)->primary();
    $table->string('no_surat', 50);
    $table->string('invoice_id', 20);
    $table->enum('tipe_surat', ['peringatan', 'konfirmasi_outstanding', 'surat_hutang']);
    $table->date('tanggal_surat');
    $table->string('periode_tagihan', 20);
    $table->decimal('nilai_tagihan', 15, 2);
    $table->date('tanggal_jatuh_tempo');
    $table->integer('aging_category');
    $table->string('file_surat', 255)->nullable();
    $table->string('created_by', 20);
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('collection_letters');
    }
};
