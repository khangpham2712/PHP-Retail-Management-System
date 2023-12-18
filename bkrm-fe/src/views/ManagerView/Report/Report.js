import React ,{useState, useEffect} from 'react'
import ApexChart from '../../../components/Chart/Chart'
import {useTheme, makeStyles,withStyles,createStyles,lighten} from "@material-ui/core/styles";
import {Typography,Divider,Grid,Paper,Box,Button,InputLabel,MenuItem,FormControl,Select,ListItem,ListItemIcon,ListItemText} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import { grey, blue,purple} from '@material-ui/core/colors'
import clsx from "clsx";
import GetAppTwoToneIcon from '@material-ui/icons/GetAppTwoTone';
import ReactApexChart from 'react-apexcharts';
import CustomerReport from './CustomerReport'
// import data_card from './chart-data/data_card'
// import data1 from './chart-data/bajaj-area-chart'
// import data2 from './chart-data/mydata'
import {ColorButtonPink,ColorButtonYellow} from '../../../components/Button/ColorButton'
import OverallReport from './OverallReport'
import ProductReport from './ProductReport'
import MoneyReport from './MoneyReport'
import CategoryReport from './CategoryReport'
import BranchReport from './BranchReport'
import SupplierReport from './SupplierReport'
import EmployeeReport from './EmployeeReport'
import Chart from 'react-apexcharts';
import storeApi from "../../../api/storeApi";

//import api 
import customerApi from '../../../api/customerApi'
import { useSelector } from 'react-redux'


//import api
import productApi from "../../../api/productApi";


