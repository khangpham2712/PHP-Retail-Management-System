import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@material-ui/core/styles";
// import style
import {
  Typography,
  Card,
  Button,
  Divider,
  Grid,
  ButtonBase,
  Avatar,
  Tooltip,
  TableBody,
  Box,
  TableRow,
  TableCell
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useSelector, useDispatch } from "react-redux";
import useStyles from "../../../components/TableCommon/style/mainViewStyle";
// import lib
import { useReactToPrint } from "react-to-print";
// import api

// import constant
import * as HeadCells from "../../../assets/constant/tableHead";
import * as TableType from "../../../assets/constant/tableType";

/// /import project
// riêng
import InvoiceReturnFilter from "./InvoiceReturnTool/InvoiceReturnFilter";
import InvoiceReturnTableRow from "./InvoiceReturnTableRow/InvoiceReturnTableRow";
// chung
import TableHeader from "../../../components/TableCommon/TableHeader/TableHeader";
import ToolBar from "../../../components/TableCommon/ToolBar/ToolBar";
import TableWrapper from "../../../components/TableCommon/TableWrapper/TableWrapper";
import refundApi from "../../../api/refundApi";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import {BillMiniTableRow} from "../../../components/MiniTableRow/MiniTableRow"
import Pagination from "../../../components/TableCommon/TableWrapper/Pagination"
import {ThousandFormat, VNDFormat} from '../../../components/TextField/NumberFormatCustom'
import moment from "moment";

