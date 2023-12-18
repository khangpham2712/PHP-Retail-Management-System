import * as HeadCells from '../../../assets/constant/tableHead'
import *  as TableType from '../../../assets/constant/tableType'

import { Avatar, Box, Button, ButtonBase, Card, Divider, FormControlLabel, Grid, Switch, TableBody, Tooltip, Typography, FormControl, MenuItem, Select, InputLabel } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react'
import { excel_data_customer, excel_name_customer } from "../../../assets/constant/excel"
import { useDispatch, useSelector } from 'react-redux'

import AddCustomer from './AddCustomer/AddCustomer'
import AddIcon from '@material-ui/icons/Add';
import CustomerFilter from './CustomerTool/CustomerFilter'
import CustomerRegisterEmail from '../../../components/Email/CustomerRegisterEmail';
import CustomerTableRow from './CustomerTableRow/CustomerTableRow'
import DebtHistory from "./DebtHistory/DebtHistory"
import Fuse from 'fuse.js';
import Pagination from "../../../components/TableCommon/TableWrapper/Pagination"
import { PartnerMiniTableRow } from "../../../components/MiniTableRow/MiniTableRow"
import SnackBar from '../../../components/SnackBar/SnackBar'
import TableHeader from '../../../components/TableCommon/TableHeader/TableHeader'
import TableWrapper from '../../../components/TableCommon/TableWrapper/TableWrapper'
import ToolBar from '../../../components/TableCommon/ToolBar/ToolBar'
import ava from '../../../assets/img/product/lyimg.jpeg';
import customerApi from '../../../api/customerApi'
import moment from "moment";
import { removeAccents } from '../../../utils';
import setting from "../../../assets/constant/setting";
import { statusAction } from '../../../store/slice/statusSlice';
import storeApi from '../../../api/storeApi';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useReactToPrint } from "react-to-print";
import useStyles from "../../../components/TableCommon/style/mainViewStyle";
import { useTheme } from "@material-ui/core/styles";
import CustomerGroup from '../../../components/CustomerGroup/CustomerGroup';
//import style

//import lib



//import api 




