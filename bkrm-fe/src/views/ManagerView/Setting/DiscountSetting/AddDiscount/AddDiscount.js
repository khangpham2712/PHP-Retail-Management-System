import React, {useState,useEffect} from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import AddIcon from '@material-ui/icons/Add';
import MultipleSelect from "../../../../../components/Select/MultipleSelect"
//import library
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
  ListItem
  
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

//import project
import customerApi from "../../../../../api/customerApi";
import {useSelector,useDispatch} from 'react-redux'
import MoreInfo from "../../../../../components/MoreInfo/MoreInfo"
import clsx from "clsx"
import DeleteForeverTwoToneIcon from '@material-ui/icons/DeleteForeverTwoTone';
import { ThousandSeperatedInput } from "../../../../../components/TextField/NumberFormatCustom";
import SearchMultiple from "../../../../../components/SearchBar/SearchMultiple";
import promotionCouponApi from "../../../../../api/promotionCouponApi";
import { TreeSelect } from 'antd';
import 'react-quill/dist/quill.snow.css';
import ListIcon from '@material-ui/icons/List';
import productApi from "../../../../../api/productApi";
import { statusAction } from "../../../../../store/slice/statusSlice";
import { infoActions } from "../../../../../store/slice/infoSlice";

import 'antd/dist/antd.css';
import "../../../../../index.css"
// import productApi from "../../../../../api/productApi";

import RemoveIcon from '@material-ui/icons/Remove';
import IndeterminateCheckBoxOutlinedIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined';
import CheckIcon from '@material-ui/icons/Check';
const { SHOW_PARENT } = TreeSelect;
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
    ava: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    textField: {
      width: "100%",
    },
    input: {
      display: "none",
    },
    weight:{
      fontWeight:500,
      color: "#000",
      fontSize: 13,
    },
    attrCard:{
      margin:"5px 0px 25px 0px", 
      boxShadow: "none",border: '1px solid' , borderColor:"#c9c9c9"
    },
    attrHead:{
      backgroundColor:"#E4E4E4", height:40, color:"#000"
    }
 
  })
);

