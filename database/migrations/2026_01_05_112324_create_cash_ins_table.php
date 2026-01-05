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
        Schema::create('cash_ins', function (Blueprint $table) {
    $table->string('cash_in_id', 20)->primary();
    $table->string('customer_id', 20);
    $table->string('invoice_id', 20);
    $table->date('tanggal_cash_in');
    $table->string('nama_bank', 100);
    $table->decimal('jumlah_pembayaran', 15, 2);
    $table->string('no_referensi', 50);
    $table->string('metode_pembayaran', 50);
    $table->string('bukti_pembayaran', 255)->nullable();
    $table->string('input_by', 20);
    $table->enum('status', ['pending', 'confirmed', 'rejected'])->default('pending');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cash_ins');
    }
};
