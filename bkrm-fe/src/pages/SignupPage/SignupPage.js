import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import userApi from "../../api/userApi";
import Typography from "@material-ui/core/Typography";
import { Button, Paper, Step, StepLabel, Stepper } from "@material-ui/core";
import useStyles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { logInHandler } from "../../store/actionCreator";
import { Link } from "react-router-dom";
import UserInfo from "../../components/SignUp/UserInfo";
import StoreInfo from "../../components/SignUp/StoreInfo";
import { loadingActions } from "../../store/slice/loadingSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { statusAction } from "../../store/slice/statusSlice";
import getGeoCode from "../../components/BranchMap/Geocode";
export default function SignUp() {
  const classes = useStyles();
  const info = useSelector((state) => state.info);
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const user_formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      user_name: '',
      password: "",
      passwordConfirm: "",
      phone: "",
      dateOfBirth: "1991-01-01",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nhập tên chủ cửa hàng"),
      user_name: Yup.string().required("Nhập tên đăng nhập"),
      phone: Yup.string()
        .length(10, "Số điện thoại không chính xác")
        .required("Nhập số điện thoại")
        .matches(/^\d+$/, "Số điển thoại không chính xác"),
      password: Yup.string().required("Nhập mật khẩu").min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
      passwordConfirm: Yup.string().required("Nhập lại mật khẩu").oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp'),
    })
  })
  const store_formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      ward: "",
      district: "",
      city: "",
      phone: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nhập tên cửa hàng"),
      address: Yup.string().required("Nhập địa chỉ"),
      city: Yup.string().required("Chọn tỉnh/thành phố"),
      district: Yup.string().required("Chọn quận/huyện"),
      ward: Yup.string().required("Chọn phường/xã"),
    }),
  });
  const dispatch = useDispatch();
  const handleSignUp = async () => {
    const ward = wardList.find((ward) => ward.id === store_formik.values.ward).name;
    const province = cityList.find(
      (city) => city.id === store_formik.values.city
    ).name;
    const district = districtList.find(
      (district) => district.id === store_formik.values.district
    ).name;

    let lat, lng;
    try {
      ({ lat, lng } = await getGeoCode(
        store_formik.values.address + " " + ward + " " + district + " " + province,info.store.key
      ));
    } catch (error) {
      console.log(error)
    }
    const body = {
      name: user_formik.values.name,
      email: user_formik.values.email,
      user_name: user_formik.values.user_name,
      password: user_formik.values.password,
      password_confirmation: user_formik.values.passwordConfirm,
      phone: user_formik.values.phone,
      date_of_birth: user_formik.values.dateOfBirth,
      status: "active",
      store_name: store_formik.values.name,
      address: store_formik.values.address,
      ward: ward,
      district: district,
      province: province,
      store_phone: store_formik.values.phone,
      default_branch: true,
      lat: lat ? lat.toString() : "",
      lng: lng ? lng.toString() : "",
    }
    try {
      const response = await userApi.ownerRegister(body);
      if(response.message ==="error"){
        dispatch(statusAction.failedStatus("Tên tài khoản đã được sử dụng"))
      }else{
        dispatch(statusAction.successfulStatus("Tạo cửa hàng thành công"))
        dispatch(logInHandler(user_formik.values.user_name, user_formik.values.password));
      }
    } catch (error) {
      dispatch(statusAction.failedStatus("Tạo tài khoản thất bại"))
    }
  };
  const [cityList, setCityList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  useEffect(() => {
    const loadCity = async () => {
      try {
        const res = await userApi.getCity();
        setCityList(res.provinces);
      } catch (error) {
        console.log(error);
      }
    };
    loadCity()
  }, []);
  useEffect(() => {
    const loadDistrict = async (city_id) => {
      if (city_id) {
        try {
          const res = await userApi.getDistrict(city_id);
          setDistrictList(res.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    loadDistrict(store_formik.values.city);
  }, [store_formik.values.city]);
  useEffect(() => {
    const loadWard = async (city_id, district_id) => {
      if (city_id && district_id) {
        try {
          const res = await userApi.getWard(city_id, district_id);
          setWardList(res.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    loadWard(store_formik.values.city, store_formik.values.district);
  }, [store_formik.values.city, store_formik.values.district]);
  return (
    <Box className={classes.background}>
      <Paper className={classes.container}>
        <div className={classes.paper}>
          <Typography component="h1" variant="h3" gutterBottom>
            Đăng kí
          </Typography>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            style={{ width: 300 }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep !== 1 ? (
            <UserInfo user_formik={user_formik} />
          ) : (
            <StoreInfo store_formik={store_formik} cityList={cityList} districtList={districtList} wardList={wardList} />
          )}
          <Box className={classes.button}>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Trở về
            </Button>
            {activeStep !== 1 ? (
              <Button onClick={handleNext} variant="contained" color="primary" disabled={!(user_formik.isValid && Object.keys(user_formik.touched).length > 0)}>
                Tiếp tục
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleSignUp}
                disabled={!(store_formik.isValid && Object.keys(store_formik.touched).length > 0)}
              >
                Đăng ký
              </Button>
            )}
          </Box>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Typography
                style={{ textDecoration: "none" }}
                component={Link}
                to="/login"
              >
                Đã có tài khoản ? Đăng nhập ngay
              </Typography>
            </Grid>
          </Grid>
        </div>
      </Paper>
    </Box>
  );
}

function getSteps() {
  return ["Điền thông tin người dùng", "Điền thông tin cửa hàng"];
}
