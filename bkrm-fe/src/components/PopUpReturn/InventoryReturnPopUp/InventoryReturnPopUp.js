import React, { useEffect } from "react";
import {
  Card,
  ListItem,
  DialogContent,
  Box,
  Grid,
  TableBody,
  Typography,
  TableCell,
  TableRow,
  IconButton,
  TextField,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import * as _ from "lodash";

import CloseIcon from "@material-ui/icons/Close";
import update from "immutability-helper";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import ImportReturnSummary from "../../CheckoutComponent/CheckoutSummary/ImportReturnSummary/ImportReturnSummary";

import useStyles from "../../TableCommon/style/mainViewStyle";

// import library
import * as HeadCells from "../../../assets/constant/tableHead";
import * as TableType from "../../../assets/constant/tableType";
import SearchProduct from "../../SearchBar/SearchProduct";
import TableHeader from "../../TableCommon/TableHeader/TableHeader";
import TableWrapper from "../../TableCommon/TableWrapper/TableWrapper";
import * as Input from "../../TextField/NumberFormatCustom";
import ButtonQuantity from "../../Button/ButtonQuantity";
import purchaseReturnApi from "../../../api/purchaseReturnApi";

import { statusAction } from "../../../store/slice/statusSlice";
import { ReturnCartMiniTableRow } from "../../../components/MiniTableRow/MiniTableRow";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import setting from "../../../assets/constant/setting"

function InventoryReturnPopUp(props) {
  const { purchaseOrder, classes, handleCloseReturn, reload, reloadDetail } =
    props;
  const theme = useTheme();

  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));

  // 2. Table sort
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("stt");
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  // redux
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const [isUpdateTotalAmount, setIsUpdateTotalAmount] = React.useState(false);
  const [purchaseReturn, setPurchaseReturn] = React.useState({
    purchase_order_code: purchaseOrder.purchase_order_code,
    purchase_order_id: purchaseOrder.id,
    branch: purchaseOrder.branch,
    supplier: purchaseOrder.supplier,
    supplier_id: purchaseOrder.supplier_id,
    branch_id: purchaseOrder.branch_id,
    total_amount: 0,
    details: purchaseOrder.details.map((detail) => ({
      ...detail,
      // returnQuantity: detail.quantity,
      returnQuantity: 0,
      returnPrice: detail.unit_price,
      selectedBatches: JSON.parse(detail.batches)?.map((batch) => ({
        ...batch,
        max_return_quantity:
          batch.additional_quantity - batch.returned_quantity,
        returned_quantity: 0,
      })),
      purchase_order_batches: JSON.parse(detail.batches),
    })),
    payment_method: "cash",
    paid_amount: "0",
  });

  const handleChangeBatches = (itemId, newBatches) => {
    const itemIndex = purchaseReturn.details.findIndex(
      (item) => item.id === itemId
    );
    const newPurchaseReturn = _.cloneDeep(purchaseReturn);

    newPurchaseReturn.details[itemIndex].selectedBatches = newBatches;
    newPurchaseReturn.details[itemIndex].returnQuantity = _.sumBy(
      newBatches,
      "returned_quantity"
    );
    setPurchaseReturn(newPurchaseReturn);
    setIsUpdateTotalAmount(!isUpdateTotalAmount);
  };
  const [openSnack, setOpenSnack] = React.useState(false);
  const [snackStatus, setSnackStatus] = React.useState({
    style: "error",
    message: "Trả hàng thất bại",
  });

  useEffect(() => {
    updateTotalAmount();
  }, [isUpdateTotalAmount]);

  const updateTotalAmount = () => {
    let total = 0;
    purchaseReturn.details.forEach((item) => {
      total += item.returnPrice * item.returnQuantity;
    });

    const newPurchaseReturn = update(purchaseReturn, {
      total_amount: { $set: total },
      paid_amount: { $set: total },
    });
    setPurchaseReturn(newPurchaseReturn);
  };

  const handleDeleteItem = (itemId) => {
    const itemIndex = purchaseReturn.details.findIndex(
      (item) => item.id === itemId
    );
    const newPurchaseReturn = update(purchaseReturn, {
      details: { $splice: [[itemIndex, 1]] },
    });
    setPurchaseReturn(newPurchaseReturn);
    setIsUpdateTotalAmount(!isUpdateTotalAmount);
  };

  const handleItemQuantityChange = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      handleDeleteItem(itemId);
      return;
    }
    const itemIndex = purchaseReturn.details.findIndex(
      (item) => item.id === itemId
    );
    const newPurchaseReturn = update(purchaseReturn, {
      details: {
        [itemIndex]: {
          returnQuantity: { $set: newQuantity },
        },
      },
    });
    setPurchaseReturn(newPurchaseReturn);
    setIsUpdateTotalAmount(!isUpdateTotalAmount);
  };

  const handleProductPriceChange = (itemId, newPrice) => {
    const itemIndex = purchaseReturn.details.findIndex(
      (item) => item.id === itemId
    );
    const newPurchaseReturn = update(purchaseReturn, {
      details: {
        [itemIndex]: {
          returnPrice: { $set: newPrice },
        },
      },
    });
    setPurchaseReturn(newPurchaseReturn);
    setIsUpdateTotalAmount(!isUpdateTotalAmount);
  };

  const handlePaidAmountChange = (paidAmount) => {
    const newPurchaseReturn = update(purchaseReturn, {
      paid_amount: { $set: paidAmount },
    });
    setPurchaseReturn(newPurchaseReturn);
  };

  const handlePaymentMethodChange = (paymentMethod) => {
    const newPurchaseReturn = update(purchaseReturn, {
      payment_method: { $set: paymentMethod },
    });
    setPurchaseReturn(newPurchaseReturn);
  };

  const dispatch = useDispatch();

  const handleConfirm = async () => {
    const d = moment.now() / 1000;

    const export_date = moment
      .unix(d)
      .format("YYYY-MM-DD HH:mm:ss", { trim: false });

    const body = {
      purchase_order_uuid: purchaseOrder.uuid,
      supplier_id: purchaseReturn.supplier_id,
      total_amount: purchaseReturn.total_amount.toString(),
      payment_method: purchaseReturn.payment_method,
      paid_amount: purchaseReturn.paid_amount.toString(),
      status:
        purchaseReturn.paid_amount >= purchaseReturn.total_amount
          ? "closed"
          : "debt",
      details: purchaseReturn.details.map((detail) => ({
        product_id: detail.product_id,
        quantity: detail.returnQuantity,
        unit_price: detail.returnPrice,
        purchase_order_detail_id: detail.id,
        selectedBatches: detail.selectedBatches.map((batch) =>
          _.omit(batch, ["additional_quantity", "max_return_quantity"])
        ),
        purchase_order_batches: detail.purchase_order_batches.map((batch) => {
          const newBatch = {
            ...batch,
            returned_quantity:
              batch.returned_quantity +
              detail.selectedBatches.find(
                (selectedBatch) => selectedBatch.id === batch.id
              ).returned_quantity,
          };
          return newBatch;
        }),
      })),
      export_date,
    };

    try {
      const res = await purchaseReturnApi.removeInventory(
        store_uuid,
        purchaseOrder.branch.uuid,
        body
      );
      dispatch(
        statusAction.successfulStatus(
          `Trả hàng thành công: ${res.data.purchase_return_code}`
        )
      );
      reload();
      reloadDetail();
      handleCloseReturn();
    } catch (err) {
      dispatch(statusAction.failedStatus("Trả hàng thất bại!"));
      setOpenSnack(true);
      console.log(err);
    }
  };
  const handleCloseSnackBar = (event, reason) => {
    setOpenSnack(false);
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <ListItem style={{ paddingTop: 20, marginBottom: -20, marginLeft: 25 }}>
          <Typography variant="h3" style={{ marginRight: 20 }}>
            Trả hàng nhập
          </Typography>

          {/* Search nayf chir search những sản phẩm trong hoá đơn thôi -> đổi lại thanh search khác sau */}
          {/* <SearchProduct /> */}
        </ListItem>

        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={handleCloseReturn}
        >
          <CloseIcon />
        </IconButton>
      </Grid>

      <DialogContent style={{ marginTop: 25 }}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={12} sm={8}>
            <Card className={classes.card}>
              <Box style={{ padding: 30, minHeight: "75vh" }}>
                {/* JSON data attribute phải giongso table head id */}

                {/* <ListItem headCells={HeadCells.CartReturnHeadCells}  cartData={row.list} tableType={TableType.CART_RETURN} /> */}
                {!xsScreen ? (
                  <TableWrapper isCart>
                    <TableHeader
                      classes={classes}
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      headerData={HeadCells.ImportReturnHeadCells}
                    />
                    <TableBody>
                      {purchaseReturn.details.map((detail, index) => (
                        <ImportReturnTableRow
                          handleProductPriceChange={handleProductPriceChange}
                          handleItemQuantityChange={handleItemQuantityChange}
                          handleChangeBatches={handleChangeBatches}
                          detail={detail}
                        />
                      ))}
                    </TableBody>
                  </TableWrapper>
                ) : (
                  purchaseReturn.details.map((detail, index) => (
                    <ReturnCartMiniTableRow
                      handleProductPriceChange={handleProductPriceChange}
                      handleItemQuantityChange={handleItemQuantityChange}
                      detail={detail}
                      isCart={false}
                    />
                  ))
                )}
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4} className={classes.card}>
            <Card className={classes.card}>
              <ImportReturnSummary
                data={purchaseReturn}
                handlePaidAmountChange={handlePaidAmountChange}
                handlePaymentMethodChange={handlePaymentMethodChange}
                handleConfirm={handleConfirm}
              />
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
    </>
  );
}

