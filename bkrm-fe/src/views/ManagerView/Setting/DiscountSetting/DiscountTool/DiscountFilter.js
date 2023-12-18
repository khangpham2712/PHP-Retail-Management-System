import React from 'react'
import {
  Drawer,TextField, Typography,Button,Grid,MenuItem,Select,InputLabel,FormControl
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/styles";
import VNDInput from '../../../../../components/TextField/NumberFormatCustom'

const drawerWidth = 300;
const useStyles = makeStyles((theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    
    drawerPaper: {
      width: drawerWidth,
      padding:15
    },
    textField:{marginBottom:10},
    text:{marginBottom:10,marginTop:15}
  })
);
const DiscountFilter = (props) => {
    const {handleToggleFilter,openFilter} =props;

    const theme = useTheme();
    const classes = useStyles(theme);

    return (
    <Drawer
        anchor="right"
        onClose={handleToggleFilter}
        open={openFilter}
        classes={{
          paper: classes.drawerPaper,
        }}
        className={classes.drawer}
      >
    

        {/* 1. Trạng thái */}
        <Typography variant="h5"className={classes.text} >Trạng thái:</Typography>
      <FormControl
          className={classes.formControl}
          fullWidth
          size="small"
          variant="outlined"
        >
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        size="small"
        // onChange={(event) => { setGender(event.target.value) }}
        // label=" Chi nhánh"
        // value={gender}
      >
        <MenuItem value="trungtam">Kích hoạt</MenuItem>
        <MenuItem value="q1">Chưa kích hoạt</MenuItem>
      </Select>
      </FormControl>

      {/* 2. Hiệu lực */}
      <Typography variant="h5"className={classes.text} >Hiệu lực:</Typography>
      <FormControl
          className={classes.formControl}
          fullWidth
          size="small"
          variant="outlined"
        >
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        size="small"
        // onChange={(event) => { setGender(event.target.value) }}
        // label=" Chi nhánh"
        // value={gender}
      >
        <MenuItem value="trungtam">Còn hiệu lực</MenuItem>
        <MenuItem value="q1">Hết hiệu lực</MenuItem>
      </Select>
      </FormControl>

       

         {/* BUTTON */}
        <Button variant="contained"  color="primary" style={{marginTop:30}}>
            Lọc
        </Button>

          
    </Drawer>
    )
}

export default DiscountFilter

