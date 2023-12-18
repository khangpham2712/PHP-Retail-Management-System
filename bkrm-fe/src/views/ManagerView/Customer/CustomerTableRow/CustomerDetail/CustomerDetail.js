import { Box, Button, Collapse, Grid, IconButton, InputAdornment, ListItem, ListItemIcon, ListItemText, TextField, Typography } from '@material-ui/core';
import React, {useState} from 'react'
import { StyledMenu, StyledMenuItem } from '../../../../../components/Button/MenuButton'
import VNDInput, { ThousandFormat, ThousandSeperatedInput, VNDFormat } from '../../../../../components/TextField/NumberFormatCustom';
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch, useSelector } from 'react-redux';

import ConfirmPopUp from "../../../../../components/ConfirmPopUp/ConfirmPopUp";
import HighlightOffTwoToneIcon from '@material-ui/icons/HighlightOffTwoTone';
import { Tag } from 'antd';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import UpdateCustomer from "../CustomerDetail/UpdateCustomer/UpdateCustomer"
import avaUpload from '../../../../../assets/img/ava/avaa.jpeg';
import customerApi from "../../../../../api/customerApi";
import moment from 'moment'
import { statusAction } from "../../../../../store/slice/statusSlice";
import useMediaQuery from "@material-ui/core/useMediaQuery";

//import library



//import icon




//import image
// import avaUpload from '../../../../../assets/img/product/lyimg.jpeg';


//import project 






// import CustomerDebtDetail from "./CustomerDebtDetail"
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      '& .MuiTextField-root': {
        marginTop: theme.spacing(2),
      },
    },
    headerTitle: {
      fontSize: '1.125rem'
    },
    typo: {
      marginBottom: 20
    }

  }));

const UploadImage = () => {
  return (
    <Box
      component="img"
      sx={{
        height: 120,
        width: 120,
        borderRadius: 120,
        marginLeft: 15,

      }}
      src={avaUpload}
    />

  )
}
const CustomerDetail = (props) => {

  const { row, openRow } = props.parentProps;

  const { isMini } = props;

  const theme = useTheme();
  const classes = useStyles(theme);
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [openPayDebt, setOpenPayDebt] = React.useState(false);
  const [editItem, setEditItem] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const dispatch = useDispatch();

  const info = useSelector(state => state.info)
  const store_uuid = info.store.uuid

  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleDeleteCustomer = async () => {
    setDeleteConfirm(false)
    try {
      const response = await customerApi.deleteCustomer(store_uuid, row.uuid);
      dispatch(statusAction.successfulStatus("Xóa thành công"));
      props.parentProps.onReload();
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
        const res = await customerApi.payDebt(store_uuid, row.uuid, {
          paid_amount: paidAmount,
          created_user_type: info.role,
          created_user_name: info.user.name,
          created_user_id: info.user.id,
          date: moment(new Date()).format("YYYY-MM-DD")
        });
        dispatch(statusAction.successfulStatus("Thanh toán nợ thành công"));
        setPaidAmount(0)
        props.parentProps.onReload();
      }
    } catch(err) {
      dispatch(statusAction.failedStatus("Thanh toán nợ thất bại"));
    }
  }

