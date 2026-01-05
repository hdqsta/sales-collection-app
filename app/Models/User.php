<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $primaryKey = 'user_id';
public $incrementing = false;
protected $keyType = 'string';

protected $fillable = [
    'user_id', 'username', 'password', 'nama_lengkap', 'email', 'role', 'status'
];
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

// Helper untuk mengecek role
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
