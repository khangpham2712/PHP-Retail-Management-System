import React, { useRef, useState, useEffect } from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import { useReactToPrint } from "react-to-print";
import { ReceiptPrinter } from "../../../../../components/ReceiptPrinter/ReceiptPrinter";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { calculateTotalQuantity } from "../../../../../components/TableCommon/util/sortUtil";
// import library
import {
  Dialog,
  Card,
  DialogContent,
  Box,
  Tooltip,
  Chip,
  Grid,
  TableHead,
  TableBody,
  Typography,
  Table,
  TableCell,
  Divider,
  ListItem,
  TableRow,
  Collapse,
  Button,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@material-ui/core";
// import icon
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PrintTwoToneIcon from "@material-ui/icons/PrintTwoTone";
import GetAppTwoToneIcon from "@material-ui/icons/GetAppTwoTone";
import CloseIcon from "@material-ui/icons/Close";
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';

// import project
import { grey } from "@material-ui/core/colors";
import { useSelector, useDispatch } from "react-redux";
import {
  StyledMenu,
  StyledMenuItem,
} from "../../../../../components/Button/MenuButton";
import InvoiceReturnPopUp from "../../../../../components/PopUpReturn/InvoiceReturnPopUp/InvoiceReturnPopUp";

import orderApi from "../../../../../api/orderApi";
import { VNDFormat } from "../../../../../components/TextField/NumberFormatCustom";
import PayRemaining from "../../../../../components/Modal/PayRemaining";
import invoiceApi from "../../../../../api/invoiceApi";
import setting from "../../../../../assets/constant/setting"
import {statusAction} from '../../../../../store/slice/statusSlice'

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .MuiTextField-root": {
        marginTop: theme.spacing(2),
      },
    },
    headerTitle: {
      fontSize: "1.125rem",
    },
    typo: {
      marginBottom: 20,
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    card: {
      background: theme.customization.mode === "Light" ? null : grey[800],
      borderRadius: theme.customization.borderRadius,
      color: "#000000",
      borderWidth: 2,
    },
    background: {
      background:
        theme.customization.mode === "Light"
          ? theme.customization.primaryColor[50]
          : grey[700],
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
  })
);

