import React from "react";
import { useTheme } from "@material-ui/core/styles";
import { Typography, Grid, Box, ButtonBase, Tooltip } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { getDayText, calNextDay, isToday, daysInMonth } from "../../dateUtil";
import { useStyles } from "../../style";
import AddIcon from "@material-ui/icons/Add";
import { amber, pink, green } from "@material-ui/core/colors";
import { Dot } from "../../EmployeeItem/EmployeeItemAva";

export const HeadMonthPrint = ({
  selectedDate,
  openAddShift,
  first,
  second,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  var firstDay = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  );

  var month = selectedDate.getMonth() + 1;
  var year = selectedDate.getFullYear();
  var numberOfDayInMonth = daysInMonth(
    selectedDate.getMonth() + 1,
    selectedDate.getFullYear()
  );

  // const daysNum = first || second ? 10 : daysInMonth(month, year) - 20;

  return (
    <Grid
      style={{ minWidth: 1850 }}
      container
      direction="row"
      alignItems="center"
    >
      <Box
        border={1}
        style={{
          borderColor: grey[300],
          height: 44,
          width: 150,
          height: 55,
          background: "white",
          position: "relative",
          zIndex: 99,
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
      <Box
        border={1}
        borderLeft={0}
        style={{
          borderColor: grey[300],
          height: 44,
          width: 132,
          height: 55,
          background: "white",
          position: "relative",
          zIndex: 99,
        }}
      >
        <Grid container direction="row" alignItems="center">
          <Typography
            variant="h4"
            style={{ fontSize: 16, marginLeft: 5, marginTop: 10 }}
          >
            Nhân viên
          </Typography>
        </Grid>
      </Box>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          transform: `translateX(${first ? 0 : second ? -505 : -1010}px)`,
        }}
      >
        {Array.from(Array(31).keys()).map((index) => {
          return (
            <Box
              className={classes.center}
              border={1}
              borderLeft={0}
              style={{
                borderColor: grey[300],
                height: 55,
                width: 42,
                background: isToday(new Date(`${month}/${index + 1}/${year}`))
                  ? theme.customization.primaryColor[50]
                  : null,
              }}
            >
              <Typography
                variant="body2"
                style={{ fontSize: 12, marginTop: 5, marginBottom: -3 }}
              >
                {/* Xem lai ham nao tot hon ko */}
                {getDayText(calNextDay(index, firstDay))}
              </Typography>
              <Typography variant="h4">{index + 1}</Typography>
            </Box>
          );
        })}
      </div>
    </Grid>
  );
};

export const ShiftMonthBoxPrint = ({
  shift,
  selectedDate,
  modeMonth,
  first,
  second,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  var employeeGroup = groupBy(shift.schedules, "employee_id");

  function getColor(day, dateGroup, month, year) {
    if (dateGroup[`${day}/${month}/${year}`] !== undefined) {
      if (dateGroup[`${day}/${month}/${year}`][0].status === -1) {
        return pink[300];
      } else if (dateGroup[`${day}/${month}/${year}`][0].status === 0) {
        return amber[300];
      } else {
        return green[300];
      }
    } else {
      return null;
    }
  }

  var numberOfDayInMonth = daysInMonth(
    selectedDate.getMonth() + 1,
    selectedDate.getFullYear()
  );

  return (
    <Box
      border={1}
      borderTop={0}
      borderRight={0}
      style={{ borderColor: grey[300], minWidth: 1850 }}
    >
      <Grid
        style={{ minWidth: 1850 }}
        container
        direction="row"
        alignItems="center"
      >
        <Box
          style={{
            borderColor: grey[300],
            width: 147,
            background: "white",
            position: "relative",
            zIndex: 99,
          }}
        >
          <Typography variant="h4" style={{ fontSize: 16, marginLeft: 5 }}>
            {shift.name}
          </Typography>
          <Typography variant="body2" style={{ marginLeft: 5, marginTop: 5 }}>
            {shift.start_time} - {shift.end_time}
          </Typography>
          {/* Con thieu EDIT _ DELETE */}
        </Box>
        <Box
          border={1}
          borderBottom={0}
          borderRight={0}
          borderTop={0}
          style={{
            borderColor: grey[300],
            // transform: `translateX(${first ? 0 : second ? -505 : -1010}px)`,
            position: "relative",
            zIndex: -1,
          }}
        >
          {Object.keys(employeeGroup).map(function (key, index) {
            var dateGroup = groupBy(employeeGroup[key], "date");

            return (
              <Grid container direction="row" alignItems="center">
                <Box
                  border={1}
                  borderLeft={0}
                  borderTop={0}
                  style={{
                    borderColor: grey[300],
                    width: 133,
                    height: 55,
                    background: "white",
                    position: "relative",
                    zIndex: 99,
                  }}
                >
                  <Typography
                    variant="h4"
                    style={{
                      fontSize: 16,
                      marginLeft: 5,
                      marginTop: 10,
                      width: 150,
                    }}
                  >
                    {employeeGroup[key][0].employee_name}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ fontSize: 14, marginLeft: 5 }}
                  >
                    {/* {employeeGroup[key][0].role} */}
                    Nhân viên bán hàng
                  </Typography>
                </Box>
                <div
                  style={{
                    display: "flex",
                    transform: `translateX(${
                      first ? 0 : second ? -505 : -1010
                    }px)`,
                  }}
                >
                  {Array.from(Array(numberOfDayInMonth).keys()).map((index) => {
                    var day = index + 1 > 9 ? index + 1 : `0${index + 1}`;
                    // var month = selectedDate.getMonth()+1;
                    var month =
                      selectedDate.getMonth() + 1 > 9
                        ? selectedDate.getMonth() + 1
                        : `0${selectedDate.getMonth() + 1}`;
                    var year = selectedDate.getFullYear();

                    return (
                      // fix laij cai responsive nay
                      <Box
                        width={1850}
                        className={classes.center}
                        border={1}
                        borderLeft={0}
                        borderTop={0}
                        style={{
                          borderColor: grey[300],
                          height: 55,
                          width: 42,
                          backgroundColor:
                            modeMonth === false
                              ? getColor(day, dateGroup, month, year)
                              : null,
                        }}
                      >
                        {modeMonth === true ? (
                          <Box style={{ marginTop: 15 }}>
                            {dateGroup[`${day}/${month}/${year}`] !==
                            undefined ? (
                              <Dot
                                status={
                                  dateGroup[`${day}/${month}/${year}`][0].status
                                }
                                style={{ marginTop: 10 }}
                              />
                            ) : null}
                          </Box>
                        ) : null}
                      </Box>
                    );
                  })}
                </div>
              </Grid>
            );
          })}
        </Box>
      </Grid>
    </Box>
  );
};