export default InventoryReturnPopUp;
function ImportReturnTableRow({
  detail,
  handleProductPriceChange,
  handleItemQuantityChange,
  handleChangeBatches,
}) {
  const classes = useStyles();
  const [show, setShow] = React.useState("none");
  useEffect(() => {}, [detail]);
  const handleChangeQuantity = (newQuantity) => {
    handleItemQuantityChange(detail.id, newQuantity);
  };
  const handleChangePrice = (newPrice) => {
    handleProductPriceChange(detail.id, newPrice);
  };
  const info = useSelector((state) => state.info);
  const store_setting = info.store.general_configuration? JSON.parse(info.store.general_configuration): setting

  const canFixPriceSell= store_setting?.canFixPriceSell
  return (
    <TableRow hover key={detail.id}>
      <TableCell align="left" style={{ width: 5 }}>
        {detail.product_code}
      </TableCell>
      {/* <TableCell align="left">{row.id}</TableCell> */}
      <TableCell align="left">{detail.name}</TableCell>
      {/* <TableCell align="left">{detail.bar_code}</TableCell> */}
      <TableCell align="right">
        {" "}
        <Input.ThousandFormat value={detail.unit_price} />
      </TableCell>
      <TableCell align="right">
      {canFixPriceSell.status && canFixPriceSell.returnCart?
        <Input.ThousandSeperatedInput
          id="standard-basic"
          style={{ width: 70 }}
          size="small"
          inputProps={{ style: { textAlign: "right" } }}
          defaultPrice={detail.returnPrice}
          onChange={(e) => handleChangePrice(e.target.value)}
        />:
        <Input.ThousandFormat  value={detail.returnPrice} > </Input.ThousandFormat>}
      </TableCell>

      <TableCell align="left" padding="none">
        {detail.selectedBatches.length ? (
          detail.selectedBatches.map((batch, index) => (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 5,
                marginBottom: 5,
                alignItems: "center",
                border: "1px solid #eee",
                justifyContent: "space-around",
              }}
            >
              <div>
                {`${batch.batch_code} ${
                  batch?.expiry_date
                    ? "-" + batch?.expiry_date.substring(0, 10)
                    : ""
                }: `}
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <TextField
                  type="number"
                  size="small"
                  style={{ width: 30 }}
                  value={batch.returned_quantity}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (value > batch.max_return_quantity || value < 0) {
                      return;
                    } else {
                      const newSelectedBatches = [...detail.selectedBatches];
                      newSelectedBatches[index].returned_quantity = value;
                      handleChangeBatches(detail.id, newSelectedBatches);
                    }
                  }}
                ></TextField>
                <div>{`/${batch.max_return_quantity}`}</div>
              </div>
            </div>
          ))
        ) : (
          <ButtonQuantity
            quantity={detail.returnQuantity}
            setQuantity={handleChangeQuantity}
            show={show}
            setShow={setShow}
            limit={detail.quantity - detail.returned_quantity}
            isReturn={true}
          />
        )}
      </TableCell>

      <TableCell align="right" className={classes.boldText}>
        <Input.VNDFormat
          value={Number(detail.returnQuantity) * Number(detail.returnPrice)}
        />
      </TableCell>
    </TableRow>
  );
}
