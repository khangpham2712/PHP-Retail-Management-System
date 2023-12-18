import React from 'react'
import Chart from 'react-apexcharts';
import {Typography,Divider,Card,Grid,Paper,Avatar,Box,Button,ListItem,ListItemIcon,ListItemText} from '@material-ui/core';
import clsx from "clsx";
import {useTheme,makeStyles,withStyles,createStyles,lighten} from "@material-ui/core/styles";
import { grey, blue,purple} from '@material-ui/core/colors'
import FolderIcon from '@material-ui/icons/Folder';
import {VNDFormat, ThousandFormat} from "../../../components/TextField/NumberFormatCustom"


const useStyles = makeStyles((theme) =>
createStyles({
  row:{
    flexGrow: 1,
    marginBottom:20,
  },
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    paddingTop:10
  },
  overall:{
    background:'#13d0f2',
  },
  pink: {
    color: '#000',
    backgroundColor: '#ff007d',
    marginTop:5,
    marginLeft:5
  },
  yellow: {
    color: '#000',
    backgroundColor: '#ffc400',
    marginTop:5,
    marginLeft:5,
    // width: theme.spacing(3),
    // height: theme.spacing(3),
  },
  blue: {
    color: '#000',
    backgroundColor: '#00e5ff',
    marginTop:5,
    marginLeft:5
  },
  number:{
    //   fontSize:20,
    //   fontWeight:500
        fontSize:30,
      fontWeight:500
  },
  count:{
    fontSize:20,
    fontWeight:500 ,
    color:'#fff'
  },
  ava:{
    // backgroundColor: '#ffc400',
    backgroundColor: '#3BD49F',
  },
  hoverCard:{
    boxShadow:' 0px 10px 20px rgba(0,0,0,0.1)',
    "&:hover": {
      boxShadow:'0px 10px 20px rgba(0,0,0,0.15)',
    },
    textAlign: 'center',
    color: theme.palette.text.secondary,
    paddingTop:10,
    borderRadius:theme.customization.borderRadius
},
 
}));

export const OverallReport = ({data}) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const chartIncome = {
        type: 'area',
        height: 70,
        series: [
            {
                name: 'Doanh thu',
                data: [45, 66, 41, 89, 25, 44, 9]
            }
        ],
        options: {
            chart: {
                sparkline: {
                    enabled: true
                },
            },
            dataLabels: {
                enabled: false
            },
            
            stroke: {
                curve: 'smooth',
                width: 2
            },
            xaxis: {
                type: 'datetime',
                categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
            },
        
            tooltip: {
                x: {
                  format: 'dd/MM/yy HH:mm'
                },
            },
            colors: ['#00e5ff'],
        },
        
    };
    const chartExpense = {
        type: 'area',
        height: 70,
        series: [
            {
                name: 'Chi tiêu',
                data: [45, 66, 41, 89, 25, 44, 9]
            }
        ],
        options: {
            chart: {
                sparkline: {
                    enabled: true
                },
            },
            dataLabels: {
                enabled: false
            },
            
            stroke: {
                curve: 'smooth',
                width: 2
            },
            xaxis: {
                type: 'datetime',
                categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
            },
        
            tooltip: {
                x: {
                  format: 'dd/MM/yy HH:mm'
                },
            },
            colors: ['#ffc400'],
            animations:{
                enabled: true,
            },
        },
        
    };

    const chartInvoice ={
        type: 'area',
        height: 70,
        series: [
            {
                name: 'Chi tiêu',
                data: [45, 66, 41, 89, 25, 44, 9]
            }
        ],
        options: {
            chart: {
                sparkline: {
                    enabled: true
                },
            },
            dataLabels: {
                enabled: false
            },
            
            stroke: {
                curve: 'smooth',
                width: 2
            },
            xaxis: {
                type: 'datetime',
                categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
            },
        
            tooltip: {
                x: {
                  format: 'dd/MM/yy HH:mm'
                },
            },
            colors: ['#ff007d'],
        },
    }
  

    return (
        <div className={classes.row}>
            <Grid container spacing={3}>
            
            <Grid  item md={4}xs={12} >
                <Card className={clsx(classes.hoverCard, classes.overall)} style={{padding:10}}>
                    <Grid container  spacing={3}>
                        <Grid container item xs={6} >
                            <Grid item xs={4} style={{minWidth:40}}>
                                <Avatar className={classes.ava} style={{backgroundColor:'#ff007d'}}> 
                                    <FolderIcon/>
                                </Avatar>   
                            </Grid>
                            
                            <Grid  item  xs={8}  style={{textAlign:'center'}}>
                                <Typography>Mặt hàng</Typography>
                                <Typography className={classes.count}>{data.numOfProducts}</Typography>
                            </Grid>
                          
                        </Grid>  
                        <Grid container item xs={6} >
                            <Grid item xs={4} style={{minWidth:40}}>
                                    <Avatar  style={{backgroundColor:'#ffc400'}}> 
                                        <FolderIcon/>
                                    </Avatar>   
                                </Grid>
                                
                                <Grid  item  xs={8}  style={{textAlign:'center'}}>
                                    <Typography>Nhân viên</Typography>
                                    <Typography className={classes.count}>{data.numOfEmployees}</Typography>
                                </Grid>
                            </Grid>
                        <Grid container item xs={6} >
                            <Grid item xs={4} style={{minWidth:40}}>
                                <Avatar style={{backgroundColor:'#8ae600'}}> 
                                    <FolderIcon/>
                                </Avatar>   
                            </Grid>
                            
                            <Grid  item  xs={8}  style={{textAlign:'center'}}>
                                <Typography>Khách hàng</Typography>
                                <Typography className={classes.count}>{data.numOfCustomers}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container item xs={6} >
                            <Grid item xs={4} style={{minWidth:40}}>
                                <Avatar style={{backgroundColor:"#b870ff"}}> 
                                    <FolderIcon/>
                                </Avatar>   
                            </Grid>
                            
                            <Grid  item  xs={8}  style={{textAlign:'center'}}>
                                <Typography>Chi nhánh</Typography>
                                <Typography className={classes.count}>{data.numOfBranches}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                </Card>
            </Grid>

            <Grid container item md={8} xs={12} spacing={3}>
                <Grid item md={4}xs={12}>
                    <Card className={classes.hoverCard}>
                        <Typography>Tổng thu</Typography>
                        <Typography className={classes.number}><ThousandFormat value={data.inAccount}/></Typography>
                        <Chart {...chartIncome} />   
                    </Card>
                </Grid>
                <Grid item md={4}xs={12}>
                    <Card className={classes.hoverCard}>
                        <Typography>Tổng chi</Typography>
                         <Typography className={classes.number}><ThousandFormat value={data.outAccount}/></Typography>
                        <Chart {...chartExpense}/>    
                    </Card>
                </Grid>
                <Grid item md={4} xs={12}>
                    <Card className={classes.hoverCard}>
                        <Typography>Tổng lợi nhuận</Typography>
                        <Typography className={classes.number}>200.000</Typography>
                        <Chart {...chartInvoice}/>
                    </Card>
                </Grid>
            </Grid>
            
            </Grid> 

        </div>
    )
}
export default OverallReport