import React, {useState,useEffect} from 'react'
import {useTheme, makeStyles,withStyles,createStyles,lighten} from "@material-ui/core/styles";
import {Typography,Divider,Card,Grid,Avatar,Paper,Box,Button,InputLabel,MenuItem,FormControl,Select,ListItem,ListItemIcon,ListItemText} from '@material-ui/core';
import { grey, blue,purple} from '@material-ui/core/colors'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ava from '../../../../assets/img/product/lyimg.jpeg';
import ReportCard from "../../../../components/CardWrapper/ReportCard"
import TypeReportSelect from "../../../../components/Select/TypeReportSelect"

//import api 
import customerApi from '../../../../api/customerApi'
import { useSelector } from 'react-redux'
//import api
import productApi from "../../../../api/productApi";
import storeApi from "../../../../api/storeApi";

const GeneralStatistics = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
        
  const [categoryList, setCategoryList] = useState([{name: 'áo', total: 100},{name: 'quần', total: 200}]);
  const [productList, setProductList] = useState([]);
  

  const [moneyData, setMoneyData] = useState([]);
  const [branchList, setBranchList] = useState([]);

  const [customerList, setCustomerList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);


  const [reload, setReload] = useState(true);
  const onReload = () => setReload(!reload)
    
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;

  // report apis call here 
  const [isLoaded, setIsLoaded] = useState(false)

  // must be in format
  const [fromDate, setFromDate] = useState('2021-12-20');
  const [toDate, setToDate] = useState("2022-01-31");

  // top 10, 20
  const [limit, setLimit] = useState(10);

  // unit used for chart data split by day/ month/ year
  const [unit, setUnit] = useState("day");

  // category id to view to item by root category
  // should be selected by a drop down and pass as category_id
  const [categoryId, setCategoryId] = useState(4);

  // response data state
  const [overview, setOverview] = useState({})
  const [topItemByCategory, setTopItemByCategory] = useState([])
  
  const [revenue, setRevenue] = useState({})
  const [purchase, setPurchase] = useState({})
  const [captital, setCapital] = useState({})
  const [profit, setProfit] = useState({})

  const [topData, setTopData] = useState({})

  useEffect(() => {
    const fetchReports = async () => {

      // overview: number of employees, customers, suppliers, in money, out money
      const overViewRes = await storeApi.getReportOverview(store_uuid, fromDate, toDate);
      setOverview(overViewRes.data)

      // top 'limit' of items by category
      const topItemByCategoryRes = await storeApi.getReportProduct(store_uuid, fromDate, toDate, limit, categoryId);
      setTopItemByCategory(topItemByCategoryRes);

      // revenue, captital, profit, purchase data by 'unit'
      const revenueRes = await storeApi.getReportRevenue(
        store_uuid,
        fromDate,
        toDate,
        unit
      );
      setRevenue(revenueRes)

      const captitalRes = await storeApi.getReportCaptital(
        store_uuid,
        fromDate,
        toDate,
        unit
      );
      setCapital(captitalRes)

      const profitRes = await storeApi.getReportProfit(
        store_uuid,
        fromDate,
        toDate,
        unit
      );
      setProfit(profitRes);

      const purchaseRes = await storeApi.getReportPurchase(
        store_uuid,
        fromDate,
        toDate,
        unit
      );
      setPurchase(purchaseRes);

      // top employees, customers, products, suppliers,...
      const topDataRes = await storeApi.getReportTop(
        store_uuid,
        fromDate,
        toDate,
        limit
      );
      setTopData(topDataRes)  
      setIsLoaded(true)
    }
    console.log("overview")
    console.log(overview)
    console.log(topItemByCategory)
    console.log(revenue)
    console.log(topData)

    fetchReports()
    
  }, [])
  
  useEffect(() => {
    customerApi.getCustomers(store_uuid)
    .then(response => response.data, err => console.log(err))
    .then(data => {
        setCustomerList(data)
    })

}, [reload, store_uuid]);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await productApi.getProductsOfBranch(
        store_uuid,
        branch_uuid
      );
      setProductList(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  if (reload) {
    fetchProducts();
    setReload(false);
  }
}, [reload, store_uuid, branch_uuid]);



  return (
    <div className={classes.root}>
        
        <Grid container spacing={3}> 
            <Grid   item md={6} xs={12} >
                <ReportCard title={"Top sản phẩm"} 
                // ToolBar={
                // <TypeReportSelect  handleChangeType={()=>{}} type={"best-seller"} title={}/>
                // } 
                 > 
                    <Grid container justifyContent='space-between' alignItems='center'  >
                        <Typography style={{color:"#000",fontSize:17,width:200, fontWeight:500,}}>Sản phẩm</Typography>
                        <Typography style={{color:"#000",fontSize:17,fontWeight:500}}>Doanh thu</Typography>
                    </Grid>
                    <Divider style={{marginTop:15, marginBottom:10}} />
                    {[0,1,2].map(()=>{
                        return(
                        <Box style={{marginBottom:10}}>
                        <Grid container justifyContent='space-between' alignItems='center' style={{marginBottom:10}} >
                            <Box style={{width:200}}>
                                <ListItem style={{ margin:0, padding:0 }}  >
                                    <Box  component="img"  sx={{ height: 50, width: 50, borderRadius: 50, marginRight: 15 }}  src={ava} />
                                    <Typography style={{color:"#000", fontSize:16, fontWeight:500}} >Tên sản phẩm</Typography>
                                </ListItem>
                            </Box>
                            <Typography style={{color:"#000", fontSize:16}}>Tổng thu</Typography>
                        </Grid>
                        <Divider />
                        </Box>
                        )
                    })}
                     <Typography variant="h5"  style={{cursor: 'pointer',color:'#1b74e4', flexGrow:1, textAlign:'right', marginTop:20}}> Xem chi tiết </Typography>
                </ReportCard>
            </Grid>
            <Grid  item md={6} xs={12} >
                <Card className={classes.hoverCard} style={{padding:25, marginTop:20}}>
                    <Typography style={{marginBottom:20,color:"#000", fontSize:22}} variant="h5">Thống kê bán hàng </Typography> 
                </Card>
            </Grid>
        </Grid>
    </div>
  )
}

