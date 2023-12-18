import React from 'react'
import { useState } from "react";
import {useTheme, makeStyles,createStyles,withStyles} from "@material-ui/core/styles";
import {Typography,Divider,Badge,IconButton,Grid,Popover,Paper,Box,TextField,Avatar,ButtonBase,InputAdornment,ButtonGroup,Button,Tooltip, TableContainer} from '@material-ui/core';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import EmployeeItemAva from '../../EmployeeItem/EmployeeItemAva'
import { grey} from '@material-ui/core/colors'
import {formatDate,getMonday,calNextDay,formatDDMMYYY, isToday} from '../../dateUtil'
import { useStyles } from '../../style';
import AddIcon from '@material-ui/icons/Add';
import clsx from 'clsx'
import scheduleApi from "../../../../../api/scheduleApi";
import { useSelector } from "react-redux";
import ModifyShitPopup from "../../ModifyShiftPopup/ModifyShiftPopup";
const HeadWeekBox = ({ date, _day, now }) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  var day = _day.getDate();
  return (
    <Box
      className={classes.center}
      border={1}
      borderLeft={0}
      style={{
        borderColor: grey[300],
        height: 55,
        minWidth: 152,
        background: isToday(_day) ? theme.customization.primaryColor[50] : null,
      }}
    >
      <Typography
        variant="body2"
        style={{ fontSize: 12, marginTop: 5, marginBottom: -3 }}
      >
        {date}
      </Typography>
      <Typography
        variant="h3"
        style={{
          color: grey[700],
          fontWeight: 600,
          fontSize: 25,
          marginRight: day < 10 ? 7 : 0,
          marginLeft: day < 10 ? 7 : 0,
        }}
      >
        {day}
      </Typography>
    </Box>
  );
};

export const HeadWeek = ({ selectedDate, openAddShift }) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const now = new Date();
  return (
    <Grid style={{ minWidth: 1226 }}>
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box
          border={1}
          style={{
            borderColor: grey[300],
            height: 44,
            minWidth: 150,
            height: 55,
          }}
        >
          <Grid container direction="row" alignItems="center">
            <Typography
              variant="h4"
              style={{ fontSize: 16, marginLeft: 5, marginTop: 10 }}
            >
              Ca làm việc
            </Typography>
            <ButtonBase
              onClick={openAddShift}
              className={classes.addBtn}
              style={{ marginTop: 10, marginLeft: 25, marginRight: 10 }}
            >
              <Tooltip title="Thêm ca">
                <AddIcon size="small" className={classes.addShiftIcon} />
              </Tooltip>
            </ButtonBase>
          </Grid>
        </Box>
        {/* <HeadWeekBox date='Mon' day={calNextDay(0,selectedDate).getDate() } now={now.getDate()}/>
                <HeadWeekBox date='Tue' day={calNextDay(1,selectedDate).getDate() } now={now.getDate()}/>
                <HeadWeekBox date='Wed' day={calNextDay(2,selectedDate).getDate() } now={now.getDate()}/>
                <HeadWeekBox date='Thu' day={calNextDay(3,selectedDate).getDate() } now={now.getDate()}/>
                <HeadWeekBox date='Fri' day={calNextDay(4,selectedDate).getDate() } now={now.getDate()} />
                <HeadWeekBox date='Sat' day={calNextDay(5,selectedDate).getDate() } now={now.getDate()}/>
                <HeadWeekBox date='Sun' day={calNextDay(6,selectedDate).getDate() } now={now.getDate()}/> */}
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
          (date, index) => {
            return (
              <HeadWeekBox date={date} _day={calNextDay(index, selectedDate)} />
            );
          }
        )}
      </Grid>
    </Grid>
  );
};

function sliceIntoChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

