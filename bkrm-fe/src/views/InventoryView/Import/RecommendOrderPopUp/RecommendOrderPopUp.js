import {
    Grid,
    Card,
    Box,
    TableContainer,
    FormControlLabel,
    Switch,
    ListItem,
    TableBody,
    Typography,
    ButtonBase,
    Avatar,
    Tooltip,
    TextField,
    Button,

  } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

import React, {useState,useEffect} from 'react'
import TableRowWithSelect from "./TableRowWithSelect"
import * as _ from "lodash";

const RecommendOrderPopUp = ({dataRecommend,handleAddOrderReccomend,handleClose,store_setting,setLoadingOrderButton,cartList}) => {
    const theme = useTheme();

    useEffect(()=>{
        setLoadingOrderButton(false)
    },[])
    const choiceQuantity = store_setting?.orderLowStock.choiceQuantity
    const selectQuantity= store_setting?.orderLowStock.selectQuantity
    const selectSuplier= store_setting?.orderLowStock.selectSuplier
    
    let dataHaveNotPurchase = dataRecommend?.filter(item => item.purchase_histories?.length  === 0 )
    let dataWillProcess = dataRecommend?.filter(item => item.purchase_histories?.length  > 0 )
    
    const processDataRecommend = () =>{ 
        const noHistoryQuantity = store_setting?.orderLowStock.noHistoryQuantity
        let datawithNoHistory = dataHaveNotPurchase.map((item) =>({
            img:JSON.parse(item.img_urls)?.at(0) ,
            uuid:item.uuid,
            product_code: item.product_code,
            name: item.name,
            list_price: item.list_price,
            standard_price: item.standard_price,
            quantity: Number(noHistoryQuantity),
            // quantity: noHistoryQuantity,
            supplier:null,
            supplier_uuid:null,
            item:item
        }))
        let data =  dataWillProcess.map((item) =>{
            var orderQuantityRecommend = 0;
            var supplierRecommend = null;
            // Calculate quantity
            if(choiceQuantity === "number"){
                orderQuantityRecommend = Number(store_setting?.orderLowStock.inputQuantity)
            }   else{
                if(selectQuantity === "latest"){
                    orderQuantityRecommend = Number(item.purchase_histories[0]?.quantity)
                }else{
                    orderQuantityRecommend = parseInt(item.purchase_histories.reduce( ( p, c ) => p + c.quantity, 0 ) / item.purchase_histories.length)
                }
            }
            // Nếu là NCC lẻ thì sao
            if(selectSuplier === "latest"){
                supplierRecommend = {name:item.purchase_histories[0]?.name , supplier_uuid: item.purchase_histories[0]?.supplier_uuid}
                // supplierRecommend = item.purchase_histories[0]?.supplier_uuid
            }else{
                // manytime
                //  Nếu có 2 cái bằng nhau thì sao chọn cái gần nhất
                const occurrences =  item.purchase_histories.filter(item => item.name !== "Nhà cung cấp lẻ").reduce( (acc, o) =>  (acc[o.supplier_uuid] = (acc[o.supplier_uuid] || 0)+1 , acc) , {} );
                supplierRecommend = Object.keys(occurrences).length !== 0? Object.keys(occurrences).reduce((a, b) => occurrences[a] >= occurrences[b] ? a : b) :null 
                supplierRecommend =  item.purchase_histories?.find(purchase => purchase.supplier_uuid === supplierRecommend)
            }
            console.log("supplierRecommend",supplierRecommend)

            let row ={
                img:JSON.parse(item.img_urls)?.at(0),
                uuid:item.uuid,
                product_code: item.product_code,
                name: item.name,
                list_price: item.list_price,
                standard_price: item.standard_price,
                quantity: Number(item.reorder_quantity) - Number(item.inventory) - Number(item.ordering_quantity),
                // quantity: orderQuantityRecommend.toString(),
                supplier:supplierRecommend ?{name: supplierRecommend.name , phone:supplierRecommend.phone, supplier_uuid:supplierRecommend.supplier_uuid}:null,
                supplier_uuid:supplierRecommend?.supplier_uuid,
                item:item

            }
            // supplierRecommend?  dataWithFullData.push(row):dataWithNoSupplier.push(row) 
            return row
        })
      
        // return  [datawithNoHistory,dataWithNoSupplier,dataWithFullData]
        return [...data,...datawithNoHistory]
    }

    const [processedData, setProcessedData] = useState(null)
    useEffect(()=>{
        if(dataRecommend){  setProcessedData(processDataRecommend()) }
    },[dataRecommend])
   

    const hanđleChangeQuantity = (itemUuid, newQuantity) =>{
        let itemIndex = processedData.findIndex(
            (item) => item.uuid === itemUuid
        );
        let newProcessedData = [...processedData];
        newProcessedData[itemIndex].quantity = newQuantity;
        // setProcessedData(newProcessedData);
    }
    
    const RecommendProductGroupBySupplier = () =>{
        // let supplierGroup = processedData?  _.groupBy(processedData[2], 'supplier_uuid') :null;
        let supplierGroup = processedData?  _.groupBy(processedData.filter(data => data.supplier_uuid), 'supplier_uuid') :null;
        return (
            supplierGroup?
            Object.keys(supplierGroup).map((supplier) =>{
                let cartRowListBySupplier = supplierGroup[supplier]
                console.log("cartRowListBySupplier[0].supplier",cartRowListBySupplier[0].supplier)
                return (
                <Box style={{marginBottom:20, marginTop:10}}>
                    {/* <Typography variant='h4'>{`${cartRowListBySupplier[0].supplier.name} (${cartRowListBySupplier[0].supplier.phone})`}</Typography> */}
                    <Typography variant='h4'>{`${cartRowListBySupplier[0].supplier.name} `}</Typography>

                    <TableRowWithSelect handleAddOrderReccomend={handleAddOrderReccomend} dataRecommend={supplierGroup[supplier]} hanđleChangeQuantity={hanđleChangeQuantity} handleClose={handleClose} cartList={cartList}/>
                </Box>
                )
            })
            :null   
        )
    }
    const RecommendProductGroupWithoutSupplier = () =>{
        let data = processedData?  processedData.filter(data => !data.supplier_uuid) :null;

        return(
            data?
            <Box style={{marginBottom:20, marginTop:40}}>
                    <Typography variant='h3' style={{marginBottom:20}}>{"Chưa xác định được NCC"}</Typography>
                    <TableRowWithSelect handleAddOrderReccomend={handleAddOrderReccomend} dataRecommend={data}  hanđleChangeQuantity={hanđleChangeQuantity} handleClose={handleClose}  isNoSupplier={true} cartList={cartList}/>
                </Box>
            :null
        )
    }

    if(dataRecommend === null){
        return (
        <>
        <Typography style={{color:'#000', fontSize:15}}>
            Không có gợi ý vì không có sản phẩm nào  
        </Typography>
        <Typography style={{color:'#000', fontSize:15}}>
           trong kho đang sắp hết hàng hoặc hết hàng.
        </Typography>
        <Button variant="contained" color='primary' fullWidth style={{marginTop:20}}onClick={handleClose}>OK</Button>
        </>
        )
    }
    return (
        <>
        
        {processedData ?
            <>
                {/* <Box style={{display:'flex', justifyContent:"flex-end"}}  ><Button >Hello</Button></Box> */}
                <RecommendProductGroupBySupplier/>
                <RecommendProductGroupWithoutSupplier />

           </>
        :null} 
        </>   
      )
    
}

export default RecommendOrderPopUp