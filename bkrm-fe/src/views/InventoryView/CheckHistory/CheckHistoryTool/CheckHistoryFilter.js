import React from 'react'
import {
  Drawer,TextField, Typography,Button,Grid,MenuItem,Select,InputLabel,FormControl,Box
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/styles";
import {ThousandSeperatedInput} from '../../../../components/TextField/NumberFormatCustom'
import VNDInput from '../../../../components/TextField/NumberFormatCustom'

import { useFormik } from 'formik';

const drawerWidth = 300;
const useStyles = makeStyles((theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    
    drawerPaper: {
      width: drawerWidth,
      padding:15
    },
    textField:{marginBottom:10},
    text:{marginBottom:10,marginTop:15}
  })
);
const CheckHistoryFilter = (props) => {
    const {handleToggleFilter,openFilter,query, setQuery} =props;

    const theme = useTheme();
    const classes = useStyles(theme);

    const formik = useFormik({
      initialValues: query,
      onSubmit: values => {
        handleToggleFilter()
        setQuery(values)
      },
    });


    return (
      <Drawer
        anchor="right"
        onClose={handleToggleFilter}
        open={openFilter}
        classes={{
          paper: classes.drawerPaper,
        }}
        className={classes.drawer}
      >
        {/* 1.Ngay from-to */}
        <Typography variant="h5" className={classes.text}>
          Ngày kiểm:
        </Typography>
        <TextField
          id="date"
          label="Từ"
          type="date"
          defaultValue=""
          variant="outlined"
          size="small"
          fullWidth
          className={classes.textField}
          InputLabelProps={{ shrink: true }} // value={dateOfBirth} // onChange={(event) => setDateOfBirth(event.target.value)}
          name="startDate"
          value={formik.values.startDate}
          onChange={formik.handleChange}
        />
        <TextField
          id="date"
          label="Đến"
          type="date"
          defaultValue=""
          variant="outlined"
          size="small"
          fullWidth
          name="endDate"
          value={formik.values.endDate}
          onChange={formik.handleChange}
          className={classes.textField}
          InputLabelProps={{ shrink: true }} // value={dateOfBirth} // onChange={(event) => setDateOfBirth(event.target.value)}
        />
        {/* 2.Chi nhanh */}
        {/* <Typography variant="h5" className={classes.text}>
          Chi nhánh:
        </Typography>
        <FormControl
          className={classes.formControl}
          fullWidth
          size="small"
          variant="outlined"
        >
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            size="small"
            // onChange={(event) => { setGender(event.target.value) }}
            // label=" Chi nhánh"
            // value={gender}
          >
            <MenuItem value="trungtam">Chi nhánh trung tâm</MenuItem>
            <MenuItem value="q1">Chi nhánh quận 1</MenuItem>
          </Select>
        </FormControl> */}
        {/* 3. Lệch from-to */}
        <Typography variant="h5" className={classes.text}>
          Lệch:
        </Typography>
        <ThousandSeperatedInput
          label="Từ"
          variant="outlined"
          fullWidth
          size="small"
          className={classes.textField}
          name="minTotalAmount"
          value={formik.values.minTotalAmount}
          onChange={formik.handleChange}
        />
        <ThousandSeperatedInput
          label="Đến"
          variant="outlined"
          fullWidth
          size="small"
          className={classes.textField}
          name="maxTotalAmount"
          value={formik.values.maxTotalAmount}
          onChange={formik.handleChange}
        />

        {/* 4. Trang thai */}
        {/* <Typography variant="h5" className={classes.text}>
          Trạng thái:
        </Typography>
        <FormControl
          className={classes.formControl}
          fullWidth
          size="small"
          variant="outlined"
        >
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            size="small"
            // onChange={(event) => { setGender(event.target.value) }}
            // label=" Chi nhánh"
            // value={gender}
          >
            <MenuItem value="trungtam">Còn nợ</MenuItem>
            <MenuItem value="q1">Trả đủ</MenuItem>
          </Select>
        </FormControl> */}

        {/* BUTTON */}
        <Button onClick={formik.handleSubmit} variant="contained" color="primary" style={{ marginTop: 30 }} >
          Lọc
        </Button>
      </Drawer>
    );
}

export default CheckHistoryFilter

