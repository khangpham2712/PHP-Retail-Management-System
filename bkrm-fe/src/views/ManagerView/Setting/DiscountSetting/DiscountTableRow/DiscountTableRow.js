import React from 'react'
import useRowStyles from '../../../../../components/TableCommon/style/rowStyle'
import clsx from "clsx";
import { grey} from '@material-ui/core/colors'

import {TableCell,TableRow,Avatar,ListItem,Typography} from '@material-ui/core';


import {FormatedStatus} from '../../../../../components/TableCommon/util/format'
import ava from '../../../../../assets/img/product/lyimg.jpeg';
import DiscountDetail from './DiscountDetail/DiscountDetail'


const DiscountTableRow = (props) => {
    const { row, handleOpenRow,openRow} = props;
    const classes = useRowStyles();
    // const discountKey = row.promotion_condition.discountKey === "invoice" ?"Hoá đơn" :"Sản phẩm"
    const discountKey = row.discountKey === "invoice" ?"Hoá đơn" :"Sản phẩm"

    var promotion_condition ={}
    if(row.promotion_condition?.length !== 0) {promotion_condition = JSON.parse(row.promotion_condition) }
    var dateAdvanceSetting ={}
    if(row.dateAdvanceSetting?.length !== 0) {dateAdvanceSetting = row.dateAdvanceSetting?JSON.parse(row.dateAdvanceSetting) :{} }
    // const discountType = getDiscountType(promotion_condition?.discountKey,promotion_condition?.discountType )  
    const discountType = getDiscountType(row.discountKey,row.discountType )  

    const type = `${discountKey}  -  ${discountType}`  
    
    const isActive =  (startDay, endDay) =>{
        const current   = new Date() 
        // return (startDay !== "0000-00-00" ?new Date(startDay) <= current : true) && ( endDay !== "0000-00-00" ?current <= new Date(endDay) :true)
        return (startDay  ? new Date(startDay) <= current : true) && ( endDay  ?current <= new Date(endDay) :true)

    }
    return (
        <>
        {/* ROW */}
            <TableRow
            onClick={() =>{ handleOpenRow(row.id) ; }}   
            key={row.id}
            className={ clsx(classes.row,(openRow === row.id) ? classes.rowClicked : null)}
            >
                <TableCell align="left">{row.promotion_code}</TableCell>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">{row.start_date ? row.start_date?.split('-').reverse().join('/') :"- - /  - -  / - - - - "}</TableCell>
                <TableCell align="left">{row.end_date ?row.end_date?.split('-').reverse().join('/'):"Không giới hạn"}</TableCell>
                <TableCell align="left">{type}</TableCell>
                <TableCell align="left">{row.status ==='active' && isActive(row.start_date,row.end_date)? "Hoạt động" : 'Chưa hoạt động' }</TableCell>

            </TableRow>

        {/* DETAIL */}
            <TableRow>
              {/* colspan  => số cột trong collapse */}
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>           
                    <DiscountDetail parentProps={props} promotion_condition={promotion_condition}dateAdvanceSetting={dateAdvanceSetting} type={type} />       
              </TableCell>
       
            </TableRow>
        </>
    )
}

export default DiscountTableRow



function getDiscountType (discountKey, discountType){

    if(discountKey === "invoice"){
        if(discountType ==="sendGift"){return "Tặng hàng"}
        else if (discountType ==="sendVoucher"){ return "Tặng voucher"}
        else{ return "Giảm giá hoá đơn"}
    }else{
        if(discountType ==="sendGift"){return "Mua hàng tặng hàng"}
        else{return "Giá bán theo số lượng mua"}
    }
}