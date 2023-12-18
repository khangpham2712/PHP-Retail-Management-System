import React, {useEffect,useState} from "react";
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
  FormHelperText
} from "@material-ui/core";

//import project
import customerApi from "../../../../api/customerApi";
import {useDispatch, useSelector} from 'react-redux'
import { useFormik } from "formik";
import * as Yup from "yup";
import { statusAction } from "../../../../store/slice/statusSlice";
import storeApi from "../../../../api/storeApi";
import CustomerRegisterEmail from "../../../../components/Email/CustomerRegisterEmail";
import Fuse from 'fuse.js'
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
  })
);

const AddCustomer = (props) => {
  const { handleClose, open, onReload } = props;
  const theme = useTheme();
  const classes = useStyles(theme);
  const [phoneExist, setPhoneExist] = React.useState(false);
  const [clicked, setClicked] =useState(false)

  const customerFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      paymentInfo:"",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nhập tên khách hàng"),
      phone: Yup.string()
        .length(10, "Số điện thoại không chính xác")
        .matches(/^\d+$/),
      email: Yup.string().email("Email không chính xác")
      // address: Yup.string().required("Nhập địa chỉ nhà cung cấp"),
    }),
  })

  const info = useSelector(state => state.info)
  const store_uuid = info.store.uuid

  // const handleCloseAndReset =() =>{
  //   onReload()
  //   // handleClose()
  //   customerFormik.resetForm()
  // } 
 
  useEffect(() =>{
    if(phoneExist) {setPhoneExist(false)}
  },[customerFormik.values.phone])

  const dispatch = useDispatch()
  return (
 
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        <Typography className={classes.headerTitle} variant="h5">
          Thêm khách hàng
        </Typography>
      </DialogTitle>

      <DialogContent>
        <div className={classes.root}>

          <Grid
            container
            direction="row"
            justifyContent="space-around"
            spacing={3}
          >
            <Grid item sm={7}>
              <TextField
                id="outlined-basic"
                label="Tên khách hàng"
                variant="outlined"
                fullWidth
                size="small"
                required
                name = "name"
                onChange={customerFormik.handleChange}
                value={customerFormik.values.name}
                error={customerFormik.touched.name && customerFormik.errors.name}
                helperText={customerFormik.touched.name ? customerFormik.errors.name : null}
                onBlur={customerFormik.handleBlur}
              />
              <TextField
                id="outlined-basic"
                label="Số điện thoại"
                variant="outlined"
                fullWidth
                size="small"
                name="phone"
                onChange={customerFormik.handleChange}
                value={customerFormik.values.phone}
                error={customerFormik.touched.phone && customerFormik.errors.phone}
                helperText={customerFormik.touched.phone ? customerFormik.errors.phone : null}
                onBlur={customerFormik.handleBlur}
              />
               { phoneExist && (
                <FormHelperText error>Số điện thoại đã được sử dụng</FormHelperText>
              )}
              <TextField
                id="outlined-basic"
                label="Địa chỉ"
                variant="outlined"
                fullWidth
                size="small"
                name= "address"
                // required
                onChange={customerFormik.handleChange}
                value={customerFormik.values.address}
                error={customerFormik.touched.address && customerFormik.errors.address}
                helperText={customerFormik.touched.address ? customerFormik.errors.address : null}
                onBlur={customerFormik.handleBlur}
              />
            </Grid>
            <Grid item sm={5}>
              
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                fullWidth
                size="small"
                name = "email"
                onChange={customerFormik.handleChange}
                value={customerFormik.values.email}
                error={customerFormik.touched.email && customerFormik.errors.email}
                helperText={customerFormik.touched.email ? customerFormik.errors.email : null}
                onBlur={customerFormik.handleBlur}
              />
              <TextField
                id="date"
                label="Thông tin thanh toán"
                variant="outlined"
                size="small"
                className={classes.textField}
                name = "paymentInfo"
                onChange={customerFormik.handleChange}
                value={customerFormik.values.paymentInfo}
                error={customerFormik.touched.paymentInfo && customerFormik.errors.paymentInfo}
                helperText={customerFormik.touched.paymentInfo ? customerFormik.errors.paymentInfo : null}
                onBlur={customerFormik.handleBlur}
              />
            </Grid>
          </Grid>
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={ handleClose}
          variant="contained"
          size="small"
          color="secondary"
        >
          Huỷ
        </Button>
        <Button
          onClick={async () => {   
            // handleClose()  
            setClicked(true)
            let body = {
              name: customerFormik.values.name,
              email: customerFormik.values.email,
              phone: customerFormik.values.phone,
              address: customerFormik.values.address,
              payment_info: customerFormik.values.paymentInfo,
            };

            try {
              const response = await customerApi.createCustomer(store_uuid, body);
              if (customerFormik.values.email) {
                const customer = response.data;
                if (customer) {
                  const emailRes = await storeApi.sendEmail(
                    store_uuid, customer.email, customer.name, "Chúc mừng khách hàng mới", CustomerRegisterEmail("", "", customer, info.store) )
                }
              }
              handleClose()  
              dispatch(statusAction.successfulStatus("Tạo khách hàng thành công"));
              // handleCloseAndReset()
             
              props.onReload()
              
              // props.handleSelectCustomer(response.data)
              if(props.isCart){
                props.setAddCustomer(response.data)
              }
              
            } catch (err) {
              // dispatch(statusAction.failedStatus("Số điện thoại đã được sử dụng"));
              setPhoneExist(true)
              setClicked(false)
              console.log(err)
            }

          }}
          variant="contained"
          size="small"
          color="primary"
          disabled = {!(customerFormik.isValid
            //  && Object.keys(customerFormik.touched).length > 0
             ) 
             || clicked}
        >
          Thêm
        </Button>
      </DialogActions>
      </Dialog>
  );
};

export default AddCustomer;
