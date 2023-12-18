<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Shift;
use App\Models\Store;
use App\Models\Branch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use DateTime;
use DatePeriod;
use DateInterval;

class ScheduleController extends Controller
{
    public function createShift(Request $request, Store $store, Branch $branch)
    {
        $validated = $request->validate([
            "name" => "required|string",
            "start_time" => "required|date_format:H:i",
            "end_time" => "required|date_format:H:i",
        ]);

        $success = DB::table('shifts')->insert(
            [
                "name" => $validated["name"],
                "start_time" => $validated["start_time"],
                "end_time" => $validated["end_time"],
                "branch_id" => $branch->id,
                "store_id" => $store->id,
            ]
        );

        if ($success) {
            return response()->json([
                "message" => "Shift created",
                "status" => "success"
            ], 200);
        } else {
            return response()->json([
                "message" => "Shift is not created",
                "status" => "failure"
            ], 200);
        }
    }

    public function updateShift(Request $request, Store $store, Branch $branch, $id)
    {
        
        $validated = $request->validate([
            "id" => "required",
            "name" => "nullable|string",
            "start_time" => "nullable|date_format:H:i:s",
            "end_time" => "nullable|date_format:H:i:s",
            "timecheck" => "nullable|date_format:H:i:s",
        ]);
        $data = [
            "name" => $validated["name"] ?? null,
            "start_time" => $validated["start_time"] ?? null,
            "end_time" => $validated["end_time"] ?? null,
            "timecheck" => $validated["timecheck"] ?? null,
        ];
        $data = array_filter($data);
       
        $success = DB::table('shifts')->where('id', $id)->update($data);

        if ($success) {
            return response()->json([
                "message" => "Shift updated",
                "status" => "success"
            ], 200);
        } else {
            return response()->json([
                "message" => "Shift is not updated",
                "status" => "failure"
            ], 200);
        }
    }

    public function deleteShift(Store $store, Branch $branch, $id)
    {
        try {
            DB::beginTransaction();
            Schedule::where('shift_id', $id)->delete();
            Shift::where('id', $id)->delete();
            DB::commit();
            return response()->json([
                "message" => "Shift deleted",
                "status" => "success"
            ], 200);
        } catch (\Exception $e) {
            \Log::error($e);
            DB::rollBack();
            return response()->json([
                "message" => "Shift delete failed",
                "status" => "failure"
            ], 200);
        }
    }

    public function createSchedule(Request $request, Store $store, Branch $branch)
    {
        $validated = $request->validate([
            "employee_id" => "required|numeric",
            "shift_id" => "required|numeric",
            "start_date" => "required|date_format:Y-m-d",
            "end_date" => "required|date_format:Y-m-d",
            "week_day" => "required|string",
        ]);

        // 0 -> 6: Sun Mon -> ...
        $date_list = [];
        $week_day = explode(",", $validated['week_day']);

        // get all Week days date in the period
        foreach ($week_day as $day) {
            $date_list = array_merge($date_list, $this->getDateForSpecificDayBetweenDates($validated["start_date"], $validated["end_date"], $day));
        }

        // sort date
        usort($date_list, function ($time1, $time2) {
            if (strtotime($time1) > strtotime($time2))
                return 1;
            else if (strtotime($time1) > strtotime($time2))
                return -1;
            else
                return 0;
        });


        $schedules = [];

        foreach ($date_list as $date) {
            array_push($schedules, [
                'employee_id' => $validated['employee_id'],
                'shift_id' => $validated['shift_id'],
                'date' => $date,
                'status' => 0,
                'branch_id' => $branch->id,
                'store_id' => $store->id,
            ]);
        }

        $success = DB::table('schedules')->insert($schedules);

        return response()->json([
            'message' => $success,
            'data' => $schedules
        ], 200);
    }


