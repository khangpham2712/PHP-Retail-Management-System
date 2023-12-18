<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInventoryChecksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inventory_checks', function (Blueprint $table) {
            $table->id();
            $table->string('uuid');
            $table->foreignId('created_by');
            $table->foreignId('approved_by')->nullable();
            $table->foreignId('store_id');
            $table->dateTime('approved_date')->nullable();
            $table->longText('notes')->nullable();
            $table->string('status');
            $table->foreignId('branch_id');
            $table->timestamps();
        });


        Schema::create('inventory_check_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_check_id');
            $table->foreignId('product_id');
            $table->foreignId('store_id');
            $table->foreignId('branch_id');
            $table->foreignId('inventory_transaction_id')->nullable();
            $table->double('quantity');
            $table->double('unit_cost');
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
        Schema::dropIfExists('inventory_checks');
    }
}
