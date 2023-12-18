import React from 'react'
import {Box,TextField,Avatar,Slide,Divider,ListItemSecondaryAction,Dialog,AppBar,Toolbar,Button,ListItem,IconButton,TableRow,TableCell,Typography, Grid} from '@material-ui/core'
import { useTheme, makeStyles, styled } from "@material-ui/core/styles";

import useStyles from "../TableCommon/style/mainViewStyle";
import icon from '../../assets/img/product/tch.jpeg';
import * as Input from '../TextField/NumberFormatCustom'
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import InvoiceReturnDetail from "../../views/SalesView/InvoiceReturn/InvoiceReturnTableRow/InvoiceReturnDetail/InvoiceReturnDetail";
import InvoiceDetail from "../../views/SalesView/Invoice/InvoiceTableRow/InvoiceDetail/InvoiceDetail";
import InventoryOrderDetail from "../../views/InventoryView/InventoryOrder/InventoryOrderTableRow/InventoryOrderDetail/InventoryOrderDetail";
import InventoryReturnDetail from "../../views/InventoryView/InventoryReturnOrder/InventoryReturnTableRow/InventoryReturnDetail/InventoryReturnDetail";
import OrderProductListDetail from "../../views/InventoryView/OrderProductList/OrderProductListTableRow/OrderProductListDetail/OrderProductListDetail";
import CheckHistoryDetail from "../../views/InventoryView/CheckHistory/CheckHistoryTableRow/CheckHistoryDetail/CheckHistoryDetail"
import CustomerDetail from "../../views/ManagerView/Customer/CustomerTableRow/CustomerDetail/CustomerDetail"
import SupplierDetail from "../../views/InventoryView/Supplier/SupplierTableRow/SupplierDetail/SupplierDetail"
import EmployeeDetail from "../../views/HRView/Employee/EmployeeTableRow/EmployeeDetail/EmployeeDetail"
import DiscountDetail from '../../views/ManagerView/Setting/DiscountSetting/DiscountTableRow/DiscountDetail/DiscountDetail';
import VoucherDetail from '../../views/ManagerView/Setting/VoucherSetting/VoucherTableRow/VoucherDetail/VoucherDetail';
import CloseIcon from '@material-ui/icons/Close';
import {ThousandFormat} from "../TextField/NumberFormatCustom"
import ava from '../../assets/img/product/lyimg.jpeg';
import PhoneIcon from '@material-ui/icons/Phone';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import InventoryDetail from '../../views/InventoryView/Inventory/InventoryTableRow/InventoryDetail/InventoryDetail';
import DiscountPopUp from "../../views/SalesView/Cart/DiscountPopup/DiscountPopup"
import ButtonQuantity from "../../components/Button/ButtonQuantity";

import defaultProduct from "../../assets/img/product/default-product.png"
import setting from "../../assets/constant/setting"

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });


