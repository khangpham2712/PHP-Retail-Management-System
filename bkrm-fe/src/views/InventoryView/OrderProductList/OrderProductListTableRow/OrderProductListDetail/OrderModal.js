import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
  Chip,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import VNDInput, {
  VNDFormat,
} from "../../../../../components/TextField/NumberFormatCustom";
import ModalWrapper from "../../../../../components/Modal/ModalWrapper";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import orderApi from "../../../../../api/orderApi";
import openNotification from "../../../../../components/StatusPopup/StatusPopup";
import _ from "lodash";
import moment from "moment";
import { statusAction } from "../../../../../store/slice/statusSlice";
import ModalWrapperWithClose from "../../../../../components/Modal/ModalWrapperWithClose";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const OrderModal = ({ handleClose, customerOrder, isOpen }) => {
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const branch = info.branch;
  const dispatch = useDispatch();

  const [inventoryInfo, setInventoryInfo] = useState([]);

  const [order, setOrder] = useState({});

  useEffect(async () => {
    try {
      if (store_uuid && branch_uuid) {
        const res = await orderApi.processCustomerOrder(
          store_uuid,
          branch_uuid,
          customerOrder.id
        );

        const inventoryInfo = res.data;
        const details = JSON.parse(
          customerOrder.details ? customerOrder.details : "[]"
        )?.map((detail) => ({
          orderredQuantity: detail.quantity,
          branchInventory: getBranchInventory(detail.id, inventoryInfo),
          batches: getBatches(detail.id, inventoryInfo),
          selectedBatches: [],
          name: detail.name,
          product_code: detail.product_code,
          unit_price: detail.list_price,
          id: detail.id,
          uuid: detail.uuid,
          discount: 0,
          has_batches: detail.has_batches,
          quantity: detail.has_batches
            ? 0
            : Math.min(
                detail.quantity,
                getBranchInventory(detail.id, inventoryInfo)
              ),
        }));

        const newOrder = {
          new_customer: {
            name: customerOrder.name,
            phone: customerOrder.phone,
            address: customerOrder.address,
            ward: customerOrder.ward,
            province: customerOrder.province,
            district: customerOrder.district,
          },
          details: details,
          discount: 0,
          description: "",
          total_amount: _.sumBy(
            details,
            (detail) => detail.quantity * detail.unit_price
          ),
          status: "debt",
        };

        setOrder(newOrder);
      }
    } catch (err) {
      console.log(err);
      openNotification("error", "Không thể lấy dữ liệu tồn kho");
    }
  }, []);

  const handleConfirm = async () => {
    let d = moment.now() / 1000;
    let orderTime = moment
      .unix(d)
      .format("YYYY-MM-DD HH:mm:ss", { trim: false });
    let body = {
      ...order,
      discount: order.discount.toString(),
      paid_amount: 0,
      payment_method: "cash",
      creation_date: orderTime,
      paid_date: "",
      tax: "0",
      shipping: "0",
      is_customer_order: true,
      new_customer: JSON.stringify(order.new_customer),
    };

    try {
      
      handleClose();
      let res = await orderApi.addOrder(store_uuid, branch.uuid, body);
      let updateCustomerOrderRes = await orderApi.confirmCustomerOrder(
        store_uuid,
        branch.uuid,
        customerOrder.id,
        {
          order_code: res.data.order.order_code,
          order_id: res.data.order.id,
        }
      );
      dispatch(
        statusAction.successfulStatus(
          `Tạo hóa đơn thành công ${res.data.order.order_code}`
        )
      );
    } catch (err) {
      dispatch(statusAction.failedStatus(`Tạo hóa đơn thất bại`));
      console.log(err);
    }
  };
  const getBranchInventory = (productId, inventoryInfo) => {
    const product = inventoryInfo.find(
      (inventory) => inventory.id === productId
    );
    const branchInventory = product?.branch_inventories.find(
      (branchInventory) => branchInventory.branch_id === branch.id
    );
    return branchInventory?.quantity_available;
  };

  const getBatches = (productId, inventoryInfo) => {
    const product = inventoryInfo.find(
      (inventory) => inventory.id === productId
    );
    return product?.batches;
  };

  const handleSelectBatch = (e, detailIndex) => {
    const batch = e.target.value;
    if (
      order.details[detailIndex].selectedBatches.find(
        (selectedBatch) => selectedBatch.batch_code === batch.batch_code
      )
    ) {
      return;
    }
    const newSelectedBatches = [...order.details[detailIndex].selectedBatches];
    newSelectedBatches.push({ ...batch, additional_quantity: 0 });
    const newOrder = { ...order };
    newOrder.details[detailIndex].selectedBatches = newSelectedBatches;
    setOrder(newOrder);
  };

  const handleChangeBatchQuantity = (e, detailIndex, selectedBatchIndex) => {
    const value = Number(e.target.value);
    if (
      value >
        order.details[detailIndex].selectedBatches[selectedBatchIndex]
          .quantity ||
      value < 0
    ) {
      return;
    }
    const newOrder = { ...order };
    newOrder.details[detailIndex].selectedBatches[
      selectedBatchIndex
    ].additional_quantity = value;
    newOrder.details[detailIndex].quantity = _.sumBy(
      newOrder.details[detailIndex].selectedBatches,
      "additional_quantity"
    );
    newOrder.total_amount = _.sumBy(
      newOrder.details,
      (detail) => detail.quantity * detail.unit_price
    );
    setOrder(newOrder);
  };

  const handleChangeDetailQuantity = (e, detailIndex) => {
    const value = Number(e.target.value);
    if (value > order.details[detailIndex].branchInventory || value < 0) {
      return;
    }
    const newOrder = { ...order };
    newOrder.details[detailIndex].quantity = value;
    newOrder.total_amount = _.sumBy(
      newOrder.details,
      (detail) => detail.quantity * detail.unit_price
    );
    setOrder(newOrder);
  };

  const renderQuantityInput = (detail, detailIndex) => {
    if (detail?.has_batches) {
      return (
        <>
          <Typography>Tổng: {detail.quantity}</Typography>
          <FormControl variant="standard">
            <InputLabel id="batch-label">Lô</InputLabel>
            <Select
              labelId="batch-label"
              autoWidth
              labelWidth={100}
              fullWidth
              onChange={(e) => handleSelectBatch(e, detailIndex)}
            >
              {detail.batches.map((batch) => (
                <MenuItem value={batch} key={batch.code}>{`${
                  batch.batch_code
                }(${batch.expiry_date ? batch.expiry_date : ""})-${
                  batch.quantity
                }`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {detail.selectedBatches.map((batch, selectedBatchIndex) => (
            <div
              style={{
                marginTop: 5,
                marginBottom: 5,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#eee",
              }}
            >
              <Typography>{`${batch.batch_code}${
                batch.expiry_date ? "(" + batch.expiry_date + ")" : ""
              }`}</Typography>
              <TextField
                type="number"
                size="small"
                style={{ width: 30 }}
                value={batch.additional_quantity}
                onChange={(e) =>
                  handleChangeBatchQuantity(e, detailIndex, selectedBatchIndex)
                }
              />
              <Typography>{`/${batch.quantity}`}</Typography>
            </div>
          ))}
        </>
      );
    } else {
      return (
        <TextField
          type="number"
          size="small"
          style={{ width: 30 }}
          value={Math.min(detail.quantity, detail.branchInventory)}
          onChange={(e) => handleChangeDetailQuantity(e, detailIndex)}
        />
      );
    }
  };

  const isOrderEmpty = () => {
    return order.details?.every((detail) => detail.quantity === 0);
  };

  const handleCancelOrder = async () => {
    handleClose();
    try {
      const res = await orderApi.cancleCustomerOrder(store_uuid, branch_uuid, customerOrder.id);
      dispatch(statusAction.successfulStatus("Hủy đơn đặt thành công"));
    } catch (err) {
      console.log(err)
      dispatch(statusAction.failedStatus("Hủy đơn đặt thất bại"))
    }
  }

  return (
    <ModalWrapperWithClose open={isOpen} handleClose={handleClose} title="Đơn đặt">
      <Typography variant="h3">{customerOrder.customer_order_code}</Typography>
      <Grid
        container
        spacing={2}
        style={{ maxWidth: "100%", width: 800, marginTop: 15 }}
        flexDirection="row"
        alignItems="center"
      >
        <Grid item xs={12} container spacing={2}>
          <Grid item xs={6}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="flex-end"
            >
              <Typography>Tên khách: {customerOrder.name}</Typography>
              <Typography>Số điện thoại: {customerOrder.phone}</Typography>
              <Typography>Địa chỉ: {customerOrder.address}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="flex-end"
            >
              <Grid container direction="row" justifyContent="space-between">
                <Typography variant="h5">Tạm tính</Typography>
                <VNDInput
                  id="standard-basic"
                  style={{ width: 90 }}
                  size="small"
                  value={order.total_amount}
                  inputProps={{ style: { textAlign: "right" } }}
                />
              </Grid>
              <Grid container direction="row" justifyContent="space-between">
                <Typography variant="h5">Giảm giá</Typography>
                <VNDInput
                  id="standard-basic"
                  style={{ width: 90 }}
                  size="small"
                  value={order.discount}
                  inputProps={{ style: { textAlign: "right" } }}
                  onChange={(e) =>
                    setOrder({ ...order, discount: Number(e.target.value) })
                  }
                />
              </Grid>
              <Grid container direction="row" justifyContent="space-between">
                <Typography variant="h5">Tổng hóa đơn</Typography>
                <VNDInput
                  id="standard-basic"
                  style={{ width: 90 }}
                  size="small"
                  value={order.total_amount - order.discount}
                  inputProps={{ style: { textAlign: "right" } }}
                />
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell align="right">Sản phẩm</TableCell>
                <TableCell align="right">SL đặt</TableCell>
                <TableCell align="right">Tồn kho</TableCell>
                <TableCell align="right">Giá bán</TableCell>
                <TableCell align="right">SL bán</TableCell>
                <TableCell align="right">Thành tiền</TableCell>
                <TableCell align="right">Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.details?.map((detail, detailIndex) => (
                <TableRow key={detail.product_code}>
                  <TableCell component="th" scope="row">
                    {detail.product_code}
                  </TableCell>
                  <TableCell align="right">{detail.name}</TableCell>
                  <TableCell align="right">{detail.orderredQuantity}</TableCell>
                  <TableCell align="right">{detail.branchInventory}</TableCell>
                  <TableCell align="right">{detail.unit_price}</TableCell>
                  <TableCell align="right">
                    {renderQuantityInput(detail, detailIndex)}
                  </TableCell>
                  <TableCell align="right">
                    <VNDFormat value={detail.quantity * detail.unit_price} />{" "}
                  </TableCell>
                  <TableCell align="right">
                    {detail.quantity < detail.orderredQuantity ? (
                      <Typography style={{ color: "red" }}>Không đủ</Typography>
                    ) : (
                      <Typography style={{ color: "green" }}>Đủ</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid item xs={12}>
          <Box display="flex" flexDirection="row" justifyContent="flex-end">
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={handleCancelOrder}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              size="small"
              style={{ marginLeft: 20 }}
              color="primary"
              onClick={handleConfirm}
              disabled={isOrderEmpty()}
            >
              Xác nhận
            </Button>
          </Box>
        </Grid>
      </Grid>
    </ModalWrapperWithClose>
  );
};

export default OrderModal;