const useStyles = makeStyles((theme) =>
createStyles({
  root: {
    background: theme.customization.mode === "Light"? null: grey[800],
    borderRadius:theme.customization.borderRadius,
    color: '#000000',
    boxShadow: "none",
    paddingRight:10,
    paddingLeft:20
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
  
}));


const Report = () => {
    const theme = useTheme();
    const classes = useStyles(theme);

    //0. set time
    const [time, setTime] = React.useState('30day');

    const handleChangeTime = (event) => {
      setTime(event.target.value);
    };

    // 1.data for Overall Report


    // 2.data for customer
    
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
  const branch_id = info.branch.id;

  // report apis call here 
  const [isLoaded, setIsLoaded] = useState(false)

  // must be in format
  const [fromDate, setFromDate] = useState('2022-04-09');
  const [toDate, setToDate] = useState("2022-04-10");

  // top 10, 20
  const [limit, setLimit] = useState(10);

  // unit used for chart data split by day/ month/ year
  const [unit, setUnit] = useState("day");

  // category id to view to item by root category
  // should be selected by a drop down and pass as category_id
  const [categoryId, setCategoryId] = useState(4);

  // response data state
  const [overview, setOverview] = useState({});
  const [statistic, setStatistic] = useState({});
  const [topItemByCategory, setTopItemByCategory] = useState([])
  
  const [revenue, setRevenue] = useState({})
  const [purchase, setPurchase] = useState({})
  const [captital, setCapital] = useState({})
  const [profit, setProfit] = useState({})

  const [topData, setTopData] = useState({})

  useEffect(() => {
    const fetchReports = async () => {

      // branchId => all: branchId: ""
      // overview: number of employees, customers, suppliers, in money, out money
      const overViewRes = await storeApi.getReportOverview(store_uuid, "", fromDate, toDate);
      setOverview(overViewRes.data)
      console.log("overview", overViewRes.data)

      // top 'limit' of items by category
      // const topItemByCategoryRes = await storeApi.getReportProduct(store_uuid, fromDate, toDate, limit, categoryId);
      // setTopItemByCategory(topItemByCategoryRes);
      // console.log("topItemByCate", topItemByCategoryRes)
      const statisticRes = await storeApi.getReportStatistic( 
        store_uuid,
        "",
        fromDate,
        toDate,
        unit
      );

      setStatistic(statisticRes);
      console.log("statistic", statisticRes);

      // top employees, customers, products, suppliers,...
      const topDataRes = await storeApi.getReportTop(
        store_uuid,
        46,
        fromDate,
        toDate,
        limit
      );

      setTopData(topDataRes)
      console.log("topData", topDataRes)
      // uncomment here
      setIsLoaded(true)
    }
    
    if (store_uuid && branch_id ) {
      fetchReports()
    }
    
  }, [store_uuid, branch_id])
  

  //   useEffect(() => {
  //     customerApi.getCustomers(store_uuid)
  //     .then(response => response.data, err => console.log(err))
  //     .then(data => {
  //         setCustomerList(data)
  //     })

  // }, [reload, store_uuid]);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await productApi.getProductsOfBranch(
  //         store_uuid,
  //         branch_uuid
  //       );
  //       setProductList(response.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   if (reload) {
  //     fetchProducts();
  //     setReload(false);
  //   }
  // }, [reload, store_uuid, branch_uuid]);




    ///////////
    // const info = useSelector((state) => state.info);
    // const store_uuid = info.store.uuid;
    const [data, setData] = useState({
      customerSales:[],
      employeeSales:[],
      inAccount:0,
      numOfBranches:0,
      numOfCustomers:0,
      numOfEmployees:0,
      numOfProducts:0,
      outAccount:0,
      product_report:[],

    });
    
    
    // const fetchReport = async (period) => {
    //   const res = await storeApi.getReport(store_uuid, period);
    //   console.log(res.data);
    //   setData(res.data)
    // };
  
    // useEffect(() => {
    //   fetchReport(7)
    // }, [])

    // console.log("data")
    // console.log(data)

    return isLoaded && (
      <Card className={classes.root}>
             {/* 1. */}
            <div className={classes.row}>
              <Grid 
              container 
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              className={classes.header}
              >
                  <Grid item >
                    <Typography className={classes.headerTitle} variant="h5">
                        Tổng quan
                      </Typography> 
                  </Grid>
                  <Grid item  >
                    <FormControl
                          className={classes.formControl}
                          style={{marginTop:-5}}
                          // fullWidth
                          size="small"
                          variant="outlined"
                        >
                          <Select
                            labelId="demo-simple-select-outlined-label"
                            id="time"
                            name="time"
                            size="small"
                            onChange={handleChangeTime}
                            // label=" Chi nhánh"
                            defaultValue="today"
                            value={time}
                          >
                            <MenuItem value="today">Hôm nay</MenuItem>
                            <MenuItem value="7day">7 ngày gần nhất</MenuItem>
                            <MenuItem value="30day">30 ngày gần nhất</MenuItem>
                            <MenuItem value="365day">365 ngày gần nhất</MenuItem>
                            <MenuItem value="advance">Tìm kiếm nâng cao</MenuItem>
                          </Select>
                        </FormControl>
                    
                        <ColorButtonPink variant="contained" size="small" className={classes.row} style={{marginLeft:20}}>
                              Báo cáo
                        </ColorButtonPink>
                         <ColorButtonYellow variant="contained" size="small" className={classes.row} style={{marginLeft:10}}>
                            <GetAppTwoToneIcon fontSize="small"/>
                              Báo cáo
                        </ColorButtonYellow>
                  </Grid>

              </Grid>   
            </div>


           {/* <Divider className={classes.divider}/> */}
        
           {/* 2. OverallReport  */}
            <OverallReport  data={overview}/>
           
            {/* 3.  */}
            <Grid container spacing={3} >
                <Grid  item xs={12} md={7} >
                    <ProductReport productList={productList}/>   
                
                </Grid>
                
                <Grid  item xs={12} md={5}  style={{textAlign:'center'}}> 
                    <CategoryReport categoryList={categoryList}/>
                </Grid>
            </Grid>

          {/* 4.  */}
            <Grid container spacing={3} >
                <Grid  item xs={12} md={5} >
                    <BranchReport branchList={branchList}/>   
                </Grid>
                
                <Grid  item xs={12} md={7}  style={{textAlign:'center'}}> 
                    <MoneyReport moneyData={moneyData}/>        
                </Grid>
            </Grid>
            
            

            <Grid container spacing={3} >
                <Grid  item xs={12} md={4} >
                    <EmployeeReport  employeeSales={data.employeeSales}/>       
                </Grid>
              
                <Grid  item xs={12} md={4}  style={{textAlign:'center'}}> 
                      <CustomerReport  customerSales={data.customerSales}/>       
                </Grid>
                <Grid  item xs={12} md={4}  style={{textAlign:'center'}}> 
                    <SupplierReport  supplierList={supplierList}/>       
                </Grid>
            </Grid>

      </Card>
        
    )
}

export default Report