import { statusAction } from "../../../store/slice/statusSlice";
function InvoiceReturn() {
  // fetch data here
  const invoiceReturnList = [];
  const [refunds, setRefunds] = useState([]);
  // api
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const dispatch = useDispatch();

  const theme = useTheme();
  const classes = useStyles(theme);
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs")) ;


  /// / 2. Table

  // collapse
  const [openRow, setRowOpen] = React.useState(null);
  const handleOpenRow = (row) => {
    if (row !== openRow) {
      setRowOpen(row);
    } else {
      setRowOpen(null);
    }
  };

  // // header sort
  // const [order, setOrder] = React.useState('asc');
  // const [orderBy, setOrderBy] = React.useState('id');

  const initialQuery = {
    startDate: '',
    endDate: '',
    minDiscount: null,
    maxDiscount: null,
    minTotalAmount: null,
    maxTotalAmount: null,
    status: '',
    paymentMethod: '',
    orderBy: 'refunds.created_at',
    sort: 'desc',
    searchKey: '',
  };

  const handleRemoveFilter = () => {
    setQuery(initialQuery)
  }
  

  const handleRequestSort = (event, property) => {
    /// / (gửi order vs orderBy lên api) -> fetch lại data để sort
    // const isAsc = orderBy === property && order === 'asc';
    // setOrder(isAsc ? 'desc' : 'asc');
    // setOrderBy(property);
  };

  // 3. ToolBar
  // toolbar
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  // 3.1. search

  // 3.2. filter
  const [openFilter, setOpenFilter] = React.useState(false);
  const handleToggleFilter = () => {
    setOpenFilter(!openFilter);
  };

  // 3.3. loc cot

  const [reload, setReload] = useState(false);

  const [query, setQuery] = useState(initialQuery)
  const [pagingState, setPagingState] = useState({
    page: 0,
    limit: 10,
  });
  const [totalRows, setTotalRows] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0);


  useEffect(() => {
    setPagingState({ ...pagingState, page: 0 });
  }, [reload, store_uuid, branch_uuid, query]);
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await refundApi.getAllOfBranch(
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
        setRefunds(response.data);
        setTotalAmount(response.total_amount);

      } catch (error) {
        console.log(error);
      }
    };
    if (store_uuid && branch_uuid) {
      loadData();
    }
  }, [pagingState.page, pagingState.limit, store_uuid, branch_uuid, query]);
  const getDataExport = async () => {
    try {
      const response = await refundApi.getAllOfBranch(
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
  const tableRef = React.createRef();


  return (
    <Card className={classes.root}>
      <Grid container direction="row" justifyContent="space-between">
        <Typography className={classes.headerTitle} variant="h5">
          Đơn trả
        </Typography>
      </Grid>

      <Divider />

      {/* 2. SEARCH - FILTER - EXPORT */}
      {/* SAU NÀY SỬA LẠI TRUYỀN DATA SAU KHI FILTER, SORT, LỌC CỘT VÀO */}
      <ToolBar
        dataTable={refunds}
        tableType={TableType.INVOICE_RETURN}
        textSearch="#,#hđ, Khách, Người trả,...  " /* handlePrint={handlePrint} */
        handlePrint={handlePrint}
        handleToggleFilter={handleToggleFilter}

        orderByOptions={[
          {value: 'refunds.created_at', label: 'Ngày nhập'},
          {value: 'refunds.total_amount', label: 'Tổng tiền tra'},
        ]}
        orderBy={query.orderBy} setOrderBy={(value) => setQuery({...query, orderBy: value})}
        sort={query.sort} setSort={(value) => setQuery({...query, sort:value})}
        searchKey={query.searchKey} setSearchKey={(value) => setQuery({...query, searchKey: value})}
        handleRemoveFilter={handleRemoveFilter}
        getDataExport={getDataExport}
        columnsToKeep = {[
          {dbName:"refund_code",displayName:"Mã đơn trả"},
          {dbName:"creation_date",displayName:"Ngày nhập"},
          {dbName:"customer_name",displayName:"Nhà cung cấp"},
          {dbName:"total_amount",displayName:"Tổng tiền nhập"}, 
          {dbName:"paid_amount",displayName:"Tổng tiền đã thu"}, 
          {dbName:"branch_name",displayName:"Chi nhánh thực hiện"},
          {dbName:"payment_method",displayName:"Phương thức thanh toán"},
          {dbName:"created_user_type",displayName:"Tài khoản thực hiện"},
          {dbName:"created_user_name",displayName:"Tên người thực hiện"},
        ]}
      />
      <InvoiceReturnFilter
        openFilter={openFilter}
        handleToggleFilter={handleToggleFilter}
        setRefunds={setRefunds}
      />
      {/* 3. TABLE */}
      {!xsScreen?<TableWrapper pagingState={{...pagingState, total_rows: totalRows}} setPagingState={setPagingState} 
        list={refunds}
        tableRef={tableRef}
        >
        <TableHeader
          classes={classes}
          // order={order}
          // orderBy={orderBy}
          onRequestSort={handleRequestSort}
          headerData={HeadCells.InvoiceReturnHeadCells}
        />
        <TableRow style={{backgroundColor:'#f5f5f5'}}>
              <TableCell style={{color:'#000', fontWeight:600}}>Số đơn: <ThousandFormat value={totalRows}></ThousandFormat></TableCell>
              <TableCell/> <TableCell/><TableCell/>
              <TableCell align="right"style={{color:'#000', fontWeight:600}}>Tổng: <VNDFormat value={totalAmount} ></VNDFormat></TableCell>
              {/* <TableCell/> */}
          </TableRow>
        <TableBody>
          {refunds.map((row, index) => (
            <InvoiceReturnTableRow
              key={row.uuid}
              row={row}
              openRow={openRow}
              handleOpenRow={handleOpenRow}
            />
          ))}
        </TableBody>
      </TableWrapper>:
          <>
           <Box style={{minHeight:'50vh'}}>
          {refunds.map((row, index) => (
            // <InvoiceReturnTableRow
            //   key={row.uuid}
            //   row={row}
            //   openRow={openRow}
            //   handleOpenRow={handleOpenRow}
            // />
            <BillMiniTableRow key={row.uuid} row={row} openRow={openRow} handleOpenRow={handleOpenRow} 
          totalCost={row.total_amount}  id={row.refund_code} partnerName={row.customer_name} date={row.created_at} 
          typeBill={"Đơn trả"}/>

          ))}
          </Box>
          <Pagination pagingState={{...pagingState, total_rows: totalRows}} setPagingState={setPagingState}         list={refunds}/>
    
          </>
          }
      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <ComponentToPrint refunds={refunds} classes={classes} query={query} totalRows={totalRows}  totalAmount={totalAmount}/>
        </div>
      </div>
    </Card>
  );
}

export default InvoiceReturn;

const ComponentToPrint = ({ refunds, classes , query,totalRows,totalAmount}) => {

  const firstDate = refunds.slice(-1)[0] ?refunds.slice(-1)[0].created_at.split(" ")[0].split('T')[0].split('-').reverse().join('/'):''
  return (
    <div style={{padding:10}}>
      <Typography style={{color:'#000'}}>Ngày lập:  {moment(new Date()).format("DD/MM/YYYY HH:mm")}</Typography>
      <Box style={{ margin: 10,flexGrow: 1,  textAlign: "center" ,color: "#000"}}>
        <Typography style={{  fontSize: 18, fontWeight: 600}} >
          {/* Thống kê đơn trả */}
          THỐNG KÊ ĐƠN TRẢ
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
          headerData={HeadCells.InvoiceReturnHeadCells.filter(item => item.id !== "debt")}
        />
        <TableBody>
          {refunds.map((row, index) => {
            return  <InvoiceReturnTableRow colorText={"#000"} key={row.uuid} row={row} hidenCollumn={["debt"]}/>
            })}
            <TableRow style={{backgroundColor:'#f5f5f5'}}>
              <TableCell style={{color:'#000', fontWeight:600}}>Số đơn: <ThousandFormat value={totalRows}></ThousandFormat></TableCell>
              <TableCell/> <TableCell/><TableCell/>
              <TableCell align="right"style={{color:'#000', fontWeight:600}}>Tổng: <VNDFormat value={totalAmount} ></VNDFormat></TableCell>
              {/* <TableCell/> */}
          </TableRow>
        </TableBody>
        </TableWrapper>
      </div>
    </div>
  );
};
