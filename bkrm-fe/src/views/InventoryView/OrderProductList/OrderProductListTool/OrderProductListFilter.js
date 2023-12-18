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
const OrderProductListFilter = (props) => {
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
         {/* Nhan vien, NCC?? search ở đây hay chỗ kia -> search sđt ,mã , tên,...*/}
         {/* 1.Ngay from-to */}
      <Typography variant="h5"className={classes.text} >Ngày đặt:</Typography>
      <TextField id="date" label="Từ" type="date"  defaultValue=""  variant="outlined" size="small" fullWidth className={classes.textField} InputLabelProps={{ shrink: true }} // value={dateOfBirth} // onChange={(event) => setDateOfBirth(event.target.value)}
      />
       <TextField id="date" label="Đến" type="date"  defaultValue=""  variant="outlined" size="small" fullWidth className={classes.textField} InputLabelProps={{ shrink: true }} // value={dateOfBirth} // onChange={(event) => setDateOfBirth(event.target.value)}
      />
      {/* 2,Khoảng tiền from-to*/}
      <Typography variant="h5"className={classes.text} >Tiền đơn nhập:</Typography>
      <VNDInput required label="Từ" variant="outlined" fullWidth size="small" className={classes.textField}
        //  value={productInfo.importedPrice}
        // onChange={(e) =>
        //   setProductInfo({
        //     ...productInfo,
        //     importedPrice: e.target.value,
        //   })
        // }
      />
      <VNDInput required label="Đến" variant="outlined" fullWidth size="small" className={classes.textField}
      //  value={productInfo.importedPrice}
        // onChange={(e) =>
        //   setProductInfo({
        //     ...productInfo,
        //     importedPrice: e.target.value,
        //   })
        // }
      />
       {/* 3.Chi nhanh */}
       <Typography variant="h5"className={classes.text} >Chi nhánh:</Typography>
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
        <MenuItem value="trungtam">Chi nhánh trung tâm</MenuItem>
        <MenuItem value="q1">Chi nhánh quận 1</MenuItem>
      </Select>
      </FormControl>

      {/* 4. Trang thai */}
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

        {/* BUTTON */}
        <Button variant="contained"  color="primary" style={{marginTop:30}}>
           Lọc
      </Button>


          
    </Drawer>
    )
}

export default OrderProductListFilter

