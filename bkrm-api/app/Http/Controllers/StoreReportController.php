<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use DateTime;
use DatePeriod;
use DateInterval;
use App\Models\Store;
use App\Models\Branch;

class StoreReportController extends Controller
{
    public function branch(Request $request, Store $store)
    {
        $begin = $request->query('from_date') ?
            $request->query('from_date') . ' 00:00:00'
            : "";

        $end = $request->query('to_date') ?
            $request->query('to_date') . ' 23:59:59'
            : "";

        $result = [];
        //$branches = $store->branches()->whereStatus('active')->pluck('id')->toArray();
        foreach($store->branches()->whereStatus('active')->get() as $branch){
            $result[] = [
                'branch_id' => $branch->id,
                'branch_name' => $branch->name,
                'capital' => $this->capital($store->id, $branch->id, $begin, $end),
                'purchase' => $this->purchase($store->id, $branch->id, $begin, $end),
                'revenue' => $this->revenue($store->id, $branch->id, $begin, $end),
                'profit' => $this->profit($store->id, $branch->id, $begin, $end),
                'orders' => $this->orders($store->id, $branch->id, $begin, $end),
            ];
        }
        return response()->json([
            'message' => 'get report successfully',
            'data' => $result
        ]);
    }

    public function overview(Request $request, Store $store)
    {
        $branch_id = $request->query('branch_id');
        $numOfProducts = $store->products()->where('status', '<>', 'deleted')->count();
        $numOfEmployees = $store->employees()->where('status', 'active')->count();
        $numOfCustomers = $store->customers()->where('status', 'active')->count();
        $numOfBranches = $store->branches()->where('status', 'active')->count();

        $start_date = $request->query('from_date') ?
            $request->query('from_date') . ' 00:00:00'
            : "";

        $end_date = $request->query('to_date') ?
            $request->query('to_date') . ' 23:59:59'
            : "";

        if ($branch_id) {
            $purchaseOrders = $store->purchaseOrders()
                ->where('branch_id', $branch_id)
                ->where('purchase_orders.creation_date', '>=', $start_date)
                ->where('purchase_orders.creation_date', '<', $end_date)->get();

            $orders = $store->orders()
                ->where('branch_id', $branch_id)
                ->where('orders.creation_date', '>=', $start_date)
                ->where('orders.creation_date', '<', $end_date)->get();

            $purchaseReturns = $store->purchaseReturns()
                ->where('branch_id', $branch_id)
                ->where('purchase_returns.creation_date', '>=', $start_date)
                ->where('purchase_returns.creation_date', '<', $end_date)->get();

            $refunds = $store->refunds()
                ->where('branch_id', $branch_id)
                ->where('refunds.created_at', '>=', $start_date)
                ->where('refunds.created_at', '<', $end_date)->get();
        } else {
            $purchaseOrders = $store->purchaseOrders()
                ->where('purchase_orders.creation_date', '>=', $start_date)
                ->where('purchase_orders.creation_date', '<', $end_date)->get();

            $orders = $store->orders()
                ->where('orders.creation_date', '>=', $start_date)
                ->where('orders.creation_date', '<', $end_date)->get();

            $purchaseReturns = $store->purchaseReturns()
                ->where('purchase_returns.creation_date', '>=', $start_date)
                ->where('purchase_returns.creation_date', '<', $end_date)->get();

            $refunds = $store->refunds()
                ->where('refunds.created_at', '>=', $start_date)
                ->where('refunds.created_at', '<', $end_date)->get();
        }

        $outAccount = $purchaseOrders->sum('total_amount') - $purchaseOrders->sum('discount') + $refunds->sum('total_amount');
        $inAccount = $orders->sum('total_amount') - $orders->sum('discount') + $purchaseReturns->sum('total_amount');

        // cong no phai thu
        $receivable = $orders->sum('total_amount') - $orders->sum('paid_amount') + $purchaseReturns->sum('total_amount') - $purchaseReturns->sum('paid_amount');

        // cong no phai tra
        $payable = $purchaseOrders->sum('total_amount') - $purchaseOrders->sum('paid_amount') + $refunds->sum('total_amount') - $refunds->sum('paid_amount');


        return response()->json([
            'message' => 'get report successfully',
            'data' => [
                'inAccount' => $inAccount,
                'outAccount' => $outAccount,
                'numOfProducts' => $numOfProducts,
                'receivable' => $receivable,
                'payable' => $payable,
                'numOfEmployees' => $numOfEmployees,
                'numOfBranches' => $numOfBranches,
                'numOfCustomers' => $numOfCustomers,
                'totalOrders' => count($orders),
            ]
        ], 200);
    }


