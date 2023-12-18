<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseOrderDetail extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $casts = [
        'date_received' => 'datetime:Y-m-d H:i:s',
    ];
}
