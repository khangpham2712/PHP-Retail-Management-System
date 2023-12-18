<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStoresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->string('uuid');
            $table->string('name')->unique();
            $table->unsignedBigInteger('user_id')->unique();

            $table->string('address');
            $table->string('ward');
            $table->string('city');
            $table->string('province');
            $table->string('district');
            $table->longtext('general_configuration');
            $table->string('phone')->nullable();
            $table->string('status');
            $table->string('image');

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
        Schema::dropIfExists('stores');
    }
}
