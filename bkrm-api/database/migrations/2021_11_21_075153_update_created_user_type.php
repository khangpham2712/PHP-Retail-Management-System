<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateCreatedUserType extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('purchase_orders', function(Blueprint $table) {
            $table->string('created_user_type');
        });
        Schema::table('orders', function(Blueprint $table) {
            $table->string('created_user_type');
        });
        Schema::table('purchase_returns', function(Blueprint $table) {
            $table->string('created_user_type');
        });
        Schema::table('refunds', function(Blueprint $table) {
            $table->string('created_user_type');
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
