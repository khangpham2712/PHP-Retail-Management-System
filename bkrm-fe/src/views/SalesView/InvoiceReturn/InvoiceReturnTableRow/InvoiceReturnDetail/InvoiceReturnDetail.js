import React , { useRef}from 'react';
import { useTheme, makeStyles, createStyles } from '@material-ui/core/styles';
import { useReactToPrint } from "react-to-print";
import {ReceiptPrinter} from "../../../../../components/ReceiptPrinter/ReceiptPrinter"
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {VNDFormat,ThousandFormat} from "../../../../../components/TextField/NumberFormatCustom"
import {calculateTotalQuantity} from "../../../../../components/TableCommon/util/sortUtil"

// import library
import {
  Box, Grid, TableHead, TableBody, Typography, Table, TableCell, TableRow, Collapse, Button, ListItemIcon, ListItemText, IconButton,Chip
} from '@material-ui/core';

// import icon
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PrintTwoToneIcon from '@material-ui/icons/PrintTwoTone';
import GetAppTwoToneIcon from '@material-ui/icons/GetAppTwoTone';

// import project
import { grey } from '@material-ui/core/colors';
import { StyledMenu, StyledMenuItem } from '../../../../../components/Button/MenuButton';
import { useSelector } from 'react-redux';
import refundApi from '../../../../../api/refundApi';
// dơn trả giá trả có khác ko ???

const useStyles = makeStyles((theme) => createStyles({
  root: {
    '& .MuiTextField-root': {
      marginTop: theme.spacing(2),
    },
  },
  headerTitle: {
    fontSize: '1.125rem',
  },
  typo: {
    marginBottom: 20,
  },
  background: {
    background: theme.customization.mode === 'Light' ? theme.customization.primaryColor[50] : grey[700],
  },

}));

