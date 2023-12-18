import React from 'react'
import useRowStyles from '../../../../components/TableCommon/style/rowStyle'
import clsx from "clsx";

import {TableCell,TableRow,Chip, Button} from '@material-ui/core';

import {FormatedStatus} from '../../../../components/TableCommon/util/format'
import InventoryOrderDetail from './InventoryOrderDetail/InventoryOrderDetail'
import {VNDFormat} from '../../../../components/TextField/NumberFormatCustom'
import { useSelector } from 'react-redux';
const TransferInventoryTableRow = (props) => {
    const { row, handleOpenRow,openRow,hidenCollumn,colorText, update} = props;

    const classes = useRowStyles();
    const info = useSelector((state) => state.info);
    const branch_id = info.branch.id;
    return (
      <>
        {/* ROW */}
        <TableRow
          onClick={() => {
            if (row.status != "closed") {
              handleOpenRow(row.code);
            }
          }}
          key={row.code}
          className={clsx(
            classes.row,
            openRow === row.code ? classes.rowClicked : null
          )}
          style={{ color: colorText }}
        >
          <TableCell align="left" style={{ color: colorText }}>
            {row.code}
          </TableCell>

          <TableCell align="left" style={{ color: colorText }}>
            <div>
              {row.from_name}
              <br />
            </div>
          </TableCell>
          <TableCell align="left" style={{ color: colorText }}>
            <div>{row.to_name}</div>
          </TableCell>

          <TableCell
            align="left"
            className={colorText ? null : classes.fontName}
            style={{ color: colorText }}
          >
            {new Date(row.created_at).toLocaleString()}
          </TableCell>
          <TableCell
            align="left"
            className={colorText ? null : classes.fontName}
            style={{ color: colorText }}
          >
            {row.received_at
              ? new Date(row.received_at).toLocaleString()
              : null}
          </TableCell>
          <TableCell
            align="left"
            className={colorText ? null : classes.fontName}
            style={{ color: colorText }}
          >
            <VNDFormat value={row.total_amount} />
          </TableCell>
          <TableCell align="left">
            {row.status === "pending" && row.to_id === info.branch.id ? (
              <Button
                size="small"
                color="primary"
                variant="outlined"
                autoCapitalize="false"
              >
                Nhập
              </Button>
            ) : (
              <Button
                size="small"
                color={row.status == "closed" ? "default" : "primary"}
                // variant="outlined"
                variant="contained"
                autoCapitalize="false"
              >
                {row.status === "closed" ? "Hoàn thành" : "Đang chuyển"}
              </Button>
            )}
          </TableCell>
        </TableRow>

        {/* DETAIL */}
        <TableRow>
          {/* colspan  => số cột trong collapse */}
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
            {/* <InventoryOrderDetail parentProps={props}/>        */}
          </TableCell>
        </TableRow>
      </>
    );
}

export default TransferInventoryTableRow
