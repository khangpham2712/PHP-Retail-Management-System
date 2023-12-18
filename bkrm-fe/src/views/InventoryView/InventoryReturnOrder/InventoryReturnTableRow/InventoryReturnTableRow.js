import React from 'react'
import useRowStyles from '../../../../components/TableCommon/style/rowStyle'
import clsx from "clsx";

import { TableCell, TableRow } from '@material-ui/core';

import InventoryReturnDetail from './InventoryReturnDetail/InventoryReturnDetail'
import { FormatedStatus } from '../../../../components/TableCommon/util/format'
import { VNDFormat } from '../../../../components/TextField/NumberFormatCustom'

const InventoryReturnTableRow = (props) => {
    const { row, handleOpenRow, openRow,colorText } = props;
    const classes = useRowStyles();

    console.log("row",row)
    return (
        <>
            {/* ROW */}
            <TableRow
                onClick={() => handleOpenRow(row.uuid)}
                key={row.uuid}
                className={clsx(classes.row, (openRow === row.uuid) ? classes.rowClicked : null)}
                style={{color:colorText}}
            >
                <TableCell align="left" style={{color:colorText}}>{row.purchase_return_code}</TableCell>
                {/* <TableCell align="left" className={classes.fontName}>{row.creation_date}</TableCell> */}
                <TableCell align="left" className={colorText?null:classes.fontName}style={{color:colorText}}>{row.creation_date?.split(" ")[0].split('-').reverse().join('/').concat("\u00a0\u00a0"+ row.creation_date?.split(" ")[1].substr(0, 5)) }</TableCell>

                <TableCell align="left" style={{ minWidth: 150 ,color:colorText}}>{row.supplier_name}</TableCell>
                {/* <TableCell align="left">{row.branch_name}</TableCell> */}
                {/* <TableCell align="right">{row.payment_method === 'cash' ? 'Tiền mặt' : 'Thẻ'}</TableCell> */}
                <TableCell align="right" style={{color:colorText}}>{row.total_quantity}</TableCell>

                <TableCell align="right" className={colorText?null:classes.fontName}style={{color:colorText}}><VNDFormat value={row.total_amount} /></TableCell>
                {/* <TableCell align="center" className={classes.fontName}>
                    <FormatedStatus debt={row.status === 'debt' ? 1 : 0} />
                </TableCell> */}
                {/* <TableCell align="right" ></TableCell>
                <TableCell align="right" ></TableCell> */}
            </TableRow>

            {/* DETAIL */}
            <TableRow>
                {/* colspan  => số cột trong collapse */}
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <InventoryReturnDetail parentProps={props} />
                </TableCell>

            </TableRow>
        </>
    )
}

export default InventoryReturnTableRow
