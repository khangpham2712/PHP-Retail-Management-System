import { currentDate } from "../utils";
import axiosClient from "./axiosClient";

const scheduleApi = {
  createSchedule: (storeUuid, branchUuid, body) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/createSchedule`;
    return axiosClient.post(url, body);
  },

  createShift: (storeUuid, branchUuid, body) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/createShift`;
    return axiosClient.post(url, body);
  },

  deleteShift: (storeUuid, branchUuid, shiftId) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/deleteShift/${shiftId}`;
    return axiosClient.delete(url);
  },

  updateShift: (storeUuid, branchUuid, shiftId, body) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/updateShift/${shiftId}`;
    return axiosClient.post(url, body);
  },

  getSchedule: (storeUuid, branchUuid, selectedDate, mode) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/getSchedule`;
    return axiosClient.get(url, {
      params: {
        selected_date: selectedDate,
        mode: mode,
      },
    });
  },
  // this is support for assign schedule for employee pop up
  getEmpAndShiftOfBranch: (storeUuid, branchUuid) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/getEmpAndShiftOfBranch`;
    return axiosClient.get(url, {});
  },

  checkAttendance: (storeUuid, branchUuid, schedule) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/checkAttendance`;
    return axiosClient.post(url, {
      data: schedule.map((s) => ({
        ...s,
        timecheck: s.timecheck ? s.timecheck : currentDate(),
      })),
    });
  },
  checkAttendanceQR: (storeUuid, branchUuid, employeeId) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/checkAttendanceQR`;
    return axiosClient.post(url, {
      employeeId: employeeId,
      time: currentDate().substring(11),
      date: currentDate().substring(0, 10),
    });
  },
};
export default scheduleApi;
