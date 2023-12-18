import React, {useState,useEffect} from 'react'
import {useTheme, makeStyles,withStyles,createStyles,lighten} from "@material-ui/core/styles";
import { grey, blue,purple} from '@material-ui/core/colors'
import ReactApexChart from 'react-apexcharts';
import Chart from 'react-apexcharts';

import {Typography,Divider,Card,Grid,Paper,InputAdornment,Box,TextField,Button,InputLabel,MenuItem,FormControl,Select,ListItem,ListItemIcon,ListItemText} from '@material-ui/core';
import ava from '../../../../assets/img/product/lyimg.jpeg';
import DayReportSelect from "../../../../components/Select/DayReportSelect"
import BranchSelect from "../../../../components/Select/BranchSelect"
import TopSelect from "../../../../components/Select/TopSelect"
import TypeReportSelect from "../../../../components/Select/TypeReportSelect"
import ReportCard from "../../../../components/CardWrapper/ReportCard"
import storeApi from "../../../../api/storeApi";
import defaultProduct from "../../../../assets/img/product/default-product.png"

import { useSelector } from 'react-redux'
import SearchTwoToneIcon from "@material-ui/icons/SearchTwoTone";
import barcodeIcon from "../../../../assets/img/icon/barcode_grey.png";
import { TreeSelect,Tree } from 'antd';
import productApi from "../../../../api/productApi";
import {removeAccents} from "../../../../utils"
import CategorySelect from '../../../../components/Select/CategorySelect';
import moment from 'moment';