export const CartMiniTableRow = (props) =>{
    const classes = useStyles(); 
    const haveDiscount = true;

    const {row,discountData, handleDeleteItemCart,isManageInventory, handleChangeItemQuantity, isCart,handleChangeItemPrice} = props
    const updateQuantity = (newQuantity) => {
        handleChangeItemQuantity(row.uuid, newQuantity)
      }

    const [openDiscount, setOpenDiscount] = React.useState(false);
    const handleOpenDiscount = () =>{
      setOpenDiscount(!openDiscount)
    }
    const info = useSelector((state) => state.info);
    const store_setting = info.store.general_configuration? JSON.parse(info.store.general_configuration): setting
    const canFixPriceSell= store_setting?.canFixPriceSell
    const activeFixPrice =  isCart?  (canFixPriceSell.status && canFixPriceSell.cart) :(canFixPriceSell.status && canFixPriceSell.import) 
    return (
        <>
         <ListItem  style={{ padding:10}}>   
                <ListItem  style={{margin:0, padding:0}}>    
                        <Box component="img" sx={{ height: 55, width: 55,  borderRadius:10,marginRight:20   }}src={row.img_url} />
                        <div>
                            <ListItem style={{margin:0,padding:0}} >    
                                <Typography style={{fontSize:15, marginBottom:10}} >{row.name} </Typography>
                                {haveDiscount ? 
                                <img id="gift" src={require('../../assets/img/icon/giftbox.png').default} style={{height:16,width:16, marginLeft:10, marginTop:-3}} onClick={()=>setOpenDiscount(true)}/>
                                :null}
                                {openDiscount && <DiscountPopUp open={openDiscount} title={`Khuyến mãi trên ${row.product_code} - ${row.name}`} onClose={()=>{setOpenDiscount(false)}}/>}
                            </ListItem  > 
                            <ListItem style={{margin:0,padding:0}} >    
                            {activeFixPrice?
                            <Input.ThousandSeperatedInput 
                                id="standard-basic" style={{maxWidth:70 }} size="small" 
                                inputProps={{style: { textAlign: "right" }}} 
                                defaultPrice={row.unit_price} 
                                value={row.unit_price} 

                                onChange={e => handleChangeItemPrice(props.row.uuid, e.target.value)}/>:
                                <Input.ThousandFormat  value={row.unit_price} > </Input.ThousandFormat>}

                                <Typography style={{marginLeft:10}}>x</Typography>
                            </ListItem  > 
                        </div>
                    </ListItem  >  
                    <ListItemSecondaryAction style={{marginTop:20, marginRight:-20}}>
                        <ButtonQuantity quantity={row.quantity} setQuantity={updateQuantity}  branch_quantity={row.branch_quantity} isMini={true}/> 
                    </ListItemSecondaryAction>
                
                </ListItem  >  
         <Divider style={{marginTop:7}}/>
        

        </>
    )
}
export const BillMiniTableRow = (props) =>{
    const { row, handleOpenRow, openRow, onReload } = props;

    const {totalCost, id,partnerName ,date, typeBill } = props;
    const{promotion_condition,dateAdvanceSetting, type} = props;
    const classes = useStyles(); 
    const theme = useTheme();

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <div style={{margin:10}}>
        <Grid  container direction="row" justifyContent="space-between" 
          onClick={()=>{handleClickOpen();handleOpenRow(typeBill === "Khuyến mãi"?row.id:row.uuid)}}  >
            <Grid item>
                <Typography style={{ fontWeight:500,marginTop:-5,fontSize:15, marginBottom:3}}>{id}</Typography>
                <Typography style={{ fontSize:14}}>{partnerName}</Typography>  
            </Grid>
            <Grid item justifyContent="flex-end" >
                
          {typeBill ==="Voucher"?<Typography style={{ fontSize:11, marginTop:-15, marginBottom:7}}> Ngày hết hạn:</Typography>:null}

           <Typography style={{color:"#6b6b6b", fontSize:10, marginTop:-8, marginBottom:5,textAlign: 'right'}}>{date?.substring(0, 16)}</Typography>
            
            {typeBill === "Khuyến mãi"  ?<Typography style={{marginTop:10}} >{totalCost}  </Typography>:null}
            {typeBill === "Đơn đặt hàng"  || typeBill === "Voucher"?<Typography style={{fontWeight:500, fontSize:17, color:"orange",textAlign: 'right'}}><ThousandFormat value={totalCost}/></Typography> :null}
            {typeBill === "Đơn kiểm kho"?<Typography style={{fontWeight:500, fontSize:17, color:totalCost >=0?"green":"red",textAlign: 'right'}}><ThousandFormat value={totalCost}/></Typography> :null}
            {typeBill !== "Đơn đặt hàng" &&typeBill !== "Đơn kiểm kho" &&typeBill !== "Voucher" && typeBill !== "Khuyến mãi"? <Typography style={{fontWeight:500, fontSize:17, color:typeBill  === "Hoá đơn" || typeBill === "Đơn nhập hàng"?theme.customization.primaryColor[500]:theme.customization.secondaryColor[500],textAlign: 'right'}}><ThousandFormat value={totalCost}/></Typography> :null}
            
            
            </Grid>
        </Grid> 
        <Divider style={{marginTop:2}} />

        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
            <Toolbar>
                <Typography variant="h3" className={classes.title} style={{color:"white"}} >
                    {typeBill} {"#"} {id}
                </Typography>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
                </IconButton>
            </Toolbar>
            </AppBar>

            {typeBill === "Hoá đơn"? <InvoiceDetail parentProps={props}  isMini={true} />:null}
            {typeBill === "Đơn trả"? <InvoiceReturnDetail parentProps={props}  isMini={true}/>:null}
            {typeBill === "Đơn nhập hàng"? <InventoryOrderDetail parentProps={props}  isMini={true}/>:null}
            {typeBill === "Đơn trả hàng nhập"? <InventoryReturnDetail parentProps={props}  isMini={true}/>:null}
            {typeBill === "Đơn đặt hàng nhập"? <OrderProductListDetail parentProps={props}  isMini={true}/>:null}
            {typeBill === "Đơn kiểm kho"? <CheckHistoryDetail parentProps={props}  isMini={true}/>:null}
            {/* {typeBill === "Khuyến mãi"? <DiscountDetail parentProps={props}  isMini={true} promotion_condition={promotion_condition} type={type}/>:null} */}
            {typeBill === "Voucher"? <VoucherDetail parentProps={props}  isMini={true}/>:null}
            {typeBill === "Khuyến mãi"?  <DiscountDetail isMini={true}parentProps={props} promotion_condition={promotion_condition}dateAdvanceSetting={dateAdvanceSetting} type={type} />       :null}

        </Dialog>
        </div>
    )
}

