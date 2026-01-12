<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CollectionLetter extends Model
{
    protected $table = 'collection_letters';
    protected $primaryKey = 'letter_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $guarded = [];

    // Relasi ke Invoice (Opsional, buat jaga-jaga)
    public function invoice()
    {
        return $this->belongsTo(Invoice::class, 'invoice_id', 'invoice_id');
    }
}