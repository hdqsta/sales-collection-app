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
        Schema::create('customers', function (Blueprint $table) {
    $table->string('customer_id', 20)->primary();
    $table->string('nama_pelanggan', 150);
    $table->text('alamat');
    $table->string('no_telepon', 20);
    $table->string('email', 100);
    $table->string('pic_name', 100);
    $table->string('pic_phone', 20);
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
