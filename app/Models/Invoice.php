<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany; // <--- Wajib Import

class Invoice extends Model
{
    use HasFactory;

    protected $primaryKey = 'invoice_id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = [];

    // Attribute Aging otomatis
    protected $appends = ['aging_category'];

    // Relasi ke Customer
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }

    // Relasi ke FollowUp (Agar bisa dicek history-nya)
    public function followUps(): HasMany
    {
        return $this->hasMany(FollowUp::class, 'invoice_id', 'invoice_id');
    }

    // Logika Aging
   public function getAgingCategoryAttribute()
    {
        // 1. Jika tanggal jatuh tempo kosong / null, anggap lancar (0)
        if (!$this->tanggal_jatuh_tempo) return 0;
        
        $jatuhTempo = \Carbon\Carbon::parse($this->tanggal_jatuh_tempo);
        $sekarang = \Carbon\Carbon::now();
        
        // 2. Jika BELUM lewat jatuh tempo -> Lancar (0)
        if ($sekarang->lessThanOrEqualTo($jatuhTempo)) {
            return 0; 
        }

        // 3. Jika SUDAH lewat, hitung selisih bulan
        // Gunakan (int) agar 0.5 bulan menjadi 0, 1.2 bulan menjadi 1
        return (int) $jatuhTempo->diffInMonths($sekarang);
    }
}