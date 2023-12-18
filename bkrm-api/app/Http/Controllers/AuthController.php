<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Employee;
use App\Models\Store;
use App\Models\Branch;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Supplier;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

class AuthController extends Controller
{
    public function ownerRegister(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'nullable|string',
            'password' => 'required|string|confirmed',
            'user_name' => 'required|string|unique:users,user_name',
            'phone' => 'nullable|string',
            'date_of_birth' => 'nullable|date_format:Y-m-d',
            'status' => 'nullable|in:active,inactive',
            'gender' => 'nullable|string',
            'store_name' => 'required|string',
            'address' => 'required|string',
            'province' => 'required|string',
            'ward' => 'required|string',
            'district' => 'required|string',
            'store_phone' => 'nullable|string',
            'default_branch' => 'required|boolean',
            'lng' => 'nullable|string',
            'lat' => 'nullable|string',
        ], $messages = ['user_name.unique' => 'Username existed']);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'error',
                'data' => $validator->errors()->toArray(),
            ]);
        }

        $fields = $validator->validated();
        $user = User::create([
            'uuid' => (string)Str::uuid(),
            'name' => $fields['name'],
            'user_name' => $fields['user_name'],
            'email' => $fields['email'] === null ? '' : $fields['email'],
            'password' => bcrypt($fields['password']),
            'phone' => $fields['phone'],
            'date_of_birth' => $fields['date_of_birth'] ? $fields['date_of_birth'] : null,
            'status' => $fields['status'] ? $fields['status'] : "active",
            'gender' => array_key_exists('gender', $fields) ? $fields['gender'] : null,
        ]);

        $store = Store::create([
            'uuid' => (string) Str::uuid(),
            'user_id' => $user->id,
            'name' => $fields['store_name'],
            'address' => $fields['address'],
            'ward' => $fields['ward'],
            'district' => $fields['district'],
            'province' => $fields['province'],
            'phone' => $fields['store_phone'],
            'status' => 'active',
            'image' => config('app.url') . '/store-images/store-default.png',
            'general_configuration' => '{"averageCost":{"status":true},"inventory":{"status":true},"recommendedProduct":{"status":true},"variation":{"status":true},"expiryDate":{"status":true},"customerScore":{"status":true,"value":10000,"exceptDiscountProduct":false,"exceptDiscountInvoice":false,"exceptVoucher":false},"email":{"status":true,"emailAddress":"bkrm.store@gmail.com","password":"haikhangle"},"notifyDebt":{"status":true,"checkDebtAmount":true,"debtAmount":10,"checkNumberOfDay":false,"numberOfDay":30,"typeDebtDay":null,"canNotContinueBuy":false,"canNotContinueDebt":false},"returnLimit":{"status":false,"day":7},"canFixPriceSell":{"status":true,"cart":true,"import":true,"returnCart":true,"returnImport":true},"printReceiptWhenSell":{"status":true,"cart":true,"import":false,"returnCart":false,"returnImport":false,"order":false,"checkInventroy":false,"cartModal":"large","titleNote":"","contentNote":""},"alowDebt":{"status":true},"canSellWhenNegativeQuantity":{"status":true},"canEnterDiscountWhenSell":{"status":true},"defaultPaymentAmount":{"status":true,"cart":true,"import":true},"discount":{"status":true,"applyMultiple":false,"applyOnline":true},"voucher":{"status":true},"delivery":{"status":true},"vat":{"status":false,"listCost":[{"key":"1","costName":"","value":0,"type":"%"}]},"orderLowStock":{"status":true,"choiceRec":"Auto","dayAuto":7,"choiceQuantity":"select","selectQuantity":"latest","inputQuantity":10,"noHistoryQuantity":10,"selectSuplier":"latest"},"autoApplyDiscount":{"status":true}}'
        ]);

        if ($fields['default_branch']) {
            $branch = Branch::create([
                'store_id' => $store->id,
                'uuid' => (string) Str::uuid(),
                'name' => $fields['store_name'],
                'address' => $fields['address'],
                'ward' => $fields['ward'],
                'district' => $fields['district'],
                'province' => $fields['province'],
                'phone' => $fields['store_phone'],
                'status' => 'active',
                'lat' => $fields['lat'],
                'lng' => $fields['lng'],
            ]);
        }

        Category::create([
            "name" => "Danh mục chung",
            "uuid" => (string) Str::uuid(),
            "store_id" => $store->id,

        ]);

        Supplier::create([
            "uuid" => (string) Str::uuid(),
            "name" => "Nhà cung cấp lẻ",
            "store_id" => $store->id,
            "type" => "default"
        ]);

        Customer::create([
            "uuid" => (string) Str::uuid(),
            "name" => "Khách hàng lẻ",
            "store_id" => $store->id,
            "type" => "default"
        ]);

        return response()->json([
            'message' => 'User successfully registered',
            'user' => $user,
            'store' => $store,
            'branch' => $branch,

        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_name' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($request['role'] === 'employee') {
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            if (Auth::guard('employee')->attempt($validator->validated())) {
                $user = Auth::guard('employee')->user();
                if ($user->status === "deleted" || $user->status === "inactive") {
                    return response()->json(['error' => 'Unauthorized', 'message' => 'Tài khoản bị ngưng hoạt động hoặc đã xóa'], 401);
                }
            }

            if (!$token = Auth::guard('employee')->attempt($validator->validated())) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            return $this->createNewEmpToken($token);
        }
        if ($request['role'] === 'owner') {

            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            if (!$token = auth()->attempt($validator->validated())) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            return $this->createNewToken($token);
        }
    }

    // this is used when user re-enter their password to change their profile
    public function confirmPassword(Request $request)
    {
        $validated = Validator::make($request->all(), [
            'user_name' => 'required|string',
            'password' => 'required|string',
            'role' => 'required|string',
        ]);

        $validated = $request->validate([
            'user_name' => 'required|string',
            'password' => 'required|string',
            'role' => 'required|string',
        ]);

        $role = $validated['role'];
        unset($validated['role']);

        $authenticated = $role === 'employee'
            ? Auth::guard('employee')->attempt($validated)
            : Auth::guard('user')->attempt($validated);

        return $authenticated ? response()->json(['message' => 'success'], 200) : response()->json(['message' => 'failure'], 400);
    }

    public function employeeLogin(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if (!$token = Auth::guard('employee')->attempt($validator->validated())) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->createNewEmpToken($token);
    }

    protected function createNewToken($token)
    {
        $user = Auth::guard('user')->user();
        $store = Store::where('user_id', $user->id)->get()[0];
        $branches = Branch::where('store_id', $store->id)->where('status', 'active')->get();

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => $user,
            'store' => array_merge($store->toArray(), [
                'branches' => $branches,
                'key' => 'AIzaSyDNzJMybCvn16gHHlj_A-8xgrA5gKvads0',
            ]),
            'role' => 'owner'
        ]);
    }

    protected function createNewEmpToken($token)
    {
        $user = Auth::guard('employee')->user();
        $store = Store::where('id', $user->store_id)->get()[0];
        $branches = Branch::where('store_id', $store->id)->get();
        // return response()->json([
        //     'access_token' => $token,
        //     'store' => $store,
        //     'token_type' => 'bearer',
        //     'expires_in' => auth()->factory()->getTTL() * 60,
        //     'user' => Auth::guard('employee')->user(),
        //     'permissions' => array_map(function ($p) {
        //             return $p['name'];
        //         }, $user->getAllPermissions()->toArray()),
        // ]);

        return response()->json([
            'access_token' => $token,
            'store' => array_merge($store->toArray(), [
                'branches' => $branches,
                'key' => 'AIzaSyDNzJMybCvn16gHHlj_A-8xgrA5gKvads0',
            ]),
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => Auth::guard('employee')->user(),
            'permissions' => $user->priviledges,
        ]);
    }

    public function refresh()
    {
        return $this->createNewToken(auth()->refresh());
    }

    public function verifyOwnerToken(Request $request)
    {
        if (Auth::guard('user')->user()) {
            $user = Auth::guard('user')->user();
            $store = Store::where('user_id', $user->id)->get()[0];
            $branches = Branch::where('store_id', $store->id)->where('status', 'active')->get();
            return response()->json([
                'user' => $user,
                'store' => array_merge($store->toArray(), [
                    'branches' => $branches,
                    'key' => 'AIzaSyDNzJMybCvn16gHHlj_A-8xgrA5gKvads0',
                ]),
                'role' => 'owner',
                'data' => $request->header()
            ]);
        } else if (Auth::guard('employee')->user()) {
            $user = Auth::guard('employee')->user();
            $store = Store::where('id', $user->store_id)->get()[0];
            $branches = Branch::where('store_id', $store->id)->where('status', 'active')->get();
            return response()->json([
                'user' => Auth::guard('employee')->user(),
                'store' => array_merge($store->toArray(), [
                    'branches' => $branches,
                    'key' => 'AIzaSyDNzJMybCvn16gHHlj_A-8xgrA5gKvads0',
                ]),
                'role' => 'employee',
                'permission' => $user->priviledges,
                'data' => $request->header()
            ]);
        } else {
            return response()->json([
                'message' => 'Unauthorized',
                'data' => $request->header()
            ], 401);
        }
    }

    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'User successfully signed out']);
    }

    public function editProfile(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string',
            'email' => 'nullable|string',
            'password' => 'nullable|string',
            'phone' => 'nullable|string',
            'date_of_birth' => 'nullable|date_format:Y-m-d',
            'status' => 'nullable|in:active,inactive',
            'gender' => 'nullable|string',
            'role' => 'required|string',
            'id_card_number' => 'nullable|string',
            'address' => 'nullable|string',
            'customization' => 'nullable|string',
            'image' => 'nullable',
        ]);

        # get the user send request by token
        $user_type =  $validated['role'];
        unset($validated['role']);
        $user_id = $user_type === 'employee' ? Auth::guard('employee')->user() : Auth::guard('user')->user()->id;
        // return response()->json(['data' => $user_id]);
        if (array_key_exists('password', $validated)) {
            if ($validated['password']) {
                if ($user_type === 'employee') {
                    Employee::where('id', $user_id)->update(['password' => bcrypt($validated['password'])]);
                }
                if ($user_type === 'owner') {
                    User::where('id', $user_id)->update(['password' => bcrypt($validated['password'])]);
                }
            }
            unset($validated['password']);
        }

        if (array_key_exists('image', $validated)) {
            if ($validated['image'] != "") {
                /*$imagePath = $validated['image']->store('store-images', 'public');
                $sized_image = Image::make(public_path("storage/{$imagePath}"))->fit(1000, 1000);
                $sized_image->save();
                $imagePath = config('app.url') . $imagePath;*/

                $fileName = Str::random(28). '.' . $validated['image']->getClientOriginalExtension();
                $folder = '/storage/store-images';
                $validated['image']->move(public_path($folder), $fileName);
                $imagePath = config('app.url') . "/{$folder}/{$fileName}";
            }
            unset($validated['image']);
            $validated = array_merge($validated, ['img_url' => $imagePath]);
        }


        if ($user_type === 'employee') {
            Employee::where('id', $user_id)->update($validated);
        }
        if ($user_type === 'owner') {
            unset($validated['address']);
            User::where('id', $user_id)->update($validated);
        }
        return response()->json(['data' => 'Edit profile successfully']);
    }
}
