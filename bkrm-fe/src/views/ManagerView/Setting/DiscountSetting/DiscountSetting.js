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
import AddDiscount from './AddDiscount/AddDiscount'
import DiscountFilter from './DiscountTool/DiscountFilter'

import DiscountTableRow from './DiscountTableRow/DiscountTableRow'
//chung
import SnackBar from '../../../../components/SnackBar/SnackBar'
import TableHeader  from '../../../../components/TableCommon/TableHeader/TableHeader'
import ToolBar from '../../../../components/TableCommon/ToolBar/ToolBar'
import TableWrapper from '../../../../components/TableCommon/TableWrapper/TableWrapper'
import promotionCouponApi from '../../../../api/promotionCouponApi';

import useMediaQuery from "@material-ui/core/useMediaQuery";
import {BillMiniTableRow} from "../../../../components/MiniTableRow/MiniTableRow"

const DiscountSetting = () => {
    // const [discountList, setDiscountList] = useState([]);
    const [newDiscountList, setNewDiscountList] = useState([]);
    const [reload, setReload] = useState(false);

    const onReload = () => setReload(!reload)
    
    const info = useSelector(state => state.info)
    const store_uuid = info.store.uuid;
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
        try {
          const response = await promotionCouponApi.getAllPromotions(
            store_uuid,
            {
              page: pagingState.page,
              limit: pagingState.limit,
            }
          );
          // setPagingState({ ...pagingState, total_rows: response.total_rows });
          setTotalRows(response.total_rows)
          setNewDiscountList(response.promotions);
        } catch (error) {
          console.log(error);
        }
      };
      if (store_uuid) {
        loadData();
      }
    }, [pagingState.page, pagingState.limit, reload]);

   
    // useEffect(() => {
    //     customerApi.getCustomers(store_uuid)
    //     .then(response => response.data, err => console.log(err))
    //     .then(data => {
    //       setDiscountList(data)
    //     })
    // }, [reload, store_uuid]);


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
    console.log("newDiscountList",newDiscountList)
    return (
    <Card className={classes.root} >
    
        <Grid container direction="row" alignItems="center">
            <Typography style={{flexGrow: 1,textAlign: "center", marginTop: 15,}} variant="h2">
              Khuyến mãi
            </Typography>
              <Grid className={classes.btngroup1}  style={{ marginTop:10}}>
                    <ButtonBase sx={{ borderRadius: '16px' }} 
                        onClick={handleClickOpen}
                    >
                    <Avatar variant="rounded" className={classes.headerAvatar}  >
                        <Tooltip title='Thêm chương trình khuyến mãi'>
                        <AddIcon stroke={1.5} size="1.3rem" />
                        </Tooltip>
                    </Avatar>
                </ButtonBase>
              </Grid>

              {/* Popup add */}
              {open && <AddDiscount open={open} handleClose={handleClose} />}
        </Grid>

       
        {/* Noti */}
        <SnackBar openBar={openBar} handleCloseBar={handleCloseBar} addStatus={addStatus}/>

        
        {/* <Divider  openFilter={openFilter} handleToggleFilter={handleToggleFilter}/> */}
        
        {/* 2. SEARCH - FILTER - EXPORT*/}
        {/* SAU NÀY SỬA LẠI TRUYỀN DATA SAU KHI FILTER, SORT, LỌC CỘT VÀO */}
        <ToolBar  dataTable={newDiscountList} tableType={TableType.CUSTOMER} textSearch={'Mã, tên khuyến mãi  '} /*handlePrint={handlePrint}*/ 
        handleToggleFilter={handleToggleFilter}  handlePrint={handlePrint}/>
        <DiscountFilter openFilter={openFilter} handleToggleFilter={handleToggleFilter}/>
        {/* 3. TABLE */}
        {!xsScreen?<TableWrapper
        pagingState={{...pagingState, total_rows: totalRows}}
        setPagingState={setPagingState}
        >
            <TableHeader
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              headerData={HeadCells.DiscountHeadCells}
            />
            <TableBody>
              {newDiscountList?.map((row, index) => {
                // json
                  return (
                    <DiscountTableRow key={row.uuid} row={row}  openRow={openRow}  handleOpenRow={handleOpenRow} />
                  );
              })}
            </TableBody>
        </TableWrapper>:
            newDiscountList?.map((row, index) => {
           
              if(row.promotion_condition.length !== 0) {var promotion_condition = JSON.parse(row.promotion_condition) }
              if(row.dateAdvanceSetting?.length !== 0) {var dateAdvanceSetting = row.dateAdvanceSetting?JSON.parse(row.dateAdvanceSetting) :{}}
              // const discountKey = row.promotion_condition.discountKey === "invoice" ?"Hoá đơn" :"Sản phẩm"
              // const discountType = getDiscountType(promotion_condition?.discountKey,promotion_condition?.discountType )  
              const discountKey = row.discountKey === "invoice" ?"Hoá đơn" :"Sản phẩm"
              const discountType = getDiscountType(row.discountKey,row.discountType )  
              const type = `${discountKey}  -  ${discountType}`  

                return (
                <BillMiniTableRow key={row.uuid} row={row} openRow={openRow} handleOpenRow={handleOpenRow}  onReload={onReload} 
                  totalCost={row.promotion_code}id={row.name} partnerName={type} date={row.end_date} 
                  promotion_condition={promotion_condition} dateAdvanceSetting={dateAdvanceSetting}type={type}
                  typeBill={"Khuyến mãi"} />         
             );})}
        
        <div  style={{display:'none'}} >
        <div ref={componentRef}  >
        <ComponentToPrint  discountList={newDiscountList} classes={classes}/>
        </div>
        
      </div>
      </Card>
    )
}

export default DiscountSetting

const ComponentToPrint = ({discountList,classes}) =>{
  return (
      <div >
        <Typography style={{flexGrow: 1,textAlign: "center",fontSize:20, fontWeight:500, margin:30, color:'#000'}} >Danh sách khuyến mãi</Typography>
        <div >
          <TableHeader
                classes={classes}
                headerData={HeadCells.CustomerHeadCells}
              />
              <TableBody >
                {discountList?.map((row, index) => {
                  return (
                    <DiscountTableRow
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
function getDiscountType (discountKey, discountType){

  if(discountKey === "invoice"){
      if(discountType ==="sendGift"){return "Tặng hàng"}
      else if (discountType ==="sendVoucher"){ return "Tặng voucher"}
      else{ return "Giảm giá hoá đơn"}
  }else{
      if(discountType ==="sendGift"){return "Mua hàng tặng hàng"}
      else{return "Giá bán theo số lượng mua"}
  }
}