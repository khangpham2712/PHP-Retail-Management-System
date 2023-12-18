import React, { useRef, useEffect, useState } from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";

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
import CashBookPopUp from "../../CashBookPopUp/CashBookPopUp";
//import project
import {
  StyledMenu,
  StyledMenuItem,
} from "../../../../../../components/Button/MenuButton";

import { grey } from "@material-ui/core/colors";

// api
// import purchaseOrderApi from "../../../../../api/purchaseOrderApi";
import { useSelector, useDispatch } from "react-redux";
import { VNDFormat } from "../../../../../../components/TextField/NumberFormatCustom";
import { statusAction } from "../../../../../../store/slice/statusSlice";
import cashBookApi from "../../../../../../api/cashBookApi";
import { getUserType, getDocType } from "../CashBookTableRow";

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

const CashBookDetail = (props) => {
  const { row, openRow, onReload } = props.parentProps;
  const { isMini } = props;
  const [openPopup, setOpenPopup] = useState(false);

  //  tam thoi

  const currentUser = "Minh Tri";
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const dispatch = useDispatch()

  const theme = useTheme();
  const classes = useStyles(theme);
  // const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));

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
      const res = cashBookApi.delete(store_uuid, branch_uuid, row.id);
      dispatch(statusAction.successfulStatus("Xóa thành công"));
      onReload();
    } catch (err) {
      dispatch(statusAction.failedStatus("Xóa thất bại"));
      console.log(err)
    }
  }

  const [data, setData] = useState({
    branch: null,
    details: [],
  });

  const [reload, setReload] = useState(false);

  //print

  const componentRef = useRef();
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  // });

  return (
    <Collapse
      in={isMini ? true : openRow === row.id}
      timeout="auto"
      unmountOnExit
    >
       {openPopup && <CashBookPopUp open={openPopup} isEdit={true} row={row} handleClose={() => {
          setOpenPopup(false);
          onReload()
        }}/>}
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
                  Mã
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  {row.code}{" "}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5}>
                <Typography variant="h5" gutterBottom component="div">
                  Ghi chú
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  <strong>{getDocType(row.type)}{"-"}{row.note}</strong>
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5}>
                <Typography variant="h5" gutterBottom component="div">
                  Ngày tạo{" "}
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  {/* {row.creation_date}{" "} */}
                  {row.date
                    ?.split(" ")[0]
                    .split("-")
                    .reverse()
                    .join("/")
                    .concat(
                      "\u00a0\u00a0" +
                        row.date?.split(" ")[1].substr(0, 5)
                    )}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5}>
                <Typography variant="h5" gutterBottom component="div">
                  Đối tác
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  {row.user_name}{"-"}{getUserType(row.user_type)}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5}>
                <Typography variant="h5" gutterBottom component="div">
                  Người tạo
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                    {row.created_user_name ? row.created_user_name : "Xem giao dịch liên quan"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={7}>
            
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={4}>
                <Typography variant="h5" gutterBottom component="div">
                  Tổng tiền 
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  <VNDFormat
                    value={row.value}
                  ></VNDFormat>{" "}
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

        
        {/* <Box
          className={classes.background}
          style={{
            padding: 10,
            borderRadius: theme.customization.borderRadius,
            marginTop: 10,
          }}
        >
          <Grid container direction="column">
            <Grid container direction="row" justifyContent="flex-end">


                        <Grid item xs={2} >
                            <Typography variant="h5" gutterBottom component="div">Tổng số lượng</Typography>    
                        </Grid>
                        <Grid item xs={2} >
                            <Typography variant="body1" gutterBottom component="div">4 </Typography>
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
                  <VNDFormat value={row.total_amount} />
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
                  <VNDFormat value={row.discount} />
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
        </Box> */}

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

          {(row.type === 'receive' || row.type === 'pay') && <>
          <Button
            variant="contained"
            size="small"
            // disabled={Number(row.total_amount) - Number(row.discount) - Number(row.paid_amount) > 0}
            style={{ marginLeft: 15 }}
            onClick={() => setOpenPopup(true)}
          >
            Sửa
          </Button>

          <Button
            variant="contained"
            size="small"
            // disabled={Number(row.total_amount) - Number(row.discount) - Number(row.paid_amount) > 0}
            style={{ marginLeft: 15 }}
            onClick={handleDelete}
          >
            Xóa
          </Button>
          </>}


          

          {/* <Button
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

          <Button variant="contained" color="primary"size="small" style={{ marginLeft: 15 }} startIcon={<PrintTwoToneIcon fontSize="small" />} onClick={() => {}}>
            In đơn nhập
          </Button> */}
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
            {/* <ImportReceiptPrinter
              cart={purchaseOrder}
              date={row.creation_date}
            /> */}
          </div>
        </div>

        {/* Tra hang */}

        {/* <Dialog
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
        </Dialog> */}
      </Box>
    </Collapse>
  );
};

export default CashBookDetail;

const headCells = [
  { id: "stt", numeric: false, disablePadding: true, label: "Stt" },
  { id: "id", numeric: false, disablePadding: true, label: "#" },
  { id: "name", numeric: false, disablePadding: true, label: "Tên" },
  { id: "price", numeric: true, disablePadding: true, label: "Đơn giá" },
  { id: "quantity", numeric: true, disablePadding: true, label: "Số lượng" },
  { id: "protein1", numeric: true, disablePadding: true, label: "Thành tiền" },
];