// const [openDetaiDebt,setOpenDetaiDebt] = useState(false)
  return (
    <Collapse in={isMini ? true : openRow === row.uuid} timeout="auto" unmountOnExit>
      <ConfirmPopUp
        open={deleteConfirm}
        handleClose={() => {
          setDeleteConfirm(false);
        }}
        handleConfirm={handleDeleteCustomer}
        message={
          <Typography>
            Xóa vĩnh viễn khách hàng <b>{row.name} ?</b>
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
          <Typography variant="h3" style={{marginBottom:15}}>Thu nợ <b style={{color:theme.customization.primaryColor[500]}}>{row.name}</b></Typography>
          {/* <VNDInput
          size="small"
          value={paidAmount}
          onChange={(e) => {
            const amount = Number(e.target.value);
            if (amount < 0 || amount > row.debt) return;
            setPaidAmount(e.target.value);
          }}
          endAdornment={
            <InputAdornment position="end">
              {" "}
              / <VNDFormat value={row.debt} />
            </InputAdornment>
          }
        /> */}
        <ListItem>
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
      {editItem &&<UpdateCustomer customerDetail={row} open={editItem} onReload={props.parentProps.onReload} handleClose={() => { setEditItem(false) }} />}
      <Box margin={1}>
        <Typography variant="h3" gutterBottom component="div" className={classes.typo}>
          {row.name}
        </Typography>

        <Grid container direction="row" justifyContent="flex-start">
          <Grid item xs={12} sm={3}>
            <UploadImage />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Grid container direction="row" justifyContent="flex-start" >
              <Grid item xs={7} sm={5} >
                <Typography variant="h5" gutterBottom component="div">Mã khách hàng </Typography>
              </Grid>
              <Grid item sm={6} >
                <Typography variant="body1" gutterBottom component="div">{row.customer_code} </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5} >
                <Typography variant="h5" gutterBottom component="div">Tên khách hàng </Typography>
              </Grid>
              <Grid item sm={6} >
                <Typography variant="body1" gutterBottom component="div">{row.name} </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5} >
                <Typography variant="h5" gutterBottom component="div">Số điện thoại</Typography>
              </Grid>
              <Grid item sm={6} >
                <Typography variant="body1" gutterBottom component="div">{row.phone}</Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5} >
                <Typography variant="h5" gutterBottom component="div">Thông tin thanh toán</Typography>
              </Grid>
              <Grid item sm={6} >
                <Typography variant="body1" gutterBottom component="div">{row.payment_info}</Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5} >
                <Typography variant="h5" gutterBottom component="div">Địa chỉ</Typography>
              </Grid>
              <Grid item sm={6} >
                <Typography variant="body1" gutterBottom component="div">{row.address} </Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={5} >
                <Typography variant="h5" gutterBottom component="div">Email</Typography>
              </Grid>
              <Grid item sm={6} >
                <Typography variant="body1" gutterBottom component="div">{row.email} </Typography>
              </Grid>
            </Grid>
          </Grid>


          <Grid item xs={12} sm={4}>
          <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={6} >
                <Typography variant="h5" gutterBottom component="div">Trạng thái</Typography>
              </Grid>
              <Grid item sm={6} >
                <Typography variant="body1" gutterBottom component="div">{row.status === "active" ? "Kích hoạt" : "Ngưng hoạt động"}</Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={6} >
                <Typography variant="h5" gutterBottom component="div">Tích điểm</Typography>
              </Grid>
              <Grid item sm={6} >
                <Typography variant="body1" gutterBottom component="div"><ThousandFormat value={row.points} /></Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={6} >
                <Typography variant="h5" gutterBottom component="div">Tổng tiền mua</Typography>
              </Grid>
              <Grid item sm={6} >
                <Typography variant="body1" gutterBottom component="div"><VNDFormat  value={row.total_payment} /></Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={6} >
                <Typography variant="h5" gutterBottom component="div">Còn nợ</Typography>
              </Grid>
              <Grid item sm={6} >
                <Typography variant="body1" gutterBottom component="div"><VNDFormat  value={row.debt} /> </Typography>
              </Grid>
              {/* {row.debt > 0?
              <Grid item sm={3} >
                  <Button size='small' variant='contained'color='primary' style={{textTransform:'none'}} onClick={()=>setOpenDetaiDebt(true)}> Chi tiết</Button>            
                </Grid>:null}
                {openDetaiDebt?
                <CustomerDebtDetail  
                open={openDetaiDebt} 
                 onClose={()=>setOpenDetaiDebt(false)}
                 setReload={() => {
                  // setReload();
                  // setThisReload(!thisReload);
                  
                 }}
                 />:null} */}
              </Grid>

              <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={6} >
                <Typography variant="h5" gutterBottom component="div">Nhóm</Typography>
              </Grid>
              <Grid item sm={6} >
                {row.groups?.map(g => <Tag color="magenta" >{g}</Tag>)}
              </Grid>

            </Grid>
            </Grid>
              
            

        </Grid>

        {/* Button */}
        <Grid container direction="row" justifyContent={"flex-end"} style={{ marginTop: 20 }}>
          <Button variant="contained" size="small" style={{ marginLeft: 15 }} onClick={() => { setEditItem(true) }}>Sửa</Button>
          <Button variant="contained" size="small" style={{ marginLeft: 15 }} onClick={() => { setDeleteConfirm(true) }}>Xoá</Button>
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
                  const response = await customerApi.updateCustomer(store_uuid, row.uuid ,{...row, status:'active'} )
                  dispatch(statusAction.successfulStatus("Kích hoạt thành công"))
                } catch (err) {
                  console.log(err)
                  dispatch(statusAction.failedStatus("Kích hoạt thất bại"))
                }
              } else if (row.status === "active") {
                try {
                  const response = await customerApi.updateCustomer(store_uuid, row.uuid,{...row, status:'inactive'})
                  dispatch(statusAction.successfulStatus("Ngưng hoạt động thành công"))
                } catch (err) {
                  dispatch(statusAction.failedStatus("Ngưng hoạt động thất bại"))
                }
              }
              
              props.parentProps.onReload();
  
            }}
            
            >
              <ListItemIcon style={{ marginRight: -15 }} >
                <HighlightOffTwoToneIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={row.status === "inactive" ? "Kích hoạt" : "Ngưng hoạt động"} />
            </StyledMenuItem>

          </StyledMenu>


        </Grid>

      </Box>
    </Collapse>
  )

}

export default CustomerDetail
