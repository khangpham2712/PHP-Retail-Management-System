<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Store;
use App\Models\Branch;
use App\Models\InventoryCheck;
use App\Models\InventoryCheckDetail;
use App\Models\InventoryTransaction;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Employee;
use Illuminate\Support\Str;
use App\Models\BranchInventory;
use Illuminate\Support\Facades\DB;

class InventoryCheckController extends Controller
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

        
        $search_key = $request->query('searchKey');
        $order_by = $request->query('orderBy');
        $sort = $request->query('sort');


        // set up query
        $queries = [];
        if ($start_date) {
            array_push($queries, ['inventory_checks.created_at', '>=', $start_date . ' 00:00:00']);
        }
        if ($end_date) {
            array_push($queries, ['inventory_checks.created_at', '<=', $end_date . ' 12:59:59']);
        }
        if ($min_total_amount) {
            array_push($queries, ['inventory_checks.total_amount', '>=', $min_total_amount]);
        }

        if ($max_total_amount) {
            array_push($queries, ['inventory_checks.total_amount', '<=', $max_total_amount]);
        }



        $data = [];

        $query =  $branch->inventoryChecks()
            ->where($queries)
            ->join('branches', 'inventory_checks.branch_id', '=', 'branches.id')
            ->select('inventory_checks.*', 'branches.name as branch_name');

        if ($search_key) {
            $query->where(function ($query) use (&$search_key) {
                $query->where('inventory_checks.inventory_check_code', 'like', '%' . $search_key . '%')
                    ->orWhere('inventory_checks.created_user_name', 'like', '%' . $search_key . '%');
            });
        }

        $total_rows = $query->get()->count();

        if ($limit) {
            $inventoryChecks = $query
                ->orderBy($order_by, $sort)
                ->offset($limit*$page)
                ->limit($limit)
                ->get()->toArray();
        } else {
            $inventoryChecks = $query
                ->orderBy($order_by, $sort)
                ->get()->toArray();
        }

        foreach($inventoryChecks as $inventoryCheck) {
            if ($inventoryCheck['created_user_type'] === 'owner') {
                $user = User::where('id', $inventoryCheck['created_by'])->first();
                $inventoryCheck = array_merge($inventoryCheck, [
                    'user_name' => $user->name,
                    'user_phone' => $user->phone,
                ]);
            } else {
                $user = Employee::where('id', $inventoryCheck['created_by'])->first();
                $inventoryCheck = array_merge($inventoryCheck, [
                    'user_name' => $user->name,
                    'user_phone' => $user->phone,
                ]);
            }

            $details = InventoryCheckDetail::where('inventory_check_id', $inventoryCheck['id'])
                ->join('products', 'products.id', '=', 'inventory_check_details.product_id')
                ->select('inventory_check_details.*', 'products.name as product_name', 'products.bar_code as product_bar_code')
                ->get();
            
            $inventoryCheck = array_merge($inventoryCheck, ['details' => $details]);
            array_push($data, $inventoryCheck);
        }

        return response()->json([
            'data' => $data,
            'total_rows' => $total_rows,
        ], 200);
    }

    public function store(Request $request, Store $store, Branch $branch)
    {
        $validated = $request->validate([
            'total_amount' => 'required|numeric',
            'details' => 'required',
            'note' => 'nullable',
        ]);

        // get the user of  token
        $created_by = $approved_by = null;
        $created_user_type = '';
        $user = null;

        if (Auth::guard('user')->user()) {
            $created_by = $approved_by = Auth::guard('user')->user()->id;
            $user = Auth::guard('user')->user();
            $created_user_type = 'owner';
        } else if (Auth::guard('employee')->user()) {
            $created_by = $approved_by = Auth::guard('employee')->user()->id;
            $user = Auth::guard('employee')->user();
            $created_user_type = 'employee';
        } else {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }

        $last_id = $store->inventoryChecks()->count();

        $invetoryCheckCode = 'KK' . sprintf('%06d', $last_id + 1);

        $invetoryCheck = InventoryCheck::create([
            'store_id' => $store->id,
            'uuid' => (string)Str::uuid(),
            'branch_id' => $branch->id,
            'inventory_check_code' => $invetoryCheckCode,
            'approved_by' => $approved_by,
            'created_by' => $created_by,
            'total_amount' => $validated['total_amount'],
            'created_user_type' => $created_user_type,
            'created_user_name' => $user->name
        ]);

        foreach ($validated['details'] as $detail) {
            $product_id = $store->products->where('uuid', '=', $detail['uuid'])->first()->id;

            $inventoryTransaction = InventoryTransaction::create([
                'uuid' => (string)Str::uuid(),
                'store_id' => $store->id,
                'product_id' => $product_id,
                'quantity' => $detail['quantity'],
                'branch_id' => $branch->id,
                'transaction_type' => 'balance',
            ]);

            $batches = [];

            if ($detail['batches']) {
                foreach ($detail['batches'] as $batch) {
                    if ($batch['is_checked']) {
                        DB::table('product_batches')
                            ->where('store_id', $store->id)
                            ->where('branch_id', $branch->id)
                            ->where('product_id', $product_id)
                            ->where('id', $batch['id'])
                            ->update(['quantity' => $batch['checked_quantity']]);
                        $result = DB::table('product_batches')
                            ->where('id', $batch['id'])->first();
                        array_push($batches, $result);
                    }
                }
            }

            InventoryCheckDetail::create([
                'store_id' => $store->id,
                'branch_id' => $branch->id,
                'product_id' => $product_id,
                'inventory_transaction_id' => $inventoryTransaction->id,
                'branch_inventory' => $detail['branch_inventory'],
                'inventory_check_id' => $invetoryCheck->id,
                'unit_price' => $detail['unit_price'],
                'quantity' => $detail['quantity'],
                'batches' => $detail['batches'] ? json_encode($detail['batches']) : "[]"
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

        return response()->json([
            'message' => 'Inventory check created successfully',
            'data' => $invetoryCheck,
        ], 200);
    }

    public function show(Store $store, InventoryCheck $inventoryCheck)
    {

        $details = $inventoryCheck->inventoryCheckDetails()
            ->join('products', 'inventory_check_details.product_id', '=', 'products.id')
            ->select('inventory_check_details.*', 'products.name', 'products.bar_code', 'products.product_code')->get();

        if ($inventoryCheck->created_user_type === 'owner') {
            $created_by = User::where('id', $inventoryCheck->created_by)->first();
        } else {
            $created_by = Employee::where('id', $inventoryCheck->created_by)->first();
        }
        $data = array_merge([
            'branch' => $inventoryCheck->branch,
            'details' => $details,
            'created_by_user' => $created_by,
        ], $inventoryCheck->toArray());

        return response()->json([
            'data' => $data
        ], 200);
    }
}
