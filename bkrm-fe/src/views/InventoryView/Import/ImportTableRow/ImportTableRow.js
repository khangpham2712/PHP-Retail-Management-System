import React, { useEffect, useState } from "react";
//import style
import { useTheme } from "@material-ui/core/styles";

import useStyles from "../../../../components/TableCommon/style/mainViewStyle";
//impỏrt library
import {
  Box,
  TextField,
  ListItem,
  IconButton,
  TableRow,
  TableCell,
  Typography,
  Chip,
  Button,
  Grid,
  Tooltip,
} from "@material-ui/core";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import DeleteForeverTwoToneIcon from '@material-ui/icons/DeleteForeverTwoTone';

import { DeleteOutline } from "@material-ui/icons";
//import project
import * as Input from "../../../../components/TextField/NumberFormatCustom";
import ButtonQuantity from "../../../../components/Button/ButtonQuantity";
import VNDInput from "../../../../components/TextField/NumberFormatCustom";
import { VNDFormat } from "../../../../components/TextField/NumberFormatCustom";
import icon from "../../../../assets/img/product/tch.jpeg";
import AddBatch from "./AddBatch";
import SelectBatch from "./SelectBatch";
import { useDispatch, useSelector } from "react-redux";
import defaultProduct from '../../../../assets/img/product/default-product.png'
import MoreInfo from "../../../../components/MoreInfo/MoreInfo"
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import setting from "../../../../assets/constant/setting"