const ProductStatistics = () => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branch_uuid = info.branch.uuid;
    const branches = info.store.branches 
  console.log("branches",branches)
  // category id to view to item by root category
  // should be selected by a drop down and pass as category_id=> category uuid đc ko
  const [categoryId, setCategoryId] = useState('all');
  const [topData, setTopData] = useState([])
  const [saveTopData, setSaveTopData] = useState([])

  // const [categoryList, setCategoryList] = useState([]);


  // const recursiveSearchTree = (category) => {
  //   const findedCategory=category.find(e => e.uuid === categoryId);
  //   if(findedCategory){return findedCategory}
  //   for(let i = 0; i< category.length ; i++){
  //     if(category[i].children.length > 0){return recursiveSearchTree(category[i].children)}
  //   } 
  // };
  // const getAllChild  =(cat) => {
  //   if(!cat){return}
  //   if(cat.children.length === 0){return cat.uuid}
  //   return cat.children.map((child)=>{
  //     return getAllChild(child)
  //   })
  // }
  // const filterCategory = () =>{
  //   if(categoryId === 'all') {
  //     setTopData(saveTopData)
  //   }else{
  //     let cat =  recursiveSearchTree(categoryList)
  //     let allChild = cat?.children?.length !== 0? getAllChild(cat) : []
  //     allChild =  [].concat.apply([], allChild)
  //     let allCat =  allChild ?[... allChild, cat?.uuid]: allChild
  //     setTopData(saveTopData.filter(data =>  allCat?.includes(data.category_uuid ) ))
  //   }
  // }


  

  // const fetchAllCategory = async () => {
  //   try {
  //     const response = await productApi.getNestedCategory(store_uuid);
  //     setCategoryList(response.data);
  //   } catch (error) { }
  // };
 


  const fetchTopData = async () =>{
    const branchId = selectedBranches ==='all'?'':selectedBranches.id
    const topDataRes = await storeApi.getReportTop( store_uuid,branchId, dayQuery.fromDate, dayQuery.toDate );
    setTopData(topDataRes.top_product)
    setSaveTopData(topDataRes.top_product)

  }
   // 
   const today = new Date()
   const [dayQuery,setDayQuery] = useState({
    //  fromDate: new Date(today.setDate(today.getDate() - 7 +1)).toISOString().split('T')[0],
    //  toDate: new Date().toISOString().split('T')[0],
    fromDate:  moment(new Date(today.getFullYear(), today.getMonth(), 1)).format("YYYY-MM-DD") ,
    toDate:  moment(new Date(today.getFullYear(), today.getMonth()+1, 0)).format("YYYY-MM-DD"),
   });


  //  const [selectedBranches, setSelectedBranches] = useState(branches?branches:[]);
  const [selectedBranches, setSelectedBranches] = useState('all');
   const [limit, setLimit] = useState({bestSeller:10, revenue:10, profit:10 });
   const handleChangeLimit =  (event) => {
     const { name,value } = event.target;
     setLimit((prevState) => { return { ...prevState, [name]: value, };
    })};
   //

  useEffect(() => {
      if (store_uuid && branch_uuid ) {
        fetchTopData()
        // fetchAllCategory();
      }   
  }, [])
    useEffect(() => {
      if (store_uuid && branch_uuid ) {
        fetchTopData()
      }   
  }, [store_uuid,dayQuery,selectedBranches])

  // useEffect(()=>{
  //   if(categoryList&& topData) {filterCategory()}
  // },[categoryId])
  console.log("topData",topData)
   
    let topSortedRevenue = topData ? [...topData] :[]
    topSortedRevenue.sort((a, b) => Number(b.total_sell_price) - Number(a.total_sell_price) ) 

    let topProfit = topData ? [...topData] :[]
    topProfit.sort((a, b) => Number(b.profit) - Number(a.profit) ) 

    let topBestSeller = topData ? [...topData] :[]
    topBestSeller.sort((a, b) => Number(b.total_quantity )- Number(a.total_quantity) ) 

    var dataRevenue= {   
      series: [{
        name: 'Tổng doanh thu',
        data: topSortedRevenue ? topSortedRevenue.map((item) =>item.total_sell_price).slice(0, limit.revenue) :[],
      }],
      options: {
        ...data.options,
        xaxis:{
          ...data.options.xaxis,
          categories:  topSortedRevenue ? topSortedRevenue.map((item) =>item.name).slice(0, limit.revenue) :[],
        }
      }
    };

    //          
    var dataProfit= {   
      series: [{
        name: 'Tổng lợi nhuận',
        data: topProfit ? topProfit.map((item) =>item.profit).slice(0, limit.profit) :[]
      }],
      options: {
        ...data.options,
        xaxis:{
          ...data.options.xaxis,
          categories:   topProfit ? topProfit.map((item) =>item.name).slice(0, limit.profit) :[],
        }
      },
    };
           

    var dataBestSeller= {   
      series: [{
        name: 'Số lượng bán',
        data: topBestSeller ? topBestSeller.map((item) =>item.total_quantity).slice(0, limit.bestSeller) :[]

      }],
      options: {
        ...data.options,
        xaxis:{
          ...data.options.xaxis,
          categories: topBestSeller ? topBestSeller.map((item) =>item.name).slice(0, limit.bestSeller) :[],
        }
      },
      
    };

    const categoryData = {
      value:[20, 30, 10, 15, 15],
      title:["Quần áo", "Giày dép", "Mắt kính", 'Túi xách', "Trang sức"]
    }

    const dataCategory = {
      type:"donut",
      // DATA HERE : value
      series: categoryData.value,
      
      options: {
         // DATA HERE : name
        labels: categoryData.title,
        chart: {
          type: 'donut',
        },
        colors:['#06C9D6','#FFC90C', '#E56A75','#00C292','#FB9677','#ff007d','#9c4afb','#b6fb4a','#4afbe8'],
        // colors:[ '#00e5ff','#FFC90C', '#ff007d','#00C292','#FB9677','#E56A75',],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 50
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
    }

  
    console.log("topData",topData)
    const sumAllValue = categoryData.value.reduce((a, b) => a + b, 0)
    const [type,setType] = useState("revenue")
  return (
    <Card className={classes.root}>
    {/* 1. */}
    <ReportCard  title={"Báo cáo sản phẩm"} 
    ToolBar={
      <ListItem  style={{margin:0, padding:0}}>
        {/* <TreeSelect
          // id="category"
          // name="category"  
          style={{ width: 220}}   
          // dropdownStyle={{ maxHeight: 400, overflow: 'auto',zIndex:100000000  }}
          treeData={[{ title:'Tất cả danh mục',value:'all'},...categoryList]}
          // value={categoryId}
          // onChange={(val)=>setCategoryId(val )}
          // onSelect={onSelect}
          treeDefaultExpandAll
          placeholder="Danh mục"
          
        /> */}
        <CategorySelect  data={topData} saveData={saveTopData} setData={setTopData}/>
        {branches?.length === 1?null: <BranchSelect haveAllOption={true}selectedBranches={selectedBranches} setSelectedBranches={setSelectedBranches}/>}
        <DayReportSelect dayQuery={dayQuery} setDayQuery={setDayQuery}/>
      </ListItem>
      }
    />

      <Grid container spacing={3} style={{marginTop:10}}> 
        <Grid   item md={6} xs={12} >
            <ReportCard  limitTitle={`Top ${limit.revenue}`}  typeTitle={'doanh thu'}  ToolBar={<TopSelect name="revenue" handleChangeLimit={handleChangeLimit} limit={limit.revenue} />} > 
                <ReactApexChart options={dataRevenue.options} series={dataRevenue.series} type="bar" height={350} />
            </ReportCard>
        </Grid>
        <Grid  item md={6} xs={12} > 
            <ReportCard   limitTitle={`Top ${limit.profit}`}  typeTitle={'lợi nhuận'}   ToolBar={<TopSelect name="profit" handleChangeLimit={handleChangeLimit} limit={limit.profit} />} > 
                <ReactApexChart options={dataProfit.options} series={dataProfit.series} type="bar" height={350} />
            </ReportCard>
        </Grid>
    </Grid>

    <ReportCard  limitTitle={`Top ${limit.bestSeller}`}  typeTitle={'bán chạy'}   ToolBar={<TopSelect name="bestSeller" handleChangeLimit={handleChangeLimit} limit={limit.bestSeller} />} > 
        <ReactApexChart options={dataBestSeller.options} series={dataBestSeller.series} type="bar" height={350} />
    </ReportCard>

    <DetailStatisticProduct data={topData}/>
    

</Card>
  )

}
export default ProductStatistics
const title = ["Bán chạy", " doanh thu"," lợi nhuận" ]


