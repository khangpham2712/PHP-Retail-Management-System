<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransferInventoryDetail extends Model
{
    use HasFactory;

    public $timestamps = true;

    protected $guarded = [];

    protected $fillable = ['product_uuid', 'value_quantity'];

    protected $hidden = [
        'product_id',
        'product_uuid',
    ];

    protected $with = [
        'product:id,uuid,product_code,name,quantity_available'
    ];

    public function product()
    {
        return $this->hasOne(Product::class,'uuid', 'product_uuid');
    }

    protected $casts = [
//        'approved_date' => 'datetime:Y-m-d H:i:s',
//        'created_at' => 'datetime:Y-m-d H:i:s',
    ];

}
