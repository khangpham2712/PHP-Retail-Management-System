<?php

namespace App\Http\Controllers;

use App\Models\PurchaseReturnDetail;
use App\Models\PurchaseReturn;
use App\Models\Store;
use App\Models\Branch;
use Illuminate\Http\Request;

class PurchaseReturnDetailController extends Controller
{
    public function index(Store $store, Branch $branch, PurchaseReturn $purchaseReturn)
    {
        return response()->json([
            'data' => $purchaseReturn->purchaseReturnDetails,
        ], 200);
    }

    public function store(Request $request, Store $store, Branch $branch, PurchaseReturn $purchaseReturn)
    {
        $validated = $request->validate([
            'product_id' => 'required|numeric',
            'quantity' => 'required|numeric',
            'unit_cost' => 'required|numeric',
            'removed_from_inventory' => 'nullable|boolean',
        ]);

        $purchaseReturnDetail = PurchaseReturnDetail::create(array_merge($validated, [
            'store_id' => $store->id,
            'branch_id' => $branch->id,
            'purchase_return_id' => $purchaseReturn->id,
        ]));

        return response()->json([
            'data' => $purchaseReturnDetail,
        ], 200);
    }

    public function update(Request $request, Store $store, Branch $branch,
                             PurchaseReturn $purchaseReturn, 
                             PurchaseReturnDetail $purchaseReturnDetail)
    {
        $validated = $request->validate([
            'quantity' => 'nullable|numeric',
            'unit_price' => 'nullable|numeric',
            'removed_from_inventory' => 'nullable|boolean',
        ]);

        $purchaseReturnDetail->update($validated);


        return response()->json([
            'data' => $purchaseReturnDetail
        ], 200);
    }

    public function destroy(Store $store, Branch $branch, 
                            PurchaseReturn $purchaseReturn, 
                            PurchaseReturnDetail $purchaseReturnDetail)
    {
        $isdeleted = PurchaseReturnDetail::destroy($purchaseReturnDetail->id);
        return response()->json([
            'message' => $isdeleted,
            'data' => $purchaseReturnDetail
        ], 200);
        
    }
}
