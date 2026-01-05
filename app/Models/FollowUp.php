<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FollowUp extends Model
{
    use HasFactory;
    
    protected $guarded = [];
    protected $primaryKey = 'follow_up_id';
    public $incrementing = false;
    protected $keyType = 'string';

    // Relasi ke User (Sales Staff)
    public function salesStaff()
    {
        return $this->belongsTo(User::class, 'sales_staff_id', 'user_id');
    }
}