import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@material-ui/core/styles";
//import style
import useStyles from "../../../components/TableCommon/style/mainViewStyle";
//import lib
import {
  Typography,
  Card,
  Divider,
  Grid,
  TableBody,
  Box,
  TableRow,
  TableCell
} from "@material-ui/core";
import { useReactToPrint } from "react-to-print";
import {ThousandFormat, VNDFormat} from '../../../components/TextField/NumberFormatCustom'

//import api

//import constant
import * as HeadCells from "../../../assets/constant/tableHead";
import * as TableType from "../../../assets/constant/tableType";

////import project
//riêng
import InventoryReturnTableRow from "./InventoryReturnTableRow/InventoryReturnTableRow";
import InventoryReturnFilter from "./InventoryReturnTool/InventoryReturnFilter";

//chung
import TableHeader from "../../../components/TableCommon/TableHeader/TableHeader";
import ToolBar from "../../../components/TableCommon/ToolBar/ToolBar";
import TableWrapper from "../../../components/TableCommon/TableWrapper/TableWrapper";

import JSONdata from "../../../assets/JsonData/inventoryReturn.json";
import { useSelector, useDispatch } from "react-redux";
import purchaseReturnApi from "../../../api/purchaseReturnApi";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import {BillMiniTableRow} from "../../../components/MiniTableRow/MiniTableRow"
import Pagination from "../../../components/TableCommon/TableWrapper/Pagination"
import { statusAction } from "../../../store/slice/statusSlice";
import moment from "moment";

