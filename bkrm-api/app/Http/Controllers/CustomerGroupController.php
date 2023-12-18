<?php

namespace App\Http\Controllers;

use App\Models\CustomerGroup;
use App\Models\Store;
use Illuminate\Http\Request;

class CustomerGroupController extends Controller
{
    public function index(Request $request, Store $store) {
        $customerGroups = CustomerGroup::where('store_id', $store->id)->get();

        return response()->json([
            'data' => $customerGroups,
        ]);
    }

    public function store(Request $request, Store $store) {
        $validated = $request->validate([
            'name' => 'required|string',
            'discount' => 'nullable|string',
            'notes' => 'nullable|string',
            'conditions' => 'nullable|string',
            'store_id' => 'required|numeric',
        ]);
        $result = CustomerGroup::create($validated);
        return response()->json([
            'data' => $result,
        ]);
    }
    public function delete(Request $request, Store $store, $id) {
        $result = CustomerGroup::where('id', $id)->delete();
        return response()->json([
            'data' => $result,
        ]);
    }
    public function update(Request $request, Store $store, $id) {
        $validated = $request->validate([
            'name' => 'required|string',
            'discount' => 'nullable|string',
            'notes' => 'nullable|string',
            'conditions' => 'nullable|string',
            'store_id' => 'required|numeric',
        ]);
        $result = CustomerGroup::where('id', $id)->update($validated);
        return response()->json([
            'data' => $result,
        ]);
    }
}
