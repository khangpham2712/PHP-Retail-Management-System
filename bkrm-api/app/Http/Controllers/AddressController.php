<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function getProvinces() {
        $provinces = DB::table('province')
            ->get();

        $districts = DB::table('district')->get();

        $wards = DB::table('ward')->get();

        return response()->json([
            'provinces' => $provinces,
            'districts' => $districts,
            'wards' => $wards,
        ], 200);
    }

    public function getDistricts($province) {
        $districts = DB::table('district')
                    ->where('province_id', $province)->get();
        return response()->json([
            'data'=> $districts
        ], 200);
    }

    public function getWards($province, $district) {
        $wards = DB::table('ward')
                    ->where('district_id', $district)->get();
        return response()->json([
            'data'=> $wards
        ], 200);
    }
}
