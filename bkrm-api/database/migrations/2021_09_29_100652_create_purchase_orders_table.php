<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePurchaseOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->string('uuid');
            $table->foreignId('supplier_id');
            $table->foreignId('created_by');
            $table->foreignId('approved_by')->nullable();
            $table->foreignId('store_id');
            $table->dateTime('creation_date');
            $table->dateTime('approved_date')->nullable();
            $table->dateTime('payment_date')->nullable();
            $table->bigInteger('payment_amount')->nullable();
            $table->bigInteger('taxes');
            $table->string('payment_method')->nullable();
            $table->longText('notes')->nullable();
            $table->string('status');
            $table->foreignId('branch_id');
            $table->timestamps();
        });


        Schema::create('purchase_order_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_order_id');
            $table->foreignId('product_id');
            $table->foreignId('store_id');
            $table->foreignId('branch_id');
            $table->foreignId('inventory_transaction_id')->nullable();
            $table->double('quantity');
            $table->double('unit_cost');
            $table->dateTime('date_received')->nullable();
            $table->string('status');
            $table->boolean('posted_to_inventory');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('purchase_orders');
        Schema::dropIfExists('purchase_order_details');
    }
}
