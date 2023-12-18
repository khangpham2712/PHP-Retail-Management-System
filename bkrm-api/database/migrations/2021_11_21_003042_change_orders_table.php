<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if ( !Schema::hasColumn('orders', 'payment_method') ) {

            Schema::table('orders', function (Blueprint $table) {
                $table->dropColumn('payment_type');
                $table->string('payment_method');
                $table->bigInteger('total_amount');
                $table->bigInteger('paid_amount');
                //missed many columns, need to check in db
                $table->bigInteger('discount');
                $table->string('shipping');
                $table->dateTime('creation_date');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('payment_type')->nullable();
            $table->dropColumn('payment_method');
            $table->dropColumn('total_amount');
            $table->dropColumn('paid_amount');
            $table->dropColumn('discount');
            $table->dropColumn('shipping');
            $table->dropColumn('creation_date');
        });
    }
}
