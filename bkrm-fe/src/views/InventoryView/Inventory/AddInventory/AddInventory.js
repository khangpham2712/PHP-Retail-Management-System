import React, { useState, useEffect, useRef } from "react";
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
  FormControlLabel,
  Switch,
  Collapse,
  Paper,
  Card,
  CardHeader,
  Checkbox,
  ListItem
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
//import project
import VNDInput, {
  ThousandSeperatedInput,
} from "../../../../components/TextField/NumberFormatCustom";
// import img
import avaUpload from "../../../../assets/img/product/default-product.png";
import barcodeIcon from "../../../../assets/img/icon/barcode1.png";
import AddCategory from "./AddCategory";
import useStyles from "./styles";
import productApi from "../../../../api/productApi";

import { useDispatch, useSelector } from "react-redux";
import SearchWithAutoComplete from "../../../../components/SearchBar/SearchWithAutoComplete";
import { urltoFile } from "../../../../api/helper";
import { statusAction } from "../../../../store/slice/statusSlice";
import { infoActions } from "../../../../store/slice/infoSlice";
import SearchIcon from "@material-ui/icons/Search";
import { FormatedImage } from "../../../../components/SearchBar/SearchProduct";
import { useFormik } from "formik";
import * as Yup from "yup";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import TagsInput from "../../../../components/TextField/TagsInput";
import AddAttribute from "./AddAttribute";
import RelaltedItemList from "./RelaltedItemList";
import SnackBarGeneral from "../../../../components/SnackBar/SnackBarGeneral";
import CategorySelect from "../../../../components/Category/CategorySelect";
import setting from "../../../../assets/constant/setting"
import ReactQuill, {Quill} from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
// import Tree from "../../../../components/Select/Tree"
import { TreeSelect } from 'antd';
import { StepBackwardOutlined } from "@ant-design/icons";
import { DownCircleTwoTone } from '@ant-design/icons'


import 'antd/dist/antd.css';
// import "../../../../index.css"
const { SHOW_PARENT } = TreeSelect;

Quill.register('modules/imageResize', ImageResize);


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

