
import React, { useState, useEffect } from "react";
import { useTheme, makeStyles, createStyles, lighten, styled } from "@material-ui/core/styles";
import {
  Typography,
  Box,
  Card,
  Button,
  Grid,
  ButtonBase,
  Avatar,
  TextField,
  Tooltip,
  InputLabel,
  Select,
  MenuItem,
  TableBody,
} from "@material-ui/core";
import * as TableType from "../../../assets/constant/tableType";
import TableHeader from "../../../components/TableCommon/TableHeader/TableHeader";
import TableWrapper from "../../../components/TableCommon/TableWrapper/TableWrapper";
import InvoiceReturnSummary from "../../../components/CheckoutComponent/CheckoutSummary/InvoiceReturnSummary/InvoiceReturnSummary";
import CartTableRow from "./CartTableRow/CartTableRow"
import { Divider } from "@mui/material";
import _ from 'lodash'
// import {useTheme, makeStyles,styled,withStyles,createStyles,lighten} from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux"
import { customerPageActions } from '../../../store/slice/customerPageSlice';
import customerPageApi from '../../../api/customerPageApi'
import { error, success } from "../../../components/StatusModal/StatusModal";
import CartSummary from "./CartSummary/CartSummary"
import { useFormik } from "formik";
import * as Yup from "yup";
import { VNDFormat } from "../../../components/TextField/NumberFormatCustom";
import DialogWrapper from "../../../components/Modal/DialogWrapper"
import { CartRowNoHeader } from "./CartTableRow/CartTableRow"
import getGeoCode from "../../../components/BranchMap/Geocode";
import * as geolib from 'geolib';
const useStyles = makeStyles((theme) =>
  createStyles({
    textTitle: {
      flexGrow: 1,
      textAlign: "center",
      marginBottom: 15,
    },
    card1: {
      boxShadow: "nones",
    },
    dividerColor: {
      color: "#000"
    }
  })
);

export const CartHeadCells = [
  { id: "name", align: "left", disablePadding: true, label: "Sản phẩm" },
  { id: "price", align: "center", disablePadding: true, label: "Đơn giá" },
  { id: "quantity", align: "center", disablePadding: true, label: "Số lượng" },
  { id: "total", align: "center", disablePadding: true, label: "Thành tiền" },
  { id: "action", align: "right", disablePadding: true, label: "" },
];