function InvoiceReturnDetail(props) {
  const { row, openRow } = props.parentProps;
  const { isMini } = props;

  //  tam thoi
  const currentUser = 'Minh Tri';

  const theme = useTheme();
  const classes = useStyles(theme);

  const xsScreen = useMediaQuery(theme.breakpoints.down("xs")) ;


  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  
  const [refund, setRefund] = React.useState({
    branch: null,
    details: []
  })

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const res = await refundApi.getRefund(store_uuid, row.uuid);
        setRefund(res.data);
      } catch (error) {
        setRefund({
          branch: null,
          details: []
        });
      }
    }
    if (openRow === row.uuid) {
      loadData();

    }
  }
  , [props.parentProps.openRow]);


  //print

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
      content: () => componentRef.current,
  });

  console.log("refund",refund)

  return (
    <Collapse in={isMini?true:openRow === row.uuid} timeout="auto" unmountOnExit>
      <Box margin={1}>
        <Typography variant="h3" gutterBottom component="div" className={classes.typo}>
          {row.name}
        </Typography>

        <Grid container direction="row" justifyContent="flex-start">
          <Grid item xs={12} sm={5}>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={5} sm={5}>
                <Typography variant="h5" gutterBottom component="div">Mã đơn trả </Typography>
              </Grid>
              <Grid item  sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  {row.refund_code}
                  {' '}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={5}sm={5}>
                <Typography variant="h5" gutterBottom component="div">Mã hoá đơn</Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography variant="body1" gutterBottom component="div">{refund.order?.order_code}</Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={5} sm={5}>
                <Typography variant="h5" gutterBottom component="div">Ngày trả </Typography>
              </Grid>
              <Grid item  sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  {/* {row.created_at}
                  {' '} */}
                  {row.created_at?.split(" ")[0].split('-').reverse().join('/').concat("\u00a0\u00a0"+ row.created_at?.split(" ")[1].substr(0, 5)) }

                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={5}sm={5}>
                <Typography variant="h5" gutterBottom component="div">Khách hàng</Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  {refund.customer?.name}
                  {' '}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={5} sm={5}>
                <Typography variant="h5" gutterBottom component="div">Người thực hiện</Typography>
              </Grid>
              <Grid item  sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  {refund.created_by_user?.name}
                  {' '}
                </Typography>
              </Grid>
            </Grid>

          </Grid>
          <Grid item xs={12}sm={5}>
            {/* <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={5} sm={6}>
                <Typography variant="h5" gutterBottom component="div">Tình trạng</Typography>
              </Grid>
              <Grid item  sm={4}>
                <Typography variant="body1" gutterBottom component="div">{`Cần trả ${(row.total_amount - row.paid_amount).toString()}`}</Typography>
              </Grid>
            </Grid> */}
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={5} sm={6}>
                <Typography variant="h5" gutterBottom component="div">Tổng tiền trả</Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography variant="body1" gutterBottom component="div"><VNDFormat value={row.total_amount} /></Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={5} sm={6}>
                <Typography variant="h5" gutterBottom component="div">Chi nhánh thực hiện</Typography>
              </Grid>
              <Grid item  sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  {refund.branch?.name}
                  {' '}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={5} sm={6}>
                <Typography variant="h5" gutterBottom component="div">Phương thức thanh toán</Typography>
              </Grid>
              <Grid item  sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                {row.payment_method === "cash" ? "Tiền mặt" : "Thẻ"}{" "}
                  {' '}
                </Typography>
              </Grid>
            </Grid>

          </Grid>

        </Grid>

        <Typography variant="h4" gutterBottom component="div" style={{ marginTop: 30 }}>
          Danh sách sản phẩm
        </Typography>
        <Table size="small" aria-label="purchases">
          <TableHead>
            <TableRow>
              <TableCell>Ma SP</TableCell>
              <TableCell>Sản phẩm</TableCell>
              {/* <TableCell>Mã vạch</TableCell> */}
              <TableCell align="right">Số lượng</TableCell>
              <TableCell align="right">Giá trả</TableCell>
              <TableCell align="right">Thành tiền</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>

            {refund.details.map((detail) => (
              <TableRow key={detail.product_code}>
                <TableCell component="th" scope="row">
                  {detail.product_code}
                </TableCell>
                
                <TableCell>{detail.name}</TableCell>
                {/* <TableCell>
                  {detail.bar_code}
                </TableCell> */}
                <TableCell align="right">
                  <ThousandFormat value={detail.quantity} />
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
                              }) - ${batch.returned_quantity}`}
                              key={batch.id}
                              color={batch.is_new ? "primary" : "secondary"}
                              variant="outlined"
                            />
                          ))
                        : null}
                    </div>
                </TableCell>
                <TableCell align="right">
                <VNDFormat value={detail.unit_price} />
                </TableCell>
               
                <TableCell align="right" style={{ fontWeight: 700 }}>
                <VNDFormat value={detail.quantity * detail.unit_price} />
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box className={classes.background} style={{ padding: 10, borderRadius: theme.customization.borderRadius, marginTop: 10 }}>
          <Grid container direction="column">

            <Grid container direction="row" justifyContent={"flex-end"}>
              <Grid item xs={5} sm={2}>
                <Typography variant="h5" gutterBottom component="div">Tổng SL sản phẩm ({refund.details?.length})</Typography>
              </Grid>
              <Grid item xs={2}sm={2}>
                <Typography variant="body1" gutterBottom component="div"><ThousandFormat 
                  value={calculateTotalQuantity(refund.details)}
                /></Typography>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent={ "flex-end"}>
              <Grid item xs={5} sm={2}>
                <Typography variant="h5" gutterBottom component="div">Tổng tiền trả</Typography>
              </Grid>
              <Grid item xs={2}sm={2}>
                <Typography variant="body1" gutterBottom component="div"  style={{fontWeight:500, color:theme.customization.primaryColor[500]}}>
                <VNDFormat value={row.total_amount} />
                  {' '}
                </Typography>
              </Grid>
            </Grid>
            {/* <Grid container direction="row" justifyContent="flex-end">
              <Grid item xs={2}>
                <Typography variant="h5" gutterBottom component="div">Phí trả hàng</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1" gutterBottom component="div">200</Typography>
              </Grid>
            </Grid> */}

            {/* <Grid container direction="row" justifyContent="flex-end">
              <Grid item xs={2}>
                <Typography variant="h5" gutterBottom component="div">Tổng đơn trả</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1" gutterBottom component="div">100</Typography>
              </Grid>
            </Grid> */}

            {/* <Grid container direction="row" justifyContent={ "flex-end"}>
              <Grid item xs={5} sm={2}>
                <Typography variant="h5" gutterBottom component="div">Đã trả khách</Typography>
              </Grid>
              <Grid item xs={2}sm={2}>
                <Typography variant="body1" gutterBottom component="div">{row.paid_amount}</Typography>
              </Grid>
            </Grid> */}

          </Grid>
        </Box>

        <Grid container direction="row" justifyContent={"flex-end"}style={{ marginTop: 20 }}>
          {/* Chỉ có nhân viên thực hiện nhập đơn đó  mới có thể xoá sửa */}
          {/* {currentUser === row.employee
            ? (
              <>
                {' '}
                <Button variant="contained" size="small" style={{ marginLeft: 15 }}>Sửa</Button>
                <Button variant="contained" size="small" style={{ marginLeft: 15 }}>Xoá</Button>
                {' '}

              </>
            )
            : null} */}

          {/* <IconButton
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
            <StyledMenuItem onClick={()=> handlePrint()}>
              <ListItemIcon style={{ marginRight: -15 }}>
                <PrintTwoToneIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="In đơn trả" />
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

         {/* 3. Receipt */}
         <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <ReceiptPrinter cart={refund} date={row.created_at} />
        </div>
      </div>


    </Collapse>
  );
}

export default InvoiceReturnDetail;
