<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Models\Store;
use App\Models\Branch;
use App\Models\BranchInventory;
use App\Models\InventoryTransaction;
use App\Models\PurchaseOrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Employee;
use Illuminate\Support\Facades\DB;

class PurchaseOrderController extends Controller
{
    public function index(Request $request, Store $store, Branch $branch)
    {
        $limit = $request->query('limit');
        $page = $request->query('page');
        // extract query string
        $start_date = $request->query('startDate');
        $end_date = $request->query('endDate');
        $min_total_amount = $request->query('minTotalAmount');
        $max_total_amount = $request->query('maxTotalAmount');
        $min_discount = $request->query('minDiscount');
        $max_discount = $request->query('maxDiscount');
        $status = $request->query('status');
        $payment_method = $request->query('paymentMethod');
        $search_key = $request->query('searchKey');
        $order_by = $request->query('orderBy');
        $sort = $request->query('sort');

        // set up query
        $queries = [];
        if ($start_date) {
            array_push($queries, ['purchase_orders.creation_date', '>=', $start_date]);
        }

        if ($end_date) {
            array_push($queries, ['purchase_orders.creation_date', '<=', $end_date]);
        }

        if ($min_total_amount) {
            array_push($queries, ['purchase_orders.total_amount', '>=', $min_total_amount]);
        }

        if ($max_total_amount) {
            array_push($queries, ['purchase_orders.total_amount', '<=', $max_total_amount]);
        }

        if ($min_discount) {
            array_push($queries, ['purchase_orders.discount', '>=', $min_total_amount]);
        }

        if ($max_discount) {
            array_push($queries, ['purchase_orders.discount', '<=', $max_discount]);
        }

        if ($status) {
            array_push($queries, ['purchase_orders.status', '=', $status]);
        }

        if ($payment_method) {
            array_push($queries, ['purchase_orders.payment_method', '<=', $payment_method]);
        }

        $details = PurchaseOrderDetail::where('purchase_order_details.store_id', $store->id)
            ->leftJoin('purchase_orders', 'purchase_orders.id', '=', 'purchase_order_details.purchase_order_id')
            ->where($queries);

        $database_query = $branch->purchaseOrders()
            ->where($queries)
            ->join('suppliers', 'purchase_orders.supplier_id', '=', 'suppliers.id')
            ->join('branches', 'purchase_orders.branch_id', '=', 'branches.id')
            ->select('purchase_orders.*', 'suppliers.name as supplier_name', 'branches.name as branch_name');

        if ($search_key) {
            $database_query->where(function ($query) use (&$search_key) {
                $query->where('purchase_orders.purchase_order_code', $search_key)
                    ->orWhere('created_user_name', 'like', '%' . $search_key . '%')
                    ->orWhere('suppliers.name', 'like', '%' . $search_key . '%');
            });
            $details->where(function ($query) use (&$search_key) {
                $query->where('purchase_orders.purchase_order_code', $search_key)
                    ->orWhere('created_user_name', 'like', '%' . $search_key . '%');
            });
        }

        $total_rows = $database_query->get()->count();
        $total_amount = $database_query->sum('total_amount');
        $total_quantity = $details->sum('purchase_order_details.quantity');

        if ($limit) {
            $purchaseOrders = $database_query
                ->orderBy($order_by, $sort)
                ->offset($limit * $page)
                ->limit($limit)
                ->get();
        } else {
            $purchaseOrders = $database_query
                ->orderBy($order_by, $sort)
                ->get();
        }

        $purchase_order_with_total_amount = [];
        foreach($purchaseOrders as $purchaseOrder) {
            $purchase_order_total_amount = PurchaseOrderDetail::where('purchase_order_id', $purchaseOrder->id)->sum('quantity');
            array_push($purchase_order_with_total_amount, array_merge($purchaseOrder->toArray(), ['total_quantity' => $purchase_order_total_amount]));
        }

        return response()->json([
            'data' => $purchase_order_with_total_amount,
            'total_rows' => $total_rows,
            'total_amount' => $total_amount,
            'total_quantity' => $total_quantity
        ], 200);
    }

