<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateCustomer extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('customers', function(Blueprint $table) {
            $table->string('phone')->nullable();
            $table->string('supplier_code');
            $table->string('payment_info')->nullable();
            $table->string('status')->default('active');
            $table->string('address')->nullable();
            $table->string('ward')->nullable();
            $table->string('city')->nullable();
            $table->bigInteger('points')->default(0);
            $table->longText('vouchers')->default('[]');
            $table->string('district')->nullable();
            $table->string('img_url')->default('customer-images/customer-default.png');
            $table->string('province')->nullable();
            $table->string('customer_code')->default('KH000000');
            $table->string('email')->nullable();
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
