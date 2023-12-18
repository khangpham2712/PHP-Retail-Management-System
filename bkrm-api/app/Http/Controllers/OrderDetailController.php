<?php

namespace App\Http\Controllers;

use App\Models\OrderDetail;
use App\Models\Store;
use App\Models\Branch;
use App\Models\Order;

use Illuminate\Http\Request;

class OrderDetailController extends Controller
{
    public function index(Store $store, Branch $branch, Order $order)
    {
        return response()->json([
            'data' => $order->orderDetails,
        ], 200);
    }

    public function store(Request $request, Store $store, Branch $branch, Order $order)
    {
        $validated = $request->validate([
            'product_id' => 'required|numeric',
            'quantity' => 'required|numeric',
            'unit_price' => 'required|numeric',
            'status' => 'required|string|in:allocated,invoiced,shipped,no-stock,on-order',
            'discount' => 'nullable|numeric',
        ]);


        $orderDetail = OrderDetail::create(array_merge($validated, [
            'store_id' => $store->id,
            'branch_id' => $branch->id,
            'order_id' => $order->id,
        ]));

        return response()->json([
            'data' => $orderDetail,
        ], 200);
    }

    public function show(Store $store, Branch $branch, Order $order, OrderDetail $orderDetail)
    {
        return response()->json([
            'data' => $orderDetail,
        ], 200);
    }

    public function update(Request $request, Store $store, Branch $branch, Order $order, OrderDetail $orderDetail)
    {
        $validated = $request->validate([
            'quantity' => 'nullable|numeric',
            'unit_price' => 'nullable|numeric',
            'status' => 'nullable|string|in:allocated,invoiced,shipped,no-stock,on-order',
            'discount' => 'nullable|numeric',
        ]);

        $orderDetail->update($validated);

        return response()->json([
            'data' => $orderDetail
        ], 200);
    }

    public function destroy(Store $store, Branch $branch, Order $order,OrderDetail $orderDetail)
    {
        $isDeleted = OrderDetail::destroy($orderDetail->id);
        return response()->json([
            'message' => $isDeleted,
            'data' => $orderDetail
        ], 200);
         
    }
}
