import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useFormik } from "formik";
import * as Yup from "yup";
import productApi from "../../../../api/productApi";
import { useSelector } from "react-redux";
import {
  error,
  openNotification,
  success,
} from "../../../../components/StatusPopup/StatusPopup";
import { Typography } from "antd";

export default function AddBatch({ handleSubmit, handleClose, row }) {
  const [batch, setBatch] = useState({
    id: new Date().toString(),
    batch_code: "",
    // additional_quantity: 0,
    // expiry_date: null,
    additional_quantity: 1,
    expiry_date: new Date().toISOString().substring(0, 10),
    position: "",
  });
  return (
    <Dialog open={true} aria-labelledby="form-dialog-title">
      {/* <DialogTitle  style={{ fontSize: 16, paddingRight:30 }}>Thêm lô mới</DialogTitle> */}
      <Typography style={{ fontSize: 18,fontWeight:600, marginTop:15, marginLeft:15, paddingRight:30 }}>Thêm lô mới</Typography>
      <DialogContent>
        {/* <TextField
          autoFocus
          margin="dense"
          name="batch_code"
          label="Mã lô (tự động)"
          fullWidth
          value={batch.batch_code}
          onChange={e => setBatch({...batch, batch_code: e.target.value})}
          // error={formik.touched.name && formik.errors.name}
          // helperText={formik.touched.name ? formik.errors.name : null}
        /> */}
        <TextField
          autoFocus
          margin="dense"
          name="expiry_date"
          fullWidth
          // defaultValue={new Date().toISOString().substring(0, 10)}
          type="date"
          label="Ngày hết hạn"
          value={batch.expiry_date}
          onChange={(e) => {
            setBatch({ ...batch, expiry_date: e.target.value });
          }}
        />
        <TextField
          autoFocus
          margin="dense"
          type="number"
          name="additional_quantity"
          label="Số lượng nhập"
          fullWidth
          value={batch.additional_quantity}
          InputProps={{ inputProps: { min: 1 } }}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value <= 0) {
              return;
            } else {
              setBatch({ ...batch, additional_quantity: value });
            }
          }}
        />
        <TextField
          autoFocus
          margin="dense"
          label="Vị trí"
          fullWidth
          value={batch.position}
          onChange={(e) => setBatch({ ...batch, position: e.target.value })}
          // error={formik.touched.name && formik.errors.name}
          // helperText={formik.touched.name ? formik.errors.name : null}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClose}>
          Hủy
        </Button>
        <Button
          disable={!batch.additional_quantity}
          color="primary"
          onClick={() => {
            handleSubmit(batch);
            handleClose();
          }}
        >
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
