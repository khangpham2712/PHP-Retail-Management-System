import React from 'react'
import useRowStyles from '../../../../components/TableCommon/style/rowStyle'
import clsx from "clsx";
import { grey} from '@material-ui/core/colors'

import {TableCell,TableRow,Box,Avatar,ListItem,Typography, Chip} from '@material-ui/core';

import {FormatedStatus} from '../../../../components/TableCommon/util/format'
import SupplierDetail from './SupplierDetail/SupplierDetail'
import { VNDFormat, ThousandFormat } from '../../../../components/TextField/NumberFormatCustom';

const SupplierTableRow = (props) => {
    const { row, handleOpenRow,openRow,hidenCollumn,colorText} = props;
    const classes = useRowStyles();

    return (
        <>
        {/* ROW */}
            <TableRow
            onClick={() => handleOpenRow(row.uuid)}   
            key={row.uuid}
            className={ clsx(classes.row,(openRow === row.uuid) ? classes.rowClicked : null)}
            >
                <TableCell align="left"  style={{color:colorText}}>{row.supplier_code}</TableCell>
                <TableCell align="left" className={colorText?null:classes.fontName} style={{minWidth:150,color:colorText}}>{row.name}</TableCell>
                <TableCell align="left"  style={{color:colorText}}>{row.phone}</TableCell>
                {/* <TableCell align="left">{row.email}</TableCell> */}
                {/* <TableCell align="left" style={{minWidth:100}}>{row.address}</TableCell> */}
                {/* <TableCell align="right" >{row.total_cost}</TableCell> */}

                <TableCell align="right" className={colorText?null:classes.fontName}  style={{color:colorText}}><VNDFormat value={row.total_payment} /></TableCell> 
                <TableCell align="right"  style={{color:colorText}}>
                    <VNDFormat value={row.debt} />  
                </TableCell>
                {hidenCollumn?.includes("debtStatus") ?null:<TableCell align="center"  style={{color:colorText}}>
                    <FormatedStatus debt={row.debt}/>
                </TableCell>}
            </TableRow>

        {/* DETAIL */}
            <TableRow>
              {/* colspan  => số cột trong collapse */}
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>           
                    <SupplierDetail parentProps={props}/>       
              </TableCell>
       
            </TableRow>
        </>
    )
}

export default SupplierTableRow
