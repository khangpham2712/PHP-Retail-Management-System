<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmployeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('uuid');
            $table->foreignId('store_id');
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('phone')->unique();
            $table->string('date_of_birth');
            $table->string('status');
            $table->string('gender');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('priviledges', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });

        Schema::create('employee_priviledges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id');
            $table->foreignId('priviledge');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employees');
        Schema::dropIfExists('priviledges');
        Schema::dropIfExists('employee_priviledges');
    }
}
