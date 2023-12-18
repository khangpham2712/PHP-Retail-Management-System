import React from 'react'
import Chart from 'react-apexcharts';
import {useTheme, makeStyles,withStyles,createStyles,lighten} from "@material-ui/core/styles";
import {Typography,Divider,Grid,Card,Avatar,TableBody,TableRow,TableCell,Paper,Box,Button,ListItem,ListItemIcon,ListItemText} from '@material-ui/core';


const useStyles = makeStyles((theme) =>
createStyles({
    headerTitle:{
        fontSize: '1.125rem',
      },
      header:{
        padding:20,
     
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


const CategoryReport = (props) => {
    const {categoryList} = props;
    const theme = useTheme();
    const classes = useStyles(theme);


    const chartData = {
   
        height:350,
        type:"area",
        series: [{
          name: 'Thu',
          data: [31, 40, 28, 51, 42, 109, 100]
        }, {
          name: 'Chi',
          data: [11, 32, 45, 32, 34, 52, 41]
        }],
        options: {
          chart: {
            height: 350,
            type: 'area',
            toolbar: {
                show: true,
                offsetX: 0,
                offsetY: 0,
                tools: {
                  download: true,
                  selection: false,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                  reset: false | '<img src="/static/icons/reset.png" width="20">',
                  customIcons: []
                },
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth'
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
          colors:['#ffc400', '#00e5ff', '#9C27B0']
        },
    };

    return (
        <Card  className={classes.hoverCard}>
            <Grid container direction="row"justifyContent="space-between" alignItems="center" className={classes.header} >
                  <Grid item >
                      <Typography className={classes.headerTitle} variant="h5">
                            Thu - Chi - Lợi nhuận 
                      </Typography> 
                  </Grid>
                  <Grid item  >
                        <Typography variant="h5"  style={{cursor: 'pointer',color:'#1b74e4'}}>
                            Xem chi tiết
                        </Typography>
                  </Grid>
              </Grid>
            <Chart {...chartData}/>    
        </Card>
    )
}

export default CategoryReport
