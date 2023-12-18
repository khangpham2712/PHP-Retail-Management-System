<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\BranchInventory;
use App\Models\Store;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Employee;
use Intervention\Image\Facades\Image;

class BranchController extends Controller
{

    public function index(Store $store)
    {
        if (Auth::guard('user')->user()) {
            return response()->json([
                'data' => $store->branches()->where('status', '<>', 'deleted')->get(),
            ]);
        } else if (Auth::guard('employee')->user()) {
            $employee_id = Auth::guard('employee')->user()->id;
            $branches = DB::table('employee_work_branch')
                ->leftJoin('branches', 'branches.id', '=', 'employee_work_branch.branch_id')
                ->where('employee_work_branch.employee_id', $employee_id)
                ->where('branches.status', 'active')
                ->select('branches.*')
                ->get();

            return response()->json([
                'data' => $branches,
                'emp' => $employee_id,
            ]);
        } else {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
    }

    public function getAllBranches(Store $store)
    {
        return response()->json([
            'data' => $store->branches()->where('status', '<>', 'deleted')->get(),
        ]);
    }

    public function store(Request $request, Store $store)
    {
        $data = $request->validate([
            'name' => 'required|unique:stores',
            'address' => 'nullable|string',
            'ward' => 'nullable|string',
            'district' => 'nullable|string',
            'province' => 'nullable|string',
            'phone' => 'nullable|string',
            'status' => 'nullable|in:active,inactive',
            'lat' => 'nullable|string',
            'lng' => 'nullable|string',
            'image' => 'nullable'
        ]);

        $imagePath = "";
        if (array_key_exists('image', $data)) {
            if ($data['image'] != "") {
                /*$imagePath = $data['image']->store('branch-images', 'public');
                $sized_image = Image::make(public_path("storage/{$imagePath}"))->fit(1000, 1000);
                $sized_image->save();
                $imagePath = config('app.url') . $imagePath;*/

                $fileName = Str::random(28). '.' . $data['image']->getClientOriginalExtension();
                $folder = '/storage/branch-images';
                $data['image']->move(public_path($folder), $fileName);
                $imagePath = config('app.url') . "/{$folder}/{$fileName}";
            }
        }

        unset($data['image']);

        $branch = Branch::create(array_merge($data, [
            'store_id' => $store->id,
            'uuid' => (string) Str::uuid(),
            'img_url' => $imagePath ? $imagePath : '',
        ]));


        // add active products to branches
        $products = $store->products()->where('status', 'active')->get();
        foreach($products as $product) {
            BranchInventory::create([
                'store_id' => $store->id,
                'branch_id' => $branch->id,
                'product_id' => $product->id,
                'quantity_available' => 0,
            ]);
        }

        return response()->json([
            'message' => 'Branch created successfully',
            'data' => $branch,
        ], 200);
    }

    public function show(Store $store, Branch $branch)
    {
        return response()->json([
            'data' => $branch,
        ], 200);
    }

    public function update(Request $request, Store $store, Branch $branch)
    {
        $data = $request->validate([
            'name' => 'nullable|string',
            'address' => 'nullable|string',
            'ward' => 'nullable|string',
            'district' => 'nullable|string',
            'province' => 'nullable|string',
            'phone' => 'nullable|string',
            'status' => 'nullable|in:active,inactive',
            'lng' => 'nullable|string',
            'lat' => 'nullable|string',
            'image' => 'nullable'
        ]);

        if (array_key_exists('image', $data)) {
            if ($data['image']) {

                /*$imagePath = $data['image']->store('branch-images', 'public');
                $sized_image = Image::make(public_path("storage/{$imagePath}"))->fit(1000, 1000);
                $sized_image->save();
                $imagePath = config('app.url') . $imagePath;*/

                $fileName = Str::random(28). '.' . $data['image']->getClientOriginalExtension();
                $folder = '/storage/branch-images';
                $data['image']->move(public_path($folder), $fileName);
                $imagePath = config('app.url') . "/{$folder}/{$fileName}";
                $branch->update(['img_url' => $imagePath]);
            }
        }

        unset($data['image']);

        $branch->update($data);

        return response()->json([
            'message' => 'Branch update successfully',
            'data' => $branch,
        ], 200);
    }

    public function destroy(Store $store, Branch $branch)
    {
        $numOfBranch = $store->branches()->where('status', 'active')->count();
        if ($numOfBranch <= 1) {
            return response()->json([
                'message' => 'Can not delete last branch',
                'data' => $branch
            ], 404);
        }

        $branch->update(['status' => 'deleted']);
        return response()->json([
            'message' => 1,
            'data' => $branch,
        ], 200);
    }
}
