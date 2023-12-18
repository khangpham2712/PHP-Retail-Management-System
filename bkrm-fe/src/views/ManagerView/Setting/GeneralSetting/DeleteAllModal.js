import React, { useState } from "react";
import {
  useTheme,
  withStyles,
  makeStyles,
  createStyles,
} from "@material-ui/core/styles";
import {
  Typography,
  Button,
  Divider,
  List,
  Card,
  ListItem,
  ListSubheader,
  TextField,
  ListItemSecondaryAction,
  Switch,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  ButtonBase,
  Tooltip,
  Box,
  IconButton,
  Modal,
} from "@material-ui/core";
import { useFormik } from "formik";
import moment from "moment";
import ConfirmPopUp from "../../../../components/ConfirmPopUp/ConfirmPopUp";
const DeleteAllModal = ({ openDeleteAll, deleteAll, setOpenDeleteAll }) => {
  const current = moment(new Date()).format("YYYY-MM-DD");

  const formik = useFormik({
    initialValues: {
      from: current,
      to: current,
      isAll: "true",
    },
  });
  React.useEffect(() => {
    formik.values.from.length === 0
      ? formik.setFieldValue("from", current)
      : formik.setFieldValue("from", formik.values.from);
    formik.values.to.length === 0
      ? formik.setFieldValue("to", current)
      : formik.setFieldValue("to", formik.values.to);
  }, []);
  return (
    <ConfirmPopUp
      open={openDeleteAll}
      handleClose={() => {
        setOpenDeleteAll(false);
      }}
      handleConfirm={() => {
        deleteAll({...formik.values, isAll: formik.values.isAll === 'true'});
        setOpenDeleteAll(false);
      }}
      message={
        <>
          <Typography variant="h3" style={{marginBottom:10}}>
            <strong>Xóa giao dịch cũ</strong>
          </Typography>

          <RadioGroup
            name="isAll"
            value={formik.values.isAll}
            onChange={formik.handleChange}
            defaultValue={true}
          >
            <FormControlLabel value="true" control={<Radio/>} label="Tất cả" />
            <FormControlLabel
              value="false"
              control={<Radio/>}
              label="Khoảng thời gian"
            />
          </RadioGroup>
          {formik.values.isAll === 'false' ? (
            <>
              <TextField
                id="from"
                label="Từ"
                type="date"
                name="from"
                // defaultValue={formik.values.startDate}

                variant="outlined"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                // value={formik.values.startDate.length === 0 ? current :formik.values.startDate}
                value={formik.values.from}
                onChange={formik.handleChange}
                style={{paddingBottom: 10}}
              />
              <TextField
                id="to"
                label="Đến"
                type="date"
                name="to"
                // defaultValue={formik.values.endDate}
                variant="outlined"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formik.values.to}
                // value={formik.values.endDate.length === 0 ? current :formik.values.endDate}
                onChange={formik.handleChange}
              />
            </>
          ) : null}
        </>
      }
    />
  );
};

export default DeleteAllModal;
