import React, {useState} from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";

//import library
import {
  Button,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  Avatar,
  Dialog,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@material-ui/core";

//import project
import customerApi from "../../../../../api/customerApi";
import {useSelector} from 'react-redux'
import VNDInput from "../../../../../components/TextField/NumberFormatCustom";
import {ThousandSeperatedInput} from "../../../../../components/TextField/NumberFormatCustom";
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .MuiTextField-root": {
        marginTop: theme.spacing(2),
      },
    },
    headerTitle: {
      fontSize: "1.125rem",
    },
    ava: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    textField: {
      width: "100%",
    },
    input: {
      display: "none",
    },
    text:{
      // color:"#666666"
    }
  })
);

const AddVoucher = (props) => {
  const { handleClose, open } = props;
  // tam thoi
  const statusState = "Success";

  const theme = useTheme();
  const classes = useStyles(theme);

  // const [name, setName] = React.useState("");
  // const [email, setEmail] = React.useState("");
  // const [phone, setPhone] = React.useState("");
  // const [address, setAddress] = React.useState("");
  // const [paymentInfo, setPaymentInfo] = React.useState("");

  const info = useSelector(state => state.info)
  const store_uuid = info.store.uuid

  return (
 
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        <Typography className={classes.headerTitle} variant="h5">
          Thêm voucher
        </Typography>
      </DialogTitle>

      <DialogContent>
        <div className={classes.root}>
          {/* 1. Text field cơ bản */}
          <Grid
            container
            direction="row"
            justifyContent="space-around"
            spacing={3}
          >
            <Grid item sm={6}>
           
              <TextField
                id="outlined-basic"
                label="Tên voucher (*)"
                variant="outlined"
                fullWidth
                size="small"
                // value={name}
                // onChange={(event)=>setName(event.target.value)}
              />
              <VNDInput
                id="outlined-basic"
                label="Mệnh giá voucher (*)"
                // value={phone}
                // onChange={(event)=>setPhone(event.target.value)}
                variant="outlined"
                fullWidth
                size="small"
              />
              
              
            </Grid>

            <Grid item sm={6}>
              {/* nếu ko điền mặc định là ko giới hạn */}
              <ThousandSeperatedInput
                label={<Typography style={{fontWeight:500, fontSize:15, marginTop:-6, marginRight:-15}}>Số lượng voucher</Typography>}
                placeholder="Không giới hạn"
                fullWidth
                size="small"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }} 
                // value={address}
                // onChange={(event)=>setAddress(event.target.value)}
              />
              <VNDInput
                id="outlined-basic"
                label={<Typography style={{fontWeight:500, fontSize:15, marginTop:-6, marginRight:-15}}>Tiền hoá đơn tối thiểu</Typography>}
                // label="Tiền hoá đơn tối thiểu"
                variant="outlined"
                fullWidth
                size="small"
                placeholder="Không tối thiểu"
                InputLabelProps={{
                  shrink: true,
                }} 
                // value={address}
                // onChange={(event)=>setAddress(event.target.value)}
              />
            </Grid>
          </Grid>

          {/* 2. Thời gian áp dụng */}
          <Typography variant="h5" className={classes.text} style={{marginTop:15}}>Thời gian áp dụng:</Typography>
          <Grid  container  direction="row" justifyContent="space-around" alignItems="center"  spacing={3} >
              <Grid item sm={6} >
                  <TextField id="startDate" label="Từ" 
                      type="date" 
                      name="startDate"
                      // defaultValue={formik.values.startDate} 
                      variant="outlined" size="small" fullWidth 
                      className={classes.textField} 
                      InputLabelProps={{ shrink: true }} 
                      // value={formik.values.startDate} 
                      // onChange={formik.handleChange}
                    />
            </Grid>
            
            <Grid item sm={6}>
              <TextField 
                  id="endDate" label="Đến" type="date" name="endDate"
                  // defaultValue={formik.values.endDate} 
                  variant="outlined" size="small" 
                  fullWidth className={classes.textField} 
                  InputLabelProps={{ shrink: true }} 
                  // value={formik.values.endDate}  
                  // onChange={formik.handleChange}
                />
            </Grid> 
        </Grid>
         



         {/* 3. Trạng thái */}
         <Typography variant="h5" className={classes.text} style={{marginTop:15}}>Trạng thái:</Typography>
          <FormControl component="fieldset">
            <RadioGroup
              name="status"
              // value={payment}
              // onChange={handleChangePayment}
            >
              <Grid container direction="row">
                <FormControlLabel
                  labelPlacement="end"
                  value="active"
                  control={<Radio />}
                  label="Kích hoạt"
                />
                <FormControlLabel
                  labelPlacement="end"
                  value="inactive"
                  control={<Radio />}
                  label="Chưa áp dụng"
                />
              </Grid>
            </RadioGroup>
          </FormControl>
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => handleClose(null)}
          variant="contained"
          size="small"
          color="secondary"
        >
          Huỷ
        </Button>
        <Button
          // onClick={async () => {
          //   let body = {
          //     name: name,
          //     email: email,
          //     phone: phone,
          //     address: address,
          //     payment_info: paymentInfo,
          //   };

          //   try {
          //     const response = await customerApi.createCustomer(store_uuid, body)
          //     handleClose("Success")
          //     console.log(response.status)

          //   } catch (err) {
          //     handleClose("Failed");
          //   }

          // }}
          variant="contained"
          size="small"
          color="primary"
        >
          Thêm
        </Button>
      </DialogActions>
      </Dialog>
  );
};

export default AddVoucher;
