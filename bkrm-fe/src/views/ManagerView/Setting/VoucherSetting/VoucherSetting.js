import React, {useState, useEffect,useRef} from 'react'
import {useTheme} from "@material-ui/core/styles";
//import style
import useStyles from "../../../../components/TableCommon/style/mainViewStyle";
//import lib
import {Typography,Card, Button,Divider ,Grid,ButtonBase,Avatar,Tooltip,TableBody} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useReactToPrint } from "react-to-print";
//import api 
import customerApi from '../../../../api/customerApi'
import { useSelector } from 'react-redux'

//import constant
import * as HeadCells from '../../../../assets/constant/tableHead'
import *  as TableType from '../../../../assets/constant/tableType'

////import project
//riêng
import AddVoucher from './AddVoucher/AddVoucher'
import VoucherFilter from './VoucherTool/VoucherFilter'

import VoucherTableRow from './VoucherTableRow/VoucherTableRow'
//chung
import SnackBar from '../../../../components/SnackBar/SnackBar'
import TableHeader  from '../../../../components/TableCommon/TableHeader/TableHeader'
import ToolBar from '../../../../components/TableCommon/ToolBar/ToolBar'
import TableWrapper from '../../../../components/TableCommon/TableWrapper/TableWrapper'
import promotionCouponApi from '../../../../api/promotionCouponApi'

import useMediaQuery from "@material-ui/core/useMediaQuery";
import {BillMiniTableRow} from "../../../../components/MiniTableRow/MiniTableRow"

const VoucherSetting = () => {
    const [voucherList, setVoucherList] = useState([]);
    const [newVoucherList, setNewVoucherList] = useState([]);
    const [reload, setReload] = useState(false);

    const onReload = () => setReload(!reload)
    
    const info = useSelector(state => state.info)
    const store_uuid = info.store.uuid
    const [pagingState, setPagingState] = useState({
      page: 0,
      limit: 10,
    });
    const [totalRows, setTotalRows] = useState(0)
    useEffect(() => {
      setPagingState({ ...pagingState, page: 0 });
    }, [reload, store_uuid]);

    useEffect(() => {
      const loadData = async () => {
        const response = await promotionCouponApi.getAllVouchers(
          store_uuid,
          {
            page: pagingState.page,
            limit: pagingState.limit,
          }
        );
        setNewVoucherList(response.vouchers)
        setTotalRows(response.total_rows)
      }
      if (store_uuid) {
        loadData();
      }
    }, [reload, store_uuid]);

    const theme = useTheme();
    const classes = useStyles(theme);
    const xsScreen = useMediaQuery(theme.breakpoints.down("xs")) ;


    //// 1. Add pop up + noti
    //add
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = (status) => {
      setOpen(false);
      setAddStatus(status);
      if(status === "Success"){
        onReload();
        setOpenBar(true);
      }else if (status === "Fail"){
        setOpenBar(true);
      }
    };

    //status add
    const [addStatus, setAddStatus] = React.useState(null);
    
    //noti
    const [openBar, setOpenBar] = React.useState(false);
    const handleCloseBar = () => {
      setOpenBar(false)
    };

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

    //3. ToolBar

    // toolbar
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    //3.1. search

    //3.2. filter
    const [openFilter, setOpenFilter] = React.useState(false);
    const handleToggleFilter = () => {
      setOpenFilter(!openFilter);
    };

    //3.3. loc cot


    return (

    <Card className={classes.root} >
        <Grid container direction="row" alignItems="center">
            <Typography style={{flexGrow: 1,textAlign: "center", marginTop: 15,}} variant="h2">
              Voucher
            </Typography>
              <Grid className={classes.btngroup1}  style={{ marginTop:10}}>
                    <ButtonBase sx={{ borderRadius: '16px' }} 
                        onClick={handleClickOpen}
                    >
                    <Avatar variant="rounded" className={classes.headerAvatar}  >
                        <Tooltip title='Thêm voucher'>
                        <AddIcon stroke={1.5} size="1.3rem" />
                        </Tooltip>
                    </Avatar>
                </ButtonBase>
              </Grid>

              {/* Popup add */}
              <AddVoucher open={open} handleClose={handleClose} />
        </Grid>

        {/* Noti */}
        <SnackBar openBar={openBar} handleCloseBar={handleCloseBar} addStatus={addStatus}/>

              
        {/* 2. SEARCH - FILTER - EXPORT*/}
        {/* SAU NÀY SỬA LẠI TRUYỀN DATA SAU KHI FILTER, SORT, LỌC CỘT VÀO */}
        <ToolBar  dataTable={voucherList} tableType={TableType.CUSTOMER} textSearch={'Mã, tên voucher '} /*handlePrint={handlePrint}*/ 
        handleToggleFilter={handleToggleFilter}  handlePrint={handlePrint}/>
        <VoucherFilter openFilter={openFilter} handleToggleFilter={handleToggleFilter}/>
        {/* 3. TABLE */}
        {!xsScreen?<TableWrapper>
            <TableHeader
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              headerData={HeadCells.VoucherHeadCells}
            />
            <TableBody>
              {voucherList?.map((row, index) => {
                  return (
                    <VoucherTableRow key={row.uuid} row={row}  openRow={openRow}  handleOpenRow={handleOpenRow} />
                  );
              })}
            </TableBody>
        </TableWrapper>:
        //voucherList
          [{name:"heeloo",key:"xin chai"}]?.map((row, index) => {
            return (
              <BillMiniTableRow key={row.uuid} row={row} openRow={openRow} handleOpenRow={handleOpenRow}  onReload={onReload} 
              totalCost={100}  id={"TEN VOUCHER"} partnerName={"SL:".concat(100)} date={"22/12/2009"} 
              typeBill={"Voucher"} />           
               );
          })}
          
          
        <div  style={{display:'none'}} >
        <div ref={componentRef}  >
        <ComponentToPrint  voucherList={voucherList} classes={classes}/>
        </div>
        
      </div>
      </Card>
    )
}

export default VoucherSetting

const ComponentToPrint = ({voucherList,classes}) =>{
  return (
      <div >
        <Typography style={{flexGrow: 1,textAlign: "center",fontSize:20, fontWeight:500, margin:30, color:'#000'}} >Danh sách voucher</Typography>
        <div >
          <TableHeader
                classes={classes}
                headerData={HeadCells.CustomerHeadCells}
              />
              <TableBody >
                {voucherList?.map((row, index) => {
                  return (
                    <VoucherTableRow
                      key={row.uuid}
                      row={row}
                    
                    />
                  );
                })}
              </TableBody>
        </div>
  </div>
  )
}