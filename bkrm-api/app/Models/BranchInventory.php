<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BranchInventory extends Model
{
    use HasFactory;

    protected $hidden = [
        'id',
        'store_id'
    ];
    
    protected $guarded = [];
    

}
