import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";
import {Paper,Dialog} from "@material-ui/core";
import { styled } from "@mui/material/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import _ from "lodash"
const useStyles = makeStyles((theme) => ({
  paper: {
    border: "1px solid",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
}));

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
  height: 50,
}));

const errorHeadings = {
  name: "Tên sản phẩm",
  list_price: "Giá bán",
  standard_price: "Giá nhập",
  min_reorder_quantity: "Tồn kho tối thiểu",
  max_order: "Tồn kho tối đa",
  img_urls: "Link ảnh",
  description: "Mô tả",
  quantity_per_unit: "Đơn vị",
  bar_code: "Mã sản phẩm, barcode",
  quantity: "Tồn kho ban đầu",
  category_name: "Tên danh mục",
};

const ProductImportPopper = ({ open, loading, errors, handleClose }) => {
  const classes = useStyles();
  const [dataTable, setDataTable] = useState([]);

  const errorMessages = (error) => {
    const message = [];
    try {
      for (let errField in error) {
        message.push(`${errorHeadings[errField]}: ${error[errField]}`);
      }
      return message;
    } catch (err) {
      handleClose();
    }
  };

  useEffect(() => {
    const mappedData = [];
    console.log("IMPORT PRODUCT EXCEL ERRORS", errors);
    errors.forEach((error) => {
      mappedData.push({
        id: `Dòng ${error.row + 1}`,
        error: errorMessages(_.omit(error, "row")),
      });
    });

    setDataTable(mappedData);
  }, [errors]);

  const renderErrorCard = () => {
    return dataTable?.map((error) => (
      <div style={{ textAlign: "left", color: "red" }}>
      {/* <> */}
        <Typography style={{fontWeight:500}}>{error.id}:</Typography>
        <Typography>{error.error.join(", ")}</Typography>
        {/* </> */}
      </div>
    ));
  };

  return (
    open && (
      // <div
      //   style={{
      //     zIndex: 200,
      //     position: "fixed",
      //     top: "50%",
      //     left: "50%",
      //     marginTop: "-200px",
      //     marginLeft: "-250px",
      //   }}
      // >
      <Dialog open={open} onClose={handleClose}>
        <Paper
          elevation={3}
          style={{
            // height: 400,
            // width: 500,
            padding: 20,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <Typography variant="h6">Xử lý file excel</Typography>
            </Grid>
            <Grid item xs={2} alignContent={"flex-end"}>
              <Button onClick={handleClose}>Đóng</Button>
            </Grid>

            {/* <Grid
              container
              spacing={2}
              direction="column"
              justifyContent="center"
              alignItems="center"
              style={{ marginTop: 30 }}
            > */}
              <div style={{padding:30}}>
              {loading ? <CircularProgress /> : renderErrorCard()}
              </div>
            {/* </Grid> */}
          </Grid>
        </Paper>
        </Dialog>

    )
  );
};

export default ProductImportPopper;
