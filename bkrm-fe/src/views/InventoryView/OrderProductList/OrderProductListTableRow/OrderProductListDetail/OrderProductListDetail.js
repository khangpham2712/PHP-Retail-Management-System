import React, {useState, useEffect} from 'react'
import {useTheme, makeStyles,createStyles} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

//import library
import {Dialog,Card,DialogContent,Box,Grid,TableHead,TableBody,Typography,Table,TableCell,TableRow,Collapse,Button,ListItemIcon,ListItemText,IconButton} from '@material-ui/core';

//import icon
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PrintTwoToneIcon from '@material-ui/icons/PrintTwoTone';
import GetAppTwoToneIcon from '@material-ui/icons/GetAppTwoTone';


//import project 
import {StyledMenu,StyledMenuItem} from '../../../../../components/Button/MenuButton'
import InventoryReturnPopUp from '../../../../../components/PopUpReturn/InventoryReturnPopUp/InventoryReturnPopUp';
import { VNDFormat,ThousandFormat } from '../../../../../components/TextField/NumberFormatCustom';

import { grey} from '@material-ui/core/colors'
import OrderModal from './OrderModal';
import orderApi from '../../../../../api/orderApi';
import { statusAction } from '../../../../../store/slice/statusSlice';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
const useStyles = makeStyles((theme) =>
createStyles({
  root: {
    '& .MuiTextField-root': {
      marginTop: theme.spacing(2),
    },
  },
  headerTitle:{
    fontSize: '1.125rem'
  },
  typo:{
    marginBottom:20
  },
  card: {
    background: theme.customization.mode === "Light"? null: grey[800],
    borderRadius:theme.customization.borderRadius,
    color: '#000000',
    borderWidth:2,
  },
  background:{
    background: theme.customization.mode === "Light"? theme.customization.primaryColor[50]: grey[700]
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },

}));

