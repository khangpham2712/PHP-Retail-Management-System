import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@material-ui/core/styles";
//import style
import useStyles from "../../../components/TableCommon/style/mainViewStyle";
//import lib
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
import { useReactToPrint } from "react-to-print";
import {Modal} from 'antd'
import moment from "moment";

//import api

// import redux
import { customizeAction } from "../../../store/slice/customizeSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

//import constant
import * as HeadCells from "../../../assets/constant/tableHead";
import * as TableType from "../../../assets/constant/tableType";

////import project
import InvoiceFilter from "./InvoiceTool/InvoiceFilter";
import InvoiceTableRow from "./InvoiceTableRow/InvoiceTableRow";
//chung
import TableHeader from "../../../components/TableCommon/TableHeader/TableHeader";
import ToolBar from "../../../components/TableCommon/ToolBar/ToolBar";
import TableWrapper from "../../../components/TableCommon/TableWrapper/TableWrapper";

import JSONdata from "../../../assets/JsonData/invoice.json";
import orderApi from "../../../api/orderApi";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import {BillMiniTableRow} from "../../../components/MiniTableRow/MiniTableRow"
import Pagination from "../../../components/TableCommon/TableWrapper/Pagination"
import { statusAction } from "../../../store/slice/statusSlice";
import {ThousandFormat, VNDFormat} from '../../../components/TextField/NumberFormatCustom'