export const PartnerMiniTableRow = (props) =>{
    const { row, handleOpenRow, openRow, onReload } = props;

    const {img, id,name ,phone, score,typePartner } = props
    const classes = useStyles(); 
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (

        <div style={{margin:15,}}>
        <Grid  container direction="row" justifyContent="space-between" 
          onClick={()=>{handleClickOpen();handleOpenRow(row.uuid)}} 
          >
            <Grid item>
                <ListItem  style={{marginLeft:2, padding:0}}>
                    {typePartner !== "Nhà cung cấp"?<Avatar alt="Remy Sharp" src={img} style={{marginRight:20,}} className={classes.ava} />:null}
                    <div>
                        <Typography style={{marginBottom:2, marginTop:-5,marginBottom:3}}>{name}</Typography>
                        <ListItem  style={{margin:0, padding:0}}>
                            <PhoneIcon style={{width:10, height:10, marginRight:2, color:"#8f8f8f"}}/>
                            <Typography style={{color:'#36afff', fontSize:12}}>{phone}</Typography>
                        </ListItem>  
                    </div>
                </ListItem>  
            </Grid>
            <Grid item justifyContent="flex-end" >
            <Typography style={{marginTop:-5,fontSize:12,color:"#474747"}}>{id}</Typography>
            {typePartner === "Khách hàng"?<Typography style={{fontWeight:500, fontSize:14,marginTop:8, color:"green",textAlign: 'right'}}>{score}</Typography> :null}

            </Grid>
        </Grid> 

        <Divider style={{marginTop:2}} />
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
            <Toolbar>
                <Typography variant="h3" className={classes.title} style={{color:"white"}} >
                    {typePartner} {"#"} {id}
                </Typography>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
                </IconButton>
            </Toolbar>
            </AppBar>

            {typePartner === "Khách hàng"? <CustomerDetail parentProps={props}  isMini={true} />:null}
            {typePartner === "Nhân viên"? <EmployeeDetail parentProps={props}  isMini={true}/>:null}
            {typePartner === "Nhà cung cấp"? <SupplierDetail parentProps={props}  isMini={true}/>:null}
        </Dialog>
        </div>
    )
}


export const ReturnCartMiniTableRow = ({ detail, handleProductPriceChange,isCart, handleItemQuantityChange }) =>{
const classes = useStyles();
  const theme = useTheme();
  const [show, setShow] = React.useState('none');
  useEffect(() => {}, [detail]);


  const handleChangeQuantity = (newQuantity) => {
    handleItemQuantityChange(detail.id, newQuantity);
  };

  const handleChangePrice = (newPrice) => {
    handleProductPriceChange(detail.id, newPrice);
    
  };
  const info = useSelector((state) => state.info);
  const store_setting = info.store.general_configuration? JSON.parse(info.store.general_configuration): setting
  const canFixPriceSell= store_setting?.canFixPriceSell
  const activeFixPrice =  isCart?  (canFixPriceSell.status && canFixPriceSell.returnCart) :(canFixPriceSell.status && canFixPriceSell.returnImport) 

    return (
        <>
        <Typography style={{fontSize:16}} >{detail.product_code} - {detail.name} </Typography>
        <ListItem style={{margin:0,padding:0}} >  
            <Typography style={{color:"#6b6b6b", marginRight:10}} >Giá bán: </Typography>
            <Input.VNDFormat style={{ width: 70 ,color:"#6b6b6b"}} value={detail.unit_price}/>  
        </ListItem  > 
        <Typography style={{ marginBottom:-10, marginTop:10, color:"red"}} >Giá trả: </Typography>

        <ListItem style={{margin:0,padding:0}} >  
           {activeFixPrice? <Input.ThousandSeperatedInput 
                id="standard-basic" style={{maxWidth:70 }} size="small" 
                inputProps={{style: { textAlign: "right" }}} 
                defaultPrice={detail.returnPrice} 
                value={detail.returnPrice}
                onChange={e => handleChangePrice(e.target.value)}/>
           : <Input.ThousandFormat  value={detail.returnPrice} > </Input.ThousandFormat>
            }
                <ButtonQuantity quantity={detail.returnQuantity} limit={detail.quantity - detail.returned_quantity} setQuantity={handleChangeQuantity}  show={show} setShow={setShow} isReturn={true} isMini={true}/> 
        </ListItem  > 
         <Divider style={{marginTop:7}}/>
        

        </>
    )
}




