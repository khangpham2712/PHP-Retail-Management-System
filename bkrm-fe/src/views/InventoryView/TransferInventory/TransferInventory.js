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
import TransferInventoryTableRow from "./TransferInventoryRow/TransferInventoryTableRow";
import TransferInventoryRow from "./TransferInventoryRow/TransferInventoryTableRow";
//chung
import TableHeader from "../../../components/TableCommon/TableHeader/TableHeader";
import ToolBar from "../../../components/TableCommon/ToolBar/ToolBar";
import TableWrapper from "../../../components/TableCommon/TableWrapper/TableWrapper";
import transferInventoryApi from "../../../api/transferInventoryApi";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import {BillMiniTableRow} from "../../../components/MiniTableRow/MiniTableRow"
import Pagination from "../../../components/TableCommon/TableWrapper/Pagination"
import { statusAction } from "../../../store/slice/statusSlice";
import {ThousandFormat, VNDFormat} from '../../../components/TextField/NumberFormatCustom'
import moment from "moment";
import { useHistory } from "react-router-dom";

const TransferInventory = () => {
  const [data, setData] = useState([]);

  const theme = useTheme();
  const classes = useStyles(theme);
  const dispatch = useDispatch();
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const navigate = useHistory();

  //// 2. Table
  //collapse
  const [openRow, setRowOpen] = React.useState(null);
  const handleOpenRow = (row) => {
    const rowData = data.find((item) => item.code === row);

    localStorage.setItem("transferInventory", JSON.stringify(rowData));
    navigate.push(`/home/inventory/transfer-detail`);
  };

  // toolbar
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;

  const loadData = async () => {
    try {
      const response = await transferInventoryApi.get(store_uuid, branch_uuid);

      setData(response.data);
    } catch (error) {
      console.log(error);
      setData([]);
    }
  };

  useEffect(() => {
    setData([]);
    if (store_uuid && branch_uuid) {
      loadData();
    }
  }, [store_uuid, branch_uuid]);

  const getDataExport = async () => {
    try {
      const response = await transferInventoryApi.get(store_uuid, branch_uuid);
      return response.data;
    } catch (error) {
      dispatch(statusAction.failedStatus("Không thể lấy dữ liệu"));
      console.log(error);
    }
  };

  const tableRef = React.createRef();

  return (
    <Card className={classes.root}>
      <Grid container direction="row" justifyContent="space-between">
        {/* 1. ADD POP UP */}
        <Typography className={classes.headerTitle} variant="h5">
          Đơn chuyển kho
        </Typography>

        <Grid className={classes.btngroup1}>
          <ButtonBase
            sx={{ borderRadius: "16px" }}
            onClick={() => {
              dispatch(customizeAction.setSidebarOpen(false));
              dispatch(customizeAction.setItemMenuOpen(4));
            }}
            component={Link}
            to="/home/inventory/transfer"
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
        dataTable={data}
        tableType={TableType.TRANSFER_INVENTORY}
        textSearch={"#, NCC, Nguoi nhap,..."}
        // handleToggleFilter={handleToggleFilter}
        handlePrint={handlePrint}
        // orderByOptions={[
        //   {value: 'purchase_orders.creation_date', label: 'Ngày nhập'},
        //   {value: 'total_amount', label: 'Tổng tiền nhập'},
        // ]}
        // orderBy={query.orderBy} setOrderBy={(value) => setQuery({...query, orderBy: value})}
        // sort={query.sort} setSort={(value) => setQuery({...query, sort:value})}
        // searchKey={query.searchKey} setSearchKey={(value) => setQuery({...query, searchKey: value})}

        // handleRemoveFilter={handleRemoveFilter}
        getDataExport={getDataExport}
        columnsToKeep={[
          { dbName: "purchase_order_code", displayName: "Mã đơn nhập" },
          { dbName: "payment_date", displayName: "Ngày nhập" },
          { dbName: "supplier_name", displayName: "Nhà cung cấp" },
          { dbName: "total_amount", displayName: "Tổng tiền nhập" },
          { dbName: "paid_amount", displayName: "Tiền đã trả" },
          { dbName: "branch_name", displayName: "Chi nhánh thực hiện" },
          { dbName: "payment_method", displayName: "Phương thức thanh toán" },
          { dbName: "created_user_type", displayName: "Tài khoản thực hiện" },
          { dbName: "created_user_name", displayName: "Tên người thực hiện" },
        ]}
        isOnlySearch={true}
      />
      {/* 
      <InventoryOrderFilter
        openFilter={openFilter}
        setQuery={setQuery}
        query={query}
        setPurchaseOrders={setPurchaseOrders}
        handleToggleFilter={handleToggleFilter}
      /> */}

      {/* 3. TABLE */}
      <TableWrapper
        // pagingState={{...pagingState, total_rows: totalRows}}
        // setPagingState={setPagingState}
        // list={data}
        tableRef={tableRef}
      >
        <TableHeader
          classes={classes}
          headerData={HeadCells.TransferInventoryHeadCells}
          // pagingState={pagingState}
          setPagingState={() => {}}
        />
        <TableBody>
          {data.map((row, index) => {
            return (
              <TransferInventoryTableRow
                key={row.code}
                row={row}
                openRow={openRow}
                handleOpenRow={handleOpenRow}
              />
            );
          })}
        </TableBody>
      </TableWrapper>
    </Card>
  );
};

export default TransferInventory;

