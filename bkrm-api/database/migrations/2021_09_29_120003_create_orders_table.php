<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('uuid');
            $table->foreignId('user_id');
            $table->foreignId('customer_id');
            $table->foreignId('store_id');
            $table->string('payment_type')->nullable();
            $table->dateTime('paid_date')->nullable();
            $table->string('status');
            $table->foreignId('branch_id');
            $table->longText('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('order_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id');
            $table->foreignId('product_id');
            $table->foreignId('store_id');
            $table->foreignId('inventory_transaction_id')->nullable();
            $table->double('quantity');
            $table->double('unit_price');
            $table->string('status');
            $table->double('discount');
            $table->foreignId('branch_id');
            $table->timestamps();
        });

        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('uuid');
            $table->foreignId('order_id');
            $table->foreignId('store_id');
            $table->dateTime('due_date');
            $table->double('tax');
            $table->double('shipping');
            $table->double('amount_due');
            $table->double('discount');
            $table->foreignId('branch_id');
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
        Schema::dropIfExists('orders');
        Schema::dropIfExists('order_details');
        Schema::dropIfExists('invoices');
    }
}
