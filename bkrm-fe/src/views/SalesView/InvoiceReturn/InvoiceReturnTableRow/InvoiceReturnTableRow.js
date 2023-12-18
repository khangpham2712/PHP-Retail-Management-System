import React from 'react';
import clsx from 'clsx';

import { TableCell, TableRow } from '@material-ui/core';
import useRowStyles from '../../../../components/TableCommon/style/rowStyle';

import InvoiceReturnDetail from './InvoiceReturnDetail/InvoiceReturnDetail';
import { VNDFormat } from '../../../../components/TextField/NumberFormatCustom';

function InvoiceReturnTableRow(props) {
  const { row, handleOpenRow, openRow,colorText } = props;
  const classes = useRowStyles();
  return (
    <>
      {/* ROW */}
      <TableRow
        onClick={() => handleOpenRow(row.uuid)}
        key={row.uuid}
        className={clsx(classes.row, (openRow === row.uuid) ? classes.rowClicked : null)}
        style={{color:colorText}}
      >
        <TableCell align="left" style={{color:colorText}}>{row.refund_code}</TableCell>
        {/* <TableCell align="left" className={classes.fontName}>{row.created_at}</TableCell> */}
        <TableCell align="left" className={colorText?null:classes.fontName} style={{color:colorText}}>{row.created_at?.split(" ")[0].split('-').reverse().join('/').concat("\u00a0\u00a0"+ row.created_at?.split(" ")[1].substr(0, 5)) }</TableCell>

        <TableCell align="left" style={{ minWidth: 100,color:colorText }} >{row.customer_name}</TableCell>
        {/* <TableCell align="left">{row.branch_name}</TableCell> */}
        {/* <TableCell align="right">{row.payment_method === 'cash' ? 'Tiền mặt' : 'Thẻ'}</TableCell> */}
        <TableCell align="right" style={{color:colorText}}>{row.total_quantity}</TableCell>

        <TableCell align="right" className={colorText?null:classes.fontName}style={{color:colorText}} ><VNDFormat value={row.total_amount}/></TableCell>
        {/* <TableCell align="right" ></TableCell>
        <TableCell align="right" ></TableCell> */}
        
      </TableRow>

      {/* DETAIL */}
      <TableRow>
        {/* colspan  => số cột trong collapse */}
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <InvoiceReturnDetail parentProps={props}/>
        </TableCell>

      </TableRow>
    </>
  );
}

export default InvoiceReturnTableRow;
