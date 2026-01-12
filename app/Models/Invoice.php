<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Invoice extends Model
{
    use HasFactory;

    protected $primaryKey = 'invoice_id'; // Kunci utama bukan 'id'
    public $incrementing = false;         // Karena string
    protected $keyType = 'string';
    
    protected $guarded = [];

    // Relasi ke Customer
    public function customer()
    {
        // parameter kedua: foreign_key di tabel invoices
        // parameter ketiga: owner_key di tabel customers
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }

    // Relasi ke Follow Up
    public function followUps()
    {
        return $this->hasMany(FollowUp::class, 'invoice_id', 'invoice_id');
    }
public function getAgingGroupAttribute()
{
    // 1. Cek Status Pembayaran DULU
    if ($this->status_pembayaran === 'paid') {
        return 'Lunas'; // Jangan hitung hari lagi
    }
    
    if ($this->status_pembayaran === 'rejected') {
        return 'Ditolak';
    }

    // 2. Baru hitung tanggal jika status masih 'unpaid'
    // Asumsi: aging dihitung dari tanggal jatuh tempo
    if (!$this->tanggal_jatuh_tempo) return 'N/A';

    $days = \Carbon\Carbon::parse($this->tanggal_jatuh_tempo)->diffInDays(now(), false);

    if ($days <= 0) return 'Lancar'; // Belum jatuh tempo (negatif atau 0)
    if ($days <= 30) return 'Aging 1';
    if ($days <= 60) return 'Aging 2';
    if ($days <= 90) return 'Aging 3';
    return 'Aging >90';
}

// Pastikan attribute ini ter-load otomatis
    protected $appends = ['aging_category', 'days_overdue'];

    // 1. LOGIKA KATEGORI AGING (PERBAIKAN DISINI)
    public function getAgingCategoryAttribute()
    {
        // PRIORITAS 1: Cek Status Pembayaran Database DULU
        if ($this->status_pembayaran === 'paid') {
            return 'Lunas'; // <--- Ini kuncinya. Jika paid, kembalikan string 'Lunas'
        }

        if ($this->status_pembayaran === 'rejected') {
            return 'Ditolak';
        }

        // PRIORITAS 2: Baru hitung tanggal jika status masih 'unpaid'
        if (!$this->tanggal_jatuh_tempo) return 'N/A';

        // Hitung selisih hari (positif = lewat jatuh tempo, negatif = belum)
        // false di parameter kedua agar return float/int bukan absolut
        $days = Carbon::parse($this->tanggal_jatuh_tempo)->diffInDays(now(), false);

        if ($days <= 0) return 'Lancar'; // Belum jatuh tempo
        if ($days <= 30) return 0;       // Aging 0 (1-30 hari)
        if ($days <= 60) return 1;       // Aging 1
        if ($days <= 90) return 2;       // Aging 2
        if ($days <= 120) return 3;      // Aging 3
        return 4;                        // Aging 4 (>120 hari)
    }

    // 2. LOGIKA HARI TERLAMBAT (Opsional, untuk display angka hari)
    public function getDaysOverdueAttribute()
    {
        // Jika sudah lunas, hari terlambat jadi 0
        if ($this->status_pembayaran === 'paid') return 0;

        if (!$this->tanggal_jatuh_tempo) return 0;
        
        $days = Carbon::parse($this->tanggal_jatuh_tempo)->diffInDays(now(), false);
        return $days > 0 ? (int)$days : 0;
    }
}