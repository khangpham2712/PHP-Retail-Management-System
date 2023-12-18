import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Tooltip,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  useTheme,
  withStyles,
  makeStyles,
  createStyles,
} from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { grey } from "@material-ui/core/colors";

// import img
import icon from "../../assets/img/product/img.jpeg";
import barcodeIcon from "../../assets/img/icon/barcode_grey.png";

import InventoryData from "../../assets/JsonData/inventory.json";
import productApi from "../../api/productApi";
import { useSelector } from "react-redux";
import { render } from "sass";
import { VNDFormat } from "../TextField/NumberFormatCustom";
import defaultProduct from "../../assets/img/product/default-product.png"
import setting from "../../assets/constant/setting"
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { removeAccents } from "../../utils";

const useStyles = makeStyles((theme) =>
  createStyles({
    input: {
      borderRadius: "20px",
    },
  })
);

export const CustomTextField = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderRadius: 14,
      },
    },
  },
})(TextField);

export const FormatedImage = (props) => {
  return (
    <Box component="img" sx={{height: 53, width: 53,  borderRadius: 10, marginRight: 15, }} src={props.url} />

  );
};

const SearchProduct = (props) => {
  const {isFilter, setProducts } =props
  const theme = useTheme();
  const classes = useStyles(theme);
  const [selectedOption, setSelectedOption] = useState({});
  const [options, setOptions] = React.useState([]);

  // redux
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const store_setting = info.store.general_configuration? JSON.parse(info.store.general_configuration): setting

  const [allProduct, setAllProduct] =  useState([]);
  useEffect(()=>{
    if (isFilter && window.localStorage.getItem("products")) {
      const products = JSON.parse(window.localStorage.getItem("products"));
      if (products.store_uuid === store_uuid && products.branch_uuid === branch_uuid ) {
        setAllProduct(products.data);
      }
    }
  },[])

  const renderOption = (option) => {
    // console.log("option",option)
    //display value in Popper elements
    return (
      <Grid
        fullWidth
        container
        direction="row"
      >
        <Grid item xs={3}>
          <FormatedImage url={JSON.parse(option.img_urls ? option.img_urls : "[]").at(0) || defaultProduct} />
        </Grid>
        <Grid item xs={9} container direction="column">
          <Typography variant="h5">{`#${option.product_code}`}</Typography>
          <Typography variant="h5">{option.name}</Typography>
          <Grid container item direction="row" justifyContent="space-between">
           
        
            <Typography variant="body2">
            { store_setting?.inventory.status? `Tồn kho: ${option.branch_quantity}`  :null}
            </Typography>
         
           {props.isCart? 
           <Typography variant="body2">
           Giá bán: <VNDFormat value={option.list_price}></VNDFormat>
         </Typography>:null} 
         {!props.isCart? 
            <Typography variant="body2">
              Giá nhập: <VNDFormat value={option.standard_price}></VNDFormat>
            </Typography>:null} 
           
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const renderInput = (params) => (
    <CustomTextField
      {...params}
      id="autoValue"
      fullWidth
      placeholder="Tìm sản phẩm (mã sp, tên)"
      variant="outlined"
      size="small"
      InputProps={{
        ...params.InputProps,
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon style={{ color: grey[500] }} />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <Box
              component="img"
              sx={{ height: 23, width: 23 }}
              src={barcodeIcon}
            />
          </InputAdornment>
        ),

        style: {
          padding: " 10px",
        },
      }}
    />
  );


  const filter = createFilterOptions({
    stringify: option => `${option.product_code} - ${removeAccents(option.name)}  - ${option.bar_code}`,
  });
  const getOptionLabel = (option) => {
    // return option.name ? `${option.name}-${option.bar_code}-${option.product_code}` : ""
    // return option.name ? `${option.product_code} (${option.name})  ${option.bar_code}` : ""
    return option.name ? option.name: ""
  };

  return (
    <div style={{ width: 320, paddingLeft: 20 }}>
        {!isFilter ?
        <Autocomplete
          filterOptions={filter}
          options={props.products}
          autoComplete
          getOptionLabel={getOptionLabel}
          onChange={(event, value) => {
            if (value?.name) {
              setSelectedOption(value);
              props.handleSearchBarSelect(value);
            }
          }}
          renderInput={renderInput}
          renderOption={renderOption}
          value={selectedOption}
          clearOnEscape={true}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // increase if selected
              if (selectedOption.name) {
                props.handleSearchBarSelect(selectedOption);
              }
            } else if (e.key === "Backspace") {
              if (selectedOption?.name) {
                // console.log("reset");
                e.preventDefault();
                e.stopPropagation();
                setSelectedOption({});
              }
            }
          }}
          blurOnSelect={false}
          autoHighlight
        />:
        <CustomTextField
            fullWidth  placeholder="Tìm sản phẩm (mã sp, tên)" variant="outlined" size="small"
            InputProps={{
              startAdornment: (   <InputAdornment position="start">   <SearchIcon style={{ color: grey[500] }} />  </InputAdornment> ),
              endAdornment: ( <InputAdornment position="end">  <Box  component="img" sx={{ height: 23, width: 23 }} src={barcodeIcon} /> </InputAdornment> ),
              style: { padding: " 5px", paddingLeft:"10px",paddingRight:"10px" },
            }}
            onChange={(e)=>{
              let newProductData = [...allProduct]
              newProductData = newProductData.filter(item  => removeAccents(item.name.toUpperCase().concat(item.product_code.toUpperCase()).concat(item.bar_code)).includes(removeAccents(e.target.value.replace(/\s/g, '')).toUpperCase()))
              setProducts(newProductData)
            }}
        />
        }

    </div>
  );
};

export default SearchProduct;