function InvoiceDetail(props) {
  const { row, openRow, onReload } = props.parentProps;
  const { isMini } = props;
  const promotionDiscountValue = row.promotion_detail?.selectedPromotion?.discountType ==="discountInvoice" ?  row.promotion_value :0

  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const dispatch = useDispatch()

 
  //  tam thoi


  const theme = useTheme();
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const classes = useStyles(theme);
  const [reload, setReload] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseReturn = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    try {
      const res = orderApi.deleteOrder(store_uuid, branch_uuid, row.uuid);
      dispatch(statusAction.successfulStatus("Xóa hóa đơn thành công"));
      onReload();
    } catch (err) {
      dispatch(statusAction.failedStatus("Xóa hóa đơn thất bại"));
      console.log(err)
    }
  }

  const [order, setOrder] = useState({
    customer: { name: "" },
    created_by_user: { name: "" },
    branch: null,
    details: [],
  });


  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await orderApi.getOrder(store_uuid, row.uuid);
        // console.log(res.data)
        console.log("res",res.data)
        setOrder(res.data);
      } catch (error) {
        setOrder({
          customer: { name: "" },
          created_by_user: { name: "" },
          branch: null,
          details: [],
        });
      }

      // },
      //   [props.parentProps.openRow],
      // );
    };
    if (openRow === row.uuid) {
      loadData();
    }
  }, [props.parentProps.openRow, reload]);
  const debtAmount =
    order.total_amount -
    order.discount -
    promotionDiscountValue +
    +row.other_fee_value -
    order.paid_amount;
  const [openPayRemaining, setOpenPayRemaining] = useState(false);
  const editInventoryOrderApiCall = async (
    store_uuid,
    branch_uuid,
    uuid,
    body
  ) => {
    return orderApi.editOrderApi(store_uuid, branch_uuid, uuid, body);
  };

  //print

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  function getDifferenceInDays(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60 * 60 * 24);
  }
  const store_setting = info.store.general_configuration
    ? JSON.parse(info.store.general_configuration)
    : setting;
  const type = store_setting?.printReceiptWhenSell.cartModal;

  const returnLimit = store_setting?.returnLimit;

  // const haveReturnQuantity = order.details.ex(()=>returned_quantity)
  var haveReturnQuantity = order.details.every(function (element, index) {
    if (Number(element.returned_quantity) === 0) return false;
    else return true;
  });

  console.log("rowrowrowrowrowrow", row);

  const TableRowDetailCart = ({ detail }) => {
    return (
      <TableRow key={detail.product_id}>
        <TableCell component="th" scope="row">
          {detail.product_code}
        </TableCell>
        <TableCell>{detail.name}</TableCell>
        {/* <TableCell>{detail.bar_code}</TableCell> */}
        <TableCell align="right">
          <div>
            {detail.quantity}
            <div>
              {detail?.batches
                ? JSON.parse(detail.batches).map((batch) => (
                    <Chip
                      size="small"
                      label={`${
                        batch?.batch_code ? batch?.batch_code : "Mới"
                      }(${
                        batch?.expiry_date
                          ? batch?.expiry_date.substring(0, 10)
                          : ""
                      }) - ${batch.additional_quantity}`}
                      key={batch.id}
                      color={batch.is_new ? "primary" : "secondary"}
                      variant="outlined"
                    />
                  ))
                : null}
            </div>
          </div>
        </TableCell>
        {/* <TableCell align="right">{detail.returned_quantity}</TableCell> */}
        {haveReturnQuantity ? (
          <TableCell align="right">
            <div>
              {detail.returned_quantity}
              <div>
                {detail.batches
                  ? JSON.parse(detail.batches).map((batch) => (
                      <Chip
                        size="small"
                        label={`${
                          batch?.batch_code ? batch?.batch_code : "Mới"
                        }(${
                          batch?.expiry_date
                            ? batch?.expiry_date.substring(0, 10)
                            : ""
                        })-${batch.returned_quantity}`}
                        key={batch.id}
                        color={batch.is_new ? "primary" : "secondary"}
                        variant="outlined"
                      />
                    ))
                  : null}
              </div>
            </div>
          </TableCell>
        ) : null}
        <TableCell align="right">
          <VNDFormat value={detail.unit_price} />
        </TableCell>
        <TableCell align="right" style={{ fontWeight: 700 }}>
          <VNDFormat value={detail.quantity * detail.unit_price} />
        </TableCell>
      </TableRow>
    );
  };
  return (
    <Collapse
      in={isMini ? true : openRow === row.uuid}
      timeout="auto"
      unmountOnExit
    >
      <PayRemaining
        onReload={props.parentProps.onReload}
        reloadDetail={() => setReload(!reload)}
        uuid={row.uuid}
        debt={debtAmount}
        paid={Number(row.paid_amount)}
        title={
          <Typography variant="h4">
            Thu thêm hóa đơn <i>{row.order_code}</i>
          </Typography>
        }
        open={openPayRemaining}
        handleClose={() => setOpenPayRemaining(false)}
        editApiCall={editInventoryOrderApiCall}
      />
      {/* <Collapse in={true } timeout="auto" unmountOnExit> */}
      <Box margin={1}>
        <Typography
          variant="h3"
          gutterBottom
          component="div"
          className={classes.typo}
        >
          {row.name}
        </Typography>

        <Grid container direction="row" justifyContent="flex-start">
          <Grid item xs={12} sm={5}>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5}>
                <Typography variant="h5" gutterBottom component="div">
                  Mã hoá đơn
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  {row.order_code}{" "}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5}>
                <Typography variant="h5" gutterBottom component="div">
                  Ngày bán{" "}
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  {/* {row.creation_date}{" "} */}
                  {row.creation_date
                    ?.split(" ")[0]
                    .split("-")
                    .reverse()
                    .join("/")
                    .concat(
                      "\u00a0\u00a0" +
                        row.creation_date?.split(" ")[1].substr(0, 5)
                    )}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5}>
                <Typography variant="h5" gutterBottom component="div">
                  Khách hàng
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  {order.customer ? order.customer.name : ""}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5}>
                <Typography variant="h5" gutterBottom component="div">
                  Người bán
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  {order.created_by_user ? order.created_by_user.name : ""}{" "}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={7}>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item xs={7} sm={4}>
                <Typography variant="h5" gutterBottom component="div">
                  Trạng thái
                </Typography>
              </Grid>
              <Grid item xs={3} sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  {/* Cần thu <VNDFormat value={debtAmount} /> */}
                  {debtAmount > 0 ? "Cần thu thêm " : "Trả đủ"}
                  {debtAmount > 0 ? <VNDFormat value={debtAmount} /> : null}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                {debtAmount > 0 ? (
                  <Button
                    color="primary"
                    size="small"
                    variant="contained"
                    onClick={() => setOpenPayRemaining(true)}
                  >
                    Trả tiếp
                  </Button>
                ) : null}
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={4}>
                <Typography variant="h5" gutterBottom component="div">
                  Tổng tiền hoá đơn 
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  <VNDFormat
                    value={
                      order.total_amount -
                      order.discount -
                      promotionDiscountValue +
                      +row.other_fee_value
                    }
                  />
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={4}>
                <Typography variant="h5" gutterBottom component="div">
                  Chi nhánh thực hiện
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  {order.branch ? order.branch.name : ""}{" "}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={4}>
                <Typography variant="h5" gutterBottom component="div">
                  Phương thức thanh toán
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  {row.payment_method === "cash" ? "Tiền mặt" : "Thẻ"}{" "}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Typography
          variant="h4"
          gutterBottom
          component="div"
          style={{ marginTop: 30 }}
        >
          Danh sách sản phẩm
        </Typography>
        <Table size="small" aria-label="purchases">
          <TableHead>
            <TableRow>
              <TableCell>Mã SP</TableCell>
              <TableCell>Sản phẩm</TableCell>
              {/* <TableCell>Mã vạch</TableCell> */}
              <TableCell align="right">Số lượng</TableCell>
              {haveReturnQuantity ? (
                <TableCell align="right">Đổi trả</TableCell>
              ) : null}
              <TableCell align="right">Giá bán</TableCell>
              <TableCell align="right">Thành tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.details.map((detail) => (
              <TableRowDetailCart detail={detail} />
              // <TableRow key={detail.product_id}>
              //   <TableCell component="th" scope="row">
              //     {detail.product_code}
              //   </TableCell>
              //   <TableCell>{detail.name}</TableCell>
              //   {/* <TableCell>{detail.bar_code}</TableCell> */}
              //   <TableCell align="right">
              //     <div>
              //       {detail.quantity}
              //       <div>
              //         {detail.batches
              //           ? JSON.parse(detail.batches).map((batch) => (
              //               <Chip
              //                 size="small"
              //                 label={`${
              //                   batch?.batch_code ? batch?.batch_code : "Mới"
              //                 }(${
              //                   batch?.expiry_date
              //                     ? batch?.expiry_date.substring(0, 10)
              //                     : ""
              //                 }) - ${batch.additional_quantity}`}
              //                 key={batch.id}
              //                 color={batch.is_new ? "primary" : "secondary"}
              //                 variant="outlined"
              //               />
              //             ))
              //           : null}
              //       </div>
              //     </div>
              //   </TableCell>
              //   {/* <TableCell align="right">{detail.returned_quantity}</TableCell> */}
              //   {haveReturnQuantity?
              //    <TableCell align="right">
              //     <div>
              //       {detail.returned_quantity}
              //       <div>
              //         {detail.batches
              //           ? JSON.parse(detail.batches).map((batch) => (
              //               <Chip
              //                 size="small"
              //                 label={`${
              //                   batch?.batch_code ? batch?.batch_code : "Mới"
              //                 }(${
              //                   batch?.expiry_date
              //                     ? batch?.expiry_date.substring(0, 10)
              //                     : ""
              //                 })-${batch.returned_quantity}`}
              //                 key={batch.id}
              //                 color={batch.is_new ? "primary" : "secondary"}
              //                 variant="outlined"
              //               />
              //             ))
              //           : null}
              //       </div>
              //     </div>
              //   </TableCell>:null}
              //   <TableCell align="right">
              //     <VNDFormat value={detail.unit_price} />
              //   </TableCell>
              //   <TableCell align="right" style={{ fontWeight: 700 }}>
              //     <VNDFormat value={detail.quantity * detail.unit_price} />
              //   </TableCell>
              // </TableRow>
            ))}
          </TableBody>
        </Table>

        {row.promotion_detail?.selectedPromotion ? (
          <Box style={{ marginTop: 15 }}>
            {/* <Divider/> */}
            <ListItem>
              <Typography>
                <b style={{ color: "red" }}>Khuyến mãi </b>
              </Typography>
              <CardGiftcardIcon style={{ marginLeft: 10, color: "red" }} />
            </ListItem>
            <Typography style={{ color: "#000" }}>
              <b>{row.promotion_detail?.selectedPromotion.name}: </b>
              Tổng tiền hàng từ{" "}
              {row.promotion_detail?.bestDetailSelectedPromotion?.totalCost.toLocaleString()}{" "}
              đ
              {row.promotion_detail?.selectedPromotion?.discountType ===
              "discountInvoice"
                ? ` giảm giá ${row.promotion_detail?.bestDetailSelectedPromotion?.discountValue.toLocaleString()} ${
                    row.promotion_detail?.bestDetailSelectedPromotion?.type
                  }`
                : ` tặng:`}
            </Typography>
            {row.promotion_detail?.listGiftItem?.map((detail) => {
              return (
                <TableRow key={detail.product_id}>
                  <TableCell>{detail.quantity} sản phẩm</TableCell>
                  <TableCell>
                    {detail.product_code} - {detail.name}
                  </TableCell>
                </TableRow>
              );
            })}
          </Box>
        ) : null}

        <Box
          className={classes.background}
          style={{
            padding: 10,
            borderRadius: theme.customization.borderRadius,
            marginTop: 10,
          }}
        >
          <Grid container direction="column">
            <Grid container direction="row" justifyContent={"flex-end"}>
              <Grid item xs={7} sm={2}>
                {/* <Typography variant="h5" gutterBottom component="div">Tổng số lượng</Typography> */}
                <Typography variant="h5" gutterBottom component="div">
                  Tổng SL sản phẩm ({order.details.length})
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2}>
                <Typography variant="body1" gutterBottom component="div">
                  {calculateTotalQuantity(order.details)}
                </Typography>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent={"flex-end"}>
              <Grid item xs={7} sm={2}>
                <Typography variant="h5" gutterBottom component="div">
                  Tiền hàng
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2}>
                <Typography variant="body1" gutterBottom component="div">
                  <VNDFormat value={row.total_amount} />
                </Typography>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent={"flex-end"}>
              <Grid item xs={7} sm={2}>
                <Typography variant="h5" gutterBottom component="div">
                  Giảm giá{" "}
                  {row.promotion_detail?.bestDetailSelectedPromotion?.type ===
                  "%" ? (
                    <b style={{ color: "red" }}>
                      (
                      {
                        row?.promotion_detail?.bestDetailSelectedPromotion
                          ?.discountValue
                      }
                      %)
                    </b>
                  ) : (
                    ""
                  )}
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2}>
                <Typography variant="body1" gutterBottom component="div">
                  <VNDFormat value={row.discount + promotionDiscountValue} />
                </Typography>
              </Grid>
            </Grid>
            {row.other_fee_detail?.map((fee) => {
              if (fee?.name?.length > 0)
                return (
                  <Grid container direction="row" justifyContent={"flex-end"}>
                    <Grid item xs={7} sm={2}>
                      <Typography variant="h5" gutterBottom component="div">
                        {fee.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={2} sm={2}>
                      <Typography variant="body1" gutterBottom component="div">
                        <VNDFormat
                          value={
                            fee.type === "%"
                              ? (Number(fee.value) *
                                  (Number(row.total_amount) -
                                    Number(row.discount) -
                                    Number(row.promotion))) /
                                100
                              : fee.value
                          }
                        />
                      </Typography>
                    </Grid>
                  </Grid>
                );
            })}

            <Grid container direction="row" justifyContent={"flex-end"}>
              <Grid item xs={7} sm={2}>
                <Typography variant="h5" gutterBottom component="div">
                  Tổng tiền hoá đơn
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2}>
                <Typography
                  variant="body1"
                  gutterBottom
                  component="div"
                  style={{
                    fontWeight: 500,
                    color: theme.customization.primaryColor[500],
                  }}
                >
                  <VNDFormat
                    value={
                      row.total_amount -
                      row.discount -
                      promotionDiscountValue +
                      +row.other_fee_value
                    }
                  />
                </Typography>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent={"flex-end"}>
              <Grid item xs={7} sm={2}>
                <Typography variant="h5" gutterBottom component="div">
                  Khách đã trả
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2}>
                <Typography variant="body1" gutterBottom component="div">
                  <VNDFormat value={row.paid_amount} />
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Box>

        <Grid
          container
          direction="row"
          // justifyContent="flex-end"
          justifyContent={"flex-end"}
          style={{ marginTop: 20 }}
        >
          {/* Chỉ có nhân viên thực hiện nhập đơn đó  mới có thể xoá sửa */}
          {/* {currentUser === row.employee ? (
            <>
              {" "}
              <Button
                variant="contained"
                size="small"
                style={{ marginLeft: 15 }}
              >
                Sửa
              </Button>
              <Button
                variant="contained"
                size="small"
                style={{ marginLeft: 15 }}
              >
                Xoá
              </Button>{" "}
            </>
          ) : null} */}

          {info.user.uuid?.includes(order?.created_by_user.uuid) ||
          info.role?.includes("owner") ? (
            <Button
              variant="contained"
              size="small"
              // disabled={Number(row.total_amount) - Number(row.discount) - Number(row.paid_amount) > 0}
              style={{ marginLeft: 15 }}
              onClick={handleDelete}
            >
              Xóa hóa đơn
            </Button>
          ) : null}

          {returnLimit.status === false ||
          (returnLimit.status === true &&
            getDifferenceInDays(new Date(), new Date(row.creation_date)) <
              returnLimit.day) ? (
            <Button
              variant="contained"
              size="small"
              disabled={
                Number(row.total_amount) -
                  Number(row.discount) -
                  Number(row.paid_amount) >
                0
              }
              style={{ marginLeft: 15 }}
              onClick={handleClickOpen}
            >
              Trả hàng
            </Button>
          ) : null}
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginLeft: 15 }}
            startIcon={<PrintTwoToneIcon fontSize="small" />}
            onClick={() => handlePrint()}
          >
            In hoá đơn
          </Button>

          {/* <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClick}
            size="small"
            style={{ marginLeft: 10 }}
          >
            <MoreVertIcon />
          </IconButton> */}

          {/* <StyledMenu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <StyledMenuItem onClick={() => handlePrint()}>
              <ListItemIcon style={{ marginRight: -15 }}>
                <PrintTwoToneIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="In hoá đơn" />
            </StyledMenuItem>

            <StyledMenuItem>
              <ListItemIcon style={{ marginRight: -15 }}>
                <GetAppTwoToneIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Xuất excel" />
            </StyledMenuItem>
          </StyledMenu> */}
        </Grid>
      </Box>
      {/* 
      <Dialog fullWidth maxWidth="lg" open={open} onClose={handleCloseReturn} aria-labelledby="form-dialog-title">
        <InvoiceReturnPopUp handleCloseReturn={handleCloseReturn} order={order} classes={classes} /> */}

      {/* 3. Receipt */}
      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <ReceiptPrinter
            cart={order}
            date={row.creation_date
              ?.split(" ")[0]
              .split("-")
              .reverse()
              .join("/")}
            code={row.order_code}
            type={type}
          />
        </div>
      </div>

      {/* Tra hang */}

      <Dialog
        fullWidth
        maxWidth="lg"
        open={open}
        onClose={handleCloseReturn}
        aria-labelledby="form-dialog-title"
      >
        <InvoiceReturnPopUp
          handleCloseReturn={handleCloseReturn}
          order={order}
          classes={classes}
          reloadDetail={() => setReload(!reload)}
          reload={onReload}
        />
      </Dialog>
    </Collapse>
  );
}

export default InvoiceDetail;
