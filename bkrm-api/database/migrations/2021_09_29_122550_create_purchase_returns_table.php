<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePurchaseReturnsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('purchase_returns', function (Blueprint $table) {
            $table->id();
            $table->string('uuid');
            $table->foreignId('supplier_id');
            $table->foreignId('created_by');
            $table->foreignId('approved_by')->nullable();
            $table->foreignId('store_id');
            $table->dateTime('creation_date');
            $table->dateTime('approved_date')->nullable();
            $table->double('return_amount')->nullable();
            $table->string('payment_type')->nullable();
            $table->longText('notes')->nullable();
            $table->foreignId('branch_id');
            $table->timestamps();
        });


        Schema::create('purchase_return_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_return_id');
            $table->foreignId('product_id');
            $table->foreignId('store_id');
            $table->foreignId('inventory_transaction_id')->nullable();
            $table->double('quantity');
            $table->foreignId('branch_id');
            $table->double('unit_price');
            $table->boolean('removed_from_inventory');
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
        Schema::dropIfExists('purchase_returns');
        Schema::dropIfExists('purchase_return_details');
    }
}
