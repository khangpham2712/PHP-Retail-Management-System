import React, { useEffect } from "react";
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
import VNDInput from "../../../TextField/NumberFormatCustom";
import {calculateTotalReturnQuantity} from "../../../TableCommon/util/sortUtil"

//import project
import * as Input from "../../../TextField/NumberFormatCustom";
import { grey } from "@material-ui/core/colors";

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
const ImportReturnSummary = ({
  data,
  handlePaidAmountChange,
  handlePaymentMethodChange,
  handleConfirm,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  let _value = null;
  useEffect(() => {}, [data]);

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
              {data.branch?.name}
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
          <Grid
            item
            xs={8}
            container
            direction="row"
            className={classes.marginBox}
            alignItems="center"
          >
            <Typography variant="h3" style={{ marginRight: 20 }}>
              Trả đơn nhập
            </Typography>
            <Typography
              variant="h3"
              style={{ color: theme.customization.primaryColor[500] }}
            >
              #{data.purchase_order_code}
            </Typography>
          </Grid>
          <Grid
            item
            xs={4}
            container
            direction="row"
            justifyContent="flex-end"
            className={classes.marginBox}
            alignItems="center"
          >
            <Typography variant="h5">{data.supplier?.name}</Typography>
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          className={classes.marginBox}
        >
          <Typography variant="h5"> Tổng SL sản phẩm trả ({data.details.filter((item) => item.returnQuantity !== 0).length})</Typography>
          <Typography variant="body2">{calculateTotalReturnQuantity(data.details)}</Typography>
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          className={classes.marginRow}
        >
          <Typography variant="h5">Tổng tiền gốc</Typography>
          <Typography variant="body2"><Input.VNDFormat value={data.total_amount} /></Typography>
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          className={classes.marginRow}
        >
          <Typography variant="h5">Tổng tiền trả</Typography>
          <Typography variant="body2"><Input.VNDFormat value={data.total_amount} /></Typography>
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className={classes.marginRow}
        >
          <Typography variant="h5">NCC đã trả</Typography>
          <Typography variant="body2"><Input.VNDFormat value={data.paid_amount} /></Typography>
          {/* <VNDInput
            id="standard-basic"
            style={{ width: 90 }}
            size="small"
            inputProps={{ style: { textAlign: "right" } }}
            value={data.paid_amount}
            onChange={(e) => {return;}}
          /> */}
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          className={classes.marginRow}
        >
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={data.payment_method}
              onChange={(e) => handlePaymentMethodChange(e.target.value)}
            >
              <Grid container direction="row">
                <FormControlLabel
                  labelPlacement="start"
                  value="card"
                  control={<Radio />}
                  label="Thẻ"
                />
                <FormControlLabel
                  labelPlacement="start"
                  value="cash"
                  control={<Radio />}
                  label="Tiền mặt"
                />
              </Grid>
            </RadioGroup>
          </FormControl>
        </Grid>

        <Button
          variant="contained"
          fullWidth
          color="primary"
          style={{ marginTop: 40 }}
          onClick={handleConfirm}
          disabled={data.total_amount === 0}
        >
          Trả hàng nhập
        </Button>
      </Grid>
    </Box>
  );
};

export default ImportReturnSummary;
