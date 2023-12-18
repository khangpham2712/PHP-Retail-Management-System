import React from 'react'
import {Typography,Divider,IconButton,Grid,Popover,Box,TextField,ButtonBase,InputAdornment,ButtonGroup,Button,Tooltip} from '@material-ui/core';
import { useState } from "react";
import {useTheme, makeStyles,createStyles} from "@material-ui/core/styles";
import NavigateNextTwoToneIcon from '@material-ui/icons/NavigateNextTwoTone';
import NavigateBeforeTwoToneIcon from '@material-ui/icons/NavigateBeforeTwoTone';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
  DatePicker
} from '@material-ui/pickers';
import { grey} from '@material-ui/core/colors'
import { useStyles } from '../style';
import AddIcon from '@material-ui/icons/Add';
import {formatDate} from '../dateUtil'

const ScheduleToolBar = ({selectedBtn,handleModeBtn,setSelectedBtn,selectedDate,handleDateChange,anchorEl,setAnchorEl, openAddSchedule}) => {
    const theme = useTheme();
    const classes = useStyles(theme);


    // open choose date
    // const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
    setAnchorEl(null);
    };

    return (
            <Grid container direction="row" justifyContent="space-between" alignItems="center" style={{marginBottom:20}}>
                    <ButtonGroup>
                        <Button className={selectedBtn === 0 && classes.btnChoose} onClick={()=>handleModeBtn(0)}>Ngày</Button>
                        <Button className={selectedBtn === 1 &&classes.btnChoose}   onClick={()=>handleModeBtn(1)}>Tuần</Button>
                        <Button className={selectedBtn === 2 &&classes.btnChoose}  onClick={()=>handleModeBtn(2)}>Tháng</Button>
                    </ButtonGroup>
                <Grid item >
                    <Grid container  direction="row" justifyContent="center" alignItems="center">
                        <IconButton style={{marginRight:15,}}>
                            <NavigateBeforeTwoToneIcon /> 
                        </IconButton>
                        <Box border={1} style={{padding:'10px 20px 10px 20px', borderColor:grey[300], borderRadius:10}} className={classes.box} onClick={handleClick}>
                            <Typography variant="h3" style={{color:grey[600], fontWeight:500}} >
                                
                                {formatDate(selectedBtn,selectedDate)}
                            </Typography>
                        </Box>

                        <IconButton style={{marginLeft:15}}>
                            <NavigateNextTwoToneIcon />
                        </IconButton>
                    </Grid>  
                </Grid>
                <PopUpChooseDate id={id} open={open} anchorEl={anchorEl}handleClose={handleClose}selectedDate={selectedDate}handleDateChange={handleDateChange}/>

                <ButtonBase onClick={openAddSchedule}  className={classes.addBtn} style={{marginLeft:70}} >
                    <Tooltip title='Thêm lịch làm việc'>
                        <AddIcon  size="small" className={classes.addIcon} />
                    </Tooltip>
                </ButtonBase>
           </Grid>
    )
}

export default ScheduleToolBar
const PopUpChooseDate = ({id,open,anchorEl,handleClose,selectedDate,handleDateChange}) =>{
    return(
        <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
        }}
        transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
        }}
    >         
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
        disableToolbar
        variant="static"
        inputVariant="outlined"
        format="dd/MM/yyyy"
        margin="normal"
        value={selectedDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
            'aria-label': 'change date',
        }}
        />
    </MuiPickersUtilsProvider>
    </Popover>
    )
}