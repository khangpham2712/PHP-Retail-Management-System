import React, { useEffect, useState } from "react";
//import style
import { useTheme } from "@material-ui/core/styles";

import useStyles from "../../../../components/TableCommon/style/mainViewStyle";
//impỏrt library
import {
  ListItem,
  TableRow,
  TableCell,
  Typography,
  Grid,
} from "@material-ui/core";

//import project
import * as Input from "../../../../components/TextField/NumberFormatCustom";
import ButtonQuantity from "../../../../components/Button/ButtonQuantity";
import { VNDFormat } from "../../../../components/TextField/NumberFormatCustom";
import { useSelector } from "react-redux";
import setting from "../../../../assets/constant/setting";

export const ImportTableRowInventoryDetail = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  const {
    row,
    handleChangeItemQuantity,
    handleChangeItemPrice,
    handleUpdateBatches,
    mini,
    imageType,
    index,
    typeShow,
  } = props;
  const info = useSelector((state) => state.info);
  const [transferInventory, setTransferInventory] = useState({});
  const [rowData, setRowData] = useState(row);

  useEffect(() => {
    const transferInventory = localStorage.getItem("transferInventory");
    if (transferInventory) {
      setTransferInventory(JSON.parse(transferInventory));
    }
  }, []);

  const updateQuantity = (newQuantity) => {

    const transferDetail = transferInventory?.transfer_detail;

    // get current uantity
    const currentQuantity = transferDetail?.find(
      (item) => item.id === rowData.id
    )?.value_quantity;

    if (newQuantity >= currentQuantity) {
      return;
    }

    const newTransferDetail = transferDetail?.map((item) => {
      if (item.id === rowData.id) {
        return {
          ...item,
          receive_quantity: newQuantity,
        };
      }
      return item;
    });

    localStorage.setItem(
      "transferInventory",
      JSON.stringify({
        ...transferInventory,
        transfer_detail: newTransferDetail,
      })
    );

    setRowData({
      ...rowData,
      receive_quantity: newQuantity,
    });
  };
  return (
    <>
      <TableRow hover key={rowData.uuid}>
        <TableCell
          align="left"
          style={
            !mini ? {} : { paddingLeft: 0, paddingRight: !imageType ? 25 : 15 }
          }
        >
          {imageType ? "" : `${index}.`}
        </TableCell>

        {mini ? null : (
          <TableCell align="left">{rowData.product_code}</TableCell>
        )}

        <TableCell align="left" style={{ minWidth: 170 }} padding={"none"}>
          <ListItem
            style={{
              marginLeft: imageType ? -10 : -10,
              marginTop: -10,
              marginBottom: -10,
              padding: 0,
            }}
            alignItems="center"
          >
            <Typography style={{ paddingLeft: 20 }}>{rowData.name}</Typography>
          </ListItem>
        </TableCell>
        <TableCell align="center">{rowData.quantity}</TableCell>
        {transferInventory.from_id == info.branch.id ? (
          <TableCell align="center">--</TableCell>
        ) : (
          <TableCell align="right" padding={mini ? "none" : "normal"}>
            <ButtonQuantity
              miniCart={mini}
              quantity={rowData.receive_quantity || rowData.value_quantity}
              setQuantity={updateQuantity}
            />
          </TableCell>
        )}
        <TableCell align="center" padding={mini ? "none" : "normal"}>
          <VNDFormat value={rowData.unit_price} />
        </TableCell>
      </TableRow>
    </>
  );
};
