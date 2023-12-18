<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\Employee;
use App\Models\CustomerOrder;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use DateTime;
use App\Models\BranchInventory;

class CustomerPageController extends Controller
{
    public function storeInfo(Request $request)
    {
        $store_web_page = $request->query('store_web_page');
        $store = Store::where('web_page', $store_web_page)->first();
        $isActive = json_decode($store['web_configuration'], true)['status'];

        if ($isActive === "inactive") {
            return response()->json(['data' => 'Inactive web'], 400);
        }

        $branches = $store->branches()->where('status', 'active')->get()->toArray();

        return response()->json(['data' => array_merge($store->toArray(),['branches' => $branches])]);
    }

    public function storeProducts(Request $request, Store $store)
    {
        // $limit = $request->query("limit") ? $request->query("limit") : 10;
        // $page = $request->query("page") ? $request->query("page") : 1;

        // $productQuery = $store->products()->where('status', 'active');
        $isActive = json_decode($store['web_configuration'], true)['status'];
        if ($isActive === "inactive") {
            return response()->json(['data' => 'Inactive web'], 400);
        }


        $total_row = $store->products()->where([
            ['status', '<>', 'inactive'],
            ['status', '<>', 'deleted'],
        ])->count();

        $products = $store->products()
            ->where([

                ['status', '<>', 'inactive'],
                ['status', '<>', 'deleted'],
            ])
            ->orderBy('created_at', 'desc')
            ->get()->toArray();

        $data = [];

        foreach ($products as $product) {
            $category = $store->categories->where('id', $product['category_id'])->first();
            unset($product['category_id']);
            array_push($data, array_merge($product, [
                'category' => $category,
                'branch_inventories' => BranchInventory::where('product_id', $product['id'])->join('branches', 'branches.id', 'branch_inventories.branch_id')->where('branches.status', 'active')->get(),
            ]));
        }

        return response()->json([
            'data' => $data,
            'total_rows' => $total_row
        ], 200);
    }

    public function addOrder(Request $request, Store $store)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'phone' => 'required|string',
            'address' => 'nullable|string',
            'branch_id' => 'required|numeric',
            'total_amount' => 'required|numeric',
            'description' => "nullable|string",
            'details' => "required|string",
            
        ]);

           # generate code
           $last_id = $store->customerOrders()->count();
           $code = 'DDH' . sprintf('%06d', $last_id + 1);

        $order = CustomerOrder::create(array_merge($validated, ['customer_order_code' => $code, 'store_id' => $store->id, 'status' => 'new']));

        return response()->json([
            'message' => 'Order created successfully',
            'data' => [
                'order' => $order,
            ]
        ], 200);
    }

    public function getOrders(Request $request, Store $store) {
        $validated = $request->query('customer_phone');

        $customer_orders = $store->customerOrders()->where('phone',  $validated['customer_phone'])->join('branches', 'branches.id', '=', 'customer_orders.branch_id')->get();
        return response()->json(['data' => $customer_orders]);
    }
}
