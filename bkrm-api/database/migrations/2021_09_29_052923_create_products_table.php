<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('uuid');
            $table->string('name');
            $table->double('list_price');
            $table->double('standard_price');
            $table->string('bar_code')->nullable();
            $table->string('quantity_per_unit')->nullable();
            $table->foreignId('store_id');
            $table->string('image');
            $table->foreignId('category_id');
            $table->bigInteger('min_reorder_quantity');
        
            $table->timestamps();
        });

        Schema::create('product_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id');
            $table->double('price');
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->foreignId('created_by');
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
        Schema::dropIfExists('products');
        Schema::dropIfExists('product_prices');
        
    }
}
