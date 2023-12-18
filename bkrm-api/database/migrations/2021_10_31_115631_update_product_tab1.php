<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateProductTab1 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products', function(Blueprint $table) {
            $table->string('description')->nullable()->change();
            $table->string('product_code');
            $table->longText('attribute_value')->nullable();
            $table->bigInteger('max_order')->default(0);
            $table->integer('has_batches')->default(0);
            $table->integer('notification_period')->default(7);
            $table->longText('img_urls')->default('[]');
            $table->bigInteger('max_order')->default(0);
            $table->bigInteger('max_order')->default(0);
            $table->string('status')->default('active');
            $table->string('parent_product_code')->nullable();
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
