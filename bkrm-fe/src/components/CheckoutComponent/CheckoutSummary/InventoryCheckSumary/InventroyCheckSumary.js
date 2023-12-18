import React, { useEffect, useState } from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import {
  Grid,
  Avatar,
  Card,
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Dialog,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
// import project
import { grey } from "@material-ui/core/colors";
import * as Input from "../../../TextField/NumberFormatCustom";

import ava from "../../../../assets/img/product/lyimg.jpeg";

const useStyles = makeStyles((theme) =>
  createStyles({
    marginBox: {
      marginTop: 30,
    },
    marginRow: {
      marginTop: 5,
    },
    hidden: {
      display: "none",
    },
    ava: {
      width: 30,
      height: 30,
    },
  })
);
function InventoryCheckSummary(props) {
  const { data, handleConfirm, userName, branchName,mode } = props
  const theme = useTheme();
  const classes = useStyles(theme);

  useEffect(() => {}, [data, userName, branchName]);

  return (
    <Box style={{ padding: 30, minHeight: "75vh" }}>
      <Grid container direction="column" alignItems="flex-start" spacing={3}>
        <Grid container direction="row" justifyContent="space-between">
          <Grid
            item
            xs={8}
            container
            direction="column"
            alignItems="flex-start"
          >
            <Typography variant="h5">Chi nhánh</Typography>
            <Typography variant="body2">
              {/* current branch */}
              {branchName}
            </Typography>
          </Grid>

          <Grid item xs={4} container direction="column" alignItems="flex-end">
            <Typography variant="body2">
              {/* current date */}
              {new Date().toLocaleDateString("es-US")}
            </Typography>
            <Typography variant="body2">
              {/* current date */}
              {new Date().toLocaleTimeString()}
            </Typography>
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          className={classes.marginBox}
          style={{ marginBottom: 20 }}
          justifyContent="space-between"
          alignItems="center"
        >
         {!mode?
          <Grid
            item
            xs={8}
            container
            direction="row"
            className={classes.marginBox}
            alignItems="center"
          >
            <Typography variant="h3" style={{ marginRight: 10 }}>
              Người thực hiện
            </Typography>
            <Typography
              variant="h3"
              style={{ color: theme.customization.primaryColor[500] }}
            >
              {userName}
            </Typography>
          </Grid>:
          props.children}
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          className={classes.marginBox}
        >
          <Typography variant="h5">Số mặt hàng lệch</Typography>
          <Typography variant="body2">
           <Input.ThousandFormat value={
              data.details.filter(
                (item) =>
                  Number(item.branch_quantity) !== Number(item.real_quantity)
              ).length
            } />
          </Typography>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          className={classes.marginRow}
        >
          <Typography variant="h5">Tổng sản phẩm lệch</Typography>
          <Typography variant="body2">
          <Input.ThousandFormat value={data.details
              .map(
                (item) =>
                  Number(item.real_quantity) - Number(item.branch_quantity)
              )
              .reduce((a, b) => a + b, 0)} />
          </Typography>
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          className={classes.marginRow}
        >
          <Typography variant="h5">Tổng giá trị lệch</Typography>
          <Typography variant="body2"> <Input.VNDFormat value={data.total_amount} /></Typography>
        </Grid>

        <Button
          variant="contained"
          fullWidth
          color="primary"
          style={{ marginTop: !mode ?40:0 }}
          onClick={handleConfirm}
          // disabled={data.total_amount === 0}
        >
          Kiểm kho
        </Button>
      </Grid>
    </Box>
  );
}

export default InventoryCheckSummary;
