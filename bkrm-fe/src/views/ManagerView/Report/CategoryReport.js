import React from 'react'
import Chart from 'react-apexcharts';
import {useTheme, makeStyles,withStyles,createStyles,lighten} from "@material-ui/core/styles";
import {Typography,Divider,Grid,Card,Avatar,TableBody,TableRow,TableCell,Paper,Box,Button,ListItem,ListItemIcon,ListItemText} from '@material-ui/core';
import TableWrapper from '../../../components/TableCommon/TableWrapper/TableWrapper'


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


const CategoryReport = (props) => {
    const {categoryList} = props;
    const theme = useTheme();
    const classes = useStyles(theme);


    const data = {
        type:"donut",
        // DATA HERE : value
        series: [44, 55, 41, 17, 15],
        
        options: {
           // DATA HERE : name
          labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
          chart: {
            type: 'donut',
          },
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

    return (
        <Card  className={classes.hoverCard}>
            <Grid container direction="row"justifyContent="space-between" alignItems="center" className={classes.header} >
                  <Grid item >
                      <Typography className={classes.headerTitle} variant="h5">
                            Danh mục
                      </Typography> 
                  </Grid>
                  <Grid item  >
                        <Typography variant="h5"  style={{cursor: 'pointer',color:'#1b74e4'}}>
                            Xem chi tiết
                        </Typography>
                  </Grid>
              </Grid>
            <Chart {...data}/>  
            <TableWrapper isCart={true}>
           
                <TableBody>
                {categoryList.map((row, index) => {
                    return (
                        <TableRow >
                            <TableCell align="left">{index + 1}</TableCell>
        
                            <TableCell align="left" >{row.name}</TableCell> 
                            <TableCell align="left">{row.total}/55%</TableCell>
                            
                        </TableRow>
                    );
                })}
                </TableBody>
            </TableWrapper>  
        </Card>
    )
}

export default CategoryReport