    public function statistic(Request $request, Store $store)
    {
        // $check_permission = FrequentQuery::checkPermission($user->id, $branch_id, ['reporting']);
        $branch_id = $request->query('branch_id');
        $date_list = $this->split_date($request->query('from_date'), $request->query('to_date'), $request->query('unit'));
        $profit = [];
        $revenue = [];
        $purchase = [];
        $capital = [];
        $receivable = [];
        $payable = [];
        for ($i = 0; $i < (count($date_list) - 1); $i++) {
            $begin = $date_list[$i] . " 00:00:00";
            $end = $date_list[$i + 1] . " 00:00:00";
            $between_date_list[] = $begin . " - " . $end;

            array_push($profit, $this->profit($store->id, $branch_id, $begin, $end));
            array_push($revenue, $this->revenue($store->id, $branch_id, $begin, $end));
            array_push($purchase, $this->purchase($store->id, $branch_id, $begin, $end));
            array_push($capital, $this->capital($store->id, $branch_id, $begin, $end));
            array_push($receivable, $this->receivable($store->id, $branch_id, $begin, $end));
            array_push($payable, $this->payable($store->id, $branch_id, $begin, $end));
        }

        // $items_info = FrequentQuery::getItemInfo($branch_id);
        // $purchase_price_info = FrequentQuery::getLatestPurchasedPrice();
        // $no_purchased_price_items = $items_info->leftJoinSub($purchase_price_info, 'purchase_price_info', function ($join) {
        //     $join->on('purchase_price_info.item_id', '=', 'items.id');
        // })
        //     ->where(function ($query) {
        //         $query->where('purchase_price_info.purchase_price', '<=', 0);
        //         $query->orWhereNull('purchase_price_info.purchase_price');
        //     })
        //     ->selectRaw('items.id AS item_id, items.name AS item_name, items.bar_code, items.image_url, items.created_datetime, item_categories.id AS category_id, item_categories.name as category_name, item_quantities.quantity,item_prices.id as price_id, item_prices.sell_price, COALESCE(purchase_price_info.purchase_price, 0) AS purchase_price, COALESCE(items.point_ratio, item_categories.point_ratio) AS point_ratio')
        //     ->get();
        // $return_str[] = 'no_purchased_price_items';
        $state = 'success';
        $errors = 'none';
        // return response()->json(compact($return_str));
        return response()->json([
            'date_list' => $date_list,
            'purchase' => $purchase,
            'revenue' => $revenue,
            'capital' => $capital,
            'profit' => $profit,
            'payable' => $payable,
            'receivable' => $receivable,
        ]);
    }

    public function getTopOfStore(Request $request, Store $store)
    {
        $limit = $request->query('limit');
        $branch_id = $request->query('branch_id');
        $from_date = $request->query('from_date')
            ? $request->query('from_date') . " 00:00:00"
            : $request->query('from_date');

        $to_date = $request->query('to_date')
            ? $request->query('to_date') . " 23:59:59"
            : $request->query('to_date');

        // $top_category = $this->getBestSellingCategory($store->id, $from_date, $to_date, "total_sell_price");
        $top_supplier = $this->getTopSupplier($store->id, $from_date, $to_date, "total_purchase_price", $limit, $branch_id);
        $top_customer = $this->getTopCustomer($store->id, $from_date, $to_date, "total_buy_price", $limit, $branch_id);
        $top_product = $this->getBestSellingItem($store->id, $from_date, $to_date, 'total_sell_price', null, $limit, true, $branch_id);
        $top_employee = $this->getTopEmployee($store->id, $from_date, $to_date, "total_sale", $limit, $branch_id);

        return response()->json([
            "top_employee" => $top_employee,
            "top_supplier" => $top_supplier,
            "top_product" => $top_product,
            "top_customer" => $top_customer,
        ], 200);
    }

