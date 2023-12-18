import React from 'react'
import useRowStyles from '../../../../components/TableCommon/style/rowStyle'
import clsx from "clsx";

import {TableCell,TableRow} from '@material-ui/core';

import {FormatedStatus} from '../../../../components/TableCommon/util/format'
import InventoryOrderDetail from './InventoryOrderDetail/InventoryOrderDetail'
import {VNDFormat} from '../../../../components/TextField/NumberFormatCustom'
import {Tag} from 'antd'
const InventoryOrderTableRow = (props) => {
    const { row, handleOpenRow,openRow,hidenCollumn,colorText} = props;
    const classes = useRowStyles();

    return (
        <>
        {/* ROW */}
            <TableRow
            onClick={() => handleOpenRow(row.uuid)}   
            key={row.uuid}
            className={ clsx(classes.row,(openRow === row.uuid) ? classes.rowClicked : null)}
            style={{color:colorText}}
            >
                <TableCell align="left" style={{color:colorText}}>{row.purchase_order_code}</TableCell>
                {/* <TableCell align="left" >{row.creation_date}</TableCell> */}
                <TableCell align="left" className={colorText?null:classes.fontName}style={{color:colorText}}>{row.creation_date?.split(" ")[0].split('-').reverse().join('/').concat("\u00a0\u00a0"+ row.creation_date?.split(" ")[1].substr(0, 5)) }</TableCell>

                <TableCell align="left"style={{color:colorText}}>{row.supplier_name}</TableCell>
                {/* <TableCell align="left"className={classes.fontName} style={{minWidth:150}}>{row.branch_name}</TableCell> */}
                {/* <TableCell align="right">{row.payment_method === 'cash' ? 'Tiền mặt' : 'Thẻ'}</TableCell> */}
                <TableCell align="right"style={{color:colorText}}>{row.total_quantity}</TableCell>

                <TableCell align="right" className={colorText?null:classes.fontName}style={{color:colorText}}><VNDFormat value={row.total_amount  -row.discount}/></TableCell>
                {hidenCollumn?.includes("debt") ?null:<TableCell align="center" className={classes.fontName}>
                    <FormatedStatus isImported={row.is_imported} debt={Number(row.total_amount) - Number( row.discount)  - Number(row.paid_amount) > 0 ? 1 : 0}/>
                </TableCell>}
               {/* {row.is_imported ? <Tag color="error">Chưa nhập</Tag> : <Tag color="cyan">Nhập đủ</Tag>} */}
            </TableRow>

        {/* DETAIL */}
            <TableRow>
              {/* colspan  => số cột trong collapse */}
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>           
                    <InventoryOrderDetail parentProps={props}/>       
              </TableCell>
            </TableRow>
        </>
    )
}

export default InventoryOrderTableRow