const AddInventory = (props) => {
  const { handleClose, open } = props;
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const handleCloseCategory = () => setOpenAddCategory(false);
  const [categoryList, setCategoryList] = useState([]);

  const [images, setImages] = useState([]);
  const [display, setDisplay] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const addImageHandler = (e) => {
   try{
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
   }catch(err) {
     console.log(err)
   }
  };

  const [description, setDescription] = useState('');

  const productFormik = useFormik({
    initialValues: {
      name: "",
      barcode: "",
      importedPrice: 0,
      salesPrice: 0,
      category: "",
      unit: "",
      re_order_point: 0,
      product_code: "",
      has_batches: false,
      quantity:0,
      max_order:999999999,
      description:"",
      notification_period:7,

    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nhập tên sản phẩm "),
      importedPrice: Yup.number()
        // .moreThan(0, "Giá vốn phải lớn hơn không"),
        .moreThan(-1, "Giá vốn không được âm"),

      salesPrice: Yup.number()
        .moreThan(-1, "Giá bán phải lớn hơn không"),

      re_order_point: Yup.number("Phải là một số").moreThan(
        -1,
        "Số lượng đặt hàng lại không được âm"
      ),

      quantity: Yup.number().moreThan(-1, "Tồn kho ban đầu không được âm"),

      max_order: Yup.number().moreThan(-1, "Số lượng nhập hàng tối đa không được âm"),
      notification_period: Yup.number().moreThan(-1, "Số ngày không được âm"),
    }),
  });

  const [openSnack, setOpenSnack] = React.useState(false);
  const [snackStatus, setSnackStatus] = React.useState({
    style: "error",
    message: "Tên thuộc tính trống",
  });

  // redux
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const dispatch = useDispatch();
  // dispatch(infoActions.setStore({...info.store, general_configuration: "{\"inventory\":{\"status\":true},\"recommendedProduct\":{\"status\":true},\"variation\":{\"status\":true},\"expiryDate\":{\"status\":true},\"customerScore\":{\"status\":false,\"value\":10000,\"exceptDiscountProduct\":false,\"exceptDiscountInvoice\":false,\"exceptVoucher\":false},\"email\":{\"status\":false,\"emailAddress\":\"\",\"password\":\"\"},\"notifyDebt\":{\"status\":true,\"checkDebtAmount\":true,\"debtAmount\":\"500000\",\"checkNumberOfDay\":false,\"numberOfDay\":\"15\",\"typeDebtDay\":\"firstDebt\",\"canNotContinueBuy\":false,\"canNotContinueDebt\":false},\"returnLimit\":{\"status\":false,\"day\":7},\"canFixPriceSell\":{\"status\":false,\"cart\":false,\"import\":true,\"returnCart\":true,\"returnImport\":true},\"printReceiptWhenSell\":{\"status\":true,\"cart\":true,\"import\":false,\"returnCart\":false,\"returnImport\":false,\"order\":false,\"checkInventroy\":false},\"discount\":{\"status\":true,\"applyMultiple\":false,\"applyOnline\":true},\"voucher\":{\"status\":true},\"delivery\":{\"status\":true},\"vat\":{\"status\":false,\"listCost\":[{\"key\":\"1\",\"costName\":\"\",\"value\":0,\"type\":\"%\"}]},\"orderLowStock\":{\"status\":true,\"choiceQuantity\":\"select\",\"selectQuantity\":\"latest\",\"inputQuantity\":10,\"selectSuplier\":\"latest\"},\"autoApplyDiscount\":{\"status\":true}}"}));

  const theme = useTheme();
  const classes = useStyles(theme);
  const addProductHandler = async () => {
    handleCloseAndReset();
    try {
      var bodyFormData = new FormData();
      bodyFormData.append("name", productFormik.values.name.toString());
      bodyFormData.append(
        "list_price",
        productFormik.values.salesPrice.toString()
      );
      bodyFormData.append(
        "standard_price",
        productFormik.values.importedPrice.toString()
      );
      bodyFormData.append("bar_code", productFormik.values.barcode.toString());
      bodyFormData.append(
        "product_code",
        productFormik.values.product_code.toString()
      );
      bodyFormData.append(
        "quantity_per_unit",
        productFormik.values.unit ? productFormik.values.unit.toString() :"Cái"
      );
      bodyFormData.append(
        "min_reorder_quantity",
        productFormik.values.re_order_point.toString()
      );

      bodyFormData.append(
        "max_order",
        productFormik.values.max_order.toString()
      );

      bodyFormData.append(
        "quantity",
        productFormik.values.quantity
          ? productFormik.values.quantity.toString()
          : 0
      );
      bodyFormData.append(
        "category_uuid",
        productFormik.values.category.toString()
      );
      bodyFormData.append(
        "has_batches",
        Number(productFormik.values.has_batches)
      );
      bodyFormData.append(
        "description",
        productFormik.values.description.toString()
        // JSON.stringify(datas)
      );
      bodyFormData.append(
        "notification_period",
        productFormik.values.notification_period.toString()
        // JSON.stringify(datas)
      );

      bodyFormData.append("branch_uuid", branch_uuid);
      bodyFormData.append("img_url", imageURL);

      images.forEach((image) => bodyFormData.append("images[]", image));

      await productApi.createProduct(store_uuid, bodyFormData);
      dispatch(statusAction.successfulStatus("Tạo sản phẩm thành công"));
      props.setReload();
    } catch (error) {
      console.log(error);
      dispatch(statusAction.failedStatus("Tạo sản phẩm thất bại"));
    }
  };

  const [reset, setReset] = useState(true);
  const onReset = () => {
    setReset((reset) => !reset);
  };
  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const response = await productApi.getNestedCategory(store_uuid);
        setCategoryList(response.data);
        productFormik.setFieldValue("category", response.data[0].uuid);
      } catch (error) {
        console.log(error);
        return [];
      }
    };
    fetchCategoryList();
  }, [store_uuid, reset]);

  const selectSampleProductHandler = (product) => {
    if (product && product.name) {
      try {
        productFormik.setFieldValue("name", product.name, true);
        productFormik.setFieldValue("barcode", product.bar_code, true);
        clearAllImages();
        setDisplay([{ link: product.img_url, isUrl: true }]);
        setImages([]);
        setImageURL(product.img_url);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const searchSampleProductHandler = async (searchKey) => {
    return productApi.searchDefaultProducts(searchKey, 1);
  };
  const handleCloseAndReset = () => {
    handleClose();
    productFormik.resetForm();
    clearAllImages();
  };
  const clearAllImages = () => {
    setDisplay([]);
    setImages([]);
    setImageURL("");
  };
  const clearImage = (displayImage) => {
    setDisplay(display.filter((img) => img != displayImage));
    if (displayImage.isUrl) {
      setImageURL("");
    } else {
      setImages(images.filter((image, index) => index !== displayImage.index));
    }
  };
  const renderNameInput = (params) => {
    return (
      <TextField
        {...params}
        required
        label="Tìm kiếm sp mẫu bằng tên hoặc mã vạch"
        variant="outlined"
        fullWidth
        autoFocus
        size="small"
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Box
                component="img"
                sx={{ height: 23, width: 23, marginRight: -30 }}
                src={barcodeIcon}
              />
            </InputAdornment>
          ),
          onKeyDown: (e) => {
            if (e.key.toLowerCase() === "arrowdown") {
              onFocus(salesPriceRef);
            }
          },
        }}
      />
    );
  };
  const renderOptionTest = (option) => {
    return (
      <Grid fullWidth container direction="row">
        <Grid item xs={3}>
          <FormatedImage url={option.img_url} />
        </Grid>
        <Grid item xs={9} container direction="column">
          <Typography variant="h5">{option.name}</Typography>
          <Typography variant="body2">{option.bar_code}</Typography>
        </Grid>
      </Grid>
    );
  };
  const getOptionLabel = (option) => {
    if (option.name) {
      return option.name + " " + "(" + option.bar_code + ")";
    }
    return option;
  };
  const salesPriceRef = useRef();
  const onFocus = (ref) => {
    ref.current.focus();
  };

  //ATTRIBUTE
  // api get all attribute
  const attributeList = [
    { id: "1", name: "MÀU" },
    { id: "2", name: "KÍCH THƯỚC" },
    { id: "3", name: "CHẤT LIỆU" },
    { id: "4", name: "VỊ" },
    { id: "5", name: "BỘ NHỚ" },
  ];
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const [expandedDescription, setExpandedDescription] = React.useState(false);
  const handleExpandedDescription = () => {
    setExpandedDescription(!expandedDescription);
  };
  //Lô, HSD
  const [outOfDate, setOutOfDate] = React.useState("false");

  // Attr
  const [datas, setDatas] = useState([{ key: "unset", items: [] }]);

  // {name:e,product_code:"", bar_code: "",standard_price:0, unit_price :0}
  const [relatedList, setRelatedList] = useState([]);
  // const [attrOfProduct, setAttrOfProduct] = useState([]);

  // console.log("relatedList",relatedList)

  const handleAddProductWithVariation = async () => {
    if (relatedList.length !== 0) {
      // var isValid = datas.map(item => item.key === 'unset'?  false  )
      for (let i = 0; i < datas.length; i++) {
        if (datas[i].key === "unset") {
          setOpenSnack(true);
          setSnackStatus({ style: "error", message: "Tên thuộc tính trống" });
          return;
        }
      }
    }
    handleCloseAndReset();
    try {
      var bodyFormData = new FormData();
      bodyFormData.append("name", productFormik.values.name.toString());
      bodyFormData.append(
        "list_price",
        productFormik.values.salesPrice.toString()
      );
      bodyFormData.append(
        "standard_price",
        productFormik.values.importedPrice.toString()
      );
      bodyFormData.append("bar_code", productFormik.values.barcode.toString());
      bodyFormData.append(
        "product_code",
        productFormik.values.product_code.toString()
      );
      bodyFormData.append(
        "quantity_per_unit",
        productFormik.values.unit.toString()
      );
      bodyFormData.append(
        "min_reorder_quantity",
        productFormik.values.re_order_point.toString()
      );

      bodyFormData.append(
        "max_order",
        productFormik.values.max_order.toString()
      );

      bodyFormData.append(
        "category_uuid",
        productFormik.values.category.toString()
      );
      bodyFormData.append(
        "has_batches",
        Number(productFormik.values.has_batches)
      );
      bodyFormData.append(
        "description",
        productFormik.values.description.toString()
        // JSON.stringify(productFormik.values.description)
      );
       bodyFormData.append(
        "notification_period",
        productFormik.values.notification_period.toString()
        // JSON.stringify(productFormik.values.description)
      );

      
      bodyFormData.append("branch_uuid", branch_uuid);
      bodyFormData.append("quantity", 0);
      for (var i = 0; i < relatedList.length; i++) {
        const values = relatedList[i].name.split("-");
        const attributeValues = [];
        const attrOfProduct = datas.map((item) => item.key);
        attrOfProduct.forEach((att, index) => {
          if (values[index])
            attributeValues.push({
              // name: att.name,
              name: att,
              value: values[index],
            });
        });
        bodyFormData.append(
          "variations[]",
          JSON.stringify({
            ...relatedList[i],
            attribute_value: JSON.stringify(attributeValues),
          })
        );
      }
      bodyFormData.append(
        "attribute_value",
        JSON.stringify(datas)
      );

      bodyFormData.append("img_url", imageURL);

      images.forEach((image) => bodyFormData.append("images[]", image));

      await productApi.addProductWithVaration(store_uuid, bodyFormData);
      dispatch(statusAction.successfulStatus("Tạo sản phẩm thành công"));
      // handleClose();
      props.setReload(true);
    } catch (error) {
      console.log(error);
      dispatch(statusAction.failedStatus("Tạo sản phẩm thất bại"));
    }
  };

  const [value, setValue] = useState(null)

  const store_setting = info.store.general_configuration? JSON.parse(info.store.general_configuration): setting

