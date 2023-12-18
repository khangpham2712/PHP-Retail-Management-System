import React, { useState, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
//import library
import {
  Button,
  TextField,
  Typography,
  Grid,
  Box,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Tooltip,
  Dialog,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
//import project
import VNDInput , { ThousandSeperatedInput }from "../../../../../../components/TextField/NumberFormatCustom";
// import img
import avaUpload from "../../../../../../assets/img/product/default-product.png";
import barcodeIcon from "../../../../../../assets/img/icon/barcode1.png";
import AddCategory from "../../../Category/Category";
import useStyles from "./styles";
import productApi from "../../../../../../api/productApi";
import { useDispatch, useSelector } from "react-redux";
import { statusAction } from "../../../../../../store/slice/statusSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import CategorySelect from "../../../../../../components/Category/CategorySelect";
const UploadImages = (img) => {
  return (
    <Box
      component="img"
      sx={{
        height: 70,
        width: 70,
        marginLeft: 7,
        marginRight: 7,
        borderRadius: 2,
      }}
      src={avaUpload}
    />
  );
};
const UpdateInventory = (props) => {
  const dispatch = useDispatch();
  const { handleClose, open,isManageInventory } = props;
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const handleCloseCategory = () => setOpenAddCategory(false);
  const [categoryList, setCategoryList] = useState([]);
  const [images, setImages] = useState([]);
  const [display, setDisplay] = useState([]);
  useEffect(()=>{
    const displayList = JSON.parse(props.productInfo.img_urls ? props.productInfo.img_urls : "[]").map((img) => ({link:img,isUrl: true}))
    setDisplay(displayList)
  },[props.productInfo.images])
  const addImageHandler = (e) => {
    console.log(e.target.files[0]);
    console.log(URL.createObjectURL(e.target.files[0]));
    setImages([...images, e.target.files[0]]);
    setDisplay([
      ...display,
      {
        index: images.length,
        link: URL.createObjectURL(e.target.files[0]),
        isUrl: false,
      },
    ]);
  };
  const productFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: props.productInfo.name,
      barcode: props.productInfo.bar_code ? props.productInfo.bar_code : '',
      importedPrice: props.productInfo.standard_price || 0,
      salesPrice: props.productInfo.list_price || 0,
      category: props.productInfo.category.uuid || "Mặc định",
      unit: props.productInfo.quantity_per_unit || '',
      re_order_point: props.productInfo.min_reorder_quantity || 0,
      product_code: props.productInfo.product_code || '',
      max_order:props.productInfo.max_order || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nhập tên sản phẩm "),
      importedPrice: Yup.number().required("Nhập giá vốn").moreThan(-1, "Giá vốn không được âm"),
      salesPrice: Yup.number().required("Nhập giá bán").moreThan(-1, "Giá bán không được âm"),
      re_order_point: Yup.number("Phải là một số").moreThan(-1, "Số lượng đặt hàng lại không được âm"),
      max_order: Yup.number().moreThan(-1, "Số lượng nhập hàng tối đa không được âm"),
    }),
  })
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;

  const theme = useTheme();
  const classes = useStyles(theme);
  const updateProductHandler = async () => {
    handleCloseAndReset();
    try {
      var bodyFormData = new FormData();
      bodyFormData.append("name", productFormik.values.name.toString());
      bodyFormData.append("list_price", productFormik.values.salesPrice.toString());
      bodyFormData.append("standard_price",productFormik.values.importedPrice.toString());
      bodyFormData.append("bar_code", productFormik.values.barcode.toString());
      bodyFormData.append("product_code", productFormik.values.product_code.toString());
      bodyFormData.append("quantity_per_unit", productFormik.values.unit.toString());
      bodyFormData.append(
        "min_reorder_quantity",
        productFormik.values.re_order_point.toString()
      );

      bodyFormData.append(
        "category_uuid",
        productFormik.values.category.toString()
      );
      const img_url = display.reduce((prev,cur) =>{
        if(cur.isUrl){
          return prev.concat(cur.link,",")
        }
        return prev
      },"")
      bodyFormData.append("img_urls", img_url);

      images.forEach((image) => bodyFormData.append("images[]", image));
      const response = await productApi.updateProduct(
        store_uuid,
        props.productInfo.uuid,
        bodyFormData
      );
      dispatch(statusAction.successfulStatus("Sửa sản phẩm thành công"));
      props.setReload();
    } catch (error) {
      console.log(error)
      dispatch(statusAction.failedStatus("Sửa thất bại"));
    }
  };
  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const response = await productApi.getNestedCategory(store_uuid);
        setCategoryList(response.data);
      } catch (error) {
        console.log(error);
        return [];
      }
    };
    fetchCategoryList();
  }, [store_uuid, props.productInfo]);
  
  const handleCloseAndReset = () => {
    handleClose();
    productFormik.resetForm()
    clearAllImages();
  };
  const clearAllImages = () => {
    setDisplay([]);
    setImages([]);
  };
  const clearImage = (displayImage) => {
    setDisplay(display.filter((img) => img != displayImage));
    if (!displayImage.isUrl) {
      setImages(images.filter((image, index) => index !== displayImage.index));
    }
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <AddCategory open={openAddCategory} handleClose={handleCloseCategory} />
      <Box className={classes.root}>
        <Typography
          className={classes.headerTitle}
          variant="h5"
          gutterBottom
          style={{ marginBottom: 20 }}
        >
          Chỉnh sửa sản phẩm
        </Typography>
        <Grid
          container
          direction="row"
          justifyContent="space-around"
          spacing={2}
        >
          <Grid item sm={7} xs={12}>
            <TextField
              required
              label="Tên sản phẩm"
              variant="outlined"
              fullWidth
              size="small"
              name="name"
              onChange={productFormik.handleChange}
              value={productFormik.values.name}
              error={productFormik.touched.name && productFormik.errors.name}
              helperText={
                productFormik.touched.name ? productFormik.errors.name : null
              }
              onBlur={productFormik.handleBlur}
              type="text"
            />
            <TextField
              label="Mã vạch"
              variant="outlined"
              fullWidth
              size="small"
              name="barcode"
              onKeyDown={(e) => {}}
              onChange={productFormik.handleChange}
              value={productFormik.values.barcode}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Box
                      component="img"
                      sx={{ height: 25, width: 25 }}
                      src={barcodeIcon}
                    />
                  </InputAdornment>
                ),
              }}
              className={classes.margin}
            />
            <TextField
              label="Đơn vị"
              variant="outlined"
              fullWidth
              size="small"
              className={classes.margin}
              name="unit"
              onChange={productFormik.handleChange}
              value={productFormik.values.unit}
            />

            <Box className={`${classes.box} ${classes.margin}`}>
              <FormControl required size="small" variant="outlined" fullWidth>
                <InputLabel htmlFor="category">Danh mục</InputLabel>
                <Select
                  native
                  label="Danh mục"
                  id="category"
                  name="category"
                  value={productFormik.values.category}
                  onChange={productFormik.handleChange}
                  onBlur={productFormik.handleBlur}
                >
                  <CategorySelect categoryList={categoryList}/>
                </Select>
              </FormControl>
              <Tooltip title="Thêm danh mục">
                <IconButton
                  size="small"
                  style={{ marginLeft: 5 }}
                  onClick={() => setOpenAddCategory(true)}
                >
                  <AddIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
          <Grid item sm={5} xs={12}>
            <VNDInput
              required
              label="Giá bán"
              variant="outlined"
              fullWidth
              size="small"
              name="salesPrice"
              value={productFormik.values.salesPrice}
              onChange={productFormik.handleChange}
              error={
                productFormik.touched.salesPrice &&
                productFormik.errors.salesPrice
              }
              helperText={
                productFormik.touched.salesPrice
                  ? productFormik.errors.salesPrice
                  : null
              }
              onBlur={productFormik.handleBlur}
            />
            <VNDInput
              required
              label="Giá vốn"
              variant="outlined"
              fullWidth
              size="small"
              name="importedPrice"
              value={productFormik.values.importedPrice}
              onChange={productFormik.handleChange}
              error={
                productFormik.touched.importedPrice &&
                productFormik.errors.importedPrice
              }
              helperText={
                productFormik.touched.importedPrice
                  ? productFormik.errors.importedPrice
                  : null
              }
              onBlur={productFormik.handleBlur}
              className={classes.margin}
            />
            {/* {Number(productFormik.values.importedPrice) > Number(productFormik.values.salesPrice) ?<Typography variant='h6' style={{color:'red'}}> Giá vốn đang lớn hơn giá bán !!</Typography>:null} */}

           {isManageInventory?
           <>
            <ThousandSeperatedInput
              label="Số lượng đặt hàng lại"
              variant="outlined"
              fullWidth
              size="small"
              className={classes.margin}
              name="re_order_point"
              value={productFormik.values.re_order_point}
              onChange={productFormik.handleChange}
              error={
                productFormik.touched.re_order_point &&
                productFormik.errors.re_order_point
              }
              helperText={
                productFormik.touched.re_order_point
                  ? productFormik.errors.re_order_point
                  : null
              }
              onBlur={productFormik.handleBlur}
            />
             <ThousandSeperatedInput
              label="Số lượng nhập hàng tối đa"
              variant="outlined"
              fullWidth
              size="small"
              className={classes.margin}
              name="max_order"
              value={productFormik.values.max_order}
              onChange={productFormik.handleChange}
              error={
                productFormik.touched.max_order &&
                productFormik.errors.max_order
              }
              helperText={
                productFormik.touched.max_order
                  ? productFormik.errors.max_order
                  : null
              }
              onBlur={productFormik.handleBlur}
            />

            </>:null}
          </Grid>
        </Grid>
        <Grid container spacing={2}>          <Grid item xs>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              style={{ marginTop: 10 }}
            >
              {display.map((img) => (
                <Tooltip title="Xóa tất cả hình ảnh">
                  <Button size="small" onClick={() => clearImage(img)}>
                    <Box
                      component="img"
                      sx={{
                        height: 70,
                        width: 70,
                        marginLeft: 7,
                        marginRight: 7,
                        borderRadius: 2,
                      }}
                      src={img.link}
                    />
                  </Button>
                </Tooltip>
              ))}
              {display.length === 0 ? <UploadImages /> : null}
              <IconButton
                disabled={display.length > 3 ? true : false}
                color="primary"
                size="medium"
                component="label"
              >
                <input type="file" hidden onChange={addImageHandler} />
                <AddIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={handleCloseAndReset}
              variant="contained"
              size="small"
              color="secondary"
              style={{ marginRight: 20 }}
            >
              Huỷ
            </Button>
            <Button
              onClick={() => {
                updateProductHandler();
              }}
              variant="contained"
              size="small"
              color="primary"
              disabled = {!(productFormik.isValid ) }
            >
              Sửa
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
};

export default UpdateInventory;