//import constant
////import project
//riêng
//chung
const Customer = () => {
  const [customerList, setCustomerList] = useState([]);
  const [reload, setReload] = useState(false);

  const onReload = () => setReload(!reload)

  const info = useSelector(state => state.info)
  const store_uuid = info.store.uuid
  const dispatch = useDispatch();
  const store_setting = info.store.general_configuration ? JSON.parse(info.store.general_configuration)  : setting;
  const haveCustomerScore = store_setting.customerScore.status

  const theme = useTheme();
  const classes = useStyles(theme);
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));


  //// 1. Add pop up + noti
  //add
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const [openCustGroup, setOpenCustGroup] = React.useState(false);
  const [custGroups, setCustGroups] = React.useState([])
  useEffect(() => {
    if (customerList?.length) {
      window.localStorage.setItem(
        "customers",
        JSON.stringify({ 
          store_uuid: store_uuid, 
          data: customerList })
      );
    }
  }, [customerList]);

  // const handleClose = (status) => {
  //   setOpen(false);
  //   setAddStatus(status);
  //   if(status === "Success"){
  //     onReload();
  //     setOpenBar(true);
  //   }else if (status === "Fail"){
  //     setOpenBar(true);
  //   }
  // };

  //status add
  const [addStatus, setAddStatus] = React.useState(null);

  //noti
  const [openBar, setOpenBar] = React.useState(false);
  const handleCloseBar = () => {
    setOpenBar(false)
  };

  //// 2. Table
  // console.log(info.store.general_configuration)
  //collapse
  const [openRow, setRowOpen] = React.useState(null);
  const handleOpenRow = (row) => {
    if (row !== openRow) { setRowOpen(row); }
    else { setRowOpen(null) }
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
  const [showOnlyDebt, setShowOnlyDebt] = React.useState(false);
  const [selectedGroup, setSelectedGroup] = React.useState("");
  //3.3. loc cot

  const initialQuery = {
    orderBy: 'customers.created_at',
    sort: 'desc',
    searchKey: '',
  };
  const handleRemoveFilter = (initialQuery) => {
    setQuery(initialQuery)
  }


  useEffect(() => {
    const localData = window.localStorage.getItem("customers");
    const customerData = localData ? JSON.parse(localData) : {};
    if (customerData?.store_uuid === store_uuid) {
      setCustomerList(localData.data);
    }
  }, [store_uuid, reload]);

  const [query, setQuery] = useState(initialQuery);
  const [pagingState, setPagingState] = useState({
    page: 0,
    limit: 10,
  });

  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    setPagingState({ ...pagingState, page: 0 });
    setTotalRows(filterCustomer().length);
  }, [reload, store_uuid, query]);

  const compare = (e1, op, e2) => {
    switch (op) {
      case "<=":
        return e1 <= e2;
      case ">=":
        return e1 >= e2;
      case "=":
        return e1 === e2;
    }
  };

  const evaluate = (cond, cust) => {
    switch (cond.criteria) {
      case "totalAmount": {
        return compare(
          Number(cust.total_payment),
          cond.operation,
          Number(cond.thres)
        );
      }
      case "numOfOrder": {
        return compare(Number(cust.orders), cond.operation, Number(cond.thres));
      }
      case "time": {
        return compare(cust.created_at, cond.operation, cond.thres);
      }
      case "point": {
        return compare(Number(cust.points), cond.operation, Number(cond.thres));
      }
    }
  };
  const customerMapGroup = (custData, groupData) => {
    const newCustList = custData.map((cust) => {
      const satisfiedGroups = [];
      groupData.forEach((g) => {
        const conditions = JSON.parse(g.conditions);
        console.log(conditions);
        if (
          conditions.every((cond) => {
            if (evaluate(cond, cust)) console.log(evaluate(cond, cust));
            return evaluate(cond, cust);
          })
        ) {
          satisfiedGroups.push(g.name);
        }
      });
      return { ...cust, groups: satisfiedGroups };
    });
    setCustomerList(newCustList);
  };

  const loadData = async () => {
    try {
      const [{ data: custData, total_rows: totalRows }, { data: groupData }] =
        await Promise.all([
          customerApi.getCustomers(store_uuid, {
            ...query,
            searchKey: "",
          }),
          customerApi.getCustomerGroups(store_uuid),
        ]);
      customerMapGroup(custData, groupData);
      setCustGroups(groupData);
      setTotalRows(totalRows);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (store_uuid) {
      loadData();
    }
  }, [reload, store_uuid]);
  const getDataExport = async () => {
    try {
      const response = await customerApi.getCustomers(
        store_uuid,
        query,
      );
      return response.data;
    } catch (error) {
      dispatch(statusAction.failedStatus('Không thể lấy dữ liệu'))
      console.log(error);
    }
  }

  const tableRef = React.createRef();

  const importCustomerByJSON  = async (jsonData) => {
    try {
      await customerApi.importCustomerJson(store_uuid,jsonData);
    }catch(error){
    }
  }

  // const filterCustomer = () => {
  //   if (query.searchKey) {
  //     const options = {
  //       includeScore: true,
  //       // Search in `author` and in `tags` array
  //       keys: ['customer_code', 'name', 'phone', 'email']
  //     }
  //     const fuse = new Fuse(customerList, options)
  //     const result = fuse.search(query.searchKey);
  //     return showOnlyDebt ? result.map(r => r.item).filter(cust => cust.debt > 0) : result.map(r => r.item);
  //   } 
    
  //   if (showOnlyDebt) {
  //     return customerList.filter(cust => cust.debt > 0);
  //   }
  //   return customerList
    
  // }
  const filterCustomer = () => {
    const custOfGroup = customerList ? customerList.filter(cust => selectedGroup ? cust.groups.find(g => g === selectedGroup) : true) : [];
    if (query.searchKey) {
      const result = custOfGroup
        .filter(cust => `${cust.customer_code} - ${cust.name} - ${cust.phone} - ${cust.email}`.includes(query.searchKey))
      return showOnlyDebt ? result.filter(cust => cust.debt > 0) : result;
    }

    if (showOnlyDebt) {
      return custOfGroup
        .filter(cust => `${cust.customer_code} - ${cust.name} - ${cust.phone} - ${cust.email}`.includes(query.searchKey))
        .filter(cust => cust.debt > 0);
    }

    return custOfGroup;
  }
  const [openHistory,setOpenHistory ] =  useState(false)
  return (

    <Card className={classes.root} >
      <Grid
        container
        direction="row"
        justifyContent="space-between"
      >
        {/* 1. ADD POP UP */}
        <Typography className={classes.headerTitle} variant="h5">
          Khách hàng
        </Typography>

        <Grid className={classes.btngroup1} >
          <Button variant="outlined" color="primary"style={{marginRight:15}} onClick={()=>setOpenHistory(true)}>Lịch sử thu nợ</Button>
          <Button variant="outlined" color="primary"style={{marginRight:15}} onClick={()=>setOpenCustGroup(true)}>Nhóm khách hàng</Button>
          {openHistory? <DebtHistory open={openHistory}  onClose={()=>setOpenHistory(false)}/>:null} 
          {openCustGroup ? <CustomerGroup open={openCustGroup}  onClose={()=>setOpenCustGroup(false)} custGroups={custGroups} fetchData={loadData}/> : null}
          <ButtonBase sx={{ borderRadius: '16px' }}
            onClick={handleClickOpen}
          >
            <Avatar variant="rounded" className={classes.headerAvatar}  >
              <Tooltip title='Thêm khách hàng'>
                <AddIcon stroke={1.5} size="1.3rem" />
              </Tooltip>
            </Avatar>
          </ButtonBase>
        </Grid>
      </Grid>

      {/* Popup add */}

      {/* {open && <AddCustomer open={open} handleClose={handleClose} onReload={onReload} />} */}
      {open && <AddCustomer open={open} handleClose={() => setOpen(false)} onReload={onReload} />}

      {/* Noti */}
      {/* <SnackBar openBar={openBar} handleCloseBar={handleCloseBar} addStatus={addStatus}/> */}


      <Divider openFilter={openFilter} handleToggleFilter={handleToggleFilter} />

      {/* 2. SEARCH - FILTER - EXPORT*/}
      {/* SAU NÀY SỬA LẠI TRUYỀN DATA SAU KHI FILTER, SORT, LỌC CỘT VÀO */}
      <ToolBar
        dataTable={customerList}
        tableType={TableType.CUSTOMER}
        textSearch={'#, Tên, sđt, email,...  '} /*handlePrint={handlePrint}*/
        handleToggleFilter={handleToggleFilter}
        handlePrint={handlePrint}
        isOnlySearch={true}
        hasImport={true}
        handleRemoveFilter={handleRemoveFilter}
        searchKey={query.searchKey} setSearchKey={(value) => setQuery({ ...query, searchKey: value })}
        customizable={false}
        getDataExport={getDataExport}
        excel_data={excel_data_customer}
        excel_name={excel_name_customer}
        importByJSON={importCustomerByJSON}
        
        columnsToKeep={[
          { dbName: "name", displayName: "Tên khách hàng" },
          { dbName: "phone", displayName: "Số điện thoại" },
          { dbName: "email", displayName: "Email" },
          { dbName: "address", displayName: "Địa chỉ" },
          { dbName: "payment_info", displayName: "Thông tin thanh toán" },
          { dbName: "points", displayName: "Tích điểm" },
          { dbName: "total_payment", displayName: "Tổng tiền mua" },
          { dbName: "debt", displayName: "Còn nợ" },
        ]}

        extra={<>
          <Tooltip title="Chỉ hiện khách nợ">
            <FormControlLabel
              style={{ marginLeft: 10, marginTop: 5 }}
              control={
                <Switch
                  size="small"
                  checked={showOnlyDebt}
                  onChange={(e) => { setPagingState({ ...pagingState, page: 0 }); setShowOnlyDebt(e.target.checked) }}
                  color="primary"
                />
              }
            />
          </Tooltip>
          <FormControl sx={{ m: 1, width: 200 }} size="small">
            <InputLabel id="cust-select">Nhóm khách hàng</InputLabel>
            <Select
              labelId="cust-select"
              id="cust-select"
              // onChange={handleChange}
              value={selectedGroup}
              style={{width: 200}}
              onChange={(e) => {
                setSelectedGroup(e.target.value)
              }}
            >
              {custGroups.map(g => (
                <MenuItem value={g.name}>{g.name}</MenuItem>
              ))}
              <MenuItem value={""} title='Tất cả' >Tất cả</MenuItem>
            </Select>
          </FormControl>
        </>}
      />

      <CustomerFilter openFilter={openFilter} handleToggleFilter={handleToggleFilter} />
      {/* 3. TABLE */}
      {!xsScreen ? <TableWrapper
        pagingState={{ ...pagingState, total_rows: totalRows }}
        setPagingState={setPagingState}
        list={customerList}
        tableRef={tableRef}
      >
        <TableHeader
          classes={classes}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          headerData={haveCustomerScore ?HeadCells.CustomerHeadCells :HeadCells.CustomerHeadCells.filter(item => !item.id.includes('score'))}
        />
        <TableBody>
          {filterCustomer().map((row, index) => {
            return (
              <CustomerTableRow key={row.uuid} row={row} openRow={openRow} handleOpenRow={handleOpenRow} onReload={onReload} />
            );
          })}
        </TableBody>
      </TableWrapper> :
        <>
          <Box style={{ minHeight: '60vh' }}>
            {filterCustomer()?.map((row, index) => {
              return (
                <PartnerMiniTableRow key={row.uuid} row={row} openRow={openRow} handleOpenRow={handleOpenRow} onReload={onReload}
                  img={ava} id={row.customer_code} name={row.name} phone={row.phone} score={haveCustomerScore?row.points:null}
                  typePartner={"Khách hàng"} />
              );
            })}
          </Box>
          <Pagination pagingState={{ ...pagingState, total_rows: totalRows}} setPagingState={setPagingState} list={customerList} />

        </>}

      <div style={{ display: 'none' }} >
        <div ref={componentRef}  >
          <ComponentToPrint customerList={customerList} classes={classes} />
        </div>
      </div>
    </Card>
  )
}