    public function getStorePurchaseOrder(Request $request, Store $store)
    {
        $limit = $request->query('limit') ? $request->query('limit') : 10;
        $page = $request->query('page') ? $request->query('page') : 1;
        $data = $store->purchaseOrders()
            ->join('suppliers', 'purchase_orders.supplier_id', '=', 'suppliers.id')
            ->join('branches', 'purchase_orders.branch_id', '=', 'branches.id')
            ->select('purchase_orders.*', 'suppliers.name as supplier_name', 'branches.name as branch_name')
            ->orderBy('created_at', 'desc')
            ->offset($limit * ($page - 1))
            ->limit($limit)
            ->get();

        return response()->json([
            'data' => $data,
        ]);
    }

    public function addInventory(Request $request, Store $store, Branch $branch)
    {
        $validated = $request->validate([
            'supplier_uuid' => 'nullable|string',
            'paid_amount' => 'required|numeric',
            'payment_method' => 'required|string',
            'total_amount' => 'required|numeric',
            'discount' => 'required|numeric',
            'status' => 'required|string',
            'details' => 'required',
            'import_date' => 'required|date_format:Y-m-d H:i:s',
            'is_imported' => 'nullable|numeric',
        ]);

        // get the user of  token
        $created_by = $approved_by = null;
        $created_user_type = '';
        $user = null;
        if (Auth::guard('user')->user()) {
            $user = Auth::guard('user')->user();
            $created_by = $approved_by = Auth::guard('user')->user()->id;
            $created_user_type = 'owner';
        } else if (Auth::guard('employee')->user()) {
            $user = Auth::guard('employee')->user();
            $created_by = $approved_by = Auth::guard('employee')->user()->id;
            $created_user_type = 'employee';
        } else {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }

        if ($validated['supplier_uuid'] === null) {
            $supplier_id = $store->suppliers()->where('type', 'default')->first()->id;
        } else {
            $supplier_id = $store->suppliers()->where('uuid', $validated['supplier_uuid'])->first()->id;
        }
        $creation_date = $approved_date = $validated['import_date'];

        // $supplier_id = $store->suppliers()->where('uuid', $validated['supplier_uuid'])->first()->id;

        $last_id = $store->purchaseOrders()->count();

        $purchaseOrderCode = 'PO' . sprintf('%06d', $last_id + 1);

        $purchaseOrder = PurchaseOrder::create([
            'store_id' => $store->id,
            'uuid' => (string)Str::uuid(),
            'branch_id' => $branch->id,
            'supplier_id' => $supplier_id,
            'purchase_order_code' => $purchaseOrderCode,
            'approved_by' => $approved_by,
            'created_by' => $created_by,
            'creation_date' => $creation_date,
            'approved_date' => $approved_date,
            'payment_date' => $creation_date,
            'paid_amount' => $validated['paid_amount'],
            'payment_method' => $validated['payment_method'],
            'total_amount' => $validated['total_amount'],
            'discount' => $validated['discount'],
            'taxes' => 0,
            'created_user_type' => $created_user_type,
            'created_user_name' => $user->name,
            'status' => $validated['status'],
            'is_imported' => array_key_exists('is_imported',$validated) ? $validated['is_imported'] : 1,
            'import_date' => array_key_exists('is_imported',$validated) ? ($validated['is_imported'] ? $creation_date : null) :  $creation_date,
        ]);

        foreach ($validated['details'] as $detail) {
            $product_id = $store->products->where('uuid', '=', $detail['uuid'])->first()->id;

            $inventoryTransaction = InventoryTransaction::create([
                'uuid' => (string)Str::uuid(),
                'store_id' => $store->id,
                'product_id' => $product_id,
                'quantity' => $detail['quantity'],
                'branch_id' => $branch->id,
                'transaction_type' => 'purchased',
            ]);

            $batches = [];

            if ($detail['selectedBatches']) {
                foreach ($detail['selectedBatches'] as $batch) {
                    if ($batch['is_new']) {
                        $last_id = DB::table('product_batches')
                            ->where('store_id', $store->id)
                            ->where('branch_id', $branch->id)
                            ->where('product_id', $product_id)
                            ->get()->count();
                        $batch_code = 'L' . sprintf('%04d', $last_id + 1);
                        $created_id = DB::table('product_batches')
                            ->insertGetId([
                                'store_id' => $store->id,
                                'branch_id' => $branch->id,
                                'product_id' =>  $product_id,
                                'quantity' => $batch['additional_quantity'],
                                'expiry_date' => $batch['expiry_date'],
                                'batch_code' =>  $batch_code,
                                'position' => $batch['position']
                            ]);
                        $result = DB::table('product_batches')
                            ->where('id', $created_id)->first();
                        $result = json_decode(json_encode($result), TRUE);
                        $result = array_merge($result, ['is_new' => true, 'additional_quantity' => $batch['additional_quantity'], 'returned_quantity' => 0]);
                        array_push($batches, $result);
                    } else {
                        DB::table('product_batches')
                            ->where('store_id', $store->id)
                            ->where('branch_id', $branch->id)
                            ->where('product_id', $product_id)
                            ->where('id', $batch['id'])
                            ->increment('quantity', $batch['additional_quantity']);
                        $result = DB::table('product_batches')
                            ->where('id', $batch['id'])->first();
                        $result = json_decode(json_encode($result), TRUE);
                        $result = array_merge($result, ['is_new' => false, 'additional_quantity' => $batch['additional_quantity'], 'returned_quantity' => 0]);
                        array_push($batches, $result);
                    }
                }
            }

            PurchaseOrderDetail::create([
                'store_id' => $store->id,
                'branch_id' => $branch->id,
                'product_id' => $product_id,
                'inventory_transaction_id' => $inventoryTransaction->id,
                'purchase_order_id' => $purchaseOrder->id,
                'posted_to_inventory' => array_key_exists('is_imported',$validated) ? $validated['is_imported'] : true,
                'date_received' => array_key_exists('is_imported',$validated) ? ($validated['is_imported'] ? $creation_date : null) :  $creation_date,
                'unit_price' => $detail['unit_price'],
                'quantity' => $detail['quantity'],
                'returned_quantity' => 0,
                'batches' => json_encode($batches),
                'created_at' => $creation_date,
            ]);


            $product = $store->products->where('uuid', '=', $detail['uuid'])->first();
            $newQuantity = (string)((int) $product->quantity_available) + ((int) $detail['quantity']);
            $product->update(['quantity_available' => $newQuantity]);

            // update branch inventory table
            $productOfStore = BranchInventory::where([['branch_id', '=', $branch->id], ['product_id', '=', $product_id]])->first();

            if ($productOfStore) {
                BranchInventory::where([['branch_id', '=', $branch->id], ['product_id', '=', $product_id]])
                    ->increment('quantity_available', $detail['quantity']);
            } else {
                BranchInventory::create([
                    'store_id' => $store->id,
                    'branch_id' => $branch->id,
                    'product_id' => $product_id,
                    'quantity_available' => $detail['quantity'],
                ]);
            }
        }

        $supplier_name = $store->suppliers()->where('id', $purchaseOrder['supplier_id'])->first()->name;
        PaymentReceiptVoucherController::create([
            'value' => $purchaseOrder['paid_amount'],
            'user_type' => 'supplier',
            'user_name' => $supplier_name,
            'type' => 'purchase_order',
            'date' => $purchaseOrder['creation_date'],
            'note' => $purchaseOrder['purchase_order_code'],
            'is_calculated' => true,
            'branch_id' => $branch->id,
            'is_minus' => true,
            'payment_method' => $purchaseOrder['payment_method']
        ]);

        return response()->json([
            'message' => 'Purchase order created successfully',
            'data' => $purchaseOrder,
        ], 200);
    }