export const ProductMiniTableRow = (props) =>{
    const classes = useStyles();
    const theme = useTheme(); 
    const haveDiscount = true;

    const {row, handleOpenRow, openRow } = props
    const {img, id,name ,list_price,standard_price,typePartner ,branch_quantity,min_reorder_quantity,isManageInventory} = props
    // const classes = useStyles(); 
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    function returnColor(current,min) {
        if(current >= min) {return "green"}
        else if (current <= 0) {return "red"}
        else{return "orange"}
    }
    
 
    return (
  
        <div style={{margin:15,}}>
        <Grid  container direction="row" justifyContent="space-between" 
          onClick={()=>{handleClickOpen();handleOpenRow(row.uuid)}} 
          >
            <Grid item xs={9}>
                <ListItem  style={{marginLeft:2, padding:0}}>
                 <Box
                    component="img"
                    sx={{ height: 45, width: 45, borderRadius: 10, marginRight: 15 }}
                    src={JSON.parse(row.img_urls)?.at(0) || defaultProduct}
                    />                   
                     <Grid  container direction="column"justifyContent="space-between" >
                    <Typography style={{marginTop:-7, marginBottom:10}}>{name}</Typography>
                    <Typography style={{}}>Vốn: <ThousandFormat value={standard_price}/></Typography>
                    </Grid>
                </ListItem>  
            </Grid>
            <Grid item xs={3} container direction="column"justifyContent="space-between" alignItems="flex-end" >
               {isManageInventory?  <Typography style={{marginTop:-5, textAlign: 'right',color:returnColor(branch_quantity,min_reorder_quantity)}}>Tồn: <ThousandFormat value={branch_quantity}/></Typography>
               : <Typography></Typography>}
                <Typography style={{textAlign: 'right', }}>Bán: <ThousandFormat value={list_price}/></Typography>
            </Grid>
        </Grid> 


        <Divider style={{marginTop:3}} />
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
            <Toolbar>
                <Typography variant="h3" className={classes.title} style={{color:"white"}} >
                    {typePartner} {"#"} {id}
                </Typography>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
                </IconButton>
            </Toolbar>
            </AppBar>
            <InventoryDetail parentProps={props}  openRow={openRow} isMini={true} />
        </Dialog>
        </div>
    )
}


export const CheckMiniTableRow = ({ detail, handleItemRealQuantityChange, handleDeleteItem }) =>{
    const classes = useStyles();
    const [show, setShow] = React.useState("none");
    useEffect(() => { }, [detail]);
  
    const onChangeRealQuantity = (newQuantity) => {
      handleItemRealQuantityChange(detail.id, newQuantity);
    };
 
    return (
        <>
        <ListItem  >   
                <ListItem  style={{margin:0, padding:0}}>    
                        <Box component="img" sx={{ height: 55, width: 55,  borderRadius:10,marginRight:20   }}src={detail.img_url} />
                        <div>
                            <Typography style={{fontSize:15, marginBottom:10}} >detail.name</Typography>
                           
                            <Typography style={{marginLeft:10}}>detail.branch_quantity</Typography> 
                            {/* <ThousandFormat  value={detail.branch_quantity} /> */}
                        
                        </div>
                    </ListItem  >  
                    <ListItemSecondaryAction style={{marginTop:20, marginRight:-20}}>
                         <ButtonQuantity quantity={100} setQuantity={onChangeRealQuantity}  show={show} setShow={setShow} limit={detail.quantity} isReturn={false} isMini={true}/> 
                        {/* <ButtonQuantity quantity={detail.real_quantity} setQuantity={onChangeRealQuantity}  show={show} setShow={setShow} limit={detail.quantity} isReturn={false} isMini={true}/>  */}
                    </ListItemSecondaryAction>
                
                </ListItem  >  

                {/* <ThousandFormat  value={Number(detail.real_quantity) - Number(detail.branch_quantity)} /> */}
                {/* <VNDFormat value={(Number(detail.real_quantity) - Number(detail.branch_quantity)) *
          detail.standard_price} /> */}
         <Divider style={{marginTop:7}}/>
        

        </>
    )
}