export default GeneralStatistics

const SmallDetailBox = ({bgColor, color, title, value}) =>{
    const theme = useTheme();
    const classes = useStyles(theme);
    return (
            <Box style={{flexGrow:1,textAlign:'center', alignContent:'center', paddingTop:10, paddingBottom:10}} >
                <Grid container justifyContent='center' >
                    <Avatar style={{backgroundColor:bgColor, color:color, width: theme.spacing(7),  height: theme.spacing(7)}}>
                        <AttachMoneyIcon/>
                    </Avatar> 
                </Grid>
            <Typography style={{color:'#000', fontSize:22,fontWeight:500, marginTop:10}}>{value}</Typography>
            <Typography  style={{marginTop:4, color:'#777e89'}}>{title}</Typography>
            </Box>
    )
}




const useStyles = makeStyles((theme) =>
createStyles({
  root: {
    background: theme.customization.mode === "Light"? '#fafbfb': grey[800],
    borderRadius:theme.customization.borderRadius,
    color: '#000000',
    color: '#fafbfb',
    boxShadow: "none",
    padding:20,
    // paddingRight:10,
    // paddingLeft:20,
    margin:-20
  },
  header:{
    paddingTop:20,
    paddingBottom:15
  },
  headerTitle:{
    fontSize: '1.125rem',
  },
  divider:{
      marginBottom:15
  },
  hoverCard:{
    boxShadow:' 0px 10px 20px rgba(0,0,0,0.09)',
    "&:hover": {
      boxShadow:'0px 10px 20px rgba(0,0,0,0.15)',
    },
    // textAlign: 'center',
    color: theme.palette.text.secondary,
    paddingTop:10,
    borderRadius:theme.customization.borderRadius
},
large: {
    width: theme.spacing(2),
    height: theme.spacing(2),
  },
}));