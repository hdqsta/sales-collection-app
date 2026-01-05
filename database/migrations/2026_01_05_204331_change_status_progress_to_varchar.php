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
    // Ubah tipe kolom dari ENUM yang kaku menjadi VARCHAR(50) yang fleksibel
    DB::statement("ALTER TABLE follow_ups MODIFY COLUMN status_progress VARCHAR(50) NOT NULL");
}

public function down(): void
{
    // Kembalikan ke ENUM (Opsional, tidak disarankan)
}
};
