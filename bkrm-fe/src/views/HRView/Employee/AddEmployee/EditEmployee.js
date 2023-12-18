import React, { useEffect } from "react";
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
import { useFormik } from "formik";

//import project
import NumberFormatCustom from "../../../../components/TextField/NumberFormatCustom";
import MultipleSelect from "../../../../components/MultipleSelect/MultipleSelect";
import { EmailRounded, YouTube } from "@material-ui/icons";
import { verifyToken } from "../../../../store/actionCreator";
import branchApi from "../../../../api/branchApi";
import VNDInput from "../../../../components/TextField/NumberFormatCustom";
import * as Yup from "yup";
// api
import { useDispatch, useSelector } from "react-redux";
import employeeApi from "../../../../api/employeeApi";
import ConfirmPopup from "../../../../components/ConfirmPopUp/ConfirmPopUp";
import userAPi from "../../../../api/userApi";
import { statusAction } from "../../../../store/slice/statusSlice";
import { format } from "date-fns";

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
  { id: 4, name: "product", description: "Sản phẩm" },
  { id: 5, name: "report", description: "Báo cáo" },
];

const EditEmployee = ({ handleClose, open, employee, fromAvatar }) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const dispatch = useDispatch();
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

  // employee info
  // const [typeSalary, setTypeSalary] = React.useState("");
  const [branches, setBranches] = React.useState([]);
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
  const [imageToShow, setImageToShow] = React.useState(employee.img_url);
  const [image, setImage] = React.useState(null);
  console.log('12312312', format(new Date(employee.date_of_birth), "yyyy-MM-dd"))
  const formik = useFormik({
    initialValues: {
      uuid: employee.uuid || "",
      name: employee.name || "",
      user_name: employee.user_name || "",
      phone: employee.phone,
      permissions: employee.permissions?.map((p) => p.id) || [],
      email: employee.email || "",
      salary: employee.salary || "",
      salary_type: employee.salary_type || "",
      id_card_num: employee.id_card_num || "",
      gender: employee.gender || "",
      date_of_birth: employee.date_of_birth || "",
      address: employee.address || "",
      branches: employee.branches?.map((b) => b.id) || [],
      new_password: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Bắt buộc!"),
      user_name: Yup.string().required("Bắt buộc!"),
      phone: Yup.string()
        .length(10, "Số điện thoại không chính xác")
        // .required("Nhập số điện thoại")
        .matches(/^\d+$/, "Số điển thoại không chính xác"),
      branches: Yup.array().min(1, "Ít nhất một chi nhánh"),
      email: Yup.string().email("Email không chính xác"),
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
        } else {
          formData.append(value, values[value]);
        }
      }

      if (image) {
        formData.append("image", image);
      }

      try {
        const response = await employeeApi.updateEmployee(
          store_uuid,
          employee.uuid,
          formData
        );
        handleClose("Success");
      } catch (error) {
        handleClose("Failed");
      }
    },
  });
  // const [branches, setBranches] = React.useState([]);

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

  // redux

  //   const handleSelectPermission = (selected) => {
  //     let permissions = selected.map((permission) => permission.key);
  //     setPermissions(permissions);
  //   };

  console.log(employee);
  const handleEditProfile = async (password) => {
    setConfirm(false);
    handleClose();
    try {
      const rs = await userAPi.confirmPassword(info.store.uuid, {
        user_name: info.user.user_name,
        password: password,
        role: info.role,
      });
      if (rs.message === "success") {
        let formData = new FormData();
        formData.append("date_of_birth", formik.values.date_of_birth);
        formData.append("email", formik.values.email);
        formData.append("phone", formik.values.phone);
        formData.append("gender", formik.values.gender);
        formData.append("id_card_num", formik.values.id_card_num);
        formData.append("address", formik.values.address);
        formData.append("role", info.role);
        if (formik.values.new_password != "") {
          formData.append("new_password", formik.values.new_password);
        }
        if (image) {
          formData.append("image", image);
        }
        const rs_edit = await userAPi.editProfile(info.store.uuid, formData);
        if (rs_edit.data === "Edit profile successfully") {
          dispatch(statusAction.successfulStatus("Lưu thay đổi"));
          dispatch(verifyToken());
        } else {
        }
      } else {
        dispatch(statusAction.failedStatus("Lưu thất bại"));
      }
    } catch (error) {
      dispatch(statusAction.failedStatus("Sửa thất bại"));
    }
  };
  const [confirm, setConfirm] = React.useState(false);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <ConfirmPopup
        open={confirm}
        handleClose={() => setConfirm(false)}
        passwordRequired={true}
        handleConfirm={handleEditProfile}
        message={
          <Typography>
            <b>Nhập mật khẩu để lưu thay đổi</b>
          </Typography>
        }
      />
      <DialogTitle id="form-dialog-title">
        <Typography className={classes.headerTitle} variant="h5">
          {fromAvatar ? "Thông tin cá nhân" : "Sửa thông tin nhân viên"}
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
            <Grid item xs={6}>
              <TextField
                id="name"
                name="name"
                label={fromAvatar ? "Họ tên" : "Tên nhân viên"}
                value={formik.values.name}
                variant="outlined"
                fullWidth
                size="small"
                // name="name"
                onChange={formik.handleChange}
                disabled={fromAvatar}
              />

              {formik.errors.name && formik.touched.name && (
                <FormHelperText error>{formik.errors.name}</FormHelperText>
              )}

              {/* <TextField
                id="name"
                name="user_name"
                label="Tên đăng nhập"
                value={formik.values.user_name}
                variant="outlined"
                fullWidth
                size="small"
                // name="name"
                onChange={formik.handleChange}
              />

              {formik.errors.user_name && formik.touched.user_name && (
                <FormHelperText error>{formik.errors.user_name}</FormHelperText>
              )} */}

              <TextField
                id="date"
                name="date_of_birth"
                label="Ngày sinh"
                type="date"
                defaultValue=""
                variant="outlined"
                size="small"
                fullWidth
                value={format(new Date(formik.values.date_of_birth), "yyyy-MM-dd")}
                className={classes.textField}
                InputLabelProps={{ shrink: true }}
                onChange={formik.handleChange}
              />

              <TextField
                id="outlined-basic"
                name="id_card_num"
                label="CMND"
                value={formik.values.id_card_num}
                variant="outlined"
                fullWidth
                size="small"
                onChange={formik.handleChange}
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
                  onChange={formik.handleChange}
                  label="Gender"
                  value={formik.values.gender}
                  name="gender"
                >
                  <MenuItem value="male">Nam</MenuItem>
                  <MenuItem value="female">Nữ</MenuItem>
                </Select>
              </FormControl>

              <TextField
                id="outlined-basic"
                label="Số điện thoại"
                value={formik.values.phone}
                variant="outlined"
                fullWidth
                size="small"
                name="phone"
                onChange={formik.handleChange}
              />
              {formik.errors.phone && formik.touched.phone && (
                <FormHelperText error>{formik.errors.phone}</FormHelperText>
              )}

              <TextField
                id="outlined-basic"
                label="Email"
                name="email"
                value={formik.values.email}
                variant="outlined"
                fullWidth
                size="small"
                onChange={formik.handleChange}
              />

              {formik.errors.email && formik.touched.email && (
                <FormHelperText error>{formik.errors.email}</FormHelperText>
              )}
              {info.role != "owner" && (
                <TextField
                  id="outlined-basic"
                  label="Địa chỉ"
                  value={formik.values.address}
                  variant="outlined"
                  fullWidth
                  size="small"
                  onChange={formik.handleChange}
                  name="address"
                />
              )}
            </Grid>
            <Grid item xs={6}>
              {/* Select lưong */}
              {fromAvatar && (
                <TextField
                  id="outlined-basic"
                  label="Mật khẩu mới"
                  variant="outlined"
                  fullWidth
                  size="small"
                  onChange={formik.handleChange}
                  name="new_password"
                  type="password"
                />
              )}
              <FormControl
                className={classes.formControl}
                fullWidth
                size="small"
                variant="outlined"
                style={{ marginTop: 8 }}
                disabled={fromAvatar}
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  Lương{" "}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  onChange={formik.handleChange}
                  label="Salary"
                  name="salary_type"
                  value={formik.values.salary_type}
                >
                  <MenuItem value="none">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="fix">Lương cố định</MenuItem>
                  <MenuItem value="per-shift">Lương theo ca</MenuItem>
                </Select>
              </FormControl>

              <VNDInput
                label="Mức lương"
                variant="outlined"
                fullWidth
                size="small"
                value={formik.values.salary}
                disabled={fromAvatar}
                name="salary"
                // value={values.numberformat}
                // onChange={handleChange}
                onChange={formik.handleChange}
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
                disabled={fromAvatar}
              >
                <InputLabel
                  style={{
                    background: "white",
                    padding: "0px 4px",
                    left: "-2px",
                  }}
                  id="branchSelect"
                >
                  Chức năng
                </InputLabel>
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
                >
                  {permissionChoices.map((branch) => (
                    <MenuItem key={branch.name} value={branch.id}>
                      {branch.description}
                    </MenuItem>
                  ))}
                </Select>

                {formik.errors.permissions && formik.touched.permissions && (
                  <FormHelperText error>
                    {formik.errors.permissions}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl
                className={classes.formControl}
                fullWidth
                size="small"
                variant="outlined"
                style={{ marginTop: 8 }}
                disabled={fromAvatar}
              >
                <InputLabel id="branchSelect">Chi nhánh </InputLabel>
                <Select
                  multiple={info.role === "owner" ? false : true}
                  variant="outlined"
                  fullWidth
                  id="branches"
                  name="branches"
                  onChange={formik.handleChange}
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
                    <MenuItem key={branch.name} value={branch.id}>
                      {branch.name}
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
          onClick={() => handleClose(null)}
          variant="contained"
          size="small"
          color="secondary"
        >
          Huỷ
        </Button>
        <Button
          onClick={fromAvatar ? () => setConfirm(true) : formik.handleSubmit}
          variant="contained"
          size="small"
          color="primary"
        >
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEmployee;
