import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import useStyles from "./styles";
import { Paper } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logInHandler, empLogInHandler } from "../../store/actionCreator";
import { useFormik  } from "formik";
import * as Yup from "yup";
export default function SignIn() {
  const [isOwner, setIsOwner] = useState(true);
  const loginFormik = useFormik({
    initialValues: {
      phone: "",
      password: ""
    },
    validationSchema : Yup.object({
      user_name: Yup.string()
        .required("Nhập tên đăng nhập"),
      password: Yup.string().required("Nhập mật khẩu"),
    })
  }
  )
  const dispatch = useDispatch();
  const classes = useStyles();
  return (
    <Box className={classes.background}>
      <Paper className={classes.container}>
        <Box className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h3" gutterBottom color="textSecondary">
            CỬA HÀNG CỦA BẠN
          </Typography>
          <Typography variant="h5">Đăng nhập</Typography>
          <Box className={classes.form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Tên đăng nhập"
                name="user_name"
                autoFocus
                value = {loginFormik.values.user_name}
                onChange= {loginFormik.handleChange}
                error={loginFormik.touched.user_name && loginFormik.errors.user_name}
                helperText={loginFormik.touched.user_name ? loginFormik.errors.user_name : null}
                onBlur={loginFormik.handleBlur}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mật khẩu"
                type="password"
                value = {loginFormik.values.password}
                onChange= {loginFormik.handleChange}
                error={loginFormik.touched.password && loginFormik.errors.password}
                helperText={loginFormik.touched.password ? loginFormik.errors.password : null}
                onBlur={loginFormik.handleBlur}
              />
              {/* <Grid justifyContent="flex-end"> */}
              <Box style={{display:'flex',justifyContent:"flex-end" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={isOwner}
                        color="primary"
                        onChange={() => setIsOwner(!isOwner)}
                      />
                    }
                    label="Nhân viên"
                    labelPlacement="start"

                  />
               </Box>
               {/* </Grid> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                // && Object.keys(loginFormik.touched).length > 0
                disabled = {!(loginFormik.isValid )}
                onClick={() => {
                  if (isOwner) {
                    dispatch(logInHandler(loginFormik.values.user_name, loginFormik.values.password));
                  } else {
                    dispatch(empLogInHandler(loginFormik.values.user_name, loginFormik.values.password));
                  }
                }}
              >
                Đăng nhập
              </Button>
            </form>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Typography
                  style={{ textDecoration: "none" }}
                  component={Link}
                  to="/signup"
                >
                  Chưa có tài khoản? Đăng kí cửa hàng mới
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
