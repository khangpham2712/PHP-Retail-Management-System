<?php

namespace App\Http\Controllers;

use App\Models\Refund;
use App\Models\Store;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\Branch;
use Illuminate\Http\Request;
use App\Models\BranchInventory;
use App\Models\InventoryTransaction;
use App\Models\RefundDetail;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Employee;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class RefundController extends Controller
{
    public function getStoreRefund(Store $store)
    {
        $data = $store->refunds()
            ->join('customers', 'refunds.customer_id', '=', 'customers.id')
            ->join('branches', 'refunds.branch_id', '=', 'branches.id')
            ->select('refunds.*', 'customers.name as customer_name', 'branches.name as branch_name')->get();

        return response()->json([
            'data' => $data,
        ]);
    }

    public function removeInventory(Request $request, Store $store, Branch $branch)
    {
        $validated = $request->validate([
            'order_uuid' => 'required|string',
            'customer_id' => 'required|numeric',
            'paid_amount' => 'required|numeric',
            'payment_method' => 'required|string',
            'total_amount' => 'required|string',
            'status' => 'required|string',
            'details' => 'required',
            'import_date' => 'required|date_format:Y-m-d H:i:s',
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

        $creation_date = $approved_date = $validated['import_date'];

        $order = $store->orders()->where('uuid', $validated['order_uuid'])->first();
        $order_id = $order->id;

        $last_id = $store->refunds()->count();

        $refundCode = 'TH' . sprintf('%06d', $last_id + 1);

        $refund = Refund::create([
            'store_id' => $store->id,
            'uuid' => (string)Str::uuid(),
            'branch_id' => $branch->id,
            'customer_id' => $validated['customer_id'],
            'refund_code' => $refundCode,
            'created_by' => $created_by,
            'paid_amount' => $validated['paid_amount'],
            'payment_method' => $validated['payment_method'],
            'total_amount' => $validated['total_amount'],
            'created_user_type' => $created_user_type,
            'created_user_name' => $user->name,
            'order_id' => $order_id,
            'status' => $validated['status'],
            'created_at' => $validated['import_date']
        ]);

        foreach ($validated['details'] as $detail) {
            $inventoryTransaction = InventoryTransaction::create([
                'uuid' => (string)Str::uuid(),
                'store_id' => $store->id,
                'product_id' => $detail['product_id'],
                'quantity' => $detail['quantity'],
                'branch_id' => $branch->id,
                'transaction_type' => 'supplier_returned',
            ]);
            if ($detail['selectedBatches']) {
                foreach ($detail['selectedBatches'] as $batch) {
                    DB::table('product_batches')
                        ->where('store_id', $store->id)
                        ->where('branch_id', $branch->id)
                        ->where('product_id', $detail['product_id'])
                        ->where('id', $batch['id'])
                        ->increment('quantity', $batch['returned_quantity']);
                }
            }

            RefundDetail::create([
                'refund_id' => $refund->id,
                'product_id' => $detail['product_id'],
                'inventory_transaction_id' => $inventoryTransaction->id,
                'quantity' => $detail['quantity'],
                'unit_price' => $detail['unit_price'],
                'store_id' => $store->id,
                'branch_id' => $branch->id,
                'posted_to_inventory' => true,
                'batches' => $detail['selectedBatches'] ? json_encode($detail['selectedBatches']) : '',
            ]);

            DB::table('order_details')
                ->where('id', '=', $detail['order_detail_id'])
                ->update([
                    'returned_quantity' => $detail['quantity'],
                    'batches' => $detail['order_batches']
                ]);

            $product = $store->products->where('id', '=', $detail['product_id'])->first();
            $newQuantity = (string)((int) $product->quantity_available) + ((int) $detail['quantity']);
            $product->update(['quantity_available' => $newQuantity]);

            // update branch inventory table
            $productOfStore = BranchInventory::where([['branch_id', '=', $branch->id], ['product_id', '=', $product->id]])->first();

            if ($productOfStore) {
                BranchInventory::where([['branch_id', '=', $branch->id], ['product_id', '=', $product->id]])
                    ->increment('quantity_available', $detail['quantity']);
            } else {
                BranchInventory::create([
                    'store_id' => $store->id,
                    'branch_id' => $branch->id,
                    'product_id' => $product->id,
                    'quantity_available' => $detail['quantity'],
                ]);
            }
        }


        $customer_name = $store->customers()->where('id', $order['customer_id'])->first()->name;
        PaymentReceiptVoucherController::create([
            'value' => $refund['paid_amount'],
            'user_type' => 'customer',
            'user_name' => $customer_name,
            'type' => 'refund',
            'date' => $validated['import_date'],
            'note' => $refundCode,
            'is_calculated' => true,
            'branch_id' => $branch->id,
            'is_minus' => true,
            'payment_method' => $refund['payment_method']
        ]);

        return response()->json([
            'message' => 'Refund created successfully',
            'data' => $refund,
        ], 200);
    }

    public function index(Request $request, Store $store, Branch $branch)
    {
        $limit = $request->query('limit');
        $page = $request->query('page');
        // extract query string
        $start_date = $request->query('startDate');
        $end_date = $request->query('endDate');
        $min_total_amount = $request->query('minTotalAmount');
        $max_total_amount = $request->query('maxTotalAmount');
        $status = $request->query('status');
        $payment_method = $request->query('paymentMethod');
        $search_key = $request->query('searchKey');

        $order_by = $request->query('orderBy');
        $sort = $request->query('sort');


        // set up query
        $queries = [];

        if ($start_date) {
            array_push($queries, ['refunds.created_at', '>=', $start_date]);
        }

        if ($end_date) {
            array_push($queries, ['refunds.created_at', '<=', $end_date]);
        }

        if ($min_total_amount) {
            array_push($queries, ['refunds.total_amount', '>=', $min_total_amount]);
        }

        if ($max_total_amount) {
            array_push($queries, ['refunds.total_amount', '<=', $max_total_amount]);
        }


        if ($status) {
            array_push($queries, ['refunds.status', '=', $status]);
        }

        if ($payment_method) {
            array_push($queries, ['refunds.payment_method', '=', $payment_method]);
        }

        $details = RefundDetail::where('refund_details.store_id', $store->id)
            ->leftJoin('refunds', 'refunds.id', '=', 'refund_details.refund_id')
            ->where($queries);


        $database_query = $branch->refunds()
            ->where($queries)
            ->join('customers', 'refunds.customer_id', '=', 'customers.id')
            ->join('branches', 'refunds.branch_id', '=', 'branches.id')
            ->select('refunds.*', 'customers.name as customer_name', 'branches.name as branch_name');

        if ($search_key) {
            $order = $store->orders()->where('order_code', $search_key)->first();
            if ($order) {
                $database_query->where(function ($query) use (&$search_key, &$order) {
                    $query->where('refunds.refund_code', $search_key)
                        ->orWhere('customers.name', 'like', '%' . $search_key . '%')
                        ->orWhere('created_user_name', 'like', '%' . $search_key . '%')
                        ->orWhere('order_id', '=', $order->id);
                });
                $details->where(function ($query) use (&$search_key, &$order) {
                    $query->where('refunds.refund_code', $search_key)
                        ->orWhere('customers.name', 'like', '%' . $search_key . '%')
                        ->orWhere('created_user_name', 'like', '%' . $search_key . '%')
                        ->orWhere('order_id', '=', $order->id);
                });
            } else {
                $database_query->where(function ($query) use (&$search_key) {
                    $query->where('refunds.refund_code', $search_key)
                        ->orWhere('created_user_name', 'like', '%' . $search_key . '%')
                        ->orWhere('customers.name', 'like', '%' . $search_key . '%');
                });
                $details->where(function ($query) use (&$search_key) {
                    $query->where('refunds.refund_code', $search_key)
                        ->orWhere('created_user_name', 'like', '%' . $search_key . '%')
                        ->orWhere('customers.name', 'like', '%' . $search_key . '%');
                });
            }
        }

        $total_rows = $database_query->get()->count();
        $total_amount = $database_query->sum('total_amount');
        $total_quantity = $details->sum('refund_details.quantity');

        if ($limit) {
            $refunds = $database_query
                ->orderBy($order_by, $sort)
                ->offset($limit * $page)
                ->limit($limit)
                ->get();
        } else {
            $refunds = $database_query
                ->orderBy($order_by, $sort)
                ->get();
        }

        $refund_with_total_amount = [];
        foreach($refunds as $refund) {
            $refund_total_amount = RefundDetail::where('refund_id', $refund->id)->sum('quantity');
            array_push($refund_with_total_amount, array_merge($refund->toArray(), ['total_quantity' => $refund_total_amount]));
        }

        return response()->json([
            'data' => $refund_with_total_amount,
            'total_rows' => $total_rows,
            'total_amount' => $total_amount,
            'total_quantity' => $total_quantity,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Store $store, Branch $branch)
    {
        $validated = $request->validate([
            'user_id' => 'required|numeric',
            'invoice_id' => 'required|numeric',
            'payment_type' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $invoice = Invoice::find($validated['invoice_id'])->first();

        $order = Order::find($invoice->order_id)->first();


        $refund = Refund::create(array_merge(
            [
                'customer_id' => $order->customer_id,
                'order_id' => $order->id,
                'store_id' => $store->id,
                'branch_id' => $branch->id,
            ],
            $validated
        ));

        return response()->json([
            'message' => 'Refund created',
            'data' => $refund,
        ], 200);
    }

    public function show(Store $store, Refund $refund)
    {
        $details = $refund->refundDetails()
            ->join('products', 'refund_details.product_id', '=', 'products.id')
            ->select('refund_details.*', 'products.name', 'products.bar_code', 'products.product_code')->get();

        if ($refund->created_user_type === 'owner') {
            $created_by = User::where('id', $refund->created_by)->first();
        } else {
            $created_by = Employee::where('id', $refund->created_by)->first();
        }
        $data = array_merge([
            'customer' => $refund->customer,
            'branch' => $refund->branch,
            'details' => $details,
            'order' => $refund->order,
            'created_by_user' => $created_by,
        ], $refund->toArray());

        return response()->json([
            'data' => $data
        ], 200);
    }

    public function update(Request $request, Store $store, Branch $branch, Refund $refund)
    {
        $validated = $request->validate([
            'payment_type' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $refund->update($validated);

        return response()->json([
            'message' => 'Refund updated',
            'data' => $refund,
        ], 200);
    }

    public function destroy(Store $store, Branch $branch, Refund $refund)
    {
        $details = RefundDetail::where('refund_id', $refund->id)->get()->toArray();

        foreach ($details as $detail) {
            $product_id = $detail['product_id'];

            $batches = json_decode($detail['batches']);
            foreach ( $batches as $batch) {
                DB::table('product_batches')
                    ->where('store_id', $store->id)
                    ->where('branch_id', $branch->id)
                    ->where('product_id', $product_id)
                    ->where('id', $batch['id'])
                    ->decrement('quantity', $batch['returned_quantity']);
            }

            // update branch inventory table
            $productOfStore = BranchInventory::where([['branch_id', '=', $branch->id], ['product_id', '=', $product_id]])->first();

            if ($productOfStore) {
                BranchInventory::where([['branch_id', '=', $branch->id], ['product_id', '=', $product_id]])
                    ->decrement('quantity_available', $detail['quantity']);
            }
        }
        Refund::destroy($refund->id);
        RefundDetail::where('refund_id', $refund->id)->delete();
        PaymentReceiptVoucherController::deleteByCode($refund['refund_code']);

        return response()->json([
            'message' => 'deleted successfully',
            'data' => [
                'refund' => $refund,
            ]
        ], 200);
    }
}
