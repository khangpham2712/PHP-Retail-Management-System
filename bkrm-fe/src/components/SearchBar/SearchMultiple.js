
// import React, { useState, useEffect } from 'react';
// import useAutocomplete from '@material-ui/lab/useAutocomplete';
// import NoSsr from '@material-ui/core/NoSsr';
// import CheckIcon from '@material-ui/icons/Check';
// import CloseIcon from '@material-ui/icons/Close';
// import styled from 'styled-components';
// import { useSelector } from "react-redux";
// import { VNDFormat } from "../TextField/NumberFormatCustom";
// import productApi from "../../api/productApi";
// import defaultProduct from "../../assets/img/product/default-product.png"
// import setting from "../../assets/constant/setting"


// import {
//     Grid,
//     Card,
//     Box,
//     Typography,
//     TextField,
//     InputAdornment,
//     IconButton,
//     Button,
//     Dialog,
//     FormControlLabel,
//     Checkbox,
//     FormControl,
//     FormLabel,
//     RadioGroup,
//     Radio,
//     List
//   } from "@material-ui/core";
// import {
//     useTheme,
//     withStyles,
//     makeStyles,
//     createStyles,
//   } from "@material-ui/core/styles";

//   const useStyles = makeStyles((theme) =>
//   createStyles({
//     input: {
//       borderRadius: "20px",
//     },
//   })
// );

// const Label = styled('label')`
//   padding: 0 0 4px;
//   line-height: 1.5;
//   display: block;
// `;

// const InputWrapper = styled('div')`
//   width: 280px;
//   border: 1px solid #d9d9d9;
//   background-color: #fff;
//   border-radius: 4px;
//   padding: 1px;
//   display: flex;
//   flex-wrap: wrap;
//   max-height: 120px;
//   overflow-y: scroll;
//   &:hover {
//     border-color: #40a9ff;
//   }

//   &.focused {
//     border-color: #40a9ff;
//     box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
//   }

//   & input {
//     font-size: 14px;
//     height: 30px;
//     box-sizing: border-box;
//     padding: 4px 6px;
//     width: 0;
//     min-width: 30px;
//     flex-grow: 1;
//     border: 0;
//     margin: 0;
//     outline: 0;
//   }
// `;

// const Tag = styled(({ label, onDelete, ...props }) => (
//   <div {...props}>
//     <span>{label}</span>
//     <CloseIcon onClick={onDelete} />
//   </div>
// ))`
//   display: flex;
//   align-items: center;
//   height: 24px;
//   margin: 2px;
//   line-height: 22px;
//   background-color: #fafafa;
//   border: 1px solid #e8e8e8;
//   border-radius: 2px;
//   box-sizing: content-box;
//   padding: 0 4px 0 10px;
//   outline: 0;
//   overflow: hidden;

//   &:focus {
//     border-color: #40a9ff;
//     background-color: #e6f7ff;
//   }

//   & span {
//     overflow: hidden;
//     white-space: nowrap;
//     text-overflow: ellipsis;
//   }

//   & svg {
//     font-size: 12px;
//     cursor: pointer;
//     padding: 4px;
//   }
// `;

// const Listbox = styled('ul')`
//   width: 280px;
//   margin: 2px 0 0;
//   padding: 0;
//   position: absolute;
//   list-style: none;
//   background-color: #fff;
//   overflow: auto;
//   max-height: 250px;
//   border-radius: 4px;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
//   z-index: 200;
// `;
// export const FormatedImage = (props) => {
//   return (
//     <Box
//       component="img"
//       sx={{
//         height: 53,
//         width: 53,
//         borderRadius: 10,
//         marginRight: 15,
//       }}
//       src={props.url}
//     />
//   );
// };
// export default function SearchMultiple(props) {
//  const {isVoucher,selectedOption,handleSelectedOption,handleDeleteOption,index} = props;
//   const theme = useTheme();
//   const classes = useStyles(theme);
//   // const [selectedOption, setSelectedOption] = useState(props.selected);
//   const [options, setOptions] = React.useState([]);
//   const [inputValue, setInputValue] = React.useState("");

