import React, {useState,useEffect} from 'react'
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import {
    Button,
    TextField,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Grid,
    Avatar,
    Dialog,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    FormControlLabel,
    Checkbox,
    Divider,
    ButtonBase,
    Tooltip,
    CardHeader,
    Input,
    Chip,
    IconButton,
    FormLabel,
    RadioGroup,
    Radio,
    ListItem
  } from "@material-ui/core";
import clsx  from "clsx"
import CheckIcon from '@material-ui/icons/Check';

import ModalWrapperWithClose from "../../../../components/Modal/ModalWrapperWithClose"
import CloseIcon from "@material-ui/icons/Close";
import {getAllProductInCategoryParent} from "../../../../utils"
import { ThousandSeperatedInput } from '../../../../components/TextField/NumberFormatCustom';
import productApi from "../../../../api/productApi";
import {useSelector,useDispatch} from 'react-redux'
import openNotification from "../../../../components/StatusPopup/StatusPopup";
import { success ,error,warning, info} from '../../../../components/StatusModal/StatusModal';

const useStyles = makeStyles((theme) =>
    createStyles({

    weight:{
        fontWeight:500,
        color: "#000",
        fontSize: 14,
    },
    headerTitle: {
        fontSize: "1.125rem",
      },

})
);
const DiscountPopup = ({open,onClose,title,filteredPromotion,handleUpdateSelectedPromotion,selectedPromotion,listGiftItem,totalCartAmount,handleUpdateBestDetailSelectedPromotion,products}) => {
    console.log("selectedPromotion",filteredPromotion)
    const theme = useTheme();
  const classes = useStyles(theme);

  const [value, setValue] = React.useState(selectedPromotion?selectedPromotion.id.toString():null);
  console.log("value",value)
  console.log("selectedPromotionselectedPromotion",selectedPromotion)
  const [promotion, setPromotion] =  React.useState(selectedPromotion? selectedPromotion:null);
//   const [check, setCheck] =  React.useState(selectedPromotion?selectedPromotion.listGiftItem:[]);

// const [check, setCheck] =  React.useState(selectedPromotion?{idPro:selectedPromotion.id,detail:selectedPromotion.listGiftItem}:{idPro:null, detail:[]});
// const [check, setCheck] =  React.useState(selectedPromotion?{idPro:selectedPromotion.id,detail:listGiftItem?listGiftItem:[]}:{idPro:null, detail:[]});
const [check, setCheck] =  React.useState({idPro:null, detail:[]});
const [openPopUpWarning, setOpenPopUpWarning]=  React.useState(false);

// selectedPromotion.listGiftItem
  function getColorSelected (selectedData,itemUuid  ){
    if(!selectedData){return}
    return selectedData.some(function(e) {return e.uuid.includes(itemUuid); }) ?  theme.customization.primaryColor[50]:null 
  }
  const handleChange = (promotion) => {

    if(Number(promotion.id) === Number(value)){
        setValue(null);
        setPromotion(null)
    }else{
        setValue(promotion.id.toString());
        setPromotion(promotion)
    }
  };

  console.log("check",check)
  const getBestDetailSelectedCondition = (promotion) =>{
    if(promotion){
        let bestDetailSelectedCondition = promotion?.detailCondition?.map((pro) =>{if (Number(totalCartAmount) >= Number(pro.totalCost)) {return pro}else{return null}})
        bestDetailSelectedCondition =bestDetailSelectedCondition? bestDetailSelectedCondition.filter(item => item !== null)[0]:null
        return bestDetailSelectedCondition
    }
  }
  const [categoryList,setCategoryList] = useState(null)

  const info = useSelector(state => state.info)
  const store_uuid = info.store.uuid
  const branch_uuid = info.branch.uuid;

  const [quantityWarn, setQuantityWarn] = useState(false)

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const response = await productApi.getNestedCategory(store_uuid);
        setCategoryList(response.data);
        console.log("response.data",response.data)

        // productFormik.setFieldValue("category", response.data[0].uuid);
      } catch (error) {
        console.log(error);
        return [];
      }
    };
    fetchCategoryList();
  }, []);

  const getListItem = (bestDetailSelectedCondition) => {
    if(!bestDetailSelectedCondition.isGiftCategory){
        return bestDetailSelectedCondition.listGiftItem
    }else{
        return getAllProductInCategoryParent(products,categoryList,bestDetailSelectedCondition.listGiftCategory[0])
    }
  
  }
  const handleCheck = (value, idPro) =>{
    // console.log("valuevaluevaluevaluevalue",value)
    if(idPro !== promotion.id){
        return setOpenPopUpWarning(true)
    }else{
        // openNotification('warning', 'Chọn chương trình khuyến mãi trước khi chọn sản phẩm', '')
        // warning("Chọn chương trình khuyến mãi trước khi chọn sản");
        
        // setCheck({idPro:idPro, detail:value.value.map((item ) => {return {...item, quantity:1}})})
        // 
        setCheck({idPro:idPro, detail:value?.map((item)=> {return {...item, quantity:1}})})

    }
    // setCheck({idPro:idPro, detail:value.map((item)=> {return {...item, quantity:1}})})
    // return setCheck({idPro:idPro, detail:value.map((item)=> {return {...item, quantity:1}})})
  }

  console.log("valuevaluevaluevaluecheck",check)
  useEffect(()=>{
    setCheck({idPro:null, detail:[]})
    setOpenPopUpWarning(false)
  }, [promotion])
  useEffect(()=>{
    setQuantityWarn(false)
  },[check])

  const handleChangeGiftQuantity = (idPro,product, newQuantity) => {
    const itemIndex = check.detail.findIndex(
        (item) => item.uuid === product.uuid
      );
      const newCheck = {...check};
      newCheck.detail[itemIndex].quantity = newQuantity;
      console.log("newCheck",newCheck)
      setCheck(newCheck)
  }
  const handleApplyPromotion  = () =>{
    console.log("check",check.detail.reduce((sum,item) => sum + Number(item.quantity)  ,0))
    
    let bestCondition = promotion?.detailCondition?.map((promotion) =>{if (Number(totalCartAmount) >= Number(promotion.totalCost)) {return promotion}else{return null}})
    bestCondition =bestCondition?.filter(item => item !== null)[0]
    let bestDetailSelectedCondition = getBestDetailSelectedCondition(promotion)
    if(bestDetailSelectedCondition?.numberGiftItem < check?.detail?.reduce((sum,item) => sum + Number(item.quantity),0)){
        setQuantityWarn(true)
        return 
    }
    handleUpdateBestDetailSelectedPromotion(getBestDetailSelectedCondition(promotion));
    handleUpdateSelectedPromotion(promotion, check);
    onClose()
  }

    return (
        // <Dialog open={open} handleClose={onClose} title={title}>
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth={true}>
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
                    <DialogTitle id="form-dialog-title">
                        <Typography className={classes.headerTitle} variant="h3" >
                            {title}
                        </Typography>
                    </DialogTitle>

                    <IconButton aria-label="close"   onClick={onClose}>
                        <CloseIcon  fontSize="small" />
                    </IconButton>
            </Grid>
           
            <DialogContent>

                <Grid  container direction="row" justifyContent="" style={{marginBottom:8}}>
                    <Grid item style={{width:10,marginRight:30}} >                      
                    </Grid>
                    <Grid item style={{width:250,marginRight:30}} >
                        <Typography className={clsx(classes.text,classes.weight)} >Chương trình khuyến mãi</Typography>
                    </Grid>
                    <Grid item style={{width:250, marginRight:30}}>
                        <Typography className={clsx(classes.text,classes.weight)} >Hình thức khuyến mãi</Typography>
                    </Grid>
                </Grid>
                <Divider style={{marginBottom:8}} />
                {/* // */}
                {openPopUpWarning?<Typography style={{color:'red', fontWeight:500, }}>Chọn chương trình khuyến mãi trước khi chọn sản phẩm</Typography>:null}
                {quantityWarn?<Typography style={{color:'red', fontWeight:500, }}>Số lượng sản phẩm chọn lớn hơn số lượng cho phép tặng</Typography>:null}

                <FormControl component="fieldset">
                    <RadioGroup value={value} >
                        {filteredPromotion?.map((pro) => {
                            let bestCondition = pro.detailCondition.map((pro) =>{if (Number(totalCartAmount) >= Number(pro.totalCost)) {return pro}else{return null}})
                            bestCondition =bestCondition.filter(item => item !== null)[0]
                            let bestDetailSelectedCondition = getBestDetailSelectedCondition(pro)
                            return (
                                <Grid  key={pro.id} container direction="row" justifyContent="">
                                        <Grid item style={{width:10,marginRight:30}} >
                                            <FormControlLabel value={pro.id.toString()} control={<Radio  size="small" onClick={()=>handleChange(pro)}/>}  />
                                            {/* <FormControlLabel value={promotion} control={<Radio  size="small" onClick={()=>handleChange(promotion)}/>}  /> */}

                                        </Grid>
                                        <Grid item style={{width:250,marginRight:30,marginTop:10, color:"#383737"}} >
                                            <Typography >{pro.name}</Typography>
                                        </Grid>
                                        <Grid item style={{width:250, marginRight:30,marginTop:10,color:"#383737"}}>
                                            <Typography  >{pro.discountKey ==="invoice" ? "Hoá đơn" : "Sản phẩm"} - {getDiscountType(pro.discountKey,pro.discountType)}</Typography>
                                            <Typography  style={{fontSize:12}}>{pro.discountType ==="sendGift" ? `(${bestDetailSelectedCondition.numberGiftItem} sản phẩm)`:null }</Typography>
                                        </Grid>
                                        {pro.discountType ==="discountInvoice"?
                                            <Grid item style={{width:250, marginRight:30,marginTop:10,color:"#383737"}}>
                                                <Typography  >Giảm giá <b style={{color:'#00b3ff', fontWeight:600}}>{bestDetailSelectedCondition.discountValue.toLocaleString()} {bestDetailSelectedCondition.type}</b> {"\u00a0\u00a0"}(Hoá đơn từ {bestDetailSelectedCondition.totalCost.toLocaleString()} đ) </Typography>
                                            </Grid>
                                        :null }
                                         {pro.discountType ==="sendGift"?
                                            <Grid item style={{width:250, marginRight:30,marginTop:10,color:"#383737"}}>
                                                {Number(bestDetailSelectedCondition.numberGiftItem) === 1 &&  !bestDetailSelectedCondition.isGiftCategory && bestDetailSelectedCondition.listGiftItem.length === 1 ? 
                                                    <Typography><b > Tặng sản phẩm </b> <b style={{color:'#00b3ff', fontWeight:500}}>{bestDetailSelectedCondition.listGiftItem[0].product_code}-{bestDetailSelectedCondition.listGiftItem[0].name}</b></Typography>
                                                    :
                                                    <>
                                                    <Typography style={{marginBottom:5}}><b > Tặng sản phẩm </b> </Typography>
                                                    <Select multiple  variant="outlined" fullWidth   id="branches"  name="branches" size="small"
                                                        value={check.detail}
                                                        onChange={(e)=>handleCheck(e.target.value,pro.id)}
                                                    
                                                        renderValue={(selected) => 
                                                            selected?.map((item) => {
                                                                return getListItem(bestDetailSelectedCondition).find( (product) => product.uuid === item.uuid)?.name;
                                                            }).join(", ")
                                                        }
                                                        placeholder="Sản phẩm"
                                                        style={{width:200, marginLeft:20, height:50}}
                                                            >
                                                            {getListItem(bestDetailSelectedCondition)?.map((item) => (
                                                                <MenuItem key={item.uuid} value={item} 
                                                                style={{backgroundColor:getColorSelected(check.detail, item.uuid) }} 
                                                                > 
                                                                <Grid container justifyContent='space-between'>
                                                                    {item.name}
                                                                    {getColorSelected(check.detail, item.uuid)? <CheckIcon color='primary'/> :null}
                                                                </Grid >
                                                                </MenuItem>
                                                            ))}
                                                    </Select>
                                                    { check.idPro === pro.id ?
                                                     check.detail.map((item)=>{
                                                        return (
                                                            <ListItem>
                                                                <Typography>{item.product_code} - {item.name}</Typography>
                                                                <ThousandSeperatedInput value={item.quantity} onChange={(e)=>handleChangeGiftQuantity(pro.id,item,e.target.value)}/>
                                                            </ListItem>
                                                        )
                                                    }) :null }
                                      
                                                    
                                                    </>
                                                }
                                             
                                                <Typography  >(Hoá đơn từ {bestDetailSelectedCondition.totalCost.toLocaleString()} đ )</Typography>

                                               
                                            </Grid>
                                        :null }
                                    </Grid>      
                            )})}
                    <Divider />
                </RadioGroup>
            </FormControl> 
            </DialogContent>
            
            <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          size="small"
          color="secondary"
        >
          Huỷ
        </Button>
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={()=>{handleApplyPromotion()}}
        >
          Áp dụng
        </Button>
      </DialogActions>
  
              
        </Dialog>
    )
}

export default DiscountPopup

function getDiscountType (discountKey, discountType){

    if(discountKey === "invoice"){
        if(discountType ==="sendGift"){return "Tặng hàng"}
        else if (discountType ==="sendVoucher"){ return "Tặng voucher"}
        else{ return "Giảm giá hoá đơn"}
    }else{
        if(discountType ==="sendGift"){return "Mua hàng tặng hàng"}
        else{return "Giá bán theo số lượng mua"}
    }
}