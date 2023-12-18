<?php

namespace App\Http\Controllers;

use App\Models\RefundDetail;
use App\Models\Branch;
use App\Models\Store;
use App\Models\Refund;
use Illuminate\Http\Request;

class RefundDetailController extends Controller
{
    public function index(Store $store, Branch $branch, Refund $refund)
    {
        return response()->json([
            'data' => $refund->refundDetails,
        ], 200);
    }

    public function store(Request $request, Store $store, Branch $branch, Refund $refund)
    {
        $validated = $request->validate([
            'product_id' => 'required|numeric',
            'quantity' => 'required|numeric',
            'unit_price' => 'required|numeric',
        ]);

        $refundDetail = RefundDetail::create(array_merge($validated, [
            'store_id' => $store->id,
            'branch_id' => $branch->id,
            'refund_id' => $refund->id,
        ]));

        return response()->json([
            'data' => $refundDetail,
        ], 200);
    }

    public function update(Request $request, Store $store, Branch $branch, 
                            Refund $refund, RefundDetail $refundDetail)
    {
        $validated = $request->validate([
            'quantity' => 'nullable|numeric',
            'unit_price' => 'nullable|numeric',
        ]);

        $refundDetail->update($validated);

        return response()->json([
            'data' => $refundDetail
        ], 200);
    }

    public function destroy(Store $store, Branch $branch, 
                            Refund $refund, RefundDetail $refundDetail)
    {
        $isdeleted = RefundDetail::destroy($refundDetail->id);
        return response()->json([
            'message' => $isdeleted,
            'data' => $refundDetail
        ], 200);
    }
}
