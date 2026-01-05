<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CollectionLetter extends Model
{
    protected $primaryKey = 'letter_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'letter_id', 'no_surat', 'invoice_id', 'tipe_surat', 'tanggal_surat',
        'periode_tagihan', 'nilai_tagihan', 'tanggal_jatuh_tempo', 'aging_category', 
        'file_surat', 'created_by'
    ];
}
