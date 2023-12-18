<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductPriceController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\PurchaseOrderDetailController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderDetailController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\RefundController;
use App\Http\Controllers\RefundDetailController;
use App\Http\Controllers\PurchaseReturnController;
use App\Http\Controllers\PurchaseReturnDetailController;
use App\Http\Controllers\InventoryTransactionController;
use App\Http\Controllers\BarcodeController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\BranchInventoryController;
use App\Http\Controllers\CustomerGroupController;
use App\Http\Controllers\CustomerOrderController;
use App\Http\Controllers\CustomerPageController;
use App\Http\Controllers\InventoryCheckController;
use App\Http\Controllers\PaymentReceiptVoucherController;
use App\Http\Controllers\PromotionVoucherController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\StoreReportController;
use Intervention\Image\Facades\Image;
use App\Mail\CustomerMail;
use App\Models\BranchInventory;
use App\Models\Store;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['cors'])->group(function () {
    Route::post('/register', [AuthController::class, 'ownerRegister']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/verify-token', [AuthController::class, 'verifyOwnerToken']);
    Route::post('/employeeLogin', [AuthController::class, 'employeeLogin']);
    Route::post('/confirmPassword', [AuthController::class, 'confirmPassword']);

    Route::get('/address/provinces/', [AddressController::class, 'getProvinces']);
    Route::get('/address/provinces/{province}/districts', [AddressController::class, 'getDistricts']);
    Route::get('/address/provinces/{province}/districts/{district}/wards', [AddressController::class, 'getWards']);

    Route::get('/searchDefaultProduct', [ProductController::class, 'searchDefaultProduct']);
    Route::get('/stores/{store:uuid}/getActivePromotionVoucher', [PromotionVoucherController::class, 'getActivePromotionVoucher']);

    // Public routes for customer page
    Route::get('/storeInfo', [CustomerPageController::class, 'storeInfo']);
    Route::get('/storeInfo/{store:uuid}/products', [CustomerPageController::class, 'storeProducts']);
    Route::get('/storeInfo/{store:uuid}/getNestedCategories', [CategoryController::class, 'getNestedCategory']);
    Route::post('/storeInfo/{store:uuid}/addOrder', [CustomerPageController::class, 'addOrder']);
});
// Protected routes
Route::middleware(['auth:user,employee'])->group(function () {
    // routes for update store configurations
    Route::post('/stores/{store:uuid}', [StoreController::class, 'update']);
    Route::get('/stores/{store:uuid}', [StoreController::class, 'show']);
    Route::post('/stores/{store:uuid}/confirmPassword', [AuthController::class, 'confirmPassword']);
    Route::post('/stores/{store:uuid}/toggleInventory', [StoreController::class, 'toggleInventory']);
    Route::post('/stores/{store:uuid}/editProfile', [AuthController::class, 'editProfile']);
    Route::post('/stores/{store:uuid}/updateStoreConfiguration', [StoreController::class, 'updateStoreConfiguration']);
    Route::post('/stores/{store:uuid}/sendEmail', [StoreController::class, 'sendEmail']);
    Route::post('/stores/{store:uuid}/deleteAllTransactions', [StoreController::class, 'deleteAllTransactions']);

    // routes for report of store
    Route::get('/stores/{store:uuid}/report/branch', [StoreReportController::class, 'branch']);
    Route::get('/stores/{store:uuid}/report/overview', [StoreReportController::class, 'overview']);
    Route::get('/stores/{store:uuid}/report/statistic', [StoreReportController::class, 'statistic']);
    Route::get('/stores/{store:uuid}/report/top', [StoreReportController::class, 'getTopOfStore']);
    Route::get('/stores/{store:uuid}/report/item', [StoreReportController::class, 'getReportItems']);
    Route::get('/stores/{store:uuid}/report/category', [StoreReportController::class, 'getReportCategories']);

    // routes for branches
    Route::get('/stores/{store:uuid}/branches', [BranchController::class, 'index']);
    Route::get('/stores/{store:uuid}/branches/getAllBranches', [BranchController::class, 'getAllBranches']);
    Route::post('/stores/{store:uuid}/branches', [BranchController::class, 'store']);
    Route::get('/stores/{store:uuid}/branches/{branch:uuid}', [BranchController::class, 'show']);
    Route::post('/stores/{store:uuid}/branches/{branch:uuid}', [BranchController::class, 'update']);
    Route::delete('/stores/{store:uuid}/branches/{branch:uuid}', [BranchController::class, 'destroy']);
    Route::get('/stores/{store:uuid}/branches/{branch:uuid}/getNotification', [StoreController::class, 'getNotification']);
    Route::get('/stores/{store:uuid}/branches/{branch:uuid}/activities', [StoreController::class, 'activities']);


    // routes for schedule
    Route::get('/stores/{store:uuid}/branches/{branch:uuid}/getSchedule', [ScheduleController::class, 'getSchedule']);
    Route::post('/stores/{store:uuid}/branches/{branch:uuid}/createShift', [ScheduleController::class, 'createShift']);
    Route::post('/stores/{store:uuid}/branches/{branch:uuid}/updateShift/{id}', [ScheduleController::class, 'updateShift']);

    Route::delete('/stores/{store:uuid}/branches/{branch:uuid}/deleteShift/{id}', [ScheduleController::class, 'deleteShift']);
    Route::post('/stores/{store:uuid}/branches/{branch:uuid}/createSchedule', [ScheduleController::class, 'createSchedule']);
    Route::post('/stores/{store:uuid}/branches/{branch:uuid}/checkAttendance', [ScheduleController::class, 'checkAttendance']);
    Route::post('/stores/{store:uuid}/branches/{branch:uuid}/checkAttendanceQR', [ScheduleController::class, 'checkAttendanceQR']);
    Route::get('/stores/{store:uuid}/branches/{branch:uuid}/getEmpAndShiftOfBranch', [ScheduleController::class, 'getEmpAndShiftOfBranch']);

    // routes for promotion and voucher
    Route::get('/stores/{store:uuid}/getAllPromotions', [PromotionVoucherController::class, 'getAllPromotions']);
    Route::get('/stores/{store:uuid}/getAllVouchers', [PromotionVoucherController::class, 'getAllVouchers']);
    Route::post('/stores/{store:uuid}/createPromotion', [PromotionVoucherController::class, 'createPromotion']);
    Route::post('/stores/{store:uuid}/createVoucher', [PromotionVoucherController::class, 'createVoucher']);
    Route::post('/stores/{store:uuid}/promotions/{promotion:id}/updatePromotion', [PromotionVoucherController::class, 'createPromotion']);
    Route::post('/stores/{store:uuid}/vouchers/{voucher:id}/updateVoucher', [PromotionVoucherController::class, 'createVoucher']);

    // routes for employees
    Route::get('/stores/{store:uuid}/employees', [EmployeeController::class, 'index']);
    Route::post('/stores/{store:uuid}/employees', [EmployeeController::class, 'store']);
    Route::get('/stores/{store:uuid}/employees/{employee:uuid}', [EmployeeController::class, 'show']);
    Route::post('/stores/{store:uuid}/employees/{employee:uuid}', [EmployeeController::class, 'update']);
    Route::delete('/stores/{store:uuid}/employees/{employee:uuid}', [EmployeeController::class, 'destroy']);
    Route::post('/stores/{store:uuid}/employees/{employee:uuid}/updateEmployeePassword', [EmployeeController::class, 'updateEmployeePassword']);
    // Route::post('/stores/{store:uuid}/employees/{employee:uuid}/permissions', [EmployeeController::class, 'permissions']);
    // Route::get('/stores/{store:uuid}/employees/{employee:uuid}/permissions', [EmployeeController::class, 'getEmpPermissions']);

    // routes for products
    // Route::get('/stores/{store:uuid}/products', [ProductController::class, 'index']);
    Route::post('/stores/{store:uuid}/branches/{branch:uuid}/products/addProductByJson', [ProductController::class, 'addProductByJson']);
    Route::post('/stores/{store:uuid}/products/addProductWithVariation', [ProductController::class, 'addProductWithVariation']);
    Route::get('/stores/{store:uuid}/branches/{branch:uuid}/products', [ProductController::class, 'indexOfBranch']);
    Route::get('/stores/{store:uuid}/branches/{branch:uuid}/search-products', [ProductController::class, 'searchBranchInventory']);
    Route::get('/stores/{store:uuid}/branches/{branch:uuid}/productOrderRecommend', [ProductController::class, 'productOrderRecommend']);
    Route::post('/stores/{store:uuid}/branches/{branch:uuid}/createBatch', [ProductController::class, 'createBatch']);
    Route::post('/stores/{store:uuid}/products', [ProductController::class, 'store']);
    Route::post('/stores/{store:uuid}/products/{product:uuid}', [ProductController::class, 'update']);
    Route::get('/stores/{store:uuid}/products/{product:uuid}', [ProductController::class, 'show']);
    Route::delete('/stores/{store:uuid}/products/{product:uuid}', [ProductController::class, 'destroy']);
    Route::post('/stores/{store:uuid}/products/{product:uuid}/active', [ProductController::class, 'active']);
    Route::post('/stores/{store:uuid}/products/{product:uuid}/inactive', [ProductController::class, 'inactive']);

    Route::post('/stores/{store:uuid}/branches/{branch:uuid}/transferInventory', [BranchInventoryController::class, 'transferInventory']);

    // routers for customer order
    Route::get('/stores/{store:uuid}/branches/{branch:uuid}/customerOrders', [CustomerOrderController::class, 'index']);
    Route::get('/stores/{store:uuid}/branches/{branch:uuid}/customerOrders/{customerOrder:id}/process', [CustomerOrderController::class, 'process']);
    Route::post('/stores/{store:uuid}/branches/{branch:uuid}/customerOrders/{customerOrder:id}/confirm', [CustomerOrderController::class, 'confirm']);
    Route::post('/stores/{store:uuid}/branches/{branch:uuid}/customerOrders/{customerOrder:id}/cancel', [CustomerOrderController::class, 'cancel']);
    Route::post('/stores/{store:uuid}/branches/{branch:uuid}/customerOrders/{customerOrder:id}/payment', [CustomerOrderController::class, 'payment']);
    Route::post('/stores/{store:uuid}/branches/{branch:uuid}/customerOrders/{customerOrder:id}/updateDetails', [CustomerOrderController::class, 'updateDetails']);

    // order
    Route::get('/stores/{store:uuid}/branches/{branch:uuid}/orders', [OrderController::class, 'index']);
    Route::post('/stores/{store:uuid}/branches/{branch:uuid}/orders/addOrder', [OrderController::class, 'addOrder']);
    Route::get('/stores/{store:uuid}/orders/{order:uuid}', [OrderController::class, 'show']);
    Route::post('/stores/{store:uuid}/orders', [OrderController::class, 'showByQR']);
    Route::put('/stores/{store:uuid}/branches/{branch:uuid}/orders/{order:uuid}', [OrderController::class, 'update']);
    Route::delete('/stores/{store:uuid}/branches/{branch:uuid}/orders/deleteAll', [OrderController::class, 'deleteAll']);
    Route::delete('/stores/{store:uuid}/branches/{branch:uuid}/orders/{order:uuid}', [OrderController::class, 'destroy']);

    // routes for refunds
    Route::get('/stores/{store:uuid}/branches/{branch:uuid}/refunds', [RefundController::class, 'index']);
    Route::post('/stores/{store:uuid}/branches/{branch:uuid}/refunds', [RefundController::class, 'store']);
    Route::post('/stores/{store:uuid}/branches/{branch:uuid}/refunds/removeInventory', [RefundController::class, 'removeInventory']);
    Route::put('/stores/{store:uuid}/branches/{branch:uuid}/refunds/{refund:uuid}', [RefundController::class, 'update']);
    Route::get('/stores/{store:uuid}/refunds/{refund:uuid}', [RefundController::class, 'show']);
    Route::delete('/stores/{store:uuid}/branches/{branch:uuid}/refunds/{refund:uuid}', [RefundController::class, 'destroy']);

    // routes for purchase orders
    // Route::get('/stores/{store:uuid}/purchase-orders', [PurchaseOrderController::class, 'getStorePurchaseOrder']);
    Route::get('/stores/{store:uuid}/branches/{branch:uuid}/purchase-orders', [PurchaseOrderController::class, 'index']);
    Route::post('/stores/{store:uuid}/branches/{branch:uuid}/purchase-orders/addInventory', [PurchaseOrderController::class, 'addInventory']);
    Route::get('/stores/{store:uuid}/purchase-orders/{purchaseOrder:uuid}', [PurchaseOrderController::class, 'show']);
    Route::put('/stores/{store:uuid}/branches/{branch:uuid}/purchase-orders/{purchaseOrder:uuid}', [PurchaseOrderController::class, 'update']);
    Route::delete('/stores/{store:uuid}/branches/{branch:uuid}/purchase-orders/{purchaseOrder:uuid}', [PurchaseOrderController::class, 'destroy']);
    // routes for update purchase order detail
    Route::put('/stores/{store:uuid}/branches/{branch:uuid}/purchase-order-details/{id}', [PurchaseOrderController::class, 'updateDetail']);

    // purchase return
    Route::get('/stores/{store:uuid}/purchase-returns/{purchaseReturn:uuid}', [PurchaseReturnController::class, 'show']);
    Route::get('/stores/{store:uuid}/branches/{branch:uuid}/purchase-returns', [PurchaseReturnController::class, 'index']);
    Route::post('/stores/{store:uuid}/branches/{branch:uuid}/purchase-returns/removeInventory', [PurchaseReturnController::class, 'removeInventory']);
    // Route::get('/stores/{store:uuid}/branches/{branch:uuid}/purchase-returns/{purchaseReturn:uuid}', [PurchaseReturnController::class, 'show']);

    // routes for inventory check
    Route::get('/stores/{store:uuid}/branches/{branch:uuid}/inventory-checks/{inventoryCheck:uuid}', [InventoryCheckController::class, 'show']);
    Route::get('/stores/{store:uuid}/branches/{branch:uuid}/inventory-checks', [InventoryCheckController::class, 'index']);
    Route::post('/stores/{store:uuid}/branches/{branch:uuid}/inventory-checks', [InventoryCheckController::class, 'store']);

    Route::get('/stores/{store:uuid}/suppliers', [SupplierController::class, 'index']);
    Route::post('/stores/{store:uuid}/suppliers', [SupplierController::class, 'store']);
    Route::get('/stores/{store:uuid}/suppliers/{supplier:uuid}', [SupplierController::class, 'show']);
    Route::put('/stores/{store:uuid}/suppliers/{supplier:uuid}/payDebt', [SupplierController::class, 'payDebt']);
    Route::post('/stores/{store:uuid}/suppliers/{supplier:uuid}', [SupplierController::class, 'update']);
    Route::delete('/stores/{store:uuid}/suppliers/{supplier:uuid}', [SupplierController::class, 'destroy']);

    Route::get('/stores/{store:uuid}/customers', [CustomerController::class, 'index']);
    Route::post('/stores/{store:uuid}/customers/addCustomersByJson', [CustomerController::class, 'addCustomersByJson']);
    Route::post('/stores/{store:uuid}/customers', [CustomerController::class, 'store']);
    Route::put('/stores/{store:uuid}/customers/{customer:uuid}/payDebt', [CustomerController::class, 'payDebt']);
    Route::get('/stores/{store:uuid}/customerDebts', [CustomerController::class, 'customerDebts']);
    Route::get('/stores/{store:uuid}/customers/{customer:uuid}', [CustomerController::class, 'show']);
    Route::put('/stores/{store:uuid}/customers/{customer:uuid}', [CustomerController::class, 'update']);
    Route::delete('/stores/{store:uuid}/customers/{customer:uuid}', [CustomerController::class, 'destroy']);

    Route::get('/stores/{store:uuid}/categories', [CategoryController::class, 'index']);
    Route::get('/stores/{store:uuid}/categories/getNestedCategory', [CategoryController::class, 'getNestedCategory']);
    Route::get('/stores/{store:uuid}/categories/parent', [CategoryController::class, 'getParentCategory']);
    Route::post('/stores/{store:uuid}/categories', [CategoryController::class, 'store']);
    Route::get('/stores/{store:uuid}/categories/{category:uuid}', [CategoryController::class, 'show']);
    Route::put('/stores/{store:uuid}/categories/{category:uuid}', [CategoryController::class, 'update']);
    Route::delete('/stores/{store:uuid}/categories/{category:uuid}', [CategoryController::class, 'destroy']);

    // transfer inventory
    Route::get('/stores/{store:uuid}/branches/{branch:uuid}/transferInventory', [BranchInventoryController::class, 'index']);
    Route::post('/stores/{store:uuid}/branches/{branch:uuid}/transferInventory', [BranchInventoryController::class, 'transferInventory']);
    Route::get('/stores/{store:uuid}/branches/{branch:uuid}/transferInventory/{id}/show', [BranchInventoryController::class, 'show']);
    Route::put('/stores/{store:uuid}/branches/{branch:uuid}/transferInventory/{id}', [BranchInventoryController::class, 'update']);

    // cashbook
    Route::get('/stores/{store:uuid}/branches/{branch:uuid}/cashbook', [PaymentReceiptVoucherController::class, 'index']);
    Route::post('/stores/{store:uuid}/branches/{branch:uuid}/cashbook', [PaymentReceiptVoucherController::class, 'store']);
    Route::put('/stores/{store:uuid}/branches/{branch:uuid}/cashbook/{id}', [PaymentReceiptVoucherController::class, 'update']);
    Route::delete('/stores/{store:uuid}/branches/{branch:uuid}/cashbook/{id}', [PaymentReceiptVoucherController::class, 'delete']);

    // customer groups routes
    Route::get('/stores/{store:uuid}/customerGroups', [CustomerGroupController::class, 'index']);
    Route::post('/stores/{store:uuid}/customerGroups', [CustomerGroupController::class, 'store']);
    Route::put('/stores/{store:uuid}/customerGroups/{id}', [CustomerGroupController::class, 'update']);
    Route::delete('/stores/{store:uuid}/customerGroups/{id}', [CustomerGroupController::class, 'delete']);

    Route::get('/stores/{store:uuid}/branches/{branch:uuid}/inventory', [InventoryTransactionController::class, 'index']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
