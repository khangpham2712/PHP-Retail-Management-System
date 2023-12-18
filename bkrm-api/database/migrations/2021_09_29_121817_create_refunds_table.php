<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRefundsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('refunds', function (Blueprint $table) {
            $table->id();
            $table->string('uuid');
            $table->foreignId('user_id');
            $table->foreignId('customer_id');
            $table->foreignId('order_id');
            $table->foreignId('invoice_id');
            $table->string('payment_type');
            $table->longText('notes')->nullable();
            $table->foreignId('store_id');
            $table->foreignId('branch_id');
            $table->timestamps();
        });


        Schema::create('refund_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('refund_id');
            $table->foreignId('product_id');
            $table->foreignId('inventory_transaction_id')->nullable();
            $table->double('quantity');
            $table->double('unit_price');
            $table->string('reason')->nullable();
            $table->foreignId('store_id');
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
        Schema::dropIfExists('refunds');
        Schema::dropIfExists('refund_details');
    }
}
