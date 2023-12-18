<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Store;
use App\Models\Employee;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Auth;

class EmployeeController extends Controller
{
    public function index(Request $request, Store $store)
    {
        $limit = $request->query('limit');
        $page = $request->query('page');

        $search_key = $request->query('searchKey');

        $db_query = $store->employees()
            ->where('status', '<>', 'deleted')
            ->orderBy('created_at', 'desc');

        if ($search_key) {
            $db_query = $db_query->where(function ($query) use ($search_key) {
                $query->where('name', 'like', '%' . $search_key . '%')
                    ->orWhere('employee_code', 'like',  '%' . $search_key . '%')
                    ->orWhere('user_name', 'like', '%' . $search_key . '%')
                    ->orWhere('phone', 'like', '%' . $search_key . '%')
                    ->orWhere('email', 'like', '%' . $search_key . '%');
            });
        }
        $total_rows = $db_query->count();

        if ($limit) {
            $employees = $db_query->offset($limit * $page)->limit($limit)->get();
        } else {
            $employees = $db_query->get();
        }
        return response()->json([
            'data' => $employees,
            'total_rows' => $total_rows,
        ], 200);
    }

    public function editEmployeeImage(Request $request, Store $store, Employee $employee)
    {
        $fields = $request->validate([
            'image' => 'required',
            'oldImageUrl' => 'required',
        ]);

        /*$imagePath = $fields['image']->store('employee-images', 'public');
        $sized_image = Image::make(public_path("storage/{$imagePath}"))->fit(1000, 1000);
        $sized_image->save();*/

        $fileName = Str::random(28). '.' . $fields['image']->getClientOriginalExtension();
        $folder = '/storage/employee-images';
        $fields['image']->move(public_path($folder), $fileName);
        $imagePath = config('app.url') . "/{$folder}/{$fileName}";

        /// to do delete old image
        $employee->update(['img_url' => $imagePath]);

        return response()->json([
            'data' => $employee,
        ], 200);
    }

    public function store(Request $request, Store $store)
    {
        $fields = $request->validate([
            'name' => 'required|string',
            'password' => 'required|string|confirmed',
            'user_name' => 'required|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|string',
            'date_of_birth' => 'nullable|date_format:Y-m-d',
            'status' => 'nullable|in:active,inactive',
            'gender' => 'nullable|in:male,female',
            'id_card_num' => 'nullable|string',
            'salary' => 'nullable|string',
            'salary_type' => 'nullable|string',
            'address' => 'nullable|string',
            'permissions' => 'required|array',
            'branches' => 'required|array',
            'image' => 'nullable',
        ]);

        $existed = Employee::where('user_name', $fields['user_name'])->where('status', 'active')->first();
        if($existed) {
            return response()->json([
                'status' => 'Employee user_name existed'
            ], 500);
        }

        $imagePath = "";
        if (array_key_exists('image', $fields)) {
            if ($fields['image'] != "") {
                /*$imagePath = $fields['image']->store('employee-images', 'public');
                $sized_image = Image::make(public_path("storage/{$imagePath}"))->fit(1000, 1000);
                $sized_image->save();
                $imagePath = config('app.url') . $imagePath;*/

                $fileName = Str::random(28). '.' . $fields['image']->getClientOriginalExtension();
                $folder = '/storage/employee-images';
                $fields['image']->move(public_path($folder), $fileName);
                $imagePath = config('app.url') . "/{$folder}/{$fileName}";
            }
        }

        $last_id = count($store->employees);
        $employee_code = 'NV' . sprintf('%04d', $last_id + 1);

        $employee = [
            'name' => $fields['name'],
            'user_name' => $fields['user_name'],
            'email' =>  $fields['email'] ?  $fields['email'] : null,
            'password' => bcrypt($fields['password']),
            'phone' => $fields['phone'],
            'uuid' => (string) Str::uuid(),
            'date_of_birth' => $fields['date_of_birth'] ? $fields['date_of_birth'] : null,
            'status' => $fields['status'] ?  $fields['status'] : null,
            'gender' => $fields['gender'] ? $fields['gender'] : null,
            'id_card_num' => $fields['id_card_num'],
            'salary' => $fields['salary'],
            'salary_type' => $fields['salary_type'],
            'address' => $fields['address'],
            'store_id' => $store->id,
            'employee_code' => $employee_code,
            'img_url' => $imagePath ? $imagePath : config('app.url') . '/employee-default.png',
        ];

        $newEmployee = Employee::create($employee);

        foreach ($fields['permissions'] as $permission) {
            DB::table('employee_priviledge')->insert(
                ['employee_id' => $newEmployee->id, 'priviledge_id' => $permission]
            );
        }

        foreach ($fields['branches'] as $branch) {
            DB::table('employee_work_branch')->insert(
                ['employee_id' => $newEmployee->id, 'branch_id' => $branch]
            );
        }

        return response()->json([
            'message' => 'Employee created sucessfully',
            'data' => $newEmployee
        ], 200);
    }