    public function getReportItems(Request $request, Store $store)
    {
        // $rules = [
        //   'from_date'     => 'nullable|date_format:Y-m-d',
        //   'to_date'       => 'nullable|date_format:Y-m-d',
        //   'category_id'   => 'required',
        //   'limit'         => 'required',
        // ];
        // $validator = Validator::make($request, $rules);

        // $check_permission = FrequentQuery::checkPermission($user->id, $branch_id, ['reporting']);
        $branch_id = $request->query('branch_id');
        $category_id = $request->query('category_id');
        $limit = $request->query('limit');
        $from_date = $request->query('from_date')
            ? $request->query('from_date') . " 00:00:00"
            : $request->query('from_date');

        $to_date = $request->query('to_date')
            ? $request->query('to_date') . " 23:59:59"
            : $request->query('to_date');

        if ($request->query('to_date')) {
            $date = strtotime("+1 day", strtotime($request->query('to_date')));
            $to_date = date("Y-m-d 00:00:00", $date);
        } else {
            $to_date = $request->query('to_date');
        }

        $category_id = $request->query('category_id');
        $limit = $request->query('limit');

        $top_total_sell_price_item = $this->getBestSellingItem($store->id, $from_date, $to_date, "total_sell_price", $category_id, $limit, true, $branch_id);
        $top_sold_quantity_item = $this->getBestSellingItem($store->id, $from_date, $to_date, "total_quantity", $category_id, $limit, true, $branch_id);

        $total_all = $this->getBestSellingItem($store->id, $from_date, $to_date, "total_quantity", null, null, false, $branch_id);

        $return_str = ['state', 'errors', 'top_total_sell_price_item', 'top_sold_quantity_item', 'total_all', 'to_date'];

        $state = 'success';
        $errors = 'none';
        return response()->json(compact($return_str));
    }

    public function getReportCategories(Request $request, $store_id)
    {
        // $rules = [
        //   'from_date'     => 'nullable|date_format:Y-m-d',
        //   'to_date'       => 'nullable|date_format:Y-m-d',
        // ];
        // $validator = Validator::make($request, $rules);

        $from_date = $request->query('from_date') ? $request->query('from_date') . " 00:00:00" : $request->query('from_date');
        $to_date = $request->query('to_date') ? $request->query('to_date') . " 23:59:59" : $request->query('to_date');

        $category_report_info = $this->getBestSellingCategory($store_id, $from_date, $to_date, "total_sell_price");

        $return_str = ['state', 'errors', 'data', 'category_report_info'];

        $state = 'success';
        $errors = 'none';
        return response()->json(compact($return_str));
    }

