<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseReturn extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $hidden = [
        'id',
    ];

    function purchaseReturnDetails() {
        return $this->hasMany(PurchaseReturnDetail::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    protected $casts = [
        'creation_date' => 'datetime:Y-m-d H:i:s',
        'approved_date' => 'datetime:Y-m-d H:i:s',
        'payment_date' => 'datetime:Y-m-d H:i:s',
    ];
}
