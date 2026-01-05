<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CashIn extends Model
{
    protected $table = 'cash_ins';
    protected $primaryKey = 'cash_in_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'cash_in_id', 'customer_id', 'invoice_id', 'tanggal_cash_in', 'nama_bank',
        'jumlah_pembayaran', 'no_referensi', 'metode_pembayaran', 'bukti_pembayaran', 
        'input_by', 'status'
    ];
}