    private function split_date($start_date, $end_date, $split_by)
    {
        switch ($split_by) {
            case 'day':
                $from_date = new DateTime($start_date);
                $interval = DateInterval::createFromDateString('1 day');
                break;
            case 'month':
                $from_date = new DateTime($start_date);
                $from_date->setDate($from_date->format('Y'), $from_date->format('m'), 1);
                $interval = DateInterval::createFromDateString('1 month');
                break;
            // case 'quarter':
            //     $interval = DateInterval::createFromDateString('4 month');
            //     break;
            case 'year':
                $from_date = new DateTime($start_date);
                $from_date->setDate($from_date->format('Y'), 1, 1);
                $interval = DateInterval::createFromDateString('1 year');
                break;
        }

        $to_date = new DateTime($end_date);
        $inc_date = $split_by == 'day' ? '+2 ' . $split_by : '+0 ' . $split_by;
        $to_date = $to_date->modify($inc_date);

        $period = new DatePeriod($from_date, $interval, $to_date);
        $date_list = [];
        $first_date_flag = true;
        foreach ($period as $date) {
            $date = $date->format("Y-m-d");
            if ($first_date_flag) {
                $date = $start_date;
                $first_date_flag = false;
            }

            $date_list[] = $date;
        }
        switch ($split_by) {
            case 'day':
                // $interval = DateInterval::createFromDateString('1 day');
                break;
            case 'month':
                $month_date_list = date("m", strtotime(end($date_list)));
                $day_end_date = date("d", strtotime($end_date));
                if ($day_end_date == "01") {
                    $date_list[] = $end_date;
                }
                $date = strtotime("+1 day", strtotime($end_date));
                $date_list[] = date("Y-m-d", $date);
                break;
            // case 'quarter':
            //     $interval = DateInterval::createFromDateString('4 month');
            //     break;
            case 'year':
                $day_end_date = date("d", strtotime($end_date));
                $month_end_date = date("m", strtotime($end_date));
                if ($day_end_date == "01" && $month_end_date == "01") {
                    $date_list[] = $end_date;
                }
                $date = strtotime("+1 day", strtotime($end_date));
                $date_list[] = date("Y-m-d", $date);
                break;
        }

        return $date_list;
    }

    private function orders($store_id, $branch_id, $begin, $end)
    {
        if ($branch_id) {
            $orders = DB::table('orders')
                ->where('orders.store_id', $store_id)
                ->where('branch_id', $branch_id)
                ->where('orders.creation_date', '>=', $begin)
                ->where('orders.creation_date', '<', $end)->get();
        } else {
            $orders = DB::table('orders')
                ->where('orders.store_id', $store_id)
                ->where('orders.creation_date', '>=', $begin)
                ->where('orders.creation_date', '<', $end)->get();
        }
        return count($orders);
    }

    private function revenue($store_id, $branch_id, $begin, $end)
    {
        if ($branch_id) {
            $total = DB::table('orders')
                ->where('orders.store_id', $store_id)
                ->where('orders.branch_id', $branch_id)
                ->where('orders.creation_date', '>=', $begin)
                ->where('orders.creation_date', '<', $end)
                ->leftJoin('order_details', 'order_details.order_id', '=', 'orders.id')
                ->leftJoin('products', 'products.id', '=', 'order_details.product_id')
                ->selectRaw('COALESCE(SUM((order_details.quantity - order_details.returned_quantity)*(order_details.unit_price)),0) AS total')
                ->first()->total;
        } else {
            $total = DB::table('orders')
                ->where('orders.store_id', $store_id)
                ->where('orders.creation_date', '>=', $begin)
                ->where('orders.creation_date', '<', $end)
                ->leftJoin('order_details', 'order_details.order_id', '=', 'orders.id')
                ->leftJoin('products', 'products.id', '=', 'order_details.product_id')
                ->selectRaw('COALESCE(SUM((order_details.quantity - order_details.returned_quantity)*(order_details.unit_price)),0) AS total')
                ->first()->total;
        }

        $discount = DB::table('orders')
            ->where('orders.store_id', $store_id)
            ->where('orders.branch_id', $branch_id)
            ->where('orders.creation_date', '>=', $begin)
            ->where('orders.creation_date', '<', $end)
            ->sum('discount');
        return $total - $discount;
    }

