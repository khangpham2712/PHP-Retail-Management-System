import React from 'react'
import { useState } from "react";
import {useTheme, makeStyles,createStyles,withStyles} from "@material-ui/core/styles";
import {Typography,Divider,Badge,IconButton,Grid,Popover,Paper,Box,TextField,Avatar,ButtonBase,InputAdornment,ButtonGroup,Button,Tooltip, TableContainer} from '@material-ui/core';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import EmployeeItemAva from '../../EmployeeItem/EmployeeItemAva'
import { grey} from '@material-ui/core/colors'
import {formatDate,getMonday,getDayText,isToday,calNextDay,formatDDMMYYY} from '../../dateUtil'
import { useStyles } from '../../style';
import AddIcon from '@material-ui/icons/Add';
import clsx from 'clsx'

export const HeadDay =({selectedDate, openAddShift}) =>{
    const theme = useTheme();
    const classes = useStyles(theme);
    const now = new Date();
    return (
      <Grid>
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

          <Box
            className={classes.center}
            border={1}
            borderLeft={0}
            style={{
              borderColor: grey[300],
              height: 55,
              minWidth: 152,
              background: isToday(selectedDate)
                ? theme.customization.primaryColor[50]
                : null,
            }}
          >
            <Typography
              variant="body2"
              style={{ fontSize: 12, marginTop: 5, marginBottom: -3 }}
            >
              {getDayText(selectedDate)}
            </Typography>
            <Typography
              variant="h3"
              style={{ color: grey[700], fontWeight: 600, fontSize: 25 }}
            >
              {selectedDate.getDate()}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    );
}


export const ShiftDayBox = ({shift,handlePopUp,setClickSchedule,mode})  =>{
    const theme = useTheme();
    const classes = useStyles(theme);

    // var arr = shift.scheduleList
    const handleClickBox = () =>{
        var _shift ={...shift} 
        // _shift.scheduleList = _shift.scheduleList.filter(schedule => schedule.date === day)
        setClickSchedule(_shift)
        handlePopUp();
    }
    var arr = shift.schedules

    return (
        <Box border={1} borderTop={0} borderRight={0}style={{borderColor:grey[300]}} > 

            <Grid  container  direction="row" alignItems="center" justifyContent="space-between">
                    <Box style={{borderColor:grey[300], minWidth:148}} >
                    <Typography variant="h4" style={{fontSize:16, marginLeft:5}} >
                        {shift.name}
                    </Typography>
                    <Typography variant="body2" style={{marginLeft:5, marginTop:5}} >
                        {shift.start_time} - {shift.end_time}
                    </Typography>
                    {/* Con thieu EDIT _ DELETE */}
                    </Box>
                
               
                <Box border={1} borderTop={0} borderBottom={0}  className={classes.center} style={{  borderColor:grey[300],width:1}} onClick={handleClickBox}>
                {mode === true ?
                    <Grid   container  direction="row" alignItems="center" justifyContent="center">
                    {arr.map(subitem =>{
                        return(
                            <EmployeeItemAva src={subitem.employee_img_url} status={subitem.status} name={subitem.employee_name}/>
                        )
                    }) }
                     </Grid>: 
                    <>
                    <Grid  container  direction="row" alignItems="center" justifyContent="center">
                    {arr.map(item=>{ 
                        return(
                            <Box className={clsx(item.status === -1 && classes.boxRed,item.status === 0 && classes.boxYellow,item.status === 1 && classes.boxGreen)} style={{width:120, margin:5,height:44,borderRadius:10,padding:10,alignItems:'center'}} > 
                                {/* <Box style={{width:120,flexGrow: 1,textAlign: "center"}}> */}
                                <Typography className={classes.nameText} noWrap={false}>
                                    {item.employee_name}
                                </Typography>
                                {/* </Box> */}
                            </Box>
                   
                        )
                    })}
                    </Grid>
                    </>
                    }
                </Box>


                
            </Grid>
         </Box>  
            
    )
}




