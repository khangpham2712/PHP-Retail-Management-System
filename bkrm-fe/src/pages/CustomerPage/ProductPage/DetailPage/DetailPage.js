

import React, {useState,useEffect} from 'react'
import {Button,Grid,Paper,Card,Box,CardActions,Tabs,FormControl,ButtonGroup,Divider,FormLabel,Tab,RadioGroup,Radio,TableContainer,CardContent,CardMedia,CardActionArea,FormControlLabel,Menu,MenuItem,ListItem,IconButton,TableBody,Typography} from '@material-ui/core'
import { useTheme, makeStyles, styled ,lighten} from "@material-ui/core/styles";
import { Carousel } from "react-responsive-carousel";
import { Route, Switch, useRouteMatch, useParams } from "react-router-dom";
import {useSelector,useDispatch} from 'react-redux'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import clsx from "clsx";
// import {VNDFormat} from "../"
import "react-responsive-carousel/lib/styles/carousel.min.css";

import {VNDFormat} from "../../../../components/TextField/NumberFormatCustom"
import {CustomButton} from "../../../../components/Button/ColorButton"
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import defaultProduct from '../../../../assets/img/product/default-product.png'
import _ from 'lodash'
import { customerPageActions } from '../../../../store/slice/customerPageSlice';

import ReactQuill, {Quill} from 'react-quill';
import openNotification from "../../../../components/StatusPopup/StatusPopup";
import { success ,error,warning, info} from '../../../../components/StatusModal/StatusModal';



