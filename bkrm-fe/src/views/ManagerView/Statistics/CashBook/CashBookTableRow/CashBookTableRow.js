import React from 'react'
import useRowStyles from '../../../../../components/TableCommon/style/rowStyle'
import clsx from "clsx";

import {TableCell,TableRow} from '@material-ui/core';

import {FormatedStatus} from '../../../../../components/TableCommon/util/format'
import CashBookDetail from './CashBookDetail/CashBookDetail'
import {VNDFormat} from '../../../../../components/TextField/NumberFormatCustom'

export const getUserType = (type) => {
    if (type === 'customer') {
        return "Khách hàng"
    }

    if (type === 'supplier') {
        return "Nhà cung cấp"
    }

    return type;
}

export const getDocType = (type) => {
    if (type === 'order') {
        return "Hóa đơn"
    }

    if (type === 'purchase_order') {
        return "Đơn nhập hàng"
    }

    if (type === 'refund') {
        return "Đơn trả"
    }

    if (type === 'purchase_return') {
        return "Đơn trả hàng nhập"
    }
    return type;
}

const CashBookTableRow = (props) => {
    const { row, handleOpenRow,openRow,hidenCollumn,colorText} = props;
    const classes = useRowStyles();

    return (
        <>
        {/* ROW */}
            <TableRow
            onClick={() => handleOpenRow(row.id)}   
            key={row.uuid}
            className={ clsx(classes.row,(openRow === row.id) ? classes.rowClicked : null)}
            style={{color:colorText}}
            >
                <TableCell align="left" style={{color:colorText}}>{row.code}</TableCell>
                {/* <TableCell align="left" >{row.creation_date}</TableCell> */}
                <TableCell align="left" className={colorText?null:classes.fontName}style={{color:colorText}}>{row.creation_date?.split(" ")[0].split('-').reverse().join('/').concat("\u00a0\u00a0"+ row.creation_date?.split(" ")[1].substr(0, 5)) }</TableCell>

                <TableCell align="left"style={{color:colorText}}>{row.value}</TableCell>
                {/* <TableCell align="left"className={classes.fontName} style={{minWidth:150}}>{row.branch_name}</TableCell> */}
                {/* <TableCell align="right">{row.payment_method === 'cash' ? 'Tiền mặt' : 'Thẻ'}</TableCell> */}
                <TableCell align="left"style={{color:colorText}}>{getUserType(row.user_type)}</TableCell>
                <TableCell align="left"style={{color:colorText}}>{row.user_name}</TableCell>
                <TableCell align="left"style={{color:colorText}}>{getDocType(row.type)}</TableCell>
            </TableRow>

        {/* DETAIL */}
            <TableRow>
              {/* colspan  => số cột trong collapse */}
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>           
                    <CashBookDetail parentProps={props}/>       
              </TableCell>
            </TableRow>
        </>
    )
}

export default CashBookTableRow
