<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Store;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    public function index(Store $store)
    {
        return response()->json([
            'data' => $store->categories,
        ], 200);
    }

    private function getSubCategory($parent_id)
    {
        $categories = Category::all()->where('parent_category_id', $parent_id)->toArray();
        $data = [];
        foreach ($categories as $category) {
            $children = $this->getSubCategory($category['id']);

            array_push($data, array_merge($category, ['children' => $children, 'title' => $category['name'], 'value' => $category['uuid']]));
        }
        return $data;
    }

    public function getNestedCategory(Store $store)
    {
        $top_parents = $store->categories()->whereNull('parent_category_id')->get()->toArray();
        $data = [];
        foreach ($top_parents as $parent) {
            array_push($data, array_merge($parent, ['children' => $this->getSubCategory($parent['id']), 'title' => $parent['name'], 'value' => $parent['uuid']]));
        }
        return response()->json(['data' => $data]);
    }

    public function getParentCategory(Store $store)
    {
        $categories = $store->categories()->whereNull('parent_category_id')->get();

        $data = [];

        foreach ($categories as $category) {
            $children = $category->children;
            array_push($data, array_merge($category->toArray(), ['children' => $children]));
        }

        return response()->json([
            'data' => $categories
        ], 200);
    }

    public function store(Request $request, Store $store)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'parent_category_uuid' => 'nullable|string',
        ]);


        if ($store->categories->where('name', $validated['name'])->first()) {
            return response()->json([
                'message' => 'The given data was invalid',
                'errors' => [
                    "name" => "Category name already exist"
                ]
            ]);
        }

        $category = ['name' => $validated['name']];

        if ($validated['parent_category_uuid']) {
            $parent_id = Category::where('uuid', $validated['parent_category_uuid'])->first()->id;
            $category = array_merge($category, ['parent_category_id' => $parent_id]);
        }

        $created = Category::create(array_merge($category, [
            'uuid' => (string) Str::uuid(),
            'store_id' => $store->id
        ]));
        return response()->json([
            'data' => $created
        ], 200);
    }

    public function show(Store $store, Category $category)
    {
        $children = $category->children;

        $data = [];

        foreach ($children as $child) {
            $grand_children = $child->children;
            array_push($data, array_merge($child->toArray(), ['children' => $grand_children]));
        }

        return response()->json([
            'data' => $data
        ]);
    }

    public function update(Request $request, Store $store, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'parent_category_uuid' => 'nullable|string',
        ]);

        $newCategory = ['name' => $validated['name']];

        if (array_key_exists('parent_category_uuid', $validated)) {
            if ($validated['parent_category_uuid'] != "") {
                $parent_id = Category::where('uuid', $validated['parent_category_uuid'])->first()->id;
                $newCategory = array_merge($category, ['parent_category_id' => $parent_id]);
            }
        }

        $category->update($newCategory);

        return response()->json([
            'data' => $category
        ], 200);
    }

    public function destroy(Store $store, Category $category)
    {
        $isDeleted = Category::destroy($category->id);
        return response()->json([
            'message' => $isDeleted,
            'data' => $category,
        ], 200);
    }
}