    public function update(Request $request, Store $store, Employee $employee)
    {
        $fields = $request->validate([
            'name' => 'nullable|string',
            'email' => 'nullable|string',
            'phone' => 'nullable|string',
            'date_of_birth' => 'nullable|date_format:Y-m-d',
            'salary' => 'nullable|string',
            'salary_type' => 'nullable|string',
            'address' => 'nullable|string',
            'gender' => 'nullable|in:male,female',
            'permissions' => 'nullable|array',
            'branches' => 'nullable|array',
            'image' => 'nullable',
            'status' => "nullable|string",
            'password' => 'nullable|string',
            'customization' => 'nullable|string',
        ]);

        // delete all old permissions and branches
        DB::table('employee_priviledge')
            ->where('employee_id', $employee->id)
            ->delete();
        DB::table('employee_work_branch')
            ->where('employee_id', $employee->id)
            ->delete();

        if (array_key_exists('branches', $fields)) {
            foreach ($fields['branches'] as $branch) {
                DB::table('employee_work_branch')->insert(
                    ['employee_id' => $employee->id, 'branch_id' => $branch]
                );
            }
        }

        if (array_key_exists('password', $fields)) {
            if ($fields['password']) {
                $employee->update(['password' => bcrypt($fields['password'])]);
            }
            unset($fields['password']);
        }

        if (array_key_exists('permissions', $fields)) {
            foreach ($fields['permissions'] as $permission) {
                DB::table('employee_priviledge')->insert(
                    ['employee_id' => $employee->id, 'priviledge_id' => $permission]
                );
            }
        }
        // change image
        if (array_key_exists('image', $fields)) {
            /*$imagePath = $fields['image']->store('employee-images', 'public');
            $sized_image = Image::make(public_path("storage/{$imagePath}"))->fit(1000, 1000);
            $sized_image->save();
            $imagePath = config('app.url') . $imagePath;*/

            $fileName = Str::random(28). '.' . $fields['image']->getClientOriginalExtension();
            $folder = '/storage/employee-images';
            $fields['image']->move(public_path($folder), $fileName);
            $imagePath = config('app.url') . "/{$folder}/{$fileName}";

            $employee->update(['img_url' => $imagePath]);
        }

        unset($fields['permissions']);
        unset($fields['branches']);
        unset($fields['image']);

        $employee->update($fields);

        return response()->json([
            'message' => 'Employee updated sucessfully',
            'data' => $employee,
        ]);
    }

    public function updateEmployeePassword(Request $request, Store $store, Employee $employee)
    {
        $fields = $request->validate([
            'owner_password' => 'nullable|string',
            'employee_password' => 'nullable|string',
        ]);

        $user = Auth::guard('user')->user();
        if ($user) {
            // $owner = Auth::table('users')->where('password', '=', bcrypt($fields['owner_password']))->first();
            if (!$token = Auth::guard('user')->attempt([
                'user_name' => $user->user_name,
                'password' => $fields['owner_password'],
            ])) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
            $employee->update(['password' => bcrypt($fields['employee_password'])]);
            return response()->json(['status' => 1, 'message' => 'Cập nhật mật khẩu thành công']);
        } else {
            return response()->json(['error' => 'Permission error'], 401);
        }
    }

    public function destroy(Store $store, Employee $employee)
    {
        //delete ref
        DB::table('employee_priviledge')->where('employee_id', $employee->id)->delete();
        DB::table('employee_work_branch')->where('employee_id', $employee->id)->delete();
        //delete employee
        $employee->delete();
        //$employee->update(['status' => 'deleted']);
        return response()->json([
            'message' => 1,
            'data' => $employee,
        ], 200);
    }

    public function show(Store $store, Employee $employee)
    {
        // $permissions = $employee->getAllPermissions();
        $branches = DB::table('employee_work_branch')
            ->leftJoin('branches', 'branches.id', '=', 'employee_work_branch.branch_id')
            ->where('employee_work_branch.employee_id', $employee->id)
            ->where('branches.status', 'active')
            ->select('branches.*')
            ->get();

        return response()->json([
            'data' => array_merge($employee->toArray(), ['permissions' => $employee->priviledges, 'branches' => $branches])
        ], 200);
    }

    public function permissions(Request $request, Store $store, Employee $employee)
    {
        $permissions = $request->validate([
            'manage-employees' => 'nullable|boolean',
            'manage-orders' => 'nullable|boolean',
            'manage-purchase-orders' => 'nullable|boolean',
            'manage-purchase-returns' => 'nullable|boolean',
        ]);

        foreach ($permissions as $name => $value) {
            if ($value) {
                $employee->givePermissionTo($name);
            } else {
                $employee->revokePermissionTo($name);
            }
        }

        return response()->json([
            'message' => 'Update permissions successfully',
            'data' => $employee->getAllPermissions(),
        ], 200);
    }

    public function getEmpPermissions(Request $request, Store $store, Employee $employee)
    {
        return response()->json([
            'data' => $employee->getAllPermissions(),
        ], 200);
    }
}