const InventoryReturnOrder = () => {
  const [purchaseReturns, setPurchaseReturns] = useState([]);
  const [openRow, setRowOpen] = React.useState(null);

  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const dispatch = useDispatch();

  const theme = useTheme();
  const classes = useStyles(theme);
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs")) ;


  const [reload, setReload] = useState(false);

  const [pagingState, setPagingState] = useState({
    page: 0,
    limit: 10,
  });
  const [totalRows, setTotalRows] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0);

  const initialQuery = {
    startDate: '',
    endDate: '',
    minTotalAmount: null,
    maxTotalAmount: null,
    // status: '',
    paymentMethod: '',
    orderBy: 'purchase_returns.creation_date',
    sort: 'desc',
    searchKey: '',
  };
  const handleRemoveFilter = () => {
    setQuery(initialQuery)
  }
  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    setPagingState({ ...pagingState, page: 0 });
  }, [reload, store_uuid, branch_uuid, query]);
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await purchaseReturnApi.getAllOfBranch(
          store_uuid,
          branch_uuid,
          {
            page: pagingState.page,
            limit: pagingState.limit,
            ...query
          }
        );
        // setPagingState({ ...pagingState, total_rows: response.total_rows });
        setTotalRows(response.total_rows)
        setPurchaseReturns(response.data);
        setTotalAmount(response.total_amount);

      } catch (error) {
        console.log(error);
      }
    };
    if (store_uuid && branch_uuid) {

      loadData();
    }
  }, [pagingState.page, pagingState.limit, branch_uuid, query]);
  const getDataExport = async () => {
    try {
      const response = await purchaseReturnApi.getAllOfBranch(
        store_uuid,
        branch_uuid,
        query,
      );
      return response.data;
    } catch (error) {
      dispatch(statusAction.failedStatus('Không thể lấy dữ liệu'))
      console.log(error);
    }
  }
  const handleOpenRow = (row) => {
    if (row !== openRow) {
      setRowOpen(row);
    } else {
      setRowOpen(null);
    }
  };

  // header sort
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");

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
  const tableRef = React.createRef();

  return (
    <Card className={classes.root}>
      <Grid container direction="row" justifyContent="space-between">
        <Typography className={classes.headerTitle} variant="h5">
          Đơn trả hàng nhập
        </Typography>
      </Grid>

      <Divider />

      {/* 2. SEARCH - FILTER - EXPORT*/}
      {/* SAU NÀY SỬA LẠI TRUYỀN DATA SAU KHI FILTER, SORT, LỌC CỘT VÀO */}
      {/* <ToolBar  dataTable={inventoryReturnList} tableType={TableType.INVENTORY_RETURN} /*handlePrint={handlePrint}*/}
      <ToolBar
        dataTable={purchaseReturns}
        tableType={TableType.INVENTORY_RETURN}
        textSearch={"#, #đn, NCC, Nguoi trả,..."}
        handleToggleFilter={handleToggleFilter}
        handlePrint={handlePrint}

        orderByOptions={[
          {value: 'purchase_returns.creation_date', label: 'Ngày trả'},
          {value: 'total_amount', label: 'Tổng tiền trả'},
        ]}
        orderBy={query.orderBy} setOrderBy={(value) => setQuery({...query, orderBy: value})}
        sort={query.sort} setSort={(value) => setQuery({...query, sort:value})}
        searchKey={query.searchKey} setSearchKey={(value) => setQuery({...query, searchKey: value})}
        handleRemoveFilter={handleRemoveFilter}
        getDataExport={getDataExport}
        columnsToKeep = {[
          {dbName:"purchase_return_code",displayName:"Mã trả hàng nhập"},
          {dbName:"purchase_order_code",displayName:"Mã đơn nhập"},
          {dbName:"creation_date",displayName:"Ngày nhập"},
          {dbName:"supplier_name",displayName:"Nhà cung cấp"},
          {dbName:"total_amount",displayName:"Tổng tiền nhập"}, 
          {dbName:"paid_amount",displayName:"Tổng tiền đã thu"}, 
          {dbName:"branch_name",displayName:"Chi nhánh thực hiện"},
          {dbName:"payment_method",displayName:"Phương thức thanh toán"},
          {dbName:"created_user_type",displayName:"Tài khoản thực hiện"},
          {dbName:"created_user_name",displayName:"Tên người thực hiện"},
        ]}
      />

      <InventoryReturnFilter
        openFilter={openFilter}
        setQuery={setQuery}
        query={query}
        handleToggleFilter={handleToggleFilter}
        setPurchaseReturns={setPurchaseReturns}
      />

      {/* 3. TABLE */}
      {!xsScreen? <TableWrapper  pagingState={{...pagingState, total_rows: totalRows}} setPagingState={setPagingState}
       list={purchaseReturns}
       tableRef={tableRef}
      >
        <TableHeader
          classes={classes}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          headerData={HeadCells.InventoryReturnOrderHeadCells}
        />
        <TableBody>
        <TableRow style={{backgroundColor:'#f5f5f5'}}>
              <TableCell style={{color:'#000', fontWeight:600}}>Số đơn: <ThousandFormat value={totalRows}></ThousandFormat></TableCell>
              <TableCell/> <TableCell/> <TableCell/> 
              <TableCell align="right"style={{color:'#000', fontWeight:600}}>Tổng: <VNDFormat value={totalAmount} ></VNDFormat></TableCell>
              {/* <TableCell/> */}
          </TableRow>
          {purchaseReturns.map((row, index) => {
            return (
              <InventoryReturnTableRow
                key={row.uuid}
                row={row}
                openRow={openRow}
                handleOpenRow={handleOpenRow}
              />
            );
          })}
        </TableBody>
      </TableWrapper>:
      <>
       <Box style={{minHeight:'50vh'}}>
      {purchaseReturns.map((row, index) => {
        return (
          // <InventoryReturnTableRow
          //   key={row.uuid}
          //   row={row}
          //   openRow={openRow}
          //   handleOpenRow={handleOpenRow}
          // />
          <BillMiniTableRow key={row.uuid} row={row} openRow={openRow} handleOpenRow={handleOpenRow} 
          totalCost={row.total_amount}  id={row.purchase_return_code} partnerName={row.supplier_name} date={row.creation_date} 
          typeBill={"Đơn trả hàng nhập"}/>

        );
      })}
      </Box>
      <Pagination pagingState={{...pagingState, total_rows: totalRows}} setPagingState={setPagingState} list={purchaseReturns}/>

      </>
      }
      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <ComponentToPrint
            purchaseReturns={purchaseReturns}
            classes={classes}
            query={query}
            totalRows={totalRows}
            totalAmount={totalAmount}
          />
        </div>
      </div>
    </Card>
  );
};

