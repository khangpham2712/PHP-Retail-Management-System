import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@material-ui/core/styles";
//import library
import {
  Button,
  TextField,
  Typography,
  Grid,
  Box,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Tooltip,
  Dialog,
  FormControlLabel,
  Switch,
  Collapse,
  Paper,
  Card,
  CardHeader,
  Checkbox,
  ListItem,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
//import project
import VNDInput, {
  ThousandSeperatedInput,
} from "../../../../../components/TextField/NumberFormatCustom";
// import img
import useStyles from "./styles";

import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import setting from "../../../../../assets/constant/setting";
import "react-quill/dist/quill.snow.css";

import "antd/dist/antd.css";
import cashBookApi from "../../../../../api/cashBookApi";
import { Row } from "antd";
import { statusAction } from "../../../../../store/slice/statusSlice";
// import "../../../../index.css

const CashBookPopUp = (props) => {
  const { handleClose, open, isEdit, row } = props;
  const [sending, setSending] = useState(false);

 
  const productFormik = useFormik({
    initialValues: {
      value: isEdit ? row.value : "",
      user_type: isEdit ? row.user_type : "",
      user_name: isEdit ? row.user_name : "",
      is_calculated: isEdit ? row.is_calculated : false,
      type: isEdit ? row.type : "receive",
      note: isEdit ? row.note : "",
      is_minus: isEdit ? row.is_minus : false,
      payment_method: isEdit ? row.payment_method : "cash",
    },
    validationSchema: Yup.object({
      value: Yup.number()
        .moreThan(-1, "Giá trị không được âm")
        .required("Nhập giá trị"),
      user_name: Yup.string().required("Nhập tên"),
    }),

  });

  const submit = async ()=> {
    const body = { ...productFormik.values, created_user_name: info.user.name };

    try {
    
      setSending(true);
      if (!isEdit) {
        const res = await cashBookApi.create(info.store.uuid, info.branch.uuid, body);
      } else {
        const res = await cashBookApi.update(info.store.uuid, info.branch.uuid, row.id ,body);
      }
      
      handleClose();
      statusAction.successfulStatus("Tạo phiếu thu/chi thành công");
    } catch {
      statusAction.failedStatus("Tạo thất bại");
    }
    setSending(false);
  }

  // redux
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const dispatch = useDispatch();
  // dispatch(infoActions.setStore({...info.store, general_configuration: "{\"inventory\":{\"status\":true},\"recommendedProduct\":{\"status\":true},\"variation\":{\"status\":true},\"expiryDate\":{\"status\":true},\"customerScore\":{\"status\":false,\"value\":10000,\"exceptDiscountProduct\":false,\"exceptDiscountInvoice\":false,\"exceptVoucher\":false},\"email\":{\"status\":false,\"emailAddress\":\"\",\"password\":\"\"},\"notifyDebt\":{\"status\":true,\"checkDebtAmount\":true,\"debtAmount\":\"500000\",\"checkNumberOfDay\":false,\"numberOfDay\":\"15\",\"typeDebtDay\":\"firstDebt\",\"canNotContinueBuy\":false,\"canNotContinueDebt\":false},\"returnLimit\":{\"status\":false,\"day\":7},\"canFixPriceSell\":{\"status\":false,\"cart\":false,\"import\":true,\"returnCart\":true,\"returnImport\":true},\"printReceiptWhenSell\":{\"status\":true,\"cart\":true,\"import\":false,\"returnCart\":false,\"returnImport\":false,\"order\":false,\"checkInventroy\":false},\"discount\":{\"status\":true,\"applyMultiple\":false,\"applyOnline\":true},\"voucher\":{\"status\":true},\"delivery\":{\"status\":true},\"vat\":{\"status\":false,\"listCost\":[{\"key\":\"1\",\"costName\":\"\",\"value\":0,\"type\":\"%\"}]},\"orderLowStock\":{\"status\":true,\"choiceQuantity\":\"select\",\"selectQuantity\":\"latest\",\"inputQuantity\":10,\"selectSuplier\":\"latest\"},\"autoApplyDiscount\":{\"status\":true}}"}));

  const theme = useTheme();
  const classes = useStyles(theme);

  const [reset, setReset] = useState(true);
  const onReset = () => {
    setReset((reset) => !reset);
  };

  const handleCloseAndReset = () => {
    handleClose();
    productFormik.resetForm();
  };

  const store_setting = info.store.general_configuration
    ? JSON.parse(info.store.general_configuration)
    : setting;

  return (
    <Dialog
      open={open}
      onClose={handleCloseAndReset}
      aria-labelledby="form-dialog-title"
      maxWidth="md"
    >
      <Box className={classes.root}>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          style={{ marginBottom: 20 }}
        >
          <Typography className={classes.headerTitle} variant="h5">
            Thêm phiếu thu/chi
          </Typography>
        </Box>
        <Grid
          container
          direction="row"
          justifyContent="space-around"
          spacing={2}
        >
          <Grid item sm={7} xs={12}>
            <TextField
              required
              label={"Tên người nộp/ chi"}
              variant="outlined"
              fullWidth
              size="small"
              name="user_name"
              onChange={productFormik.handleChange}
              value={productFormik.values.user_name}
              error={
                productFormik.touched.user_name &&
                productFormik.errors.user_name
              }
              helperText={
                productFormik.touched.user_name
                  ? productFormik.errors.user_name
                  : null
              }
              onBlur={productFormik.handleBlur}
              type="text"
            />
            <TextField
              required
              label="Đối tượng"
              variant="outlined"
              fullWidth
              className={classes.margin}
              size="small"
              name="user_type"
              onChange={productFormik.handleChange}
              value={productFormik.values.user_type}
              onBlur={productFormik.handleBlur}
              select
            >
              <option key={"customer"} value={"customer"}>
                Khách hàng
              </option>
              <option key={"supplier"} value={"supplier"}>
                Nhà cung cấp
              </option>
              <option key={"Khác"} value={"Khác"}>
                Khác
              </option>
            </TextField>

            <TextField
              required
              label="Phương thức"
              variant="outlined"
              fullWidth
              size="small"
              className={classes.margin}
              name="payment_method"
              onChange={productFormik.handleChange}
              select
            >
              <option key={"cash"} value={"cash"}>
                Tiền mặt
              </option>
              <option key={"card"} value={"card"}>
                Thẻ
              </option>
            </TextField>
            <TextField
              label="Ghi chú"
              variant="outlined"
              fullWidth
              size="small"
              className={classes.margin}
              name="note"
              onChange={productFormik.handleChange}
              value={productFormik.values.note}
            />
          </Grid>
          <Grid item sm={5} xs={12}>
            <VNDInput
              required
              label="Giá trị"
              variant="outlined"
              fullWidth
              size="small"
              name="value"
              value={productFormik.values.value}
              onChange={productFormik.handleChange}
              error={productFormik.touched.value && productFormik.errors.value}
              helperText={
                productFormik.touched.value ? productFormik.errors.value : null
              }
              onBlur={productFormik.handleBlur}
            />

            <FormControlLabel
              fullWidth
              control={
                <Checkbox
                  name="is_minus"
                  checked={productFormik.values.is_minus}
                  onChange={productFormik.handleChange}
                />
              }
              label="Chi"
            />

            <FormControlLabel
              fullWidth
              control={
                <Checkbox
                  name="is_calculated"
                  checked={productFormik.values.is_calculated}
                  onChange={productFormik.handleChange}
                />
              }
              label="Hạch toán vào kết quả kinh doanh"
            />
          </Grid>
        </Grid>

        {/* Button */}
        <Grid
          item
          xs={12}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={handleCloseAndReset}
            variant="contained"
            size="small"
            color="secondary"
            style={{ marginRight: 20 }}
          >
            Huỷ
          </Button>
          <Button
            onClick={async () => {
                submit()
            }}
            variant="contained"
            size="small"
            color="primary"
            disabled={sending || !productFormik.isValid}
          >
            Lưu
          </Button>
        </Grid>
      </Box>
    </Dialog>
  );
};

export default CashBookPopUp;
