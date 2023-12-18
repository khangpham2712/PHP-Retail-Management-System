import React, { useEffect, useState } from "react";
//import style
import useStyles from "../../../../components/TableCommon/style/mainViewStyle";
//impỏrt library
import {
  Box,
  TextField,
  ListItem,
  IconButton,
  TableRow,
  TableCell,
  Tooltip,
  Chip,
  Button,
  Typography,
  Grid,
} from "@material-ui/core";
import { DeleteOutline } from "@material-ui/icons";
import {useTheme,withStyles} from "@material-ui/core/styles";

import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import DeleteForeverTwoToneIcon from '@material-ui/icons/DeleteForeverTwoTone';
//import project
import * as Input from "../../../../components/TextField/NumberFormatCustom";
import ButtonQuantity from "../../../../components/Button/ButtonQuantity";
import { VNDFormat } from "../../../../components/TextField/NumberFormatCustom";
import DiscountPopUp from "../DiscountPopup/DiscountPopup";
import icon from "../../../../assets/img/product/tch.jpeg";
import SelectBatch from "../../../../components/SelectBatch/SelectBatch";
import { useSelector } from "react-redux";

import MoreInfo from "../../../../components/MoreInfo/MoreInfo";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

import defaultProduct from "../../../../assets/img/product/default-product.png";
import setting from "../../../../assets/constant/setting";
import { isLessDate } from "../../../../utils";

