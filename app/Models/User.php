<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
// use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    // --- 1. KONFIGURASI PRIMARY KEY (WAJIB UNTUK STRING ID) ---
    protected $primaryKey = 'user_id';
    public $incrementing = false;
    protected $keyType = 'string';

    // --- 2. MASS ASSIGNMENT ---
    // Gunakan guarded = [] agar semua kolom bisa diisi (lebih fleksibel)
    // Saya hapus $fillable agar tidak perlu update manual terus-menerus
    protected $guarded = []; 

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // --- 3. CASTING (PENGATURAN TIPE DATA) ---
    // Gunakan versi method (Laravel terbaru) dan HAPUS versi array duplikat tadi
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // --- 4. ACCESSOR (SOLUSI MONITORING DASHBOARD) ---
    // Ini jembatan agar Frontend bisa panggil 'user.name'
    // padahal di database kolomnya 'nama_lengkap'
    public function getNameAttribute()
    {
        return $this->nama_lengkap;
    }

    // --- 5. RELASI & HELPER ---
    public function isAdmin() {
        return $this->role === 'administrator';
    }

    public function isCollection() {
        return $this->role === 'collection_staff';
    }

    public function isSales() {
        return $this->role === 'sales_staff';
    }

    public function followUps()
    {
        return $this->hasMany(FollowUp::class, 'sales_staff_id', 'user_id');
    }

    public function masterDataUploads()
    {
        return $this->hasMany(MasterData::class, 'upload_by', 'user_id');
    }
}