import React, { useEffect, useState } from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
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
import { VNDFormat } from "../../../../../components/TextField/NumberFormatCustom";
import { TableCell, TableRow, Avatar, ListItem, Chip } from "@material-ui/core";
import clsx from "clsx";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { FormatedProductStatus } from "../../../../../components/TableCommon/util/format";
import ModalWrapperWithClose from "../../../../../components/Modal/ModalWrapperWithClose";
import DialogWrapper from "../../../../../components/Modal/DialogWrapper";
import BranchInventoryPopUp from "./BranchInventoryPopUp";
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
const VarianceModal = (props) => {
  const { row ,branchs,setReload,batches,has_batches,isManageInventory} = props;

  const theme = useTheme();
  const classes = useStyles(theme);
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const [anchorEl, setAnchorEl] = useState(null);
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
  const handleCloseUpdate = (status) => {
    if (status) {
      props.parentProps.setReload(true);
    }
    setIsOpenUpdate(false);
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
      props.parentProps.setReload(true);
    } catch (error) {
      console.log(error);
      dispatch(statusAction.failedStatus("Xóa thất bại"));
    }
  };
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;

  console.log("rowwww",row)
  console.log("productDetail",productDetail)
  
  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     try {
  //       const response = await productApi.getProduct(store_uuid, row.uuid, {
  //         branch_uuid: branch_uuid,
  //       });
  //       setProductDetail(response.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   fetchProduct();
  // }, [store_uuid]);
    
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

    fetchProduct();
  }, []);

  const [openDetailInventory ,setOpenDetailInventory] =  useState(false)

  console.log("row.branch_inventories",productDetail.branch_inventories)

  return (
    // <ModalWrapperWithClose
    // handleClose={() => props.handleClose(false)}
    // title={"Chi tiết biến thể"}
    // open={props.open}
    // >
    <DialogWrapper
      handleClose={() => props.handleClose(false)}
      title={"Chi tiết biến thể"}
      open={props.open}
    >
      <div style={{ width: 800 }}>
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
              <Box
                sx={{
                  height: 170,
                  width: 170,
                  borderRadius: 2,
                  marginLeft: 15,
                }}
              >
                <Carousel showThumbs={false}>
                  {JSON.parse(
                    productDetail.img_urls ? productDetail.img_urls : "[]"
                  )?.map((url) => (
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
              </Box>
            </Grid>

            <Grid container direction="column" item xs={8}>
              <Grid container direction="row">
                <Grid item xs={12} sm={6}>
                  <Grid container direction="row" justifyContent="flex-start">
                    <Grid item xs={3} sm={6}>
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
                    <Grid item xs={3} sm={6}>
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
                    <Grid item xs={3} sm={6}>
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
                    <Grid item xs={3} sm={6}>
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
                    <Grid item xs={3} sm={6}>
                      <Typography variant="h5" gutterBottom component="div">
                        Đơn vị
                      </Typography>
                    </Grid>
                    <Grid item sm={6}>
                      <Typography variant="body1" gutterBottom component="div">
                        {productDetail.quantity_per_unit}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container direction="row" justifyContent="flex-start">
                    <Grid item xs={3} sm={6}>
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
                    <Grid item xs={3} sm={6}>
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
                  <Grid container direction="row" justifyContent="flex-start">
                    <Grid item xs={3} sm={6}>
                      <Typography variant="h5" gutterBottom component="div">
                        Tồn kho
                      </Typography>
                    </Grid>
                    <Grid item sm={2}>
                      <Typography variant="body1" gutterBottom component="div">
                        {row.branch_quantity}{" "}
                      </Typography>
                    </Grid>
                    {branchs.length >1?
                   <Grid item sm={4} style={{marginTop:-5, marginBottom:5}}>
                      <Button size='small' variant='contained'color='primary' style={{textTransform:'none'}} onClick={()=>setOpenDetailInventory(true)}> Chi tiết</Button>
                  </Grid>:null}
                  {openDetailInventory?
                  <BranchInventoryPopUp 
                    branch_inventories={productDetail.branch_inventories}branchs={branchs}open={openDetailInventory}
                    onClose={()=>setOpenDetailInventory(false)}
                    setReload={setReload}
                    batches={batches}
                    has_batches={productDetail.has_batches}
                   />
                   
                   :null}
                 
                  </Grid>
                  {productDetail.has_batches ? <Typography variant='h6' style={{color:theme.customization.primaryColor[500]}}>* Sản phẩm quản lý theo lô *</Typography>:null}
                {productDetail.has_batches ? <Typography variant='h6' style={{color:theme.customization.primaryColor[500], marginBottom:10}}>Thông báo hết HSD trước {productDetail.notification_period} ngày</Typography>:null}


                  <Grid container direction="row" justifyContent="flex-start">
                    <Grid item xs={3} sm={6}>
                      <Typography variant="h5" gutterBottom component="div">
                        SL đặt hàng lại
                      </Typography>
                    </Grid>
                    <Grid item sm={6}>
                      <Typography variant="body1" gutterBottom component="div">
                        {row.min_reorder_quantity}{" "}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container direction="row" justifyContent="flex-start">
                    <Grid item xs={3} sm={6}>
                      <Typography variant="h5" gutterBottom component="div">
                        SL nhập hàng tối đa
                      </Typography>
                    </Grid>
                    <Grid item sm={6}>
                      <Typography variant="body1" gutterBottom component="div">
                        {row.max_order}{" "}
                      </Typography>
                    </Grid>
                  </Grid>
                    </>:null}
                </Grid>
              </Grid>

              {JSON.parse(row.attribute_value ? row.attribute_value : "[]").map(
                (attVal) => (
                  <Grid container direction="row">
                    <Grid item xs={3} sm={6}>
                      <div
                        style={{
                          border: "2px solid #eee",
                          textAlign: "center",
                          padding: "5px 0",
                          marginRight: 10,
                          borderRadius: 5,
                        }}
                      >
                        {attVal.name}
                      </div>
                    </Grid>
                    <Grid item xs={3} sm={6}>
                      <div
                        style={{
                          border: "2px solid #eee",
                          textAlign: "center",
                          padding: "5px 0",
                          borderRadius: 5,
                        }}
                      >
                        <strong>{attVal.value}</strong>
                      </div>
                    </Grid>
                  </Grid>
                )
              )}

              <Grid
                container
                direction="row"
                justifyContent={xsScreen ? null : "flex-end"}
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
                  <StyledMenuItem>
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

                  <StyledMenuItem>
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
                  </StyledMenuItem>
                </StyledMenu>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </div>
      {isOpenUpdate && <UpdateInventory
        open={isOpenUpdate}
        handleClose={handleCloseUpdate}
        productInfo={productDetail}
        setReload={() => {
          props.setReload();
          props.handleClose()
        }}
      />}
      <ConfirmPopUp
        open={deleteConfirm}
        handleClose={handleCloseDelete}
        handleConfirm={handleConfirmDelete}
        message={
          <Typography>
            Xóa vĩnh viễn sản phẩm <b>{productDetail.name} ?</b>
          </Typography>
        }
      />
    </DialogWrapper>
    /* </ModalWrapperWithClose> */
  );
};

export default VarianceModal;
