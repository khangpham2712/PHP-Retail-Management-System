import React from 'react'
import {
  Drawer,TextField,InputAdornment,Box,Typography,Button,Grid,MenuItem,Select,InputLabel,FormControl
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/styles";
import {ThousandSeperatedInput} from '../../../components/TextField/NumberFormatCustom'
import VNDInput from '../../../components/TextField/NumberFormatCustom'
import barcodeIcon from "../../../assets/img/icon/barcode_grey.png";
import SearchTwoToneIcon from "@material-ui/icons/SearchTwoTone";


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
const HistoryFilter = (props) => {
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


     
      {/* 1. Ngày tao ? */}
      <Typography variant="h5"className={classes.text} >Ngày thực hiện:</Typography>
      <TextField id="date" label="Từ" type="date"  defaultValue=""  variant="outlined" size="small" fullWidth className={classes.textField} InputLabelProps={{ shrink: true }} // value={dateOfBirth} // onChange={(event) => setDateOfBirth(event.target.value)}
      />
       <TextField id="date" label="Đến" type="date"  defaultValue=""  variant="outlined" size="small" fullWidth className={classes.textField} InputLabelProps={{ shrink: true }} // value={dateOfBirth} // onChange={(event) => setDateOfBirth(event.target.value)}
      />
       {/* 2.  */} 
       <Typography variant="h5"className={classes.text} >Hành động:</Typography>
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
       
      >
        <MenuItem value="trungtam">Bán hàng</MenuItem>
        <MenuItem value="q1">Nhập hàng</MenuItem>
        <MenuItem value="q1">Trả hàng</MenuItem>
        <MenuItem value="q1">Trả hàng nhập</MenuItem>
      </Select>
      </FormControl>

      {/* 3. Giá trị from-to */}
      <Typography variant="h5"className={classes.text} >Giá trị:</Typography>
      <VNDInput  label="Từ" variant="outlined" fullWidth size="small" className={classes.textField}
        
      />
      <VNDInput  label="Đến" variant="outlined" fullWidth size="small" className={classes.textField}
   
      />
      {/* 4. Nhân viên */}
      <Typography variant="h5"className={classes.text} >Nhân viên:</Typography>
      <TextField
          variant="outlined"
          placeholder={"Tên, Sđt nhân viên"} /*placeholder='Tìm kiếm ...'*/
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchTwoToneIcon className={classes.icon} />
              </InputAdornment>
            ),
            // endAdornment: (
            //   <InputAdornment position="end">
            //     <Box
            //       component="img"
            //       sx={{ height: 23, width: 23 }}
            //       src={barcodeIcon}
            //     />
            //   </InputAdornment>
            // ),
            className: classes.search,
          }}
        />

      

       {/* BUTTON */}
       <Button variant="contained"  color="primary" style={{marginTop:30}}>
           Lọc
      </Button>
          


          
    </Drawer>
    )
}

export default HistoryFilter

