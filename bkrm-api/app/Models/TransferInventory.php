<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\TransferInventoryDetail;

class TransferInventory extends Model
{
    use HasFactory;

    protected $table = 'transfer_inventory';

    protected $guarded = [];

    protected $hidden = [
        'product_id',
        'quantity',
        'from_batches',
        'to_batches',

    ];

    public function transfer_detail()
    {
        return $this->hasMany(TransferInventoryDetail::class);
    }


    protected $casts = [
//        'approved_date' => 'datetime:Y-m-d H:i:s',
//        'created_at' => 'datetime:Y-m-d H:i:s',
    ];

}
