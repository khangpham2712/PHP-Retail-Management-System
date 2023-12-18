import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { openNotification } from "../../../../components/StatusPopup/StatusPopup";
import { useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Typography } from "@material-ui/core";
import * as _ from "lodash";

export default function SelectBatch({ handleSubmit, handleClose, row }) {
  const [selectedBatches, setSelectedBatches] = useState([]);
  return (
    <Dialog open={true}>
      <Typography
        style={{ marginTop:15, marginLeft:15 }}
        variant='h3'
      >{`Chọn lô của ${row.product_code} - ${row.name}`}</Typography>
      <DialogContent>
        <Autocomplete
          options={row.batches}
          getOptionLabel={(batch) =>
            `${batch?.batch_code} - ${
              batch?.expiry_date ? batch?.expiry_date : ""
            } - Tồn kho: ${batch?.quantity}`
          }
          renderInput={(params) => (
            <TextField {...params} label="Tìm mã lô" variant="standard" />
          )}
          onChange={(e, value) => {
            if (value) {
              setSelectedBatches(
                _.uniqBy(
                  [
                    ...selectedBatches,
                    ...[{ ...value, additional_quantity: 0, is_new: false }],
                  ],
                  "batch_code"
                )
              );
            }
          }}
        />
        <div style={{ marginTop: 20 }}>
          {selectedBatches.map((batch) => {
            return (
              <div
                key={batch?.batch_code}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  border: "2px solid #eee",
                  borderRadius: 5,
                  marginBottom: 10,
                  alignItems: "center",
                  width: 500,
                  justifyContent: "space-between",
                  padding: 10,
                }}
              >
                <Typography variant="h5">{`${batch?.batch_code} - ${
                  batch?.expiry_date ? batch?.expiry_date : ""
                } - Tồn kho: ${batch?.quantity}`}</Typography>
                <TextField
                  type="number"
                  style={{ width: 100 }}
                  value={batch.additional_quantity}
                  onChange={(e) => {
                    if (Number(e.target.value) < 0) return;
                    const newSelectedList = selectedBatches.map(
                      (selectedBatch) => {
                        if (selectedBatch.batch_code === batch.batch_code) {
                          return {
                            ...selectedBatch,
                            additional_quantity: Number(e.target.value),
                          };
                        } else {
                          return selectedBatch;
                        }
                      }
                    );
                    setSelectedBatches(newSelectedList);
                  }}
                ></TextField>
              </div>
            );
          })}
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" size="small"variant="contained" onClick={handleClose}>
          Hủy
        </Button>
        <Button
          color="primary"
          size="small"variant="contained" 
          onClick={() => {
            const nonZeroBatch = selectedBatches.filter(
              (batch) => batch.additional_quantity
            );
            handleSubmit(nonZeroBatch);
            handleClose();
          }}
        >
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
