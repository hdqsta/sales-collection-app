<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FollowUp extends Model
{
    use HasFactory;

    // Konfigurasi Primary Key (String)
    protected $primaryKey = 'follow_up_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $guarded = [];

    
    
    // 1. Relasi ke Invoice (Setiap Follow Up milik 1 Invoice)
    public function invoice()
    {
        // parameter 2: foreign_key di tabel follow_ups
        // parameter 3: owner_key di tabel invoices
        return $this->belongsTo(Invoice::class, 'invoice_id', 'invoice_id');
    }

    // 2. Relasi ke Sales Staff (User)
    public function salesStaff()
    {
        // parameter 2: foreign_key di tabel follow_ups
        // parameter 3: owner_key di tabel users
        return $this->belongsTo(User::class, 'sales_staff_id', 'user_id');
    }
}