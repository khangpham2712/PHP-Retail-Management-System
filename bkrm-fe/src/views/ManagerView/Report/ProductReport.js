import React from 'react'
import {useTheme, makeStyles,withStyles,createStyles,lighten} from "@material-ui/core/styles";
import {Typography,Divider,Grid,Card,Avatar,TableBody,TableRow,TableCell,Paper,Box,Button,ListItem,ListItemIcon,ListItemText} from '@material-ui/core';
import TableHeader  from '../../../components/TableCommon/TableHeader/TableHeader'
import TableWrapper from '../../../components/TableCommon/TableWrapper/TableWrapper'
import ava from '../../../assets/img/product/lyimg.jpeg';
import { FormatedProductStatusReport } from "../../../components/TableCommon/util/format";


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

const ProductReport = (props) => {
    const {productList} = props;
    const theme = useTheme();
    const classes = useStyles(theme);


    return (
        <Card  className={classes.hoverCard}>
            <Grid container direction="row"justifyContent="space-between" alignItems="center" className={classes.header} >
                  <Grid item >
                      <Typography className={classes.headerTitle} variant="h5">
                            Sản phẩm:  Top 10 doanh thu 
                      </Typography> 
                  </Grid>
                  <Grid item  >
                        <Typography variant="h5"  style={{cursor: 'pointer',color:'#1b74e4'}}>
                            Xem chi tiết
                        </Typography>
                  </Grid>
              </Grid>
              <TableWrapper isCart={true} isReport={true}>
                <TableHeader
                classes={classes}
                headerData={InventoryHeadCells}
                />
                <TableBody>
                {productList.map((row, index) => {
                    return (
                        <TableRow>
                           <TableCell align="left">{index + 1}</TableCell>
                            <TableCell align="left" style={{ minWidth: 200 }}>
                                <ListItem
                                    style={{ marginLeft: -30, marginTop: -10, marginBottom: -10 }}
                                >
                                    <Box
                                    component="img"
                                    sx={{ height: 50, width: 50, borderRadius: 10, marginRight: 15 }}
                                    src={row.img_url}
                                    />
                                    <Typography className={classes.fontName}>{row.name}</Typography>
                                </ListItem>
                            </TableCell>
                            <TableCell align="center" style={{minWidth:10}}>
                                <FormatedProductStatusReport quantity={row.branch_quantity} lowStock={row.min_reorder_quantity}/>
                            </TableCell>
                            <TableCell align="left" className={classes.fontName}>
                                SL
                            </TableCell>
                            <TableCell align="left" className={classes.fontName}>
                                Tổng tiền
                            </TableCell>
                        </TableRow>
                    );
                })}
                </TableBody>
            </TableWrapper>
            
            
        </Card>
    )
}

export default ProductReport




export const InventoryHeadCells = [
    { id: 'id', align: 'left', disablePadding: true, label: 'Stt' },
    { id: 'name', align: 'left', disablePadding: false, label: 'Sản phẩm' },
    { id: 'inventory', align: 'left', disablePadding: true, label: 'Tồn kho' },
    { id: 'quantity', align: 'left', disablePadding: true, label: 'Số lượng' },
    { id: 'totalAmount', align: 'left', disablePadding: true, label: 'Tổng tiền' },
];