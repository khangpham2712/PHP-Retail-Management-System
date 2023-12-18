import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import useRowStyles from "../../../../components/TableCommon/style/rowStyle";
import clsx from "clsx";
import { grey } from "@material-ui/core/colors";
import {
  TableCell,
  TableRow,
  Box,
  Avatar,
  ListItem,
  Typography,
  Chip,
} from "@material-ui/core";
import EmployeeDetail from "./EmployeeDetail/EmployeeDetail";

import ava from "../../../../assets/img/product/lyimg.jpeg";

const EmployeeTableRow = (props) => {
  const { row, handleOpenRow, openRow, handleReload,hidenCollumn,colorText } = props;
  const classes = useRowStyles();
  console.log("row",row)

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
      >
        <TableCell align="left" style={{color:colorText}}>{row.employee_code}</TableCell>
        <TableCell align="left" style={{ minWidth: 200 ,color:colorText}}>
          <ListItem
            style={{ margin:0,paddingLeft:0, paddingRight:0, marginTop: -10, marginBottom: -10 }}
          >
            {hidenCollumn?.includes("image") ?null: <Avatar
              alt={row.name}
              src={row.img_url}
              style={{ marginRight: 20 }}
              className={classes.ava}
            />}
            <Typography className={colorText?null:classes.fontName} style={{color:colorText}}>{row.name}</Typography>
          </ListItem>
        </TableCell>

        <TableCell align="left"style={{color:colorText}}>{row.phone}</TableCell>
        <TableCell align="left" style={{color:colorText}}>{row.email}</TableCell>
        {/* <TableCell align="left">{row.permissions.map((permission) => permission.description)}</TableCell> */}
        <TableCell align="left"  style={{color:colorText}}>{row.status === 'active' ? 'Kích hoạt' : 'Ngưng hoạt động'}</TableCell>
      </TableRow>

      {/* DETAIL */}
      <TableRow>
        {/* colspan  => số cột trong collapse */}
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, }} colSpan={8}>
          <EmployeeDetail parentProps={props}  handleReload={handleReload}/>
        </TableCell>
      </TableRow>
    </>
  );
};

export default EmployeeTableRow;