const DetailStatisticProduct = (props) =>{

  const {data} = props
  const theme = useTheme();
  const classes = useStyles(theme);
  const [productData , setProductData] = useState(data? data.sort((a, b) => Number(b.total_quantity) - Number(a.total_quantity)):[])

  useEffect(() => {
    setType("best-seller")
    setProductData(data)
}, [data])

  // function removeAccents(str) {
  //   return str.normalize('NFD')
  //             .replace(/[\u0300-\u036f]/g, '')
  //             .replace(/đ/g, 'd').replace(/Đ/g, 'D');
  // }

  const [type,setType] = useState("best-seller")

  const handleChangeType = (e)  =>{
    setType(e.target.value)
    console.log("e.target.value",e.target.value)
    let newProductData = [...productData] ;
    if(e.target.value.includes("best-seller")){
      newProductData.sort((a, b) => Number(b.total_quantity) - Number(a.total_quantity) )
      setProductData( newProductData)
    }else if (e.target.value.includes("revenue")) {
      newProductData.sort((a, b) => Number(b.total_sell_price) - Number(a.total_sell_price) )
    }else{
      newProductData.sort((a, b) => Number(b.profit) - Number(a.profit) )
    }
    setProductData( newProductData)
  }
  return(
    <ReportCard  title={`Báo cáo chi tiết`}  
        ToolBar={
          <ListItem style={{padding:0, margin:0}}>
          <TypeReportSelect  type={type} handleChangeType={handleChangeType} label="Sắp xếp theo" title={title}/>
          
          <TextField  style={{  marginLeft: 10 }}  variant="outlined"    placeholder={"Tìm sản phẩm..."} 
              InputProps={{ 
                startAdornment: (  <InputAdornment position="start">  <SearchTwoToneIcon className={classes.icon} /> </InputAdornment> ),
                endAdornment: (<InputAdornment position="end">  <Box   component="img"    sx={{ height: 23, width: 23 }}  src={barcodeIcon} />  </InputAdornment> ),
                className: classes.search,
              }}
              onChange={(e)=>{
                console.log('e')
                if(e.target.value.length === 0 ) { setProductData(data)}
                else{
                  let newProductData = productData.length !== 0 ?[...data]:[]
                  newProductData = newProductData.filter(item  => removeAccents(item.name.toUpperCase()).includes(removeAccents(e.target.value).toUpperCase()))
                  setProductData(newProductData)
                }
              }}
          
            />
            </ListItem>
        } > 
        <Grid container justifyContent='space-between' alignItems='center'  >
            <Grid item xs={4}><Typography style={{fontSize:17,fontWeight:500,}}>Sản phẩm</Typography></Grid>
            <Grid item xs={2}><Typography style={{ fontSize:17,fontWeight:500,textAlign:"center"}}>SL bán</Typography></Grid>
            <Grid item xs={2}><Typography style={{fontSize:17,fontWeight:500,textAlign:"center"}}>Doanh thu</Typography></Grid>
            <Grid item xs={2}><Typography style={{fontSize:17,fontWeight:500,textAlign:"center"}}>Tổng lợi nhuận</Typography></Grid>
        </Grid>

        <Divider style={{marginTop:15, marginBottom:10}} />
        {productData?.map((item)=>{
          const img_urls = item.img_urls ? JSON.parse(item.img_urls).at(0):null
          // img_urls
            return(
            <Box key={item.uuid}style={{marginBottom:10}}>
            <Grid container justifyContent='space-between' alignItems='center' style={{marginBottom:10}} >
               <Grid item xs={4}>
                  <Box style={{}}>
                      <ListItem style={{ margin:0, padding:0 }}  >
                          <Box  component="img"  sx={{ height: 50, width: 50, borderRadius: 10, marginRight: 15 }}  src={img_urls ?img_urls :defaultProduct } />
                          <Typography style={{ fontSize:16, fontWeight:500}} >{item.name}</Typography>
                      </ListItem>
                  </Box>
                </Grid>
                <Grid item xs={2}><Typography style={{ fontSize:16,textAlign:"center"}}>{item.total_quantity ? item.total_quantity.toLocaleString() :0}</Typography></Grid>
                <Grid item xs={2}><Typography style={{ fontSize:16,textAlign:"center"}}>{ item.total_sell_price ? item.total_sell_price.toLocaleString() :0}</Typography></Grid>
                <Grid item xs={2}><Typography style={{ fontSize:16,textAlign:"center"}}>{ item.profit ? item.profit.toLocaleString() :0}</Typography></Grid>
            </Grid>
            <Divider />
            </Box>
            )
        })}
     </ReportCard>
  )
}