const BodyWeekBox = ({
  day,
  groupList,
  handlePopUp,
  setClickSchedule,
  shift,
  mode,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  if (groupList === undefined) {
    return (
      <Box
        className={classes.center}
        border={1}
        borderTop={0}
        borderLeft={0}
        style={{ height: 280, borderColor: grey[300], minWidth: 152 }}
      >
        {" "}
        <Grid
          container
          direction="row"
          justifyContent={"space-around"}
          alignItems="center"
        >
          <div style={{ width: 50 }}></div>
          <div style={{ width: 50 }}></div> <div style={{ width: 50 }}></div>
        </Grid>
      </Box>
    );
  } else {
    if (mode === true) {
      var groupListMax = groupList.slice(0, 14);
      var moreItemNumber = groupList.length - 14;
      var arr = sliceIntoChunks(groupListMax, 3);
    } else {
      var groupListMax = groupList.slice(0, 5);
      var moreItemNumber = groupList.length - 5;
      var arr = groupListMax;
    }

    const handleClickBox = () => {
      var _shift = { ...shift };
      _shift.schedules = _shift.schedules.filter(
        (schedule) => schedule.date === day
      );
      setClickSchedule(_shift);
      handlePopUp();
    };
    return (
      <Box
        className={classes.center}
        border={1}
        borderTop={0}
        borderLeft={0}
        style={{ height: 280, borderColor: grey[300], minWidth: 152 }}
        onClick={handleClickBox}
      >
        {mode === true ? (
          arr.map((item) => {
            return (
              <Grid
                container
                direction="row"
                justifyContent={"space-around"}
                alignItems="center"
              >
                {item.map((subitem) => {
                  return (
                    <EmployeeItemAva
                      status={subitem.status}
                      src={subitem.employee_img_url}
                      name={subitem.employee_name}
                    />
                  );
                })}
                {/* //    chinh css thoi */}
                {item.length === 1 ? (
                  <>
                    {" "}
                    <div style={{ width: 50 }}></div>{" "}
                    <div style={{ width: 50 }}></div>{" "}
                  </>
                ) : null}
                {item.length === 2 && moreItemNumber <= 0 ? (
                  <div style={{ width: 50 }}></div>
                ) : null}
                {item.length === 2 && moreItemNumber > 0 ? (
                  <Avatar className={classes.whiteBg}>+{moreItemNumber}</Avatar>
                ) : null}
              </Grid>
            );
          })
        ) : (
          <>
            {arr.map((item) => {
              return (
                <Box
                  className={clsx(
                    classes.boxName,
                    item.status === -1 && classes.boxRed,
                    item.status === 0 && classes.boxYellow,
                    item.status === 1 && classes.boxGreen
                  )}
                >
                  <Box style={{ width: 120, flexGrow: 1, textAlign: "center" }}>
                    <Typography className={classes.nameText} noWrap={false}>
                      {item.employee_name}
                    </Typography>
                  </Box>
                </Box>
                //  </Grid>
              );
            })}
            {moreItemNumber !== 0 ? (
              <Typography
                style={{
                  padding: 5,
                  color: "#2196f3",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                + {moreItemNumber} more
              </Typography>
            ) : null}
          </>
        )}
      </Box>
    );
  }
};
export const ShiftWeekBox = ({
  shift,
  selectedDate,
  handlePopUp,
  setClickSchedule,
  mode,
  reload,
}) => {
  const theme = useTheme();

  const [openShiftDetailPopup, setOpenShiftDetailPopup] = useState(false);

  var groupBy = function (xs, key) {
    return xs?.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  var groupList = groupBy(shift.schedules, "date");

  const handleOpenShiftDetailPopup = async () => {
    setOpenShiftDetailPopup(true);
  };

  return (
    <Box style={{ minWidth: 1226, overflowClipBox: "scroll" }}>
      <ModifyShitPopup
        shift={shift}
        isOpen={openShiftDetailPopup}
        handleClose={() => setOpenShiftDetailPopup(false)}
        reload={reload}
      />
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box
          border={1}
          borderRight={1}
          borderTop={0}
          style={{ borderColor: grey[300], height: 280, minWidth: 150 }}
          onClick={handleOpenShiftDetailPopup}
        >
          <Typography
            variant="h4"
            style={{ fontSize: 16, marginLeft: 5, marginTop: 100 }}
          >
            {shift.name}
          </Typography>
          <Typography variant="body2" style={{ marginLeft: 5, marginTop: 5 }}>
            {shift.start_time} - {shift.end_time}
          </Typography>
          {/* Con thieu EDIT _ DELETE */}
        </Box>
        {[0, 1, 2, 3, 4, 5, 6].map((index) => {
          var day = formatDDMMYYY(calNextDay(index, selectedDate));
          return (
            <BodyWeekBox
              groupList={groupList[day]}
              day={day}
              handlePopUp={handlePopUp}
              setClickSchedule={setClickSchedule}
              shift={shift}
              mode={mode}
            />
          );
        })}
      </Grid>
    </Box>
  );
};



