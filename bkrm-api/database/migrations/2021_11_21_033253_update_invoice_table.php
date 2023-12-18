<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateInvoiceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('invoices', function(Blueprint $table) {
            $table->dropColumn('shipping');
            $table->dropColumn('amount_due');
            $table->dropColumn('discount');
            $table->dropColumn('tax');
            // $table->string('shipping');
            // $table->string('amount_due');
            // $table->string('discount');
            // $table->string('tax');
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
