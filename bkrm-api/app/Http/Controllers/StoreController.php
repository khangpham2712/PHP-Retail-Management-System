<?php

namespace App\Http\Controllers;

use App\Mail\StoreEmail;
use App\Models\Store;
use App\Models\Employee;
use App\Models\User;
use App\Models\Branch;
use App\Models\InventoryCheckDetail;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Auth;
use DateTime;
use Exception;
use App\Models\OrderDetail;
use App\Models\PurchaseOrderDetail;
use App\Models\PurchaseReturnDetail;
use App\Models\RefundDetail;
use Illuminate\Support\Facades\DB;

class StoreController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::guard('user')->user();
        $store = Store::where('user_id', $user->id)->get();
        return response()->json([
            'message' => '',
            'data' => $store,
            'user' => $user,
        ], 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'address' => 'required|string',
            'ward' => 'required|string',
            'city' => 'required|string',
            'province' => 'required|string',
            'phone' => 'required|string',
            'status' => 'required|in:active,inactive',
            'image' => 'nullable|image',
        ]);

        if ($request['image']) {
            $imagePath = $request['image']->store('store-images', 'public');
            $data['image'] = config('app.url') . $imagePath;
        } else {
            $data['image'] = config('app.url') . '/store-images/store-default.png';
        }


        $store = Store::create(array_merge($data, [
            'user_id' => auth()->user()->id,
            'uuid' => (string) Str::uuid()
        ]));

        return response()->json([
            'message' => 'Store created successfully',
            'store' => $store,
        ], 200);
    }

    public function toggleInventory(Request $request, Store $store) {
        $store->products()->update(['quantity_available' => '0']);
        DB::table('branch_inventories')->where('store_id', $store->id)->update(['quantity_available' => 0]);
        DB::table('product_batches')->where('store_id', $store->id)->update(['quantity' => 0]);
        return response()->json(['data' => 'success']);
    }

    public function update(Request $request, Store $store)
    {
        $data = $request->validate([
            'name' => 'nullable|unique:stores,name',
            'address' => 'nullable|string',
            'ward' => 'nullable|string',
            'city' => 'nullable|string',
            'province' => 'nullable|string',
            'phone' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
            'email_configuration' => 'nullable|string',
            'web_configuration' => 'nullable|string',
            'general_configuration' => 'nullable|string',
            'images' => 'nullable',
            'img_urls' => 'nullable',
        ]);
        if (array_key_exists('web_configuration', $data)) {
            if ($data['web_configuration']) {
                $config = json_decode($data['web_configuration'], true);
                $web_page = $config['webAddress'];
                $store->update(['web_page' => $web_page]);
            }
        }
        $banners = [];
        if (array_key_exists('images', $data)) {
            if ($data['images'] != null) {
                foreach ($data['images'] as $image) {
                    $imagePath = $image->store('store-images', 'public');
                    $imageUrl = config('app.url')
                        . $imagePath;
                    array_push($banners, $imageUrl);
                }
            }
            unset($data['images']);
            $data = array_merge($data, ['banners' => $banners]);
        }
        if (array_key_exists('img_urls', $data)) {
            $banners = array_merge($banners, $data['img_urls']);
            $data = array_merge($data, ['banners' => $banners]);
            unset($data['img_urls']);
        }
        $store->update($data);
        return response()->json([
            'message' => 'Store updated successfully',
            'store' => $store,
            'data' => $data,
        ], 200);
    }

    public function updateStoreConfiguration(Request $request, Store $store)
    {
        $data = $request->validate([
            'facebook' => 'nullable|string',
            'instagram' => 'nullable|string',
            'image' => 'nullable',
            'custom_web' => 'nullable|string',
        ]);

        $imagePath = "";
        if (array_key_exists('image', $data)) {
            if ($data['image'] != "") {
                $imagePath = $data['image']->store('store-images', 'public');

                $imagePath = config('app.url') . $imagePath;
            }
        }

        unset($data['image']);
        $store_configuration = array_merge($data, ['img_url' => $imagePath]);
        $store->update(['store_configuration' => json_encode($store_configuration)]);
        return response()->json([
            'message' => 'Store updated successfully',
            'store' => $store,
        ], 200);
    }

    public function show(Store $store)
    {
        return response()->json([
            'data' => $store
        ], 200);
    }

    public function activities(Request $request, Store $store, Branch $branch)
    {
        $period = $request->query('period');
        $data = [];
        $purchaseOrders = $branch->purchaseOrders()
            ->where('creation_date', '>', now()->subDays($period)->endOfDay())
            ->join('suppliers', 'purchase_orders.supplier_id', '=', 'suppliers.id')
            ->join('branches', 'purchase_orders.branch_id', '=', 'branches.id')
            ->select(
                'purchase_orders.purchase_order_code as code',
                'purchase_orders.total_amount as total_amount',
                'purchase_orders.creation_date as created_at',
                'purchase_orders.created_user_type as user_type',
                'purchase_orders.created_by as user_id',
                'suppliers.name as partner_name',
                'branches.name as branch_name'
            )
            ->get()->toArray();

        $purchaseOrders = array_map(function ($purchaseOrder) {
            return array_merge([
                'type' => 'purchase_order'
            ], $purchaseOrder);
        }, $purchaseOrders);

        $purchaseReturns = $branch->purchaseReturns()
            ->where('creation_date', '>', now()->subDays($period)->endOfDay())
            ->join('suppliers', 'purchase_returns.supplier_id', '=', 'suppliers.id')
            ->join('branches', 'purchase_returns.branch_id', '=', 'branches.id')
            ->select(
                'purchase_returns.purchase_return_code as code',
                'purchase_returns.total_amount as total_amount',
                'purchase_returns.creation_date as created_at',
                'purchase_returns.created_user_type as user_type',
                'purchase_returns.created_by as user_id',
                'suppliers.name as partner_name',
                'branches.name as branch_name'
            )
            ->get()->toArray();

        $purchaseReturns = array_map(function ($purchaseReturn) {
            return array_merge([
                'type' => 'purchase_return'
            ], $purchaseReturn);
        }, $purchaseReturns);

        $orders = $branch->orders()
            ->where('orders.created_at', '>', now()->subDays($period)->endOfDay())
            ->join('customers', 'orders.customer_id', '=', 'customers.id')
            ->join('branches', 'orders.branch_id', '=', 'branches.id')
            ->select(
                'orders.order_code as code',
                'orders.total_amount as total_amount',
                'orders.created_at as created_at',
                'orders.created_user_type as user_type',
                'orders.user_id as user_id',
                'customers.name as partner_name',
                'branches.name as branch_name'
            )
            ->get()->toArray();

        $orders = array_map(function ($order) {
            return array_merge([
                'type' => 'order'
            ], $order);
        }, $orders);

        $refunds = $branch->refunds()
            ->where('refunds.created_at', '>', now()->subDays($period)->endOfDay())
            ->join('customers', 'refunds.customer_id', '=', 'customers.id')
            ->join('branches', 'refunds.branch_id', '=', 'branches.id')
            ->select(
                'refunds.refund_code as code',
                'refunds.total_amount as total_amount',
                'refunds.created_at as created_at',
                'refunds.created_user_type as user_type',
                'refunds.created_by as user_id',
                'customers.name as partner_name',
                'branches.name as branch_name'
            )
            ->get()->toArray();

        $refunds = array_map(function ($refund) {
            return array_merge([
                'type' => 'refund'
            ], $refund);
        }, $refunds);

        $inventoryChecks = $branch->inventoryChecks()
            ->where('inventory_checks.created_at', '>', now()->subDays($period)->endOfDay())
            ->select(
                'inventory_checks.inventory_check_code as code',
                'inventory_checks.total_amount as total_amount',
                'inventory_checks.created_at as created_at',
                'inventory_checks.created_user_type as user_type',
                'inventory_checks.created_by as user_id',
            )->get()->toArray();

        $inventoryChecks = array_map(function ($inventoryCheck) {
            return array_merge([
                'type' => 'inventory_check'
            ], $inventoryCheck);
        }, $inventoryChecks);

        $documents = array_merge($purchaseOrders, $purchaseReturns, $orders, $refunds, $inventoryChecks);

        foreach ($documents as $document) {
            if ($document["user_type"] === 'owner') {
                $created_by = User::where('id', $document["user_id"])->first();
            } else {
                $created_by = Employee::where('id', $document["user_id"])->first();
            }

            if ($created_by) {
                array_push($data, array_merge($document, ['user_name' => $created_by->name]));
            }
        }

        usort($data, function ($a, $b) {
            $ad = new DateTime($a['created_at']);
            $bd = new DateTime($b['created_at']);

            if ($ad == $bd) {
                return 0;
            }

            return $ad > $bd ? -1 : 1;
        });
        return response()->json([
            'message' => 'get activity successfully',
            'data' => $data,
        ], 200);
    }

    public function sendEmail(Request $request, Store $store)
    {
        try {
            $general_configuration = json_decode($store->general_configuration, true);
            if (!is_null($general_configuration)) {
                $config = array(
                    'driver'     =>     'smtp',
                    'host'       =>     'smtp.gmail.com',
                    'port'       =>     587,
                    'username'   =>     $general_configuration['email']['emailAddress'],
                    'password'   =>     $general_configuration['email']['password'],
                    'encryption' =>     'tls',
                    'from'       =>     array('address' => $general_configuration['email']['emailAddress'], 'name' => $store->name)
                );
                Config::set('mail', $config);
            }


            $validated = $request->validate([
                'subject' => 'required|string',
                'email' => 'required|string',
                'name' => 'required|string',
                'content' => 'required|string'
            ]);
            Mail::send(new StoreEmail($validated));

            return response()->json([
                'data' => 'Send successfully'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'data' => 'Send erro',
                'eror' => $e,
                'email' => $general_configuration
            ], 200);
        }


    }

    public function getNotification(Request $request, Store $store, Branch $branch) {
        $current_date = $request->query('current_date');

        $out_of_stock_products = $store->products()
            ->join('branch_inventories', 'branch_inventories.product_id', '=', 'products.id')
            // ->where('branch_inventories.quantity_available', '<=', 'products.min_reorder_quantity')
            ->where(function ($query) {
                $query->where('branch_inventories.quantity_available', '<=', 'products.min_reorder_quantity')
                    ->orWhere('branch_inventories.quantity_available', '>=', 'products.max_order');
            })
            ->where('products.status', '=', 'active')
            ->where('products.has_variance', '=', false)
            ->get()->toArray();

        $out_of_date_batches = DB::table('product_batches')
            ->join('products', 'products.id', '=', 'product_batches.product_id')
            ->where('product_batches.quantity', '>=', 0)
            ->where(DB::raw('DATE_ADD(product_batches.expiry_date, INTERVAL -products.notification_period DAY)'), '<', $current_date)->get();

        $storeConfig = json_decode($store['general_configuration'], true)['notifyDebt'];

        $customers = $store->customers()->where('status', 'active')->get();
        $customersData = [];
        foreach($customers as $customer) {
            $totalDebt = $store->orders()
                ->where('orders.customer_id', $customer['id'])
                ->whereRaw('total_amount - discount - paid_amount > 0')
                ->selectRaw('SUM(total_amount - discount - paid_amount) as debt')->first()->debt;

            if ($storeConfig['checkDebtAmount']) {
                if ($totalDebt < (double)$storeConfig['debtAmount']) {
                    continue;
                }
            }
            $debtOrder = null;

            if ($storeConfig['checkNumberOfDay']) {
                $debtOrder = $store->orders()
                    ->where('orders.customer_id', $customer['id'])
                    ->whereRaw('total_amount - discount - paid_amount > 0')
                    ->whereRaw('creation_date - ' . $current_date, '<', $storeConfig['numberOfDate'])
                    ->selectRaw('orders.*, total_amount - discount - paid_amount as debt')
                    ->orderBy('orders.creation_date', $storeConfig['typeDebtDay'] === 'firstDebt' ? 'asc' : 'desc')->first();

                if (!$debtOrder) {
                    continue;
                }
            }

            if ($totalDebt || $debtOrder) {
                array_push($customersData, array_merge($customer->toArray(), [
                    'total_debt' => $totalDebt,
                    'order' => $debtOrder,
                ]));
            }
        }
        return response()->json([
            'data' => [
                'storeConfig' => $storeConfig,
                'out_of_stock_products' =>  $out_of_stock_products,
                'out_of_date_batches' => $out_of_date_batches,
                'customers' => $customersData,
                'config' => $storeConfig,
            ]
        ]);
    }

    public function deleteAllTransactions(Request $request, Store $store) {
        $validated = $request->validate([
            'from' => 'required|string',
            'to' => 'required|string',
            'isAll' => 'required|boolean',
        ]);

        $from = $validated['from'] . ' 00:00:00';
        $to = $validated['to'] . ' 23:59:59';

        $deleted = [
            'orders' => [],
            'refunds' => [],
            'purchase_orders' => [],
            'purchase_returns' => [],
            'inventory_checks' => [],
        ];

        if ($validated['isAll']) {
            $store->orders()->delete();
            OrderDetail::where('branch_id', $store->id)->delete();

            $store->purchaseOrders()->delete();
            PurchaseOrderDetail::where('store_id', $store->id)->delete();

            $store->purchaseReturns()->delete();
            PurchaseReturnDetail::where('store_id', $store->id)->delete();

            $store->refunds()->delete();
            RefundDetail::where('store_id', $store->id)->delete();

            $store->inventoryChecks()->delete();
            InventoryCheckDetail::where('store_id', $store->id)->delete();
        } else {
            $store->orders()
                ->where('creation_date', '>=', $from)
                ->where('creation_date', '<=', $to)
                ->delete();
            OrderDetail::where('branch_id', $store->id)
                ->where('created_at', '>=', $from)
                ->where('created_at', '<=', $to)
                ->delete();

            $store->purchaseOrders()
                ->where('creation_date', '>=', $from)
                ->where('creation_date', '<=', $to)
                ->delete();
            PurchaseOrderDetail::where('store_id', $store->id)
                ->where('created_at', '>=', $from)
                ->where('created_at', '<=', $to)
                ->delete();

            $store->purchaseReturns()
                ->where('creation_date', '>=', $from)
                ->where('creation_date', '<=', $to)
                ->delete();
            PurchaseReturnDetail::where('store_id', $store->id)
                ->where('created_at', '>=', $from)
                ->where('created_at', '<=', $to)
                ->delete();

            $store->refunds()
                ->where('created_at', '>=', $from)
                ->where('created_at', '<=', $to)
                ->delete();

            RefundDetail::where('store_id', $store->id)
                ->where('created_at', '>=', $from)
                ->where('created_at', '<=', $to)
                ->delete();

            $store->inventoryChecks()
                ->where('created_at', '>=', $from)
                ->where('created_at', '<=', $to)
                ->delete();
            InventoryCheckDetail::where('store_id', $store->id)
                ->where('created_at', '>=', $from)
                ->where('created_at', '<=', $to)
                ->delete();
        }

        return response()->json([
            'message' => 'All data deleted successfully',
        ], 200);
    }
}