const Invoice = () => {
  // fetch data here
  const theme = useTheme();
  const classes = useStyles(theme);
  const dispatch = useDispatch();
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs")) ;


  const [orders, setOrders] = useState([]);
  const [pagingState, setPagingState] = useState({
    page: 0,
    limit: 10,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  // api
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;


  /// search sort
  const initialQuery = {
    startDate: '',
    endDate: '',
    minDiscount: null,
    maxDiscount:null,
    minTotalAmount: null,
    maxTotalAmount: null,
    status: '',
    paymentMethod: '',
    orderBy: 'orders.created_at',
    sort: 'desc',
    searchKey: '',
  };

  const handleRemoveFilter = () => {
    setQuery(initialQuery)
  }
  const [query, setQuery] = useState(initialQuery)

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

  // header sort
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const handleDeleteAll = () => {
    const deleteApi = async () => {
      console.log("delete api called")
      try {
        const res = await orderApi.deleteAll(store_uuid, branch_uuid);
        dispatch(statusAction.successfulStatus("Xóa tất cả hóa đơn thành công"));
      } catch (err) {
        dispatch(statusAction.failedStatus("Xóa tất cả hóa đơn thất bại"));
      }
    }
    Modal.confirm({
      content: "Bạn chắc chắn muốn xóa tất cả hóa đơn, hành động này không thể quay lại",
      onOk() {
        deleteApi()
        onReload()
      },
    });
  }

  //3. ToolBar
  //3.2. filter
  // toolbar
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [openFilter, setOpenFilter] = React.useState(false);
  const handleToggleFilter = () => {
    setOpenFilter(!openFilter);
  };
  const [reload, setReload] = useState(false);
  const onReload = () => {
    console.log("onReload called")
    setReload(!reload);
  };
  const handleRequestSort = (event, property) => {
    //// (gửi order vs orderBy lên api) -> fetch lại data để sort
    // const isAsc = orderBy === property && order === 'asc';
    // setOrder(isAsc ? 'desc' : 'asc');
    // setOrderBy(property);
  };

  useEffect(() => {
    setPagingState({ ...pagingState, page: 0 });
  }, [reload, store_uuid, branch_uuid, query]);
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await orderApi.getAllOfBranch(
          store_uuid,
          branch_uuid,
          {
            page: pagingState.page,
            limit: pagingState.limit,
            ...query,
          }
        );
        // setPagingState({ ...pagingState, total_rows: response.total_rows });
        setTotalRows(response.total_rows)
        setOrders(response.data);
        setTotalAmount(response.total_amount);
      } catch (error) {
        console.log(error);
      }
    };
    if (store_uuid && branch_uuid) {
      loadData();
    }
  }, [pagingState.page, pagingState.limit, branch_uuid, query, reload]);

  const tableRef = React.createRef();


  const getDataExport = async () => {
    try {
      const response = await orderApi.getAllOfBranch(
        store_uuid,
        branch_uuid,
        query,
      );
      return response.data;
    } catch (error) {
      dispatch(statusAction.failedStatus("Không thể lấy dữ liệu!"));
      console.log(error);
    }
  }

  return (
    <Card className={classes.root}>
      <Grid container direction="row" justifyContent="space-between">
        {/* 1. ADD POP UP */}
        <Grid direction="column" justifyContent="center" alignItems="center">
        <Typography className={classes.headerTitle} variant="h5">
          Hoá đơn
        </Typography>
        {/* <Typography variant="body2" style={{paddingLeft: 25}}>
          <b style={{color:'#000'}}>{"Số đơn: "}</b>
          <ThousandFormat value={totalRows}></ThousandFormat>
          {" - "}
          <b style={{color:'#000'}}>{"Tổng: "}</b>
          <VNDFormat  value={totalAmount} />
        </Typography> */}
       
        </Grid>

        <Grid className={classes.btngroup1}>
          <ButtonBase
            sx={{ borderRadius: "16px" }}
            onClick={() => {
              dispatch(customizeAction.setSidebarOpen(false));
              dispatch(customizeAction.setItemMenuOpen(1));
            }}
            component={Link}
            to="/home/sales/cart"
          >
            <Avatar variant="rounded" className={classes.headerAvatar}>
              <Tooltip title="Thêm hoá đơn">
                <AddIcon stroke={1.5} size="1.3rem" />
              </Tooltip>
            </Avatar>
          </ButtonBase>
        </Grid>
      </Grid>

      <Divider />

      {/* 2. SEARCH - FILTER - EXPORT*/}
      {/* SAU NÀY SỬA LẠI TRUYỀN DATA SAU KHI FILTER, SORT, LỌC CỘT VÀO */}
      <ToolBar
        dataTable={orders}
        handleDeleteAll={handleDeleteAll}
        tableType={TableType.INVOICE}
        textSearch={"#, Khách, Người bán,...  "} /*handlePrint={handlePrint}*/
        handleToggleFilter={handleToggleFilter}
        handlePrint={handlePrint}
        getDataExport={getDataExport}
        orderByOptions={[
          { value: "orders.created_at", label: "Ngày bán" },
          { value: "total_amount", label: "Tổng tiền bán" },
        ]}
        orderBy={query.orderBy}
        setOrderBy={(value) => setQuery({ ...query, orderBy: value })}
        sort={query.sort}
        setSort={(value) => setQuery({ ...query, sort: value })}
        searchKey={query.searchKey}
        setSearchKey={(value) => setQuery({ ...query, searchKey: value })}
        handleRemoveFilter={handleRemoveFilter}
        columnsToKeep={[
          { dbName: "order_code", displayName: "Mã hoá đơn" },
          { dbName: "customer_name", displayName: "Khách hàng" },
          { dbName: "created_at", displayName: "Ngày bán" },
          { dbName: "total_amount", displayName: "Tổng tiền hoá đơn" },
          { dbName: "paid_amount", displayName: "Tiền khách đã trả" },
          { dbName: "status", displayName: "Trạng thái" },
          { dbName: "payment_method", displayName: "Phương thức thanh toán" },
          { dbName: "created_user_type", displayName: "Tài khoản thực hiện" },
          { dbName: "created_user_name", displayName: "Tên người thực hiện" },
        ]}
      />
      <InvoiceFilter
        openFilter={openFilter}
        setQuery={setQuery}
        query={query}
        handleToggleFilter={handleToggleFilter}
        setOrders={setOrders}
      />

      {/* 3. TABLE */}
      {!xsScreen ? (
        <TableWrapper
          pagingState={{ ...pagingState, total_rows: totalRows }}
          setPagingState={setPagingState}
          list={orders}
          tableRef={tableRef}
        >
          <TableHeader
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            headerData={HeadCells.InvoiceHeadCells}
          />
          <TableBody>
          <TableRow style={{backgroundColor:'#f5f5f5'}}>
              <TableCell style={{color:'#000', fontWeight:600}}>Số đơn: <ThousandFormat value={totalRows}></ThousandFormat></TableCell>
              <TableCell/> <TableCell/> <TableCell/>
              <TableCell align="right"style={{color:'#000', fontWeight:600}}>Tổng: <VNDFormat value={totalAmount} ></VNDFormat></TableCell>
              <TableCell/>
            </TableRow>
            {orders.map((row, index) => {
              return (
                <>
                {/* <TableRow style={{backgroundColor:theme.customization.primaryColor[50]}}> */}
                <InvoiceTableRow
                  key={row.uuid}
                  row={row}
                  openRow={openRow}
                  handleOpenRow={handleOpenRow}
                  onReload={onReload}
                  // hidenCollumn={[""]}
                />
                </>
              );
            })}
          </TableBody>
        </TableWrapper>
      ) : (
        <>
          <Box style={{ minHeight: "50vh" }}>
            {orders.map((row, index) => {
              return (
                // <InvoiceTableRow
                //   key={row.uuid}
                //   row={row}
                //   openRow={openRow}
                //   handleOpenRow={handleOpenRow}
                //   onReload={onReload}
                // />
                <BillMiniTableRow
                  key={row.uuid}
                  row={row}
                  openRow={openRow}
                  handleOpenRow={handleOpenRow}
                  onReload={onReload}
                  totalCost={row.total_amount}
                  id={row.order_code}
                  partnerName={row.customer_name}
                  date={row.paid_date}
                  typeBill={"Hoá đơn"}
                />
              );
            })}
          </Box>
          <Pagination
            pagingState={{ ...pagingState, total_rows: totalRows }}
            setPagingState={setPagingState}
            list={orders}
          />
        </>
      )}
      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <ComponentToPrint orders={orders} classes={classes} query={query}  totalRows={totalRows}  totalAmount={totalAmount}/>
        </div>
      </div>
    </Card>
  );
};

export default Invoice;

const ComponentToPrint = ({ orders, classes,query ,totalRows,totalAmount }) => {
  const firstDate = orders.slice(-1)[0] ?orders.slice(-1)[0].creation_date.split(" ")[0].split('T')[0].split('-').reverse().join('/'):''
  return (
    <div style={{padding:10}}>
      <Typography style={{color:'#000'}}>Ngày lập:  {moment(new Date()).format("DD/MM/YYYY HH:mm")}</Typography>
      <Box style={{ margin: 10,flexGrow: 1,  textAlign: "center" ,color: "#000"}}>
        <Typography style={{  fontSize: 18, fontWeight: 600}} >
          {/* Thống kê hoá đơn */}
          THỐNG KÊ HOÁ ĐƠN
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
          headerData={HeadCells.InvoiceHeadCells.filter(item => item.id !== "debt")}
        />
        <TableBody>
          {orders.map((row, index) => {
            return  <InvoiceTableRow colorText={"#000"} key={row.uuid} row={row} hidenCollumn={["debt"]}/>
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
