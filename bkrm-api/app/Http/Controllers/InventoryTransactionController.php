<?php

namespace App\Http\Controllers;

use App\Models\InventoryTransaction;
use App\Models\Store;
use App\Models\Branch;
use Illuminate\Http\Request;

class InventoryTransactionController extends Controller
{
    public function index(Request $request, Store $store, Branch $branch)
    {
        $transactions = InventoryTransaction::where('store_id', $store->id)
                    ->where('branch_id', $branch->id)
                    ->get();

        return response()->json([
            'data' => $transactions,
        ], 200);
    }

    public function store(Request $request)
    {
        return InventoryTransaction::create($request->all());
    }

    public function show(Store $store, Branch $branch, InventoryTransaction $inventoryTransaction)
    {
        return $inventoryTransaction;
    }

    public function update(Request $request, InventoryTransaction $inventoryTransaction)
    {
        $inventoryTransaction->update($request->all());
        return $inventoryTransaction;
    }

    public function destroy(InventoryTransaction $inventoryTransaction)
    {
        return InventoryTransaction::destroy($inventoryTransaction->id);
    }
}
