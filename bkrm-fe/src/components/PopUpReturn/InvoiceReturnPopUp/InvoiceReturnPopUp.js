import React, { useEffect } from 'react';
import {
  Dialog, TextField, Card, ListItem, DialogContent, Box, Grid, TableHead, TableBody, Typography, Table, TableCell, TableRow, Collapse, Button, ListItemIcon, ListItemText, IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useSelector, useDispatch } from 'react-redux';
import update from 'immutability-helper';
import moment from 'moment';
import useStyles from '../../TableCommon/style/mainViewStyle';
import { useTheme } from "@material-ui/core/styles";

// import library

import InvoiceReturnSummary from '../../CheckoutComponent/CheckoutSummary/InvoiceReturnSummary/InvoiceReturnSummary';

import * as HeadCells from '../../../assets/constant/tableHead';
import * as TableType from '../../../assets/constant/tableType';
import SearchProduct from '../../SearchBar/SearchProduct';
import TableHeader from '../../TableCommon/TableHeader/TableHeader';
import TableWrapper from '../../TableCommon/TableWrapper/TableWrapper';
import { getComparator, stableSort } from '../../TableCommon/util/sortUtil';
import * as Input from '../../TextField/NumberFormatCustom';
import ButtonQuantity from '../../Button/ButtonQuantity';
import refundApi from '../../../api/refundApi';
import SnackBarGeneral from '../../SnackBar/SnackBarGeneral';
import {statusAction} from '../../../store/slice/statusSlice';
import {ReturnCartMiniTableRow} from "../../../components/MiniTableRow/MiniTableRow"
import useMediaQuery from "@material-ui/core/useMediaQuery";
import _ from 'lodash';
import setting from "../../../assets/constant/setting"

