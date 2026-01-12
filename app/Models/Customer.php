<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $primaryKey = 'customer_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'customer_id', 
        'id_perusahaan',
        'nama_pelanggan', 
        'nomor_kontrak',
        'alamat', 
        'regional',
        'kantor_perwakilan',
        'no_telepon', 
        'email', 
        'nomor_va',
        'layanan',
        'sales_staff_id',
        'pic_name', 
        'pic_phone'
    ];

    // Relasi ke User (Sales Staff)
    public function salesStaff()
    {
        return $this->belongsTo(User::class, 'sales_staff_id', 'user_id');
    }

    // Relasi ke Invoice
    public function invoices()
    {
        return $this->hasMany(Invoice::class, 'customer_id', 'customer_id');
    }
}