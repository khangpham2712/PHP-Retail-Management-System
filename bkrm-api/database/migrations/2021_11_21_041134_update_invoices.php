<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateInvoices extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('uuid');
            $table->foreignId('order_id');
            $table->foreignId('store_id');
            $table->dateTime('due_date');
            $table->string('tax');
            $table->string('shipping');
            $table->string('amount_due');
            $table->string('invoice_code');
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
        //
    }
}
