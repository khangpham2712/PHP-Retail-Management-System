import React, { useEffect, useState } from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

//import library
import {
  Box,
  Grid,
  Collapse,
  Typography,
  Button,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@material-ui/core";

//import icon
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import HighlightOffTwoToneIcon from "@material-ui/icons/HighlightOffTwoTone";
import LocalOfferTwoToneIcon from "@material-ui/icons/LocalOfferTwoTone";
import VerifiedUserTwoToneIcon from "@material-ui/icons/VerifiedUserTwoTone";
//import image
import avaUpload from "../../../../../assets/img/product/img.jpeg";
//import project
import {
  StyledMenu,
  StyledMenuItem,
} from "../../../../../components/Button/MenuButton";
import productApi from "../../../../../api/productApi";
// carousel for images
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { useDispatch, useSelector } from "react-redux";
import UpdateInventory from "./UpdateInventory/UpdateInventory";
import ConfirmPopUp from "../../../../../components/ConfirmPopUp/ConfirmPopUp";
import { statusAction } from "../../../../../store/slice/statusSlice";
import { ThousandFormat, VNDFormat } from "../../../../../components/TextField/NumberFormatCustom";
import { TableCell, TableRow, Avatar, ListItem, Chip } from "@material-ui/core";
import clsx from "clsx";

import { FormatedProductStatus } from "../../../../../components/TableCommon/util/format";
import VarianceModal from "./VarianceModal";
import { VarianceProductMiniTableRow } from "../../../../../components/MiniTableRow/MiniTableRow";
import branchApi from "../../../../../api/branchApi";

import defaultProduct from "../../../../../assets/img/product/default-product.png"
import BranchInventoryPopUp from "./BranchInventoryPopUp";
import PrintBarcodePopUp from "./PrintBarcodePopUp"
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .MuiTextField-root": {
        marginTop: theme.spacing(2),
      },
    },
    headerTitle: {
      fontSize: "1.125rem",
    },
    typo: {
      marginBottom: 20,
    },
  })
);

const UploadImage = () => {
  return (
    <Box
      component="img"
      sx={{
        height: 170,
        width: 170,
        borderRadius: 2,
        marginLeft: 15,
      }}
      src={avaUpload}
    />
  );
};
const InventoryDetail = (props) => {
  const { row, openRow, setReload ,isManageInventory} = props.parentProps;
  const { isMini } = props;
  const theme = useTheme();
  const classes = useStyles(theme);
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [thisReload, setThisReload] = useState(false);
  const dispatch = useDispatch();


  const [productDetail, setProductDetail] = useState({
    name: "",
    bar_code: "",
    category: { name: "" },
    images: [],
    suppliers: [],
  });

  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const handleCloseDelete = () => {
    setDeleteConfirm(false);
  };
  const handleConfirmDelete = async () => {
    handleCloseDelete();
    try {
      const response = await productApi.deleteProduct(store_uuid, row.uuid);
      dispatch(statusAction.successfulStatus("Xóa thành công"));
      setReload();
      // console.log(response);
    } catch (error) {
      // console.log(error);
      dispatch(statusAction.failedStatus("Xóa thất bại"));
    }
  };
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const branchs = info.store.branches
 
  // const [branchs, setBranchs] = useState(info.branchsOfStore);

  const [isOpenVarianceDetailModal, setIsOpenVariaceDetailModal] =
    useState(false);
  const [selectedVariance, setSelectedVariance] = useState({});
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productApi.getProduct(store_uuid, row.uuid, {
          branch_uuid: branch_uuid,
        });
        setProductDetail(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (openRow === row.uuid) {
      fetchProduct();
    }
  }, [store_uuid, openRow, thisReload]);
  const handleCloseUpdate = (status) => {
    setIsOpenUpdate(false);
  };


const [openPrintBarcode,setOpenPrintBarcode] =  useState(false)

  const [openDetailInventory ,setOpenDetailInventory] =  useState(false)
console.log("productDetail.img_urls",productDetail)