const getOrderStatus = (status) =>{
  if(status === "new") {return "Chờ chấp nhận"}
  if(status==="cancelled") {return "Đã hủy"}
  if(status==="confirmed") {return "Chờ giao"}
  if(status==="paid") {return "Hoàn thành"}
}
const OrderProductListDetail = (props) => {
    const {row,openRow, reload }= props.parentProps;
    const {isMini}= props.parentProps;

    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    
  //  tam thoi
    const currentUser = "Minh Tri";

    const theme = useTheme();
    const classes = useStyles(theme);
    const xsScreen = useMediaQuery(theme.breakpoints.down("xs")) ;
    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branch_uuid = info.branch.uuid;
    const branch = info.branch;

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

    const dispatch = useDispatch();

    const handlePayment = async () => {
      let d = moment.now() / 1000;
      let paid_date = moment
        .unix(d)
        .format("YYYY-MM-DD HH:mm:ss", { trim: false });

      try {
        const res = await orderApi.paymentCustomerOrder(store_uuid, branch_uuid, row.id , {paid_date: paid_date})
        reload();
        dispatch(statusAction.successfulStatus('Thanh toán thành công'))
      }catch(err) {
        console.log(err);
        dispatch(statusAction.failedStatus('Thanh toán thất bại'))
      }
    }
    return (
      // <Collapse in={ openRow === row.id } timeout="auto" unmountOnExit>
      <Collapse in={openRow === row.id} timeout="auto" unmountOnExit>
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
                <Grid item xs={6} sm={5}>
                  <Typography variant="h5" gutterBottom component="div">
                    Mã đơn đặt
                  </Typography>
                </Grid>
                <Grid item sm={4}>
                  <Typography variant="body1" gutterBottom component="div">
                    {row.customer_order_code}{" "}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container direction="row" justifyContent="flex-start">
                <Grid item xs={6} sm={5}>
                  <Typography variant="h5" gutterBottom component="div">
                    Ngày đặt{" "}
                  </Typography>
                </Grid>
                <Grid item sm={4}>
                  <Typography variant="body1" gutterBottom component="div">
                    {/* {row.created_at}{" "} */}
                    {row.created_at?.split(" ")[0].split('-').reverse().join('/').concat("\u00a0\u00a0"+ row.created_at?.split(" ")[1].substr(0, 5)) }
                  </Typography>
                </Grid>
              </Grid>
              <Grid container direction="row" justifyContent="flex-start">
                <Grid item xs={6} sm={5}>
                  <Typography variant="h5" gutterBottom component="div">
                    Tên khách
                  </Typography>
                </Grid>
                <Grid item sm={4}>
                  <Typography variant="body1" gutterBottom component="div">
                    {row.name}{" "}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container direction="row" justifyContent="flex-start">
                <Grid item xs={6} sm={5}>
                  <Typography variant="h5" gutterBottom component="div">
                    Số điện thoại
                  </Typography>
                </Grid>
                <Grid item sm={4}>
                  <Typography variant="body1" gutterBottom component="div">
                    {row.phone}{" "}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={5}>
              <Grid container direction="row" justifyContent="flex-start">
                <Grid item xs={6} sm={6}>
                  <Typography variant="h5" gutterBottom component="div">
                    Trạng thái
                  </Typography>
                </Grid>
                <Grid item sm={4}>
                  <Typography variant="body1" gutterBottom component="div">
                 { getOrderStatus(row.status)}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container direction="row" justifyContent="flex-start">
                <Grid item xs={6} sm={6}>
                  <Typography variant="h5" gutterBottom component="div">
                    Khoảng tiền{" "}
                  </Typography>
                </Grid>
                <Grid item sm={4}>
                  <Typography variant="body1" gutterBottom component="div">
                    <VNDFormat value={row.total_amount} />
                  </Typography>
                </Grid>
              </Grid>
              <Grid container direction="row" justifyContent="flex-start">
                <Grid item xs={6} sm={6}>
                  <Typography variant="h5" gutterBottom component="div">
                    Địa chỉ{" "}
                  </Typography>
                </Grid>
                <Grid item sm={4}>
                  <Typography variant="body1" gutterBottom component="div">
                    {row.address}{`, `}{row.ward} {`, `}{row.district}{`, `}{row.city}
                  </Typography>
                </Grid>
              </Grid>
              {/* <Grid container direction="row" justifyContent="flex-start">
                        <Grid item xs={6} sm={6} >
                            <Typography variant="h5" gutterBottom component="div">Chi nhánh thực hiện</Typography>    
                        </Grid>
                        <Grid item  sm={4} >
                            <Typography variant="body1" gutterBottom component="div">{row.branch} </Typography>
                        </Grid>
                    </Grid> */}
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
                <TableCell>#</TableCell>
                <TableCell>Sản phẩm</TableCell>
                <TableCell align="right">Số lượng</TableCell>
                <TableCell align="right">Giá bán</TableCell>
                <TableCell align="right">Thành tiền</TableCell>
                {/* <TableCell align="right">Đã nhập</TableCell>
                     <TableCell align="right">Trạng thái</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {JSON.parse(row.details ? row.details : "[]").map(
                (historyRow) => (
                  <TableRow key={historyRow.product_id}>
                    <TableCell component="th" scope="row">
                      {historyRow.product_code}
                    </TableCell>
                    <TableCell>{historyRow.name}</TableCell>
                    <TableCell align="right">
                      <ThousandFormat value={historyRow.quantity} />
                    </TableCell>
                    <TableCell align="right">
                      <VNDFormat value={historyRow.list_price} />
                    </TableCell>
                    <TableCell align="right" style={{ fontWeight: 700 }}>
                      <VNDFormat
                        value={historyRow.quantity * historyRow.list_price}
                      />
                    </TableCell>
                    {/* <TableCell align="right"><ThousandFormat value={0} /></TableCell>
                       <TableCell align="right">Đã nhập đủ</TableCell> */}
                  </TableRow>
                )
              )}
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
              {/* <Grid container direction="row" justifyContent={ "flex-end"}>
                        <Grid item xs={6}sm={2} >
                            <Typography variant="h5" gutterBottom component="div">Tổng số lượng</Typography>    
                        </Grid>
                        <Grid item xs={2} >
                            <Typography variant="body1" gutterBottom component="div"><ThousandFormat value={JSON.parse(row.details).} /> </Typography>
                        </Grid>
                    </Grid> */}
              <Grid container direction="row" justifyContent={"flex-end"}>
                <Grid item xs={6} sm={2}>
                  <Typography variant="h5" gutterBottom component="div">
                    Tổng số mặt hàng
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body1" gutterBottom component="div">
                    <ThousandFormat
                      value={
                        JSON.parse(row.details ? row.details : "[]").length
                      }
                    />
                  </Typography>
                </Grid>
              </Grid>

              <Grid container direction="row" justifyContent={"flex-end"}>
                <Grid item xs={6} sm={2}>
                  <Typography variant="h5" gutterBottom component="div">
                    Khoảng tiền hàng
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body1" gutterBottom component="div">
                    <VNDFormat value={row.total_amount} />{" "}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container direction="row" justifyContent={"flex-end"}>
                <Grid item xs={6} sm={2}>
                  <Typography variant="h5" gutterBottom component="div">
                    Giảm giá
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body1" gutterBottom component="div">
                    <VNDFormat value={row.discount} />{" "}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container direction="row" justifyContent={"flex-end"}>
                <Grid item xs={6} sm={2}>
                  <Typography variant="h5" gutterBottom component="div">
                    Cần thu
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body1" gutterBottom component="div">
                    <VNDFormat value={row.total_amount - row.discount} />{" "}
                  </Typography>
                </Grid>
              </Grid>
              {/* <Grid container direction="row" justifyContent={ "flex-end"}>
                        <Grid item xs={6}sm={2} >
                            <Typography variant="h5" gutterBottom component="div">Số mặt hàng đã nhập đủ</Typography>    
                        </Grid>
                        <Grid item xs={2} >
                            <Typography variant="body1" gutterBottom component="div">2/4 </Typography>
                        </Grid>
                    </Grid> */}

              {/* 
                    <Grid container direction="row" justifyContent="flex-end">
                        <Grid item xs={2} >
                            <Typography variant="h5" gutterBottom component="div">Đã trả NCC</Typography>    
                        </Grid>
                        <Grid item xs={2} >
                            <Typography variant="body1" gutterBottom component="div">100</Typography>
                        </Grid>
                    </Grid> */}
            </Grid>
          </Box>

          <Grid
            container
            direction="row"
            justifyContent={"flex-end"}
            style={{ marginTop: 20 }}
          >
            {/* Chỉ có nhân viên thực hiện nhập đơn đó  mới có thể xoá sửa */}
            {currentUser === row.employee ? (
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
            ) : null}

            <Button disabled={row.status !== 'new'} variant="contained" size="small" style={{ marginLeft: 15 }} onClick={() => setIsOrderModalOpen(true)}>
              Xử lý đơn đặt
            </Button>
            
            <Button disabled={row.status !== 'confirmed'} variant="contained" size="small" style={{ marginLeft: 15 }} onClick={handlePayment}>
              Thanh toán
            </Button>

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
              <StyledMenuItem>
                <ListItemIcon style={{ marginRight: -15 }}>
                  <PrintTwoToneIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="In đơn đặt" />
              </StyledMenuItem>

              <StyledMenuItem>
                <ListItemIcon style={{ marginRight: -15 }}>
                  <GetAppTwoToneIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Xuất excel" />
              </StyledMenuItem>
            </StyledMenu>
          </Grid>

          {isOrderModalOpen && <OrderModal customerOrder={row} handleClose={() => {setIsOrderModalOpen(false); reload()}} isOpen={isOrderModalOpen}/>}

          <Dialog
            fullWidth={true}
            maxWidth="lg"
            open={open}
            onClose={handleCloseReturn}
            aria-labelledby="form-dialog-title"
          >
            <InventoryReturnPopUp
              handleCloseReturn={handleCloseReturn}
              row={row}
              classes={classes}
            />
          </Dialog>
        </Box>
      </Collapse>
    );
}

export default OrderProductListDetail

const headCells = [
  { id: 'stt', numeric: false, disablePadding: true, label: 'Stt' },
  { id: 'id', numeric: false, disablePadding: true, label: '#' },
  { id: 'name', numeric: false, disablePadding: true, label: 'Tên' },
  { id: 'price', numeric: true, disablePadding: true, label: 'Đơn giá' },
  { id: 'quantity', numeric: true, disablePadding: true, label: 'Số lượng' },
  { id: 'protein1', numeric: true, disablePadding: true, label: 'Thành tiền' },]
;
