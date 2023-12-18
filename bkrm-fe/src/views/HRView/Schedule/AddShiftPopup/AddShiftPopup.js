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

const AddShiftPopup = (props) => {
  const { handleClose, addShiftOpen, reload } = props;

  const theme = useTheme();
  const classes = useStyles(theme);

  const formik = useFormik({
    initialValues: {
      name: "",
      start_time: "",
      end_time: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Bắt buộc!"),
      start_time: Yup.string().required("Bắt buộc!"),
      end_time: Yup.string().required("Bắt buộc!"),
    }),

    onSubmit: async (values, actions) => {
      try {
        const response = await scheduleApi.createShift(store_uuid, branch_uuid, values);
        dispatch(statusAction.successfulStatus("Thêm ca thành công"))
        reload();
        handleClose("Success");
      } catch (error) {
        dispatch(statusAction.failedStatus("Thêm ca thất bại"))
        handleClose("Failed");
      }
    },
  });

  // redux
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const dispatch = useDispatch();

  return (
    <Dialog
        open={addShiftOpen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <Typography className={classes.headerTitle} variant="h5">
          Thêm ca làm việc
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
          onClick={() => handleClose(null)}
          variant="contained"
          size="small"
          color="secondary"
        >
          Huỷ
        </Button>
        <Button onClick={formik.handleSubmit}  size="small"variant="contained" color="primary">Thêm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddShiftPopup;
