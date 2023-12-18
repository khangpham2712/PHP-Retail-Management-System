<?php

namespace App\Http\Controllers;

use App\Models\ProductPrice;
use App\Models\Store;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductPriceController extends Controller
{
    public function index(Request $request, Store $store, Product $product)
    {
        $prices = ProductPrice::where('store_id', $store->id)
            ->where('product_id', $product->id)->get();
        return response()->json([
            'data' => $prices
        ], 200);
    }

    public function store(Request $request, Store $store, Product $product)
    {
        $validated = $request->validate([
            'price' => 'required|numeric',
            'start_date' => 'required|string|date_format:Y-m-d',
            'end_date' => 'required|string|date_format:Y-m-d',
        ]);

        $productPrice = array_merge([
            'created_by' => auth()->user()->id,
            'product_id' => $product->id,
            'store_id' => $store->id,
        ], $validated);

        ProductPrice::create($productPrice);
        return response()->json([
            'message' => 'Product price create successfully',
            'data' => $productPrice
        ], 200);
    }

    public function update(Request $request, Store $store, Product $product, ProductPrice $productPrice)
    {
        $validated = $request->validate([
            'price' => 'nullable|numeric',
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d',
        ]);

        $newProductPrice = array_merge([
            'created_by' => auth()->user()->id,
            'product_id' => $product->id,
            'store_id' => $store->id,
        ], $validated);

        $productPrice->update($newProductPrice);

        return response()->json([
            'message' => 'Product price update successfully',
            'data' => $productPrice
        ], 200);
    }

    public function show(Store $store, Product $product, ProductPrice $productPrice)
    {
        return response()->json([
            'data' => $productPrice,
        ], 200);
    }
    public function destroy(Store $store, Product $product, ProductPrice $productPrice)
    {
        $isDeleted = ProductPrice::destroy($productPrice->id);
        return response()->json([
            'message' => $isDeleted,
            'data' => $productPrice,
        ], 200);
    }
}
