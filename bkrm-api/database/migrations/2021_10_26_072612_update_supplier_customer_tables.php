<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateSupplierCustomerTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('suppliers', function(Blueprint $table) {
            $table->string('phone')->nullable()->change();
            $table->string('company')->nullable()->change();
            $table->string('name')->nullable(false)->change();
        });

        Schema::table('customers', function(Blueprint $table) {
            $table->string('name');
            $table->string('uuid');
            $table->string('store_id');
            $table->string('phone')->nullable();
            $table->string('payment_info')->nullable();
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
