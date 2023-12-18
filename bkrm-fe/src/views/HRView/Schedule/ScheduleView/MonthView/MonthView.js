import React from 'react'
import { useState } from "react";
import {useTheme, makeStyles,createStyles,withStyles} from "@material-ui/core/styles";
import {Typography,Divider,Badge,IconButton,Grid,Popover,Paper,Box,TextField,Avatar,ButtonBase,InputAdornment,ButtonGroup,Button,Tooltip, TableContainer} from '@material-ui/core';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import EmployeeItemAva from '../../EmployeeItem/EmployeeItemAva'
import { grey} from '@material-ui/core/colors'
import {formatDate,getMonday,getDayText,calNextDay,isToday,formatDDMMYYY,daysInMonth,getWidthCss} from '../../dateUtil'
import { useStyles } from '../../style';
import AddIcon from '@material-ui/icons/Add';
import clsx from 'clsx'
import { amber, pink,green } from '@material-ui/core/colors';
import {Dot} from '../../EmployeeItem/EmployeeItemAva'
export const HeadMonth =({selectedDate, openAddShift}) =>{
    const theme = useTheme();
    const classes = useStyles(theme);
    var firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);

    var month = selectedDate.getMonth()+1;
    var year = selectedDate.getFullYear() 

    return(
            <Grid style={{minWidth:1850}} container  direction="row" alignItems="center" justifyContent="space-between">
                <Box border={1}  style={{borderColor:grey[300],height:44,width:150,height:55}} > 
                    <Grid  container  direction="row" alignItems="center" >
                        <Typography variant="h4" style={{fontSize:16, marginLeft:5, marginTop:10}} >
                            Ca làm việc
                        </Typography>
                        <ButtonBase onClick={openAddShift}  className={classes.addBtn} style={{marginTop:10,marginLeft:25 ,marginRight:10}} >
                            <Tooltip title='Thêm ca'>
                                <AddIcon  size="small" className={classes.addShiftIcon} />
                            </Tooltip>
                        </ButtonBase>
                    </Grid>
                </Box>
                <Box border={1} borderLeft={0} style={{borderColor:grey[300],height:44,width:160,height:55}} > 
                    <Grid  container  direction="row" alignItems="center" >
                        <Typography variant="h4" style={{fontSize:16, marginLeft:5, marginTop:10}} >
                            Nhân viên
                        </Typography>
                     
                    </Grid>
                </Box>
                 {Array.from(Array(daysInMonth(month, year)).keys()).map(index=>{
                    return(
                        <Box className={classes.center} border={1} borderLeft={0} style={{ borderColor:grey[300], height:55, width:42,background:isToday(new Date(`${month}/${index+1}/${year}`))?theme.customization.primaryColor[50]:null}}  >    
                            <Typography variant="body2" style={{fontSize:12, marginTop:5, marginBottom:-3}} >
                                {/* Xem lai ham nao tot hon ko */}
                                {getDayText(calNextDay(index,firstDay))} 
                            </Typography>
                            <Typography variant="h4"  >
                                {index + 1}
                            </Typography>
                        </Box>
                    )
                })}
              
            </Grid>
    )
}


export const ShiftMonthBox = ({shift,selectedDate,handleChangeModeMonth,modeMonth})  =>{
    const theme = useTheme();
    const classes = useStyles(theme);

    var groupBy = function(xs, key) {
        return xs.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };
      
   var employeeGroup = groupBy(shift.schedules, 'employee_id')
      
    function getColor (day,dateGroup, month, year) {
            if(dateGroup[`${day}/${month}/${year}`] !== undefined) {
                if(dateGroup[`${day}/${month}/${year}`][0].status === -1){
                    return pink[300]
                }else if (dateGroup[`${day}/${month}/${year}`][0].status === 0){
                    return amber[300]
                }else{
                    return green[300]
                }
            }else{
                return null
            }
    }

    var numberOfDayInMonth = daysInMonth(selectedDate.getMonth()+1, selectedDate.getFullYear() )
    var widthCss = getWidthCss(numberOfDayInMonth)
   

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
          <Box style={{ borderColor: grey[300], width: 147 }}>
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
            style={{ borderColor: grey[300] }}
          >
            {Object.keys(employeeGroup).map(function (key, index) {
              var dateGroup = groupBy(employeeGroup[key], "date");

              return (
                <Grid container direction="row" alignItems="center">
                  <Box
                    border={1}
                    borderLeft={0}
                    borderTop={0}
                    style={{ borderColor: grey[300], width: 160, height: 55 }}
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

                  {Array.from(Array(numberOfDayInMonth).keys()).map((index) => {
                    var day = index + 1 > 9 ? index + 1 : `0${index + 1}`;
                    // var month = selectedDate.getMonth()+1;
                    var month =
                      selectedDate.getMonth() + 1 > 9
                        ? selectedDate.getMonth() + 1
                        : `0${selectedDate.getMonth() + 1}`;
                    var year = selectedDate.getFullYear();
                    console.log("dateGroup", dateGroup);
                    console.log("day", day);
                    console.log("month", month);
                    console.log("year", year);
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
                          width: widthCss,
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
                </Grid>
              );
            })}
          </Box>
        </Grid>
      </Box>
    );
}

const StyledBadgeGreen = withStyles((theme) => ({
    badge: {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: '$ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }))(Badge);







