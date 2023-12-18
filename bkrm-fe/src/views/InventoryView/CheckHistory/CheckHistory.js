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
  Dialog,
  DialogContent,
  Box
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useReactToPrint } from "react-to-print";
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
import CheckHistoryFilter from "./CheckHistoryTool/CheckHistoryFilter";
import CheckHistoryTableRow from "./CheckHistoryTableRow/CheckHistoryTableRow";
//chung
import TableHeader from "../../../components/TableCommon/TableHeader/TableHeader";
import ToolBar from "../../../components/TableCommon/ToolBar/ToolBar";
import TableWrapper from "../../../components/TableCommon/TableWrapper/TableWrapper";

import JSONdata from "../../../assets/JsonData/check.json";
import InventoryCheckPopUp from "../../../components/PopupCheck/InventoryCheckPopUp";
import inventoryCheckApi from "../../../api/inventoryCheckApi";
import SnackBarGeneral from "../../../components/SnackBar/SnackBarGeneral";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import {BillMiniTableRow} from "../../../components/MiniTableRow/MiniTableRow"
import Pagination from "../../../components/TableCommon/TableWrapper/Pagination"
import { statusAction } from "../../../store/slice/statusSlice";

const CheckHistory = () => {
  // fetch data here
  const checkHistoryList = JSONdata;

  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;

  
  const [inventoryChecks, setInventoryChecks] = useState([]);
  const initialQuery = {
    startDate: '',
    endDate: '',
    minTotalAmount:'',
    maxTotalAmount: '',
    orderBy: 'inventory_checks.created_at',
    sort: 'desc',
    searchKey: '',
  };
  const [query, setQuery] = useState(initialQuery)
  const handleRemoveFilter = () => {
    setQuery(initialQuery)
  }

  const [pagingState, setPagingState] = useState({
    page: 0,
    limit: 10,
  });
  const [totalRows, setTotalRows] = useState(0)

  const [reload, setReload] = useState(false);

  useEffect(() => {
    setPagingState({ ...pagingState, page: 0 });
  }, [branch_uuid, store_uuid, reload, query]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await inventoryCheckApi.getAllOfBranch(
          store_uuid,
          branch_uuid,
          {
            page: pagingState.page,
            limit: pagingState.limit,
            ...query
          }
        );

        setInventoryChecks(response.data);
        // setPagingState({ ...pagingState, total_rows: response.total_rows });
        setTotalRows(response.total_rows)
      } catch (error) {
        console.log(error);
      }
    };
    loadData();
  }, [pagingState.page, pagingState.limit, branch_uuid, store_uuid, reload, query]);
  const getDataExport = async () => {
    try {
      const response = await inventoryCheckApi.getAllOfBranch(
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

  const theme = useTheme();
  const classes = useStyles(theme);
  const dispatch = useDispatch();
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs")) ;


  const [addOpen, setAddOpen] = useState(false);

  const openInvetoryCheck = () => {
    setAddOpen(true);
  };

  const closeInvetoryCheck = () => {
    setAddOpen(false);
    setIsClosePopUp(false);
  };

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

  const [closePopUp, setIsClosePopUp] = useState(false);
  const [snackStatus, setSnackStatus] = React.useState({
    style: "error",
    message: "Kiểm kho thất bại",
  });
  const [openSnack, setOpenSnack] = React.useState(false);
  const handleCloseSnackBar = (event, reason) => {
    setOpenSnack(false);
  };

  const tableRef = React.createRef();


  return (
    <Card className={classes.root}>
      <SnackBarGeneral
        handleClose={handleCloseSnackBar}
        open={openSnack}
        status={snackStatus}
      />
      {closePopUp && (
        <Dialog
          fullWidth={true}
          maxWidth="lg"
          open={addOpen}
          onClose={closeInvetoryCheck}
          aria-labelledby="form-dialog-title"
        >
          <InventoryCheckPopUp
            handleCloseReturn={closeInvetoryCheck}
            classes={classes}
            setReload={() => {
              setReload(!reload);
            }}
            success={(code) => {
              setSnackStatus({
                style: "success",
                message: `Kiểm kho thành công ${code}`,
              });
              setOpenSnack(true);
              setReload(!reload);
            }}
            failure={() => {
              setSnackStatus({
                style: "success",
                message: `Kiểm kho thất bại`,
              });
              setOpenSnack(true);
            }}
          />
        </Dialog>
      )}
      <Grid container direction="row" justifyContent="space-between">
        {/* 1. ADD POP UP */}
        <Typography className={classes.headerTitle} variant="h5">
          Đơn kiểm kho
        </Typography>

        <Grid className={classes.btngroup1}>
          <ButtonBase
            sx={{ borderRadius: "16px" }}
            onClick={() => {
              openInvetoryCheck();
            }}
          >
            <Avatar variant="rounded" className={classes.headerAvatar}>
              <Tooltip title="Kiểm kho">
                <AddIcon
                  stroke={1.5}
                  size="1.3rem"
                  onClick={() => setIsClosePopUp(true)}
                />
              </Tooltip>
            </Avatar>
          </ButtonBase>
        </Grid>
      </Grid>

      <Divider />

      {/* 2. SEARCH - FILTER - EXPORT*/}
      {/* SAU NÀY SỬA LẠI TRUYỀN DATA SAU KHI FILTER, SORT, LỌC CỘT VÀO */}
      <ToolBar
        dataTable={inventoryChecks}
        tableType={TableType.CHECK_LIST}
        textSearch={"#, Người kiểm,..."} /*handlePrint={handlePrint}*/
        handleToggleFilter={handleToggleFilter}
        handlePrint={handlePrint}
        columnsToKeep = {[
          {dbName:"inventory_check_code",displayName:"Mã đợt kiểm"},
          {dbName:"user_name",displayName:"Người kiểm"},
          {dbName:"created_at",displayName:"Ngày kiểm"},
          {dbName:"total_amount",displayName:"Tổng giá trị lệch"},
          {dbName:"branch_name",displayName:"Tên chi nhánh"},
          {dbName:"created_user_type",displayName:"Tài khoản thực hiện"},
          {dbName:"created_user_name",displayName:"Tên người thực hiện"},
        ]}


        orderByOptions={[
          {value: 'inventory_checks.created_at', label: 'Ngày kiểm'},
          {value: 'inventory_checks.total_amount', label: 'Tổng tiền lệch'},
        ]}
        getDataExport={getDataExport}
        orderBy={query.orderBy} setOrderBy={(value) => setQuery({...query, orderBy: value})}
        sort={query.sort} setSort={(value) => setQuery({...query, sort:value})}
        searchKey={query.searchKey} setSearchKey={(value) => setQuery({...query, searchKey: value})}
        handleRemoveFilter={handleRemoveFilter}
      />

      <CheckHistoryFilter
        query={query}
        setQuery={setQuery}
        openFilter={openFilter}
        setInventoryChecks={setInventoryChecks}
        handleToggleFilter={handleToggleFilter}
      />

      {/* 3. TABLE */}
      {!xsScreen?<TableWrapper pagingState={{...pagingState, total_rows: totalRows}} setPagingState={setPagingState}
      list={inventoryChecks}
      tableRef={tableRef}
      >
        <TableHeader
          classes={classes}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          headerData={HeadCells.CheckHistoryHeadCells}
        />
        <TableBody>
          {inventoryChecks.map((row, index) => {
            return (
              <CheckHistoryTableRow
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
      {inventoryChecks.map((row, index) => {
        return (
          <BillMiniTableRow key={row.uuid} row={row} openRow={openRow} handleOpenRow={handleOpenRow} 
          // onReload={onReload} 
          totalCost={row.details
            ?.map((detail) => Number(detail.quantity) * Number(detail.unit_price))
            .reduce((total, num) => total + num, 0)}  
          id={row.inventory_check_code} partnerName={row.user_name} date={row.created_at} 
          typeBill={"Đơn kiểm kho"} />

        );
      })}
      </Box>
      <Pagination pagingState={{...pagingState, total_rows: totalRows}} setPagingState={setPagingState}       list={inventoryChecks}/>

      </>
      }
      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <ComponentToPrint
            inventoryChecks={inventoryChecks}
            classes={classes}
            query={query}
          />
        </div>
      </div>
    </Card>
  );
};

export default CheckHistory;

const ComponentToPrint = ({ inventoryChecks, classes,query }) => {
  // .created_at.split(" ")[0].split('T')[0].split('-').reverse().join('/')
  const firstDate = inventoryChecks.slice(-1)[0] ?inventoryChecks.slice(-1)[0].created_at.split(" ")[0].split('T')[0].split('-').reverse().join('/'):''
  return (
    <div style={{padding:10}}>
    <Typography style={{color:'#000'}}>Ngày lập:  {moment(new Date()).format("DD/MM/YYYY HH:mm")}</Typography>
    <Box style={{ margin: 10,flexGrow: 1,  textAlign: "center" ,color: "#000"}}>
      <Typography style={{  fontSize: 18, fontWeight: 600}} >
        {/* Thống kê đơn kiểm kho */}
        THỐNG KÊ ĐƠN KIỂM KHO
      </Typography>
      <Typography  >
        {`Từ ngày: ${query.startDate ? ` ${query.startDate.split('-').reverse().join('/')}` :firstDate} - Đến ngày: ${query.endDate? query.endDate.split('-').reverse().join('/') : moment(new Date()).format('DD/MM/YYYY')}`}
      </Typography>
      {query.minTotalAmount || query.maxTotalAmount ? <Typography  > {`Tổng tiền lệch từ: ${query.minTotalAmount?query.minTotalAmount:0}đ đến ${query.maxTotalAmount?query.maxTotalAmount:0}đ`} </Typography>:null}
      {query.searchKey ? <Typography  > {`Tìm kiếm theo: ${query.searchKey}`} </Typography>:null} 

    </Box>
    <div>
    <TableWrapper  isReport={true} >
      <TableHeader
      color="#000"
        classes={classes}
        headerData={HeadCells.CheckHistoryHeadCells.filter(item => item.id !== "debt")}
      />
      <TableBody>
        {inventoryChecks.map((row, index) => {
          return  <CheckHistoryTableRow colorText={"#000"} key={row.uuid} row={row} />
          })}
      </TableBody>
      </TableWrapper>
    </div>
  </div>
  );
};