    public function getSchedule(Request $request, Store $store, Branch $branch)
    {
        $shifts = $branch->shifts;

        $selected_date = $request->query('selected_date');

        $mode = $request->query('mode');

        $from_date = $to_date = '';

        if ($mode === "day") {
            $from_date = $to_date = $selected_date;
        } else if ($mode === "month") {
            $from_date = date('Y-m-01', strtotime($selected_date));
            $to_date = date('Y-m-t', strtotime($selected_date));
        } else {
            $from_date = date("Y-m-d", strtotime('monday this week', strtotime($selected_date)));
            $to_date = date("Y-m-d", strtotime('sunday this week', strtotime($selected_date)));
        }

        $data = [];
        foreach ($shifts as $shift) {

            $schedules = $shift->schedules()
                ->where('schedules.date', '>=', $from_date)
                ->where('schedules.date', '<=', $to_date)
                ->join('employees', 'employees.id', '=', 'schedules.employee_id')
                ->select('schedules.*', 'employees.name as employee_name', 'employees.img_url as employee_img_url', 'employees.phone as employee_phone')
                ->get()->toArray();

            $schedules = array_map(function ($v) {
                return [
                    'employee_id' => $v['employee_id'],
                    'employee_name' => $v['employee_name'],
                    'status' => $v['status'],
                    'date' => date("d/m/Y", strtotime($v['date'])),
                    'employee_img_url' => $v['employee_img_url'],
                    'employee_phone' => $v['employee_phone'],
                    'schedule_id' => $v['id'],
                    'timecheck' => $v['timecheck'] ?? null
                ];
            }, $schedules);

            array_push($data, array_merge(
                $shift->toArray(),
                ['schedules' => $schedules]
            ));
        }

        return response()->json([
            'data' => $data,
            'mode' => $mode,
            'selected_date' => $selected_date,
        ]);
    }

    // this is used for booking a shift for an employee form
    public function getEmpAndShiftOfBranch(Request $request, Store $store, Branch $branch)
    {
        $shifts = $branch->shifts;
        $employees = DB::table('employee_work_branch')
            ->where('employee_work_branch.branch_id', $branch->id)
            ->leftJoin('employees', 'employees.id', '=', 'employee_work_branch.employee_id')
            ->where('employees.status', 'active')
            ->get();

        return response()->json([
            'data' => [
                'shifts' => $shifts,
                'employees' => $employees,
            ]
        ]);
    }

    private function getDateForSpecificDayBetweenDates($startDate, $endDate, $day_number)
    {
        $endDate = strtotime($endDate);
        $days = array('1' => 'Monday', '2' => 'Tuesday', '3' => 'Wednesday', '4' => 'Thursday', '5' => 'Friday', '6' => 'Saturday', '0' => 'Sunday');
        for ($i = strtotime($days[$day_number], strtotime($startDate)); $i <= $endDate; $i = strtotime('+1 week', $i))
            $date_array[] = date('Y-m-d', $i);

        return $date_array;
    }


    public function checkAttendance(Request $request, Store $store, Branch $branch)
    {
        $validated = $request->validate([
            "data" => "required|array"
        ]);

        foreach ($validated["data"] as $schedule) {
            if ($schedule['status']) {
                $updated = ['timecheck' => $schedule['timecheck'] ?? null, 'status' => $schedule['status']];
            } else {
                $updated = ['status' => $schedule['status'], 'timecheck' => null];
            }
            DB::table('schedules')->where('id', $schedule['schedule_id'])
                ->update($updated);
        }

        return response()->json([
            'message' => 'updated schedule'
        ]);
    }

    public function checkAttendanceQR(Request $request, Store $store, Branch $branch)
    {
        $validated = $request->validate([
            "employeeId" => "required|string",
            "time" => "required",
            "date" => "required"
        ]);

        $employee_id = DB::table("employees")->where('uuid', $validated["employeeId"])->first()->id;
        $scheduleFirst = DB::table("schedules")
            ->where("employee_id", $employee_id)
            ->where("date", $validated["date"])->get();

        if (count($scheduleFirst) === 0) {
            return response()->json([
                'message' => 'Bạn không có ca làm việc hôm nay, hãy liên hệ với chủ cửa hàng'
            ]);
        }

        $schedules = DB::table("schedules")
            // ->leftJoin('shifts', 'schedules.shift_id', '=', 'shifts.id')
            ->where("employee_id", $employee_id)
            ->where("date", $validated["date"])->get()->toArray();

        $data = [];

        foreach ($schedules as $schedule) {
            $shift = DB::table('shifts')->where('id', $schedule->shift_id)->get()[0];
            $cur = new DateTime($validated["date"] . " " . $validated['time']);
            $start = new DateTime($validated["date"] . " " . $shift->start_time);
            $end = new DateTime($validated["date"] . " " . $shift->end_time);
            if ($cur >= $start && $cur <= $end) {
                DB::table("schedules")->where('id', $schedule->id)->update(['status' => 1, 'timecheck' => $validated["date"] . " " . $validated['time']]);
                array_push($data, array_merge((array)$schedule, ['shift_name' => $shift->name, 'start_time' => $shift->start_time, 'end_time' => $shift->end_time]));
            }
        }
        if (count($data)) {
            return response()->json([
                'message' => 'Điểm danh thành công',
                'data' => $data,
            ]);
        } else {
            return response()->json([
                'message' => 'Điểm danh thất bại vì không có lịch làm việc'
            ]);
        }

        response()->json([
            'message'
        ], 200);
    }
}
