import React, {useState} from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

//import library
import {
  Box,
  Grid,
  Collapse,
  Typography,
  Button,
  ListItemIcon,
  ListItemText,
  ListItem,
  IconButton,
} from "@material-ui/core";

//import icon
import MoreVertIcon from "@material-ui/icons/MoreVert";
import HighlightOffTwoToneIcon from "@material-ui/icons/HighlightOffTwoTone";

//import project
import {
  StyledMenu,
  StyledMenuItem,
} from "../../../../../components/Button/MenuButton";
import supplierApi from "../../../../../api/supplierApi";
import ConfirmPopUp from "../../../../../components/ConfirmPopUp/ConfirmPopUp";
import { useDispatch, useSelector } from "react-redux";
import { statusAction } from "../../../../../store/slice/statusSlice";
import UpdateSupplier from "./UpdateSupplier/UpdateSupplier";
import { VNDFormat, ThousandFormat, ThousandSeperatedInput } from '../../../../../components/TextField/NumberFormatCustom';


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
  })
);

const SupplierDetail = (props) => {
  const { row, openRow } = props.parentProps;
  const { isMini } = props;

  const theme = useTheme();
  const classes = useStyles(theme);
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs")) ;


  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [openPayDebt, setOpenPayDebt] = React.useState(false);
  const [editSupplier,setEditSupplier] = React.useState(false);
  const dispatch = useDispatch();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDeleteSupplier = async () => {
    setDeleteConfirm(false)
    try {
      const response = await supplierApi.deleteSupplier(store_uuid, row.uuid);
      dispatch(statusAction.successfulStatus("Xóa thành công"));
      props.parentProps.setReload();
    } catch (error) {
      console.log(error);
      dispatch(statusAction.failedStatus("Xóa thất bại"));
    }
  };

  const [paidAmount, setPaidAmount] = useState(0)
  const payDebt = async () => {
    try {
      if (store_uuid) {
        setOpenPayDebt(false);
        const res = await supplierApi.payDebt(store_uuid, row.uuid, {
          paid_amount: paidAmount,
          created_user_type: info.role,
          created_user_name: info.user.name,
          created_user_id: info.user.id,
        });
        dispatch(statusAction.successfulStatus("Thanh toán nợ thành công"));
        setPaidAmount(0)
        props.parentProps.setReload();
      }
    } catch(err) {
      console.log(err)
      dispatch(statusAction.failedStatus("Thanh toán nợ thất bại"));
    }
  }
  return (
    <Collapse in={isMini?true:openRow === row.uuid} timeout="auto" unmountOnExit>
      <ConfirmPopUp
        open={deleteConfirm}
        handleClose={() => {
          setDeleteConfirm(false);
        }}
        handleConfirm={handleDeleteSupplier}
        message={
          <Typography>
            Xóa vĩnh viễn nhà cung cấp <b>{row.name} ?</b>
          </Typography>
        }
      />
      {openPayDebt && <ConfirmPopUp
        open={openPayDebt}
        handleClose={() => {
          setOpenPayDebt(false);
        }}
        handleConfirm={payDebt}
        message={
          <>
          <Typography variant="h3" style={{marginBottom:15}}>Trả nợ <b style={{color:theme.customization.primaryColor[500]}}>{row.name}</b></Typography>
        <ListItem >
            <ThousandSeperatedInput  
            style={{marginRight:10}}
            value={paidAmount}
            onChange={(e) => {
              const amount = Number(e.target.value);
              if (amount < 0 || amount > row.debt) return;
              setPaidAmount(e.target.value);
            }}
            />
              / <VNDFormat value={row.debt} style={{color:'#000', fontWeight:500}} />
         </ListItem>
          </>
        }
      />}
      {editSupplier &&<UpdateSupplier supplierDetail={row} open={editSupplier} handleClose = {() => setEditSupplier(false)} onReload= {props.parentProps.setReload}/>}
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
          <Grid item xs={12} sm={6}>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item  xs={7} sm={6}>
                <Typography variant="h5" gutterBottom component="div">
                  Mã nhà cung cấp{" "}
                </Typography>
              </Grid>
              <Grid item  sm={3}>
                <Typography variant="body1" gutterBottom component="div">
                  {row.supplier_code}{" "}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={6}>
                <Typography variant="h5" gutterBottom component="div">
                  Tên nhà cung cấp{" "}
                </Typography>
              </Grid>
              <Grid item  sm={3}>
                <Typography variant="body1" gutterBottom component="div">
                  {row.name}{" "}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={6}>
                <Typography variant="h5" gutterBottom component="div">
                  Số điện thoại
                </Typography>
              </Grid>
              <Grid item sm={3}>
                <Typography variant="body1" gutterBottom component="div">
                  {row.phone}{" "}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={6}>
                <Typography variant="h5" gutterBottom component="div">
                  Địa chỉ
                </Typography>
              </Grid>
              <Grid item  sm={3}>
                <Typography variant="body1" gutterBottom component="div">
                  {row.address}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={6}>
                <Typography variant="h5" gutterBottom component="div">
                  Email
                </Typography>
              </Grid>
              <Grid item  sm={3}>
                <Typography variant="body1" gutterBottom component="div">
                  {row.email}{" "}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={6}>
              
          <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5}>
                <Typography variant="h5" gutterBottom component="div">
                  Trạng thái
                </Typography>
              </Grid>
              <Grid item  sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  {row.status === "active" ? "Kích hoạt" : "Ngưng hoạt động"}
                </Typography>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5}>
                <Typography variant="h5" gutterBottom component="div">
                  Tổng tiền đã nhập
                </Typography>
              </Grid>
              <Grid item  sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  <VNDFormat  value={row.total_payment} />
                </Typography>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5}>
                <Typography variant="h5" gutterBottom component="div">
                  Còn nợ
                </Typography>
              </Grid>
              <Grid item  sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                <VNDFormat  value={row.debt} /> 
                </Typography>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5}>
                <Typography variant="h5" gutterBottom component="div">
                  Thông tin thanh toán
                </Typography>
              </Grid>
              <Grid item  sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  {row.payment_info}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5}>
                <Typography variant="h5" gutterBottom component="div">
                  Công ty
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography variant="body1" gutterBottom component="div">
                  {row.company}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* Button */}
        <Grid
          container
          direction="row"
          justifyContent={"flex-end"}
          style={{ marginTop: 20 }}
        >
          <Button variant="contained" size="small" style={{ marginLeft: 15 }} onClick = {() => setEditSupplier(true)}>
            Sửa
          </Button>
          <Button
            variant="contained"
            size="small"
            style={{ marginLeft: 15 }}
            onClick={() => {
              setDeleteConfirm(true);
            }}
          >
            Xoá
          </Button>
          {row.debt > 0 ? <Button variant="contained" size="small" color="primary" style={{ marginLeft: 15 }} onClick={() => { setOpenPayDebt(true) }}>Thu nợ</Button> : null}
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
            <StyledMenuItem
             onClick={async () => {
              handleClose()
              if (row.status === "inactive") {
                try {     
                  const response = await supplierApi.updateSupplier(store_uuid, row.uuid ,{...row, status:'active'} )
                  dispatch(statusAction.successfulStatus("Kích hoạt thành công"))
                } catch (err) {
                  console.log(err)
                  dispatch(statusAction.failedStatus("Kích hoạt thất bại"))
                }
              } else if (row.status === "active") {
                try {
                  const response = await supplierApi.updateSupplier(store_uuid, row.uuid,{...row, status:'inactive'})
                  dispatch(statusAction.successfulStatus("Ngưng hoạt động thành công"))
                } catch (err) {
                  dispatch(statusAction.failedStatus("Ngưng hoạt động thất bại"))
                }
              }
              props.parentProps.setReload();
            }}
            >
              <ListItemIcon style={{ marginRight: -15 }}>
                <HighlightOffTwoToneIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={row.status === "inactive" ? "Kích hoạt" : "Ngưng hoạt động"} />
            </StyledMenuItem>
          </StyledMenu>
        </Grid>
      </Box>
    </Collapse>
  );
};

export default SupplierDetail;
