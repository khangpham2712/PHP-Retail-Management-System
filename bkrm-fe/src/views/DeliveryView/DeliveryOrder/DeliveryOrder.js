import React, {useState, useEffect} from 'react'
import {useTheme} from "@material-ui/core/styles";
//import style
import useStyles from "../../../components/TableCommon/style/mainViewStyle";
//import lib
import {Typography,Card, Button,Divider ,Grid,ButtonBase,Avatar,Tooltip,TableBody} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

//import api 

// import redux
import { customizeAction } from "../../../store/slice/customizeSlice";
import { useDispatch,useSelector } from "react-redux";
import { Link } from "react-router-dom";


//import constant
import * as HeadCells from '../../../assets/constant/tableHead'
import *  as TableType from '../../../assets/constant/tableType'

////import project

import InventoryOrderTableRow from './InventoryOrderTableRow/InventoryOrderTableRow'
//chung
import TableHeader  from '../../../components/TableCommon/TableHeader/TableHeader'
import ToolBar from '../../../components/TableCommon/ToolBar/ToolBar'
import TableWrapper from '../../../components/TableCommon/TableWrapper/TableWrapper'

import JSONdata from '../../../assets/JsonData/invoice.json'


const DeliveryOrder = () => {
    // fetch data here
    const inventoryOrderList = JSONdata;


    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();


    //// 2. Table
    //collapse
    const [openRow, setRowOpen] = React.useState(null);
    const handleOpenRow = (row) => {
        if (row !==  openRow){setRowOpen(row);}
        else{setRowOpen(null)}  
    };

    // header sort 
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('id');
    
    const handleRequestSort = (event, property) => {
      //// (gửi order vs orderBy lên api) -> fetch lại data để sort
      // const isAsc = orderBy === property && order === 'asc';
      // setOrder(isAsc ? 'desc' : 'asc');
      // setOrderBy(property);
    };

    return (
      
        <Card className={classes.root} >
          <Grid 
            container
            direction="row"
            justifyContent="space-between"  
          > 
              {/* 1. ADD POP UP */}
                <Typography className={classes.headerTitle} variant="h5">
                    Đơn giao hàng
                </Typography>

          </Grid>
    
          <Divider />
          
          {/* 2. SEARCH - FILTER - EXPORT*/}
          {/* SAU NÀY SỬA LẠI TRUYỀN DATA SAU KHI FILTER, SORT, LỌC CỘT VÀO */}
          <ToolBar  dataTable={inventoryOrderList} tableType={TableType.INVENTORY_ORDER} /*handlePrint={handlePrint}*/ />

          
          {/* 3. TABLE */}
          {/* <TableWrapper>
              <TableHeader
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                headerData={HeadCells.DeliveryHeadCells}
              />
              <TableBody>
                {inventoryOrderList.map((row, index) => {
                    return (
                      <InventoryOrderTableRow key={row.uuid} row={row}  openRow={openRow}  handleOpenRow={handleOpenRow} />
                    );
                })}
              </TableBody>
          </TableWrapper> */}
        </Card>
    )
}

export default DeliveryOrder