return (
    <Dialog
      open={open}
      onClose={handleCloseAndReset}
      aria-labelledby="form-dialog-title"
      maxWidth="md"
    >
     
      
      <Box className={classes.root}>
        <AddCategory
          open={openAddCategory}
          handleClose={handleCloseCategory}
          onReset={onReset}
        />
        <SnackBarGeneral
          handleClose={() => setOpenSnack(false)}
          open={openSnack}
          status={snackStatus}
        />
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          style={{ marginBottom: 20 }}
        >
          <Typography className={classes.headerTitle} variant="h5">
            Thêm sản phẩm
          </Typography>
          <Box style={{ width: "70%" }}>
            {store_setting?.recommendedProduct
              .status ? (
              <SearchWithAutoComplete
                handleDefaultSelect={selectSampleProductHandler}
                onSelect={selectSampleProductHandler}
                searchApiCall={searchSampleProductHandler}
                renderInput={renderNameInput}
                getOptionLabel={getOptionLabel}
                renderOption={renderOptionTest}
                filterOptions={(options, state) => options}
              />
            ) : null}
          </Box>
        </Box>
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
            {/* <TextField
              label="Mã sản phẩm (tự động)"
              variant="outlined"
              fullWidth
              size="small"
              className={classes.margin}
              name="product_code"
              onChange={productFormik.handleChange}
              value={productFormik.values.product_code}
            /> */}
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
                {/* <InputLabel htmlFor="category">Danh mục</InputLabel> */}
                {/* <Select
                  native
                  label="Danh mục"
                  id="category"
                  name="category"
                  value={productFormik.values.category}
                  onChange={productFormik.handleChange}
                  onBlur={productFormik.handleBlur}
                >
                  <CategorySelect categoryList={categoryList}/>
                </Select> */}
                <TreeSelect
                      id="category"
                      name="category"  
                      style={{ width: '100%'}}   
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto',zIndex:100000000  }}
                      treeData={categoryList}
                      value={productFormik.values.category}
                      onChange={(val)=>productFormik.setFieldValue("category",val )}
                      treeDefaultExpandAll
                      onBlur={productFormik.handleBlur}
                      
                    />
                    
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
              inputRef={salesPriceRef}
              value={productFormik.values.salesPrice}
              // onChange={productFormik.handleChange}
              onChange={(e) => {
                // productFormik.handleChange
                productFormik.setFieldValue("salesPrice", e.target.value);
                if (relatedList.length !== 0) {
                  var list = [...relatedList];
                  list = relatedList.map(
                    (i) => (i.list_price = e.target.value)
                  );
                  // list = relatedList.map(e =>({name:e,product_code:"", bar_code: "",standard_price:productFormik.values.importedPrice, list_price :value}))
                  // setRelatedList(list)
                }
              }}
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
              // onChange={productFormik.handleChange}
              onChange={(e) => {
                // productFormik.handleChange
                productFormik.setFieldValue("importedPrice", e.target.value);
                if (relatedList.length !== 0) {
                  var list = [...relatedList];
                  list = relatedList.map(
                    (i) => (i.standard_price = e.target.value)
                  );
                  // list = relatedList.map(e =>({name:e,product_code:"", bar_code: "",standard_price:productFormik.values.importedPrice, list_price :value}))
                  // setRelatedList(list)
                }
              }}
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
            {/* {Number(productFormik.values.importedPrice) >
            Number(productFormik.values.salesPrice) ? (
              <Typography variant="h6" style={{ color: "red" }}>
                {" "}
                Giá vốn đang lớn hơn giá bán !!
              </Typography>
            ) : null} */}
            {store_setting?.inventory.status ?
            <>
            <ThousandSeperatedInput
              label="Tồn kho ban đầu"
              variant="outlined"
              fullWidth
              size="small"
              className={classes.margin}
              name="quantity"
              value={productFormik.values.quantity}
              // onChange={productFormik.handleChange}
              onChange={(e) => {
                // productFormik.handleChange
                productFormik.setFieldValue("quantity", e.target.value);
                if (relatedList.length !== 0) {
                  var list = [...relatedList];
                  list = relatedList.map(
                    (i) => (i.quantity = e.target.value)
                  );
                  // list = relatedList.map(e =>({name:e,product_code:"", bar_code: "",standard_price:productFormik.values.importedPrice, list_price :value}))
                  // setRelatedList(list)
                }
              }}
              error={
                productFormik.touched.quantity && productFormik.errors.quantity
              }
              helperText={
                productFormik.touched.quantity
                  ? productFormik.errors.quantity
                  : null
              }
              onBlur={productFormik.handleBlur}
            />

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
        <Grid container spacing={2}>
          <Grid item xs>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              style={{ marginTop: 10, marginBottom:20 }}
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
                disabled={display.length > 5 ? true : false}
                color="primary"
                size="medium"
                component="label"
              >
                <input type="file" hidden onChange={addImageHandler} />
                <AddIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        {/* {store_setting?.expiryDate.status  ? ( */}

        {store_setting?.expiryDate.status  &&store_setting?.inventory.status ? (
          // <div style={{ flexGrow: 1, textAlign: "right" , alignItems:'center'}}>
             <Grid container alignItems="center" justifyContent='flex-end'>
            {productFormik.values.has_batches?
            < >
             <Typography>Thông báo trước khi hết HSD </Typography>
             <ThousandSeperatedInput
            //  label="Thông báo trước khi hết HSD"
              // variant="outlined"
              // fullWidth
              size="small"
             style={{marginRight:10}}
              name="notification_period"
              value={productFormik.values.notification_period}
              onChange={productFormik.handleChange}
              error={
                productFormik.touched.notification_period &&
                productFormik.errors.notification_period
              }
              helperText={
                productFormik.touched.notification_period
                  ? productFormik.errors.notification_period
                  : null
              }
              onBlur={productFormik.handleBlur}
             />
            <Typography style={{marginRight:10}}>ngày </Typography>
          </>
        
             :null

        }
        
            <FormControlLabel
              control={
                <Checkbox
                  //checked={outOfDate}
                  name="has_batches"
                  checked={productFormik.values.has_batches}
                  onChange={productFormik.handleChange}
                  //onChange={(event) => setOutOfDate(event.target.checked)}
                />
              }
              label="Lô, hạn sử dụng"
            />
   </Grid>
          /* </div> */
        ) : null}

        {store_setting?.variation.status ? (
          <>
            <Card className={classes.attrCard} >
              <CardHeader
                onClick={handleExpandClick}
                action={
                  <IconButton
                    size="small"
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                }
                title="Thuộc tính"
                className={classes.attrHead}
              />
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <AddAttribute
                  attributeList={attributeList}
                  datas={datas}
                  setDatas={setDatas}
                  setRelatedList={setRelatedList}
                  list_price={productFormik.values.salesPrice}
                  standard_price={productFormik.values.importedPrice}
                  // attrOfProduct={attrOfProduct}
                  // setAttrOfProduct={setAttrOfProduct}
                />
              </Collapse>
            </Card>
            {/* GENERATE LIST */}
            {relatedList.length > 0 ? (
              <Card className={classes.attrCard}>
                <CardHeader
                  title="Danh sách hàng cùng loại"
                  className={classes.attrHead}
                />
                {/*  !!!! Handle value phần này */}
                <RelaltedItemList
                  relatedList={relatedList}
                  setRelatedList={setRelatedList}
                  isManageInventory = {store_setting?.inventory.status}
                />
              </Card>
            ) : null}
          </>

        ) : null}


      {/* MÔ TẢ */}
      <Card className={classes.attrCard}>
          <CardHeader
            onClick={handleExpandedDescription}
            action={ <IconButton size="small" className={clsx(classes.expand, {  [classes.expandOpen]: expandedDescription, })}  onClick={handleExpandedDescription} aria-expanded={expanded} >  <ExpandMoreIcon /> </IconButton> }
            title="Mô tả"
            className={classes.attrHead}
          />
          <Collapse in={expandedDescription} timeout="auto" unmountOnExit style={{padding:0}}>
              <ReactQuill theme="snow" name="description"value={productFormik.values.description} onChange={(val) => productFormik.setFieldValue("description",val)}  modules={modules} formats={formats}  placeholder={'Write something...'} />
          </Collapse>


        </Card>
        {/* <div>
        <Tree />
        </div> */}

        {/* Button */}
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
              if (relatedList.length) {
                handleAddProductWithVariation();
              } else {
                addProductHandler();
              }
            }}
            variant="contained"
            size="small"
            color="primary"
            disabled={
              !(
                productFormik.isValid 
                // &&
                // Object.keys(productFormik.touched).length > 0
              ) ||
              Number(productFormik.values.importedPrice) >
                Number(productFormik.values.salesPrice)
            }
          >
            Thêm
          </Button>
        </Grid>
      </Box>
     
    </Dialog>
  
  );
};

export default AddInventory;


const modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'color':[]}],
    [{'background':[]}],
    [{'list': 'ordered'}, {'list': 'bullet'}, 
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean'],
    
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
  imageResize: {
    parchment: Quill.import('parchment'),
    modules: ['Resize', 'DisplaySize','Toolbar']
 }
}


const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video','color','background'
]

