<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use DateTime;
use DatePeriod;
use DateInterval;
use App\Models\Store;
use App\Models\Branch;

class BranchReportController extends Controller
{
    public function getRevenue(Request $request, Store $store, Branch $branch)
    {
        $rules = $request->validate([
            'from_date'     => 'required|date_format:Y-m-d',
            'to_date'       => 'required|date_format:Y-m-d',
            'unit'          => 'required|in:day,month,year',
        ]);

        // $check_permission = FrequentQuery::checkPermission($user->id, $branch_id, ['reporting']);

        $date_list = $this->split_date($request->input('from_date'), $request->input('to_date'), $request->input('unit'));

        for ($i = 0; $i < (count($date_list) - 1); $i++) {
            $begin = $date_list[$i] . " 00:00:00";
            $end = $date_list[$i + 1] . " 00:00:00";
            $between_date_list[] = $begin . " - " . $end;

            $profit[] = $this->profit($branch->id, $begin, $end);
            $revenue[] = $this->revenue($branch->id, $begin, $end);
            $purchase[] = $this->purchase($branch->id, $begin, $end);
            $capital[] = $this->capital($branch->id, $begin, $end);
        }

        $return_str = ['state', 'errors'];
        $return_str[] = 'date_list';
        $return_str[] = 'between_date_list';
        $return_str[] = 'revenue';
        $return_str[] = 'profit';
        $return_str[] = 'purchase';
        $return_str[] = 'capital';

        if ($request->input('revenue')) {
            $return_str[] = 'revenue';
        }
        if ($request->input('profit')) {
            $return_str[] = 'profit';
        }
        if ($request->input('purchase')) {
            $return_str[] = 'purchase';
        }
        if ($request->input('capital')) {
            $return_str[] = 'capital';
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

        return response()->json(compact($return_str));
    }

    public function getTopOfBranch(Request $request, Store $store, Branch $branch) {
        $from_date = $request->query('from_date')
            ? $request->query('from_date') . " 00:00:00"
            : $request->query('from_date');

        $to_date = $request->query('to_date')
            ? $request->query('to_date') . " 23:59:59"
            : $request->query('to_date');

        $top_category = $this->getBestSellingCategory($branch->id, $from_date, $to_date, "total_sell_price");
        $top_supplier = $this->getTopSupplier($branch->id, $from_date, $to_date, "total_buy_price" );
        $top_customer = $this->getTopCustomer($branch->id, $from_date, $to_date, "total_buy_price");
        $top_product = $this->getBestSellingItem($branch->id, $from_date, $to_date, 'total_sell_price', null, null, false);

        return response()->json([
            "top_category" => $top_category,
            "top_supplier" => $top_supplier,
            "top_product" => $top_product,
            "top_customer" => $top_customer,
        ], 200);
    }

    public function getReportItems(Request $request, Store $store, Branch $branch)
    {
        $rules = [
            'from_date'     => 'nullable|date_format:Y-m-d',
            'to_date'       => 'nullable|date_format:Y-m-d',
            'category_id'   => 'required',
            'limit'         => 'required',
        ];
        $validator = Validator::make($request, $rules);

        // $check_permission = FrequentQuery::checkPermission($user->id, $branch_id, ['reporting']);

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

        $top_total_sell_price_item = $this->getBestSellingItem($branch->id, $from_date, $to_date, "total_sell_price", $category_id, $limit, true);
        $top_sold_quantity_item = $this->getBestSellingItem($branch->id, $from_date, $to_date, "total_quantity", $category_id, $limit, true);

        $total_all = $this->getBestSellingItem($branch->id, $from_date, $to_date, "total_quantity", null, null, false);

        $return_str = ['state', 'errors', 'data', 'top_total_sell_price_item', 'top_sold_quantity_item', 'total_all', 'to_date'];

        $state = 'success';
        $errors = 'none';
        return response()->json(compact($return_str));
    }

    public function getReportCategories(Request $request, $store_id, $branch_id)
    {
        $rules = [
            'from_date'     => 'nullable|date_format:Y-m-d',
            'to_date'       => 'nullable|date_format:Y-m-d',
        ];
        $validator = Validator::make($request, $rules);

        $from_date = $request->input('from_date') ? $request->input('from_date') . " 00:00:00" : $request->input('from_date');
        $to_date = $request->input('to_date') ? $request->input('to_date') . " 23:59:59" : $request->input('to_date');

        $category_report_info = $this->getBestSellingCategory($branch_id, $from_date, $to_date, "total_sell_price");

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

    private function revenue($branch_id, $begin, $end)
    {
        $invoice = DB::table('orders')
            ->where('orders.branch_id', $branch_id)
            ->where('orders.created_at', '>=', $begin)
            ->where('orders.created_at', '<', $end)
            ->selectRaw('COALESCE(SUM(orders.total_amount - orders.discount),0) AS revenue')
            ->first();
        return $invoice->revenue;
    }

    private function profit($branch_id, $begin, $end)
    {
        $invoice = DB::table('orders')
            ->where('orders.branch_id', $branch_id)
            ->leftJoin('order_details', 'order_details.order_id', '=', 'orders.id')
            ->leftJoin('products', 'products.id', '=', 'order_details.product_id');

        $invoice = $invoice
            ->where('orders.created_at', '>=', $begin)
            ->where('orders.created_at', '<', $end)
            ->selectRaw('COALESCE(SUM(order_details.quantity*(order_details.unit_price - COALESCE(products.standard_price, 0))),0) AS profit')
            ->first();

        $discount = DB::table('orders')
            ->where('orders.branch_id', $branch_id)
            ->where('orders.created_at', '>=', $begin)
            ->where('orders.created_at', '<', $end)
            ->selectRaw('COALESCE(SUM(orders.discount),0) AS discount')
            ->first();
        return $invoice->profit - $discount->discount;
    }

    private function capital($branch_id, $begin, $end)
    {
        $invoice = DB::table('orders')
            ->where('orders.branch_id', $branch_id)
            ->leftJoin('order_details', 'order_details.order_id', '=', 'orders.id')
            ->leftJoin('products', 'products.id', '=', 'order_details.product_id');
        // $latest_purchased_price = FrequentQuery::getLatestPurchasedPrice();

        $invoice = $invoice
            ->where('orders.created_at', '>=', $begin)
            ->where('orders.created_at', '<', $end)
            ->selectRaw('COALESCE(SUM(order_details.quantity * COALESCE(products.standard_price, 0)),0) AS capital')
            ->first();
        return $invoice->capital;
    }

    private function purchase($branch_id, $begin, $end)
    {
        $purchased_sheet = DB::table('purchased_orders')
            ->where('purchased_orders.branch_id', $branch_id)
            ->where('purchased_orders.creation_date', '>=', $begin)
            ->where('purchased_orders.creation_date', '<', $end)
            ->selectRaw('COALESCE(SUM(purchased_orders.total_amount - purchased_orders.discount),0) AS purchase')
            ->first();
        return $purchased_sheet->purchase;
    }

    private function getBestSellingItem($branch_id, $begin, $end, $order_by, $category_id, $limit, $is_group_by = true)
    {
        $item_list = DB::table('orders')->where('orders.branch_id', $branch_id)
            ->join('order_details', 'order_details.order_id', '=', 'orders.id')
            ->join('products', 'products.id', '=', 'order_details.product_id')
            ->leftJoin('categories', 'categories.id', '=', 'products.category_id')
            ->orderByRaw("$order_by DESC");

        if ($is_group_by) {
            $item_list = $item_list
                ->selectRaw('products.id, products.name, categories.id AS category_id, categories.name AS category_name, SUM(order_details.unit_price*order_details.quantity) AS total_sell_price, SUM(order_details.quantity) AS total_quantity')
                ->groupByRaw('products.id, products.name, categories.name, categories.id')
                ->limit($limit);
        } else {
            $item_list = $item_list->selectRaw('SUM(order_details.unit_price*order_details.quantity) AS total_sell_price, SUM(order_details.quantity) AS total_quantity');
        }


        if ($begin) {
            $item_list = $item_list->where('orders.created_at', '>=', $begin);
        }
        if ($end) {
            $item_list = $item_list->where('orders.created_at', '<', $end);
        }
        if ($category_id) {
            $item_list = $item_list->where('products.category_id', $category_id);
        }

        $item_list = $item_list->having('total_quantity', '>', 0);

        return $item_list->get();
    }

    private function getBestSellingCategory($branch_id, $begin, $end, $order_by)
    {
        $item_list = DB::table('orders')->where('orders.branch_id', $branch_id)
            ->join('order_details', 'order_details.order_id', '=', 'orders.id')
            ->join('products', 'products.id', '=', 'order_details.product_id')
            ->join('categories', 'categories.id', '=', 'products.category_id')
            ->selectRaw('categories.id, categories.name, SUM(order_details.unit_price*order_details.quantity) AS total_sell_price, SUM(order_details.quantity) AS total_quantity')
            ->groupByRaw('categories.id, categories.name')
            ->orderByRaw("categories.id DESC");

        if ($begin) {
            $item_list = $item_list->where('orders.created_at', '>=', $begin);
        }
        if ($end) {
            $item_list = $item_list->where('orders.created_at', '<', $end);
        }
        return $item_list->get();
    }

    private function getTopCustomer($branch_id, $begin, $end, $order_by)
    {
        $customer_list = DB::table('orders')->where('orders.branch_id', $branch_id)
            ->join('customers', 'customers.id', '=', 'orders.customer_id')
            ->selectRaw('customers.name, customers.phone, SUM(orders.total_amount - orders.discount) AS total_buy_price')
            ->groupByRaw('customers.name, customers.phone')
            ->orderByRaw("$order_by DESC");

        if ($begin) {
            $customer_list = $customer_list->where('orders.created_at', '>=', $begin);
        }
        if ($end) {
            $customer_list = $customer_list->where('orderss.created_at', '<', $end);
        }
        return $customer_list->get();
    }

    private function getTopSupplier($branch_id, $begin, $end, $order_by)
    {
        $supplier_list = DB::table('purchased_orders')->where('purchased_orders.branch_id', $branch_id)
            ->join('suppliers', 'suppliers.id', '=', 'purchased_orders.supplier_id')
            ->selectRaw('suppliers.name, SUM(purchased_orders.total_amount) AS total_purchase_price')
            ->groupByRaw('suppliers.name')
            ->orderByRaw("$order_by DESC");

        if ($begin) {
            $supplier_list = $supplier_list->where('purchased_sheets.delivery_datetime', '>=', $begin);
        }
        if ($end) {
            $supplier_list = $supplier_list->where('purchased_sheets.delivery_datetime', '<', $end);
        }
        return $supplier_list->get();
    }
}
