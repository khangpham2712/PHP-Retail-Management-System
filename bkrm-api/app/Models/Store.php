<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Store extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $hidden = [];

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

    public function suppliers()
    {
        return $this->hasMany(Supplier::class);
    }

    public function branches()
    {
        return $this->hasMany(Branch::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function customers()
    {
        return $this->hasMany(Customer::class);
    }

    public function purchaseOrders()
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    public function customerOrders()
    {
        return $this->hasMany(CustomerOrder::class);
    }

    public function purchaseReturns()
    {
        return $this->hasMany(PurchaseReturn::class);
    }
    public function refunds()
    {
        return $this->hasMany(Refund::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function inventoryChecks()
    {
        return $this->hasMany(InventoryCheck::class);
    }
}