const AddDiscount = (props) => {
  const { handleClose, open } = props;
  // tam thoi
  const statusState = "Success";

  const theme = useTheme();
  const classes = useStyles(theme);
  const info = useSelector(state => state.info)
  const store_uuid = info.store.uuid
  const branch_uuid = info.branch.uuid;
  const products = info.products;
  const dispatch = useDispatch();

  const [name, setName] = React.useState("");
  const [categoryList, setCategoryList] = useState([]);

  //tam thoi
  const customerGroup = [{id:1, name:"VIP",conditions:[]}, {id:2, name:"Khách hàng thân thiết",conditions:[]}]

  useEffect(() => {
    const loadProducts = async () => {
      const response = await productApi.searchBranchProduct(store_uuid, branch_uuid, '')
      dispatch(infoActions.setProducts(response.data))
    }
    if (store_uuid && branch_uuid) {
      loadProducts()
    }
  }, [store_uuid, branch_uuid]);


  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const response = await productApi.getNestedCategory(store_uuid);
        setCategoryList(response.data);
        // productFormik.setFieldValue("category", response.data[0].uuid);
      } catch (error) {
        console.log(error);
        return [];
      }
    };
    fetchCategoryList();
  }, []);

  //Khuyến mãi theo - Hình thức
  const [discountKey, setDiscountKey] = React.useState("invoice");   // invoice, product
 
 
  const handleChangeKey = (event) => {
    setDiscountKey(event.target.value);
    setDiscountType(event.target.value === "invoice" ? "discountInvoice": "sendGift")
    const d = new Date();
    setRowsInvoice([{key:d.toString(),  totalCost:0,  discountValue:0, numberGiftItem:1, listGiftItem:[], type:"VND" ,numberBuyItem:1, isGiftCategory:false,
    isBuyCategory:false, listBuyItem:[],typeDiscountItem:"price",listGiftCategory:[],listBuyCategory:[],priceByQuantity:[
      {key:d.toString(),number:1, typeDiscountItem:"price",value:0, type:"VND"},
    ] }])
  };
  const [discountType, setDiscountType] = React.useState("discountInvoice"); //discountInvoice , sendGift, sendVoucher,priceByQuantity
  const handleChangeType = (event) => {
    setDiscountType(event.target.value);
    const d = new Date();
    setRowsInvoice([{key:d.toString(),  totalCost:0,  discountValue:0, numberGiftItem:1, listGiftItem:[], type:"VND" ,numberBuyItem:1,  isGiftCategory:false,
    isBuyCategory:false,listBuyItem:[],typeDiscountItem:"price",listGiftCategory:[],listBuyCategory:[],priceByQuantity:[
      {key:d.toString(),number:1, typeDiscountItem:"price",value:0,type:"VND"},
    ] }])
  };

  // Khuyên mãi theo 
  const [rowsInvoice, setRowsInvoice] = React.useState([
    {
      //invoive
      key:"1", //  ID dung để delete row , ko liên quan database
      totalCost:0, 
      type:"VND" ,// "%"

      discountValue:0,

      numberGiftItem:1,
      listGiftItem:[],

       //item
      numberBuyItem:1,
      listBuyItem:[],
      // typeDiscountItem:"price",
      listGiftCategory:[],
      listBuyCategory:[],
      isGiftCategory:false,
      isBuyCategory:false,

      giftIsTheSameBuy:false,

      priceByQuantity:[
        {key:"1",number:1, typeDiscountItem:"price",value:0,type:"VND"},
      ]
    }]);

    console.log("rowsInvoicerowsInvoicerowsInvoice",rowsInvoice.listGiftItem)

    const getInValidMesg = ()=>{
      if(name.length===0) {  return "Chưa nhập tên chương trình khuyến mãi"}
      if(startDate && endDate && new Date(startDate) > new Date(endDate)) { return "Cài đặt thời gian không hợp lệ. Ngày bắt đầu đang sau ngày kết thúc."}
      if(discountKey ==="invoice"){
            let seen = new Set();
            var hasDuplicates = rowsInvoice.some(function(currentObject) {
                return seen.size === seen.add(currentObject.totalCost).size;
            });
            if(hasDuplicates)return "Có điều kiện khuyến mãi trùng nhau. Vui lòng kiểm tra lại"
            // 
            if(discountType ==="discountInvoice"){
              const isInvalid = rowsInvoice.some(row => Number(row.discountValue) <= 0 );
              if(isInvalid)return "Bạn chưa nhập giá trị giảm giá"
            }
            else if(discountType ==="sendGift"){
              const isInvalidNumber = rowsInvoice.some(row => Number(row.numberGiftItem) <= 0 );
              if(isInvalidNumber)return "Bạn chưa nhập SL hàng được tặng"
              const isInvalid = rowsInvoice.some(row =>!row.isGiftCategory? row.listGiftItem.length <= 0  : row.listGiftCategory.length <= 0);
              if(isInvalid)return "Bạn chưa nhập hàng/nhóm hàng được tặng"
              
            }
            else if(discountType ==="sendVoucher"){
              const isInvalidNumber = rowsInvoice.some(row => Number(row.numberGiftItem) <= 0 );
              if(isInvalidNumber)return "Bạn chưa nhập SL voucher được tặng"
              const isInvalid = rowsInvoice.some(row => row.listGiftItem.length <= 0 );
              if(isInvalid)return "Bạn chưa nhập voucher được tặng" 
            }
      }
      else if(discountKey ==="product") {
            const isInvalidNumber = rowsInvoice.some(row => Number(row.numberBuyItem) <= 0 );
            if(isInvalidNumber)return "Bạn chưa nhập SL hàng mua"
            const isInvalid = rowsInvoice.some(row => !row.isBuyCategory? row.listBuyItem.length <= 0  : row.listBuyCategory.length <= 0);
            if(isInvalid) return "Bạn chưa nhập hàng/nhóm hàng mua" 
          
            if(discountType === "sendGift"){
              const isInvalidNumber = rowsInvoice.some(row => Number(row.numberGiftItem) <= 0 );
              if(isInvalidNumber)return "Bạn chưa nhập SL hàng được tặng"
              const isInvalid = rowsInvoice.some(row =>!row.isGiftCategory? row.listGiftItem.length <= 0  : row.listGiftCategory.length <= 0);
              if(isInvalid)return "Bạn chưa nhập hàng/nhóm hàng được tặng"
 

            }else if (discountType === "priceByQuantity"){
              const isInvalidNumber = rowsInvoice.some(row => row.priceByQuantity.some(miniRow=>Number(miniRow.number) === 0))
              if(isInvalidNumber)return "Bạn chưa nhập SL từ"
              
              const isDupNumber = rowsInvoice.some(row =>{
                const uniqueValue=  new Set(row.priceByQuantity.map(v => Number(v.number)))
                return (uniqueValue.size !== row.priceByQuantity.length)
              })
              if(isDupNumber)return "Có điều kiện khuyến mãi SL từ bằng nhau.Vui lòng kiểm tra lại"

              const isInvalidValue = rowsInvoice.some(row =>row.priceByQuantity.some(miniRow=>Number(miniRow.value) === 0));
              if(isInvalidValue)return "Bạn chưa nhập giá bán/giá trị khuyến mãi"

              const isDiscountLargerThanSalePrice =  rowsInvoice.some(row =>(row.listBuyItem.length === 1 && row.isBuyCategory=== false )?row.priceByQuantity.some(miniRow=>Number(miniRow.value) > row.listBuyItem[0].list_price) : false);
              if(isDiscountLargerThanSalePrice)return "Giá khuyến mãi lớn hơn giá bán"

            }

            let listBuyItem =rowsInvoice.reduce((set, a) =>set.concat(a.listBuyItem) ,[])
            const unique = [...new Set(listBuyItem.map(item => item.uuid))]; 
            let totalLength = rowsInvoice.reduce((sum, a) => sum + a.listBuyItem.length, 0)
            if (unique.length !== totalLength){return "Có điều kiện khuyến mãi trùng nhau. Vui lòng kiểm tra lại"}    
           
      }



      return null
  }

  

  const  handleChangeMoneyType = (index, value) => {
    let newArr = [...rowsInvoice];
    newArr[index].type = value;
    newArr[index].discountValue = Number(newArr[index].discountValue) > 100  &&  value ==="%" ?  100: newArr[index].discountValue
    setRowsInvoice(newArr);
  }
  // const  handleChangeDiscountType = (index, value) => {
  //   console.log("rowsInvoice",rowsInvoice)
  //   let newArr = [...rowsInvoice];
  //   newArr[index].typeDiscountItem = value;
  //   setRowsInvoice(newArr);
  // }

  const  handleChangeTotalCost = (event, index) => {
    let newArr = [...rowsInvoice];
    newArr[index].totalCost =  Math.abs(event.target.value)
    setRowsInvoice(newArr);
  }
  const  handleChangeValue = (event, index) => {
    let newArr = [...rowsInvoice];
    newArr[index].discountValue = Number(event.target.value) >= 100  &&  newArr[index].type ==="%" ? 100 : Math.abs(event.target.value);
    setRowsInvoice(newArr);
  }
  const  handleChangeNumberGiftItem = (event, index) => {
    let newArr = [...rowsInvoice];
    newArr[index].numberGiftItem =  Math.abs(event.target.value);
    setRowsInvoice(newArr);
  }
  // const  handleChangeListGiftItem = (option, index,typeChange) => {
  //   let newArr = [...rowsInvoice];
  //   if (typeChange === "delete"){
  //     newArr[index].listGiftItem = newArr[index].listGiftItem.filter(item => item.uuid !== option.uuid)
  //   }else{
  //     newArr[index].listGiftItem.push(option)
  //   }
   
  //   setRowsInvoice(newArr);
  // }
  const  handleChangeListGiftItem = (value, index) => {
    let newArr = [...rowsInvoice];
    // if (typeChange === "delete"){
    //   newArr[index].listGiftItem = newArr[index].listGiftItem.filter(item => item.uuid !== option.uuid)
    // }else{
    //   newArr[index].listGiftItem.push(option)
    // }
    newArr[index].listGiftItem = value
    console.log("valuevaluevaluevalue",value)

    setRowsInvoice(newArr);
  }
  const  handleChangeNumberBuyItem = (event, index) => {
    let newArr = [...rowsInvoice];
    newArr[index].numberBuyItem = Math.abs(event.target.value);
    setRowsInvoice(newArr);
  }
  // const  handleChangeListBuyItem = (option, index,typeChange) => {
  //   let newArr = [...rowsInvoice];
  //   if (typeChange === "delete"){
  //     newArr[index].listBuyItem = newArr[index].listBuyItem.filter(item => item.uuid !== option.uuid)
  //   }else{
  //     newArr[index].listBuyItem.push(option)
  //   }
   
  //   setRowsInvoice(newArr);
  // }
    const  handleChangeListBuyItem = (value, index) => {
    let newArr = [...rowsInvoice];
    // if (typeChange === "delete"){
    //   newArr[index].listBuyItem = newArr[index].listBuyItem.filter(item => item.uuid !== option.uuid)
    // }else{
    //   newArr[index].listBuyItem.push(option)
    // }
    newArr[index].listBuyItem  = value
   
    setRowsInvoice(newArr);
  }
  const  handleChangeIsBuyCategory = (index) => {
    let newArr = [...rowsInvoice];
    newArr[index].isBuyCategory = !newArr[index].isBuyCategory;
    setRowsInvoice(newArr);
  }
  const  handleChangeListBuyCategory = (val,index) => {
    let newArr = [...rowsInvoice];
    newArr[index].listBuyCategory = val;
    setRowsInvoice(newArr);
  }
  
  const  handleChangeIsGiftCategory = (index) => {
    let newArr = [...rowsInvoice];
    newArr[index].isGiftCategory = !newArr[index].isGiftCategory;
    setRowsInvoice(newArr);
  }
  const  handleChangeListGiftCategory = (val,index) => {
    let newArr = [...rowsInvoice];
    newArr[index].listGiftCategory = val;
    setRowsInvoice(newArr);
  }

  const  handleCheckedGiftIsTheSameBuy = (index) => {
    let newArr = [...rowsInvoice];
    newArr[index].giftIsTheSameBuy = !newArr[index].giftIsTheSameBuy;
    setRowsInvoice(newArr);
  }
  

  

  const addConditionRow = () => {
    let newArr = [...rowsInvoice];
    const d = new Date();
    newArr.push({key:d.toString(),  totalCost:0,  discountValue:0, numberGiftItem:1, listGiftItem:[], type:"VND" ,numberBuyItem:1, listBuyItem:[], isGiftCategory:false,
    isBuyCategory:false,typeDiscountItem:"price", listGiftCategory:[],listBuyCategory:[],  priceByQuantity:[
      {key:"1",number:1, typeDiscountItem:"price",value:0,type:"VND"},
    ]})
    setRowsInvoice(newArr);
  }


  const deleteAttr = (key) => {
    if(rowsInvoice.length === 1){return}
    var newArr = [...rowsInvoice];
    newArr = newArr.filter(row => row.key !== key)
    setRowsInvoice(newArr);
  }


  // 
  const  handleChangeMiniDiscountType = (index,miniIndex, value) => {
    console.log("rowsInvoice",rowsInvoice)
    let newArr = [...rowsInvoice];
    newArr[index].priceByQuantity[miniIndex].typeDiscountItem = value;
    setRowsInvoice(newArr);
  }

  const handleChangeMiniNumberBuyItem = (event,index,miniIndex) =>{
    let newArr = [...rowsInvoice];
    newArr[index].priceByQuantity[miniIndex].number = Math.abs(event.target.value);
    setRowsInvoice(newArr);
  }
  const handleChangeMiniValue = (event,index,miniIndex) =>{
    let newArr = [...rowsInvoice];
    newArr[index].priceByQuantity[miniIndex].value = Math.abs(event.target.value);
    setRowsInvoice(newArr);
  }
  const handleChangeMiniMoneyType = (index,value,miniIndex) =>{
    let newArr = [...rowsInvoice];
    newArr[index].priceByQuantity[miniIndex].type = value;
    newArr[index].priceByQuantity[miniIndex].value = Number(newArr[index].priceByQuantity[miniIndex].value) > 100  &&  value ==="%" ?  100:newArr[index].priceByQuantity[miniIndex].value
    setRowsInvoice(newArr);
  }
  const addPriceByQuantityRow = (index) => {
    let newArr = [...rowsInvoice];
    const d = new Date();
    newArr[index].priceByQuantity.push({key:d.toString(), number:1, typeDiscountItem:"price",value:0,type:"VND" })
    setRowsInvoice(newArr);
  }
  const deletePriceByQuantityRow = (index,key) => {
    var newArr = [...rowsInvoice];
    if(newArr[index].priceByQuantity.length === 1){return}
    newArr[index].priceByQuantity = newArr[index].priceByQuantity.filter(row => row.key !== key)
    setRowsInvoice(newArr);
  }

  // Set Date Advance

  const [byMonth, setByMonth] = React.useState([]);
  const [byDay, setByDay] = React.useState([]);
  const [byDate, setByDate] = React.useState([]);
  const [byTime, setByTime] = React.useState([]);

  const handleByMonthChange = (event) => {
    setByMonth(event.target.value);
  };
  const handleDeleteMonth = (chipToDelete) => () => {
    setByMonth((chips) => byMonth.filter((chip) => chip !== chipToDelete));
  };
  const handleByDayChange = (event) => {
    setByDay(event.target.value);
  };
  const handleDeleteDay = (chipToDelete) => () => {
    setByDay((chips) => byDay.filter((chip) => chip !== chipToDelete));
  };

  const handleByDateChange = (event) => {
    setByDate(event.target.value);
  };
  const handleDeleteDate = (chipToDelete) => () => {
    setByDate((chips) => byDate.filter((chip) => chip !== chipToDelete));
  };

  const handleByTimeChange = (event) => {
    setByTime(event.target.value);
  };
  const handleDeleteTime = (chipToDelete) => () => {
    setByTime((chips) => byTime.filter((chip) => chip !== chipToDelete));
  };

  //Birthday
  const [checkedBirthday, setCheckedBirthday] = React.useState(false);
  const handleCheckedBirthday = (event) => {
    setCheckedBirthday(event.target.checked);
  };

  //Customer group target
  const [checkedCustomerGroup, setCustomerGroup] = React.useState([]);
  const handleCustomerGroup = (event) => {
    setCustomerGroup(event.target.value);
  };
  const handleDeleteCustomerGroup = (chipToDelete) => () => {
    setCustomerGroup((chips) => checkedCustomerGroup.filter((chip) => chip !== chipToDelete));
  };

    
  const currentDate =  new Date()

  const [startDate, setStartDate] = React.useState(currentDate.toISOString().slice(0,10))
  const [endDate, setEndDate] = React.useState( )

  // const [endDate, setEndDate] = React.useState( new Date(currentDate.setMonth(currentDate.getMonth()+6)).toISOString().slice(0,10) )



  function getColorSelected (selectedData,item  ){
    return selectedData.includes(item) ?  theme.customization.primaryColor[50]:null 
  }

  console.log("checkedCustomerGroup",checkedCustomerGroup)

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      maxWidth="md"
      fullWidth={true}
    >
      <DialogTitle id="form-dialog-title">
        <Typography className={classes.headerTitle} variant="h5">
          Thêm chương trình khuyến mãi
        </Typography>
      </DialogTitle>

      <DialogContent>
        <div>
          <TextField
            id="outlined-basic"
            label="Tên chương trình khuyến mãi (*)"
            variant="outlined"
            fullWidth
            size="small"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Card
            className={classes.attrCard}
            style={{ marginTop: 20, marginBottom: 10 }}
          >
            <CardHeader
              title="Hình thức khuyến mãi"
              className={classes.attrHead}
            />

            <Grid
              container
              direction="row"
              alignItems="center"
              style={{ padding: 10, paddingBottom: 15, marginBottom: 10 }}
            >
              <Grid container item sm={4} alignItems="center">
                <Grid item sm={6}>
                  <Typography
                    style={{
                      fontWeight: 500,
                      color: theme.customization.primaryColor[500],
                      marginRight: 10,
                    }}
                  >
                    Khuyến mãi theo{" "}
                  </Typography>
                </Grid>
                <Grid item sm={6}>
                  <FormControl className={classes.formControl}>
                    <Select value={discountKey} onChange={handleChangeKey}>
                      <MenuItem value="invoice">Hoá đơn</MenuItem>
                      <MenuItem value="product">Sản phẩm</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container item sm={4} alignItems="center">
                <Grid item sm={4}>
                  <Typography
                    style={{
                      fontWeight: 500,
                      color: theme.customization.primaryColor[500],
                      marginRight: 10,
                    }}
                  >
                    Hình thức
                  </Typography>
                </Grid>
                <Grid item sm={8}>
                  {discountKey === "invoice" ? (
                    <FormControl className={classes.formControl}>
                      <Select value={discountType} onChange={handleChangeType}>
                        <MenuItem value="discountInvoice">
                          Giảm giá hoá đơn
                        </MenuItem>
                        <MenuItem value="sendGift">Tặng hàng</MenuItem>
                        <MenuItem value="sendVoucher">Tặng voucher</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    <FormControl className={classes.formControl}>
                      <Select value={discountType} onChange={handleChangeType}>
                        <MenuItem value="sendGift">Mua hàng tặng hàng</MenuItem>
                        <MenuItem value="priceByQuantity">
                          Giá bán theo số lượng mua
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </Grid>
              </Grid>
            </Grid>

            {/* Header */}
            <div
              style={{
                backgroundColor: theme.customization.primaryColor[50],
                height: 35,
                marginTop: 20,
                paddingTop: 10,
                paddingLeft: 15,
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              <Grid container direction="row" justifyContent="">
                {discountKey === "invoice" ? (
                  <>
                    <Grid item style={{ width: 150, marginRight: 30 }}>
                      <Typography
                        className={clsx(classes.text, classes.weight)}
                      >
                        Tổng tiền hàng 22
                      </Typography>
                    </Grid>
                    {discountType === "discountInvoice" ? (
                      <Grid item>
                        <Typography
                          className={clsx(classes.text, classes.weight)}
                          style={{ textAlign: "center" }}
                        >
                          Giá trị khuyến mãi
                        </Typography>
                      </Grid>
                    ) : (
                      <>
                        <Grid item style={{ width: 50, marginRight: 50 }}>
                          <Typography
                            className={clsx(classes.text, classes.weight)}
                            style={{ textAlign: "center" }}
                          >
                            SL tặng
                          </Typography>
                        </Grid>
                        <Grid item style={{ marginRight: 190 }}>
                          <Typography
                            className={clsx(classes.text, classes.weight)}
                            style={{ textAlign: "center" }}
                          >
                            {discountType === "sendGift"
                              ? "SP/nhóm hàng tặng"
                              : "Voucher"}
                          </Typography>
                        </Grid>
                      </>
                    )}
                  </>
                ) : null}
                {discountKey === "product" ? (
                  <>
                    {discountType === "sendGift" ? (
                      <>
                        <Grid item style={{ width: 50, marginRight: 50 }}>
                          <Typography
                            className={clsx(classes.text, classes.weight)}
                            style={{ textAlign: "center" }}
                          >
                            SL mua
                          </Typography>
                        </Grid>
                        <Grid item style={{ marginRight: 190 }}>
                          <Typography
                            className={clsx(classes.text, classes.weight)}
                            style={{ textAlign: "center" }}
                          >
                            SP/nhóm hàng mua
                          </Typography>
                        </Grid>
                        <Grid item style={{ width: 50, marginRight: 50 }}>
                          <Typography
                            className={clsx(classes.text, classes.weight)}
                            style={{ textAlign: "center" }}
                          >
                            SL tặng
                          </Typography>
                        </Grid>
                        <Grid item style={{ marginRight: 190 }}>
                          <Typography
                            className={clsx(classes.text, classes.weight)}
                            style={{ textAlign: "center" }}
                          >
                            SP/nhóm hàng tặng
                          </Typography>
                        </Grid>
                      </>
                    ) : null}
                    {discountType === "priceByQuantity" ? (
                      <>
                        <Grid item style={{ marginRight: 270 }}>
                          <Typography
                            className={clsx(classes.text, classes.weight)}
                            style={{ textAlign: "center" }}
                          >
                            Khi mua{" "}
                          </Typography>
                        </Grid>
                        <Grid item style={{ width: 50, marginRight: 50 }}>
                          <Typography
                            className={clsx(classes.text, classes.weight)}
                            style={{ textAlign: "center" }}
                          >
                            SL từ
                          </Typography>
                        </Grid>
                      </>
                    ) : null}
                  </>
                ) : null}
              </Grid>
            </div>
            <Divider
              classes={{ root: classes.divider }}
              style={{ marginLeft: 10, marginRight: 10 }}
            />

            {/* List Khuyen mai */}
            {rowsInvoice.map((row, index) => {
              console.log("{row.priceByQuantity", row);
              return (
                <>
                  <div
                    style={{ paddingLeft: 15, marginLeft: 10, marginRight: 10 }}
                  >
                    <Grid container direction="row" justifyContent="">
                      {discountKey === "invoice" ? (
                        <>
                          <InputFromTotalCost
                            handleChangeTotalCost={handleChangeTotalCost}
                            totalCost={row.totalCost}
                            index={index}
                          />
                          {discountType === "discountInvoice" ? (
                            <InputMoneyWithPercentOrPrice
                              handleChangeValue={(e) =>
                                handleChangeValue(e, index)
                              }
                              value={row.discountValue}
                              handleChangeMoneyTypeToVND={() =>
                                handleChangeMoneyType(index, "VND")
                              }
                              handleChangeMoneyTypeToPercent={() =>
                                handleChangeMoneyType(index, "%")
                              }
                              type={row.type}
                              index={index}
                            />
                          ) : null}
                          {discountType === "sendGift" ? (
                            <>
                              <InputNumberItem
                                handleChangeNumberItem={(e) =>
                                  handleChangeNumberGiftItem(e, index)
                                }
                                number={row.numberGiftItem}
                                index={index}
                              />
                              <SearchMultipleProductOrCategory
                                handleChangeListItem={handleChangeListGiftItem}
                                handleChangeIsCategory={
                                  handleChangeIsGiftCategory
                                }
                                handleChangeListCategory={
                                  handleChangeListGiftCategory
                                }
                                index={index}
                                categoryList={categoryList}
                                listItem={row.listGiftItem}
                                isCategory={row.isGiftCategory}
                                listCategory={row.listGiftCategory}
                                handleCheckedGiftIsTheSameBuy={
                                  handleCheckedGiftIsTheSameBuy
                                }
                                giftIsTheSameBuy={row.giftIsTheSameBuy}
                              />
                            </>
                          ) : null}
                          {discountType === "sendVoucher" ? (
                            <>
                              <InputNumberItem
                                handleChangeNumberItem={(e) =>
                                  handleChangeNumberGiftItem(e, index)
                                }
                                number={row.numberGiftItem}
                                index={index}
                              />
                              <SearchMultpleVoucher
                                handleChangeListGiftItem={
                                  handleChangeListGiftItem
                                }
                                row={row}
                                index={index}
                              />
                            </>
                          ) : null}
                        </>
                      ) : null}
                      {discountKey === "product" ? (
                        <>
                          {discountType === "sendGift" ? (
                            <>
                              <InputNumberItem
                                handleChangeNumberItem={(e) =>
                                  handleChangeNumberBuyItem(e, index)
                                }
                                number={row.numberBuyItem}
                                index={index}
                              />
                              <SearchMultipleProductOrCategory
                                handleChangeListItem={handleChangeListBuyItem}
                                handleChangeIsCategory={
                                  handleChangeIsBuyCategory
                                }
                                handleChangeListCategory={
                                  handleChangeListBuyCategory
                                }
                                index={index}
                                categoryList={categoryList}
                                listItem={row.listBuyItem}
                                isCategory={row.isBuyCategory}
                                listCategory={row.listBuyCategory}
                                handleCheckedGiftIsTheSameBuy={() => {}}
                                giftIsTheSameBuy={false}
                              />
                              <InputNumberItem
                                handleChangeNumberItem={(e) =>
                                  handleChangeNumberGiftItem(e, index)
                                }
                                number={row.numberGiftItem}
                                index={index}
                              />
                              <SearchMultipleProductOrCategory
                                handleChangeListItem={handleChangeListGiftItem}
                                handleChangeIsCategory={
                                  handleChangeIsGiftCategory
                                }
                                handleChangeListCategory={
                                  handleChangeListGiftCategory
                                }
                                index={index}
                                categoryList={categoryList}
                                listItem={row.listGiftItem}
                                isCategory={row.isGiftCategory}
                                listCategory={row.listGiftCategory}
                                handleCheckedGiftIsTheSameBuy={
                                  handleCheckedGiftIsTheSameBuy
                                }
                                giftIsTheSameBuy={row.giftIsTheSameBuy}
                              />
                            </>
                          ) : null}
                          {discountType === "priceByQuantity" ? (
                            <>
                              <Grid container>
                                <Grid item>
                                  <SearchMultipleProductOrCategory
                                    handleChangeListItem={
                                      handleChangeListBuyItem
                                    }
                                    handleChangeIsCategory={
                                      handleChangeIsBuyCategory
                                    }
                                    handleChangeListCategory={
                                      handleChangeListBuyCategory
                                    }
                                    index={index}
                                    categoryList={categoryList}
                                    listItem={row.listBuyItem}
                                    isCategory={row.isBuyCategory}
                                    listCategory={row.listBuyCategory}
                                    handleCheckedGiftIsTheSameBuy={() => {}}
                                    giftIsTheSameBuy={false}
                                  />
                                </Grid>
                                <Grid item>
                                  {row.priceByQuantity?.map(
                                    (miniRow, miniIndex) => {
                                      return (
                                        <Grid container item>
                                          <Typography>
                                            {"\u00a0\u00a0\u00a0\u00a0\u00a0"}
                                          </Typography>
                                          <InputNumberItem
                                            handleChangeNumberItem={(e) =>
                                              handleChangeMiniNumberBuyItem(
                                                e,
                                                index,
                                                miniIndex
                                              )
                                            }
                                            number={miniRow.number}
                                            index={index}
                                          />
                                          {row.listBuyItem.length === 1 &&
                                          row.isBuyCategory === false ? (
                                            <Typography
                                              style={{
                                                marginTop: 12,
                                                marginRight: 20,
                                                color: "#000",
                                              }}
                                            >
                                              {" "}
                                              <b>Giá bán: </b>
                                              {"\u00a0"}{" "}
                                              {row.listBuyItem[0].list_price.toLocaleString()}
                                            </Typography>
                                          ) : null}
                                          <SelectPriceOrDiscount
                                            handleChangeDiscountType={
                                              handleChangeMiniDiscountType
                                            }
                                            typeDiscountItem={
                                              miniRow.typeDiscountItem
                                            }
                                            index={index}
                                            miniIndex={miniIndex}
                                          />
                                          <InputMoneyWithPercentOrPrice
                                            handleChangeValue={(e) =>
                                              handleChangeMiniValue(
                                                e,
                                                index,
                                                miniIndex
                                              )
                                            }
                                            value={miniRow.value}
                                            handleChangeMoneyTypeToVND={() =>
                                              handleChangeMiniMoneyType(
                                                index,
                                                "VND",
                                                miniIndex
                                              )
                                            }
                                            handleChangeMoneyTypeToPercent={() =>
                                              handleChangeMiniMoneyType(
                                                index,
                                                "%",
                                                miniIndex
                                              )
                                            }
                                            type={miniRow.type}
                                            index={index}
                                            typeDiscountItem={
                                              miniRow.typeDiscountItem
                                            }
                                          />
                                          <IndeterminateCheckBoxOutlinedIcon
                                            style={{
                                              marginTop: 8,
                                              color: "red",
                                              marginLeft: 20,
                                            }}
                                            fontSize="small"
                                            onClick={() => {
                                              deletePriceByQuantityRow(
                                                index,
                                                miniRow.key
                                              );
                                            }}
                                          />
                                        </Grid>
                                      );
                                    }
                                  )}
                                </Grid>
                              </Grid>
                              <Grid
                                container
                                justifyContent="flex-end"
                                style={{ marginRight: 150, marginTop: -10 }}
                              >
                                <Button
                                  size="small"
                                  color="primary"
                                  style={{
                                    marginLeft: 20,
                                    marginBottom: 15,
                                    marginTop: 10,
                                    textTransform: "none",
                                  }}
                                  startIcon={<AddIcon />}
                                  onClick={() => addPriceByQuantityRow(index)}
                                >
                                  Thêm dòng
                                </Button>
                              </Grid>
                            </>
                          ) : null}
                        </>
                      ) : null}
                      <Grid
                        item
                        container
                        direction="row"
                        justifyContent="flex-end"
                      >
                        <DeleteForeverTwoToneIcon
                          style={{ marginTop: -30 }}
                          onClick={() => {
                            deleteAttr(row.key);
                          }}
                        />
                      </Grid>
                    </Grid>
                  </div>

                  {discountKey === "product" &&
                  discountType === "sendGift" &&
                  !row.giftIsTheSameBuy ? (
                    <Grid container justifyContent="flex-end">
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="primary"
                            checked={row.giftIsTheSameBuy}
                            onChange={() =>
                              handleCheckedGiftIsTheSameBuy(index)
                            }
                          />
                        }
                        label={"Hàng được tặng là hàng mua"}
                        style={{ marginRight: 200, marginTop: -10 }}
                      />
                    </Grid>
                  ) : null}

                  <Divider
                    classes={{ root: classes.divider }}
                    style={{ marginLeft: 10, marginRight: 10 }}
                  />
                </>
              );
            })}

            <Button
              variant="outlined"
              size="small"
              color="primary"
              style={{
                marginLeft: 20,
                marginBottom: 15,
                marginTop: 10,
                textTransform: "none",
              }}
              startIcon={<AddIcon />}
              onClick={() => addConditionRow()}
            >
              Thêm điều kiện
            </Button>
          </Card>

          <Card
            className={classes.attrCard}
            style={{ marginTop: 20, marginBottom: 10 }}
          >
            <CardHeader
              title="Thời gian áp dụng"
              className={classes.attrHead}
            />
            <div style={{ padding: 10 }}>
              <Grid
                container
                direction="row"
                justifyContent="space-around"
                alignItems="center"
                spacing={3}
              >
                <Grid item sm={6}>
                  <TextField
                    id="startDate"
                    label="Từ"
                    type="date"
                    name="startDate"
                    variant="outlined"
                    size="small"
                    fullWidth
                    className={classes.textField}
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Grid>

                <Grid item sm={6}>
                  <TextField
                    id="endDate"
                    label="Đến"
                    type="date"
                    name="endDate"
                    defaultValue={new Date().toDateString()}
                    variant="outlined"
                    size="small"
                    fullWidth
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                      inputProps: { min: startDate },
                    }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Grid>
              </Grid>
              {/*  */}
              <Divider style={{ margin: "25px 10px 0px 10px" }} />
              <Typography
                style={{
                  fontWeight: 500,
                  color: "#707070",
                  marginTop: 15,
                  marginBottom: -10,
                }}
              >
                Cài đặt nâng cao:
              </Typography>
              <MultipleSelect
                chonsenValue={byMonth}
                handleAction={handleByMonthChange}
                handleDeleteChip={handleDeleteMonth}
                label="Theo tháng"
                options={month}
              />
              <MultipleSelect
                chonsenValue={byDay}
                handleAction={handleByDayChange}
                handleDeleteChip={handleDeleteDay}
                label="Theo ngày"
                options={day}
              />
              <MultipleSelect
                chonsenValue={byDate}
                handleAction={handleByDateChange}
                handleDeleteChip={handleDeleteDate}
                label="Theo thứ"
                options={date}
              />
              <MultipleSelect
                chonsenValue={byTime}
                handleAction={handleByTimeChange}
                handleDeleteChip={handleDeleteTime}
                label="Theo giờ"
                options={time}
              />
            </div>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={checkedBirthday}
                  onChange={handleCheckedBirthday}
                />
              }
              label={
                <Grid container direction="row" alignItems="center">
                  Áp dụng vào{" "}
                  <Typography
                    style={{
                      color: theme.customization.primaryColor[500],
                      fontWeight: 500,
                      marginLeft: 4,
                      marginRight: 4,
                    }}
                  >
                    {" "}
                    ngày sinh nhật
                  </Typography>{" "}
                  của khách hàng{" "}
                </Grid>
              }
              style={{ marginLeft: 10 }}
            />
          </Card>

          <Card
            className={classes.attrCard}
            style={{ marginTop: 20, marginBottom: 10 }}
          >
            <CardHeader title="Phạm vi áp dụng" className={classes.attrHead} />
            <div style={{ padding: 15 }}>
              <ListItem style={{ margin: 0, padding: 0 }}>
                <Typography>
                  Chỉ áp dụng cho <b>nhóm khách hàng:</b>
                </Typography>
                {/* <MultipleSelect  chonsenValue={checkedCustomerGroup} handleAction={handleCustomerGroup} handleDeleteChip={handleDeleteCustomerGroup}label="Nhóm khách hàng"   options={customerGroup}/> */}
                <Select
                  multiple
                  variant="outlined"
                  fullWidth
                  id="branches"
                  name="branches"
                  onChange={handleCustomerGroup}
                  // onBlur={formik.handleBlur}
                  size="small"
                  value={checkedCustomerGroup}
                  renderValue={(selected) =>
                    selected
                      .map((group) => {
                        return customerGroup.find(
                          (branch) => branch.id === group
                        )?.name;
                      })
                      .join(", ")
                  }
                  placeholder="Nhóm khách hàng"
                  style={{ width: 200, marginLeft: 20, height: 50 }}
                >
                  {customerGroup.map((group) => (
                    /* style={{backgroundColor:getColorSelected(formik.values.branches, branch.id) }} */
                    <MenuItem
                      key={group.name}
                      value={group.id}
                      style={{
                        backgroundColor: getColorSelected(
                          checkedCustomerGroup,
                          group.id
                        ),
                      }}
                    >
                      <Grid container justifyContent="space-between">
                        {group.name}
                        {getColorSelected(checkedCustomerGroup, group.id) ? (
                          <CheckIcon color="primary" />
                        ) : null}
                      </Grid>
                    </MenuItem>
                  ))}
                </Select>
              </ListItem>
            </div>
          </Card>
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => handleClose(null)}
          variant="contained"
          size="small"
          color="secondary"
        >
          Huỷ
        </Button>
        <Button
          onClick={async () => {
            let body = {
              name: name,
              start_date: startDate,
              end_date: endDate,
              discountKey: discountKey,
              discountType: discountType,

              // promotion_condition: JSON.stringify({

              //   rowsInvoice: rowsInvoice,

              // }),
              promotion_condition: JSON.stringify(rowsInvoice),
              customer_birth: checkedBirthday,
              // Thêm cái này nữa Hải ơi
              dateAdvanceSetting: JSON.stringify({
                byDay: byDay,
                byMonth: byMonth,
                byDate: byDate,
                byTime: byTime,
              }),
              customerGroup: checkedCustomerGroup,
            };

            try {
              const invalidMesg = getInValidMesg();
              if (invalidMesg) {
                dispatch(statusAction.failedStatus(invalidMesg));
                return;
              } else {
                const response = await promotionCouponApi.createPromotion(
                  store_uuid,
                  body
                );
                handleClose("Success");
              }
            } catch (err) {
              handleClose("Failed");
            }
          }}
          variant="contained"
          size="small"
          color="primary"
        >
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDiscount;

