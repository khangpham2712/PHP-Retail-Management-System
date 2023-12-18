import React, {useState,useEffect} from "react";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Dialog,
} from "@material-ui/core";

//import project
import branchApi from "../../../../api/branchApi";

// api
import { useSelector } from "react-redux";
import employeeApi from "../../../../api/employeeApi";
import * as Yup from "yup";
import { useFormik } from "formik";
import VNDInput from "../../../../components/TextField/NumberFormatCustom";
import CheckIcon from "@material-ui/icons/Check";
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .MuiTextField-root": {
        marginTop: theme.spacing(1),
      },
    },
    headerTitle: {
      fontSize: "1.125rem",
    },
    ava: {
      width: theme.spacing(7),
      height: theme.spacing(7),
      marginBottom: 15,
    },
    input: {
      display: "none",
    },
  })
);

let permissionChoices = [
  { id: 1, name: "inventory", description: "Kho hàng" },
  { id: 2, name: "employee", description: "Nhân sự" },
  { id: 3, name: "sales", description: "Bán hàng" },
  // { id: 4, name: "product", description: "Sản phẩm" },
  { id: 5, name: "report", description: "Quản lý" },
];

const AddEmployee = (props) => {
  const { handleClose, open,setOpen} = props;

  // tam thoi
  const statusState = "Success";

  const [userNameError, setUserNameError] = React.useState(false);
  const [clicked, setClicked] =useState(false)

  const theme = useTheme();
  const classes = useStyles(theme);

  // đổi thành state sau (price format)
  const [values, setValues] = React.useState({
    numberformat: "",
  });
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const [branches, setBranches] = React.useState([]);
  const [image, setImage] = React.useState("");
  const [imageToShow, setImageToShow] = React.useState("")

  const formik = useFormik({
    initialValues: {
      uuid: "",
      name: "",
      user_name: "",
      phone: "",
      permissions: [],
      password: "",
      email: "",
      salary: "",
      salary_type: "",
      id_card_num: "",
      gender: "",
      date_of_birth: "",
      address: "",
      branches: [],
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Bắt buộc!"),
      user_name: Yup.string().required("Bắt buộc!"),
      phone: Yup.string()
      .length(10, "Số điện thoại không chính xác")
      // .required("Nhập số điện thoại")
      .matches(/^\d+$/, "Số điển thoại không chính xác"),
      email: Yup.string().email("Email không chính xác"),
      password: Yup.string().required("Bắt buộc!"),
      branches: Yup.array().min(1, "Ít nhất một chi nhánh"),
      permissions: Yup.array().min(1, "Ít nhất một chức năng"),
      email: Yup.string().email("Email không chính xác"),
    
    }),

    onSubmit: async (values, actions) => {
      let formData = new FormData();

      for (let value in values) {
        if (value === "permissions") {
          for (var i = 0; i < values["permissions"].length; i++) {
            formData.append("permissions[]", values["permissions"][i]);
          }
        } else if (value === "branches") {
          for (var i = 0; i < values["branches"].length; i++) {
            formData.append("branches[]", values["branches"][i]);
          }
        } else if (value === "password") {
          formData.append(value, values[value]);
          formData.append("password_confirmation", values[value]);
        } else {
          formData.append(value, values[value]);
        }
      }

      formData.append("image", image);
      formData.append("status", "active");


      try {
        setClicked(true)
        const response = await employeeApi.createEmployee(
          store_uuid,
          formData
        );
        setOpen(false)
        handleClose("Success");
      } catch (err) {
        // error("Lỗi", "Tên đăng nhập đã tồn tại")
        setUserNameError(true)
        setClicked(false)
       
      }
    },
  });

  // redux
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;

  function getColorSelected (selectedData,item  ){
    return selectedData.includes(item) ?  theme.customization.primaryColor[50]:null 
  }

  React.useEffect(() => {
    const loadBranches = async () => {
      try {
        const response = await branchApi.getAllBranches(store_uuid);
        setBranches(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (store_uuid) {

      loadBranches();
    }
  }, [store_uuid]);

    useEffect(() =>{
      if(userNameError) {setUserNameError(false)}
    },[formik.values.user_name])

   
  return (
    <Dialog
      open={open}
      onClose={()=> setOpen(false)}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <Typography className={classes.headerTitle} variant="h5">
          Thêm nhân viên
        </Typography>
      </DialogTitle>

      <DialogContent>
        <div className={classes.root}>
          <Grid container direction="row">
            <Avatar
              alt="Remy Sharp"
              className={classes.ava}
              src={imageToShow}
            />
            <input
              accept="image/*"
              className={classes.input}
              id="contained-button-file"
              multiple
              type="file"
              // accept="image/*"
              capture="environment"
              onChange={(event) => {
                setImage(event.target.files[0]);

                // read the selected file and display on the avata
                var file = event.target.files[0];
                var reader = new FileReader();
                reader.onloadend = function () {
                  setImageToShow(reader.result);
                };

                reader.readAsDataURL(file);
              }}
            />
            <label htmlFor="contained-button-file">
              <Button
                variant="contained"
                component="span"
                style={{ height: 22, textTransform: "none", marginLeft: 20 }}
              >
                Chọn ảnh 
              </Button>
            </label>
          </Grid>

          <Grid
            container
            direction="row"
            justifyContent="space-around"
            spacing={2}
          >
            <Grid item sm={6}>
              <TextField
                id="outlined-basic"
                label="Tên nhân viên"
                required
                value={formik.values.name}
                name="name"
                variant="outlined"
                fullWidth
                size="small"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {formik.errors.name && formik.touched.name && (
                <FormHelperText error>{formik.errors.name}</FormHelperText>
              )}

              <TextField
                id="outlined-basic"
                label="Số điện thoại"
                value={formik.values.phone}
                variant="outlined"
                name="phone"
                fullWidth
                size="small"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {formik.errors.phone && formik.touched.phone && (
                <FormHelperText error>{formik.errors.phone}</FormHelperText>
              )}

              <TextField
                id="outlined-basic"
                label="Tên đăng nhập"
                required
                value={formik.values.user_name}
                variant="outlined"
                name="user_name"
                fullWidth
                size="small"
                onChange={formik.handleChange }
                onBlur={formik.handleBlur}
              />

              {formik.errors.user_name && formik.touched.user_name && (
                <FormHelperText error>{formik.errors.user_name}</FormHelperText>
              )}
              { userNameError && (
                <FormHelperText error>Tên đăng nhập đã tồn tại</FormHelperText>
              )}

              <TextField
                id="outlined-basic"
                label="Mật khẩu tài khoản"
                required
                variant="outlined"
                fullWidth
                name="password"
                type={"password"}
                size="small"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {formik.errors.password && formik.touched.password && (
                <FormHelperText error>{formik.errors.password}</FormHelperText>
              )}
             

              <TextField
                id="date"
                label="Ngày sinh"
                type="date"
                defaultValue="" //null
                variant="outlined"
                size="small"
                name="date_of_birth"
                fullWidth
                value={formik.values.date_of_birth}
                className={classes.textField}
                InputLabelProps={{ shrink: true }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <TextField
                id="outlined-basic"
                label="CMND"
                value={formik.values.id_card_num}
                variant="outlined"
                name="id_card_num"
                fullWidth
                size="small"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <FormControl
                className={classes.formControl}
                fullWidth
                size="small"
                variant="outlined"
                style={{ marginTop: 8 }}
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  Giới tính{" "}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  name="gender"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Gender"
                  value={formik.values.gender}
                >
                  <MenuItem value="male">Nam</MenuItem>
                  <MenuItem value="female">Nữ</MenuItem>
                </Select>
              </FormControl>

              <TextField
                id="outlined-basic"
                label="Email"
                name="email"
                value={formik.values.email}
                variant="outlined"
                fullWidth
                size="small"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {formik.errors.email && formik.touched.email && (
                <FormHelperText error>{formik.errors.email}</FormHelperText>
              )}

              <TextField
                id="outlined-basic"
                label="Địa chỉ"
                name="address"
                value={formik.values.address}
                variant="outlined"
                fullWidth
                size="small"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>

            <Grid item sm={6}>
              {/* Select lưong */}
              <FormControl
                className={classes.formControl}
                fullWidth
                size="small"
                variant="outlined"
                style={{ marginTop: 8 }}
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  Lương{" "}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  name="salary_type"
                  value={formik.values.salary_type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="none">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="fix">Lương cố định</MenuItem>
                  <MenuItem value="per-shift">Lương theo ca</MenuItem>
                </Select>
              </FormControl>

              {/* <TextField
                label="Mức lương"
                variant="outlined"
                fullWidth
                size="small"
                value={formik.values.salary}
                name="salary"
                // value={values.numberformat}
                // onChange={handleChange}
                onChange={formik.handleChange}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
              /> */}
              <VNDInput
                label="Mức lương"
                variant="outlined"
                fullWidth
                size="small"
                value={formik.values.salary}
                name="salary"
                // value={values.numberformat}
                // onChange={handleChange}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                // InputProps={{
                //   inputComponent: NumberFormatCustom,
                // }}
              />

              {/* <TextField id="outlined-basic" label="Quyền" variant="outlined" fullWidth size="small"/> */}

              <FormControl
                className={classes.formControl}
                fullWidth
                size="small"
                variant="outlined"
                style={{ marginTop: 8 }}
              >
                <InputLabel id="branchSelect">Chức năng</InputLabel>
                <Select
                  multiple
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="permissions"
                  value={formik.values.permissions}
                  renderValue={(selected) =>
                    selected
                      .map((permission) => {
                        return permissionChoices.find(
                          (p) => p.id === permission
                        )?.description;
                      })
                      .join(", ")
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {permissionChoices.map((branch) => (
                    <MenuItem key={branch.name} value={branch.id} style={{backgroundColor:getColorSelected(formik.values.permissions, branch.id) }}>
                       <Grid container justifyContent='space-between'>
                      {branch.description}
                    {  getColorSelected(formik.values.permissions, branch.id)? <CheckIcon color='primary'/> :null}
                      </Grid >
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {formik.errors.permissions && formik.touched.permissions && (
                <FormHelperText error>
                  {formik.errors.permissions}
                </FormHelperText>
              )}

              <FormControl
                className={classes.formControl}
                fullWidth
                size="small"
                variant="outlined"
                style={{ marginTop: 8 }}
              >
                <InputLabel id="branchSelect">Chi nhánh </InputLabel>
                <Select
                  multiple
                  variant="outlined"
                  fullWidth
                  id="branches"
                  name="branches"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  size="small"
                  value={formik.values.branches}
                  renderValue={(selected) =>
                    selected
                      .map((empWorkBranch) => {
                        return branches.find(
                          (branch) => branch.id === empWorkBranch
                        )?.name;
                      })
                      .join(", ")
                  }
                >
                  {branches.map((branch) => (
                    <MenuItem key={branch.name} value={branch.id} style={{backgroundColor:getColorSelected(formik.values.branches, branch.id) }}>
                      <Grid container justifyContent='space-between'>
                      {branch.name}
                      {  getColorSelected(formik.values.branches, branch.id)? <CheckIcon color='primary'/> :null}
                      </Grid >
                    </MenuItem>
                  ))}
                </Select>

                {formik.errors.branches && formik.touched.branches && (
                  <FormHelperText error>
                    {formik.errors.branches}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={()=> setOpen(false)}
          variant="contained"
          size="small"
          color="secondary"
        >
          Huỷ
        </Button>
        <Button
          onClick={formik.handleSubmit}
          variant="contained"
          size="small"
          color="primary"
          disabled = {!(formik.isValid && Object.keys(formik.touched).length > 0) || clicked}
          // disabled = { clicked}

        >
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployee;