export default Customer

const ComponentToPrint = ({ customerList, classes , query}) => {
  const info = useSelector(state => state.info)
  const store_setting = info.store.general_configuration ? JSON.parse(info.store.general_configuration)  : setting;
  const haveCustomerScore = store_setting.customerScore.status

  let hidenCollumn = [haveCustomerScore ? null: "score", ""]
  return (
    <div style={{padding:10}}>
    <Typography style={{color:'#000'}}>Ngày lập:  {moment(new Date()).format("DD/MM/YYYY HH:mm")}</Typography>
    <Box style={{ margin: 10,flexGrow: 1,  textAlign: "center" ,color: "#000"}}>
      <Typography style={{  fontSize: 18, fontWeight: 600}} >
        {/* Thống kê khách hàng */}
        THỐNG KÊ KHÁCH HÀNG
      </Typography>
      {/* {query.searchKey ? <Typography  > {`Tìm kiếm theo: ${query.searchKey}`} </Typography>:null}
      {query.status? <Typography  > {`Tình trạng: ${query.status}`} </Typography>:null}
      {query.categoryId? <Typography  > {`Danh mục: ${query.categoryId === "cash"?"Tiên mặt":"Thẻ"}`} </Typography>:null}
      {query.minStandardPrice || query.maxStandardPrice ? <Typography  > {`Tổng tiền đơn từ: ${query.minStandardPrice?query.minStandardPrice:0}đ đến ${query.maxStandardPrice?query.maxStandardPrice:0}đ`} </Typography>:null}
      {query.minListPrice || query.maxListPrice ? <Typography  > {`Đơn giảm giá từ: ${query.minListPrice?query.maxListPrice:0}đ đến ${query.maxDiscount?query.maxListPrice:0}đ`} </Typography>:null}
      {query.minInventory || query.maxInventory ? <Typography  > {`Đơn giảm giá từ: ${query.minInventory?query.maxInventory:0}đ đến ${query.maxDiscount?query.maxInventory:0}đ`} </Typography>:null} */}

    </Box>
    <div>
    <TableWrapper  isReport={true} >
      <TableHeader
      color="#000"
        classes={classes}
        // headerData={HeadCells.CustomerHeadCells.filter(item => item.id !== ""  || (haveCustomerScore ? item.id !== "score":null ))}
        headerData={HeadCells.CustomerHeadCells.filter(item => !hidenCollumn.includes(item.id) )}

      />
      <TableBody>
        {customerList?.map((row, index) => {
          return  <CustomerTableRow colorText={"#000"} key={row.uuid} row={row} hidenCollumn={["debtStatus", "image"]}  />
        })}
      </TableBody>
      </TableWrapper>
    </div>
  </div>
  )
}