const CartPage = (props) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const { mainColor, cart } = props.webInfo

  const [openPopUp, setOpenPopUp] = useState(false)

  const { order, storeInfo } = useSelector(state => state.customerPage)
  const info = useSelector((state) => state.info);


  const dispatch = useDispatch()
  const [cartList, setCartList] = React.useState([
    {
      uuid: "123423",
      id: 123,
      name: "Áo dài Việt Nam Việt Nam",
      quantity: 2,
      unit_price: 200,
    },
    { uuid: "dđ123423", id: 12, name: "Quan", quantity: 1, unit_price: 220 },
    { uuid: "dđ1dgrr23423", id: 134, name: "Bánh", quantity: 3, unit_price: 240 },
  ]);

  const handleChangeItemQuantity = (index, newQuantity) => {
    let newOrder = _.cloneDeep(order)

    newOrder.cartItem[index].quantity = newQuantity
    dispatch(customerPageActions.setOrder(newOrder))
  }


  const handleDeleteItemCart = (uuid) => {
    let newOrder = _.cloneDeep(order)
    newOrder.cartItem = newOrder.cartItem.filter(row => row.uuid !== uuid)

    dispatch(customerPageActions.setOrder(newOrder))
  }



  const calculateTotal = () => {
    let total = 0;
    order.cartItem.forEach(item => total += item.list_price * item.quantity)
    return total
  }
  const calculateQuantity = () => {
    let rs = order.cartItem?.reduce((b, a) => b + a.quantity, 0);
    if (rs) return rs
    return 0

  }
  const formik = useFormik({
    initialValues: {
      name: order.name ? order.name : "",
      email: order.email ? order.email : "",
      phone: order.phone ? order.phone : "",
      address: order.address ? order.address : "",
      ward: order.ward ? order.ward : "",
      district: order.district ? order.district : "",
      city: order.city ? order.city : "",
      wardList: [],
      cityList: [],
      districtList: [],

    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nhập họ và tên"),
      phone: Yup.string()
        .length(10, "Số điện thoại không chính xác")
        .required("Nhập số điện thoại")
        .matches(/^\d+$/, "Số điện thoại không chính xác"),
      // email: Yup.string().email("Email không chính xác"),
      address: Yup.string().required("Nhập địa chỉ"),
      city: Yup.string().required("Chọn tỉnh/thành phố"),
      district: Yup.string().required("Chọn quận/huyện"),
      ward: Yup.string().required("Chọn phường/xã"),
    }),
  })

  const getAutoBranch = async () => {
    const ward = formik.values.wardList.find((ward) => ward.id === formik.values.ward).name;
    const province = formik.values.cityList.find(
      (city) => city.id === formik.values.city
    ).name;
    const district = formik.values.districtList.find(
      (district) => district.id === formik.values.district
    ).name;
    let lat, lng, distances;
    try {
      ({ lat, lng } = await getGeoCode(
        formik.values.address + " " + ward + " " + district + " " + province, info.store.key
      ));
      const currentPos = {
        latitude: lat,
        longitude: lng,
      }
      let distances = []
      info.store.branches?.map((branch) => {
        if (branch.lat !== null && branch.lng !== null) {
          distances.push({
            id: branch.id, distance: geolib.getDistance(currentPos,
              { latitude: branch.lat, longitude: branch.lng })
          })
        }
      })
      if (distances.length > 1) {
        return distances.reduce(function (prev, curr) {
          return prev.distance < curr.distance ? prev.id : curr.id;
        })
      }
    }
    catch (error) {
      console.log(error)
    }
    return info.store.branches[0].id
  }

  const getBranch = async () => {
    console.log()
    const webSetting = storeInfo.web_configuration ? JSON.parse(storeInfo.web_configuration) : null
    const branchOption = webSetting?.orderManagement.branchOption
    if (branchOption === 'auto') {
      let autoBranch = await getAutoBranch();
      return autoBranch
    }
    else if (branchOption === 'default') {
      // Default
      // THợp branch default cài trong setting bị xoá thì sao ??? => lúc xoá branch tự update lại setting
      let branchId = webSetting?.orderManagement.branchDefault
      return branchId
    } else {
      // Choose
      // THợp branch đã lưu trong localStorage bị xoá thì sao ??? => lúc load trang check local value có trong các branch đang có ko ... nếu có thì cho chọn lại? hoặc ...
      let branchId = localStorage.getItem(storeInfo.uuid);
      return branchId
    }
  }

  const handleSubmit = async () => {
    try {
      const branch = await getBranch()
      // 
      const ward = formik.values.wardList.find((ward) => ward.id === formik.values.ward).name;
      const province = formik.values.cityList.find(
        (city) => city.id === formik.values.city
      ).name;
      const district = formik.values.districtList.find(
        (district) => district.id === formik.values.district
      ).name;
      // 
      let submitOrder = _.omit({ ...order,branch_id: Number(branch) }, "cartItem")
      submitOrder.details = JSON.stringify(order.cartItem)
      submitOrder.ward = ward
      submitOrder.city = province
      submitOrder.district = district
      const res = await customerPageApi.addOrder(storeInfo.uuid, { ...submitOrder, total_amount: calculateTotal() });
      success("Đặt đơn hàng thành công")
      dispatch(customerPageActions.setOrder({
        name: "",
        phone: "",
        cartItem: [],
        address: "",
        branch_id: storeInfo.branches?.at(0)?.id,
      }))
    } catch (err) {
      console.log(err)
      error('Đặt đơn hàng thất bại')
    }

  }



  return (
    <div style={{ backgroundColor: "#fff" }}>
      <Box style={{ marginTop: 100, marginLeft: 50, marginRight: 50 }}>
        <Typography style={{ flexGrow: 1, textAlign: "center", marginBottom: 8 }} variant="h2">
          Giỏ hàng
        </Typography>

        <Grid container justifyContent="center">
          <Divider
            sx={{ borderBottomWidth: 5 }}
            variant="middle"
            style={{ width: 50, marginBottom: 20, background: "black" }}
          />
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          // alignItems="center"
          spacing={2}
        >
          <Grid item sm={12} md={cart.summaryPosition === "right" ? 8 : 12}>

            <Card style={{ boxShadow: "0px 5px 10px rgba(0,0,0,0.1)" }}>
              <Box style={{ padding: 30 }}>
                <TableWrapper isCart={true}>
                  {cart.header === 'show' ?
                    <TableHeader
                      classes={classes}
                      isCustomer={true}
                      headerData={CartHeadCells}
                    /> : null}
                  <TableBody>
                    {order.cartItem.map((row, index) => {
                      return (
                        <CartTableRow
                          row={row}
                          handleDeleteItemCart={handleDeleteItemCart}
                          handleChangeItemQuantity={handleChangeItemQuantity}
                          index={index}
                        />
                      );
                    })}
                  </TableBody>
                </TableWrapper>
              </Box>
            </Card>
          </Grid>

          {cart.summaryPosition === "right" ? <Grid item sm={12} md={4} className={classes.card}>
            <Card className={classes.card} style={{ padding: 20 }}>
              <CartSummary formik={formik} order={order} calculateTotal={calculateTotal} handleSubmit={handleSubmit} calculateQuantity={calculateQuantity} mainColor={mainColor} />
            </Card>
          </Grid>
            :
            <Box style={{ position: "fixed", bottom: 0, right: 0, left: 0, border: "1px solid #b6b6b6", height: 70, padding: 20 }}>
              <Grid container justifyContent="space-between" alignItems='center'>
                <Grid item> <Typography variant='h2'>Tạm tính : <VNDFormat style={{ color: 'red' }} value={calculateTotal()} /></Typography> </Grid>
                <Grid item>
                  < Button mainColor={mainColor} color="primary" style={{ borderRadius: 5 }} variant="contained" fullWidth disabled={!(formik.isValid) || !calculateTotal()} onClick={() => setOpenPopUp(true)}  > {" "}
                    Đặt hàng{" "}
                  </Button>
                </Grid>
              </Grid>
              <DialogWrapper title={'Thông tin giỏ hàng'} handleClose={() => setOpenPopUp(false)} open={openPopUp} >
                <CartSummary formik={formik} order={order} calculateTotal={calculateTotal} handleSubmit={handleSubmit} calculateQuantity={calculateQuantity} mainColor={mainColor} isPopUp={true} handleClose={() => setOpenPopUp(false)} />
              </DialogWrapper>
            </Box>

          }
        </Grid>
      </Box>
    </div>
  );
};

export default CartPage;






export const ColorButton = styled(Button)(({ mainColor }) => ({
  // color: "#ffffff",
  // backgroundColor: `rgba(${ mainColor.r }, ${ mainColor.g }, ${ mainColor.b }, ${mainColor.a })` ,
  // backgroundColor:lighten(`rgba(${ mainColor.r }, ${ mainColor.g }, ${ mainColor.b }, ${mainColor.a })` , 0.5),

  // "&:hover": {
  //   backgroundColor:lighten(`rgba(${ mainColor.r }, ${ mainColor.g }, ${ mainColor.b }, ${mainColor.a })` , 0.3),

  // },
}));