//   // redux
//   const info = useSelector((state) => state.info);
//   const store_uuid = info.store.uuid;
//   const branch_uuid = info.branch.uuid;
//   const store_setting = info.store.general_configuration? JSON.parse(info.store.general_configuration): setting

//   const loadingData = async (searchKey) => {
//     // search product
//     if (!isVoucher ){
//       const response = await productApi.searchBranchProduct(
//         store_uuid,
//         branch_uuid,
//         searchKey
//       );
//       setOptions(response.data);
//     }else{
//         // search voucher 
//         // CALL API VOUCHER HERE
//       setOptions([{id:"VC00001", name:"HELLOWORLD", quantity:10,value:10000,}]);
//     }
   
    
//   };

//   const handleSelect = (option) =>{
//     if (selectedOption.findIndex( (item) => item.uuid === option.uuid)  === -1){
//       handleSelectedOption(option,index,"add")
//     }else{
//       handleSelectedOption(option,index,"delete")
//     }
    
//     setOptions([])
//     setInputValue("")
//   }
//   //add multiple
//   const handleKeyDown = (event) => {
//     if (event.key === 'Enter') {
//       console.log('do validate')
//     }
//   }

//   const renderOption = (option) => {
//     //display value in Popper elements
//     return (
//       <Grid fullWidth container direction="row"style={{padding:'3px 10px 3px 10px'}} onClick={()=>handleSelect(option)}  style={{ cursor: "pointer",padding:5,backgroundColor: selectedOption.findIndex( (item) => item.uuid === option.uuid)  === -1?null: theme.customization.primaryColor[50]}}>
//         <Grid item xs={3}>
//           <FormatedImage url={JSON.parse(option.img_urls ? option.img_urls : "[]").at(0) || defaultProduct} />
//         </Grid>
//         <Grid item xs={9} container direction="column">
//           <Typography variant="h5">{`#${option.product_code}`}</Typography>
//           <Typography variant="h5">{option.name}</Typography>
//           <Grid container item direction="row" justifyContent="space-between">
//             <Typography variant="body2">
//               {/* Tồn kho: {option.branch_quantity} */}
//               { store_setting?.inventory.status? `Tồn kho: ${option.branch_quantity}`  :null}

//             </Typography>
//             <Typography variant="body2">
//               Giá bán: <VNDFormat value={option.list_price}></VNDFormat>
//             </Typography>
//           </Grid>
//         </Grid>
//       </Grid>
//     );
//   };
//   const renderOptionVoucher = (option) => {
//     //display value in Popper elements
//     return (
//       <Grid fullWidth container direction="row"style={{padding:'3px 10px 3px 10px'}} onClick={()=>handleSelect(option)}  style={{ cursor: "pointer",padding:5,backgroundColor: selectedOption.findIndex( (item) => item.uuid === option.uuid)  === -1?null: theme.customization.primaryColor[50]}}>
//         <Grid item xs={9} container direction="column">
//           <Typography variant="h5">{`#${option.id}`}</Typography>
//           <Typography variant="h5">{option.name}</Typography>
//           <Grid container item direction="row" justifyContent="space-between">
//             <Typography variant="body2">
//               SL: {option.quantity}
//             </Typography>
//             <Typography variant="body2">
//               Mệnh giá: <VNDFormat value={option.value}></VNDFormat>
//             </Typography>
//           </Grid>
//         </Grid>
//       </Grid>
//     );
//   };
  




