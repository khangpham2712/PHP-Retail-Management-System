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
import customerApi from "../../../../../../api/customerApi";
import {useDispatch, useSelector} from 'react-redux'
import { useFormik } from "formik";
import * as Yup from "yup";
import { statusAction } from "../../../../../../store/slice/statusSlice";

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

const UpdateCustomer = (props) => {
  const { handleClose, open, onReload } = props;
  const theme = useTheme();
  const classes = useStyles(theme);
  const [phoneExist, setPhoneExist] = React.useState(false);
  const [clicked, setClicked] =useState(false)


  const customerFormik = useFormik({
    initialValues: {
      name: props.customerDetail?.name || "",
      email: props.customerDetail?.email || "",
      phone: props.customerDetail?.phone || "",
      address: props.customerDetail?.address || "",
      paymentInfo: props.customerDetail?.payment_info || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nhập tên khách hàng"),
      phone: Yup.string()
        .length(10, "Số điện thoại không chính xác").matches(/^\d+$/),
      // address: Yup.string().required("Nhập địa chỉ nhà cung cấp"),
      email: Yup.string().email("Email không chính xác")
    }),
  })

  const info = useSelector(state => state.info)
  const store_uuid = info.store.uuid

  // const handleCloseAndReset =() =>{
  //   // handleClose()
  //   onReload()
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
          Chỉnh sửa khách hàng
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
            <Grid item xs={7}>
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
                required
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
            <Grid item xs={5}>
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
            </Grid>
          </Grid>
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          variant="contained"
          size="small"
          color="secondary"
        >
          Huỷ
        </Button>
        <Button
          onClick={async () => {
            setClicked(true)
            let body = {
              name: customerFormik.values.name,
              email: customerFormik.values.email,
              phone: customerFormik.values.phone,
              address: customerFormik.values.address,
              payment_info: customerFormik.values.paymentInfo,
            };

            try {
              const response = await customerApi.updateCustomer(store_uuid, props.customerDetail.uuid, body)
              handleClose()
              // handleCloseAndReset()
              dispatch(statusAction.successfulStatus("Sửa thông tin khách hàng thành công"));
              onReload()
              
            } catch (err) {
              // dispatch(statusAction.failedStatus("Sửa thông tin khách hàng thất bại"));
              setPhoneExist(true)
              setClicked(false)
            }

          }}
          variant="contained"
          size="small"
          color="primary"
          disabled = {!(customerFormik.isValid  )|| clicked}
        >
          Lưu thay đổi
        </Button>
      </DialogActions>
      </Dialog>
  );
};

export default UpdateCustomer;
