import React, {useState,useEffect} from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import {Grid,Card,Box,Typography,TextField,InputAdornment,DialogActions,DialogContent,IconButton,Button,Dialog,FormControlLabel,
  Checkbox,FormControl,FormLabel,RadioGroup,Radio,ListItem,Divider,Popper} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import AddSupplier from "../../../../views/InventoryView/Supplier/AddSupplier/AddSupplier";
import VNDInput from "../../../TextField/NumberFormatCustom";
import {
  VNDFormat,
  ThousandFormat,
} from "../../../TextField/NumberFormatCustom";
import SearchSupplier from "../../../SearchBar/SearchSupplier";

//import project
import * as Input from "../../../TextField/NumberFormatCustom";
import { grey } from "@material-ui/core/colors";

import SupplierData from "../../../../assets/JsonData/supplier.json";
import supplierApi from "../../../../api/supplierApi";
import { CardTravelTwoTone } from "@material-ui/icons";
import BranchSelect from "../../BranchSelect/BranchSelect";
import moment from "moment";
// update state
import update from "immutability-helper";
import { useDispatch } from "react-redux";
import { statusAction } from "../../../../store/slice/statusSlice";
import DiscountInputDetail from "../../../TextField/DiscountInputDetail";

const useStyles = makeStyles((theme) =>
  createStyles({
    marginBox: {
      marginTop: 30,
    },
    marginRow: {
      marginTop: 5,
    },
    hidden: {
      display: "none",
    },
    headerTitle: {
      fontSize: "1.125rem",
    },
  })
);
const ImportSummary = (props) => {
  const {
    cartData,
    handleSelectSupplier,
    currentSupplier,
    handleUpdateDiscount,
    handleUpdatePaidAmount,
    handleUpdatePaymentMethod,
    handleConfirm,
    currentBranch,
    suppliers,
    mode,
    reloadSuppliers,
    handleUpdateDiscountDetail,
    setIsOrder,
    isOrder,
  } = props;

  const theme = useTheme();
  const classes = useStyles(theme);
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const dispatch = useDispatch();

  const handleChangePayment = (event) => {
    handleUpdatePaymentMethod(event.target.value);
  };

  //mode 2: popup
  const [openPopUp, setOpenPopUp] = React.useState(false);
  const handleClickOpenPopUp = () => {
    setOpenPopUp(true);
  };

  const handleClosePopUp = () => {
    setOpenPopUp(false);
  };

  function calculateTotalQuantity ( cartList ) {
    var value= 0
    cartList.map(item => value +=item.quantity )
    return value
  }
  const [addSupplier, setAddSupplier] =  React.useState({name:'', phone:''})
  React.useEffect(()=>{
    if(addSupplier?.name?.length !==  0){props.handleSelectSupplier(addSupplier); setAddSupplier({name:'', phone:''})}
  })

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openDiscountDetail = Boolean(anchorEl);

  const handleClick = (event) => {
      setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const returnMoney = cartData.total_amount - cartData.discount - cartData.paid_amount
  return (
    <Box style={{ padding: 30, minHeight: "80vh" }}>
      <Grid container direction="column" alignItems="flex-start" spacing={3}>
        <Grid container direction="row" justifyContent="space-between">
          {/* 1. BASIC INFO */}
          <Grid
            item
            xs={8}
            container
            direction="column"
            alignItems="flex-start"
          >
            <Typography variant="h5">Chi nhánh</Typography>
            <Typography variant="body2">{currentBranch.name}</Typography>
            {/* <BranchSelect 
                            setSelectedBranch={setSelectedBranch}
                            selectedBranch={selectedBranch}
                        /> */}
          </Grid>

          <Grid item xs={4} container direction="column" alignItems="flex-end">
            <Typography variant="body2">
              {new Date().toLocaleDateString("es-US")}
            </Typography>
            <Typography variant="body2">
              {new Date().toLocaleTimeString()}
            </Typography>
          </Grid>
        </Grid>

        <div style={{ width: "100%" }}>
          <SearchSupplier
            suppliers={suppliers}
            handleClickOpen={handleClickOpen}
            selectedSupplier={currentSupplier
              // currentSupplier ? currentSupplier : { name: "", phone: "" }
            }
            handleSearchBarSelect={handleSelectSupplier}
            setAddSupplier={setAddSupplier}
          />
        </div>

       {open&& <AddSupplier
          open={open}
          // handleClose={handleClose}
          handleClose={()=>{setOpen(false)}}
          onReload={props.reloadSuppliers}
          setAddSupplier={setAddSupplier}
          isImport={true}
     
        />}

        {/* when change mode to menu product */}
        {props.children}

        {/* 2. PAYMENT INFO  */}
        {/* {!mode ? ( */}
          {/* {true ? (
          <> */}
            {/* 2.1 Mode 1 */}
           {!mode? <Grid
              container
              direction="row"
              justifyContent="space-between"
              className={classes.marginBox}
            >
              <Typography variant="h5">Tổng SL sản phẩm ({cartData.cartItem.length}) </Typography>
              <Typography variant="body2">
                <ThousandFormat
                  // value={cartData.cartItem.length}
                  value={calculateTotalQuantity(cartData.cartItem)}
                ></ThousandFormat>
              </Typography>
            </Grid>:null}

            <Grid
              container
              direction="row"
              justifyContent="space-between"
              className={classes.marginRow}
            >
              <Typography variant="h5">{Number(cartData.discount)===0 && mode ?`Tổng tiền (${calculateTotalQuantity(cartData.cartItem)})`:`Tổng tiền hàng`}</Typography>
              <Typography variant="body2" style={Number(cartData.discount)===0 && mode?{color: "#2096f3", fontWeight: 600,fontSize:18 }:{}}>
                <VNDFormat value={cartData.total_amount} />
              </Typography>
            </Grid>

        {/* {Number(cartList[selectedIndex].discount)==0 && mode? */}
         {(Number(cartData.discount)!==0  && mode)|| !mode?
         <>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              className={classes.marginRow}
            >
              <Typography variant="h5">Giảm giá</Typography>
              <Popper  placement="left-start" open={openDiscountDetail} anchorEl={anchorEl} onClose={()=>setAnchorEl(null)}   style={{zIndex:1000000}} >   
                    <DiscountInputDetail handleUpdateDiscountDetail={handleUpdateDiscountDetail} cartData={cartData} setAnchorEl={setAnchorEl} />
                </Popper>
              
              <Box  onClick={handleClick} style={{ width: 90 ,color:'#616161',textAlign: "right"}}>
                <VNDFormat value={cartData.discount}/>
                <Divider style={{ background: anchorEl?theme.customization.primaryColor[500]:'#616161' }} />
              </Box>
              {/* <VNDInput
                id="standard-basic"
                style={{ width: 90 }}
                value={cartData.discount}
                size="small"
                inputProps={{ style: { textAlign: "right" } }}
                onChange={(e) => handleUpdateDiscount(e.target.value)}
              /> */}
            </Grid>
        
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              className={classes.marginRow}
            >
              <Typography variant="h5">Tổng tiền</Typography>
              <Typography variant="body2">
                <VNDFormat
                  style={{ color: "#2096f3", fontWeight: 500 }}
                  value={cartData.total_amount - cartData.discount}
                />
              </Typography>
            </Grid>
            </>:null}
      
            {cartData.total_amount - cartData.discount  !== 0?
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              className={classes.marginRow}
            >
              <Typography variant="h5">Trả NCC</Typography>
              <VNDInput
                id="standard-basic"
                style={{ width: 90 }}
                // defaultPrice={cartData.total_amount - cartData.discount}
                // defaultPrice={(cartData.total_amount - cartData.discount).toString()}
                value={cartData.paid_amount}
                size="small"
                inputProps={{ style: { textAlign: "right" } }}
                onChange={(e) => handleUpdatePaidAmount(e.target.value)}
              />
            </Grid> :null}
{/* 
            { cartData.total_amount -
                  cartData.discount -
                  cartData.paid_amount > 0? */}
               {cartData.total_amount - cartData.discount  !== 0?
                   <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              className={classes.marginRow}
              style={returnMoney > 0  ? {color:'red', fontWeight:500}:{}}
            >
              <Typography variant="h5">{returnMoney > 0 ? "Còn nợ" :"Tiền thu lại"}</Typography>
              {/* <VNDInput
                    id="standard-basic" style={{ width: 90 }}
                    size="small" inputProps={{ style: { textAlign: "right" } }}
                    value={cartData.total_amount - cartData.discount - cartData.paid_amount}
                /> */}
              <VNDFormat
                // id="standard-basic" style={{ width: 90 }}
                // size="small" inputProps={{ style: { textAlign: "right" } }}
                value={
                  cartData.paid_amount-
                  (
                  cartData.total_amount -
                  cartData.discount )
              
                }
                style={returnMoney > 0  ? {color:'red', fontWeight:500}:{}}
              />
            </Grid>:null}
            {/* :null} */}
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              // className={classes.marginRow}
              style={{marginTop:mode?-10:null}}

            >
             {mode && Number(cartData.discount) === 0? <Button size="small"color='primary'style={{textTransform:'none', }} onClick={handleClickOpenPopUp}>Nhập giảm giá</Button>:null}
            {openPopUp ? <Dialog open={openPopUp}  onClose={handleClosePopUp} > <CheckoutPopUp  cartData={cartData}  onClose={handleClosePopUp} handleUpdateDiscountDetail={handleUpdateDiscountDetail}/> </Dialog>:null}
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="gender"
                  name="gender1"
                  value={cartData.payment_method}
                  onChange={handleChangePayment}
                >
                  <Grid container direction="row">
                    <FormControlLabel
                      labelPlacement="start"
                      value="card"
                      control={<Radio  size="small"/>}
                      label="Thẻ"
                    />
                    <FormControlLabel
                      labelPlacement="start"
                      value="cash"
                      control={<Radio size="small"/>}
                      label="Tiền mặt"
                    />
                  </Grid>
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid container direction="row" justifyContent="flex-end" alignItems="center" style={{ marginTop: mode ? -10 : null }}>
              <FormControlLabel
                value={isOrder}
                control={<Checkbox />}
                label="Đặt hàng"
                labelPlacement="start"
                onChange={(e) => setIsOrder(e.target.value)}
              />
            </Grid>
          
            <Button
              variant="contained"
              fullWidth
              color="primary"
              style={{ marginTop: mode?0:80 }}
              onClick={()=>handleConfirm(1)}
            >
              Nhập hàng
            </Button>
{/*            
            <Button
              variant="contained"
              fullWidth
              color="secondary"
              style={{ marginTop: 10 }}
              onClick={()=>handleConfirm(0)}
            >
              Đặt hàng NCC
            </Button> */}
{/*            
          </>
        ) : ( */}
          {/* /* 2.2 Mode 2 */ }
          {/* <>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              className={classes.marginRow}
            >
              <Typography variant="h5">Tổng tiền hàng</Typography>
              <Typography variant="body2">500.000</Typography>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              className={classes.marginRow}
            >
              <Typography variant="h5">Giảm giá</Typography>
              <Input.ThousandSeperatedInput
                id="standard-basic"
                style={{ width: 90 }}
                size="small"
                inputProps={{ style: { textAlign: "right" } }}
              />
            </Grid>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              style={{ marginTop: 20 }}
              onClick={handleClickOpenPopUp}
            >
              <Grid container direction="row" justifyContent="space-between">
                <Grid item>Thanh toán </Grid>
                <Grid item>500.000 </Grid>
              </Grid>
            </Button>
            <Dialog
              open={openPopUp}
              onClose={handleClosePopUp}
              aria-labelledby="form-dialog-title"
            >
              <CheckoutPopUp />
            </Dialog>
          </>
        )} */}
      </Grid>
    </Box>
  );
};

export default ImportSummary;
const CheckoutPopUp = (props) => {
  const { onClose, handleUpdateDiscountDetail, cartData } = props;
  const theme = useTheme();
  const classes = useStyles(theme);
  const [discount, setDiscount] = useState(cartData.discount)
  return (
    <>
      <Box style={{ marginTop: 20, marginLeft: 15, marginBottom: 10 }}>
        <Typography className={classes.headerTitle} variant="h5">
          Trả tiền NCC
        </Typography>
      </Box>
      <DialogContent>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          className={classes.marginRow}
        >
          <Typography variant="h5" style={{ paddingRight: 50 }}>
            Tổng tiền hàng
          </Typography>
          <Typography variant="body2">
            {cartData.total_amount?.toLocaleString()}
          </Typography>
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className={classes.marginRow}
        >
          <Typography variant="h5">Giảm giá</Typography>
          <Input.ThousandSeperatedInput
            id="standard-basic"
            style={{ width: 90 }}
            size="small"
            inputProps={{ style: { textAlign: "right" } }}
            value={discount}
            onChange={(e) => {
              if (e.target.value <= cartData.total_amount) {
                setDiscount(e.target.value);
              }
            }}
          />
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          className={classes.marginRow}
        >
          <Typography variant="h5">Tổng tiền</Typography>
          <Typography variant="body2">
            <VNDFormat
              style={{ color: "#2096f3", fontWeight: 500 }}
              value={cartData.total_amount - discount}
            />
          </Typography>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          // onClick={onClose}
          fullWidth
          color="primary"
          style={{ marginTop: 40 }}
          onClick={() => {
            handleUpdateDiscountDetail({ type: "VND", value: discount });
            onClose();
          }}
        >
          OK
        </Button>
      </DialogActions>
    </>
  );
};


// const CheckoutPopUp = (props) => {
//   const { onClose, handleChangePayment, payment } = props;
//   const theme = useTheme();
//   const classes = useStyles(theme);
//   return (
//     <>
//       <Box style={{ marginTop: 20, marginLeft: 15, marginBottom: 10 }}>
//         <Typography className={classes.headerTitle} variant="h5">
//           Trả tiền NCC
//         </Typography>
//       </Box>
//       <DialogContent>
//         <Grid
//           container
//           direction="row"
//           justifyContent="space-between"
//           className={classes.marginRow}
//         >
//           <Typography variant="h5">Tổng tiền hàng</Typography>
//           <Typography variant="body2">500.000</Typography>
//         </Grid>
//         <Grid
//           container
//           direction="row"
//           justifyContent="space-between"
//           alignItems="center"
//           className={classes.marginRow}
//         >
//           <Typography variant="h5" style={{ paddingRight: 50 }}>
//             Đã trả CNN
//           </Typography>
//           <Input.ThousandSeperatedInput
//             id="standard-basic"
//             style={{ width: 90 }}
//             size="small"
//             inputProps={{ style: { textAlign: "right" } }}
//           />
//         </Grid>
//         <Grid
//           container
//           direction="row"
//           justifyContent="space-between"
//           alignItems="center"
//           className={classes.marginRow}
//         >
//           <Typography variant="h5">Công nợ</Typography>
//           <Input.ThousandSeperatedInput
//             id="standard-basic"
//             style={{ width: 90 }}
//             size="small"
//             inputProps={{ style: { textAlign: "right" } }}
//           />
//         </Grid>
//         <Grid
//           container
//           direction="row"
//           justifyContent="flex-end"
//           alignItems="center"
//           className={classes.marginRow}
//         >
//           <FormControl component="fieldset">
//             <RadioGroup
//               aria-label="gender"
//               name="gender1"
//               value={payment}
//               onChange={handleChangePayment}
//             >
//               <Grid container direction="row">
//                 <FormControlLabel
//                   labelPlacement="start"
//                   value="card"
//                   control={<Radio />}
//                   label="Thẻ"
//                 />
//                 <FormControlLabel
//                   labelPlacement="start"
//                   value="cash"
//                   control={<Radio />}
//                   label="Tiền mặt"
//                 />
//               </Grid>
//             </RadioGroup>
//           </FormControl>
//         </Grid>
//       </DialogContent>
//       <DialogActions>
//         <Button
//           variant="contained"
//           onClick={onClose}
//           fullWidth
//           color="primary"
//           style={{ marginTop: 40 }}
//         >
//           Thanh toán
//         </Button>
//       </DialogActions>
//     </>
//   );
// };
