import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@material-ui/core/styles";
//import style
import useStyles from "../../../../components/TableCommon/style/mainViewStyle";
//import lib
import {
  Typography,
  Card,
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
import { useReactToPrint } from "react-to-print";

// import redux
import { customizeAction } from "../../../../store/slice/customizeSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

//import constant
import * as HeadCells from "../../../../assets/constant/tableHead";
import * as TableType from "../../../../assets/constant/tableType";

////import project
import CashBookTableRow from "./CashBookTableRow/CashBookTableRow";
import Cashbookfilter from './CashBookTool/CashBookFilter';
//chung
import TableHeader from "../../../../components/TableCommon/TableHeader/TableHeader";
import ToolBar from "../../../../components/TableCommon/ToolBar/ToolBar";
import TableWrapper from "../../../../components/TableCommon/TableWrapper/TableWrapper";
import cashBookApi from "../../../../api/cashBookApi";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import {BillMiniTableRow} from "../../../../components/MiniTableRow/MiniTableRow"
import Pagination from "../../../../components/TableCommon/TableWrapper/Pagination"
import { statusAction } from "../../../../store/slice/statusSlice";
import {ThousandFormat, VNDFormat} from '../../../../components/TextField/NumberFormatCustom'
import moment from "moment";
import CashBookFilter from "./CashBookTool/CashBookFilter";
import DayReportSelect from "../../../../components/Select/DayReportSelect";
import CashBookPopUp from "./CashBookPopUp/CashBookPopUp";

const CashBook = () => {
  // fetch data here
  const [data, setData] = useState([]);

  const theme = useTheme();
  const classes = useStyles(theme);
  const dispatch = useDispatch();
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs")) ;


  //// 2. Table
  //collapse
  const [openRow, setRowOpen] = React.useState(null);
  const handleOpenRow = (row) => {

    if (row !== openRow) {
      setRowOpen(row);
    } else {
      setRowOpen(null);
    }
  };

  const initialQuery = {
    startDate: '',
    endDate: '',
    minTotalAmount: null,
    maxTotalAmount: null,
    status: '',
    userName: '',
    userType: '',
    tyep: 'type',
    paymentMethod: '',
    orderBy: 'payment_receipt_vouchers.creation_date',
    sort: 'desc',
    searchKey: '',
  };

  const handleRemoveFilter = () => {
    setQuery(initialQuery)
  }
  const [query, setQuery] = useState(initialQuery)

  const [reload, setReload] = React.useState(false);
  const [pagingState, setPagingState] = useState({
    page: 0,
    limit: 10,
  });
  const [totalRows, setTotalRows] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0);

  //3.2. filter
  const [openFilter, setOpenFilter] = React.useState(false);
  const handleToggleFilter = () => {
    setOpenFilter(!openFilter);
  };
  const onReload = () => {
    setReload(!reload);
  };

  const handleRequestSort = (event, property) => {
    //// (gửi order vs orderBy lên api) -> fetch lại data để sort
    // const isAsc = orderBy === property && order === 'asc';
    // setOrder(isAsc ? 'desc' : 'asc');
    // setOrderBy(property);
  };

  // toolbar
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const [summary, setSummary] = useState({
    start: 0,
    end: 0,
    pay: 0,
    receive: 0,
  })
  const today = new Date()
  const [dayQuery,setDayQuery] = useState({
   //  fromDate: new Date(today.setDate(today.getDate() - 7 +1)).toISOString().split('T')[0],
   //  toDate: new Date().toISOString().split('T')[0],
   fromDate:  moment(new Date(today.getFullYear(), today.getMonth(), 1)).format("YYYY-MM-DD") ,
   toDate:  moment(new Date(today.getFullYear(), today.getMonth()+1, 0)).format("YYYY-MM-DD"),
  });
  const [openPopup, setOpenPopup] = useState(false);


  useEffect(() => {
    setPagingState({ ...pagingState, page: 0 });
  }, [reload, store_uuid, branch_uuid, query]);
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await cashBookApi.get(
          store_uuid,
          branch_uuid,
          {
            page: pagingState.page,
            limit: pagingState.limit,
            ...query,
            startDate: dayQuery.fromDate,
            endDate: dayQuery.toDate
          }
        );
        // setPagingState({ ...pagingState, total_rows: response.total_rows });
        setTotalRows(response.total_rows);
        setData(response.data);
        setTotalAmount(response.total_amount);
        setSummary({
          start: response.start,
          end: response.end,
          pay: response.pay,
          receive: response.receive,
          total: response.total,
        })
      } catch (error) {
        console.log(error);
      }
    };
    if (store_uuid && branch_uuid ) {
      
      loadData();
    }
  }, [pagingState.page, pagingState.limit, query, store_uuid, branch_uuid, reload, dayQuery]);


  const getDataExport = async () => {
    try {
      const response = await cashBookApi.getAllOfBranch(
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
        {/* 1. ADD POP UP */}
        <Typography className={classes.headerTitle} variant="h5">
          Sổ quỹ
        </Typography>

        {openPopup && <CashBookPopUp open={openPopup} isEdit={false} handleClose={() => {
          setOpenPopup(false);
          setReload(!reload);
        }}/>}

        <Grid className={classes.btngroup1}>
          <ButtonBase
            sx={{ borderRadius: "16px" }}
            onClick={() => {
              setOpenPopup(true);
            }}
          >
            <Avatar variant="rounded" className={classes.headerAvatar}>
              <Tooltip title="Tạo phiếu thu chi">
                <AddIcon stroke={1.5} size="1.3rem" />
              </Tooltip>
            </Avatar>
          </ButtonBase>
        </Grid>
      </Grid>

      <Divider />

      {/* 2. SEARCH - FILTER - EXPORT*/}
      {/* SAU NÀY SỬA LẠI TRUYỀN DATA SAU KHI FILTER, SORT, LỌC CỘT VÀO */}
      {/* <ToolBar  dataTable={inventoryOrderList} tableType={TableType.INVENTORY_ORDER} /*handlePrint={handlePrint}*/}
      <ToolBar
        dataTable={data}
        tableType={TableType.INVENTORY_ORDER}
        textSearch={"#, NCC, Nguoi nhap,..."}
        handleToggleFilter={handleToggleFilter}
        handlePrint={handlePrint}
        isOnlySearch={true}
        orderByOptions={[
          {value: 'purchase_orders.created_at', label: 'Ngày tạo'},
          {value: 'value', label: 'Tổng tiền nhập'},
        ]}
        orderBy={query.orderBy} setOrderBy={(value) => setQuery({...query, orderBy: value})}
        sort={query.sort} setSort={(value) => setQuery({...query, sort:value})}
        searchKey={query.searchKey} setSearchKey={(value) => setQuery({...query, searchKey: value})}
        
        handleRemoveFilter={handleRemoveFilter}
        getDataExport={getDataExport}
        columnsToKeep = {[
          {dbName:"purchase_order_code",displayName:"Mã đơn nhập"},
          {dbName:"payment_date",displayName:"Ngày nhập"},
          {dbName:"supplier_name",displayName:"Nhà cung cấp"},
          {dbName:"total_amount",displayName:"Tổng tiền nhập"}, 
          {dbName:"paid_amount",displayName:"Tiền đã trả"}, 
          {dbName:"branch_name",displayName:"Chi nhánh thực hiện"},
          {dbName:"payment_method",displayName:"Phương thức thanh toán"},
          {dbName:"created_user_type",displayName:"Tài khoản thực hiện"},
          {dbName:"created_user_name",displayName:"Tên người thực hiện"},
        ]}
        extra={<div style={{marginTop: 10}}><DayReportSelect  dayQuery={dayQuery} setDayQuery={setDayQuery}/></div>}
      />

      <CashBookFilter
        openFilter={openFilter}
        setQuery={setQuery}
        query={query}
        setData={setData}
        handleToggleFilter={handleToggleFilter}
      />

      {/* 3. TABLE */}
      {!xsScreen?<TableWrapper pagingState={{...pagingState, total_rows: totalRows}} setPagingState={setPagingState}
       list={data}
       tableRef={tableRef}
      >
        <TableHeader
          classes={classes}
          headerData={HeadCells.CashbookHeadCells}
          pagingState={pagingState}
          setPagingState={setPagingState}
        />
        <TableBody>
          <TableRow style={{backgroundColor:'#f5f5f5'}}>
              <TableCell style={{color:'#000', fontWeight:600}}>Số đơn: <ThousandFormat value={totalRows}></ThousandFormat></TableCell>
              <TableCell style={{color: 'purple', fontWeight:600}}>Quỹ đầu kì: <ThousandFormat value={summary.start}></ThousandFormat></TableCell>
              <TableCell style={{color:'blue', fontWeight:600}}>Quỹ cuối kì: <ThousandFormat value={summary.end}></ThousandFormat></TableCell>
              <TableCell style={{color:'green', fontWeight:600}}>Thu: <ThousandFormat value={summary.receive}></ThousandFormat></TableCell>
              <TableCell style={{color:'orange', fontWeight:600}}>Chi: <ThousandFormat value={summary.pay}></ThousandFormat></TableCell>
              <TableCell style={{color:'red', fontWeight:600}}>Tổng quỹ: <ThousandFormat value={summary.total}></ThousandFormat></TableCell>
          </TableRow>
          {data.map((row, index) => {
            return (
              <CashBookTableRow
                key={row.code}
                row={row}
                openRow={openRow}
                handleOpenRow={handleOpenRow}
                onReload={onReload}
              />
            );
          })}
        </TableBody>
      </TableWrapper>
      :
      <>
       <Box style={{minHeight:'50vh'}}>
      {data.map((row, index) => {
        return (
        <BillMiniTableRow key={row.uuid} row={row} openRow={openRow} handleOpenRow={handleOpenRow}  onReload={onReload} 
          totalCost={row.total_amount}  id={row.purchase_order_code} partnerName={row.supplier_name} date={row.creation_date} 
          typeBill={"Đơn nhập hàng"} />
        );
      })}
      </Box>
      <Pagination pagingState={{...pagingState, total_rows: totalRows}} setPagingState={setPagingState}list={data}
     />

      </>
    }

      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <ComponentToPrint data={data} classes={classes}  query={query} totalRows={totalRows}totalAmount={totalAmount}/>
        </div>
      </div>
    </Card>
  );
};

export default CashBook;

const ComponentToPrint = ({ data, classes,query,totalRows,totalAmount, }) => {
  const firstDate = ''
  // const firstDate = data.slice(-1)[0] ?data.slice(-1)[0].created_at.split(" ")[0].split('T')[0].split('-').reverse().join('/'):''
  return (
    <div style={{padding:10}}>
      <Typography style={{color:'#000'}}>Ngày lập:  {moment(new Date()).format("DD/MM/YYYY HH:mm")}</Typography>
      <Box style={{ margin: 10,flexGrow: 1,  textAlign: "center" ,color: "#000"}}>
        <Typography style={{  fontSize: 18, fontWeight: 600}} >
          {/* Thống kê đơn nhập hàng */}
          THỐNG KÊ ĐƠN NHẬP HÀNG
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
          headerData={HeadCells.InventoryOrderHeadCells.filter(item => item.id !== "debt")}
        />
        <TableBody>
          {data.map((row, index) => {
            return  <CashBookTableRow colorText={"#000"} key={row.uuid} row={row} hidenCollumn={["debt"]}/>
            })}
           <TableRow style={{backgroundColor:'#f5f5f5'}}>
              <TableCell style={{color:'#000', fontWeight:600}}>Số đơn: <ThousandFormat value={totalRows}></ThousandFormat></TableCell>
              <TableCell/> <TableCell/> <TableCell/>
              <TableCell align="right"style={{color:'#000', fontWeight:600}}>Tổng: <VNDFormat value={totalAmount} ></VNDFormat></TableCell>
              <TableCell/>
          </TableRow>

        </TableBody>
        </TableWrapper>
      </div>
    </div>
  );
};


