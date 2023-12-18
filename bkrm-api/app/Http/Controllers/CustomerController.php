<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    public function index(Request $request, Store $store)
    {
        $search_key = $request->query('searchKey');
        $limit = $request->query('limit');
        $page = $request->query('page');

        $db_query = $store->customers()
            ->where('status', '<>', 'deleted')
            ->where('type', '<>', 'default')
            ->orderBy('created_at', 'desc');

        if ($search_key) {
            $db_query = $db_query->where(function ($query) use ($search_key) {
                $query->where('name', 'like', '%' . $search_key . '%')
                    ->orWhere('phone', 'like', '%' . $search_key . '%')
                    ->orWhere('customer_code', 'like', '%' . $search_key . '%')
                    ->orWhere('email', 'like', '%' . $search_key . '%');
            });
        }
        $total_rows = $db_query->count();
        if ($limit) {
            $customers = $db_query->offset($limit * $page)->limit($limit)->get();
        } else {
            $customers = $db_query->get();
        }
        $data = [];
        foreach ($customers as $customer) {
            $total_payment = $store->orders()->where('customer_id', '=', $customer->id)->sum('total_amount');
            $total_paid = $store->orders()->where('customer_id', '=', $customer->id)->sum('paid_amount');
            $total_discount = $store->orders()->where('customer_id', '=', $customer->id)->sum('discount');
            $debt = $total_payment - $total_paid - $total_discount;

            $customer_pay_debts = DB::table('customer_pay_debts')->where('customer_id', $customer->id)->get();

            array_push($data, array_merge($customer->toArray(), [
                'total_payment' => $total_payment,
                'debt' => $debt,
                'customer_pay_debts' => $customer_pay_debts,
            ]));
        }
        return response()->json([
            'data' => $data,
            'total_rows' => $total_rows
        ], 200);
    }
    public function customerDebts(Request $request, Store $store) {
        // extract query string
        $start_date = $request->query('startDate');
        $end_date = $request->query('endDate');
        $search_key = $request->query('searchKey');
        $customer_pay_debts = DB::table('customer_pay_debts')
            ->where('customer_pay_debts.store_id', '=', $store->id)
            ->join('customers', 'customers.id', '=', 'customer_pay_debts.customer_id')
            ->select('customer_pay_debts.*', 'customers.name as customer_name', 'customers.phone as customer_phone')
            ->where('date', '>=', $start_date)
            ->where('date', '<=', $end_date);
        if ($search_key) {
            $customer_pay_debts = $customer_pay_debts->where('customers.name', 'like', '%' . $search_key . '%');
        }
        return response()->json([
            'data' => $customer_pay_debts->get(),
        ]);
    }
    public function payDebt(Request $request, Store $store, Customer $customer) {
        $validated = $request->validate([
            'paid_amount' => 'numeric|required',
            'created_user_type' => 'required|string',
            'created_user_name' => 'required|string',
            'date' => 'required|string',
            'created_user_id' => 'required|numeric',
        ]);
        $paid_amount = $validated['paid_amount'];
        $last_id = DB::table('customer_pay_debts')->where('customer_id', $customer->id)->count();
        $code = 'KH' . sprintf('%06d', $last_id + 1);
        DB::table('customer_pay_debts')->insert([
            'customer_id' => $customer->id,
            'amount' => $paid_amount,
            'date' => $validated['date'],
            'created_user_type' => $validated['created_user_type'],
            'created_user_name' => $validated['created_user_name'],
            'created_user_id' => $validated['created_user_id'],
            'code' => $code,
            'store_id' => $store->id,
        ]);
        $orders = $store->orders()
            ->where('customer_id', $customer->id)
            ->whereRaw('orders.total_amount - orders.discount - orders.paid_amount > 0')
            ->orderBy('creation_date', 'asc')
            ->get()->toArray();
        $numberOfOrders = count($orders);
        $index = 0;
        while($paid_amount >= 0 && $index < $numberOfOrders) {
            $debt_amount = $orders[$index]['total_amount'] - $orders[$index]['discount'] -  $orders[$index]['paid_amount'];
            $order_id = $orders[$index]['id'];
            if ($paid_amount >= $debt_amount) {
                $store->orders()->where('id', $order_id)->increment('paid_amount', $debt_amount);
                $paid_amount = $paid_amount - $debt_amount;
            } else {
                $store->orders()->where('id', $order_id)->increment('paid_amount', $paid_amount);
                $paid_amount = 0;
            }
            $index += 1;
        }



        return response()->json(['status' => 1]);
    }
    public function store(Request $request, Store $store)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'nullable|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'ward' => 'nullable|string',
            'district' => 'nullable|string',
            'province' => 'nullable|string',
            'payment_info' => 'nullable|string',
            'image' => 'nullable'
        ]);

        if (array_key_exists('phone', $validated)) {
            if ($validated['phone']) {
                if (count($store->customers()->where('phone', $validated['phone'])->get())) {
                    return response()->json(['message' => 'Customer phone number existed'], 400);
                }
            }
        }

        $imagePath = "";
        if (array_key_exists('image', $validated)) {
            if ($validated['image'] != null) {
                /*$imagePath = $validated['image']->store('customer-images', 'public');
                $sized_image = Image::make(public_path("storage/{$imagePath}"))->fit(1000, 1000);
                $sized_image->save();*/

                $fileName = Str::random(28). '.' . $validated['image']->getClientOriginalExtension();
                $folder = '/storage/customer-images';
                $validated['image']->move(public_path($folder), $fileName);
                $imagePath = config('app.url') . "/{$folder}/{$fileName}";
            }
        } else {
            $imagePath = config('app.url') . '/customer-images/customer-default.png';
        }

        $last_id = count($store->customers);
        $customer_code = 'KH' . sprintf('%06d', $last_id + 1);

        $customer = Customer::create(array_merge(
            [
                'store_id' => $store->id,
                'uuid' => (string) Str::uuid(),
                'img_url' => $imagePath,
                'customer_code' => $customer_code
            ],
            $validated
        ));

        return response()->json([
            'data' => $customer
        ], 200);
    }
    public function show(Store $store, Customer $customer)
    {
        $total_payment = $store->orders()->where('customer_id', '=', $customer->id)->sum('total_amount');
        $total_paid = $store->orders()->where('customer_id', '=', $customer->id)->sum('paid_amount');
        $total_discount = $store->orders()->where('customer_id', '=', $customer->id)->sum('discount');
        $debt = $total_payment - $total_paid - $total_discount;

        return response()->json([
            'data' => array_merge($customer->toArray(), ['total_payment' => $total_payment, 'debt' => $debt])

        ], 200);
    }
    public function update(Request $request, Store $store, Customer $customer)
    {
        $validated = $request->validate([
            'name' => 'nullable|string',
            'email' => 'nullable|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'ward' => 'nullable|string',
            'city' => 'nullable|string',
            'province' => 'nullable|string',
            'payment_info' => 'nullable|string',
            'status' => 'nullable|string',
            'vouchers' => 'nullable|string'
        ]);

        if (array_key_exists('phone', $validated)) {
            $existedCustomer = $store->customers()->where('id', '<>', $customer->id)->where('phone', $validated['phone'])->first();
            if ($existedCustomer) {
                return response()->json(['message' => 'Can not update'], 400);
            }
        }

        $customer->update($validated);

        return response()->json([
            'data' => $customer
        ], 200);
    }
    public function destroy(Store $store, Customer $customer)
    {
        $numOfCust = $store->customers()->where('status', 'active')->count();
        if ($numOfCust <= 1) {
            return response()->json([
                'message' => 'Can not delete last customer',
                'data' => $customer
            ], 404);
        }

        $customer->update(['status' => 'deleted']);
        return response()->json([
            'message' => 1,
            'data' => $customer
        ], 200);
    }
    public function addCustomersByJson(Request $request, Store $store)
    {
        $customers = $request->input('json_data');

        $newCustomers = [];
        foreach ($customers as $key => $customer) {
            $typeValidator = Validator::make($customer, [
                'name' => 'required|string|max:255',
                'phone' => 'nullable|string',
                'address' => 'nullable|string',
                'email' => 'nullable|string',
                'payment_info' => 'nullable|string',
                'province' => 'nullable|string',
                'ward' => 'nullable|string',
                'district' => 'nullable|string',
                'points' => 'nullable|string'
            ], [
                'unique' => ':attribute đã được sử dụng',
                'required' => ':attribute bị thiếu',
                'string' => 'Kiểu chuỗi',
                'numeric' => 'Kiểu số',
            ]);


            if ($typeValidator->fails()) {
                continue;
            } else {
                // if (!$store->customers()->where('id', $customer['phone'])->first()) {
                //     array_push($newCustomers, $customer);
                // }
                array_push($newCustomers, $customer);
            }
        }

        foreach ($newCustomers as $customer) {
            $last_id = count($store->customers);
            $customer_code = 'KH' . sprintf('%06d', $last_id + 1);
            Customer::create(array_merge($customer, ['customer_code' => $customer_code, 'store_id' => $store->id]));
        }

        return response()->json([
            'message' => 'customers added successfully',
            'newCust' => $newCustomers
        ], 200);
    }
    public function customerDebt($store) {
        $storeConfig = json_decode($store['general_configuration'], true)['notifyDebt'];

        if ($storeConfig['checkDebtAmount']) {
            $customers = $store->orders()
                ->join('customers', 'customers.id', '=', 'orders.customer_id')
                ->selectRaw('orders.*, customers.*, SUM(orders.total_amount - orders.paid_amount) AS debt, MAX(orders.creation_date) as max_order_date')
                ->groupBy('customers.name', 'customers.email', 'customers.address', 'debt', 'customers.phone', 'customers.status')
                ->where('customers.status', '=', 'active')
                ->where('debt', '>=', $storeConfig['debtAmount']);

        } else {
            $customers = $store->customers()
                ->where('customers.status', '=', 'active')
                ->where('debt', '>=', $storeConfig['debtAmount']);
        }
    }
}
