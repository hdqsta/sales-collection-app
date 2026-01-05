<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterData extends Model
{
    protected $table = 'master_data';
    protected $primaryKey = 'master_data_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'master_data_id', 'customer_id', 'periode', 'tanggal_upload', 'upload_by',
        'no_kontrak', 'tanggal_mulai_kontrak', 'tanggal_berakhir_kontrak',
        'periode_pembayaran', 'nilai_kontrak', 'status_kontrak', 'keterangan', 'file_source'
    ];
}
