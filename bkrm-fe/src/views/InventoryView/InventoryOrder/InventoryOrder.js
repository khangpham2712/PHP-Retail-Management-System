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
import { customizeAction } from "../../../store/slice/customizeSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

//import constant
import * as HeadCells from "../../../assets/constant/tableHead";
import * as TableType from "../../../assets/constant/tableType";

////import project
import InventoryOrderFilter from "./InventoryOrderTool/InventoryOrderFilter";
import InventoryOrderTableRow from "./InventoryOrderTableRow/InventoryOrderTableRow";
//chung
import TableHeader from "../../../components/TableCommon/TableHeader/TableHeader";
import ToolBar from "../../../components/TableCommon/ToolBar/ToolBar";
import TableWrapper from "../../../components/TableCommon/TableWrapper/TableWrapper";
import purchaseOrderApi from "../../../api/purchaseOrderApi";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import {BillMiniTableRow} from "../../../components/MiniTableRow/MiniTableRow"
import Pagination from "../../../components/TableCommon/TableWrapper/Pagination"
import { statusAction } from "../../../store/slice/statusSlice";
import {ThousandFormat, VNDFormat} from '../../../components/TextField/NumberFormatCustom'
import moment from "moment";

const InventoryOrder = () => {
  // fetch data here
  const [purchaseOrders, setPurchaseOrders] = useState([]);

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
    minDiscount: null,
    maxDiscount: null,
    minTotalAmount: null,
    maxTotalAmount: null,
    status: '',
    paymentMethod: '',
    orderBy: 'purchase_orders.creation_date',
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

  useEffect(() => {
    setPagingState({ ...pagingState, page: 0 });
  }, [reload, store_uuid, branch_uuid, query]);
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await purchaseOrderApi.getAllOfBranch(
          store_uuid,
          branch_uuid,
          {
            page: pagingState.page,
            limit: pagingState.limit,
            ...query
          }
        );
        // setPagingState({ ...pagingState, total_rows: response.total_rows });
        setTotalRows(response.total_rows);
        setPurchaseOrders(response.data);
        setTotalAmount(response.total_amount);
      } catch (error) {
        console.log(error);
      }
    };
    if (store_uuid && branch_uuid ) {
      
      loadData();
    }
  }, [pagingState.page, pagingState.limit, query, store_uuid, branch_uuid, reload]);

  const [snackStatus, setSnackStatus] = React.useState({
    style: "error",
    message: "Kiểm kho thất bại",
  });
  const getDataExport = async () => {
    try {
      const response = await purchaseOrderApi.getAllOfBranch(
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
          Đơn nhập hàng
        </Typography>

        <Grid className={classes.btngroup1}>
          <ButtonBase
            sx={{ borderRadius: "16px" }}
            onClick={() => {
              dispatch(customizeAction.setSidebarOpen(false));
              dispatch(customizeAction.setItemMenuOpen(4));
            }}
            component={Link}
            to="/home/inventory/import"
          >
            <Avatar variant="rounded" className={classes.headerAvatar}>
              <Tooltip title="Nhập hàng">
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
        dataTable={purchaseOrders}
        tableType={TableType.INVENTORY_ORDER}
        textSearch={"#, NCC, Nguoi nhap,..."}
        handleToggleFilter={handleToggleFilter}
        handlePrint={handlePrint}

        orderByOptions={[
          {value: 'purchase_orders.creation_date', label: 'Ngày nhập'},
          {value: 'total_amount', label: 'Tổng tiền nhập'},
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
      />

      <InventoryOrderFilter
        openFilter={openFilter}
        setQuery={setQuery}
        query={query}
        setPurchaseOrders={setPurchaseOrders}
        handleToggleFilter={handleToggleFilter}
      />

      {/* 3. TABLE */}
      {!xsScreen?<TableWrapper pagingState={{...pagingState, total_rows: totalRows}} setPagingState={setPagingState}
       list={purchaseOrders}
       tableRef={tableRef}
      >
        <TableHeader
          classes={classes}
          headerData={HeadCells.InventoryOrderHeadCells}
          pagingState={pagingState}
          setPagingState={setPagingState}
          
        />
        <TableBody>
          <TableRow style={{backgroundColor:'#f5f5f5'}}>
              <TableCell style={{color:'#000', fontWeight:600}}>Số đơn: <ThousandFormat value={totalRows}></ThousandFormat></TableCell>
              <TableCell/> <TableCell/> <TableCell/>
              <TableCell align="right"style={{color:'#000', fontWeight:600}}>Tổng: <VNDFormat value={totalAmount} ></VNDFormat></TableCell>
              <TableCell/>
          </TableRow>
          {purchaseOrders.map((row, index) => {
            return (
              <InventoryOrderTableRow
                key={row.uuid}
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
      {purchaseOrders.map((row, index) => {
        return (
      
          <BillMiniTableRow key={row.uuid} row={row} openRow={openRow} handleOpenRow={handleOpenRow}  onReload={onReload} 
          totalCost={row.total_amount}  id={row.purchase_order_code} partnerName={row.supplier_name} date={row.creation_date} 
          typeBill={"Đơn nhập hàng"} />
      

        );
      })}
      </Box>
      <Pagination pagingState={{...pagingState, total_rows: totalRows}} setPagingState={setPagingState}list={purchaseOrders}
     />

      </>
       
      
      }

      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <ComponentToPrint purchaseOrders={purchaseOrders} classes={classes}  query={query} totalRows={totalRows}totalAmount={totalAmount}/>
        </div>
      </div>
    </Card>
  );
};

export default InventoryOrder;

const ComponentToPrint = ({ purchaseOrders, classes,query,totalRows,totalAmount, }) => {
 
  const firstDate = purchaseOrders.slice(-1)[0] ?purchaseOrders.slice(-1)[0].creation_date.split(" ")[0].split('T')[0].split('-').reverse().join('/'):''
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
          {purchaseOrders.map((row, index) => {
            return  <InventoryOrderTableRow colorText={"#000"} key={row.uuid} row={row} hidenCollumn={["debt"]}/>
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


