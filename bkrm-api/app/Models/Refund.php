<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Refund extends Model
{
    use HasFactory;
    protected $guarded = [];
    
    protected $hidden = [
        'id',
    ];

    function refundDetails() {
        return $this->hasMany(RefundDetail::class);
    }

    public function customer() {
        return $this->belongsTo(Customer::class);
    }

    public function branch() {
        return $this->belongsTo(Branch::class);
    }

    public function order() {
        return $this->belongsTo(Order::class);
    }

    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i:s',
    ];
}
