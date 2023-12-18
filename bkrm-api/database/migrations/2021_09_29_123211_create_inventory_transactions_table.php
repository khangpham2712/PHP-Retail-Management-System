<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInventoryTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inventory_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('uuid');
            $table->foreignId('store_id');
            $table->foreignId('product_id');
            $table->foreignId('purchase_order_id')->nullable();
            $table->foreignId('purchase_return_id')->nullable();
            $table->foreignId('order_id')->nullable();
            $table->foreignId('refund_id')->nullable();
            $table->bigInteger('quantity');
            $table->foreignId('branch_id');
            $table->string('transaction_type');
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
        Schema::dropIfExists('inventory_transactions');
    }
}