function InvoiceReturnPopUp(props) {
  const { order, classes, handleCloseReturn , reload, reloadDetail } = props;
  const theme = useTheme();

  // redux
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const store_setting = info.store.general_configuration? JSON.parse(info.store.general_configuration): setting

  const dispatch = useDispatch();
  // 2. Table sort
  // const [order, setOrder] = React.useState('desc');
  // const [orderBy, setOrderBy] = React.useState('stt');
  // const handleRequestSort = (event, property) => {
  //     const isAsc = orderBy === property && order === 'asc';
  //     setOrder(isAsc ? 'desc' : 'asc');
  //     setOrderBy(property);
  // };

  const [isUpdateTotalAmount, setIsUpdateTotalAmount] = React.useState(false);
  const [refund, setRefund] = React.useState({
    order_code: order.order_code,
    order_id: order.id,
    branch: order.branch,
    customer: order.customer,
    customer_id: order.customer_id,
    branch_id: order.branch_id,
    order_total_amount: order.total_amount,
    total_amount: 0,
    details: order.details.map((detail) => ({
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
      order_batches: JSON.parse(detail.batches),
    })),
    payment_method: 'cash',
    paid_amount: '0',
    scores:'0'
  });
  const [openSnack, setOpenSnack] = React.useState(false);
  const [snackStatus, setSnackStatus] = React.useState({
    style: 'error',
    message: 'Trả hàng thất bại',
  });

  const handleChangeBatches = (itemId, newBatches) => {
    const itemIndex = refund.details.findIndex(
      (item) => item.id === itemId
    );
    const newRefund = _.cloneDeep(refund);

    // console.log(newBatches);
    newRefund.details[itemIndex].selectedBatches = newBatches;
    newRefund.details[itemIndex].returnQuantity = _.sumBy(
      newBatches,
      "returned_quantity"
    );
    // console.log(newRefund);
    setRefund(newRefund);
    setIsUpdateTotalAmount(!isUpdateTotalAmount);
  };

  useEffect(() => {
    updateTotalAmount();
  }, [isUpdateTotalAmount]);

  const updateTotalAmount = () => {
    let total = 0;
    refund.details.forEach((item) => {
      total += item.returnPrice * item.returnQuantity;
    });

    let newRefund = update(refund, {
      total_amount: { $set: total },
      // paid_amount:{ $set: total.toString() },
      paid_amount: { $set: total },
      scores: { $set:  store_setting?.customerScore.status  ? parseInt((total)/store_setting?.customerScore.value)  :'0'},
      
    });
    // newRefund = update(refund, {
    //   paid_amount:{ $set: total },
      
    // });
    

    setRefund(newRefund);
    
  };

  const handleDeleteItem = (itemId) => {
    const itemIndex = refund.details.findIndex(
      (item) => item.id === itemId,
    );
    const newRefund = update(refund, {
      details: { $splice: [[itemIndex, 1]] },
    });
    setRefund(newRefund);
    setIsUpdateTotalAmount(!isUpdateTotalAmount);
  };

  const handleItemQuantityChange = (itemId, newQuantity) => {
    const itemIndex = refund.details.findIndex(
      (item) => item.id === itemId,
    );
    const newRefund = update(refund, {
      details: {
        [itemIndex]: {
          returnQuantity: { $set: newQuantity },
        },
      },
    });
    setRefund(newRefund);
    setIsUpdateTotalAmount(!isUpdateTotalAmount);
  };

  const handleProductPriceChange = (itemId, newPrice) => {
    const itemIndex = refund.details.findIndex(
      (item) => item.id === itemId,
    );
    const newRefund = update(refund, {
      details: {
        [itemIndex]: {
          returnPrice: { $set: newPrice },
        },
      },
    });
    setRefund(newRefund);
    setIsUpdateTotalAmount(!isUpdateTotalAmount);
  };

  const handlePaidAmountChange = (paidAmount) => {
    const newRefund = update(refund, { paid_amount: { $set: paidAmount } });
    setRefund(newRefund);
  };

  const handlePaymentMethodChange = (paymentMethod) => {
    const newRefund = update(refund, { payment_method: { $set: paymentMethod } });
    setRefund(newRefund);
  };

  const handleConfirm = async () => {
    const d = moment.now() / 1000;

    const import_date = moment.unix(d).format('YYYY-MM-DD HH:mm:ss', { trim: false });

    const body = {
      order_uuid: order.uuid,
      customer_id: refund.customer_id,
      total_amount: refund.total_amount.toString(),
      payment_method: refund.payment_method,
      paid_amount: refund.paid_amount,
      points:refund.scores,
      status:
      refund.paid_amount >= refund.total_amount
        ? 'closed'
        : 'debt',
      details: refund.details.map((detail) => ({
        product_id: detail.product_id,
        quantity: detail.returnQuantity,
        unit_price: detail.returnPrice,
        order_detail_id: detail.id,
        selectedBatches: detail.selectedBatches.map((batch) =>
          _.omit(batch, ["additional_quantity", "max_return_quantity"])
        ),
        order_batches: detail.order_batches.map((batch) => {
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
      import_date,
     
    };

    try {
      const res = await refundApi.removeInventory(
        store_uuid,
        refund.branch.uuid,
        body,
      );
      dispatch(statusAction.successfulStatus(`Trả hàng thành công: ${res.data.refund_code}`))
      reload();
      reloadDetail();
      handleCloseReturn()
    } catch (err) {
      dispatch(statusAction.failedStatus('Trả hàng thất bại!'))
      setOpenSnack(true);
      console.log(err);
    }
  };
  const handleCloseSnackBar = (event, reason) => {
    setOpenSnack(false);
  };

  const xsScreen = useMediaQuery(theme.breakpoints.down("xs")) ;


  return (
    <>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
       
        <ListItem style={{ paddingTop: 20, marginBottom: -20, marginLeft: 25 }}>
          <Typography variant="h3" style={{ marginRight: 30 }}>Trả hàng</Typography>

          {/* Search nayf chir search những sản phẩm trong hoá đơn thôi -> đổi lại thanh search khác sau */}
          {/* <SearchProduct /> */}
        </ListItem>

        <IconButton aria-label="close" className={classes.closeButton} onClick={handleCloseReturn}>
          <CloseIcon />
        </IconButton>

      </Grid>

      <DialogContent style={{ marginTop: 25 }}>
        <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
         
          <Grid item xs={12} sm={8}>
            <Card className={classes.card}>
              <Box style={{ padding: 30, minHeight: '75vh' }}>
                {/* JSON data attribute phải giongso table head id */}
                {/* <ListItem headCells={HeadCells.CartReturnHeadCells}  cartData={row.list} tableType={TableType.CART_RETURN} /> */}
               {!xsScreen ? ( <TableWrapper isCart>
                  <TableHeader
                    classes={classes}
                                    // order={order}
                                    // orderBy={orderBy}
                                    // onRequestSort={handleRequestSort}
                    headerData={HeadCells.CartReturnHeadCells}
                  />
                  <TableBody>
                    {/* {
                                    stableSort(row.list, getComparator(order, orderBy))
                                        .map((row, index) => {
                                        return (
                                            <CartReturnTableRow row={row}/>
                                        );})
                                } */}

                    {refund.details.map((detail, index) => (
                      <CartReturnTableRow
                        handleProductPriceChange={handleProductPriceChange}
                        handleItemQuantityChange={handleItemQuantityChange}
                        detail={detail}
                        handleChangeBatches={handleChangeBatches}
                      />
                    
                    ))}
                  </TableBody>
                </TableWrapper>):
                refund.details.map((detail, index) => (
                  // <CartReturnTableRow
                  //   handleProductPriceChange={handleProductPriceChange}
                  //   handleItemQuantityChange={handleItemQuantityChange}
                  //   detail={detail}
                  // />
                  <ReturnCartMiniTableRow
                    detail={detail}
                    handleProductPriceChange={handleProductPriceChange}
                    handleItemQuantityChange={handleItemQuantityChange}
                    isCart={true}
                  />

                ))
              }
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4} className={classes.card}>
            <Card className={classes.card}>
              <InvoiceReturnSummary
                data={refund}
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

export default InvoiceReturnPopUp;

function CartReturnTableRow({ detail, handleProductPriceChange, handleItemQuantityChange, handleChangeBatches }) {
  const classes = useStyles();
  const theme = useTheme();



  const [show, setShow] = React.useState('none');
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
      <TableCell align="left" style={{ width: 5 }}>{detail.product_code}</TableCell>
      {/* <TableCell align="left">{row.id}</TableCell> */}
      <TableCell align="left">{detail.name}</TableCell>
      <TableCell align="right"><Input.ThousandFormat style={{ width: 70 }} value={detail.unit_price}/></TableCell>
      <TableCell align="right">
      { canFixPriceSell.status && canFixPriceSell.returnImport?
        <Input.ThousandSeperatedInput id="standard-basic" style={{ width: 70 }} size="small" inputProps={{ style: { textAlign: 'right' } }} defaultPrice={detail.returnPrice} onChange={(e) => handleChangePrice(e.target.value)} />
     :<Input.ThousandFormat  value={detail.returnPrice} > </Input.ThousandFormat>}
     
        </TableCell>

      {/* <TableCell align="left" padding="none">
        <ButtonQuantity
          quantity={detail.returnQuantity}
          limit={detail.quantity - detail.returned_quantity}
          setQuantity={handleChangeQuantity}
          show={show}
          setShow={setShow}
          isReturn={true}
        />
      </TableCell> */}
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
     < Input.VNDFormat value={Number(detail.returnQuantity) * Number(detail.returnPrice)} />
      </TableCell>

    </TableRow>
  );
}
