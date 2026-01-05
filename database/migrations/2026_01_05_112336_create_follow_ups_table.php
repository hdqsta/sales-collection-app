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
       Schema::create('follow_ups', function (Blueprint $table) {
    $table->string('follow_up_id', 20)->primary();
    $table->string('invoice_id', 20);
    $table->string('customer_id', 20);
    $table->string('sales_staff_id', 20);
    $table->enum('status_progress', ['verifikasi_user', 'surat_peringatan', 'surat_konfirmasi', 'surat_hutang', 'isolir']);
    $table->text('catatan')->nullable();
    $table->date('target_cash_in')->nullable();
    $table->enum('status_follow_up', ['belum', 'sudah']);
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('follow_ups');
    }
};
