<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}