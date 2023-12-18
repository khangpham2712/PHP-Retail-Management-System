<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Store;
use App\Models\Branch;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index(Request $request, Store $store, Branch $branch)
    {
        return response()->json([
            'data' => $branch->invoices
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Store $store, Branch $branch)
    {
        $validated = $request->validate([
            'order_id' => "required|numeric",
            'due_date' => "required|date_format:Y-m-d",
            'tax' => "required|numeric",
            'shipping' => 'required|numeric',
            'amount_due' => 'required|numeric',
            'discount' => 'required|numeric',
        ]);

        $invoice = array_merge($validated, [
            'store_id' => $store->id,
            'branch_id' => $branch->id
        ]);
        
        $newInvoice = Invoice::create($invoice);

        return response()->json([
            'message' => 'Invoice created',
            'data' => $newInvoice,
        ], 200);
    }

    public function show(Store $store, Branch $branch, Invoice $invoice)
    {
        return response()->json([
            'data' => $invoice,
        ], 200);
    }

    public function update(Request $request, Store $store, Branch $branch, Invoice $invoice)
    {
        $validated = $request->validate([
            'due_date' => "nullable|date_format:Y-m-d",
            'tax' => "nullable|numeric",
            'shipping' => 'nullable|numeric',
            'amount_due' => 'nullable|numeric',
            'discount' => 'nullable|numeric',
        ]);

        $invoice->update($validated);

        return response()->json([
            'message' => 'Invoice updated',
            'data' => $invoice,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Invoice  $invoice
     * @return \Illuminate\Http\Response
     */
    public function destroy(Store $store, Branch $branch, Invoice $invoice)
    {
        $isDeleted = Invoice::destroy($invoice->id);
        return response()->json([
            'message'=> $isDeleted,
            'data' => $invoice
        ], 200);
    }
}
