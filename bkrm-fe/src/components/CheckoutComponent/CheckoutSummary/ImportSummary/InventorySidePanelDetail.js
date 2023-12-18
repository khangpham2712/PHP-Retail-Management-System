import React, { useState } from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import { Grid, Box, Typography, Input, Button } from "@material-ui/core";

//import project

// update state
import { useSelector } from "react-redux";
import transferInventoryApi from "../../../../api/transferInventoryApi";
import moment from "moment";
import { convertDateToString } from "../../../../utils";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

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
const InventorySidePanelDetail = (props) => {
  const { cartData, currentBranch, mode } = props;

  const theme = useTheme();
  const classes = useStyles(theme);
  const [note, setNote] = useState("");
  const [targetBranch, setTargetBranch] = useState(null);
  const [transferData, setTransferData] = useState({});
  const navigate = useHistory();

  const info = useSelector((state) => state.info);

  useEffect(() => {
    const transferInventory = localStorage.getItem("transferInventory");
    if (transferInventory) {
      const transferInventoryData = JSON.parse(transferInventory);
      setTransferData(transferInventoryData);
    }
  }, []);

  const handleConfirm = async () => {
    const transferInventory = localStorage.getItem("transferInventory");
    const transferInventoryData = JSON.parse(transferInventory);

    const data = {
      to_note: note,
      status: "closed",
      products: transferInventoryData?.transfer_detail.map((item) => ({
        product_uuid: item.product.uuid,
        value_quantity: item.receive_quantity
          ? item.receive_quantity
          : item.value_quantity,
      })),
    };

    console.log("datadatadatadata", data);

    await transferInventoryApi.update(
      info.store.uuid,
      currentBranch.uuid,
      transferData.id,
      data
    );
    navigate.push("/home/inventory/transfer-inventory");
  };

  const calcTotalQuantity = (da) => {
    return (da || []).reduce(
      (total, item) => total + item?.value_quantity || 0,
      0
    );
  };

  return (
    <Box style={{ padding: 30, minHeight: "80vh" }}>
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
          <Typography variant="h5">Mã chuyển hàng: </Typography>
          <Typography variant="h5">{cartData?.code}</Typography>
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          className={classes.marginBox}
        >
          <Typography variant="h5">Trạng thái: </Typography>
          <Typography variant="h5">
            {cartData?.status === "pending" ? "Đang chuyển" : "Đã nhận"}
          </Typography>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          className={classes.marginBox}
        >
          <Typography variant="h5">Chi nhánh gửi: </Typography>
          <Typography variant="h5">{cartData?.from_name}</Typography>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          className={classes.marginBox}
        >
          <Typography variant="h5">Ngày chuyển: </Typography>
          <Typography variant="h5">
            {/* dd/mm/yyyy hh:mm:ss */}
            {moment(cartData?.created_at).format("DD/MM/YYYY HH:mm:ss")}
          </Typography>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          className={classes.marginBox}
        >
          <Typography variant="h5">Ghi chú: </Typography>
          <Typography variant="h5">{cartData?.from_note}</Typography>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          className={classes.marginBox}
        >
          <Typography variant="h5">Số lượng chuyển: </Typography>
          <Typography variant="h5">
            {calcTotalQuantity(cartData?.transfer_detail)}
          </Typography>
        </Grid>
        {/* ma chuyen hang */}
        {currentBranch.id != transferData?.from_id && [
          <Grid container alignItems="center" className={classes.marginBox}>
            <Input
              placeholder="Ghi chú"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ width: "100%" }}
            />
          </Grid>,
          <Button
            variant="contained"
            fullWidth
            color="primary"
            style={{ marginTop: mode ? 0 : 80 }}
            onClick={() => handleConfirm()}
          >
            Nhận Hàng
          </Button>,
        ]}
      </Grid>
    </Box>
  );
};

export default InventorySidePanelDetail;
