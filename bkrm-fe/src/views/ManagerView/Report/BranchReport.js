import React from 'react'
import Chart from 'react-apexcharts';
import {useTheme, makeStyles,withStyles,createStyles,lighten} from "@material-ui/core/styles";
import {Typography,Divider,Grid,Card,Avatar,TableBody,TableRow,TableCell,Paper,Box,Button,ListItem,ListItemIcon,ListItemText} from '@material-ui/core';

import ReactApexChart from 'react-apexcharts';

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
        borderRadius:theme.customization.borderRadius,
        marginBottom:25
    },

}));


const BranchReport = (props) => {
    const {categoryList} = props;
    const theme = useTheme();
    const classes = useStyles(theme);

    var data= {   
        series: [{
           // DATA HERE : total value
          data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
        }],
        options: {
          chart: {
            type: 'bar',
            height: 350
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              horizontal: true,
            }
          },
          dataLabels: {
            enabled: false
          },
          // DATA HERE :name
          xaxis: {
            categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
              'United States', 'China', 'Germany'
            ],
          }
        },
      
      
      };

  

    return (
        <Card  className={classes.hoverCard}>
            <Grid container direction="row"justifyContent="space-between" alignItems="center" className={classes.header} >
                  <Grid item >
                      <Typography className={classes.headerTitle} variant="h5">
                            Chi nhánh
                      </Typography> 
                  </Grid>
                  <Grid item  >
                        <Typography variant="h5"  style={{cursor: 'pointer',color:'#1b74e4'}}>
                            Xem chi tiết
                        </Typography>
                  </Grid>
              </Grid>
            {/* <Chart {...options}/>     */}
            <ReactApexChart options={data.options} series={data.series} type="bar" height={350} />

        </Card>
    )
}

export default BranchReport
