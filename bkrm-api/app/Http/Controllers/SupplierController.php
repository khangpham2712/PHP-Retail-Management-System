<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

class SupplierController extends Controller
{

    public function index(Request $request, Store $store)
    {
        $search_key = $request->query('searchKey');
        $limit = $request->query('limit');
        $page = $request->query('page');

        $db_query =$store->suppliers()
            ->where('type', '<>', 'default')
            ->where('status', '<>', 'deleted')
            ->orderBy('created_at', 'desc');


        if ($search_key) {
            $db_query = $db_query->where(function ($query) use($search_key) {
                $query->where('name', 'like', '%' . $search_key . '%')
                    ->orWhere('supplier_code', 'like', '%' . $search_key . '%' )
                    ->orWhere('phone', 'like', '%' . $search_key . '%')
                    ->orWhere('email', 'like', '%' . $search_key . '%');
            });
        }

        $total_rows = $db_query->count();

        if ($limit) {
            $suppliers = $db_query->offset($limit*$page)->limit($limit)->get();
        } else {
            $suppliers = $db_query->get();
        }
        $data = [];
        foreach($suppliers as $supplier) {
            $total_payment = $store->purchaseOrders()->where('supplier_id', '=', $supplier->id)->sum('total_amount');
            $total_paid = $store->purchaseOrders()->where('supplier_id', '=', $supplier->id)->sum('paid_amount');
            $total_discount = $store->purchaseOrders()->where('supplier_id', '=', $supplier->id)->sum('discount');
            $debt = $total_payment - $total_paid - $total_discount;

            array_push($data, array_merge($supplier->toArray(), ['total_payment' => $total_payment,'debt' => $debt]));
        }

        return response()->json([
            'data' => $data,
            'total_rows' => $total_rows,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Store $store)
    {
        $validated = $request->validate([
            'company' => 'nullable|string',
            'name' => 'required|string',
            'email' => 'nullable|string',
            'job_title' => 'nullable|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'ward' => 'nullable|string',
            'city' => 'nullable|string',
            'province' => 'nullable|string',
            'payment_info' => 'nullable|string',
            'image' => 'nullable',
        ]);

        $imagePath = "";
        if (array_key_exists('image', $validated)) {
            if ($validated['image'] != null) {
                /*$imagePath = $validated['image']->store('supplier-images', 'public');
                $sized_image = Image::make(public_path("storage/{$imagePath}"))->fit(1000, 1000);
                $sized_image->save();
                $imagePath = config('app.url') . $imagePath;*/

                $fileName = Str::random(28). '.' . $validated['image']->getClientOriginalExtension();
                $folder = '/storage/supplier-images';
                $validated['image']->move(public_path($folder), $fileName);
                $imagePath = config('app.url') . "/{$folder}/{$fileName}";
            }
        } else {
            $imagePath = config('app.url') . '/supplier-images/supplier-default.png';
        }

        $last_id = count($store->suppliers);
        $supplier_code = 'NCC' . sprintf('%06d', $last_id + 1);

        $supplier = Supplier::create(
            [
                'store_id' => $store->id,
                'uuid' => (string) Str::uuid(),
                'img_url' => $imagePath,
                'job_title' => array_key_exists('job_title', $validated) ? $validated['job_title'] : "",
                'email' => array_key_exists('email', $validated) ? $validated['email'] : "",
                'name' => array_key_exists('name', $validated) ? $validated['name'] : "",
                'address' => array_key_exists('address', $validated) ? $validated['address'] : "",
                'phone' => array_key_exists('phone', $validated) ? $validated['phone'] : "",
                'ward' => array_key_exists('ward', $validated) ? $validated['ward'] : "",
                'city' => array_key_exists('city', $validated) ? $validated['city'] : "",
                'province' => array_key_exists('province', $validated) ? $validated['province'] : "",
                'payment_info' => array_key_exists('payment_info', $validated) ? $validated['payment_info'] : "",
                'company' => array_key_exists('company', $validated) ? $validated['company'] : "",
                'supplier_code' => $supplier_code,
            ],
        );

        return response()->json([
            'data' => $supplier
        ], 200);
    }

    public function show(Store $store, Supplier $supplier)
    {
        return response()->json([
            'data' => $supplier
        ], 200);
    }

    public function update(Request $request, Store $store, Supplier $supplier)
    {
        $validated = $request->validate([
            'company' => 'nullable|string',
            'name' => 'nullable|string',
            'email' => 'nullable|string',
            'job_title' => 'nullable|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'ward' => 'nullable|string',
            'city' => 'nullable|string',
            'province' => 'nullable|string',
            'payment_info' => 'nullable|string',
            'status' => 'nullable|string',
        ]);

        $supplier->update($validated);

        return response()->json([
            'data' => $supplier
        ], 200);
    }

    public function destroy(Store $store, Supplier $supplier)
    {
        $numOfSupplier = $store->suppliers()->where('status', 'active')->count();
        if ($numOfSupplier <= 1) {
            return response()->json([
                'message' => 'Can not delete last supplier',
                'data' => $numOfSupplier
            ], 404);
        }


        $supplier->update(['status' => 'deleted']);
        return response()->json([
            'message' => 1,
            'data' => $numOfSupplier
        ], 200);
    }
    public function payDebt(Request $request, Store $store, Supplier $supplier) {
        $validated = $request->validate(['paid_amount' => 'numeric|required']);
        $paid_amount = $validated['paid_amount'];

        $orders = $store->purchaseOrders()
            ->where('supplier_id', '=',$supplier->id)
            ->whereRaw('purchase_orders.total_amount - purchase_orders.discount - purchase_orders.paid_amount > 0')
            ->orderBy('creation_date', 'asc')
            ->get()->toArray();
        $numberOfOrders = count($orders);
        $index = 0;
        while($paid_amount >= 0 && $index < $numberOfOrders) {
            $debt_amount = $orders[$index]['total_amount'] - $orders[$index]['discount'] -  $orders[$index]['paid_amount'];
            $order_id = $orders[$index]['id'];
            if ($paid_amount >= $debt_amount) {
                $store->purchaseOrders()->where('id', $order_id)->increment('paid_amount', $debt_amount);
                $paid_amount = $paid_amount - $debt_amount;
            } else {
                $store->purchaseOrders()->where('id', $order_id)->increment('paid_amount', $paid_amount);
                $paid_amount = 0;
            }
            $index += 1;
        }
        return response()->json(['status' => $numberOfOrders, 'supplier' => $supplier]);
    }
}
