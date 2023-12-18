import React, { useEffect, useState } from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import {
  Grid,
  Box,
  Typography,
  Button,
  Divider,
  Popper,
  Input,
} from "@material-ui/core";
import VNDInput from "../../../TextField/NumberFormatCustom";
import {
  VNDFormat,
  ThousandFormat,
} from "../../../TextField/NumberFormatCustom";
import MuiAlert from "@material-ui/lab/Alert";

//import project

// update state
import DiscountInputDetail from "../../../TextField/DiscountInputDetail";
import SearchBranch from "../../../SearchBar/SearchBranch";
import { useSelect } from "downshift";
import { useSelector } from "react-redux";
import transferInventoryApi from "../../../../api/transferInventoryApi";
import { useHistory } from "react-router-dom";
import SnackBarGeneral from "../../../SnackBar/SnackBarGeneral";

const useStyles = makeStyles(() =>
  createStyles({
    marginBox: {
      marginTop: 10,
    },
    marginRow: {
      marginTop: 5,
    },
    hidden: {
      display: "none",
    },
    headerTitle: {
      fontSize: "1.125rem",
    },
  })
);
const snackStatus = {
  style: "error",
  message: "Nhập hàng thất bại",
};
const InventorySidePanel = (props) => {
  const { cartData, currentBranch, mode } = props;

  const theme = useTheme();
  const classes = useStyles(theme);
  const [code, setCode] = useState("");
  const [note, setNote] = useState("");
  const [targetBranch, setTargetBranch] = useState(null);
  const navigate = useHistory();
  const [open, setOpen] = useState(false);

  const info = useSelector((state) => state.info);

  function calculateTotalQuantity(cartList) {
    var value = 0;
    cartList.map((item) => (value += item.quantity));
    return value;
  }

  const handleConfirm = async () => {
    if (!targetBranch || !code) {
      setOpen(true);
      return;
    }
    const data = {
      to_id: targetBranch.id,
      from_note: note,
      code,
      products: cartData.cartItem.map((item) => ({
        product_uuid: item.uuid,
        value_quantity: item.quantity,
        unit_price: item.unit_price,
      })),
    };
    await transferInventoryApi
      .post(info.store.uuid, currentBranch.uuid, data)
      .catch((err) => {
        setOpen(true);
        return;
      });
    navigate.push("/home/inventory/transfer-inventory");
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box style={{ padding: 30, minHeight: "80vh" }}>
      <SnackBarGeneral
        handleClose={handleClose}
        open={open}
        status={snackStatus}
      />

      <Grid container direction="column" alignItems="flex-start" spacing={3}>
        <Grid container direction="row" justifyContent="space-between">
          {/* 1. BASIC INFO */}
          <Grid
            item
            xs={8}
            container
            direction="column"
            alignItems="flex-start"
          >
            <Typography variant="h5">Chi nhánh</Typography>
            <Typography variant="body2">{currentBranch.name}</Typography>
          </Grid>

          <Grid item xs={4} container direction="column" alignItems="flex-end">
            <Typography variant="body2">
              {new Date().toLocaleDateString("es-US")}
            </Typography>
            <Typography variant="body2">
              {new Date().toLocaleTimeString()}
            </Typography>
          </Grid>
        </Grid>

        {/* when change mode to menu product */}
        {props.children}

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          className={classes.marginBox}
        >
          <div style={{ width: "100%" }}>
            <SearchBranch
              branches={info.branches}
              currentBranch={currentBranch}
              selectedBranch={targetBranch}
              handleSelectBranch={(value) => setTargetBranch(value)}
            />
          </div>
          <Typography variant="h5">
            Tổng SL sản phẩm ({cartData.cartItem.length}){" "}
          </Typography>
          <Typography variant="body2">
            <ThousandFormat
              // value={cartData.cartItem.length}
              value={calculateTotalQuantity(cartData.cartItem)}
            ></ThousandFormat>
          </Typography>
        </Grid>

        {/* ma chuyen hang */}
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className={classes.marginBox}
        >
          <Typography variant="h5">Mã chuyển hàng</Typography>
          <Typography variant="body2">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Mã chuyển hàng"
            />
          </Typography>
        </Grid>
        <Grid container alignItems="center" className={classes.marginBox}>
          <Input
            placeholder="Ghi chú"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ width: "100%" }}
          />
        </Grid>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          style={{ marginTop: mode ? 0 : 80 }}
          onClick={() => handleConfirm()}
        >
          Hoàn Thành
        </Button>
      </Grid>
    </Box>
  );
};

export default InventorySidePanel;
