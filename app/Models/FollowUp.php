<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FollowUp extends Model
{
    protected $primaryKey = 'follow_up_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'follow_up_id', 'invoice_id', 'customer_id', 'sales_staff_id',
        'status_progress', 'catatan', 'target_cash_in', 'status_follow_up'
    ];
}
