<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $hidden = [
        'id',
    ];

    protected $casts = [
        'due_date' => 'datetime:Y-m-d H:i:s',
    ];
}
