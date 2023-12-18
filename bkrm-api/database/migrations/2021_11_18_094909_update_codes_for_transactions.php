<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateCodesForTransactions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasColumn('purchase_orders', 'purchase_order_code')) {
            // The "users" table exists and has an "email" column...
            Schema::table('purchase_orders', function(Blueprint $table) {
                $table->string('purchase_order_code');
            });
            Schema::table('orders', function(Blueprint $table) {
                $table->string('order_code');
            });
            Schema::table('purchase_returns', function(Blueprint $table) {
                $table->string('purchase_return_code');
            });
            Schema::table('refunds', function(Blueprint $table) {
                $table->string('refund_code');
            });
            Schema::table('inventory_transactions', function(Blueprint $table) {
                $table->dropColumn('purchase_order_id');
                $table->dropColumn('order_id');
                $table->dropColumn('refund_id');
                $table->dropColumn('purchase_return_id');
                $table->bigInteger('document_id');
                $table->integer('document_type');
            });
    
            Schema::create('inventory_document_types', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->timestamps();
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
        //
    }
}
