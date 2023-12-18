<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $hidden = [
        'store_id'
    ];

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_category_id', 'id');
    }
}
