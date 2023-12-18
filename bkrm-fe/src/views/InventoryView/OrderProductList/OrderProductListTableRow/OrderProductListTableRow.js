import React from 'react'
import useRowStyles from '../../../../components/TableCommon/style/rowStyle'
import clsx from "clsx";
import { VNDFormat,ThounsandFormat } from '../../../../components/TextField/NumberFormatCustom';
import {TableCell,TableRow} from '@material-ui/core';

import {FormatedStatusOrder} from '../../../../components/TableCommon/util/format'
import OrderProductListDetail from './OrderProductListDetail/OrderProductListDetail'
import { Typography } from '@mui/material';

const OrderProductListTableRow = (props) => {
    const { row, handleOpenRow,openRow, reload,colorText,isReport} = props;
    const classes = useRowStyles();

    console.log("rowrowrowrow",row)
    return (
        <>
        {/* ROW */}
            <TableRow
            onClick={() => handleOpenRow(row.id)}   
            key={row.id}
            className={ clsx(classes.row,(openRow === row.id) ? classes.rowClicked : null)}
            >
                <TableCell align="left"  style={{color:colorText}}>{row.customer_order_code}</TableCell>
                {/* <TableCell align="left"className={classes.fontName}>{row.created_at}</TableCell> */}
                <TableCell align="left"className={colorText?null:classes.fontName}  style={{color:colorText}}> {row.created_at?.split(" ")[0].split('-').reverse().join('/').concat("\u00a0\u00a0"+ row.created_at?.split(" ")[1].substr(0, 5)) }</TableCell>
                <TableCell align="left"className={colorText?null:classes.fontName} style={{color:colorText}}>{row.name}</TableCell>
                <TableCell align="left"  style={{color:colorText}}>{row.phone}</TableCell>
                <TableCell align="left"  style={{color:colorText}}>{row.address}{`, `}{row.ward}{`, `}{row.district}{`, `}{row.city}</TableCell>
                <TableCell align="right" className={colorText?null:classes.fontName}  style={{color:colorText}}><VNDFormat value={row.total_amount} /></TableCell>
                {isReport?null:<TableCell align="center">
                        <FormatedStatusOrder status={row.status}/>:
                </TableCell>}
                {/* <TableCell align="left">{row.address}</TableCell> */}
            </TableRow>

        {/* DETAIL */}
            <TableRow>
              {/* colspan  => số cột trong collapse */}
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>           
                    <OrderProductListDetail parentProps={props} openRow={openRow} reload={reload}/>       
              </TableCell>
       
            </TableRow>
        </>
    )
}

export default OrderProductListTableRow