export const VarianceProductMiniTableRow = (props) =>{
    const classes = useStyles();
    const theme = useTheme(); 
   

    const {variance,onClick} = props


    function returnColor(current,min) {
        if(current >= min) {return "green"}
        else if (current <= 0) {return "red"}
        else{return "orange"}
    }
    
    return (
  
        <div style={{margin:15,}}>
        <Grid  container direction="row" justifyContent="space-between" 
          
          >
            <Grid item xs={8}>
                <ListItem  style={{marginLeft:2, padding:0}}>
                 <Box
                    component="img"
                    sx={{ height: 45, width: 45, borderRadius: 10, marginRight: 15 }}
                    src={variance.img_url}
                    />                   
                     <Grid  container direction="column"justifyContent="space-between" >
                    <Typography style={{marginTop:-7, marginBottom:10}}>{variance.name}</Typography>
                    <Typography style={{}}>Giá vốn: <ThousandFormat value={variance.standard_price}/></Typography>
                    </Grid>
                </ListItem>  
            </Grid>
            <Grid item xs={4} container direction="column"justifyContent="space-between" alignItems="flex-end" >
                <Typography style={{marginTop:-5, textAlign: 'right',color:returnColor(variance.branch_quantity,variance.min_reorder_quantity)}}>Tồn: <ThousandFormat value={variance.branch_quantity}/></Typography>
                <Typography style={{textAlign: 'right', }}>Giá bán: <ThousandFormat value={variance.list_price}/></Typography>
            </Grid>
        </Grid> 
        <Box style={{display:'flex',justifyContent:'right'}}>
        <Button style={{marginTop:10, }} size="small" color="primary" variant="outlined"
        onClick={onClick}>Chi tiết</Button>
        </Box>

        <Divider style={{marginTop:3}} />
       
        </div>
    )
}
{/* <ListItem  style={{ padding:10}}>   
<ListItem  style={{margin:0, padding:0}}>    
        <Box component="img" sx={{ height: 55, width: 55,  borderRadius:10,marginRight:20   }}src={row.img_url} />
        <div>
            <ListItem style={{margin:0,padding:0}} >    
                <Typography style={{fontSize:15, marginBottom:10}} >{row.name} </Typography>
                {haveDiscount ? 
                <img id="gift" src={require('../../assets/img/icon/giftbox.png').default} style={{height:16,width:16, marginLeft:10, marginTop:-3}} onClick={()=>setOpenDiscount(true)}/>
                :null}
                {openDiscount && <DiscountPopUp open={openDiscount} title={`Khuyến mãi trên ${row.product_code} - ${row.name}`} onClose={()=>{setOpenDiscount(false)}}/>}
            </ListItem  > 
            <ListItem style={{margin:0,padding:0}} >    
            <Input.ThousandSeperatedInput 
                id="standard-basic" style={{maxWidth:70 }} size="small" 
                inputProps={{style: { textAlign: "right" }}} 
                defaultPrice={row.unit_price} 
                value={row.unit_price} 

                onChange={e => handleChangeItemPrice(props.row.uuid, e.target.value)}/>
                <Typography style={{marginLeft:10}}>x</Typography>
            </ListItem  > 
        </div>
    </ListItem  >  
    <ListItemSecondaryAction style={{marginTop:20, marginRight:-20}}>
        <ButtonQuantity quantity={row.quantity} setQuantity={updateQuantity}  branch_quantity={row.branch_quantity} isMini={true}/> 
    </ListItemSecondaryAction>

</ListItem  >  
<Divider style={{marginTop:7}}/> */}