const InputFromTotalCost = ({handleChangeTotalCost,totalCost,index}) =>{
  return (
    <Grid item  container direction="row" alignItems="center" style={{width:130,marginRight:52, height:40}} >
    <Grid item> <Typography style={{marginRight:10, color:"#000", fontSize:13}}> Từ </Typography> </Grid> 
    <Grid item> <ThousandSeperatedInput  style={{width:100}} onChange={(event)=>handleChangeTotalCost(event, index)} value={totalCost} /> </Grid> 
</Grid>   
  )
}
const InputNumberItem = ({handleChangeNumberItem,number,index}) =>{
  // (event)=>handleChangeNumberItem(event, index)

  return (
    <Grid item style={{width:50,marginRight:30, height:40, marginTop:4}} >
      <ThousandSeperatedInput  style={{width:50}} onChange={handleChangeNumberItem} value={number} /> 
    </Grid>
   
  )
}

const SearchMultipleProductOrCategory = ({handleChangeListItem,handleChangeIsCategory,handleChangeListCategory,index,categoryList,handleCheckedGiftIsTheSameBuy,isCategory,listItem,listCategory,giftIsTheSameBuy}) => {
  // const giftIsTheSameBuy = false
  return (
    <>
    {!giftIsTheSameBuy ?
        <Grid item style={{ marginTop:4}} >
        <Grid  container direction='row'>
          {!isCategory ?
              <>
          <SearchMultiple
            selectedOption={listItem}
            handleSelectedOption={handleChangeListItem}
            index={index}
          />
            <Tooltip title={"Chọn danh mục"}>
            <ListIcon  onClick={()=>handleChangeIsCategory(index )}/>
          </Tooltip>
          </>:
          <>
          <TreeSelect
              name="category"  
              placeholder={ 'Danh mục"'}
              style={{ width: 280}}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto',zIndex:100000000  }}
              treeData={categoryList}
              value={listCategory}
              onChange={(val)=>handleChangeListCategory(val,index)}
              treeCheckable={true}
              showCheckedStrategy={SHOW_PARENT}
              // onBlur={productFormik.handleBlur}   
          />
            <Tooltip title={"Chọn danh mục"}>
            <ListIcon  onClick={()=>handleChangeIsCategory(index )}/>
          </Tooltip>
          </>}
          </Grid>
        </Grid>
        :  <FormControlLabel
        control={<Checkbox  color="primary" checked={giftIsTheSameBuy} onChange={()=>handleCheckedGiftIsTheSameBuy(index)}  />}
        label={"Hàng được tặng là hàng mua"}    
      />}
      </>
  )
}

