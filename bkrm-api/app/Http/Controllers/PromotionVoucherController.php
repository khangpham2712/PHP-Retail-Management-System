<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;
use App\Models\Store;
use App\Models\Voucher;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Config;
use App\Mail\VoucherMail;

class PromotionVoucherController extends Controller
{
    public function createPromotion(Request $request, Store $store)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'promotion_condition' => 'nullable|string',
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d',
            'customer_birth' => 'nullable|boolean',
            'dateAdvanceSetting' => 'nullable|string',
            'discountType' => 'nullable|string',
            'discountKey' => 'nullable|string',
        ]);

        $last_id = DB::table('promotions')
            ->where('store_id', $store->id)
            ->count();

        $promotion_code = 'KM' . sprintf('%06d', $last_id + 1);

        DB::table('promotions')
            ->insert(array_merge(
                [
                    'store_id' => $store->id,
                    'promotion_code' => $promotion_code,
                ],
                $validated
            ));

        return response()->json([
            'message' => 'success',
            'data' => $promotion_code,
        ]);
    }

    public function createVoucher(Request $request, Store $store)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d',
            'status' => 'nullable|string',
            'quantity' => 'nullable|numeric',
            'value' => 'required|numeric',
            'min_order_total' => 'nullable|numeric'
        ]);

        $last_id = DB::table('vouchers')
            ->where('store_id', $store->id)
            ->count();

        $voucher_code = 'VC' . sprintf('%06d', $last_id + 1);

        DB::table('promotions')
            ->insert(array_merge(
                [
                    'store_id' => $store->id,
                    'voucher_code' => $voucher_code,
                ],
                $validated
            ));

        return response()->json([
            'message' => 'success',
            'data' => $voucher_code,
        ]);
    }

    public function getActivePromotionVoucher(Request $request, Store $store)
    {
        $current_date = $request->query('date');

        $promotions = DB::table('promotions')
            ->where('store_id', $store->id)
            ->where('status', 'active')
            ->where(function ($query) use ($current_date) {
                $query->where('start_date', '<=', $current_date)
                    ->orWhere('start_date',  null);
            })
            ->where(function ($query) use ($current_date) {
                $query->where('end_date', '>=', $current_date)
                    ->orWhere('end_date',  null);
            })
            ->get();
        $voucher = DB::table('vouchers')
            ->where('store_id', $store->id)
            ->where(function ($query) use ($current_date) {
                $query->where('start_date', '<=', $current_date)
                    ->orWhere('start_date',  null);
            })
            ->where(function ($query) use ($current_date) {
                $query->where('end_date', '>=', $current_date)
                    ->orWhere('end_date',  null);
            })
            ->where('status', 'active')->get();

        return response()->json([
            'promotions' => $promotions,
            'vouchers' => $voucher,
        ]);
    }

    public function getAllPromotions(Request $request, Store $store)
    {
        $limit = $request->query("limit");
        $page = $request->query("page");

        $promotions = DB::table('promotions')
            ->where('store_id', $store->id)
            ->where('status', '<>', 'deleted')
            ->orderBy('created_at', 'desc')
            ->offset($limit * ($page))
            ->limit($limit)
            ->get();

        $data = [];
        foreach($promotions as $promotion) {
            $orders = DB::table('orders')->where('promotion_id', $promotion->id)->get();
            array_push($data, array_merge((array) $promotion, ['orders' => $orders]));
        }
        return response()->json([
            'promotions' => $data,
            'message' => 'success',
        ]);
    }

    public function getAllVouchers(Request $request, Store $store)
    {
        $limit = $request->query("limit");
        $page = $request->query("page");
        $vouchers = DB::table('vouchers')
            ->where('store_id', $store->id)
            ->where('status', '<>', 'deleted')
            ->orderBy('created_at', 'desc')
            ->offset($limit * ($page - 1))
            ->limit($limit)
            ->get();


        return response()->json([
            'vouchers' => $vouchers,
            'message' => 'success',
        ]);
    }

    public function updatePromotion(Request $request, Store $store, Promotion $promotion)
    {
        $validated = $request->validate([
            'name' => 'nullable|string',
            'promotion_condition' => 'nullable|string',
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d',
            'status' => 'nullable|string',
            'dateAdvanceSetting' => 'nullable|string',
            'discountType' => 'nullable|string',
            'discountKey' => 'nullable|string',
        ]);

        DB::table('promotions')
            ->where('id', $promotion->id)
            ->update($validated);

        return response()->json([
            'message' => 'success',
        ]);
    }

    public function updateVoucher(Request $request, Store $store, Voucher $voucher)
    {
        $validated = $request->validate([
            'name' => 'nullable|string',
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d',
            'status' => 'nullable|string',
            'quantity' => 'nullable|numeric',
            'value' => 'nullable|numeric',
            'min_order_total' => 'nullable|numeric'
        ]);

        DB::table('vouchers')
            ->where('id', $voucher->id)
            ->update($validated);

        return response()->json([
            'message' => 'success',
        ]);
    }
    public function sendVoucher(Request $request, Store $store)
    {
        $email_configuration = json_decode($store->email_configuration, true);

        if (!is_null($email_configuration)) {
            $config = array(
                'driver'     =>     'smtp',
                'host'       =>     'smtp.gmail.com',
                'port'       =>     587,
                'username'   =>     $email_configuration['username'],
                'password'   =>     $email_configuration['password'],
                'encryption' =>     'tls',
                'from'       =>     array('address' => $email_configuration['username'], 'name' => $store->name)
            );
            Config::set('mail', $config);
        }


        $validated = $request->validate([
            'customer_email' => 'required|string',
            'voucher' => 'required',
            'customer_name' => 'required|string',
        ]);

        $details = [
            'customer_email' => $validated['customer_email'],
            'customer_name' => $validated['customer_name'],
            'voucher_name' => $validated['voucher']['name'],
            'voucher_end_date' => $validated['voucher']['end_date'],
            'voucher_start_date' => $validated['voucher']['start_date'],
            'voucher_min_order' => $validated['voucher']['min_order_total'],
            'voucher_value' => $validated['voucher']['value'],
            'voucher_code' => $validated['voucher']['code'],
            'store_name' => $store->name,
            'store_phone' => $store->phone,
            'store_web_page' => $store->web_page,
        ];

        Mail::send(new VoucherMail($details));
    }
}
