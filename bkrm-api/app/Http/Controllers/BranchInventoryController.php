<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\BranchInventory;
use App\Models\Product;
use App\Models\Store;
use App\Models\TransferInventory;
use App\Models\TransferInventoryDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Validator;

class BranchInventoryController extends Controller
{



    // transfer inventory between branch
    public function transferInventory(Request $request, Store $store, Branch $branch)
    {
        DB::beginTransaction();
        try {
            $validated = $request->all();

            # generate code
            $last_id = DB::table('transfer_inventory')->where('store_id', $store->id)->count();

            $code = 'CK' . sprintf('%06d', $last_id + 1);

            $to_branch = Branch::find($validated['to_id']);

            $transfer_inventory = [
                'to_id' => intval($validated['to_id']),
                'to_name' => $to_branch->name,
                'from_id' => $branch['id'],
                'from_name' => $branch['name'],
                'from_note' => $validated['from_note'],
                'code' => $validated['code'] ?? $code,
                'store_id' => $store->id,
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ];
            DB::table('transfer_inventory')->insert($transfer_inventory);
            $last_transfer_inventory_id = DB::getPdo()->lastInsertId();

            //Create transfer inventory detail
            $transfer_inventory['total_amount'] = 0;
            foreach($validated['products'] as $product) {

                $p = Product::whereUuid($product['product_uuid'])->first();
                //check available quantity
                $bi = BranchInventory::where('store_id', $store->id)
                    ->where('branch_id', $transfer_inventory['from_id'])
                    ->where('product_id', $p['id'])->first();

                if ($bi->quantity_available < $product['value_quantity']) {
                    throw new \ErrorException('Quantity available not match');
                }
                $detail = [
                    'transfer_inventory_id' => $last_transfer_inventory_id,
                    'product_uuid' => $product['product_uuid'],
                    'value_quantity' => intval($product['value_quantity']) ?? 0,
                    'unit_price' => doubleval($product['unit_price']) ?? 0,
                ];
                DB::table('transfer_inventory_details')->insert($detail);
                $transfer_inventory['total_amount'] += $detail['unit_price'] * $detail['value_quantity'];
            }
            //update total amount;
            DB::table('transfer_inventory')->where('id', $last_transfer_inventory_id)->update(['total_amount' => $transfer_inventory['total_amount']]);
            DB::commit();
            return response()->json([
                'transfer_inventory' => $transfer_inventory,
            ]);
        } catch(\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'The code was existed or product has been out of stock'
            ], 400);
        }
    }

    public function index(Request $request, Store $store, Branch $branch)
    {
        /*$data = DB::table('transfer_inventory')
            ->where('from_id', $branch->id)
            ->orWhere('to_id', $branch->id)
//            ->leftJoin('products', 'products.id', '=', 'transfer_inventory.product_id')
            ->orderBy('transfer_inventory.created_at', 'desc')
//            ->select('products.status as product_status', 'products.*', 'transfer_inventory.*')
            ->select('transfer_inventory.*')
            ->get();*/
        $data = TransferInventory::with('transfer_detail')
            ->where('from_id', $branch->id)
            ->orWhere('to_id', $branch->id)
            ->get();
        return response()->json([
            'data' => $data
        ]);
    }

    public function show(Store $store, Branch $branch, $id)
    {
        $data = TransferInventory::with('transfer_detail.product')->where('id', $id)->first();
//        $data = DB::table('transfer_inventory')
//            ->where('transfer_inventory.id', $id)
//            // ->where('from_id', $branch->id)
//            // ->orWhere('to_id', $branch->id)
//            ->leftJoin('products', 'products.id', '=', 'transfer_inventory.product_id')
//            ->orderBy('transfer_inventory.created_at', 'desc')
//            ->select('products.status as product_status', 'products.*', 'transfer_inventory.*')
//            ->get();
        return response()->json([
            'data' => $data
        ]);

    }

    public function update(Request $request, Store $store, Branch $branch, $id)
    {
        $validated = $request->all();
        DB::beginTransaction();
        try{
            /*if (array_key_exists('status', $validated) && $validated['status'] === 'closed') {
                BranchInventory::where('store_id', $store->id)
                    ->where('branch_id', $validated['from_id'])
                    ->where('product_id', $validated['product_id'])
                    ->decrement('quantity_available', $validated['quantity']);

                BranchInventory::where('store_id', $store->id)
                    ->where('branch_id', $validated['to_id'])
                    ->where('product_id', $validated['product_id'])
                    ->increment('quantity_available', $validated['quantity']);

                $to_batches = [];
                $batches = json_decode($validated['from_batches'], true);
                foreach ($batches as $batch) {
                    DB::table('product_batches')
                    ->where('store_id', $store->id)
                        ->where('branch_id', $validated['from_id'])
                        ->where('product_id', $validated['product_id'])
                        ->where('batch_code', $batch['batch_code'])
                        ->decrement('quantity', $batch['quantity']);

                    $last_id = DB::table('product_batches')
                    ->where('store_id', $store->id)
                        ->where('branch_id', $validated['to_id'])
                        ->where('product_id',  $validated['product_id'])
                        ->get()->count();
                    $batch_code = 'L' . sprintf('%04d', $last_id + 1);


                    DB::table('product_batches')
                    ->insert([
                        'store_id' => $store->id,
                        'branch_id' => $validated['to_id'],
                        'product_id' =>  $validated['product_id'],
                        'quantity' => $batch['quantity'],
                        'expiry_date' => $batch['expiry_date'],
                        'batch_code' =>  $batch_code,
                        'position' => $batch['position']
                    ]);

                    $to_batches[] = [
                        'batch_code' => $batch_code,
                        'expiry_date' => $batch['expiry_date'],
                        'position' => $batch['position'],
                        'from_batch' => $batch['batch_code'],
                        'quantity' => $batch['quantity'],
                    ];
                }


                DB::table('transfer_inventory')
                    ->where('id', $id)
                    ->update(['to_batches' => json_encode($to_batches)]);
            }*/
            $transfer_inventory = TransferInventory::find($id);
            if (!$transfer_inventory->count()) {
                return response()->json([
                    'data' => null,
                    'success' => false,
                    'message' => 'Transfer Inventory was not existed'
                ]);
            }
            foreach($validated['products'] as $value) {
                TransferInventoryDetail::where('product_uuid', $value['product_uuid'])->update($value);

                $product = Product::whereUuid($value['product_uuid'])->first();

                // Calculate
                if ($validated['status'] === 'closed') {

                    BranchInventory::where('store_id', $store->id)
                        ->where('branch_id', $transfer_inventory['from_id'])
                        ->where('product_id', $product['id'])
                        ->decrement('quantity_available', $value['value_quantity']);

                    BranchInventory::where('store_id', $store->id)
                        ->where('branch_id', $transfer_inventory['to_id'])
                        ->where('product_id', $product['id'])
                        ->increment('quantity_available', $value['value_quantity']);
                }
            }

            $payload['status'] = $validated['status'];

            if ($validated['status'] === 'closed') {
                $payload['received_at'] = now();
            }

            $data = DB::table('transfer_inventory')
                ->where('id', $id)
                ->update($payload);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            //throw new Exception($e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'bad request',
            ], 400);
        }
        return response()->json([
            'data' => TransferInventory::with('transfer_detail')->where('id', $id)->first()
        ]);
    }

    public function destroy(Request $request, Store $store, $id)
    {
        $transfer_inventory = DB::table('transfer_inventory')->where('id', $id)->first();

        BranchInventory::where('store_id', $store->id)
            ->where('branch_id', $transfer_inventory['from_id'])
            ->where('product_id', $transfer_inventory['product_id'])
            ->increment('quantity_available', $transfer_inventory['quantity']);

        BranchInventory::where('store_id', $store->id)
            ->where('branch_id', $transfer_inventory['to_id'])
            ->where('product_id', $transfer_inventory['product_id'])
            ->decrement('quantity_available', $transfer_inventory['quantity']);

        $from_batches = json_decode($transfer_inventory['from_batches'], true);
        foreach ($from_batches as $batch) {
            DB::table('product_batches')
                ->where('store_id', $store->id)
                ->where('branch_id', $transfer_inventory['from_id'])
                ->where('product_id', $transfer_inventory['product_id'])
                ->where('batch_code', $batch['batch_code'])
                ->increment('quantity', $batch['quantity']);
        }

        $to_batches = json_decode($transfer_inventory['to_batches'], true);
        foreach ($to_batches as $batch) {
            DB::table('product_batches')
                ->where('store_id', $store->id)
                ->where('branch_id', $transfer_inventory['to_id'])
                ->where('product_id', $transfer_inventory['product_id'])
                ->where('batch_code', $batch['batch_code'])
                ->decrement('quantity', $batch['quantity']);
        }
        $transfer_inventory = DB::table('transfer_inventory')->where('id', $id)->delete();
    }
}
