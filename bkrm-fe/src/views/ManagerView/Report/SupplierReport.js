import React from 'react'
import {useTheme, makeStyles,withStyles,createStyles,lighten} from "@material-ui/core/styles";
import {Typography,Divider,Grid,Card,Avatar,TableBody,TableRow,TableCell,Paper,Box,Button,ListItem,ListItemIcon,ListItemText} from '@material-ui/core';
import TableHeader  from '../../../components/TableCommon/TableHeader/TableHeader'
import TableWrapper from '../../../components/TableCommon/TableWrapper/TableWrapper'
import ava from '../../../assets/img/product/lyimg.jpeg';


const useStyles = makeStyles((theme) =>
createStyles({
    headerTitle:{
        fontSize: '1.125rem',
      },
      header:{
        padding:20,
     
      },

}));

const SupplierReport = (props) => {
    const {supplierList} = props;
    const theme = useTheme();
    const classes = useStyles(theme);

    
    return (
        <Card>
            <Grid container direction="row"justifyContent="space-between" alignItems="center" className={classes.header} >
                  <Grid item >
                      <Typography className={classes.headerTitle} variant="h5">
                            Top 10 nhà cung cấp
                      </Typography> 
                  </Grid>
                  <Grid item  >
                        <Typography variant="h5"  style={{cursor: 'pointer',color:'#1b74e4'}}>
                            Xem chi tiết
                        </Typography>
                  </Grid>
              </Grid>
              <TableWrapper isCart={true}>
                <TableHeader
                    classes={classes}
                    headerData={SupplierHeadCells}
                />
                <TableBody>
                {supplierList.map((row, index) => {
                    return (
                        <TableRow >
                            {/* <TableCell align="left">{index + 1}</TableCell> */}
                            <TableCell align="left" style={{minWidth:200}} >
                                <ListItem  style={{marginLeft:-30, marginTop:-10, marginBottom:-10 }}>
                                    <Typography className={classes.fontName} style={{marginRight:20}}>{index + 1}</Typography>
                                    <Avatar alt="Remy Sharp" src={ava} style={{marginRight:20}} className={classes.ava} />
                                    <Typography className={classes.fontName}>{row.name}</Typography>
                                </ListItem>  
                            </TableCell>
 
                            <TableCell align="left" >{row.total_cost}</TableCell> 
                            <TableCell align="left">{row.phone}</TableCell>
                            
                        </TableRow>
                    );
                })}
                </TableBody>
            </TableWrapper>
            
            
        </Card>
    )
}

export default SupplierReport



const SupplierHeadCells = [
    // { id: 'id', align: 'left', disablePadding: true, label: 'Stt' },
    { id: 'name', align: 'center', disablePadding: true, label: 'Khách hàng' },
    { id: 'total', align: 'left', disablePadding: true, label: 'Tổng tiền' },  
    { id: 'phone', align: 'left', disablePadding: true, label: 'Sđt' },
];
