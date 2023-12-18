import React, { useEffect } from 'react'
//import style
import useStyles from "../../../../components/TableCommon/style/mainViewStyle";
//impỏrt library
import {Box,TextField,ListItem,IconButton,TableRow,TableCell,Typography,Grid} from '@material-ui/core'
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
//import project 
import * as Input from '../../../../components/TextField/NumberFormatCustom'
import ButtonQuantity from "../../../../components/Button/ButtonQuantity";
import { VNDFormat } from "../../../../components/TextField/NumberFormatCustom"
// import DiscountPopUp from "../DiscountPopup/DiscountPopup"
import icon from '../../../../assets/img/product/tch.jpeg';
import DeleteForeverTwoToneIcon from '@material-ui/icons/DeleteForeverTwoTone';
import defaultProduct from '../../../../assets/img/product/default-product.png'

 const CartRow = (props) =>{
    const classes = useStyles(); 
    const haveDiscount = true;

    const {row,discountData, handleDeleteItemCart, handleChangeItemQuantity, index} = props
    
    const updateQuantity = (newQuantity) => {
      handleChangeItemQuantity(index, newQuantity)
    }
    const image=JSON.parse(row.img_urls ? row.img_urls : "[]").length  ? JSON.parse(row.img_urls ? row.img_urls : "[]").at(0) : defaultProduct
    return (
        <TableRow  key={props.row.uuid} >
          <TableCell align="left" style={{minWidth:200, }}>
            <ListItem  style={{marginLeft:-30, marginTop:-10, marginBottom:-10, alignItems:"flex-start", }}> 
                <Box component="img" sx={{ height: 80, width: 80,  borderRadius:10,  marginRight:15 }} src={image } />
                <Typography  style={{color:"#000",  marginTop:10, fontSize:14, }}>{row.name}</Typography>  
            </ListItem> 

            </TableCell>
          <TableCell align="center">
              <Typography  > <VNDFormat value={row.list_price} /></Typography>  
          </TableCell>
  
          <TableCell align="right"   >
            <ButtonQuantity quantity={row.quantity} setQuantity={updateQuantity} isMini={true} isCustomer={true} />  
          </TableCell>
          
          <TableCell align="center"className={classes.boldText}><VNDFormat value={row.list_price * row.quantity} /></TableCell>
          <TableCell align="right" >
            <IconButton aria-label="expand row" size="small" onClick={() => handleDeleteItemCart(row.uuid)} >
                <DeleteForeverTwoToneIcon />
            </IconButton>
          </TableCell>
        </TableRow>
    )
  }

export  const CartRowNoHeader = (props) =>{
    const classes = useStyles(); 
    const haveDiscount = true;

    const {row,discountData, handleDeleteItemCart, handleChangeItemQuantity, index} = props
    
    const updateQuantity = (newQuantity) => {
      handleChangeItemQuantity(index, newQuantity)
    }
    
    return (
      <Grid container  alignItem='center'>
          <Grid item>
            <ListItem  style={{marginLeft:-30, marginTop:-10, marginBottom:-10, alignItems:"flex-start", }}> 
                <Box component="img" sx={{ height: 90, width: 90,  borderRadius:10,  marginRight:15 }} src={row.img_urls[0] ? row.img_urls[0].url : ""} />
                <Typography  style={{color:"#000",  marginTop:10, fontSize:14, }}>{row.name}</Typography>  
            </ListItem> 
          </Grid>
          <Grid item>
              <Typography  > <VNDFormat value={row.list_price} /></Typography>  
          </Grid>
          <Grid item>
              <ButtonQuantity quantity={row.quantity} setQuantity={updateQuantity} isMini={true} isCustomer={true} />  
          </Grid>
          <Grid item>
               <VNDFormat value={row.list_price * row.quantity} />
          </Grid>
          <Grid item>
          <IconButton aria-label="expand row" size="small" onClick={() => handleDeleteItemCart(row.uuid)} >
                <DeleteForeverTwoToneIcon />
            </IconButton>
          </Grid>
      </Grid>
     
    )
  }

  export default CartRow