export const CartRow = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  const haveDiscount = true;
  const info = useSelector((state) => state.info);
  const branch = info.branch;
  const branchs = info.store.branches
  const {
    row,
    // branchs,
    discountData,
    handleDeleteItemCart,
    handleChangeItemQuantity,
    handleUpdateBatches,
    handleChangeItemPrice,
    mini,
    imageType,
    index,
    typeShow,
    showImage,
    isGiftPromotion
  } = props;
  console.log("cart table row", row)
  const updateQuantity = (newQuantity) => {
    handleChangeItemQuantity(row.uuid, newQuantity);
  };
  const [openDiscount, setOpenDiscount] = React.useState(false);
  const handleOpenDiscount = () => {
    setOpenDiscount(!openDiscount);
  };

  const [selectBatchOpen, setSelectBatchOpen] = useState(false);
  //const [selectedBatches, setSelectedBatches] = useState([]);

  // useEffect(() => {
  //   if (row.batches?.length >= 1) {
  //     // setSelectedBatches([{ ...row.batches[0], additional_quantity: 0 }]);
  //     setSelectedBatches(row.selectedBatches)
  //   }
  //   // alert(JSON.stringify(row.selectedBatches))
  // }, []);

  // useEffect(() => {
  //   if(!isGiftPromotion){
  //     let total = 0;
  //     row.selectedBatches.forEach((batch) => {
  //       total += Number(batch.additional_quantity);
  //     });
  //     updateQuantity(total);
  //     handleUpdateBatches(row.uuid, row.selectedBatches);
  //   }
  // }, [selectedBatches]);

  const handleSelectBatches = (batches) => {
    if (isGiftPromotion) return;
    
    const newBatches = [];
    row.selectedBatches.forEach((selectedBatch) => {
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

    let total = 0;
    newBatches.forEach((batch) => {
      total += Number(batch.additional_quantity);
    });
    updateQuantity(total);
    handleUpdateBatches(row.uuid, newBatches);
    // setSelectedBatches(newBatches);

  };

  const store_setting = info.store.general_configuration
    ? JSON.parse(info.store.general_configuration)
    : setting;

  const canFixPriceSell = store_setting?.canFixPriceSell;

  const [show, setShow] = React.useState(false);

  const findBranchQuantity = (id) => {
    const rs = row.branch_inventories.find(
      (x) => x.uuid === id
    )?.quantity_available;
    if (rs) {
      return rs;
    } else {
      return 0;
    }
  };
  function getCommon(array1, array2) {
    return array1.filter(object1 => {
      return array2.some(object2 => {
        return object1.id === object2.id;
      });
    });
  }

  const getListOfPromotionOfProduct = (product) =>{
    let satisfy =  discountData.map((pro)=>{
      let promotionCondition = JSON.parse(pro.promotion_condition)
      
      let proSatisfy = promotionCondition.map((condition)=>{
          console.log("allooooo")
          if(condition.isBuyCategory){
            //
            return false
          }else{
            // console.log("allooooo",getCommon(condition.listBuyItem,product ) )
            // console.log("condition.listBuyItem.filter((item)=>item.uuid === product.uuid).length > 0",condition.listBuyItem.filter((item)=>item.uuid === product.uuid).length > 0)
            const isSatisfied = condition.listBuyItem.filter((item)=>item.uuid === product.uuid)
            console.log("isSatisfied",isSatisfied.length > 0)
            return isSatisfied.length > 0 
          }
        })
        return proSatisfy.some(v => v === true)
      
    })
    // arr.push({detailCondition:sortedRow, name:pro.name , discountKey:pro.discountKey,discountType:pro.discountType, id:pro.id})
    // return satisfy.some(v => v === true) ? [{detailCondition:sortedRow, name:pro.name , discountKey:pro.discountKey,discountType:pro.discountType, id:pro.id}]: []
    return satisfy.some(v => v === true)

  }
  var color = theme.customization.mode === "Light"? typeShow==='list'?'#000':null: null
  return (
    <>
      <TableRow
        hover
        key={props.row.uuid}
        onMouseOver={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        // style={{color:'#000'}}
      >
        {/* {mini ? null : <TableCell align="left">{row.id + 1}</TableCell>} */}
        {/* <TableCell align="left" style={!mini?{}:{paddingLeft:0, paddingRight:!imageType?25:15}}>{imageType?'':`${row.id + 1}.`}</TableCell> */}
        <TableCell align="left" style={!mini?{}:{paddingLeft:0, paddingRight:!imageType?25:15}}>{imageType?'':`${index }.`}</TableCell>

        {/* Sửa lại thành product_code */}
        {mini ? null : <TableCell align="left"  style={{ paddingRight: 20, }}>
          {row.product_code}
        </TableCell>}
        {/* <TableCell align="left" style={mini ? {maxWidth: 50}: { minWidth: 200 }}> */}
        <TableCell align="left" style={{ minWidth: 170 }}  padding={'none'}>
          <ListItem
            style={ {marginLeft:-10, marginTop: -10, marginBottom: -10, padding:0 }}
            alignItems="center"
          >
           {showImage?  <Box
              component="img"
              sx={{ height: 40, width: 40, borderRadius: 10, marginRight: 15,marginTop:12, marginBottom:12  }}
              src={
                JSON.parse(row.img_urls ? row.img_urls : "[]").at(0) ||
                defaultProduct
              }
            />:null}
            <Grid style={{paddingTop:12, paddingBottom:12,marginBottom:imageType?3:0}}>
              <ListItem>
                <Typography style={!mini?{}:{fontWeight:imageType?600:null,color:color}}>{row.name}</Typography>
                {isGiftPromotion ?<div >
                      <Box style={{backgroundColor:"red",color:"#fff",fontSize:8,marginLeft:7,fontWeight:500,borderRadius:5, paddingLeft:5,paddingRight:5, marginLeft:10}}>KM</Box>
                </div>:null}
                </ListItem>
                {imageType ?
                 canFixPriceSell.status && canFixPriceSell.cart || info?.role === 'owner'? (
                  <Input.ThousandSeperatedInput
                    id="standard-basic"
                    // style={mini ? {maxWidth: 50} : { width: 72 }}
                    style={{ width: 72 }}
      
                    size="small"
                    inputProps={{ style: { textAlign: "right"  } }}
                    defaultPrice={row.unit_price}
                    value={row.unit_price}
                    onChange={(e) =>
                      handleChangeItemPrice(props.row.uuid, e.target.value)
                    }
                  />
                ) : (
                  <Input.ThousandFormat value={row.unit_price}>
                    {" "}
                  </Input.ThousandFormat>
                ):null}
            </Grid>
            {show && store_setting?.inventory.status && !mini? (
              <MoreInfo>
                 {branchs.length > 1?
                 <>
                    <ListItem>
                      <Typography style={{ width: 180 }}></Typography>
                      <Typography style={{ fontWeight: 700 }}>Tồn</Typography>
                      <Typography style={{ fontWeight: 700 , marginLeft: 10}}>   Đặt</Typography>
                    </ListItem>
                    {branchs.map((item) => {
                      return (
                        <ListItem>
                          <ListItem style={{ width: 180, margin: 0, padding: 0 }}>
                            <Typography
                              style={{ fontWeight: 700, marginRight: 10 }}
                            >
                              {item.name}
                            </Typography>
                            {item.uuid === branch.uuid ? (
                              <CheckCircleIcon fontSize="small" color="primary" />
                            ) : null}
                          </ListItem>
                          <Grid justifyContent="flex-end">
                            <Typography>{findBranchQuantity(item.uuid)}</Typography>
                          </Grid>
                          <Grid justifyContent="flex-end" style={{marginLeft: 20}}>
                            <Typography>{row.branch_inventories.find(b => b.uuid === item.uuid)?.ordering_quantity}</Typography>
                          </Grid>
                        </ListItem>
                      );
                    })}
                    </>:
                   <Typography  style={{fontWeight:700, color:'#000'}}>{`Tồn kho:\u00a0\u00a0\u00a0  `} {findBranchQuantity(branchs[0].uuid)}</Typography>

                  }
                {/* {row.branch_inventories.map(item =>(
                   <ListItem >
                      <ListItem style={{width:280, margin:0, padding:0}}>
                          <Typography style={{fontWeight:700, marginRight:10}}>{item.name}</Typography>
                          {item.uuid === branch.uuid ? <CheckCircleIcon fontSize="small" color='primary'/> :null} 
                      </ListItem>
                      <Typography>{item.quantity_available}</Typography>
                    </ListItem>
                ))}   */}
              </MoreInfo>
            ) : null}
            {/* {getListOfPromotionOfProduct(row) ? (
              <img
                id="gift"
                src={require("../../../../assets/img/icon/giftbox.png").default}
                style={{ height: 16, width: 16, marginLeft: 10, marginTop: -3 }}
                onClick={() => setOpenDiscount(true)}
              />
            ) : null} */}
            {false ? (
              <img
                id="gift"
                src={require("../../../../assets/img/icon/giftbox.png").default}
                style={{ height: 16, width: 16, marginLeft: 10, marginTop: -3 }}
                onClick={() => setOpenDiscount(true)}
              />
            ) : null}
          </ListItem>
          {openDiscount && (
            <DiscountPopUp
              open={openDiscount}
              title={`Khuyến mãi trên ${row.product_code} - ${row.name}`}
              onClose={() => {
                setOpenDiscount(false);
              }}
            />
          )}
        </TableCell>
        {/* <TableCell align="left">{row.bar_code}</TableCell> */}
       
        {row.has_batches  || isGiftPromotion? (
          <TableCell align="center">
            {row.quantity}
          </TableCell>
        ) : (
          <TableCell align="center"padding='none' >
            <ButtonQuantity
              // isMini={mini?true:false}
              miniCart={mini}
              quantity={row.quantity}
              setQuantity={updateQuantity}
              branch_quantity={row.branch_quantity}
              isManageInventory={store_setting?.inventory.status}
            />
          </TableCell>
         
        )}

      {imageType?null:
      <TableCell align="right" padding={mini ? "none" : "normal"}>
          { !isGiftPromotion ?
          canFixPriceSell.status && canFixPriceSell.cart ? (
            <Input.ThousandSeperatedInput
              id="standard-basic"
              // style={mini ? {maxWidth: 50} : { width: 72 }}
              style={{ width: 72, marginLeft:-5 }}

              size="small"
              inputProps={{ style: { textAlign: "right" } }}
              defaultPrice={row.unit_price}
              value={row.unit_price}
              onChange={(e) =>
                handleChangeItemPrice(props.row.uuid, e.target.value)
              }
            />
          ) : (
            <Input.ThousandFormat value={row.unit_price} style={{marginLeft:-5}}>
              {" "}
            </Input.ThousandFormat>
          ):
          <Box style={{marginTop:10}}>
            <Input.ThousandFormat value={0} style={{marginLeft:-5, }}/><br/>
            <Input.ThousandFormat  value={`-${row.unit_price}`} style={{marginLeft:-5,color:'red'}}/>
          </Box>
          
          } 
        </TableCell>  }  
        
        <TableCell align="right" className={classes.boldText} padding={mini ? "none" : "normal"}>
          {!mini?<VNDFormat value={!isGiftPromotion?row.unit_price * row.quantity:0} style={{color:color}}/>:<Input.ThousandFormat value={row.unit_price * row.quantity} style={{paddingLeft:imageType? 0:20, color:color}}/>}
        </TableCell>

        {!isGiftPromotion?
        <TableCell align="right" padding={mini ? "none" : "normal"}>
          <IconButton aria-label="expand row" size="small" style={{marginLeft:10}}>
            <DeleteForeverTwoToneIcon
              onClick={() => handleDeleteItemCart(row.uuid)}
            />
          </IconButton>
        </TableCell>:null}
      </TableRow>
      {row.has_batches ? (
        <TableRow>
          <TableCell colSpan={1}></TableCell>
          <TableCell colSpan={10}>
            <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => setSelectBatchOpen(true)}
                
              >
                Chọn lô
              </Button>
              {row.selectedBatches.map((batch) => (
                <Tooltip title={`Tồn kho - ${batch.quantity}`}>
                  <Chip
                    label={`${
                      batch?.batch_code ? batch?.batch_code : "Mới"
                    }${batch?.expiry_date ? "(" + batch?.expiry_date.substring(0,10) + "): " : ": "}  ${
                      batch.additional_quantity
                    }`}
                    key={batch.id}
                    onDelete={() => {
                      const newBatches = row.selectedBatches.filter(
                        (selectedBatch) => selectedBatch.id !== batch.id
                      );
                      handleUpdateBatches(row.uuid, newBatches);
                    }}
                    color={batch.expiry_date ? isLessDate(batch.expiry_date, (new Date()).toDateString()) ? "secondary" : "primary" : "primary"}
                    deleteIcon={<DeleteOutline />}
                    variant="outlined"
                  />
                </Tooltip>
              ))}
              {selectBatchOpen && (
                <SelectBatch
                  isCart={true}
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


// export const CartRowMini = ({ row }) => {
//   const classes = useStyles();

//   return (
//     <>
//       <TableRow hover key={row.id}>
//         <TableCell align="left">
//           <ListItem
//             style={{ marginLeft: -30, marginTop: -10, marginBottom: -10 }}
//           >
//             <Box
//               component="img"
//               sx={{ height: 40, width: 40, borderRadius: 10, marginRight: 15 }}
//               src={icon}
//             />
//             <Box direction="column">
//               <Typography
//                 className={classes.boldText}
//                 style={{
//                   marginBottom: 3,
//                   fontSize: 14.5,
//                   width: 135,
//                   textOverflow: "ellipsis",
//                   overflow: "hidden",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 {row.name}
//               </Typography>
//               {/* <Typography>{row.price}</Typography> */}
//               <Input.ThousandSeperatedInput
//                 id="standard-basic"
//                 style={{ width: 70 }}
//                 size="small"
//                 defaultPrice={row.price}
//               />
//             </Box>
//           </ListItem>
//         </TableCell>

//         <TableCell align="left" padding="none">
//           <TextField
//             variant="outlined"
//             defaultValue={row.quantity}
//             style={{ width: 37, margin: 0 }}
//             size="small"
//             inputProps={{
//               style: { paddingLeft: 5, paddingRight: 5, textAlign: "center" },
//             }}
//           />
//         </TableCell>

//         <TableCell align="right" className={classes.boldText}>
//           700.000
//         </TableCell>
//         <TableCell align="left">
//           <IconButton
//             aria-label="expand row"
//             size="small"
//             style={{ marginLeft: -25 }}
//           >
//             <DeleteForeverOutlinedIcon />
//           </IconButton>
//         </TableCell>
//       </TableRow>
//     </>
//   );
// };
