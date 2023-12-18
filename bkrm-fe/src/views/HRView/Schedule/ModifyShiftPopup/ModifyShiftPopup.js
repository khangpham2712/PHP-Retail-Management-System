import React from "react";
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
  OutlinedInput,
  FormHelperText,
  Dialog,
} from "@material-ui/core";

// api
import { useSelector, useDispatch } from "react-redux";
import { statusAction } from "../../../../store/slice/statusSlice";
import * as Yup from "yup";
import { useFormik } from "formik";
import scheduleApi from "../../../../api/scheduleApi";

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

const ModifyShitPopup = (props) => {
  const { handleClose, isOpen, reload, shift } = props;

  const theme = useTheme();
  const classes = useStyles(theme);

  const formik = useFormik({
    initialValues: {
      name: shift.name,
      start_time: shift.start_time,
      end_time: shift.end_time,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string(),
      start_time: Yup.string(),
      end_time: Yup.string(),
    }),

    onSubmit: async (values, actions) => {
      // get formik data
      const { name, start_time, end_time } = values;

      try {
        const response = await scheduleApi.updateShift(
          store_uuid,
          branch_uuid,
          shift.id,
          {
            name,
            start_time,
            end_time,
            id: shift.id,
          }
        );

        dispatch(statusAction.successfulStatus("cập nhật ca thành công"));
        reload();
        handleClose();
      } catch (error) {
        dispatch(statusAction.failedStatus("cập nhật ca thất bại"));
        handleClose();
      }
    },

    // custom action
  });

  // redux
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const dispatch = useDispatch();

  const onDelete = async () => {
    try {
      const response = await scheduleApi.deleteShift(
        store_uuid,
        branch_uuid,
        shift.id
      );
      dispatch(statusAction.successfulStatus("Xoá ca thành công"));
      reload();
      handleClose();
    } catch (error) {
      dispatch(statusAction.failedStatus("Xoá ca thất bại"));
      handleClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <Typography className={classes.headerTitle} variant="h5">
          Chi tiết ca làm việc
        </Typography>
      </DialogTitle>

      <DialogContent>
        <div className={classes.root}>
          <Grid container direction="row">
            <TextField
              label="Tên ca"
              required
              value={formik.values.name}
              name="name"
              variant="outlined"
              fullWidth
              size="small"
              onChange={formik.handleChange}
            />

            {formik.errors.name && formik.touched.name && (
              <FormHelperText error>{formik.errors.name}</FormHelperText>
            )}

            <TextField
              label="Bắt đầu"
              type="time"
              value={formik.values.start_time}
              name="start_time"
              onChange={formik.handleChange}
              variant="outlined"
              fullWidth
              size="small"
            />

            {formik.errors.start_time && formik.touched.start_time && (
              <FormHelperText error>{formik.errors.start_time}</FormHelperText>
            )}

            <TextField
              label="Kết thúc"
              type="time"
              value={formik.values.end_time}
              name="end_time"
              onChange={formik.handleChange}
              variant="outlined"
              fullWidth
              size="small"
            />

            {formik.errors.end_time && formik.touched.end_time && (
              <FormHelperText error>{formik.errors.end_time}</FormHelperText>
            )}
          </Grid>
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onDelete}
          size="small"
          variant="contained"
          color="secondary"
        >
          Xoá
        </Button>
        <Button
          onClick={formik.handleSubmit}
          size="small"
          variant="contained"
          color="primary"
        >
          Sửa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModifyShitPopup;
