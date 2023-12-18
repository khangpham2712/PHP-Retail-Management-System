import React from 'react'
import {
    Grid,
    Box,
    Typography,
    TextField,
    InputAdornment,
    Tooltip,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import {
    useTheme,
    withStyles,
    makeStyles,
    createStyles,
  } from "@material-ui/core/styles";
  import barcodeIcon from "../../assets/img/icon/barcode_grey.png";
  import { grey } from "@material-ui/core/colors";

export const CustomTextField = withStyles({
    root: {
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderRadius: 14,
        },
      },
    },
  })(TextField);

const SearchBar = (props) => {
    const {title} = props
  return (
    <CustomTextField
    {...props}
    fullWidth  placeholder={title} variant="outlined" size="small"
    InputProps={{
      startAdornment: (   <InputAdornment position="start">   <SearchIcon style={{ color: grey[500] }} />  </InputAdornment> ),
      endAdornment: ( <InputAdornment position="end">  <Box  component="img" sx={{ height: 23, width: 23 }} src={barcodeIcon} /> </InputAdornment> ),
      style: { padding: " 5px", paddingLeft:"10px",paddingRight:"10px" },
    }}
    // onChange={(e)=>{
    //   let newProductData = [...allProduct]
    //   newProductData = newProductData.filter(item  => removeAccents(item.name.toUpperCase().concat(item.product_code.toUpperCase()).concat(item.bar_code)).includes(removeAccents(e.target.value.replace(/\s/g, '')).toUpperCase()))
    //   setProducts(newProductData)
    // }}
/>
  )
}

export default SearchBar