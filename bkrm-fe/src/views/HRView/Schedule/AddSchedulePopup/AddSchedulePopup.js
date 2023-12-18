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

const daysOfWeek = [
  { value: 1, name: "Thứ 2" },
  { value: 2, name: "Thứ 3" },
  { value: 3, name: "Thứ 4" },
  { value: 4, name: "Thứ 5" },
  { value: 5, name: "Thứ 6" },
  { value: 6, name: "Thứ 7" },
  { value: 0, name: "Chủ Nhật" },
];

const AddSchedulePopup = (props) => {
  const { handleClose, addScheduleOpen, reload } = props;

  const theme = useTheme();
  const classes = useStyles(theme);

  const formik = useFormik({
    initialValues: {
      employee_id: "",
      shift_id: "",
      start_date: "",
      end_date: "",
      week_day: [],
    },
    validationSchema: Yup.object().shape({
      employee_id: Yup.string().required("Bắt buộc!"),
      shift_id: Yup.string().required("Bắt buộc!"),
      start_date: Yup.string().required("Bắt buộc!"),
      end_date: Yup.string().required("Bắt buộc!"),
      week_day: Yup.array().min(1, "Ít nhất một ngày trong tuần"),
    }),

    onSubmit: async (values, actions) => {

      const body = {...values, week_day: values.week_day.join(',')}

      try {
        const response = await scheduleApi.createSchedule(
          store_uuid,
          branch_uuid,
          body
        );

        dispatch(statusAction.successfulStatus("Thêm lịch làm việc thành công"))
        reload();
        handleClose("Success");
      } catch (error) {
        dispatch(statusAction.failedStatus("Thêm lịch làm việc thất bại"))
        handleClose("Failed");
      }
    },
  });

  // redux
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const dispatch = useDispatch();

  // select employees and shifts of branch
  const [employees, setEmployees] = React.useState([]);
  const [shifts, setShifts] = React.useState([]);

  React.useEffect(() => {
    const fetchEmpAndShift = async () => {
      try {
        const response = await scheduleApi.getEmpAndShiftOfBranch(
          store_uuid,
          branch_uuid
        );
        setEmployees(response.data.employees);
        setShifts(response.data.shifts);
      } catch (err) {
        console.log(err);
      }
    };

    fetchEmpAndShift();
  }, [branch_uuid]);

  return (
    <Dialog
      open={addScheduleOpen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <Typography className={classes.headerTitle} variant="h5">
          Thêm lịch làm việc cho nhân viên
        </Typography>
      </DialogTitle>

      <DialogContent>
        <div className={classes.root}>
          <Grid container direction="row">
            <FormControl
              className={classes.formControl}
              fullWidth
              size="small"
              variant="outlined"
              style={{ marginTop: 8 }}
            >
              <InputLabel id="employee_name">Nhân viên</InputLabel>
              <Select
                labelId="employee_name"
                required
                value={formik.values.employee_id}
                name="employee_id"
                variant="outlined"
                fullWidth
                size="small"
                onChange={formik.handleChange}
                renderValue={(value) =>
                  employees.find((employee) => employee.employee_id === value)
                    ?.name
                }
              >
                {employees.map((employee) => (
                  <MenuItem
                    value={employee.employee_id}
                  >{`${employee.name} - ${employee.phone}`}</MenuItem>
                ))}
              </Select>

              {formik.errors.employee_id && formik.touched.employee_id && (
                <FormHelperText error>
                  {formik.errors.employee_id}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl
              className={classes.formControl}
              fullWidth
              size="small"
              variant="outlined"
              style={{ marginTop: 8 }}
            >
              <InputLabel id="shift_name">Ca làm việc</InputLabel>
              <Select
                labelId="shift_name"
                required
                value={formik.values.shift_id}
                name="shift_id"
                variant="outlined"
                fullWidth
                size="small"
                onChange={formik.handleChange}
                renderValue={(value) =>
                  shifts.find((shift) => shift.id === value)?.name
                }
              >
                {shifts.map((shift) => (
                  <MenuItem
                    value={shift.id}
                  >{`${shift.name}: ${shift.start_time} - ${shift.end_time}`}</MenuItem>
                ))}
                {shifts.length === 0 && (
                  <MenuItem value="" disabled>
                    Chưa tạo ca cho chi nhánh
                  </MenuItem>
                )}
              </Select>

              {formik.errors.shift_id && formik.touched.shift_id && (
                <FormHelperText error>{formik.errors.shift_id}</FormHelperText>
              )}
            </FormControl>

            <FormControl
              className={classes.formControl}
              fullWidth
              size="small"
              variant="outlined"
              style={{ marginTop: 8 }}
            >
              <InputLabel id="daysOfWeek">Ngày trong tuần</InputLabel>
              <Select
                labelId="daysOfWeek"
                multiple
                name="week_day"
                required
                variant="outlined"
                fullWidth
                size="small"
                value={formik.values.week_day}
                onChange={formik.handleChange}
                renderValue={(selected) =>
                  selected
                    .map((day) => daysOfWeek.find((d) => d.value === day).name)
                    .join(",")
                }
              >
                {daysOfWeek.map((day) => (
                  <MenuItem key={day.name} value={day.value}>
                    {day.name}
                  </MenuItem>
                ))}
              </Select>

              {formik.errors.week_day && formik.touched.week_day && (
                <FormHelperText error>{formik.errors.week_day}</FormHelperText>
              )}
            </FormControl>
            <TextField
              type="date"
              value={formik.values.start_date}
              name="start_date"
              onChange={formik.handleChange}
              variant="outlined"
              fullWidth
              size="small"
              label="Ngày bắt đầu"
              className={classes.textField}
              InputLabelProps={{ shrink: true }}
            />

            {formik.errors.start_date && formik.touched.start_date && (
              <FormHelperText error>{formik.errors.start_date}</FormHelperText>
            )}

            <TextField
              type="date"
              value={formik.values.end_date}
              name="end_date"
              onChange={formik.handleChange}
              variant="outlined"
              fullWidth
              label="Ngày kết thúc"
              size="small"
              className={classes.textField}
              InputLabelProps={{ shrink: true }}
            />

            {formik.errors.end_date && formik.touched.end_date && (
              <FormHelperText error>{formik.errors.end_date}</FormHelperText>
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
        <Button onClick={formik.handleSubmit} size="small"variant="contained" color="primary">Thêm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSchedulePopup;
