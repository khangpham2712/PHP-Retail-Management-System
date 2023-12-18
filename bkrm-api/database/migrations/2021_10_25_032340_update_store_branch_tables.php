<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateStoreBranchTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->string('province')->nullable()->change();
            $table->string('district')->nullable();
            $table->dropColumn('city');
        });

        Schema::table('branches', function (Blueprint $table) {
            $table->string('province')->nullable()->change();
            $table->string('district')->nullable();
            $table->dropColumn('city');
        });
    }

    public function down()
    {
        //
    }
}
