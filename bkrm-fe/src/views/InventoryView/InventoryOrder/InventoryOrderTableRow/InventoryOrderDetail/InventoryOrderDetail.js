import React, { useRef, useEffect, useState } from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import { useReactToPrint } from "react-to-print";
import { ImportReceiptPrinter } from "../../../../../components/ReceiptPrinter/ReceiptPrinter";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { calculateTotalQuantity } from "../../../../../components/TableCommon/util/sortUtil";
import {currentDate} from "../../../../../utils"
//import library 
import {
  Dialog,
  Tooltip,
  Chip,
  Card,
  DialogContent,
  Box,
  Grid,
  TableHead,
  TableBody,
  Typography,
  Table,
  TableCell,
  TableRow,
  Collapse,
  Button,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@material-ui/core";

//import icon
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PrintTwoToneIcon from "@material-ui/icons/PrintTwoTone";
import GetAppTwoToneIcon from "@material-ui/icons/GetAppTwoTone";

//import project
import {
  StyledMenu,
  StyledMenuItem,
} from "../../../../../components/Button/MenuButton";
import InventoryReturnPopUp from "../../../../../components/PopUpReturn/InventoryReturnPopUp/InventoryReturnPopUp";

import { grey } from "@material-ui/core/colors";

// api
import purchaseOrderApi from "../../../../../api/purchaseOrderApi";
import { useSelector, useDispatch } from "react-redux";
import { VNDFormat } from "../../../../../components/TextField/NumberFormatCustom";
import PayRemaining from "../../../../../components/Modal/PayRemaining";
import { statusAction } from "../../../../../store/slice/statusSlice";
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
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
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

const InventoryOrderDetail = (props) => {
  const { row, openRow, onReload } = props.parentProps;
  const { isMini } = props;
  //  tam thoi

  const currentUser = "Minh Tri";
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const dispatch = useDispatch()

  const theme = useTheme();
  const classes = useStyles(theme);
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));

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
      const res = purchaseOrderApi.deletePurchaseOrder(store_uuid, branch_uuid, row.uuid);
      dispatch(statusAction.successfulStatus("Xóa đơn nhập thành công"));
      props.parentProps.onReload();
    } catch (err) {
      dispatch(statusAction.failedStatus("Xóa đơn nhập thất bại"));
      console.log(err)
    }
  }

  const [purchaseOrder, setPurchaseOrder] = useState({
    branch: null,
    details: [],
  });

  const [reload, setReload] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await purchaseOrderApi.getPurchaseOrder(
          store_uuid,
          row.uuid
        );
        setPurchaseOrder(res.data);
      } catch (error) {
        setPurchaseOrder({
          branch: null,
          details: [],
        });
      }
    };
    if (openRow === row.uuid) {
      loadData();
    }
  }, [props.parentProps.openRow, reload]);

  const updateDetail = async (detail) => {
    if(store_uuid && branch_uuid) {
      try {
        const response = await purchaseOrderApi.updateDetail(store_uuid, branch_uuid, {...detail, posted_to_inventory: 1, date_received: currentDate()});
        props.parentProps.onReload();
        setReload(!reload)
        statusAction.successfulStatus("Nhập thành công");
      } catch(err) {
        statusAction.failedStatus("Nhập thất bại")
      }
    } 
  }

  useEffect(() => {}, [purchaseOrder]);
  const debtAmount =
    Number(row.total_amount) - Number(row.discount) - Number(row.paid_amount);
  const [openPayRemaining, setOpenPayRemaining] = useState(false);
  const editInventoryOrderApiCall = async (
    store_uuid,
    branch_uuid,
    uuid,
    body
  ) => {
    return purchaseOrderApi.editPurchaseOrder(
      store_uuid,
      branch_uuid,
      uuid,
      body
    );
  };

  //print

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <Collapse
      in={isMini ? true : openRow === row.uuid}
      timeout="auto"
      unmountOnExit
    >
      <PayRemaining
        reloadDetail={() => setReload(!reload)}
        onReload={props.parentProps.onReload}
        uuid={row.uuid}
        debt={debtAmount}
        paid={Number(row.paid_amount)}
        title={
          <Typography variant="h4">
            Trả nợ đơn nhập hàng <i>{row.purchase_order_code}</i>
          </Typography>
        }
        open={openPayRemaining}
        handleClose={() => setOpenPayRemaining(false)}
        editApiCall={editInventoryOrderApiCall}
      />
      {/* <Collapse in={ true } timeout="auto" unmountOnExit> */}
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
                  Mã đơn nhập
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  {row.purchase_order_code}{" "}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5}>
                <Typography variant="h5" gutterBottom component="div">
                  Ngày nhập{" "}
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
                  Nhà cung cấp
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  {row.supplier_name}{" "}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5}>
                <Typography variant="h5" gutterBottom component="div">
                  Người nhập
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  {purchaseOrder.created_by_user
                    ? purchaseOrder.created_by_user.name
                    : ""}{" "}
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
              <Grid item xs={3} sm={3}>
                <Box>
                  <Typography variant="body1" gutterBottom component="div">
                    {debtAmount > 0 ? "Còn nợ " : "Trả đủ"}
                    {debtAmount > 0 ? <VNDFormat value={debtAmount} /> : null}
                  </Typography>
                </Box>
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
                  Tổng tiền nhập
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  <VNDFormat
                    value={row.total_amount - row.discount}
                  ></VNDFormat>{" "}
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
                  {purchaseOrder.branch ? purchaseOrder.branch.name : ""}
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
              <TableCell align="right">Đổi trả</TableCell>
              <TableCell align="right">Giá nhập</TableCell>
              <TableCell align="left">Thành tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchaseOrder.details.map((detail) => (
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
                              })-${batch.additional_quantity}`}
                              key={batch.id}
                              color={batch.is_new ? "primary" : "secondary"}
                              variant="outlined"
                            />
                          ))
                        : null}
                    </div>
                  </div>
                </TableCell>

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
                <TableCell align="right">
                  <VNDFormat value={detail.unit_price} />
                </TableCell>
                <TableCell align="right" style={{ fontWeight: 700 }}>
                  <VNDFormat
                    value={Number(detail.quantity) * Number(detail.unit_price)}
                  />
                  {!row.is_imported && !detail.posted_to_inventory ? <Button variant="contained" color="primary" size="small" style={{ marginLeft: 15, height: 30 }} onClick={() => updateDetail(detail)}>
            Nhập
          </Button>: null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box
          className={classes.background}
          style={{
            padding: 10,
            borderRadius: theme.customization.borderRadius,
            marginTop: 10,
          }}
        >
          <Grid container direction="column">
            {/* <Grid container direction="row" justifyContent="flex-end">


                        <Grid item xs={2} >
                            <Typography variant="h5" gutterBottom component="div">Tổng số lượng</Typography>    
                        </Grid>
                        <Grid item xs={2} >
                            <Typography variant="body1" gutterBottom component="div">4 </Typography>
                        </Grid>
                    </Grid> */}

            <Grid container direction="row" justifyContent={"flex-end"}>
              <Grid item xs={7} sm={2}>
                <Typography variant="h5" gutterBottom component="div">
                  Tổng SL sản phẩm ({purchaseOrder.details.length})
                </Typography>
              </Grid>
              <Grid item xs={3} sm={2}>
                <Typography variant="body1" gutterBottom component="div">
                  {calculateTotalQuantity(purchaseOrder.details)}
                </Typography>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent={"flex-end"}>
              <Grid item xs={7} sm={2}>
                <Typography variant="h5" gutterBottom component="div">
                  Tiền hàng
                </Typography>
              </Grid>
              <Grid item xs={3} sm={2}>
                <Typography variant="body1" gutterBottom component="div">
                  <VNDFormat value={purchaseOrder.total_amount} />
                </Typography>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent={"flex-end"}>
              <Grid item xs={7} sm={2}>
                <Typography variant="h5" gutterBottom component="div">
                  Giảm giá
                </Typography>
              </Grid>

              <Grid item xs={3} sm={2}>
                <Typography variant="body1" gutterBottom component="div">
                  <VNDFormat value={purchaseOrder.discount} />
                </Typography>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent={"flex-end"}>
              <Grid item xs={7} sm={2}>
                <Typography variant="h5" gutterBottom component="div">
                  Tổng tiền nhập
                </Typography>
              </Grid>
              <Grid item xs={3} sm={2}>
                <Typography
                  variant="body1"
                  gutterBottom
                  component="div"
                  style={{
                    fontWeight: 500,
                    color: theme.customization.primaryColor[500],
                  }}
                >
                  <VNDFormat value={row.total_amount - row.discount} />
                </Typography>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent={"flex-end"}>
              <Grid item xs={7} sm={2}>
                <Typography variant="h5" gutterBottom component="div">
                  Đã trả NCC
                </Typography>
              </Grid>
              <Grid item xs={3} sm={2}>
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
          justifyContent={"flex-end"}
          style={{ marginTop: 20 }}
        >
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
          {/* {info.user?.uuid?.includes(purchaseOrder?.created_by_user?.uuid) ||  info.role?.includes("owner") ?
            <Button
              variant="contained"
              size="small"
              style={{ marginLeft: 15}}
              // onClick={handleDelete}
            >
              Xóa đơn nhập
          </Button> :null} */}

          <Button
            variant="contained"
            size="small"
            // disabled={Number(row.total_amount) - Number(row.discount) - Number(row.paid_amount) > 0}
            style={{ marginLeft: 15 }}
            onClick={handleDelete}
          >
            Xóa đơn nhập
          </Button>

          <Button
            variant="contained"
            size="small"
            style={{ marginLeft: 15 }}
            onClick={handleClickOpen}
            disabled={
              Number(row.total_amount) -
                Number(row.discount) -
                Number(row.paid_amount) >
              0
            }
          >
            Trả hàng
          </Button>

          <Button variant="contained" color="primary"size="small" style={{ marginLeft: 15 }} startIcon={<PrintTwoToneIcon fontSize="small" />} onClick={() => handlePrint()}>
            In đơn nhập
          </Button>

          {!row.is_imported ? <Button variant="contained" color="secondary"size="small" style={{ marginLeft: 15 }} onClick={() => handlePrint()}>
            Nhập hàng
          </Button> : null}
{/* 
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClick}
            size="small"
            style={{ marginLeft: 10 }}
          >
            <MoreVertIcon />
          </IconButton>

          <StyledMenu
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
              <ListItemText primary="In đơn nhập" />
            </StyledMenuItem>

            <StyledMenuItem>
              <ListItemIcon style={{ marginRight: -15 }}>
                <GetAppTwoToneIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Xuất excel" />
            </StyledMenuItem>
          </StyledMenu> */}
        </Grid>

        {/* 3. Receipt */}
        <div style={{ display: "none" }}>
          <div ref={componentRef}>
            <ImportReceiptPrinter
              cart={purchaseOrder}
              date={row.creation_date}
            />
          </div>
        </div>

        {/* Tra hang */}

        <Dialog
          fullWidth={true}
          maxWidth="lg"
          open={open}
          onClose={handleCloseReturn}
          aria-labelledby="form-dialog-title"
        >
          <InventoryReturnPopUp
            handleCloseReturn={handleCloseReturn}
            purchaseOrder={purchaseOrder}
            classes={classes}
            reload={props.parentProps.onReload}
            reloadDetail={() => setReload(!reload)}
          />
        </Dialog>
      </Box>
    </Collapse>
  );
};

export default InventoryOrderDetail;

const headCells = [
  { id: "stt", numeric: false, disablePadding: true, label: "Stt" },
  { id: "id", numeric: false, disablePadding: true, label: "#" },
  { id: "name", numeric: false, disablePadding: true, label: "Tên" },
  { id: "price", numeric: true, disablePadding: true, label: "Đơn giá" },
  { id: "quantity", numeric: true, disablePadding: true, label: "Số lượng" },
  { id: "protein1", numeric: true, disablePadding: true, label: "Thành tiền" },
];