export const ImportRow = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  const {
    row,
    // branchs,
    handleDeleteItemCart,
    handleChangeItemQuantity,
    handleChangeItemPrice,
    handleUpdateBatches,
    mini,
    imageType,
    index,
    typeShow,
    showImage,
  } = props;
  const info = useSelector((state) => state.info);
  const branch = info.branch;
  const branchs = info.store.branches;

  console.log("123123131")
  const updateQuantity = (newQuantity) => {
    handleChangeItemQuantity(row.uuid, newQuantity);
  };
  const [addBatchOpen, setAddBatchOpen] = useState(false);
  const [selectBatchOpen, setSelectBatchOpen] = useState(false);

  const [selectedBatches, setSelectedBatches] = useState([]);
  const handleSubmit = (newBatch) => {
    setSelectedBatches([
      ...selectedBatches,
      ...[{ ...newBatch, is_new: true, quantity: 0 }],
    ]);
  };

  const handleSelectBatches = (batches) => {
    const newBatches = [];
    selectedBatches.forEach((selectedBatch) => {
      const newBatch = batches.find(
        (batch) => batch.batch_code === selectedBatch.batch_code
      );
      if (newBatch) {
        newBatches.push({
          ...selectedBatch,
          additional_quantity:
            Number(selectedBatch.additional_quantity) +
            Number(newBatch.additional_quantity),
        });
      } else {
        newBatches.push(selectedBatch);
      }
    });
    batches.forEach((newBatch) => {
      if (
        !newBatches.find((batch) => newBatch.batch_code === batch.batch_code)
      ) {
        newBatches.push(newBatch);
      }
    });
    setSelectedBatches(newBatches);
  };

  useEffect(() => {
    let total = 0;
    selectedBatches.forEach((batch) => {
      total += Number(batch.additional_quantity);
    });
    console.log(total);
    updateQuantity(total);
    handleUpdateBatches(row.uuid, selectedBatches);
  }, [selectedBatches]);

  const store_setting = info.store.general_configuration
    ? JSON.parse(info.store.general_configuration)
    : setting;
  const canFixPriceSell = store_setting?.canFixPriceSell;
  const [show, setShow] = React.useState(false);

  const findBranchQuantity = (id) => {
    const rs = row.branch_inventories?.find(
      (x) => x.uuid === id
    )?.quantity_available;
    if (rs) {
      return rs;
    } else {
      return 0;
    }
  };

  console.log("imageType", imageType);
  var color =
    theme.customization.mode === "Light"
      ? typeShow === "list"
        ? "#000"
        : null
      : null;

  return (
    <>
      <TableRow
        hover
        key={props.row.uuid}
        onMouseOver={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <TableCell
          align="left"
          style={
            !mini ? {} : { paddingLeft: 0, paddingRight: !imageType ? 25 : 15 }
          }
        >
          {imageType ? "" : `${index}.`}
        </TableCell>

        {mini ? null : (
          <TableCell align="left" style={{ paddingRight: 20 }}>
            {row.product_code}
          </TableCell>
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
            {showImage ? (
              <Box
                component="img"
                sx={{
                  height: 40,
                  width: 40,
                  borderRadius: 10,
                  marginRight: 15,
                  marginTop: 12,
                  marginBottom: 12,
                }}
                src={
                  JSON.parse(row.img_urls ? row.img_urls : "[]").at(0) ||
                  defaultProduct
                }
              />
            ) : null}
            {/* <Typography>{row.name}</Typography> */}
            <Grid style={{ paddingTop: 12, paddingBottom: 12 }}>
              <Typography
                style={
                  !mini
                    ? {}
                    : { fontWeight: imageType ? 600 : null, color: color }
                }
              >
                {row.name}
              </Typography>
              {imageType ? (
                (canFixPriceSell.status && canFixPriceSell.import) ||
                info?.role === "owner" ? (
                  <Input.ThousandSeperatedInput
                    id="standard-basic"
                    style={{ width: 72 }}
                    size="small"
                    inputProps={{
                      style: { textAlign: "right", marginBottom: 5 },
                    }}
                    value={row.unit_price}
                    onChange={(e) =>
                      handleChangeItemPrice(props.row.uuid, e.target.value)
                    }
                  />
                ) : (
                  <Input.ThousandFormat value={row.unit_price}>
                    {" "}
                  </Input.ThousandFormat>
                )
              ) : null}
            </Grid>

            {show && !mini ? (
              <MoreInfo>
                {
                  branchs.length > 1 ? (
                    <>
                      <ListItem>
                        <Typography style={{ width: 180 }}></Typography>
                        <Typography style={{ fontWeight: 700 }}>Tồn</Typography>
                        <Typography style={{ fontWeight: 700, marginLeft: 10 }}>
                          Đặt
                        </Typography>
                      </ListItem>

                      {branchs.map((item) => {
                        return (
                          <ListItem>
                            <ListItem
                              style={{ width: 180, margin: 0, padding: 0 }}
                            >
                              <Typography
                                style={{ fontWeight: 700, marginRight: 10 }}
                              >
                                {item.name}
                              </Typography>
                              {item.uuid === branch.uuid ? (
                                <CheckCircleIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              ) : null}
                            </ListItem>
                            <Typography>
                              {findBranchQuantity(item.uuid)}
                            </Typography>
                            <Grid
                              justifyContent="flex-end"
                              style={{ marginLeft: 20 }}
                            >
                              {/* <Typography>
                                {
                                  row?.branch_inventories?.find(
                                    (b) => b?.uuid === item?.uuid
                                  )?.ordering_quantity
                                }
                              </Typography> */}
                            </Grid>
                          </ListItem>
                        );
                      })}
                    </>
                  ) : (
                    <Typography style={{ fontWeight: 700, color: "#000" }}>
                      {`Tồn kho:\u00a0\u00a0\u00a0  `}{" "}
                      {findBranchQuantity(branchs[0].uuid)}
                    </Typography>
                  )
                  /* <Typography style={{fontWeight:700}}> {findBranchQuantity(branchs[0].uuid)}</Typography> */
                }
              </MoreInfo>
            ) : null}
          </ListItem>
        </TableCell>
        {/* <TableCell align="left">{row.bar_code}</TableCell> */}

        {row.has_batches ? (
          <TableCell align="center" padding="none">
            {row.quantity}
          </TableCell>
        ) : (
          <TableCell
            align="left"
            padding="none"
            padding={mini ? "none" : "normal"}
          >
            <ButtonQuantity
              miniCart={mini}
              quantity={row.quantity}
              setQuantity={updateQuantity}
            />
          </TableCell>
        )}

        {imageType ? null : (
          <TableCell align="right" padding={mini ? "none" : "normal"}>
            {(canFixPriceSell.status && canFixPriceSell.import) ||
            info?.role === "owner" ? (
              <Input.ThousandSeperatedInput
                id="standard-basic"
                style={{ width: 72, marginLeft: -15 }}
                size="small"
                inputProps={{ style: { textAlign: "right" } }}
                value={row.unit_price}
                onChange={(e) =>
                  handleChangeItemPrice(props.row.uuid, e.target.value)
                }
              />
            ) : (
              <Input.ThousandFormat
                value={row.unit_price}
                style={{ marginLeft: -10 }}
              >
                {" "}
              </Input.ThousandFormat>
            )}
          </TableCell>
        )}

        <TableCell
          align="right"
          className={classes.boldText}
          padding={mini ? "none" : "normal"}
        >
          {!mini ? (
            <VNDFormat
              value={row.unit_price * row.quantity}
              style={{ color: color }}
            />
          ) : (
            <Input.ThousandFormat
              value={row.unit_price * row.quantity}
              style={{ paddingLeft: imageType ? 0 : 20, color: color }}
            />
          )}
        </TableCell>
        <TableCell align="right" padding={mini ? "none" : "normal"}>
          <IconButton
            aria-label="expand row"
            size="small"
            style={{ marginLeft: 10 }}
          >
            <DeleteForeverTwoToneIcon
              onClick={() => handleDeleteItemCart(row.uuid)}
            />
          </IconButton>
        </TableCell>
      </TableRow>
      {row.has_batches ? (
        <TableRow>
          {mini ? null : <TableCell colSpan={1}></TableCell>}
          <TableCell colSpan={10}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => setSelectBatchOpen(true)}
                style={{ marginRight: 10 }}
              >
                Chọn lô
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => setAddBatchOpen(true)}
              >
                Tạo lô
              </Button>
              {selectedBatches.map((batch) => (
                <Tooltip title={`Tồn kho - ${batch.quantity}`}>
                  <Chip
                    label={`${
                      batch?.batch_code ? batch?.batch_code : "Mới"
                    } - ${batch?.expiry_date} - ${batch.additional_quantity}`}
                    key={batch.id}
                    onDelete={() => {
                      const newBatches = selectedBatches.filter(
                        (selectedBatch) => selectedBatch.id !== batch.id
                      );
                      setSelectedBatches(newBatches);
                    }}
                    color={batch.is_new ? "primary" : "secondary"}
                    deleteIcon={<DeleteOutline />}
                    variant="outlined"
                  />
                </Tooltip>
              ))}
              {addBatchOpen && (
                <AddBatch
                  handleSubmit={handleSubmit}
                  handleClose={() => setAddBatchOpen(false)}
                  row={row}
                />
              )}
              {selectBatchOpen && (
                <SelectBatch
                  handleSubmit={handleSelectBatches}
                  row={row}
                  handleClose={() => setSelectBatchOpen(false)}
                />
              )}
            </div>
          </TableCell>
        </TableRow>
      ) : null}
    </>
  );
};