    private function profit($store_id, $branch_id, $begin, $end)
    {
        if ($branch_id) {
            $invoice = DB::table('orders')
                ->where('orders.store_id', $store_id)
                ->where('orders.branch_id', $branch_id)
                ->leftJoin('order_details', 'order_details.order_id', '=', 'orders.id')
                ->leftJoin('products', 'products.id', '=', 'order_details.product_id');

            $invoice = $invoice
                ->where('orders.creation_date', '>=', $begin)
                ->where('orders.creation_date', '<', $end)
                ->selectRaw('COALESCE(SUM((order_details.quantity - order_details.returned_quantity)*(order_details.unit_price - COALESCE(products.standard_price, 0))),0) AS profit')
                ->first();
        } else {
            $invoice = DB::table('orders')
                ->where('orders.store_id', $store_id)
                ->leftJoin('order_details', 'order_details.order_id', '=', 'orders.id')
                ->leftJoin('products', 'products.id', '=', 'order_details.product_id');

            $invoice = $invoice
                ->where('orders.creation_date', '>=', $begin)
                ->where('orders.creation_date', '<', $end)
                ->selectRaw('COALESCE(SUM((order_details.quantity - order_details.returned_quantity)*(order_details.unit_price - COALESCE(products.standard_price, 0))),0) AS profit')
                ->first();
        }

        $discount = DB::table('orders')
            ->where('orders.store_id', $store_id)
            ->where('orders.branch_id', $branch_id)
            ->where('orders.creation_date', '>=', $begin)
            ->where('orders.creation_date', '<', $end)
            ->selectRaw('COALESCE(SUM(orders.discount),0) AS discount')
            ->first();
        return $invoice->profit - $discount->discount;
    }

    private function capital($store_id, $branch_id, $begin, $end)
    {
        if ($branch_id) {
            $invoice = DB::table('orders')
                ->where('orders.store_id', $store_id)
                ->where('orders.branch_id', $branch_id)
                ->leftJoin('order_details', 'order_details.order_id', '=', 'orders.id')
                ->leftJoin('products', 'products.id', '=', 'order_details.product_id');
            // $latest_purchased_price = FrequentQuery::getLatestPurchasedPrice();

            $invoice = $invoice
                ->where('orders.creation_date', '>=', $begin)
                ->where('orders.creation_date', '<', $end)
                ->selectRaw('COALESCE(SUM((order_details.quantity - order_details.returned_quantity)* COALESCE(products.standard_price, 0)),0) AS capital')
                ->first();
        } else {
            $invoice = DB::table('orders')
                ->where('orders.store_id', $store_id)
                ->leftJoin('order_details', 'order_details.order_id', '=', 'orders.id')
                ->leftJoin('products', 'products.id', '=', 'order_details.product_id');
            // $latest_purchased_price = FrequentQuery::getLatestPurchasedPrice();

            $invoice = $invoice
                ->where('orders.creation_date', '>=', $begin)
                ->where('orders.creation_date', '<', $end)
                ->selectRaw('COALESCE(SUM((order_details.quantity - order_details.returned_quantity)* COALESCE(products.standard_price, 0)),0) AS capital')
                ->first();
        }
        return $invoice->capital;
    }

    private function receivable($store_id, $branch_id, $begin, $end)
    {
        if ($branch_id) {
            $receivableOrders = DB::table('orders')
                ->where('orders.store_id', $store_id)
                ->where('orders.branch_id', $branch_id)
                ->where('orders.creation_date', '>=', $begin)
                ->where('orders.creation_date', '<', $end)
                ->selectRaw('COALESCE(SUM(orders.total_amount - orders.paid_amount),0) AS receivable')
                ->first()
                ->receivable;

            $receivablePurchaseReturn = DB::table('purchase_returns')
                ->where('purchase_returns.store_id', $store_id)
                ->where('purchase_returns.branch_id', $branch_id)
                ->where('purchase_returns.creation_date', '>=', $begin)
                ->where('purchase_returns.creation_date', '<', $end)
                ->selectRaw('COALESCE(SUM(purchase_returns.total_amount - purchase_returns.paid_amount),0) AS receivable')
                ->first()
                ->receivable;
        } else {
            $receivableOrders = DB::table('orders')
                ->where('orders.store_id', $store_id)
                ->where('orders.creation_date', '>=', $begin)
                ->where('orders.creation_date', '<', $end)
                ->selectRaw('COALESCE(SUM(orders.total_amount - orders.paid_amount),0) AS receivable')
                ->first()
                ->receivable;

            $receivablePurchaseReturn = DB::table('purchase_returns')
                ->where('purchase_returns.store_id', $store_id)
                ->where('purchase_returns.creation_date', '>=', $begin)
                ->where('purchase_returns.creation_date', '<', $end)
                ->selectRaw('COALESCE(SUM(purchase_returns.total_amount - purchase_returns.paid_amount),0) AS receivable')
                ->first()
                ->receivable;
        }
        return $receivableOrders + $receivablePurchaseReturn;
    }

