import React, { useDebugValue, useRef } from "react";
import { useStyles } from "./style";
import { useState } from "react";
import {
  useTheme,
  makeStyles,
  createStyles,
  withStyles,
} from "@material-ui/core/styles";
import {
  Typography,
  Divider,
  Badge,
  Dialog,
  IconButton,
  FormControlLabel,
  Grid,
  Switch,
  Popover,
  Paper,
  Box,
  TextField,
  Avatar,
  ButtonBase,
  InputAdornment,
  ButtonGroup,
  Button,
  Tooltip,
  TableContainer,
} from "@material-ui/core";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import EmployeeItemAva from "./EmployeeItem/EmployeeItemAva";
import Card from "@material-ui/core/Card";
import { grey } from "@material-ui/core/colors";

import AddIcon from "@material-ui/icons/Add";
import "date-fns";

import { formatDate, getMonday, calNextDay } from "./dateUtil";
import ScheduleHead from "./ScheduleHead/ScheduleHead";
import ScheduleToolBar from "./ScheduleToolBar/ScheduleToolBar";
import { HeadWeek, ShiftWeekBox } from "./ScheduleView/WeekView/WeekView";
import { HeadDay, ShiftDayBox } from "./ScheduleView/DayView/DayView";
import { HeadMonth, ShiftMonthBox } from "./ScheduleView/MonthView/MonthView";
import {
  HeadMonthPrint,
  ShiftMonthBoxPrint,
} from "./ScheduleView/MonthView/MonthViewPrint";
import scheduleApi from "../../../api/scheduleApi";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import AddShiftPopup from "./AddShiftPopup/AddShiftPopup";
import AddSchedulePopup from "./AddSchedulePopup/AddSchedulePopup";
import ScheduleDetail from "./ScheduleDetail/ScheduleDetail";
import { statusAction } from "../../../store/slice/statusSlice";
import { useReactToPrint } from "react-to-print";
const Schedule = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [addShiftOpen, setAddShiftOpen] = React.useState(false);
  const [addScheduleOpen, setAddScheduleOpen] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [selectedBtn, setSelectedBtn] = React.useState(1);

  const weekRef = useRef();
  const dayRef = useRef();
  const monthRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => {
      console.log(selectedBtn);
      return selectedBtn === 0
        ? dayRef.current
        : selectedBtn === 1
        ? weekRef.current
        : monthRef.current;
    },
  });
  // A. LOAD DATA from api
  // shiftInfo,schedule,...
  // load here ...........
  const [shiftInfo, setShiftInfo] = React.useState([]);
  // B. Xu ly sate
  //// 1. Tool bar
  // 1.1 choose branch

  // 1.2. Search employee

  //// 2. Schedule bar
  // 2.1 chosse date
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDateChange = (dayStr) => {
    setSelectedDate(dayStr);
    setAnchorEl(null);
  };

  // 2.2 choose mode day-week-month

  // api to get schedule
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;

  const fetchSchedule = async (selected_date) => {
    try {
      const response = await scheduleApi.getSchedule(
        store_uuid,
        branch_uuid,
        selected_date,
        mode
      );
      setShiftInfo(response.data);
      console.log(
        "🚀 ~ file: Schedule.js:115 ~ fetchSchedule ~ response.data:",
        response.data
      );
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    let selected_date = moment
      .unix(selectedDate.getTime() / 1000)
      .format("YYYY-MM-DD", { trim: false });
    let mode = "";
    switch (selectedBtn) {
      case 0:
        mode = "day";
        break;
      case 1:
        mode = "week";
        break;
      case 2:
        mode = "month";
        break;
    }

    fetchSchedule(selected_date);

    const intervalID = setInterval(() => {
      if (branch_uuid) {
        fetchSchedule(selected_date);
      }
    }, 60000 * 0.5);

    return () => {
      clearInterval(intervalID);
    };
  }, [selectedBtn, selectedDate, branch_uuid, reload]);

  const handleModeBtn = (mode) => {
    setSelectedBtn(mode);

    // re-load data
    // cai nay để tạm thôi
    // if (mode === 0){
    //     setShiftInfo(shiftInfoWeek) //Day
    // }else if (mode === 1){
    //     setShiftInfo(shiftInfoWeek) //Week
    // }else{
    //     setShiftInfo(shiftInfoMonth) //Week
    // }
  };

  // 2.3 onClickSchedule (shift- day)
  const [clickSchedule, setClickSchedule] = React.useState({});
  //popUpDetail
  const [open, setOpen] = React.useState(false);
  const handlePopUp = () => {
    setOpen(!open);
  };

  ////
  //mode
  const [mode, setMode] = React.useState(true);
  const handleChangeMode = (event) => {
    setMode(event.target.checked);
  };
  const [modeMonth, setModeMonth] = React.useState(true);
  const handleChangeModeMonth = (event) => {
    setModeMonth(event.target.checked);
  };
  const dispatch = useDispatch();

  const handleSubmitSchedule = async (schedules) => {
    try {
      const response = await scheduleApi.checkAttendance(
        store_uuid,
        branch_uuid,
        schedules
      );

      dispatch(statusAction.successfulStatus("Chấm công thành công"));
      setReload(!reload);
      setOpen(false);
    } catch (err) {
      console.log(err);
      dispatch(statusAction.failedStatus("Chấm công thất bại"));
    }
  };

  return (
    <Card className={classes.root}>
      {/* 1. search + choose branch */}
      <ScheduleHead handlePrint={handlePrint} />

      {addShiftOpen && (
        <AddShiftPopup
          addShiftOpen={addShiftOpen}
          handleClose={() => setAddShiftOpen(false)}
          reload={() => setReload(!reload)}
        />
      )}
      {addScheduleOpen && (
        <AddSchedulePopup
          addScheduleOpen={addScheduleOpen}
          handleClose={() => setAddScheduleOpen(false)}
          reload={() => setReload(!reload)}
        />
      )}

      <Divider className={classes.divider} />

      {/* 2. choose mode + choose date + add schedule */}
      <ScheduleToolBar
        openAddSchedule={() => setAddScheduleOpen(true)}
        selectedBtn={selectedBtn}
        handleModeBtn={handleModeBtn}
        setSelectedBtn={setSelectedBtn}
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
      />
      {(() => {
        // eslint-disable-next-line default-case
        switch (selectedBtn) {
          case 0:
            return (
              <>
                <>
                  <HeadDay
                    selectedDate={selectedDate}
                    openAddShift={() => setAddShiftOpen(true)}
                  />
                  {shiftInfo.map((shift) => {
                    return (
                      // !!!! shift with schedultList have only Select Date
                      <ShiftDayBox
                        selectedDate={selectedDate}
                        shift={shift}
                        handlePopUp={handlePopUp}
                        setClickSchedule={setClickSchedule}
                        mode={mode}
                      />
                    );
                  })}
                </>

                <FormControlLabel
                  control={
                    <Switch checked={mode} onChange={handleChangeMode} />
                  }
                  className={classes.mode}
                />
              </>
            );
          case 1: //WEEK VIEW
            return (
              <>
                <TableContainer>
                  <HeadWeek
                    selectedDate={selectedDate}
                    openAddShift={() => setAddShiftOpen(true)}
                  />
                  {shiftInfo.map((shift) => {
                    return (
                      <ShiftWeekBox
                        selectedDate={selectedDate}
                        shift={shift}
                        handlePopUp={handlePopUp}
                        setClickSchedule={setClickSchedule}
                        mode={mode}
                        reload={() => setReload(!reload)}
                      />
                    );
                  })}
                </TableContainer>
                <FormControlLabel
                  control={
                    <Switch checked={mode} onChange={handleChangeMode} />
                  }
                  className={classes.mode}
                />
              </>
            );
          case 2:
            return (
              <>
                <TableContainer>
                  <HeadMonth
                    selectedDate={selectedDate}
                    openAddShift={() => setAddShiftOpen(true)}
                  />
                  {shiftInfo.map((shift) => {
                    return (
                      <ShiftMonthBox
                        selectedDate={selectedDate}
                        shift={shift}
                        modeMonth={modeMonth}
                      />
                    );
                  })}
                </TableContainer>
                <FormControlLabel
                  control={
                    <Switch
                      checked={modeMonth}
                      onChange={handleChangeModeMonth}
                    />
                  }
                  className={classes.mode}
                />
              </>
            );
        }
      })()}

      <ScheduleDetail
        open={open}
        handlePopUp={handlePopUp}
        clickSchedule={clickSchedule}
        handleSubmit={handleSubmitSchedule}
      />

      {/* week */}
      <div style={{ display: "none" }}>
        <div ref={weekRef}>
          <TableWeekPrint
            shiftInfo={shiftInfo}
            selectedDate={selectedDate}
            setAddShiftOpen={setAddShiftOpen}
            handlePopUp={handlePopUp}
            setClickSchedule={setClickSchedule}
            mode={mode}
            selectedBtn={selectedBtn}
          />
        </div>
      </div>

      {/* day */}
      <div style={{ display: "none" }}>
        <div ref={dayRef}>
          <TableDayPrint
            shiftInfo={shiftInfo}
            selectedDate={selectedDate}
            setAddShiftOpen={setAddShiftOpen}
            handlePopUp={handlePopUp}
            setClickSchedule={setClickSchedule}
            mode={mode}
            selectedBtn={selectedBtn}
          />
        </div>

        {/* month */}
        <div style={{ display: "none" }}>
          <div ref={monthRef}>
            <TableMonthPrint
              shiftInfo={shiftInfo}
              selectedDate={selectedDate}
              setAddShiftOpen={setAddShiftOpen}
              handlePopUp={handlePopUp}
              setClickSchedule={setClickSchedule}
              mode={mode}
              selectedBtn={selectedBtn}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Schedule;

const TableWeekPrint = ({
  shiftInfo,
  selectedDate,
  setAddShiftOpen,
  handlePopUp,
  setClickSchedule,
  mode,
  selectedBtn,
}) => {
  return (
    <div style={{ padding: 10 }}>
      <Typography style={{ color: "#000" }}>
        Ngày in: {moment(new Date()).format("DD/MM/YYYY HH:mm")}
      </Typography>
      <Box
        style={{ margin: 10, flexGrow: 1, textAlign: "center", color: "#000" }}
      >
        <Typography style={{ fontSize: 18, fontWeight: 600 }}>
          Ca làm việc theo tuần - {formatDate(selectedBtn, selectedDate)}
        </Typography>
      </Box>
      <div>
        <TableContainer style={{ width: 1226 }}>
          <HeadWeek
            selectedDate={selectedDate}
            openAddShift={() => setAddShiftOpen(true)}
          />
          {shiftInfo.map((shift) => {
            return (
              <ShiftWeekBox
                selectedDate={selectedDate}
                shift={shift}
                handlePopUp={handlePopUp}
                setClickSchedule={setClickSchedule}
                mode={mode}
              />
            );
          })}
        </TableContainer>
      </div>
    </div>
  );
};

const TableDayPrint = ({
  selectedDate,
  handlePopUp,
  setClickSchedule,
  mode,
  shiftInfo,
  setAddShiftOpen,
  selectedBtn,
}) => {
  return (
    <div style={{ padding: 10 }}>
      <Typography style={{ color: "#000" }}>
        Ngày in: {moment(new Date()).format("DD/MM/YYYY HH:mm")}
      </Typography>
      <Box
        style={{ margin: 10, flexGrow: 1, textAlign: "center", color: "#000" }}
      >
        <Typography style={{ fontSize: 18, fontWeight: 600 }}>
          Ca làm việc theo ngày - {formatDate(selectedBtn, selectedDate)}
        </Typography>
      </Box>
      <div>
        <HeadDay
          selectedDate={selectedDate}
          openAddShift={() => setAddShiftOpen(true)}
        />
        {shiftInfo.map((shift) => {
          return (
            // !!!! shift with schedultList have only Select Date
            <ShiftDayBox
              selectedDate={selectedDate}
              shift={shift}
              handlePopUp={handlePopUp}
              setClickSchedule={setClickSchedule}
              mode={mode}
            />
          );
        })}
      </div>
    </div>
  );
};

const TableMonthPrint = ({
  selectedDate,
  mode,
  shiftInfo,
  setAddShiftOpen,
  selectedBtn,
}) => {
  return (
    <div style={{ padding: 10 }}>
      <Typography style={{ color: "#000" }}>
        Ngày in: {moment(new Date()).format("DD/MM/YYYY HH:mm")}
      </Typography>
      <Box
        style={{ margin: 10, flexGrow: 1, textAlign: "center", color: "#000" }}
      >
        <Typography style={{ fontSize: 18, fontWeight: 600 }}>
          Ca làm việc theo ngày - {formatDate(selectedBtn, selectedDate)}
        </Typography>
      </Box>
      <div>
        <TableContainer>
          <div>
            <HeadMonthPrint
              selectedDate={selectedDate}
              openAddShift={() => setAddShiftOpen(true)}
              first
            />
            {shiftInfo.map((shift) => {
              return (
                <ShiftMonthBoxPrint
                  selectedDate={selectedDate}
                  shift={shift}
                  modeMonth={mode}
                  printFirstHalf={true}
                  first
                />
              );
            })}
          </div>
          <div style={{ marginTop: 10 }}>
            <HeadMonthPrint
              selectedDate={selectedDate}
              openAddShift={() => setAddShiftOpen(true)}
              second
            />
            {shiftInfo.map((shift) => {
              return (
                <ShiftMonthBoxPrint
                  selectedDate={selectedDate}
                  shift={shift}
                  modeMonth={mode}
                  printFirstHalf={true}
                  second
                />
              );
            })}
          </div>
          <div style={{ marginTop: 10 }}>
            <HeadMonthPrint
              selectedDate={selectedDate}
              openAddShift={() => setAddShiftOpen(true)}
            />
            {shiftInfo.map((shift) => {
              return (
                <ShiftMonthBoxPrint
                  selectedDate={selectedDate}
                  shift={shift}
                  modeMonth={mode}
                  printFirstHalf={true}
                />
              );
            })}
          </div>
        </TableContainer>
      </div>
    </div>
  );
};
