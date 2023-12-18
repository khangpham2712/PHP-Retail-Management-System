import React from 'react'
import {Typography,Divider,IconButton,Grid,Popover,Box,TextField,ButtonBase,InputAdornment,ButtonGroup,Button,Tooltip} from '@material-ui/core';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import PrintTwoToneIcon from '@material-ui/icons/PrintTwoTone';
import SwapVertTwoToneIcon from '@material-ui/icons/SwapVertTwoTone';
import {useTheme, makeStyles,createStyles} from "@material-ui/core/styles";
import { useStyles } from '../style';
import { useSelector } from 'react-redux';


const ScheduleHead = ({ handlePrint }) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const info = useSelector((state) => state.info);
  const branch = info.branch;

  return (
    <Grid container direction="row" justifyContent="space-between">
      <TextField
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchTwoToneIcon className={classes.icon} />
            </InputAdornment>
          ),
          className: classes.search,
        }}
      />
      {/* <div style={{width:150}}></div>  */}
      <Box>
        <Typography className={classes.headerTitle} variant="h2">
          Ca làm việc
        </Typography>
        <Typography className={classes.textTitle} variant="body2">
          {`(${branch.name})`}
        </Typography>
      </Box>

      <Box>
        <Tooltip title="In" onClick={handlePrint}>
          <IconButton
            aria-label="filter list"
            style={{ height: 50, marginTop: 5 }}
          >
            <PrintTwoToneIcon className={classes.icon} />
          </IconButton>
        </Tooltip>
        {/* <Tooltip title="Đổi chi nhánh">
                        <IconButton aria-label="filter list" style={{height:50, marginTop:5}}>
                            <SwapVertTwoToneIcon className={classes.icon} />
                        </IconButton>
                    </Tooltip> */}
      </Box>
    </Grid>
  );
};

export default ScheduleHead