const SearchMultpleVoucher = ({handleChangeListGiftItem,row,index }) =>{
  return (
    <Grid item style={{ marginTop:4}} >
      <SearchMultiple
      isVoucher={true}
        selectedOption={row.listGiftItem}
        handleSelectedOption={handleChangeListGiftItem}
        index={index}
      />
    </Grid> 
  )
}
const SelectPriceOrDiscount = ({handleChangeDiscountType,typeDiscountItem, index, miniIndex}) =>{
  const theme = useTheme();
  const classes = useStyles(theme);
  return (
    <Grid item style={{width:50,marginRight:50, height:40, marginTop:4}} >
        <FormControl className={classes.formControl}>
          <Select value={typeDiscountItem}  onClick={(e) => handleChangeDiscountType(index,miniIndex, e.target.value)}>
            <MenuItem value="price">Giá bán</MenuItem>
            <MenuItem value="percent">Giảm giá</MenuItem>
          </Select>
        </FormControl>
    </Grid>
  )
}
const InputMoneyWithPercentOrPrice = ({handleChangeValue, value,handleChangeMoneyType,type, index,handleChangeMoneyTypeToVND,handleChangeMoneyTypeToPercent,typeDiscountItem}) =>{
  const theme = useTheme();
  const classes = useStyles(theme);
  return(
    <Grid item >
      <Grid item  container direction="row" alignItems="center" style={{height:40}}>
        {/*!! Nếu la % nhớ handle maximum change là 100% */}
        <Grid item> <ThousandSeperatedInput style={{marginRight:10, color:"#000"}} onChange={handleChangeValue} value={value}  />  </Grid> 
        {typeDiscountItem !== "price"  ?
        <>
        <Grid item style={{ marginRight:5}}> 
            <ButtonBase sx={{ borderRadius: '16px', }} 
                // onClick={()=>handleChangeMoneyType(index,"VND")}
                onClick={handleChangeMoneyTypeToVND}
              >
              <Avatar variant="rounded"   style={{width: theme.spacing(4),height: theme.spacing(3), background:type ==="VND"?  theme.palette.primary.main :null,}} >
                  <Typography  style={{fontSize:13, fontWeight:500}} >VND</Typography>
              </Avatar>     
          </ButtonBase>
          </Grid> 
          <Grid item> 
            <ButtonBase sx={{ borderRadius: '16px' }} 
                // onClick={()=>handleChangeMoneyType(index,"%")}
                onClick={handleChangeMoneyTypeToPercent}
              >
              <Avatar variant="rounded"   style={{width: theme.spacing(4),height: theme.spacing(3), background:type ==="%"?theme.palette.primary.main :null,}} >
                  <Typography  style={{fontSize:13, fontWeight:500}} >%</Typography>
              </Avatar>
              
          </ButtonBase>
          </Grid> 
          </>
         :null}
      </Grid>
      
    </Grid>
  )
}



const month = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];
const day = ['Ngày 1','Ngày 2','Ngày 3','Ngày 4','Ngày 5','Ngày 6','Ngày 7','Ngày 8','Ngày 9','Ngày 10','Ngày 11','Ngày 12','Ngày 13','Ngày 14','Ngày 15','Ngày 16','Ngày 17','Ngày 18','Ngày 19','Ngày 20','Ngày 21','Ngày 22','Ngày 23','Ngày 24','Ngày 25','Ngày 26','Ngày 27','Ngày 28','Ngày 29','Ngày 30','Ngày 31'];
const date=['Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7','Chủ nhật']
const time = ['0am','1am','2am','3am','4am','5am','6am','7am','8am','9am','10am','11am','12am','13pm','14pm','15pm','16pm','17pm','18pm','19pm','20pm', "21pm","22pm",'23pm']