    public function store(Request $request, Store $store, Branch $branch)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|numeric',
            'created_by' => 'required|numeric',
            'approved_by' => 'nullable|numeric',
            'creation_date' => 'required|date_format:Y-m-d',
            'approved_date' => 'nullable|date_format:Y-m-d',
            'payment_date' => 'nullable|date_format:Y-m-d',
            'payment_amount' => 'required|numeric',
            'payment_method' => 'nullable|string',
            'notes' => 'nullable|string',
            'taxes' => 'required|numeric',
            'status' => 'required|string'
        ]);

        $purchaseOrder = PurchaseOrder::create(array_merge($validated, [
            'store_id' => $store->id,
            'branch_id' => $branch->id
        ]));

        return response()->json([
            'message' => 'Purchase order created successfully',
            'data' => $purchaseOrder,
        ], 200);
    }

    public function update(Request $request, Store $store, Branch $branch, PurchaseOrder $purchaseOrder)
    {
        $validated = $request->validate([
            'approved_by' => 'nullable|numeric',
            'approved_date' => 'nullable|date_format:Y-m-d',
            'payment_date' => 'nullable|date_format:Y-m-d',
            'paid_amount' => 'nullable|numeric',
            'payment_method' => 'nullable|string',
            'notes' => 'nullable|string',
            'status' => 'nullable|string',
            'imported_date' => 'nullable|date_format:Y-m-d',
            'is_imported' => 'nullable|numeric',
        ]);

        if (array_key_exists('paid_amount', $validated)) {
            $supplier_name = $store->suppliers()->where('id', $purchaseOrder['supplier_id'])->first()->name;
            PaymentReceiptVoucherController::create([
                'value' => $validated['paid_amount'] - $purchaseOrder['paid_amount'],
                'user_type' => 'supplier',
                'user_name' => $supplier_name,
                'type' => 'purchase_order',
                'note' => $purchaseOrder['purchase_order_code'],
                'is_calculated' => true,
                'branch_id' => $branch->id,
                'is_minus' => true,
            ]);
        }
        

        $purchaseOrder->update($validated);

        
        return response()->json([
            'message' => 'Purchase order updated successfully',
            'data' => $purchaseOrder,
        ], 200);
    }

    public function show(Store $store, PurchaseOrder $purchaseOrder)
    {

        $details = $purchaseOrder->purchaseOrderDetails()
            ->join('products', 'purchase_order_details.product_id', '=', 'products.id')
            ->select('purchase_order_details.*', 'products.name', 'products.bar_code', 'products.product_code')->get();

        if ($purchaseOrder->created_user_type === 'owner') {
            $created_by = User::where('id', $purchaseOrder->created_by)->first();
        } else {
            $created_by = Employee::where('id', $purchaseOrder->created_by)->first();
        }
        $data = array_merge([
            'supplier' => $purchaseOrder->supplier,
            'branch' => $purchaseOrder->branch,
            'details' => $details,
            'created_by_user' => $created_by,
        ], $purchaseOrder->toArray());

        return response()->json([
            'data' => $data
        ], 200);
    }

    public function destroy(Store $store, Branch $branch, PurchaseOrder $purchaseOrder)
    {
        $details = PurchaseOrderDetail::where('purchase_order_id', $purchaseOrder->id)->get()->toArray();

        foreach ($details as $detail) {
            $product_id = $detail['product_id'];

            $batches = json_decode($detail['batches']);
            foreach ( $batches as $batch) {
                DB::table('product_batches')
                    ->where('store_id', $store->id)
                    ->where('branch_id', $branch->id)
                    ->where('product_id', $product_id)
                    ->where('id', $batch['id'])
                    ->decrement('quantity', $batch['additional_quantity']);
            }

            // update branch inventory table
            $productOfStore = BranchInventory::where([['branch_id', '=', $branch->id], ['product_id', '=', $product_id]])->first();

            if ($productOfStore) {
                BranchInventory::where([['branch_id', '=', $branch->id], ['product_id', '=', $product_id]])
                    ->decrement('quantity_available', $detail['quantity']);
            }
        }
        PurchaseOrder::destroy($purchaseOrder->id);
        PurchaseOrderDetail::where('purchase_order_id', $purchaseOrder->id)->delete();
        PaymentReceiptVoucherController::deleteByCode($purchaseOrder['purchase_order_code']);

        return response()->json([
            'message' => 'deleted successfully',
            'data' => [
                'purchase_order' => $purchaseOrder,
            ]
        ], 200);
    }

    public function deleteAll(Store $store, Branch $branch)
    {
        $branch->purchaseOrders()->delete();
        PurchaseOrderDetail::where('branch_id', $branch->id)->delete();
        return response()->json([
            'message' => 'All Order deleted successfully',
        ], 200);
    }

    public function updateDetail(Request $request, Store $store, Branch $branch, $id) {
        $validated = $request->validate([
            'date_received' => 'required',
            'quantity' => 'required|numeric',
            'batches' => 'nullable|string',
            'posted_to_inventory' => 'required|numeric'
        ]);
        $result = PurchaseOrderDetail::where('id', $id)->update($validated);
        return response()->json([
            'data' => $result,
        ]);
    }
}
