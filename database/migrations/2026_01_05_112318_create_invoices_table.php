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
        Schema::create('invoices', function (Blueprint $table) {
    $table->string('invoice_id', 20)->primary();
    $table->string('customer_id', 20);
    $table->string('master_data_id', 20);
    $table->string('no_invoice', 50);
    $table->date('tanggal_invoice');
    $table->date('tanggal_jatuh_tempo');
    $table->string('periode_tagihan', 20);
    $table->decimal('total_tagihan', 15, 2);
    $table->enum('status_pembayaran', ['unpaid', 'partial', 'paid']);
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