const useStyles = makeStyles((theme) =>
  createStyles({
    search: {
      borderRadius: theme.customization.borderRadius,
      height: 40,
      marginLeft: 10,
      backgroundColor:
        theme.customization.mode === "Light" ? grey[50] : grey[700],
    },
    root:{
      background: theme.customization.mode === "Light"? '#fafbfb': grey[800],
      borderRadius:theme.customization.borderRadius, color: '#000000',  color: '#fafbfb',boxShadow: "none", padding:20, // paddingRight:10, // paddingLeft:20,
      margin:-20
    }
  
}));


var data = {
  options: {
    chart: { type: 'bar', minHeight: 350 },
    plotOptions: { bar: { borderRadius: 4, horizontal: true,  }},
    dataLabels: { enabled: false},
    xaxis: { 
      labels: { 
        formatter: function (value) { return  value >= 1000000? (value/1000000).toFixed().toLocaleString() +' triệu': value >= 1000 ? (value/1000).toFixed().toLocaleString() +'k' :value},
        style: {colors: ['#000'], fontSize: '14px', fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 500, cssClass: 'apexcharts-xaxis-label',  }, 
      }, 
    },
    yaxis: {
      labels: { 
        formatter: function (value) { return value.toLocaleString() ;  },
        style: {colors: ['#000'], fontSize: '12px', fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 500, cssClass: 'apexcharts-xaxis-label',  }, 
      },
    },
  },
}