<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductSupplier extends Model
{
    protected $guarded = [];
    protected $hidden = [
        'id',
        'store_id',
        'product_id',
        'supplier_id',
    ];
    use HasFactory;
    protected $table = 'product_supplier';
}
