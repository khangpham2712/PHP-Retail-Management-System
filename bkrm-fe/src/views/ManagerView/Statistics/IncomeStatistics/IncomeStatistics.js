import React,{useState,useEffect} from 'react'
import Chart from 'react-apexcharts';
import {useTheme, makeStyles,withStyles,createStyles,lighten} from "@material-ui/core/styles";
import {Typography,Divider,Grid,Card,FormControl,Select,MenuItem,Avatar,TableBody,TableRow,TableCell,Paper,Box,Button,ListItem,ListItemIcon,ListItemText} from '@material-ui/core';
import ReportCard from "../../../../components/CardWrapper/ReportCard"
import TypeReportSelect from "../../../../components/Select/TypeReportSelect"
import DayReportSelect from "../../../../components/Select/DayReportSelect"
import BranchSelect from "../../../../components/Select/BranchSelect"
import storeApi from "../../../../api/storeApi";
import { useSelector } from 'react-redux'
import { grey, blue,purple} from '@material-ui/core/colors'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import * as _ from "lodash"
import moment from 'moment';

const IncomeStatistics = () => {   
    const theme = useTheme();
    const classes = useStyles(theme);

    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branch_uuid = info.branch.uuid;
    const branches = info.store.branches

    // must be in format
    const today = new Date()
    const [dayQuery,setDayQuery] = useState({
        fromDate:  moment(new Date(today.getFullYear(), today.getMonth(), 1)).format("YYYY-MM-DD") ,
        toDate:  moment(new Date(today.getFullYear(), today.getMonth()+1, 0)).format("YYYY-MM-DD"),
    });
     //branch
    // const [selectedBranches, setSelectedBranches] = useState(branches?branches:[]);
    const [selectedBranches, setSelectedBranches] = useState('all');
    // unit used for chart data split by day/ month/ year
    const [unit, setUnit] = useState("day");

    const [statistics, setStatistics] = useState({})
    const [overview, setOverview] = useState({})
   
    const fetchStatistic = async () => {
        const branchId = selectedBranches ==='all'?'':selectedBranches.id
        const statisticRes = await storeApi.getReportStatistic(  store_uuid, branchId, dayQuery.fromDate,   dayQuery.toDate, unit );
        setStatistics(statisticRes)
    }
    const fetchOverview = async () =>{
        const branchId = selectedBranches ==='all'?'':selectedBranches.id
        const overViewRes = await storeApi.getReportOverview(store_uuid,branchId, dayQuery.fromDate,   dayQuery.toDate);
        setOverview(overViewRes.data)
    }

   
    
    useEffect(() => {
        if (store_uuid && branch_uuid ) {
            fetchStatistic()
            fetchOverview()
          }   
    }, [])
    useEffect(() => { 
        fetchStatistic()
        fetchOverview()
    }, [store_uuid,unit,dayQuery,selectedBranches])

    const formatXLabel = (value, isFull=false) =>{
        if (!value || !isNaN(value) ){return 0}
        let  list = value?  value?.split("-"): ''
        if(unit ==="day"){
            return !isFull ?  list?.slice(1,3).reverse().join('/') :list?.reverse().join('/')
        }else if(unit ==="month"){
            return list?.slice(0,2).reverse().join('/')
        }else{
            return list[0]
        }
    }

    const formatYLabel = (value) =>{ 
        if(!value){return 0}
        if (value /1000000 >=1 || value /1000000 <=-1){ return ((value /1000000).toFixed(1) ).toLocaleString().concat(" Triệu") }
        else{ return (((value /1000).toFixed() *1000) / 1000).toLocaleString().concat(" Nghìn")  }
    }

    let chartData = {
        height: 350,
        type: 'bar',
        options: {
            chart: {height: 300, type: 'bar', toolbar: { show: true,offsetX: 0,  offsetY: 0, tools: { download: true,selection: true,zoom: true,  zoomin: true,zoomout: true, pan: true, reset: true | '<img src="/static/icons/reset.png" width="20">', customIcons: [] },}},    
            dataLabels: { enabled: false },
            stroke: { show: true, width: 2,  colors: ['transparent'] },
            plotOptions: {
               bar: { horizontal: false,   columnWidth: '55%', endingShape: 'rounded'},
            },
            xaxis: { 
              type: 'date', categories: statistics?.revenue && statistics?.date_list?  statistics?.date_list?.slice(0, statistics.date_list.length -1) : [],
              labels: { 
                  formatter: function (value) { return value?  formatXLabel(value): value },
                  style: {colors: ['#000'], fontSize: '14px', fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 500, cssClass: 'apexcharts-xaxis-label',  }, 
              }, 
              tickAmount: 7,
            },
            yaxis: {
              labels: { 
                   formatter: function (value) {  return value?  formatYLabel(value) :''},
                  style: { colors: ['#000'], fontSize: '14px', fontFamily: 'Helvetica, Arial, sans-serif',  fontWeight: 500, cssClass: 'apexcharts-yaxis-label', },
               },
  
              },
             fill: {  opacity: 1 },
              tooltip: { x: {   format: 'dd/MM/yy' } },
              colors:['#00e5ff','#ffc400',  '#ff007d']
          },
    }
    let chartDataArea = {
        height:350,
        type:"area",
        options: {
          chart: {height: 350, type: 'area', toolbar: { show: true,offsetX: 0,  offsetY: 0, tools: { download: true,selection: true,zoom: true,  zoomin: true,zoomout: true, pan: true, reset: true | '<img src="/static/icons/reset.png" width="20">', customIcons: [] },}},    
          dataLabels: { enabled: false },
          stroke: {  curve: 'smooth' },
          xaxis: { 
            type: 'date', categories: statistics?.revenue && statistics?.date_list?  statistics?.date_list?.slice(0, statistics.date_list.length -1) : [],
            labels: { 
                formatter: function (value) { return value?  formatXLabel(value): value },
                style: {colors: ['#000'], fontSize: '14px', fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 500, cssClass: 'apexcharts-xaxis-label',  }, 
            }, 
            tickAmount: 7,
          },
          yaxis: {
            labels: { 
                 formatter: function (value) {  return value?  formatYLabel(value) :''},
                style: { colors: ['#000'], fontSize: '14px', fontFamily: 'Helvetica, Arial, sans-serif',  fontWeight: 500, cssClass: 'apexcharts-yaxis-label', },
             },

            },
            tooltip: { x: {   format: 'dd/MM/yy' } },
            colors:[ '#00e5ff', '#ff007d','#ffc400',]
        },
    };
 
    let revenueData = {
        ...chartData,
        series: [
            {name: 'Thu',data: statistics.revenue? statistics.revenue.map(Number): []  }, 
            { name: 'Chi',data:statistics.purchase? statistics.purchase.map(Number): [] }, 
            // { name: 'Thu - Chi',data:statistics.purchase? statistics.revenue.map((item, index) => (Number(item) - Number(statistics.purchase[index])) ) : [] }, 
        ],
    };

    let profitData = {
        ...chartDataArea,
        series: [
            {name: 'Doanh thu',data: statistics.revenue? statistics.revenue.map(Number): []  }, 
            { name: 'Giá vốn',data:statistics.capital? statistics.capital.map(Number): [] }, 
            { name: 'Lợi nhuận',data:statistics.revenue && statistics.capital? statistics.revenue.map((item, index) => (Number(item)  - Number(statistics.capital[index])) ): [] }
        ],
    };

    return (
      <div style={{ background: theme.customization.mode === "Light"? '#fafbfb': grey[800],
      borderRadius:theme.customization.borderRadius, color: '#000000',  color: '#fafbfb',boxShadow: "none", padding:20, // paddingRight:10, // paddingLeft:20,
      margin:-20}}
      > 
        <Card className={classes.hoverCard} style={{marginBottom:20}}>
            <Grid  container style={{marginBottom:10}} >
                    <Grid  container item xs={4} md={4} justifyContent="space-between" >
                        <SmallDetailBox bgColor={'#E5F9FB'} color={'#06C9D6'} title={"Doanh thu"} value={overview.inAccount}/>
                        <Divider orientation="vertical" />
                    </Grid>
                    <Grid  container item xs={4} md={4} justifyContent="space-between">
                        <SmallDetailBox bgColor={'#FFF4E5'} color={'#FFC90C'} title={"Tiền nhập hàng"} value={overview.outAccount}/>
                        <Divider orientation="vertical" />
                    </Grid>
                    <Grid  container item xs={4}md={4}  justifyContent="space-between">
                        <SmallDetailBox bgColor={'#FCF2F5'} color={'#E56A75'} title={"Lợi nhuận"} value={_.sum(statistics.profit)}/>
                        <Divider orientation="vertical" />
                    </Grid>
                    {/* <Grid  container item xs={4} md={2} justifyContent="space-between">
                        <SmallDetailBox bgColor={'#EBFAF1'} color={'#00C292'} title={"Công nợ cần thu"} value={overview.receivable}/>
                        <Divider orientation="vertical" />
                    </Grid>
                    <Grid  container item xs={4} md={2} justifyContent="space-between">
                        <SmallDetailBox bgColor={'#EBFAF1'} color={'#00C292'} title={"Công nợ cần trả"} value={overview.payable}/>
                        <Divider orientation="vertical" />
                    </Grid>
                    <Grid  container item xs={4} md={2} justifyContent="space-between">
                        <SmallDetailBox bgColor={'#EBFAF1'} color={'#00C292'} title={"Công nợ cần trả"} value={20}/>
                    </Grid> */}
            </Grid>
        </Card> 
        <ReportCard title={"Thu - chi"} 
            ToolBar={
                <ListItem >
                    <Box>
                        <FormControl  size="small" variant="outlined" >
                            <Select size="small"  onChange={(e)=>setUnit(e.target.value)}  value={unit}  >
                                <MenuItem value="day">Theo ngày</MenuItem>
                                <MenuItem value="month">Theo tháng</MenuItem>
                                <MenuItem value="year">Theo năm</MenuItem>   
                            </Select>
                        </FormControl>
                    </Box>
                    {branches?.length === 1?null: <BranchSelect haveAllOption={true} selectedBranches={selectedBranches} setSelectedBranches={setSelectedBranches}/>}
                    <DayReportSelect dayQuery={dayQuery} setDayQuery={setDayQuery}/>
                </ListItem>
            }   
        > 
            <Chart {...revenueData}/>  

            <Divider style={{ margin:25}} />
            
            <Typography style={{ fontSize:22, marginBottom:25, marginLeft:10}} variant="h5">Lợi nhuận</Typography> 
            <Chart {...profitData}/>    
        </ReportCard>
       

            <Grid container spacing={5}>
                <Grid item lg={6}md={12}>
                    <ReportCard title={"Chi tiết thu - chi"} >
                        <Grid container justifyContent='space-between' alignItems='center'  >
                            <Grid item xs={3}><Typography style={{fontSize:17, fontWeight:500,}}>{unit ==="day" ?"Ngày": unit ==="month" ? "Tháng" :"Năm"  }</Typography></Grid>
                            <Grid item xs={3}><Typography style={{ fontSize:17,fontWeight:500,textAlign:"right" }}>Doanh thu</Typography></Grid>
                            <Grid item xs={3}><Typography style={{fontSize:17,fontWeight:500,textAlign:"right"}}>Tiền nhập</Typography></Grid>
                            <Grid item xs={3}><Typography style={{fontSize:17,fontWeight:500,textAlign:"right"}}>Thu - chi</Typography></Grid>

                        </Grid>
                        <Divider style={{marginTop:15, marginBottom:10}} />
                        {statistics?.revenue?.map((item, index)=>{
                            return(
                            <Box style={{marginBottom:10}}>
                            <Grid container justifyContent='space-between' alignItems='center' style={{marginBottom:10}} >
                                <Grid item xs={3}><Typography style={{ fontSize:16, fontWeight:500}} >{statistics.date_list?  formatXLabel(statistics.date_list[index], true) :null}</Typography></Grid>
                                <Grid item xs={3}><Typography style={{ fontSize:16,textAlign:"right"}}>{Number(item).toLocaleString()}</Typography></Grid>
                                <Grid item xs={3}><Typography style={{ fontSize:16,textAlign:"right"}}>{statistics?.purchase? Number(statistics?.purchase[index]).toLocaleString() : null}</Typography></Grid>
                                <Grid item xs={3}><Typography style={{ fontSize:16,textAlign:"right"}}>{statistics?.purchase? (Number(item) - Number(statistics?.purchase[index])).toLocaleString() : null}</Typography></Grid>
                            </Grid>
                            <Divider />
                            </Box>
                            )
                        })
                        }
                     </ReportCard>
                </Grid> 
                <Grid item lg={6}md={12}>
                    <ReportCard title={"Chi tiết lợi nhuận"} >
                        <Grid container justifyContent='space-between' alignItems='center'  >
                            <Grid item xs={3}><Typography style={{fontSize:17, fontWeight:500,}}>{unit ==="day" ?"Ngày": unit ==="month" ? "Tháng" :"Năm"  }</Typography></Grid>
                            <Grid item xs={3}><Typography style={{ fontSize:17,fontWeight:500,textAlign:"right" }}>Doanh thu</Typography></Grid>
                            <Grid item xs={3}><Typography style={{fontSize:17,fontWeight:500,textAlign:"right"}}>Giá vốn</Typography></Grid>
                            <Grid item xs={3}><Typography style={{fontSize:17,fontWeight:500,textAlign:"right"}}>Lợi nhuận</Typography></Grid>

                        </Grid>
                        <Divider style={{marginTop:15, marginBottom:10}} />
                        {statistics?.revenue?.map((item, index)=>{
                            return(
                            <Box style={{marginBottom:10}}>
                            <Grid container justifyContent='space-between' alignItems='center' style={{marginBottom:10}} >
                                <Grid item xs={3}><Typography style={{ fontSize:16, fontWeight:500}} >{statistics?.date_list ? formatXLabel(statistics?.date_list[index], true) :null}</Typography></Grid>
                                <Grid item xs={3}><Typography style={{ fontSize:16,textAlign:"right"}}>{Number(item).toLocaleString()}</Typography></Grid>
                                <Grid item xs={3}><Typography style={{ fontSize:16,textAlign:"right"}}>{statistics.capital? Number(statistics?.capital[index]).toLocaleString() : null}</Typography></Grid>
                                <Grid item xs={3}><Typography style={{ fontSize:16,textAlign:"right"}}>{statistics.capital? (Number(item) - Number(statistics?.capital[index])).toLocaleString() : null}</Typography></Grid>
                            </Grid>
                            <Divider />
                            </Box>
                            )
                        })}
                     </ReportCard>
                </Grid> 
        </Grid> 
 

    </div>
  )
}

