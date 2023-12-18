import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme,withStyles } from "@material-ui/core/styles";

import { TableCell, TableRow } from "@material-ui/core";
import useRowStyles from "../../../../components/TableCommon/style/rowStyle";

import { FormatedStatus } from "../../../../components/TableCommon/util/format";
import InvoiceDetail from "./InvoiceDetail/InvoiceDetail";
import { VNDFormat } from "../../../../components/TextField/NumberFormatCustom";

function InvoiceTableRow(props) {
  const { row, handleOpenRow, openRow, onReload,hidenCollumn ,colorText} = props;
  const theme = useTheme();

  const classes = useRowStyles();

  console.log("row.promotion_detail?.selectedPromotion",row.promotion_detail?.selectedPromotion)
  const promotionDiscountValue = row.promotion_detail?.selectedPromotion?.discountType ==="discountInvoice" ? row.promotion_value :0

  return (
    <>
      {/* ROW */}
      <TableRow
        onClick={() => handleOpenRow(row.uuid)}
        key={row.uuid}
        className={clsx(
          classes.row,
          openRow === row.uuid ? classes.rowClicked : null
        )}
        style={{color:colorText}}
      >
        <TableCell align="left"  style={{color:colorText}}>{row.order_code}</TableCell>
        <TableCell align="left" className={colorText?null:classes.fontName} style={{color:colorText}}>
          {/* {new Date(row.creation_date).toLocaleString()} */}
          {row.creation_date?.split(" ")[0].split('-').reverse().join('/').concat("\u00a0\u00a0"+ row.creation_date?.split(" ")[1].substr(0, 5)) }

        </TableCell>
        <TableCell
          align="left"
          style={{ minWidth: 150 }}
          style={{color:colorText}}
          // className={classes.fontName}
        >
          {row.customer_name}
        </TableCell>
        {/* <TableCell align="left">{row.branch_name}</TableCell> */}
        {/* <TableCell align="right">
          {row.payment_method === "cash" ? "Tiền mặt" : "Thẻ"}
        </TableCell> */}
        <TableCell align="right" style={{color:colorText}}>{row.total_quantity}</TableCell>

        <TableCell align="right" 
        style={{fontWeight:colorText ?null:500,color:colorText}}
        // style={{color: theme.customization.mode === "Light"? '#000': null}}
        >
          {" "}
          <VNDFormat value={Number(row.total_amount) - Number(row.discount)  - Number(promotionDiscountValue) + Number(row.other_fee_value)} />
        </TableCell>
        {hidenCollumn?.includes("debt") ?null:
        <TableCell align="center" style={{color:colorText}}>
          <FormatedStatus debt={Number(row.total_amount) - Number(row.discount)  - Number(promotionDiscountValue)+ Number(row.other_fee_value)  - Number(row.paid_amount) > 0 ? 1 : 0} />
        </TableCell> }
      </TableRow>

      {/* DETAIL */}
      <TableRow>
        {/* colspan  => số cột trong collapse */}
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <InvoiceDetail parentProps={props} />
        </TableCell>
      </TableRow>
    </>
  );
}

export default InvoiceTableRow;
