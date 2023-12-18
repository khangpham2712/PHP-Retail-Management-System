<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Store;
use App\Models\Branch;
use App\Models\Order;
use App\Models\Customer;
use App\Models\CustomerOrder;
use App\Models\BranchInventory;
use Illuminate\Support\Facades\DB;
use PhpParser\JsonDecoder;

class CustomerOrderController extends Controller
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
        $status = $request->query('status');
        $search_key = $request->query('searchKey');
        $order_by = $request->query('orderBy');
        $sort = $request->query('sort');

        // set up query
        $queries = [];


        if ($start_date) {
            array_push($queries, ['customer_orders.created_at', '>=', $start_date . ' 00:00:00']);
        }

        if ($end_date) {
            array_push($queries, ['customer_orders.created_at', '<=', $end_date . ' 00:00:00']);
        }

        if ($min_total_amount) {
            array_push($queries, ['customer_orders.total_amount', '>=', $min_total_amount]);
        }

        if ($max_total_amount) {
            array_push($queries, ['customer_orders.total_amount', '<=', $max_total_amount]);
        }


        // if ($status) {
        //     array_push($queries, ['customer_orders.status', '==', $status]);
        // }


        
        $database_query =  $branch->customerOrders()
            ->where($queries)
            ->join('branches', 'customer_orders.branch_id', '=', 'branches.id')
            ->select('customer_orders.*', 'branches.name as branch_name');

        if ($search_key) {
            $database_query->where(function ($query) use (&$search_key) {
                $query->where('customer_orders.customer_order_code', $search_key)
                    ->orWhere('name', 'like', '%' . $search_key . '%')
                    ->orWhere('phone', 'like', '%' . $search_key . '%');
            });
        }


        $total_rows = $database_query->get()->count();
        if ($limit) {
            $orders = $database_query
                ->orderBy($order_by, $sort)
                ->offset($limit * $page)
                ->limit($limit)
                ->get();
        } else {
            $orders = $database_query
                ->orderBy($order_by, $sort)
                ->get();
        }

        return response()->json([
            'data' => $orders,
            'total_rows' => $total_rows,
        ], 200);
    }

    public function cancel(Request $request, Store $store, Branch $branch, CustomerOrder $customerOrder)
    {
        // $details = json_decode($customerOrder->details);
        // foreach ($details as $detail) {
        //     $branch->inventory()->where('product_id', $detail['id'])->increment('quantity_available', $detail['quantity']);
        // }

        $customerOrder->update(['status' => 'cancelled']);
        return response()->json(['message' => 'Customer order canceled']);
    }

    // return products info for each product in customer order
    public function process(Request $request, Store $store, Branch $branch, CustomerOrder $customerOrder)
    {
        $details = json_decode($customerOrder->details, true);
        $data = [];
        foreach ($details as $detail) {
            $product = $store->products()->where('id', $detail['id'])->first();
            $branch_product = $branch->inventory()->where('product_id', $product['id'])->first();
            $branch_quantity = $branch_product->quantity_available;
            $batches = DB::table('product_batches')
                ->where('store_id', $store->id)
                ->where('branch_id', $branch->id)
                ->where('product_id', $product['id'])
                ->orderBy('expiry_date', 'desc')
                ->get();
            array_push($data, array_merge($product->toArray(), [
                'branch_quantity' => $branch_quantity,
                'batches' => $batches,
                'branch_inventories' => BranchInventory::where('product_id', $product['id'])->join('branches', 'branches.id', 'branch_inventories.branch_id')->where('branches.status', 'active')->get(),
            ]));
        }

        return response()->json([
            'data' => $data,
        ], 200);
    }

    public function confirm(Request $request, Store $store, Branch $branch, CustomerOrder $customerOrder)
    {
        $details = json_decode($customerOrder->details);

        $validated = $request->validate([
            'order_id' => 'numeric|required',
            'order_code' => 'string|required',
        ]);

        // $messages = $this->validateDetails($details, $branch);
        // if (count($messages)) {
        //     return response()->json(['status' => 0, 'data' => $messages, 'message' => 'cannot comfirmed'], 200);
        // }

        // if pass => reduce the inventory
        // foreach($details as $detail) {
        //     $branch->inventory()->where('product_id', $detail['id'])->decrement('quantity_available', $detail['quantity']);
        // }

        $customerOrder->update([
            'status' => 'confirmed',
            'order_id' => $validated['order_id'],
            'order_code' => $validated['order_code']
        ]);
        return response()->json(['message' => 'Customer order comfirmed']);
    }


    public function updateDetails(Request $request, Store $store, Branch $branch, CustomerOrder $customerOrder)
    {
        // validation for details it should not be larger then the branch inventory
        $validated = $request->validate(['details' => 'string|required']);
        $details = json_decode($validated['details']);

        $messages = [];
        foreach ($details as $detail) {
            $branch_inventory = $branch->inventory()->where('product_id', $detail['id'])->first();
            if ($branch_inventory) {
                if ($branch_inventory->quantity_available < $detail['quantity']) {
                    array_push($messages, ['product_name' => $detail['name'], 'branch_inventory' =>  $branch_inventory->quantity_available, 'order_quantity' => $detail['quantity']]);
                }
            } else {
                array_push($messages, ['product_name' => $detail['name'], 'branch_inventory' =>  0, 'order_quantity' => $detail['quantity']]);
            }
        }
        if (count($messages)) {
            return response()->json(['status' => 0, 'data' => $messages, 'message' => 'cannot comfirmed'], 200);
        }

        $customerOrder->update(['details' => $validated['details']]);
        return response()->json(['message' => 'Update customer order successfully']);
    }

    public function payment(Request $request, Store $store, Branch $branch, CustomerOrder $customerOrder)
    {
        $validated = $request->validate([
            'paid_date' => 'required|date_format:Y-m-d H:i:s',
        ]);

        $customerOrder->update([
            'status' => 'paid'
        ]);

        $order = Order::where('id',  $customerOrder['order_id'])->first();

        if ($order) {
            Order::where('id',  $customerOrder['order_id'])->update([
                'status' => 'closed', 
                'paid_amount' => $order['total_amount'] - $order['discount'], 
                'paid_date' => $validated['paid_date']
            ]);
        };

        return response()->json(['message' => 'Customer order paid']);
    }

    private function validateDetails($details, $branch)
    {
        $messages = [];
        foreach ($details as $detail) {
            $branch_inventory = $branch->inventory()->where('product_id', $detail['id'])->first();
            if ($branch_inventory) {
                if ($branch_inventory->quantity_available < $detail['quantity']) {
                    array_push($messages, ['product_name' => $detail['name'], 'branch_inventory' =>  $branch_inventory->quantity_available, 'order_quantity' => $detail['quantity']]);
                }
            } else {
                array_push($messages, ['product_name' => $detail['name'], 'branch_inventory' =>  0, 'order_quantity' => $detail['quantity']]);
            }
        }
        return $messages;
    }
}