    private function payable($store_id, $branch_id, $begin, $end)
    {
        if ($branch_id) {
            $payablePurchaseOrder = DB::table('purchase_orders')
                ->where('purchase_orders.store_id', $store_id)
                ->where('purchase_orders.branch_id', $branch_id)
                ->where('purchase_orders.creation_date', '>=', $begin)
                ->where('purchase_orders.creation_date', '<', $end)
                ->selectRaw('COALESCE(SUM(purchase_orders.total_amount - purchase_orders.paid_amount),0) AS payable')
                ->first()
                ->payable;

            $payableRefund = DB::table('refunds')
                ->where('refunds.store_id', $store_id)
                ->where('refunds.branch_id', $branch_id)
                ->where('refunds.created_at', '>=', $begin)
                ->where('refunds.created_at', '<', $end)
                ->selectRaw('COALESCE(SUM(refunds.total_amount - refunds.paid_amount),0) AS payable')
                ->first()
                ->payable;
        } else {
            $payablePurchaseOrder = DB::table('purchase_orders')
                ->where('purchase_orders.store_id', $store_id)
                ->where('purchase_orders.creation_date', '>=', $begin)
                ->where('purchase_orders.creation_date', '<', $end)
                ->selectRaw('COALESCE(SUM(purchase_orders.total_amount - purchase_orders.paid_amount),0) AS payable')
                ->first()
                ->payable;

            $payableRefund = DB::table('refunds')
                ->where('refunds.store_id', $store_id)
                ->where('refunds.created_at', '>=', $begin)
                ->where('refunds.created_at', '<', $end)
                ->selectRaw('COALESCE(SUM(refunds.total_amount - refunds.paid_amount),0) AS payable')
                ->first()
                ->payable;
        }
        return $payablePurchaseOrder + $payableRefund;
    }

    private function purchase($store_id, $branch_id, $begin, $end)
    {
        if ($branch_id) {
            $purchased_sheet = DB::table('purchase_orders')
                ->where('purchase_orders.store_id', $store_id)
                ->where('purchase_orders.branch_id', $branch_id)
                ->where('purchase_orders.creation_date', '>=', $begin)
                ->where('purchase_orders.creation_date', '<', $end)
                ->leftJoin('purchase_order_details', 'purchase_order_details.purchase_order_id', '=', 'purchase_orders.id')
                ->selectRaw('COALESCE(SUM((purchase_order_details.quantity - purchase_order_details.returned_quantity)*(purchase_order_details.unit_price)),0) AS total')
                ->first()->total;
            $discount = DB::table('purchase_orders')
                ->where('purchase_orders.store_id', $store_id)
                ->where('purchase_orders.branch_id', $branch_id)
                ->where('purchase_orders.creation_date', '>=', $begin)
                ->where('purchase_orders.creation_date', '<', $end)
                ->sum('discount');
        } else {
            $purchased_sheet = DB::table('purchase_orders')
                ->where('purchase_orders.store_id', $store_id)
                ->where('purchase_orders.creation_date', '>=', $begin)
                ->where('purchase_orders.creation_date', '<', $end)
                ->leftJoin('purchase_order_details', 'purchase_order_details.purchase_order_id', '=', 'purchase_orders.id')
                ->selectRaw('COALESCE(SUM((purchase_order_details.quantity - purchase_order_details.returned_quantity)*(purchase_order_details.unit_price)),0) AS total')
                ->first()->total;
            $discount = DB::table('purchase_orders')
                ->where('purchase_orders.store_id', $store_id)
                ->where('purchase_orders.creation_date', '>=', $begin)
                ->where('purchase_orders.creation_date', '<', $end)
                ->sum('discount');
        }
        return $purchased_sheet - $discount;
    }

