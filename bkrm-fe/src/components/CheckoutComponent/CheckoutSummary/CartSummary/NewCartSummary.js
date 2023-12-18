import React from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import {
  Grid,
  Box,
  Typography,
  DialogActions,
  DialogContent,
  Button,
  Dialog,
  FormControlLabel,
  Checkbox,
  FormControl,
  RadioGroup,
  Radio,
  ListItem,
  Paper,
  ButtonBase,
  Avatar,
  Popover,
  Divider,
} from "@material-ui/core";
import { calculateTotalQuantity } from "../../../../components/TableCommon/util/sortUtil";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { useSelector } from "react-redux";

import AddCustomer from "../../../../views/ManagerView/Customer/AddCustomer/AddCustomer";
import giftBox from "../../../../assets/img/icon/giftbox.png";
// import giftBox from "../../../../assets/img/icon/gift.png";
// import giftBox from "../../../../assets/img/icon/gift2.png";

import SearchCustomer from "../../../SearchBar/SearchCustomer";

//import project
import * as Input from "../../../TextField/NumberFormatCustom";

// import VNDInput from '../../../TextField/NumberFormatCustom';
// import { VNDFormat,ThousandFormat } from '../../../TextField/NumberFormatCustom';
import setting from "../../../../assets/constant/setting";