//   return (
//     <NoSsr>
//       <div>
//         <div >
//           <InputWrapper >
//           {/* {selectedOption.length== 0 ?<Typography style={{margin:"5px 0px 0px 9px"}}>Chọn sản phẩm tặng...</Typography> :null} */}
//           { !isVoucher ?selectedOption.map((option) => (
//               // suawr laij product_code sau
//               <Tag label={option.product_code.concat(" - ").concat(option.name)} onDelete={()=>{handleSelectedOption(option,index,"delete"); console.log("selectedOption",selectedOption)}} />
//             )): 
//             selectedOption.map((option) => (
//               <Tag label={option.name} onDelete={()=>{handleSelectedOption(option,index,"delete"); console.log("selectedOption",selectedOption)}} />
//             ))}
//             <input 
//               value={inputValue}
//               onChange={(event, value) => {
//                 loadingData(event.target.value)
//                 setInputValue(event.target.value)
//               }}
//               onKeyDown={handleKeyDown}
//               />
//           </InputWrapper>
//         </div>
//         {options.length > 0 ? (
//           <Listbox >
//             {!isVoucher ?  
//             options.map((option, index) => (
//               renderOption(option)
//             )):
//             options.map((option, index) => (
//               renderOptionVoucher(option)
//             ))
//             }
//           </Listbox>
//         ) : null}
//       </div>
//     </NoSsr>
//   );
// }





import React, { useState, useEffect } from 'react';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import NoSsr from '@material-ui/core/NoSsr';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';
import { useSelector } from "react-redux";
import { VNDFormat } from "../TextField/NumberFormatCustom";
import productApi from "../../api/productApi";
import defaultProduct from "../../assets/img/product/default-product.png"
import setting from "../../assets/constant/setting"
import Autocomplete from '@material-ui/lab/Autocomplete';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { removeAccents } from "../../utils";

import {
    Grid,
    Box,
    Typography,
    TextField,
} from "@material-ui/core";
import {
    useTheme,
    withStyles,
    makeStyles,
    createStyles,
  } from "@material-ui/core/styles";

  const useStyles = makeStyles((theme) =>
  createStyles({
    input: {
      borderRadius: "20px",
    },
  })
);

export const FormatedImage = (props) => {
  return (
    <Box
      component="img"
      sx={{
        height: 53,
        width: 53,
        borderRadius: 10,
        marginRight: 15,
      }}
      src={props.url}
    />
  );
};
export default function SearchMultiple(props) {
 const {isVoucher,selectedOption,handleSelectedOption,handleDeleteOption,index} = props;
  const theme = useTheme();
  const classes = useStyles(theme);


  // redux
  const info = useSelector((state) => state.info);
  const products = info.products;
  console.log("productsproductsproducts",products)
  const vouchers = [{id:"VC00001", name:"HELLOWORLD", quantity:10,value:10000,}]
  const store_setting = info.store.general_configuration? JSON.parse(info.store.general_configuration): setting

  const filterOptions = createFilterOptions({
    stringify: option => `${option.product_code} - ${removeAccents(option.name)}  - ${option.bar_code}`,
  });


  const renderOption = (option) => {
    //display value in Popper elements
    return (
      <Grid fullWidth container direction="row" >
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
            <Typography variant="body2">
              Giá bán: <VNDFormat value={option.list_price}></VNDFormat>
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  };
  const renderOptionVoucher = (option) => {
    //display value in Popper elements
    return (
      <Grid fullWidth container direction="row">
        <Grid item xs={9} container direction="column">
          <Typography variant="h5">{`#${option.id}`}</Typography>
          <Typography variant="h5">{option.name}</Typography>
          <Grid container item direction="row" justifyContent="space-between">
            <Typography variant="body2">
              SL: {option.quantity}
            </Typography>
            <Typography variant="body2">
              Mệnh giá: <VNDFormat value={option.value}></VNDFormat>
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  };
  

  return (
    <div style={{width:280}}>
    <Autocomplete
        multiple
        filterOptions={filterOptions}
        options={!isVoucher ?products : vouchers}
        getOptionLabel={(option) => option.name ? option.name : ""}
        renderOption={!isVoucher ? renderOption: renderOptionVoucher}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            variant="outlined"
            placeholder="Tìm sản phẩm (mã sp, tên)"
          />
        )}

        onChange={(event, value) => {
          handleSelectedOption(value, index)
        }}
      />
    </div>

    
  );
}