let  imageList =row.img_urls ? JSON.parse(row.img_urls):null
imageList = Array.isArray(imageList)? imageList :[imageList]
// || defaultProduct
  return row.has_variance ? (
    <>
      {openRow === row.uuid &&
        productDetail.variations?.map((variance) => {
          return !xsScreen ? (
            <>
              <TableRow>
                <TableCell align="left">{"               "}</TableCell>
                <TableCell align="left">{variance.product_code}</TableCell>
                <TableCell align="left" style={{ minWidth: 200 }}>
                  <ListItem
                    style={{
                      marginLeft: -30,
                      marginTop: -10,
                      marginBottom: -10,
                    }}
                  >
                    <Box
                      component="img"
                      sx={{
                        height: 50,
                        width: 50,
                        borderRadius: 10,
                        marginRight: 15,
                      }}
                      src={JSON.parse(row.img_urls ? row.img_urls : "[]").at(0) || defaultProduct}
                    />
                    <Typography className={classes.fontName}>
                      {variance.name}
                    </Typography>
                  </ListItem>
                </TableCell>


                <TableCell align="left">{variance.category?.name}</TableCell>
                <TableCell align="right">
                  <VNDFormat value={variance.list_price} />
                </TableCell>
                <TableCell align="right">
                  <VNDFormat value={variance.standard_price} />
                </TableCell>
                <TableCell align="center">
                  <FormatedProductStatus
                    quantity={variance.branch_quantity}
                    lowStock={variance.min_reorder_quantity}
                  />
                </TableCell>
                <TableCell align="right" className={classes.fontName}>
                  {variance.branch_quantity}
                </TableCell>
                <TableCell
                  onClick={() => {
                    setIsOpenVariaceDetailModal(true);
                    setSelectedVariance(variance);
                  }}
                >
                  <Button size="small" color="primary" variant="outlined" >
                    Chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            </>
          ) : (
            <VarianceProductMiniTableRow
              key={row.uuid}
              variance={variance}
              onClick={() => {
                setIsOpenVariaceDetailModal(true);
                setSelectedVariance(variance);
              }}
            />
          );
        })}
      {isOpenVarianceDetailModal && (
        <VarianceModal
          open={isOpenVarianceDetailModal}
          parentProps={props.parentProps}
          row={selectedVariance}
          handleClose={() => setIsOpenVariaceDetailModal(false)}
          branchs={branchs}
          // handleBranchQuantity={()=>{setOpenDetailInventory(true); console.log("helllllooo")}}
          setReload={() => {
            setReload();
            setThisReload(!thisReload);
          }}
         batches={row.batches}
         has_batches={row.has_batches}
         isManageInventory={isManageInventory}
        />
      )}
    </>
  ) : (
    <Collapse
      in={isMini ? true : openRow === row.uuid}
      timeout="auto"
      unmountOnExit
    >
      {isOpenUpdate && (
        <UpdateInventory
          handleClose={handleCloseUpdate}
          open={isOpenUpdate}
          productInfo={productDetail}
          setReload={() => {
            setReload();
            setThisReload(!thisReload);
          }}
          isManageInventory={isManageInventory}
        />
      )}
      <ConfirmPopUp
        open={deleteConfirm}
        handleConfirm={handleConfirmDelete}
        handleClose={handleCloseDelete}
        message={
          <Typography>
            Xóa vĩnh viễn sản phẩm <b>{productDetail.name} ?</b>
          </Typography>
        }
      />
      <Box margin={1}>
        <Typography
          variant="h3"
          gutterBottom
          component="div"
          className={classes.typo}
        >
          {row.name}
        </Typography>

        <Grid container direction="row" justifyContent="flex-start">
          <Grid item xs={12} sm={4}>
      
           {imageList.at(0) ?
            <Box
              sx={{
                // height: 170,
                // width: 170,
                height: xsScreen ? 100 : 170,
                width: xsScreen ? 100 : 170,
                borderRadius: 2,
                marginLeft: 15,
                marginBottom: xsScreen ? 10 : 0,
              }}
            >
              <Carousel showThumbs={false}>
                { 
                imageList?.map((url) => (
                  <img
                    key={url}
                    src={url}
                    height={xsScreen ? "100" : "170"}
                    width={xsScreen ? "100" : "170"}
                    // height= "170"
                    // width= "170"
                  />
                ))}
              </Carousel>
            </Box>:
              <Box
                    component="img"
                    sx={{
                    height: xsScreen ? 100 : 170,
                    width: xsScreen ? 100 : 170,
                    marginLeft: 7,
                    marginRight: 7,
                    borderRadius: 20,
                    }}
                    src={defaultProduct}
                    style={{marginBottom:20}}
                />}
          </Grid>

          <Grid container direction="column" item xs={12} sm={8}>
            <Grid container direction="row">
              <Grid item xs={12} sm={6}>
                <Grid container direction="row" justifyContent="flex-start">
                  <Grid item xs={4} sm={6}>
                    <Typography variant="h5" gutterBottom component="div">
                      Tên sản phẩm
                    </Typography>
                  </Grid>
                  <Grid item sm={6}>
                    <Typography variant="body1" gutterBottom component="div">
                      {productDetail.name}{" "}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container direction="row" justifyContent="flex-start">
                  <Grid item xs={4} sm={6}>
                    <Typography variant="h5" gutterBottom component="div">
                      Mã sản phẩm
                    </Typography>
                  </Grid>
                  <Grid item sm={6}>
                    <Typography variant="body1" gutterBottom component="div">
                      {productDetail.product_code}{" "}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container direction="row" justifyContent="flex-start">
                  <Grid item xs={4} sm={6}>
                    <Typography variant="h5" gutterBottom component="div">
                      Mã vạch
                    </Typography>
                  </Grid>
                  <Grid item sm={6}>
                    <Typography variant="body1" gutterBottom component="div">
                      {productDetail.bar_code}{" "}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container direction="row" justifyContent="flex-start">
                  <Grid item xs={4} sm={6}>
                    <Typography variant="h5" gutterBottom component="div">
                      Danh mục
                    </Typography>
                  </Grid>
                  <Grid item sm={6}>
                    <Typography variant="body1" gutterBottom component="div">
                      {productDetail.category.name}{" "}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container direction="row" justifyContent="flex-start">
                  <Grid item xs={4} sm={6}>
                    <Typography variant="h5" gutterBottom component="div">
                      Đơn vị
                    </Typography>
                  </Grid>
                  <Grid ListItemText sm={6}>
                    <Typography variant="body1" gutterBottom component="div">
                      {productDetail.quantity_per_unit}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid container direction="row" justifyContent="flex-start">
                  <Grid item xs={4} sm={4}>
                    <Typography variant="h5" gutterBottom component="div">
                      Giá bán
                    </Typography>
                  </Grid>
                  <Grid item sm={6}>
                    <Typography variant="body1" gutterBottom component="div">
                      <VNDFormat value={productDetail.list_price}></VNDFormat>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container direction="row" justifyContent="flex-start">
                  <Grid item xs={4} sm={4}>
                    <Typography variant="h5" gutterBottom component="div">
                      Giá vốn
                    </Typography>
                  </Grid>
                  <Grid item sm={6}>
                    <Typography variant="body1" gutterBottom component="div">
                      <VNDFormat
                        value={productDetail.standard_price}
                      ></VNDFormat>{" "}
                    </Typography>
                  </Grid>
                </Grid>
                {isManageInventory?
                <>
                <Grid container direction="row" justifyContent="flex-start" alignItems='center'>
                  <Grid item xs={4} sm={4}>
                    <Typography variant="h5" gutterBottom component="div">
                      Tồn kho
                    </Typography>
                  </Grid>
                  <Grid item sm={2}>
                    {/* <Typography variant="body1" gutterBottom component="div">
                      {row.branch_quantity}{" "}
                    </Typography> */}
                    <ThousandFormat value={row.branch_quantity} />
                  </Grid>
                  {branchs.length >1 || row.has_batches?
                   <Grid item sm={4} style={{marginTop:-5, marginBottom:5}}>
                      <Button size='small' variant='contained'color='primary' style={{textTransform:'none'}} onClick={()=>setOpenDetailInventory(true)}> Chi tiết</Button>
                  </Grid>:null}
                  {openDetailInventory?
                  <BranchInventoryPopUp 
                    branch_inventories={row.branch_inventories}branchs={branchs}open={openDetailInventory}
                    onClose={()=>setOpenDetailInventory(false)}
                    setReload={() => {
                      setReload();
                      setThisReload(!thisReload);
                     }}
                     batches={row.batches}
                     has_batches={row.has_batches}
                     row={row}
                   />
                   
                   :null}
                </Grid>
                {row.has_batches ? <Typography variant='h6' style={{color:theme.customization.primaryColor[500]}}>* Sản phẩm quản lý theo lô *</Typography>:null}
                {row.has_batches ? <Typography variant='h6' style={{color:theme.customization.primaryColor[500], marginBottom:10}}>Thông báo hết HSD trước {row.notification_period} ngày</Typography>:null}

                <Grid container direction="row" justifyContent="flex-start">
                  <Grid item xs={4} sm={6}>
                    <Typography variant="h5" gutterBottom component="div">
                      SL đặt hàng lại
                    </Typography>
                  </Grid>
                  <Grid item sm={6}>

                    {/* <Typography variant="body1" gutterBottom component="div">
                      {row.min_reorder_quantity}{" "}
                    </Typography> */}
                    <ThousandFormat value={row.min_reorder_quantity} />

                  </Grid>
                </Grid>

                <Grid container direction="row" justifyContent="flex-start">
                  <Grid item xs={4} sm={7}>
                    <Typography variant="h5" gutterBottom component="div">
                      SL nhập hàng tối đa
                    </Typography>
                  </Grid>
                  <Grid item sm={5}>

                    {/* <Typography variant="body1" gutterBottom component="div">
                      {row.max_order}{" "}
                    </Typography> */}
                    <ThousandFormat value={row.max_order} />

                  </Grid>
                </Grid>
                </>:null
                }
              </Grid>
            </Grid>

            <Grid
              container
              direction="row"
              justifyContent={"flex-end"}
              style={{ marginTop: 20 }}
            >
              <Button
                variant="contained"
                size="small"
                style={{ marginLeft: 15 }}
                onClick={() => {
                  setIsOpenUpdate(true);
                }}
              >
                Sửa
              </Button>
              <Button
                variant="contained"
                size="small"
                style={{ marginLeft: 15 }}
                onClick={() => {
                  setDeleteConfirm(true);
                }}
              >
                Xoá
              </Button>

              {openPrintBarcode?
                  <PrintBarcodePopUp
                    open={openPrintBarcode}
                    onClose={()=>setOpenPrintBarcode(false)}
                    row={row}
                   />
                   
                   :null}

              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
                size="small"
                style={{ marginLeft: 10 }}
              >
                <MoreVertIcon />
              </IconButton>

              <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <StyledMenuItem onClick={() => { setOpenPrintBarcode(true) }}>
                  <ListItemIcon style={{ marginRight: -15 }}>
                    <InboxIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="In mã tem" />
                </StyledMenuItem>

                <StyledMenuItem>
                  <ListItemIcon style={{ marginRight: -15 }}>
                    <HighlightOffTwoToneIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Ngừng kinh doanh" />
                </StyledMenuItem>

                {/* <StyledMenuItem>
                  <ListItemIcon style={{ marginRight: -15 }}>
                    <LocalOfferTwoToneIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Lịch sử giá" />
                </StyledMenuItem>

                <StyledMenuItem>
                  <ListItemIcon style={{ marginRight: -15 }}>
                    <VerifiedUserTwoToneIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Lịch sử kiểm kê" />
                </StyledMenuItem> */}
              </StyledMenu>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Collapse>
  );
};

export default InventoryDetail;
