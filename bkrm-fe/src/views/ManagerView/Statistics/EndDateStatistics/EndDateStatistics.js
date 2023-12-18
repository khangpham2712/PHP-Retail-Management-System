import React, {useState,useEffect}from 'react'
import {useTheme, makeStyles,withStyles,createStyles,lighten} from "@material-ui/core/styles";
import { grey, blue,purple} from '@material-ui/core/colors'
import {Typography,Divider,Card,Grid,Avatar,Paper,Box,Button,InputLabel,MenuItem,FormControl,Select,ListItem,ListItemIcon,ListItemText} from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ava from '../../../../assets/img/product/lyimg.jpeg';
import DayReportSelect from "../../../../components/Select/DayReportSelect"
import BranchSelect from "../../../../components/Select/BranchSelect"
import { useSelector } from 'react-redux'
import storeApi from "../../../../api/storeApi";
import defaultProduct from "../../../../assets/img/product/default-product.png"
import ReportCard from "../../../../components/CardWrapper/ReportCard"
import TypeReportSelect from "../../../../components/Select/TypeReportSelect"
import moment from 'moment';

const EndDateStatistic = () => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branch_uuid = info.branch.uuid;
    const branches = info.store.branches 

    const [selectedBranches, setSelectedBranches] = useState('all');

    // 
    const today = new Date()
    const [dayQuery,setDayQuery] = useState({
        // fromDate: new Date(today.setDate(today.getDate() - 7 +1)).toISOString().split('T')[0],
        // toDate: new Date().toISOString().split('T')[0],
        fromDate:  moment(new Date()).format("YYYY-MM-DD"),
        toDate:  moment(new Date()).format("YYYY-MM-DD"),
    });
    //
    const [topData,setTopData] = useState([])
    const [overview, setOverview] = useState({})
    console.log("overview",overview)
    const fetchTopData = async () =>{
        const branchId = selectedBranches ==='all'?'':selectedBranches.id
        const topDataRes = await storeApi.getReportTop( store_uuid,branchId, dayQuery.fromDate, dayQuery.toDate );
        setTopData(topDataRes.top_product.sort((a, b) => Number(b.total_sell_price) - Number(a.total_sell_price) ))

    }
    const fetchOverview = async () =>{
        const branchId = selectedBranches ==='all'?'':selectedBranches.id
        const overViewRes = await storeApi.getReportOverview(store_uuid,branchId, dayQuery.fromDate,   dayQuery.toDate);
        setOverview(overViewRes.data)
    }


    useEffect(() => {
        if (store_uuid && branch_uuid ) {
            fetchTopData()
            fetchOverview()
        }   
    }, [])

    useEffect(() => {
        if (store_uuid && branch_uuid ) {
            fetchTopData()
            fetchOverview()
        }   
    }, [store_uuid,dayQuery,selectedBranches])


  return (
    <div className={classes.root}>
        <Grid container spacing={3}> 
            <Grid  item md={4}xs={12} >
                <Card className={classes.hoverCard} style={{padding:25, paddingRight:10}}>
                <Grid container justifyContent='space-between' >
                    <Grid item >
                        <Typography style={{color:'#757575', fontSize:18,fontWeight:500,}}>Thu - Chi</Typography>
                        <Typography style={{ fontSize:22,fontWeight:500}}>{overview.inAccount ?(Number(overview.inAccount)- Number(overview.outAccount)).toLocaleString() :0}</Typography>
                        <Button  variant='contained'color='primary'size="small" style={{marginTop:15}}>Chi tiết</Button>
                    </Grid>
                    <Grid item >
                        <Box style={{marginBottom:5}}>
                            <DayReportSelect dayQuery={dayQuery} setDayQuery={setDayQuery} defaultSelect={"today"}/>
                        </Box>
                        <Box style={{marginBottom:5}}>
                           {branches?.length === 1?null:   <BranchSelect haveAllOption={true}selectedBranches={selectedBranches} setSelectedBranches={setSelectedBranches}/>}
                        </Box>       
                    </Grid>
                </Grid>
                </Card>  
            </Grid>
            <Grid  item md={8} xs={12} >
                 <Card className={classes.hoverCard} >
                    <Grid  container >
                            <Grid  container item xs={3} justifyContent="space-between">
                                <SmallDetailBox bgColor={'#E5F9FB'} color={'#06C9D6'} title={"Hoá đơn"} value={overview.totalOrders}/>
                                <Divider orientation="vertical" />
                            </Grid>
                            <Grid  container item xs={3} justifyContent="space-between">
                                <SmallDetailBox bgColor={'#FFF4E5'} color={'#FFC90C'} title={"Sản phẩm"} value={topData? topData.reduce((sum,a) => sum + a.total_quantity,0) : 0}/>
                                <Divider orientation="vertical" />
                            </Grid>
                            <Grid  container item xs={3} justifyContent="space-between">
                                <SmallDetailBox bgColor={'#EBFAF1'} color={'#00C292'} title={"Tổng thu"} value={overview.inAccount}/>
                                <Divider orientation="vertical" />
                            </Grid>
                            <Grid  container item xs={3} justifyContent="space-between">
                                <SmallDetailBox bgColor={'#FCF2F5'} color={'#E56A75'} title={"Tổng chi"} value={overview.outAccount}/>
                                
                            </Grid>
                    </Grid>
                </Card> 
            </Grid>
        </Grid>
        <Grid container spacing={2} > 
            <Grid   item md={12} xs={12}style={{marginTop:20}}  >
            <ReportCard  title={`Thống kê sản phẩm`}  >
                {/* <Typography style={{marginBottom:30, fontSize:22}} variant="h5">Thống kê sản phẩm</Typography>  */}
                    <Grid container justifyContent='space-between' alignItems='center'  >
                    <Typography style={{fontSize:17,width:260, fontWeight:500,}}>Sản phẩm</Typography>
                    <Typography style={{ fontSize:17,fontWeight:500}}>SL</Typography>
                    <Typography style={{fontSize:17,fontWeight:500}}>Doanh thu</Typography>
                    </Grid>
                    <Divider style={{marginTop:15, marginBottom:10}} />
                    {topData.map((item)=>{
                        // console.log("item",item)
                        const img_urls = item.img_urls ? JSON.parse(item.img_urls).at(0):null
                        return(
                        <Box style={{marginBottom:10}}>
                        <Grid container justifyContent='space-between' alignItems='center' style={{marginBottom:10}} >
                            <Box style={{width:260}}>
                                <ListItem style={{ margin:0, padding:0 }}  >
                                    <Box  component="img"  sx={{ height: 50, width: 50, borderRadius: 50, marginRight: 15 }}   src={img_urls ?img_urls:defaultProduct } />
                                    <Typography style={{ fontSize:16, fontWeight:500}} >{item.name}</Typography>
                                </ListItem>
                            </Box>
                            <Typography style={{ fontSize:16}}>{item.total_quantity ? item.total_quantity.toLocaleString() :0}</Typography>
                            <Typography style={{ fontSize:16}}>{item.total_sell_price ? item.total_sell_price.toLocaleString() :0}</Typography>
                        </Grid>
                        <Divider />
                        </Box>
                        )
                    })}
                </ReportCard>
            </Grid>
            <Grid  item md={6} xs={12} >
                {/* <Card className={classes.hoverCard} style={{padding:25, marginTop:20}}>
                    <Typography style={{marginBottom:20, fontSize:22}} variant="h5">Thống kê bán hàng </Typography> 

                </Card> */}
            </Grid>
        </Grid>
    </div>
  )
}

export default EndDateStatistic

const SmallDetailBox = ({bgColor, color, title, value}) =>{
    const theme = useTheme();
    const classes = useStyles(theme);
    return (
        <Box style={{flexGrow:1,textAlign:'center', alignContent:'center', paddingTop:10, paddingBottom:10}} >
                <Grid container justifyContent='center' >
                    <Avatar style={{backgroundColor: theme.customization.mode === "Light"  ? bgColor: color, color: theme.customization.mode === "Light"  ? color:bgColor, width: theme.spacing(7),  height: theme.spacing(7)}}>
                        <AttachMoneyIcon/>
                    </Avatar> 
                </Grid>
            <Typography style={{ fontSize:22,fontWeight:500, marginTop:10}}>{value?.toLocaleString()}</Typography>
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