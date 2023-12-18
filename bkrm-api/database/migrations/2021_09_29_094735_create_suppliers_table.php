<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSuppliersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('uuid');
            $table->string('company');
            $table->string('name')->nullable();
            $table->string('type')->nullable();
            $table->string('email')->nullable();
            $table->string('job_title')->nullable();
            $table->string('phone');
            $table->string('address')->nullable();
            $table->string('ward')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('payment_info')->nullable();
            $table->foreignId('store_id');
            $table->timestamps();
        });


        Schema::create('product_suppliers', function (Blueprint $table) {
            $table->foreignId('product_id');
            $table->foreignId('supplier_id');
            $table->foreignId('store_id');
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
        Schema::dropIfExists('suppliers');
        Schema::dropIfExists('product_suppliers');
    }
}
