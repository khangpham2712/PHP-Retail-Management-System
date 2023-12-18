<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $hidden = [
        
    ];

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class);
    }

    public function customer() {
        return $this->belongsTo(Customer::class);
    }

    public function branch() {
        return $this->belongsTo(Branch::class);
    }

    protected $casts = [
        'paid_date' => 'datetime:Y-m-d H:i:s',
        'creation_date' => 'datetime:Y-m-d H:i:s',
    ];
}
