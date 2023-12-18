import React,{useState,useEffect} from 'react'
import { Dialog } from '@material-ui/core'
import { Divider,ListItem,Button,IconButton,RadioGroup, Box,FormControl ,FormControlLabel,Radio,ButtonGroup,Typography,Grid} from '@mui/material'
import { useTheme, makeStyles, styled ,lighten} from "@material-ui/core/styles";
import {useSelector,useDispatch} from 'react-redux'

import ModalWrapperWithClose from '../../../../components/Modal/ModalWrapperWithClose'
import { Carousel } from "react-responsive-carousel";
import defaultProduct from '../../../../assets/img/product/default-product.png'
import {CustomButton} from "../../../../components/Button/ColorButton"
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import soldOutIcon from "../../../../assets/img/icon/sold-out.png"
import soldOutIcon1 from "../../../../assets/img/icon/sold-out-1.png"

const PopUpProduct = ({open,onClose, product,mainColor,addProductToCart,getStockQuantity}) => {
    const theme = useTheme();
    const useStyles = makeStyles((theme) => ({
      radio: {
        color: mainColor,
        '&$checked': {
          color: mainColor
        }
      },
      checked: {}
  }));
    const classes = useStyles(theme);
    const image = JSON.parse(product?.img_urls ?product?.img_urls: "[]" )
    const [quantity, setQuantity]  = useState(1)
    const {products } = useSelector(state => state.customerPage)


    //
    const all_child_product = product?.has_variance ? products.filter( item => item.parent_product_code === product.product_code):null
    const attrValue = product?.attribute_value? JSON.parse(product.attribute_value):null

    const getSumQuantityOfAvalueToDisableRadio = () =>{
      return attrValue?.map((attr,indexKey) => {
        const arr =  attr.items.map((val, indexItems) => {
          const myObj = all_child_product.filter(item => {
            let att = JSON.parse(item.attribute_value).filter(att => att.name === attr.key )[0]
            if(att){ return att.name === attr.key && att.value.includes(val)  }
          });
          for (let i = 0; i < myObj?.length ; i++){
            // if(getStockQuantity(myObj[i],all_child_product) >0 ) {return val}
            if(getStockQuantity(myObj[i]) >0 ) {return val}

          }
          return null  
        })
        return arr
      })
    }

    const disableValueList = product?.has_variance ?  getSumQuantityOfAvalueToDisableRadio() :null
    const initValue = disableValueList ? disableValueList.map(i => i.filter(value =>value)[0]):null
    const [selectAttr, setSelectedAttr]  = useState(initValue)


    useEffect(()=>{
        setSelectedProduct(getChoosenProductWithVariance())
    },[selectAttr])
    
    // useEffect(()=>{
    //   if(product?.has_variance){
    //     setSelectedProduct(getChoosenProductWithVariance())
    //   }
    // },[])
    

    const handleChange = async(e, keyIndex,val) =>{
      let newSelectAttr = [...selectAttr];
      newSelectAttr[keyIndex] = val? val: e.target.value;
      setSelectedAttr(newSelectAttr);
      
    }
    const getChoosenProductWithVariance = ()=>{
      let choosenProduct = all_child_product? [...all_child_product] :[]
        for (let i = 0; i<selectAttr?.length ; i++){
          choosenProduct =  choosenProduct.filter(item=> 
            JSON.parse(item.attribute_value)[i].value.includes(selectAttr[i]) )
        }
        return choosenProduct[0]
    }

    const [selectedProduct, setSelectedProduct] = useState(null)
    // const stockQuantityOfSelectedProduct = getStockQuantity(selectedProduct ,all_child_product )

    const stockQuantityOfSelectedProduct = getStockQuantity(selectedProduct  )

    // const [  isLowStock , setIsLowStock] = useState(getStockStatus(selectedProduct))
  //   useEffect(()=>{
  //     setIsLowStock(getStockStatus(selectedProduct))
  //     console.log(isLowStock)
  // },[selectedProduct])

  return (
    <ModalWrapperWithClose open={open} handleClose={onClose}  title={'Thêm sản phẩm'}>
     <Divider style={{marginBottom:10}}/>
      <Box  style={{maxWidth:380}}>
    <ListItem style={{display:'flex',alignItems:'flex-start',flexDirection: "row"}}>
        <Box  component="img" sx={{  width:120,height:120,borderRadius: 2}} src={image.length === 0?defaultProduct :image[0]}/> 
        
        <Box style={{ marginLeft:15}}>
             {(  selectedProduct) ?null:
              <Box style={{paddingTop:2,marginBottom:10, marginTop:-10 }}><Box style={{backgroundColor:'#000', color:'#fff', maxWidth:65, paddingLeft:2, paddingRight:2,fontWeight:500, marginTop:10, fontSize:14}}>Hết hàng</Box></Box>}
            <Typography style={{fontWeight:500, fontSize:18, color:'#000', marginBottom:10}} >{product?.name}</Typography>
            <Typography style={{fontWeight:400, fontSize:16, color:'#000'}} >{product?.list_price.toLocaleString()}đ</Typography>
            
            <ListItem style={{display:'flex',justifyContent:'flex-end',flexDirection: "row" , margin:0, padding:0}}>
              <IconButton aria-label="delete" size="small" style={{backgroundColor:mainColor, color:'#fff'}} onClick={()=>{if(quantity>1){setQuantity(quantity-1)}}}>
                   <RemoveIcon fontSize="inherit" />
              </IconButton>
                <Typography style={{color:'#000', fontSize:18, margin:15}}> {quantity}</Typography>
                <IconButton aria-label="delete" size="small" style={{backgroundColor:mainColor, color:'#fff'}} onClick={()=>{setQuantity(quantity + 1)}} >
                   <AddIcon fontSize="inherit" />
              </IconButton>
            </ListItem>
            
           </Box>
         </ListItem>
         {attrValue?.map((attr,indexKey) => {
                return(
                  <Box  style={{marginBottom:20}}>
                    <Box style={{display:'flex',backgroundColor:'#F1F1F1',height:38 ,paddingLeft:10,  paddingTop:9}}>
                      <Typography style={{fontSize:15, color:'#000', fontWeight:500, }}>{attr.key}</Typography> 
                    </Box> 
                  <FormControl style={{margin:10}}>
                        <RadioGroup  value={selectAttr[indexKey]} onChange={(e)=>handleChange(e,indexKey)} >
                          <div>
                              {attr.items.map(((val, indexItems) => {
                                const isDisabled = !disableValueList[indexKey].includes(val)
                                return(
                                <FormControlLabel value={val} control={<Radio classes={{root: classes.radio, checked: classes.checked}}  disabled={isDisabled || !selectedProduct } />} label={<Typography style={{color:'#000', fontSize:18, marginRight:15,marginLeft:5}}>{val}</Typography>}/>
                               ) }))}  
                          </div>
                        </RadioGroup>
                      </FormControl>
                  </Box>
                )
          })}

        {  selectedProduct && stockQuantityOfSelectedProduct > 0 ?
        <CustomButton fullWidth mainColor={mainColor} style={{marginTop:100}} 
        onClick={()=>{
          onClose()
          addProductToCart(selectedProduct,stockQuantityOfSelectedProduct,quantity )
        
        }}  >
          Thêm vào giỏ hàng</CustomButton>
        : <CustomButton fullWidth mainColor={mainColor} style={{marginTop:100, color:'#fff'}} disabled >Hết hàng</CustomButton>
        }
       
      </Box>
    </ModalWrapperWithClose>
  )
}

export default PopUpProduct