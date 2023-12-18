<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryCheck extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $hidden = [
    ];

    public function inventoryCheckDetails()
    {
        return $this->hasMany(InventoryCheckDetail::class);
    }

    protected $casts = [
        'approved_date' => 'datetime:Y-m-d H:i:s',
        'created_at' => 'datetime:Y-m-d H:i:s',
    ];

}