    private function getBestSellingItem($store_id, $begin, $end, $order_by, $category_id, $limit, $is_group_by, $branch_id)
    {
        if ($branch_id) {
            $item_list = DB::table('orders')
                ->where('orders.store_id', $store_id)
                ->where('orders.branch_id', $branch_id)
                ->join('order_details', 'order_details.order_id', '=', 'orders.id')
                ->join('products', 'products.id', '=', 'order_details.product_id')
                ->leftJoin('categories', 'categories.id', '=', 'products.category_id')
                ->orderByRaw("$order_by DESC");
        } else {
            $item_list = DB::table('orders')
                ->where('orders.store_id', $store_id)
                ->join('order_details', 'order_details.order_id', '=', 'orders.id')
                ->join('products', 'products.id', '=', 'order_details.product_id')
                ->leftJoin('categories', 'categories.id', '=', 'products.category_id')
                ->orderByRaw("$order_by DESC");
        }

        if ($is_group_by) {
            $item_list = $item_list
                ->selectRaw('products.id, products.name, products.img_urls, categories.id AS category_id, categories.uuid as category_uuid, categories.name AS category_name, SUM(order_details.unit_price*(order_details.quantity - order_details.returned_quantity)) AS total_sell_price, SUM(order_details.quantity - order_details.returned_quantity) AS total_quantity, SUM((order_details.quantity - order_details.returned_quantity)*(order_details.unit_price - products.standard_price)) AS profit')
                ->groupByRaw('products.id, products.name, categories.name, categories.id')
                ->limit($limit);
        } else {
            $item_list = $item_list->selectRaw('SUM(order_details.unit_price*(order_details.quantity - order_details.returned_quantity)) AS total_sell_price, SUM(order_details.quantity - order_details.returned_quantity) AS total_quantity, SUM((order_details.quantity - order_details.returned_quantity)*(order_details.unit_price - products.standard_price)) AS profit');
        }


        if ($begin) {
            $item_list = $item_list->where('orders.creation_date', '>=', $begin);
        }
        if ($end) {
            $item_list = $item_list->where('orders.creation_date', '<', $end);
        }
        if ($category_id) {
            $item_list = $item_list->where('products.category_id', $category_id);
        }

        $item_list = $item_list->having('total_quantity', '>', 0);

        return $item_list->get();
    }

    private function getBestSellingCategory($store_id, $begin, $end, $order_by)
    {
        $item_list = DB::table('orders')->where('orders.store_id', $store_id)
            ->join('order_details', 'order_details.order_id', '=', 'orders.id')
            ->join('products', 'products.id', '=', 'order_details.product_id')
            ->join('categories', 'categories.id', '=', 'products.category_id')
            ->selectRaw('categories.id, categories.name, SUM(order_details.unit_price*(order_details.quantity - order_details.returned_quantity)) AS total_sell_price, SUM(order_details.quantity) AS total_quantity')
            ->groupByRaw('categories.id, categories.name')
            ->orderByRaw("categories.id DESC");

        if ($begin) {
            $item_list = $item_list->where('orders.creation_date', '>=', $begin);
        }
        if ($end) {
            $item_list = $item_list->where('orders.creation_date', '<', $end);
        }
        return $item_list->get();
    }

