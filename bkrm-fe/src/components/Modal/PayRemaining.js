import { Box, Button, Grid, Typography } from "@material-ui/core";
import { useFormik } from "formik";
import React, { useState } from "react";
import VNDInput, { VNDFormat } from "../TextField/NumberFormatCustom";
import ModalWrapper from "./ModalWrapper";
import * as Yup from "yup";
import purchaseOrderApi from "../../api/purchaseOrderApi";
import { useDispatch, useSelector } from "react-redux";
import { statusAction } from "../../store/slice/statusSlice";
const PayRemaining = (props) => {
  const { open, editApiCall, reloadDetail } = props;
  const handleClose = () => {
    props.handleClose();
    formik.resetForm();
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { pay: props.debt },
    validationSchema: Yup.object({
      pay: Yup.number()
        .required("Vui lòng nhập số tiền")
        .lessThan(props.debt + 1, "Tiền trả phải ít hơn nợ")
        .moreThan(0, "Tiền trả phải lớn hơn 0"),
    }),
  });
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    handleClose();
    try {
      const response = await editApiCall(store_uuid, branch_uuid, props.uuid, {
        paid_amount: Number(formik.values.pay) + props.paid,
        status: formik.values.pay === props.debt ? "closed" : "debt",
      });
      dispatch(statusAction.successfulStatus("Trả thêm tiền thành công"));
      props.onReload();

      reloadDetail();
    } catch (error) {
      console.log(error);
      dispatch(statusAction.failedStatus("Trả thêm tiền thất bại"));
    }
  };
  return (
    <ModalWrapper open={open} handleClose={handleClose} title="Trả thêm">
      {props.title}
      <Grid
        container
        spacing={2}
        style={{ maxWidth: "100%", width: 400, marginTop: 15 }}
        flexDirection="row"
        alignItems="center"
      >
        <Grid item xs={3}>
          <Typography variant="h5">Đã trả</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h5">
            <VNDFormat value={props.paid} />
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h5">Còn nợ</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h5">
            <VNDFormat value={props.debt} />
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h5">Trả lần này</Typography>
        </Grid>
        <Grid item xs={9}>
          <VNDInput
            name="pay"
            size="small"
            label="Số tiền muốn trả"
            value={formik.values.pay}
            error={formik.errors.pay && formik.touched.pay}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={formik.touched.pay ? formik.errors.pay : null}
          />
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h5">Còn lại</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h5">
            {" "}
            <VNDFormat value={props.debt - formik.values.pay} />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" flexDirection="row" justifyContent="flex-end">
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={handleClose}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              size="small"
              style={{ marginLeft: 20 }}
              color="primary"
              disabled={!(formik.isValid && Object.keys(formik.touched).length > 0)}
              onClick={handleSubmit}
            >
              Xác nhận
            </Button>
          </Box>
        </Grid>
      </Grid>
    </ModalWrapper>
  );
};

export default PayRemaining;
