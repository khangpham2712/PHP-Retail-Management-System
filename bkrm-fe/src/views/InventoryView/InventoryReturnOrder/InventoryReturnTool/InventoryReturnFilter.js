import React from 'react'
import {
  Drawer,TextField, Typography,Button,Grid,MenuItem,Select,InputLabel,FormControl
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/styles";
import VNDInput from '../../../../components/TextField/NumberFormatCustom';
import { useFormik } from 'formik';
import moment from 'moment';
import purchaseReturnApi from '../../../../api/purchaseReturnApi';
import { useSelector } from 'react-redux';

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
const InventoryReturnFilter = (props) => {
    const {handleToggleFilter,openFilter, setPurchaseReturns, query, setQuery} =props;

    const theme = useTheme();
    const classes = useStyles(theme);

    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branch_uuid = info.branch.uuid;
    const current =moment(new Date()).format("YYYY-MM-DD")

    const formik = useFormik({
      initialValues: query,
      onSubmit: async values => {
        // console.log(values)
        // const res = await purchaseReturnApi.searchPurchaseReturn(store_uuid, branch_uuid, values)
        setQuery(values)
        handleToggleFilter()
      },
    });

    React.useEffect(() =>{
      formik.values.startDate.length === 0 ? formik.setFieldValue("startDate",current) : formik.setFieldValue("startDate",formik.values.startDate);
      formik.values.endDate.length === 0 ? formik.setFieldValue("endDate",current) : formik.setFieldValue("endDate",formik.values.startDate)
  
    },[])

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
        

        {/* 1.Ngay from-to */}
        <Typography variant="h5" className={classes.text} >Ngày trả:</Typography>
        <TextField id="startDate" label="Từ" 
          type="date" 
          name="startDate"
          defaultValue={formik.values.startDate} 
          variant="outlined" size="small" fullWidth 
          className={classes.textField} 
          InputLabelProps={{ shrink: true }} 
          value={formik.values.startDate} 
          onChange={formik.handleChange}
        />
        <TextField 
          id="endDate" label="Đến" type="date" name="endDate"
          defaultValue={formik.values.endDate} 
          variant="outlined" size="small" 
          fullWidth className={classes.textField} 
          InputLabelProps={{ shrink: true }} 
          value={formik.values.endDate}  
          onChange={formik.handleChange}
        />
       
  
        {/* 2.Tien from-to*/}
        <Typography variant="h5" className={classes.text} >Tiền trả:</Typography>
        <VNDInput required label="Từ" variant="outlined" fullWidth size="small" className={classes.textField}
          name="minTotalAmount"
          value={formik.values.minTotalAmount}
          onChange={formik.handleChange}
        />
        <VNDInput 
          id="maxTotalAmount" name="maxTotalAmount"
          required label="Đến" variant="outlined" 
          fullWidth size="small" className={classes.textField}
          value={formik.values.maxTotalAmount}
          onChange={formik.handleChange}
        />

        {/* 5.Trang thai */}
        {/* <Typography variant="h5" className={classes.text} >Trạng thái:</Typography>
        <FormControl
          className={classes.formControl}
          fullWidth
          size="small"
          variant="outlined"
        >
          <Select
            labelId="demo-simple-select-outlined-label"
            id="status"
            name="status"
            size="small"
            onChange={formik.handleChange}
            // label=" Chi nhánh"
            value={formik.values.status}
          >
             <MenuItem value="" ><em>Tất cả</em></MenuItem>
            <MenuItem value="debt">Còn nợ</MenuItem>
            <MenuItem value="closed">Trả đủ</MenuItem>
          </Select>
        </FormControl> */}
  
        {/* 5.Pttt */}
        <Typography variant="h5" className={classes.text}>Phương thức thanh toán:</Typography>
        <FormControl
          className={classes.formControl}
          fullWidth
          size="small"
          variant="outlined"
        >
          <Select
            labelId="demo-simple-select-outlined-label"
            id="paymentMethod" name="paymentMethod"
            size="small"
            onChange={formik.handleChange}
            // label=" Chi nhánh"
            value={formik.values.paymentMethod}
          >
             <MenuItem value="" ><em>Tất cả</em></MenuItem>
            <MenuItem value="card">Thẻ</MenuItem>
            <MenuItem value="cash">Tiền mặt</MenuItem>
          </Select>
        </FormControl>
  
        {/* BUTTON */}
        <Button
          variant="contained"
          color="primary"
          onClick={formik.handleSubmit}
          style={{ marginTop: 30 }}>
          Lọc
        </Button>
      </Drawer>
    )
}

export default InventoryReturnFilter