const ComponentToPrint = ({ purchaseReturns, classes, query,totalRows,totalAmount }) => {
 
  const firstDate = purchaseReturns.slice(-1)[0] ?purchaseReturns.slice(-1)[0].creation_date.split(" ")[0].split('T')[0].split('-').reverse().join('/'):''
  return (
    <div style={{padding:10}}>
      <Typography style={{color:'#000'}}>Ngày lập:  {moment(new Date()).format("DD/MM/YYYY HH:mm")}</Typography>
      <Box style={{ margin: 10,flexGrow: 1,  textAlign: "center" ,color: "#000"}}>
        <Typography style={{  fontSize: 18, fontWeight: 600}} >
          {/* Thống kê đơn trả hàng nhập */}
          THỐNG KÊ ĐƠN TRẢ HÀNG NHẬP
        </Typography>
        <Typography  >
          {/* Từ {initialQuery.startDate} - Ngày {initialQuery.endDate} */}
          {`Từ ngày: ${query.startDate ? ` ${query.startDate.split('-').reverse().join('/')}` :firstDate} - Đến ngày: ${query.endDate? query.endDate.split('-').reverse().join('/') : moment(new Date()).format('DD/MM/YYYY')}`}
        </Typography>
        {query.searchKey ? <Typography  > {`Tìm kiếm theo: ${query.searchKey}`} </Typography>:null}
        {query.status? <Typography  > {`Tình trạng đơn: ${query.status === "debt"?"Nợ":"Trả đủ"}`} </Typography>:null}
        {query.paymentMethod? <Typography  > {`Phương thức thanh toán: ${query.paymentMethod === "cash"?"Tiên mặt":"Thẻ"}`} </Typography>:null}
        {query.minTotalAmount || query.maxTotalAmount ? <Typography  > {`Tổng tiền đơn từ: ${query.minTotalAmount?query.minTotalAmount:0}đ đến ${query.maxTotalAmount?query.maxTotalAmount:0}đ`} </Typography>:null}
        {query.minDiscount || query.maxDiscount ? <Typography  > {`Đơn giảm giá từ: ${query.minDiscount?query.minDiscount:0}đ đến ${query.maxDiscount?query.maxDiscount:0}đ`} </Typography>:null}

      </Box>
      <div>
      <TableWrapper  isReport={true} >
        <TableHeader
        color="#000"
          classes={classes}
          headerData={HeadCells.InventoryReturnOrderHeadCells.filter(item => item.id !== "debt")}
        />
        <TableBody>
          {purchaseReturns.map((row, index) => {
            return  <InventoryReturnTableRow colorText={"#000"} key={row.uuid} row={row} hidenCollumn={["debt"]}/>
            })}
            <TableRow style={{backgroundColor:'#f5f5f5'}}>
              <TableCell style={{color:'#000', fontWeight:600}}>Số đơn: <ThousandFormat value={totalRows}></ThousandFormat></TableCell>
              <TableCell/> <TableCell/> <TableCell/> 
              <TableCell align="right"style={{color:'#000', fontWeight:600}}>Tổng: <VNDFormat value={totalAmount} ></VNDFormat></TableCell>
              {/* <TableCell/> */}
          </TableRow>
        </TableBody>
        </TableWrapper>
      </div>
    </div>
  );};

export default InventoryReturnOrder;