    private function getTopCustomer($store_id, $begin, $end, $order_by, $limit, $branch_id)
    {
        if ($branch_id) {
            $customer_list = DB::table('orders')
                ->where('orders.store_id', $store_id)
                ->where('orders.branch_id', $branch_id)
                ->join('customers', 'customers.id', '=', 'orders.customer_id')
                ->selectRaw('customers.name, customers.phone, SUM(orders.total_amount - orders.discount) AS total_buy_price, COUNT(customers.name) AS count_buy')
                ->groupByRaw('customers.name, customers.phone')
                ->orderByRaw("$order_by DESC");
        } else {
            $customer_list = DB::table('orders')
                ->where('orders.store_id', $store_id)
                ->join('customers', 'customers.id', '=', 'orders.customer_id')
                ->selectRaw('customers.name, customers.phone, SUM(orders.total_amount - orders.discount) AS total_buy_price, COUNT(customers.name) AS count_buy')
                ->groupByRaw('customers.name, customers.phone')
                ->orderByRaw("$order_by DESC");
        }

        if ($begin) {
            $customer_list = $customer_list->where('orders.creation_date', '>=', $begin);
        }
        if ($end) {
            $customer_list = $customer_list->where('orders.creation_date', '<', $end);
        }
        return $customer_list->limit($limit)->get();
    }

    private function getTopSupplier($store_id, $begin, $end, $order_by, $limit, $branch_id)
    {
        if ($branch_id) {
            $supplier_list = DB::table('purchase_orders')
                ->where('purchase_orders.store_id', $store_id)
                ->where('purchase_orders.store_id', $branch_id)
                ->join('suppliers', 'suppliers.id', '=', 'purchase_orders.supplier_id')
                ->selectRaw('suppliers.name, SUM(purchase_orders.total_amount) AS total_purchase_price')
                ->groupByRaw('suppliers.name')
                ->orderByRaw("$order_by DESC");
        } else {
            $supplier_list = DB::table('purchase_orders')
                ->where('purchase_orders.store_id', $store_id)
                ->join('suppliers', 'suppliers.id', '=', 'purchase_orders.supplier_id')
                ->selectRaw('suppliers.name, SUM(purchase_orders.total_amount) AS total_purchase_price')
                ->groupByRaw('suppliers.name')
                ->orderByRaw("$order_by DESC");
        }

        if ($begin) {
            $supplier_list = $supplier_list->where('purchase_orders.creation_date', '>=', $begin);
        }
        if ($end) {
            $supplier_list = $supplier_list->where('purchase_orders.creation_date', '<', $end);
        }

        if ($limit) {
            return $supplier_list->limit($limit)->get();
        } else {
            return $supplier_list->get();
        }
    }

    private function getTopEmployee($store_id, $begin, $end, $order_by, $limit, $branch_id)
    {
        if ($branch_id) {
            $employee_sales =
                DB::table('orders')
                    ->where('orders.store_id', $store_id)
                    ->where('orders.branch_id', $branch_id)
                    ->where('orders.created_user_type', 'employee')
                    ->join('employees', 'orders.user_id', '=', 'employees.id')
                    ->selectRaw('count(orders.id) as number_of_orders, sum(total_amount) as total_sale, employees.name, employees.id')
                    ->groupBy('user_id')
                    ->where('orders.creation_date', '>=', $begin)
                    ->where('orders.creation_date', '<', $end)
                    ->orderByRaw("$order_by DESC");
        } else {
            $employee_sales =
                DB::table('orders')
                    ->where('orders.store_id', $store_id)
                    ->where('orders.created_user_type', 'employee')
                    ->join('employees', 'orders.user_id', '=', 'employees.id')
                    ->selectRaw('count(orders.id) as number_of_orders, sum(total_amount) as total_sale, employees.name, employees.id')
                    ->groupBy('user_id')
                    ->where('orders.creation_date', '>=', $begin)
                    ->where('orders.creation_date', '<', $end)
                    ->orderByRaw("$order_by DESC");
        }

        if ($limit) {
            return $employee_sales->limit($limit)->get();
        }
        return $employee_sales->get();
    }
}
