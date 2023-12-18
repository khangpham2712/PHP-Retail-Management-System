import React from 'react'
import {
  Drawer,TextField, Typography,Button,Grid,MenuItem,Select,InputLabel,FormControl
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/styles";
import VNDInput from '../../../../components/TextField/NumberFormatCustom'

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
const CustomerFilter = (props) => {
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
        {/*date_of_birth, gender,status  */}
        {/*1. Tổng tiền from -to */}
        <Typography variant="h5"className={classes.text} >Tiền hoá đơn:</Typography>
      <VNDInput required label="Từ" variant="outlined" fullWidth size="small" className={classes.textField}
        //  value={productInfo.importedPrice}
        // onChange={(e) =>
        //   setProductInfo({
        //     ...productInfo,
        //     importedPrice: e.target.value,
        //   })
        // }
      />

        {/* 2. Trạng thái */}
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
        <MenuItem value="trungtam">Còn nợ</MenuItem>
        <MenuItem value="q1">Trả đủ</MenuItem>
      </Select>
      </FormControl>

        {/*3. Ngày tao from -to  */}
        <Typography variant="h5"className={classes.text} >Ngày tạo:</Typography>
        <TextField id="date" label="Từ" type="date"  defaultValue=""  variant="outlined" size="small" fullWidth className={classes.textField} InputLabelProps={{ shrink: true }} // value={dateOfBirth} // onChange={(event) => setDateOfBirth(event.target.value)}
        />
        <TextField id="date" label="Đến" type="date"  defaultValue=""  variant="outlined" size="small" fullWidth className={classes.textField} InputLabelProps={{ shrink: true }} // value={dateOfBirth} // onChange={(event) => setDateOfBirth(event.target.value)}
        />


        {/* địa chỉ ??  */}
        
        {/* Ngung hoat dong ??  */}


         {/* BUTTON */}
      <Button variant="contained"  color="primary" style={{marginTop:30}}>
           Lọc
      </Button>

          
    </Drawer>
    )
}

export default CustomerFilter