import VNDInput from "../../../TextField/NumberFormatCustom";
import {
  VNDFormat,
  ThousandFormat,
} from "../../../TextField/NumberFormatCustom";
import { useDispatch } from "react-redux";
import { statusAction } from "../../../../store/slice/statusSlice";
import DiscountPopUp from "../../../../views/SalesView/Cart/DiscountPopup/DiscountPopup";
import DiscountInputDetail from "../../../TextField/DiscountInputDetail";
import openNotification from "../../../../components/StatusPopup/StatusPopup";

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
    popup: {
      borderColor: theme.customization.primaryColor[500],
      padding: 5,
      paddingLeft: 12,
      boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.5)",
    },
  })
);
const CartSummary = (props) => {
  const {
    cartData,
    handleSelectCustomer,
    currentCustomer,
    handleUpdateDiscount,
    handleUsingScore,
    handleUpdatePaidAmount,
    handleUpdatePaymentMethod,
    handleCheckDelivery,
    handleSearchCustomer,
    handleConfirm,
    selectedBranch,
    setSelectedBranch,
    customers,
    currentBranch,
    mode,
    reloadCustomers,
    discountData,
    isScore,
    handleUpdateDiscountDetail,
    handleUpdateSelectedPromotion,
    handleUpdateBestDetailSelectedPromotion,
    products,
  } = props;

  const theme = useTheme();
  const classes = useStyles(theme);
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const dispatch = useDispatch();

  //mode 2: popup
  const [openPopUp, setOpenPopUp] = React.useState(false);
  const handleClickOpenPopUp = () => {
    setOpenPopUp(true);
  };

  const handleClosePopUp = () => {
    setOpenPopUp(false);
  };

  // giao hang
  const [deliver, setDeliver] = React.useState(false);

  const handleChangeDeliver = (event) => {
    setDeliver(event.target.checked);
  };

  // so tien khach đưa
  const [customerMoney, setCustomerMoney] = React.useState("0");

  // const handlePromotion = () =>{
  //   if(discountData.length !==0 ){
  //     let arr = []
  //      discountData?.map(( pro) => {
  //       const sortedRow = JSON.parse(pro.promotion_condition).sort((a, b) => {return b.totalCost - a.totalCost})
  //       console.log("sortedRow",sortedRow)
  //       for ( let i = 0; i <sortedRow.length ; i++){
  //         if(Number(cartData.total_amount) >= Number(sortedRow[i].totalCost)){
  //            arr.push({...sortedRow[i], name:pro.name , discountKey:pro.discountKey,discountType:pro.discountType, id:pro.id})
  //            return
  //         }
  //       }
  //     })
  //     return arr
  //   }
  //   return []
  // }
  // let filteredPromotion = handlePromotion()

  const handlePromotion = () => {
    console.log("discountData.length ", discountData.length);
    if (discountData.length === 0) {
      return [];
    }

    var arr = [];
    discountData?.map((pro) => {
      // // thap den cao
      // const sortedRow = JSON.parse(pro.promotion_condition).sort((a, b) => {return a.totalCost - b.totalCost})
      // thap den cao
      const sortedRow = JSON.parse(pro.promotion_condition).sort((a, b) => {
        return b.totalCost - a.totalCost;
      });
      if (
        Number(cartData.total_amount) >=
        Number(sortedRow[sortedRow.length - 1].totalCost)
      ) {
        arr.push({
          detailCondition: sortedRow,
          name: pro.name,
          discountKey: pro.discountKey,
          discountType: pro.discountType,
          id: pro.id,
        });
      }
    });
    return arr;
  };
  let filteredPromotion = handlePromotion();

  // const [selectedPromotion, setSelectedPromotion] = React.useState(null);
  let selectedPromotion = cartData.selectedPromotion;
  const [openDiscount, setOpenDiscount] = React.useState(false);

  const [addCustomer, setAddCustomer] = React.useState({ name: "", phone: "" });
  React.useEffect(() => {
    if (addCustomer?.name?.length !== 0) {
      props.handleSelectCustomer(addCustomer);
      setAddCustomer({ name: "", phone: "" });
    }
  });
  console.log("currentCustomer", currentCustomer);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openDiscountDetail = Boolean(anchorEl);

  const info = useSelector((state) => state.info);
  console.log("info", info);
  const store_setting = info.store.general_configuration
    ? JSON.parse(info.store.general_configuration)
    : setting;
  const canEnterDiscountWhenSell =
    store_setting?.canEnterDiscountWhenSell?.status;
  const handleClick = (event) => {
    if (canEnterDiscountWhenSell || info.role === "owner") {
      setAnchorEl(anchorEl ? null : event.currentTarget);
    } else {
      openNotification("error", "Bạn không có quyền nhập giảm giá", "");
    }
  };

  let returnMoney =
    cartData.paid_amount -
    (cartData.total_amount -
      cartData.discount -
      cartData.discountPro +
      cartData.otherFee);

  const totalQuantity = calculateTotalQuantity(cartData.cartItem);

  const otherfee = store_setting?.vat;
  let otherFeeMoney = otherfee?.listCost
    ? otherfee?.listCost?.reduce(
        (sum, fee) => (fee.type !== "%" ? sum + Number(fee.value) : sum),
        0
      )
    : 0;

  console.log("cartData", cartData);

  const scoreAmount =
    (currentCustomer?.points) *
    store_setting?.customerScore.scoreValue;

  // const getBestPromotion = ()=> {
  //   let bestCondition = selectedPromotion.detailCondition.map((pro) =>{if (Number(cartData.total_amount) >= Number(pro.totalCost)) {return pro}else{return null}})
  //   bestCondition =bestCondition.filter(item => item !== null)[0]
  //   return  bestCondition
  // }
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
          <SearchCustomer
            handleClickOpen={handleClickOpen}
            handleSearchCustomer={handleSearchCustomer}
            customers={customers}
            selectedCustomer={
              currentCustomer
              // currentCustomer ? currentCustomer : { name: "", phone: "" }
            }
            handleSearchBarSelect={handleSelectCustomer}
            setAddCustomer={setAddCustomer}
          />
        </div>

        {/* <AddCustomer open={open} handleClose={handleClose} /> */}
        {open && (
          <AddCustomer
            open={open}
            handleClose={() => {
              setOpen(false);
            }}
            onReload={props.reloadCustomers}
            setAddCustomer={setAddCustomer}
            isCart={true}
          />
        )}
        {/* when change mode to menu product */}
        {props.children}

        {/* 2. PAYMENT INFO  */}
        {/* {!mode ? ( */}

        {/* 2.1 Mode 1 */}
        {!mode ? (
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            className={classes.marginBox}
          >
            <Typography variant="h5">
              Tổng SL sản phẩm ({cartData.cartItem.length}){" "}
            </Typography>
            <Typography variant="body2">
              <ThousandFormat
                value={calculateTotalQuantity(cartData.cartItem)}
              ></ThousandFormat>
            </Typography>
          </Grid>
        ) : null}

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          className={classes.marginRow}
          alignItems="center"
        >
          <div>
            <ListItem style={{ padding: 0, margin: 0 }}>
              <Typography variant="h5">
                {!canEnterDiscountWhenSell && mode
                  ? `Tổng tiền (${calculateTotalQuantity(cartData.cartItem)})`
                  : `Tổng tiền hàng`}
              </Typography>
              {/* { filteredPromotion.length > 0   ? 
                <div onClick={()=>{setOpenDiscount(!openDiscount)}}>
                    <img id="gift" src={require('../../../../assets/img/icon/giftbox.png').default} style={{height:16,width:16, marginLeft:10, marginTop:-3}} />
                </div>
                :null} */}
              {filteredPromotion.length > 0 ? (
                <div
                  onClick={() => {
                    setOpenDiscount(!openDiscount);
                  }}
                >
                  <img
                    id="gift"
                    src={
                      require("../../../../assets/img/icon/giftbox.png").default
                    }
                    style={{
                      height: 16,
                      width: 16,
                      marginLeft: 10,
                      marginTop: -3,
                    }}
                  />
                </div>
              ) : null}
            </ListItem>
          </div>
          {openDiscount && (
            <DiscountPopUp
              products={products}
              handleUpdateSelectedPromotion={handleUpdateSelectedPromotion}
              selectedPromotion={cartData.selectedPromotion}
              listGiftItem={cartData.listGiftItem}
              filteredPromotion={filteredPromotion}
              open={openDiscount}
              title="Khuyến mãi trên hóa đơn"
              onClose={() => {
                setOpenDiscount(!openDiscount);
              }}
              totalCartAmount={cartData.total_amount}
              handleUpdateBestDetailSelectedPromotion={
                handleUpdateBestDetailSelectedPromotion
              }
            />
          )}

          <Typography
            variant="body2"
            style={
              !canEnterDiscountWhenSell && mode
                ? { color: "#2096f3", fontWeight: 600, fontSize: 18 }
                : {}
            }
          >
            <VNDFormat value={cartData.total_amount} />
          </Typography>
        </Grid>

        {(canEnterDiscountWhenSell && mode) || !mode ? (
          <>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              className={classes.marginRow}
            >
              <div>
                <ListItem style={{ padding: 0, margin: 0 }}>
                  {/* <Typography variant="h5">Giảm giá {selectedPromotion?.type ==="%" ? <b style={{color:'red'}} >({selectedPromotion.discountValue}%)</b>:""}</Typography> */}
                  {/* <Typography variant="h5">Giảm giá {getBestPromotion()?.type ==="%" ? <b style={{color:'red'}} >({getBestPromotion().discountValue}%)</b>:""}</Typography>
                { selectedPromotion?.discountKey === "invoice" ? 
                <div >
                      <Box style={{backgroundColor:"red",color:"#fff",fontSize:12,fontWeight:500,borderRadius:5, paddingLeft:5,paddingRight:5, marginLeft:10}}>KM</Box>
                </div>
                :null} */}

                  <Typography variant="h5">
                    Giảm giá{" "}
                    {cartData.bestDetailSelectedPromotion?.type === "%" ? (
                      <b style={{ color: "red" }}>
                        ({cartData.bestDetailSelectedPromotion?.discountValue}%)
                      </b>
                    ) : (
                      ""
                    )}
                  </Typography>
                  {selectedPromotion?.discountKey === "invoice" &&
                  selectedPromotion?.discountType === "discountInvoice" ? (
                    <div>
                      <Box
                        style={{
                          backgroundColor: "red",
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 500,
                          borderRadius: 5,
                          paddingLeft: 5,
                          paddingRight: 5,
                          marginLeft: 10,
                        }}
                      >
                        KM
                      </Box>
                    </div>
                  ) : null}
                  <Popper
                    placement="left-start"
                    open={openDiscountDetail}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    style={{ zIndex: 1000000 }}
                  >
                    <DiscountInputDetail
                      handleUpdateDiscountDetail={handleUpdateDiscountDetail}
                      cartData={cartData}
                      setAnchorEl={setAnchorEl}
                    />
                  </Popper>
                </ListItem>
              </div>
              <Box
                onClick={handleClick}
                style={{ width: 90, color: "#616161", textAlign: "right" }}
              >
                <VNDFormat
                  value={
                    Number(cartData.discount) + Number(cartData.discountPro)
                  }
                />
                <Divider
                  style={{
                    background: anchorEl
                      ? theme.customization.primaryColor[500]
                      : "#616161",
                  }}
                />
              </Box>
              {/* style={{color:anchorEl?theme.customization.primaryColor[500]:'#616161'}} */}
              {/* <VNDInput
              // disabled
                id="standard-basic"
                style={{ width: 90 }}
                size="small"
                // defaultValue={cartData.discount}
                value={cartData.discount}
                inputProps={{ style: { textAlign: "right"} }}
                // onChange={(e) => handleUpdateDiscount(e.target.value)}
                onClick={handleClick}
              /> */}
            </Grid>
            {otherfee?.status
              ? otherfee?.listCost?.length
                ? otherfee?.listCost?.map((fee) => {
                    console.log("fee", fee);
                    if (fee.name.length > 0)
                      return (
                        <Grid
                          container
                          direction="row"
                          justifyContent="space-between"
                          className={classes.marginRow}
                        >
                          <Typography variant="h5">{fee.name}</Typography>
                          <Typography variant="body2">
                            <VNDFormat
                              // style={{ color: "#2096f3",fontWeight: 600, }}
                              // value={fee.type === "%"?  Number(fee.value)*(Number(cartData.total_amount) - Number(cartData.discount) - Number(cartData.discountPro)) / 100 : Number(cartData.total_amount) === 0? "0" :fee.value  }
                              value={
                                fee.type === "%"
                                  ? (Number(fee.value) *
                                      (Number(cartData.total_amount) -
                                        Number(cartData.discount) -
                                        Number(cartData.discountPro))) /
                                    100
                                  : fee.value
                              }
                            />
                          </Typography>
                        </Grid>
                      );
                  })
                : null
              : null}
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              className={classes.marginRow}
            >
              <Typography variant="h5">Tổng tiền</Typography>
              <Typography variant="body2">
                <VNDFormat
                  style={{ color: "#2096f3", fontWeight: 600 }}
                  value={
                    Number(cartData.total_amount) !== 0
                      ? cartData.total_amount -
                        cartData.discount - cartData.score_amount -
                        cartData?.discountPro +
                        cartData.otherFee
                      : cartData.total_amount -
                        cartData.discount-
                        cartData?.discountPro +
                        otherFeeMoney
                  }
                />
              </Typography>
            </Grid>
          </>
        ) : null}
        {isScore && currentCustomer ? (
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            className={classes.marginRow}
          >
            <Typography variant="h5">Tích điểm</Typography>
            <Typography variant="body2">
              <ListItem style={{ padding: 0, margin: 0 }}>
                <ThousandFormat
                  // style={{ color: "#2096f3", fontWeight: 500 }}
                  value={cartData.scores}
                />
                 <Typography>
                    /{currentCustomer.points + cartData.scores} ~{" "}
                    <ThousandFormat
                      // style={{ color: "#2096f3", fontWeight: 500 }}
                      value={scoreAmount || 0}
                    />
                    {"đ"}
                  </Typography>
              </ListItem>
            </Typography>
          </Grid>
        ) : null}

        {isScore && currentCustomer && currentCustomer.points ? (
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5">Dùng điểm</Typography>
            <Typography variant="body2">
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                style={{ marginTop: mode ? -10 : null }}
              >
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="useScore"
                    name="useScore1"
                    value={cartData.use_score}
                    onChange={(e) => handleUsingScore(e.target.value)}
                  >
                    <Grid container direction="row">
                      <FormControlLabel
                        labelPlacement="start"
                        value="no"
                        control={<Radio size="small" />}
                        label="Không"
                      />
                      <FormControlLabel
                        labelPlacement="start"
                        value="yes"
                        control={<Radio size="small" />}
                        label="Có"
                      />
                    </Grid>
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Typography>
          </Grid>
        ) : null}

        {/* {cartData.total_amount - cartData.discount  !== 0 || cartData.total_amount === 0 ?<Grid */}
        {cartData.total_amount - cartData.discount !== 0 ? (
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className={classes.marginRow}
          >
            <Typography variant="h5">Khách thanh toán</Typography>
            <VNDInput
              id="standard-basic"
              style={{ width: 90 }}
              // defaultPrice={(cartData.total_amount - cartData.discount).toString()}
              // defaultValue={(cartData.total_amount - cartData.discount).toString()}
              value={cartData.paid_amount}
              size="small"
              inputProps={{ style: { textAlign: "right" } }}
              onChange={(e) => handleUpdatePaidAmount(e.target.value)}
            />
          </Grid>
        ) : null}

        {cartData.total_amount -
          cartData.discount -
          cartData?.discountPro +
          cartData?.otherFee !==
        0 ? (
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className={classes.marginRow}
          >
            <Typography
              variant="h5"
              style={returnMoney < 0 ? { color: "red", fontWeight: 500 } : {}}
            >
              {returnMoney < 0 ? "Nợ" : "Tiền thối"}
            </Typography>
            {/* <Input.ThousandSeperatedInput
                                    id="standard-basic" style={{ width: 90 }}
                                    size="small" inputProps={{ style: { textAlign: "right" } }}
                                    value={Number(customerMoney) - cartData.paid_amount}
                                /> */}
            <Typography
              variant="body2"
              style={returnMoney < 0 ? { color: "red", fontWeight: 500 } : {}}
            >
              <VNDFormat
                value={
                  cartData.paid_amount -
                  (cartData.total_amount - cartData.score_amount - 
                    cartData.discount -
                    cartData?.discountPro +
                    cartData.otherFee)
                }
              />
            </Typography>
          </Grid>
        ) : null}

        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          // className={classes.marginRow}
          style={{ marginTop: mode ? -10 : null }}
        >
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={cartData.payment_method}
              onChange={(e) => handleUpdatePaymentMethod(e.target.value)}
            >
              <Grid container direction="row">
                <FormControlLabel
                  labelPlacement="start"
                  value="card"
                  control={<Radio size="small" />}
                  label="Thẻ"
                />
                <FormControlLabel
                  labelPlacement="start"
                  value="cash"
                  control={<Radio size="small" />}
                  label="Tiền mặt"
                />
              </Grid>
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Checkbox checked={cartData.delivery} onChange={(e)=>handleCheckDelivery(e.target.checked)} />
                }
                label="Giao hàng"
              />
            </Grid> */}
        <Button
          variant="contained"
          fullWidth
          color="primary"
          style={{ marginTop: !mode ? 60 : 0 }}
          onClick={handleConfirm}
          disabled={props.disable}
        >
          Thanh toán
        </Button>
        {/* </>
        ) : (
          */}
        {/* <>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              className={classes.marginRow}
              style={{marginTop:-15}}
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
              style={{  }}
              onClick={handleClickOpenPopUp}
            >
              <Grid container direction="row" justifyContent="space-between">
                <Grid item>Thanh toán  ( {calculateTotalQuantity(cartData.cartItem)} ) </Grid>
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

export default CartSummary;

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
//           Thanh toán ()
//         </Button>
//       </DialogActions>
//     </>
//   );
// };