const DetailPage = (props) => {
    const theme = useTheme();
    const {webInfo} = props;
    const mainColor = `rgba(${ webInfo.mainColor.r }, ${ webInfo.mainColor.g }, ${ webInfo.mainColor.b }, ${webInfo.mainColor.a })`;
    const useStyles = makeStyles((theme,) => ({
      root: {
          flexGrow: 1,
          marginLeft:50,
          marginRight:50,
          marginTop:130
      },
      radio: {
        color: mainColor,
        '&$checked': {
          color: mainColor
        }
      },
      checked: {}
  }));
  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])
     
    const dispatch = useDispatch()
    const classes = useStyles(theme);
    const {productCode} = useParams();
    const {products } = useSelector(state => state.customerPage)
    let detailProduct = products.find(prod => prod.product_code === productCode);
    const [quantity, setQuantity]  = useState(1)
    const {priceStyle, nameStyle} = webInfo.detailPage
    const {order} = useSelector(state => state.customerPage)


    const { storeInfo} = useSelector(state => state.customerPage)
    const webSetting = storeInfo.web_configuration? JSON.parse(storeInfo.web_configuration):null
    const orderWhenOutOfSctock = webSetting?.orderManagement.orderWhenOutOfSctock
    const branchOption = webSetting?.orderManagement.branchOption


    //
    const all_child_product = detailProduct?.has_variance ? products.filter( item => item.parent_product_code === detailProduct.product_code):null
    const attrValue = detailProduct?.attribute_value? JSON.parse(detailProduct.attribute_value):null

    const getSumQuantityOfAvalueToDisableRadio = () =>{
      return attrValue?.map((attr,indexKey) => {
        const arr =  attr.items.map((val, indexItems) => {
          const myObj = all_child_product.filter(item => {
            let att = JSON.parse(item.attribute_value).filter(att => att.name === attr.key )[0]
            if(att){ return att.name === attr.key && att.value.includes(val)  }
          });
          for (let i = 0; i < myObj?.length ; i++){
            if(getStockQuantity(myObj[i]) >0) {return val}
          }
          return null  
        })
        return arr
      })
    }
    let disableValueList = detailProduct?.has_variance ?  getSumQuantityOfAvalueToDisableRadio() :null
    let initValue = disableValueList ? disableValueList.map(i => i.filter(value =>value)[0]):null
    const [selectAttr, setSelectedAttr]  = useState(initValue)

    
    useEffect(()=>{
      detailProduct = products.find(prod => prod.product_code === productCode);
      disableValueList = detailProduct?.has_variance ?  getSumQuantityOfAvalueToDisableRadio() :null
      initValue = disableValueList ? disableValueList.map(i => i.filter(value =>value)[0]):null
      setSelectedAttr(initValue)
    },[products])
    

  function getStockQuantity (product) {
    if(!product){return }
    if(orderWhenOutOfSctock){
        return 999999999
    }else{
        // if (product?.has_variance){
        //     let sum =  all_child_product?.reduce((sum,a)=>sum + Number(a.quantity_available), 0)
        //     return sum
        // }
        if(branchOption === 'auto'  ){
            return Number(product.quantity_available) ? Number(product.quantity_available):0
        }
        else if(branchOption === 'default'){
            let branchId = webSetting?.orderManagement.branchDefault
            const branch = product.branch_inventories.find(branch =>Number(branch.branch_id) === Number(branchId))
            return Number(branch?.quantity_available) ?Number(branch?.quantity_available):0
        }else {
            let branchId = localStorage.getItem(storeInfo.uuid);
            const branch = product.branch_inventories.find(branch => Number(branch.branch_id) === Number(branchId))
            return Number(branch?.quantity_available)  ? Number(branch?.quantity_available) :0
        }
    }

}

    useEffect(()=>{
        setSelectedProduct(getChoosenProductWithVariance())
    },[selectAttr])



    const getChoosenProductWithVariance = ()=>{
      let choosenProduct = all_child_product? [...all_child_product] :[]
        for (let i = 0; i< selectAttr?.length ; i++){
          choosenProduct =  choosenProduct.filter(item=> 
            JSON.parse(item.attribute_value)[i].value.includes(selectAttr[i]) )
        }
        return choosenProduct[0]
    }

    const [selectedProduct, setSelectedProduct] = useState(null)
  
    const handleChange = (e, keyIndex,val) =>{
      let newSelectAttr = [...selectAttr];
      newSelectAttr[keyIndex] = val? val: e.target.value;
      setSelectedAttr(newSelectAttr);

    }

    const addProduct= (stockQuantityOfSelectedProduct) =>{
      if(detailProduct.has_variance) {
        addProductToCart(selectedProduct, quantity,stockQuantityOfSelectedProduct)
        return
      }
      addProductToCart(detailProduct, quantity,stockQuantityOfSelectedProduct)
    }

    const addProductToCart = (product, addQuantity=1,stockQuantityOfSelectedProduct) => {
      const newItem = {...product}
      try {
            const itemInCart = order.cartItem.find(item => item.uuid === selectedProduct.uuid);
            let totalQuantityWillInCart  = itemInCart?Number(itemInCart.quantity) +quantity:quantity 
            if(stockQuantityOfSelectedProduct < totalQuantityWillInCart) {
              const mess = !itemInCart.quantity ? `Số lượng đặt vượt tồn kho. \n  Tồn kho: ${stockQuantityOfSelectedProduct}`:
                    `Số lượng đặt vượt tồn kho. \n  Tồn kho: ${stockQuantityOfSelectedProduct}.\r      Giỏ hàng đang có: ${Number(itemInCart.quantity)}`
              warning(mess)
              return
             }
          const index = order.cartItem.findIndex(item => item.uuid === newItem.uuid);
          const newOrder = _.cloneDeep(order);
          if (index !== -1) {
              // newOrder.cartItem[index].quantity += 1;
              newOrder.cartItem[index].quantity += addQuantity;
          } else {
              // newItem.quantity = 1;
              newItem.quantity  = addQuantity;
              newOrder.cartItem.push(newItem);
          }
          dispatch(customerPageActions.setOrder(newOrder))
          // success("Thêm sản phẩm thành công")
          openNotification("success", "Thêm sản phẩm thành công");
      } catch(err) {
          console.log(err)
      }
  }



    const image = JSON.parse(detailProduct?.img_urls ?detailProduct?.img_urls: "[]" )
    const stockQuantityOfSelectedProduct = detailProduct?.has_variance ? getStockQuantity(selectedProduct) :getStockQuantity(detailProduct)
    return (
    <div className={classes.root}>
      <Grid container  direction="row" justifyContent="space-between" alignItems="flex-start" spacing={8}>
        <Grid item xs={12} md={6}>
          {image.length !==0?
          <Carousel   showArrows={true} showStatus={false} infiniteLoop={true} emulateTouch={true} swipeable={true} dynamicHeight={false}  showThumbs={true}
            >
                {image?.map((url)=>
                <img  src={url}style={{borderRadius:10}} /> )}
            </Carousel>
           :
          <Box  component="img" sx={{  marginLeft: 7, marginRight: 7,  borderRadius: 2}} src={defaultProduct}/>
          }
        </Grid>

        <Grid item xs={12} md={6}>
          <Box>
              {( detailProduct?.has_variance && selectedProduct) ||( !detailProduct?.has_variance && getStockQuantity(detailProduct)) >0 ?null:
              <Box style={{paddingTop:2,marginBottom:10, marginTop:-10 }}><Box style={{backgroundColor:'#000', color:'#fff', maxWidth:65, paddingLeft:2, paddingRight:2,fontWeight:500, marginTop:10, fontSize:14}}>Hết hàng</Box></Box>}
              <Typography variant="h1" style={{marginBottom:25,color:nameStyle[0] === "0" ? "#000": mainColor , fontWeight:nameStyle[2], fontSize: Number(nameStyle[1])}}>{detailProduct?.name}</Typography>
              {/* <Typography variant="h2" style={{color:priceStyle[0] === "0" ? "#000": mainColor , fontWeight:priceStyle[2], fontSize: Number(priceStyle[1])}}>{detailProduct?.list_price.toLocaleString()} đ</Typography> */}
              <Typography variant="h2" style={{color:priceStyle[0] === "0" ? "#000": mainColor , fontWeight:priceStyle[2], fontSize: Number(priceStyle[1])}}>{selectedProduct?.list_price.toLocaleString()} đ</Typography>

              <Typography variant="h5" style={{marginTop:40, marginBottom:10}}>Số lượng :</Typography>
              
              <ButtonGroup disableElevation variant="contained" style={{marginBottom:50}}  >
                <CustomButton mainColor='#f7f7f7'  textColor='#000' size="small" color='secondary'onClick={()=>{if(quantity>1){setQuantity(quantity-1)}}}> <RemoveIcon /></CustomButton>
                <CustomButton mainColor='#fff'  textColor='#000'  >{quantity}</CustomButton>
                <CustomButton mainColor='#f7f7f7' textColor='#000'size="small" onClick={()=>{setQuantity(quantity + 1)}}><AddIcon /></CustomButton>
              </ButtonGroup>
            {detailProduct?.has_variance ?
              attrValue?.map((attr,indexKey) => {
                return(
                  <Box  style={{marginBottom:20}}>
                     <Box style={{display:'flex',backgroundColor:'#F1F1F1',height:38 ,paddingLeft:10, marginBottom:10, paddingTop:9}}>
                      <Typography style={{fontSize:15, color:'#000', fontWeight:500, }}>{attr.key}</Typography> 
                    </Box> 
                  <FormControl>
                       <RadioGroup  value={selectAttr?selectAttr[indexKey]: null} onChange={(e)=>handleChange(e,indexKey)} >
                          <div>
                              {attr.items.map(((val, indexItems) => {
                                const isDisabled = !disableValueList[indexKey].includes(val)
                                
                                return(
                                <FormControlLabel value={val} control={<Radio   classes={{root: classes.radio, checked: classes.checked}} disabled={isDisabled || !selectedProduct } />} label={<Typography style={{color:'#000', fontSize:18,marginRight:15}}>{val}</Typography>}/>
                               ) }))}  
                          </div>
                        </RadioGroup>
                      </FormControl>
                    
                  </Box>
                )
              })
              :null
           }
          </Box>
          {/* {( detailProduct?.has_variance && selectedProduct && getStockQuantity(selectedProduct))  > 0||( !detailProduct?.has_variance && getStockQuantity(detailProduct))  > 0? */}
          {( detailProduct?.has_variance && selectedProduct && stockQuantityOfSelectedProduct> 0)  ||( !detailProduct?.has_variance && stockQuantityOfSelectedProduct> 0)  ?

          <CustomButton fullWidth mainColor={mainColor} style={{marginTop:50}} onClick={()=>addProduct(stockQuantityOfSelectedProduct)} >Thêm vào giỏ hàng</CustomButton>
          : <CustomButton fullWidth mainColor={mainColor} style={{marginTop:50,color:'#fff'}} disabled >Hết hàng</CustomButton>}
        </Grid>
      </Grid>
    
        <Divider  style={{marginTop:20}}/>
        <Typography  style={{color:'#000', fontSize:18,fontWeight:500, marginTop:20,}}>Mô tả sản phẩm</Typography>
      
                <ReactQuill theme="bubble" value={detailProduct?.description} readOnly={true} />
                {/* {detailProduct?.description} */}

    </div>
        
    )
}

export default DetailPage