export default IncomeStatistics

const SmallDetailBox = ({bgColor, color, title, value}) =>{
    const theme = useTheme();
    const getValue = (value) => {
        if(Number(value) >= 100000000) {return (value / 1000000).toFixed() + " triệu "} // + (value % 1000000)/1000 + " k"
        return value.toLocaleString()
    }
    return (
            <Box style={{flexGrow:1,textAlign:'center', alignContent:'center', paddingTop:10, paddingBottom:10}} >
                <Grid container justifyContent='center' >
                    <Avatar style={{backgroundColor: theme.customization.mode === "Light"  ? bgColor: color, color: theme.customization.mode === "Light"  ? color:bgColor, width: theme.spacing(7),  height: theme.spacing(7)}}>
                        <AttachMoneyIcon/>
                    </Avatar> 
                </Grid>
            <Typography style={{ fontSize:22,fontWeight:500, marginTop:10}}>{value ? getValue(value) :0}</Typography>
            <Typography  style={{marginTop:4, color:'#777e89'}}>{title}</Typography>
            </Box>
    )
}

const useStyles = makeStyles((theme) =>
createStyles({
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
}));


// const fetchReports = async () => {
//     // revenue, captital, profit, purchase data by 'unit'
//     const revenueRes = await storeApi.getReportRevenue( store_uuid,fromDate, toDate, unit );
//     setRevenue(revenueRes)
//     const captitalRes = await storeApi.getReportCaptital(store_uuid,fromDate, toDate, unit );
//     setCapital(captitalRes)
//     const profitRes = await storeApi.getReportProfit( store_uuid, fromDate, toDate, unit );
//     setProfit(profitRes);
//     const purchaseRes = await storeApi.getReportPurchase( store_uuid, fromDate, toDate, unit ); 
//     setPurchase(purchaseRes);
// }


