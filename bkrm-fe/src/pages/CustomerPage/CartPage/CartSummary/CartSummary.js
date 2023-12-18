import React, {useState,useEffect} from 'react'
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
    FormControl,
    FormHelperText
  } from "@material-ui/core";
  import { useTheme, makeStyles, createStyles,lighten,styled } from "@material-ui/core/styles";
  import { customerPageActions } from '../../../../store/slice/customerPageSlice';
  import {useDispatch, useSelector} from "react-redux"
  import _ from 'lodash'
  import { useFormik } from "formik";
import * as Yup from "yup";
import userApi from "../../../../api/userApi";
import { VNDFormat } from "../../../../components/TextField/NumberFormatCustom";

const CartSummary = (props) => {
    const {formik, order,calculateTotal,calculateQuantity ,handleSubmit,mainColor,isPopUp,handleClose} = props;
    const [cityList, setCityList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [wardList, setWardList] = useState([]);
    const dispatch = useDispatch()

    const handleChangeOrder = (field, value) => {
        let newOrder = _.cloneDeep(order)
        newOrder[field] = value
        dispatch(customerPageActions.setOrder(newOrder))
    }

    useEffect(() => {
      const loadCity = async () => {
        try {
          const res = await userApi.getCity();
          setCityList(res.provinces);
          formik.setFieldValue("cityList", res.provinces)
        } catch (error) {
          console.log(error);
        }
      };
      loadCity();
    }, []);


    useEffect(() => {
      const loadDistrict = async (city_id) => {
        if (city_id) {
          try {
            const res = await userApi.getDistrict(city_id);
            setDistrictList(res.data);
            formik.setFieldValue("districtList",res.data)
          } catch (error) {
            console.log(error);
          }
        }
      };
      loadDistrict(formik.values.city);
      console.log(formik.errors);
    }, [formik.values.city]);
    useEffect(() => {
      const loadWard = async (city_id, district_id) => {
        if (city_id && district_id) {
          try {
            const res = await userApi.getWard(city_id, district_id);
            setWardList(res.data);
            formik.setFieldValue("wardList",res.data)
          } catch (error) {
            console.log(error);
          }
        }
      };
      loadWard(formik.values.city, formik.values.district);
    }, [formik.values.city, formik.values.district]);
  
  

  return (
    <>
    <Grid
    container
    direction="column"
    justifyContent="space-between"
    alignItems="center"
    spacing={5}
    style={{marginTop:5}}
  >
    <Typography
        style={{ fontSize: 19, fontWeight: 500, color: "#000", }}
      >
        Tổng tiền ({calculateQuantity()}):
      </Typography>
      <Typography
        style={{ fontSize: 22, fontWeight: 700, color: "red" , marginBottom:30}}
      >
       <VNDFormat value={calculateTotal()}/>
   </Typography>
       
</Grid >
<TextField
      name="name"
      required
      fullWidth
      label="Họ và tên"
      onChange={(e)=>{formik.setFieldValue("name", e.target.value) ;handleChangeOrder("name", e.target.value) }}
      value={formik.values.name}
      error={formik.touched.name && formik.errors.name}
      helperText={formik.touched.name ? formik.errors.name : null}
      onBlur={formik.handleBlur}
      style={{marginBottom:15}}
    />
<Grid container spacing={2}>
    <Grid item xs={4} > 
    <TextField
        required
        fullWidth
        label="Số điện thoại"
        name="phone"
        onChange={(e)=>{formik.setFieldValue("phone", e.target.value) ;handleChangeOrder("phone", e.target.value)} }
        value={formik.values.phone}
        error={formik.touched.phone && formik.errors.phone}
        helperText={formik.touched.phone ? formik.errors.phone : null}
        onBlur={formik.handleBlur}
        style={{marginBottom:15}}
      />
    </Grid>
    <Grid item xs={8}> 
    <TextField
        // required
        fullWidth
        label="Email"
        name="email"
        onChange={(e)=>{formik.setFieldValue("email", e.target.value) ;handleChangeOrder("email", e.target.value)} }
        value={formik.values.email}
        error={formik.touched.email && formik.errors.email}
        helperText={formik.touched.email ? formik.errors.email : null}
        onBlur={formik.handleBlur}
        style={{marginBottom:15}}
      />
   
      </Grid> 
   </Grid> 
     
       <TextField
        required
        fullWidth
        label="Địa chỉ"
        name="address"
        onChange={(e)=>{formik.setFieldValue("address", e.target.value) ;handleChangeOrder("address", e.target.value)} }
        value={formik.values.address}
        error={formik.touched.address && formik.errors.address}
        helperText={formik.touched.address ? formik.errors.address : null}
        onBlur={formik.handleBlur}
        style={{marginBottom:15}}
      />
    <FormControl
      required
      fullWidth
      error={formik.touched.city && formik.errors.city}
      style={{marginBottom:10}}
    >
      <InputLabel>Tỉnh</InputLabel>
      <Select
        native
        name="city"
        label="Tỉnh"
        value={formik.values.city}
        onChange={(e)=>{formik.setFieldValue("city", e.target.value) ;handleChangeOrder("city", e.target.value)} }
        onBlur={formik.handleBlur}
      >
        <option value="" />
        {cityList.map((city) => (
          <option value={city.id}>{city.name}</option>
        ))}
      </Select>
      {formik.touched.city ? (
        <FormHelperText>{formik.errors.city}</FormHelperText>
      ) : null}
    </FormControl>
<Grid container  spacing={3}>
  <Grid item xs={6}> 
    <FormControl
      required
      fullWidth
      // variant="outlined"
      error={formik.touched.district && formik.errors.district}
      style={{marginBottom:10}}
    >
      <InputLabel>Huyện</InputLabel>
      <Select
        native
        label="Huyện"
        name="district"
        value={formik.values.district}
        onChange={(e)=>{formik.setFieldValue("district", e.target.value) ;handleChangeOrder("district", e.target.value)}}
        onBlur={formik.handleBlur}
      >
        <option value="" />
        {districtList.map((district) => (
          <option value={district.id}>{district.name}</option>
        ))}
      </Select>
      {formik.touched.district ? (
        <FormHelperText>{formik.errors.district}</FormHelperText>
      ) : null}
    </FormControl>

</Grid>
<Grid item xs={6}> 
    <FormControl
      required
      fullWidth
      // variant="outlined"
      error={formik.touched.ward && formik.errors.ward}
      style={{marginBottom:10}}
    >
      <InputLabel htmlFor="ward">Xã</InputLabel>
      <Select
        native
        label="Xã"
        name="ward"
        value={formik.values.ward}
        onChange={(e)=>{formik.setFieldValue("ward", e.target.value) ;handleChangeOrder("ward", e.target.value)}}
        onBlur={formik.handleBlur}
      >
        <option aria-label="None" value="" />
        {wardList.map((ward) => (
          <option value={ward.id}>{ward.name}</option>
        ))}
      </Select>
      {formik.touched.ward ? (
        <FormHelperText>{formik.errors.ward}</FormHelperText>
      ) : null}
    </FormControl>
    </Grid>
 </Grid>
      <ColorButton
        mainColor={mainColor}
        color="primary"
        style={{ marginTop: 50,marginBottom:10 }}
        variant="contained"
        fullWidth
        disabled={!(formik.isValid)|| !calculateTotal()}
        onClick={()=>{
          if(isPopUp){ handleClose() ;handleSubmit()   }
          else{  handleSubmit()}
        }}
      >
        {" "}
    Đặt hàng{" "}
  </ColorButton>
</>
  )
}

export default CartSummary

export const ColorButton = styled(Button)(({mainColor }) => ({
    // color: "#ffffff",
    // backgroundColor: `rgba(${ mainColor.r }, ${ mainColor.g }, ${ mainColor.b }, ${mainColor.a })` ,
    // backgroundColor:lighten(`rgba(${ mainColor.r }, ${ mainColor.g }, ${ mainColor.b }, ${mainColor.a })` , 0.5),
  
    // "&:hover": {
    //   backgroundColor:lighten(`rgba(${ mainColor.r }, ${ mainColor.g }, ${ mainColor.b }, ${mainColor.a })` , 0.3),
      
    // },
}));