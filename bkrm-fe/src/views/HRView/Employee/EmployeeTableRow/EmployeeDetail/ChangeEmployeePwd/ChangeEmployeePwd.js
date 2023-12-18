import { Typography, Grid, TextField,Button } from "@material-ui/core";
import React from "react";
import SimpleModal from "../../../../../../components/Modal/ModalWrapper";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector,useDispatch } from "react-redux";
import {statusAction} from "../../../../../../store/slice/statusSlice"
import userApi from "../../../../../../api/userApi"

const ChangeEmployeePwd = (props) => {
    const { open, handleClose, employeeDetail } = { ...props };
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            owner_password:"",
            password: "",
            confirm_password: "",
        },
        validationSchema: Yup.object({
            owner_password: Yup.string()
                .required("Nhập mật khẩu")
                .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
            password: Yup.string()
                .required("Nhập mật khẩu")
                .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
            confirm_password: Yup.string()
                .required("Nhập lại mật khẩu")
                .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp"),
        }),
    });
    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const dispatch= useDispatch()
    const handleChangePassword = async () => {  
        closeModalAndResetData()
        try{
            const response = userApi.owenerChangePassword(store_uuid,employeeDetail.uuid,{
                owner_password:formik.values.owner_password,
                employee_password: formik.values.password
            })
            dispatch(statusAction.successfulStatus("Đổi mật khẩu thành công"))
        }catch(error){
            dispatch(statusAction.successfulStatus("Đổi mật khẩu thất bại"))
        }
    }
    const closeModalAndResetData = () => {
        formik.resetForm()
        handleClose()
    }
    return (
        <SimpleModal open={open} handleClose={closeModalAndResetData}>
            <Typography variant="h4" gutterBottom>
                Đổi mật khẩu
            </Typography>

            <Grid container spacing={2} style={{ maxWidth: 600, marginTop: 10 }}>
                <Grid item xs={12}>
                    <TextField
                        variant="filled"
                        fullWidth
                        label="Tên nhân viên"
                        value={employeeDetail.name}
                        disabled
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        type="password"
                        name="owner_password"
                        variant="outlined"
                        required
                        fullWidth
                        label="Mật khẩu chủ cửa hàng"
                        onChange={formik.handleChange}
                        value={formik.values.owner_password}
                        error={formik.touched.owner_password && formik.errors.owner_password}
                        helperText={formik.touched.owner_password ? formik.errors.owner_password : null}
                        onBlur={formik.handleBlur}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        type="password"
                        name="password"
                        variant="outlined"
                        required
                        fullWidth
                        label="Mật khẩu mới"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        error={formik.touched.password && formik.errors.password}
                        helperText={formik.touched.password ? formik.errors.password : null}
                        onBlur={formik.handleBlur}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        type="password"
                        name="confirm_password"
                        variant="outlined"
                        required
                        fullWidth
                        label="Nhập lại mật khẩu"
                        onChange={formik.handleChange}
                        value={formik.values.confirm_password}
                        error={formik.touched.confirm_password && formik.errors.confirm_password}
                        helperText={formik.touched.confirm_password ? formik.errors.confirm_password : null}
                        onBlur={formik.handleBlur}
                    />
                </Grid>
            </Grid>
            <Grid
                item
                xs={12}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    paddingTop: 20,
                }}
            >
                <Button
                    variant="contained"
                    size="small"
                    style={{ marginRight: 20 }}
                    onClick={closeModalAndResetData}
                >
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={handleChangePassword}
                    style={{ marginRight: 20 }}
                    disabled={!(formik.isValid && Object.keys(formik.touched).length > 0)}
                >
                    Sửa
                </Button>
            </Grid>
        </SimpleModal>
    );
};

export default ChangeEmployeePwd;
