import React, { useEffect, useState } from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";

//import project
import {
  CardHeader,
  Tooltip,
  TextField,
  IconButton,
  InputAdornment,
  Box,
  Button,
  Typography,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select
} from "@material-ui/core";

// import - icon
import GetAppTwoToneIcon from "@material-ui/icons/GetAppTwoTone";
import PrintTwoToneIcon from "@material-ui/icons/PrintTwoTone";
import ViewColumnTwoToneIcon from "@material-ui/icons/ViewColumnTwoTone";
import FilterListTwoToneIcon from "@material-ui/icons/FilterListTwoTone";
import SearchTwoToneIcon from "@material-ui/icons/SearchTwoTone";
import barcodeIcon from "../../../assets/img/icon/barcode_grey.png";
import grey from "@material-ui/core/colors/grey";
import NoteAddTwoToneIcon from "@material-ui/icons/NoteAddTwoTone";
// import third party
import xlsx from "xlsx";
import SimpleModal from "../../Modal/ModalWrapper";

import ModalWrapperWithClose from "../../Modal/ModalWrapperWithClose";
import { applyMiddleware } from "@reduxjs/toolkit";
import { DeleteForever } from "@material-ui/icons";
import DeleteForeverOutlined from "@material-ui/icons/DeleteForeverOutlined";
// import SimpleModal from "../../Modal/ModalWrapper";

//--thu vien nay bij loi font
// import jsPDF from 'jspdf'
// import 'jspdf-autotable'
const cell = ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1", "J1", "K1",];
const useStyles = makeStyles((theme) =>
  createStyles({
    icon: {
      color: theme.customization.mode === "Light" ? grey[700] : grey[50],
    },
    toolbar: {
      justifyContent: "left",
    },
    search: {
      borderRadius: theme.customization.borderRadius,
      height: 40,
      marginLeft: 10,
      marginTop: 10,
      backgroundColor:
        theme.customization.mode === "Light" ? grey[50] : grey[700],
    },
    search: {
      borderRadius: theme.customization.borderRadius,
      height: 40,
      marginLeft: 10,
      marginTop: 0,
      //
      width: 260,
      backgroundColor:
        theme.customization.mode === "Light" ? grey[50] : grey[700],
    },
    actions: {
      marginTop: 0,
    },
  })
);
const exportExcel = (dataTable, tableType, columnsToKeep = []) => {
  try {
    const newData = []
    dataTable.map((row) => {
      let rowRs = {}
      columnsToKeep.map((cl) => {
        rowRs = { ...rowRs, [cl.displayName]: row[cl.dbName] }
      })
      newData.push(rowRs)
    })
    const workSheet = xlsx.utils.json_to_sheet(newData);
    const workBook = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(workBook, workSheet, tableType);
    //Buffer
    //let buf=XLSX.write(workBook,{bookType:"xlsx",type:"buffer"})
    //Binary string
    xlsx.write(workBook, { bookType: "xlsx", type: "binary" });
    //Download
    xlsx.writeFile(workBook, `${tableType}.xlsx`);
  } catch (err) {
    console.log(err)
  }
};

const ToolBar = (props) => {
  const {
    dataTable,
    tableType,
    handlePrint,
    textSearch,
    handleToggleFilter,
    hasImport,
    importByJSON,
    excel_head,
    excel_data,
    excel_name,
    columnsToKeep,
    searchKey, setSearchKey,
    orderByOptions, orderBy, setOrderBy,
    handleRemoveFilter,
    sort, setSort,
    isOnlySearch,
    getDataExport,
    customizable,
    handleDeleteAll,
    extra,
  } = props;
  const theme = useTheme();
  const classes = useStyles(theme);

  const [openImport, setOpenImport] = useState(false);
  const [custom, setCustom] = useState(true)
  const [customCl, setCustomCl] = useState({
    name: "Sản phẩm",
    bar_code: "Mã vạch",
    category_id: "Danh mục",
    list_price: "Giá bán",
    standard_price: "Giá vốn",
    quantity_per_unit: "Đơn vị",
    quantity: "Tồn kho",
    min_reorder_quantity: "Tồn nhỏ nhất",
    max_order: "Tồn lớn nhất",
    img_urls: "Hình ảnh",
    has_batches: "Lô",
    description: "Miêu tả"
  })
  // const [json, setJson] = useState(null);

  const readUploadFile = (e, setJsonData) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // debugger
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const myJson = xlsx.utils.sheet_to_json(worksheet)
        try {
          const json = myJson.map((product) => ({
            name: product[customCl.name]?.toString()? product[customCl.name]?.toString(): "",
            list_price: product[customCl.list_price]?.toString()? product[customCl.list_price]?.toString(): "",
            standard_price: product[customCl.standard_price]?.toString()?product[customCl.standard_price]?.toString() : "",
            category_name: product[customCl.category_id]?.toString()? product[customCl.category_id]?.toString(): "",
            bar_code: product[customCl.bar_code]?.toString()?product[customCl.bar_code]?.toString() : "",
            quantity_per_unit: product[customCl.quantity_per_unit]?.toString()?product[customCl.quantity_per_unit]?.toString() : "",
            min_reorder_quantity: product[customCl.min_reorder_quantity]?.toString() ?  product[customCl.min_reorder_quantity]?.toString() : "",
            description: product[customCl.description]?.toString() ? product[customCl.description]?.toString(): "",
            has_batches: product[customCl.has_batches]?.toString() ? product[customCl.has_batches]?.toString() : 0,
            max_order: product[customCl.max_order]?.toString() ? product[customCl.max_order]?.toString() : "",
            img_urls: product[customCl.img_urls]?.toString().split(",") ? product[customCl.img_urls]?.toString().split(",") : "",
            quantity: product[customCl.quantity]?.toString() ? product[customCl.quantity]?.toString()  : "0"
          }))
          setJsonData(json);
        } catch (err) {
          console.log(err)
        }
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };
  const [excel, setExcel] = useState([])
  const readCustomerUploadFile = (e, setJsonData) => {
    e.preventDefault();
    try {
      if (e.target.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = xlsx.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const excelLines = xlsx.utils.sheet_to_json(worksheet)
          const json = excelLines.map((line) => ({
            name: line["Tên khách hàng"],
            phone: line["Số điện thoại"],
            address: line["Địa chỉ"],
            email: line["Email"],
            payment_info: line["Thông tin thanh toán"],
            points: line["Tích điểm"],
            total_payment: line["Tổng tiền mua"],
            debt: line["Còn nợ"],
          }))
          setJsonData(json);
        };
        reader.readAsArrayBuffer(e.target.files[0]);
      }
    } catch (error) {
      console.log(error)
    }
  };
  const handleImport = () => {
    setOpenImport(false);
    if (custom && customizable) {
      console.log("customCl",customCl)
      setListCl([])
      const json = excel.map((product) =>
      
       {
        console.log("customCl.img_urls",product[customCl.img_urls])

         return ({
        name: product[customCl.name]?.toString()? product[customCl.name]?.toString(): "",
        list_price: product[customCl.list_price]?.toString()? product[customCl.list_price]?.toString(): "",
        standard_price: product[customCl.standard_price]?.toString()?product[customCl.standard_price]?.toString() : "",
        category_name: product[customCl.category_id]?.toString()? product[customCl.category_id]?.toString(): "",
        bar_code: product[customCl.bar_code]?.toString()?product[customCl.bar_code]?.toString() : "",
        quantity_per_unit: product[customCl.quantity_per_unit]?.toString()?product[customCl.quantity_per_unit]?.toString() : "",
        min_reorder_quantity: product[customCl.min_reorder_quantity]?.toString() ?  product[customCl.min_reorder_quantity]?.toString() : "",
        description: product[customCl.description]?.toString() ? product[customCl.description]?.toString(): "",
        has_batches: product[customCl.has_batches]?.toString() ? product[customCl.has_batches]?.toString() : 0,
        max_order: product[customCl.max_order]?.toString() ? product[customCl.max_order]?.toString() : "",
        // img_urls: product[customCl.img_urls]?.toString().split(",") ? product[customCl.img_urls]?.toString().split(",") : "",
        img_urls: product[customCl.img_urls] ? product[customCl.img_urls] : "",

        quantity: product[customCl.quantity]?.toString() ? product[customCl.quantity]?.toString()  : "0"
      })})
      importByJSON(json);
    } else {
      importByJSON(jsonData);
    }
  };
  const [jsonData, setJsonData] = useState([]);

  const [listCl, setListCl] = useState([]);

  useEffect(() => {
    setListCl([])
  }, [openImport])

  const readCustomizedProduct = (e) => {
    e.preventDefault();
    try {
      if (e.target.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = xlsx.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const excelLines = xlsx.utils.sheet_to_json(worksheet)
          setExcel(excelLines)
          setListCl(Object.keys(excelLines[0]))
        };
        reader.readAsArrayBuffer(e.target.files[0]);
      }
    } catch(err) {
      console.log(err)
    }
    
  };
  return (

    <>
      <Grid container direction="row" justifyContent="space-between">
        <Grid item>
          <Grid container direction="row">
            <Tooltip title="Nhấn Enter để tìm kiếm">
              <TextField
                style={{ marginTop: 12, marginLeft: 10 }}
                variant="outlined"
                onKeyUp={(e) => {
                  if (e.key === "Enter" || e.target.value === "") {
                    setSearchKey(e.target.value)
                  }
                }
                }
                placeholder={textSearch} /*placeholder='Tìm kiếm ...'*/
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchTwoToneIcon className={classes.icon} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box
                        component="img"
                        sx={{ height: 23, width: 23 }}
                        src={barcodeIcon}
                      />
                    </InputAdornment>
                  ),
                  className: classes.search,
                }}
              />
            </Tooltip>
            {!isOnlySearch &&

              <div style={{ marginLeft: 30, display: 'flex', flexDirection: 'row', gap: 10 }}>
                <FormControl>
                  <InputLabel variant="standard" htmlFor="uncontrolled-native">
                    Sắp xếp theo
                  </InputLabel>
                  <Select
                    autoWidth={true}
                    labelId="orderBy"
                    value={orderBy}
                    label="Sap xep theo"
                    onChange={(e) => setOrderBy(e.target.value)}
                  >
                    {orderByOptions?.map(o => <MenuItem value={o.value}>{o.label}</MenuItem>)}
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel variant="standard" htmlFor="uncontrolled-native">
                    Thứ tự
                  </InputLabel>
                  <Select
                    autoWidth={true}
                    labelId="sort"
                    value={sort}
                    label="Sap xep theo"
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <MenuItem value="asc">Tăng dần</MenuItem>
                    <MenuItem value="desc">Giảm dần</MenuItem>
                  </Select>
                </FormControl>
                <Button onClick={handleRemoveFilter}>
                  Bỏ lọc
                </Button>
              </div>
            }
            {extra ? extra : null}
          </Grid>
        </Grid>
        
        <Grid item>
          <Box className={classes.actions}>
            <Tooltip
              title="Nhập excel"
              style={{ display: hasImport ? null : "none" }}
            >
              <IconButton
                aria-label="filter list"
                onClick={() => setOpenImport(true)}
              >
                <NoteAddTwoToneIcon className={classes.icon} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Xuất excel">
              <IconButton
                aria-label="filter list"
                onClick={async () => {
                  if (getDataExport) {
                    const dataTableFull = await getDataExport();
                    exportExcel(dataTableFull, tableType, columnsToKeep);
                  } else {
                    exportExcel(dataTable, tableType, columnsToKeep);
                  }
                }}
              >
                <GetAppTwoToneIcon className={classes.icon} />
              </IconButton>
            </Tooltip>

            {/* {handleDeleteAll ? <Tooltip
              title="Xóa tất cả hóa đơn"
            >
              <IconButton
                aria-label="deletealll "
                onClick={() => handleDeleteAll()}
              >
                <DeleteForeverOutlined className={classes.icon} />
              </IconButton>
            </Tooltip>: null} */}

            <Tooltip title="In danh sách">
              <IconButton
                aria-label="filter list"
                onClick={() => {
                  handlePrint();
                }}
              >
                <PrintTwoToneIcon className={classes.icon} />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title="Chọn cột">
            <IconButton aria-label="filter list">
              <ViewColumnTwoToneIcon className={classes.icon} />
            </IconButton>
          </Tooltip> */}
            {!isOnlySearch &&
              <Tooltip title="Lọc">
                <IconButton aria-label="filter list" onClick={handleToggleFilter}>
                  <FilterListTwoToneIcon className={classes.icon} />
                </IconButton>
              </Tooltip>
            }

            

          </Box>
        </Grid>
      </Grid>

      {openImport && <ModalWrapperWithClose
        open={openImport}
        handleClose={() => setOpenImport(false)}
        title="Nhập dữ liệu từ file excel"
      >

        {customizable ?
          <Typography style={{ marginBottom: 15 }}>
            (Tải về file mẫu:
            <a
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => {
                exportExcel(excel_data, excel_name, columnsToKeep.filter(cl => cl.dbName != "product_code"));
              }}
            >
              Excel mẫu
            </a> hoặc <a style={{ color: "blue", cursor: "pointer" }}> tùy chỉnh </a>
            )
          </Typography> :
          <Typography style={{ marginBottom: 15 }}>
            (Tải về file mẫu:
            <a
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => {
                exportExcel(excel_data, excel_name,  columnsToKeep.filter(cl => cl.dbName != "total_payment" && cl.dbName !="debt"));
              }}
            >
              Excel mẫu
            </a>
            )
          </Typography>
        }


        {
          custom && listCl.length > 0 && excel && customizable &&
          <Grid container spacing={2} style={{ marginBottom: 15, width: 600, maxWidth: "90vw" }} direction="row" justifyContent="center" alignItems="center">

            <Grid item sm={6} xs={12}>
              <Box flexDirection="row" display="flex" justifyContent="space-between" alignItems="center">
                <Typography><b>Tên sản phẩm</b></Typography>
                <TextField label="Tên tùy chỉnh" required value={customCl.name} style={{ minWidth: 150, maxWidth: "80%" }} size="small" select variant="outlined" SelectProps={{ native: true }} onChange={(e) => setCustomCl({ ...customCl, name: e.target.value })}>
                  <option value="" />
                  {listCl.map((cl) => (
                    <option key={cl} value={cl}>
                      {cl}
                    </option>
                  ))}
                </TextField>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box flexDirection="row" display="flex" justifyContent="space-between" alignItems="center">
                <Typography><b>Giá bán</b></Typography>
                <TextField label="Tên tùy chỉnh" required value={customCl.list_price} style={{ minWidth: 150, maxWidth: "80%" }} size="small" select variant="outlined" SelectProps={{ native: true }} onChange={(e) => setCustomCl({ ...customCl, list_price: e.target.value })}>
                  <option value="" />
                  {listCl.map((cl) => (
                    <option key={cl} value={cl}>
                      {cl}
                    </option>
                  ))}
                </TextField>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box flexDirection="row" display="flex" justifyContent="space-between" alignItems="center">
                <Typography><b>Giá vốn</b></Typography>
                <TextField label="Tên tùy chỉnh" required value={customCl.standard_price} style={{ minWidth: 150, maxWidth: "80%" }} size="small" select variant="outlined" SelectProps={{ native: true }} onChange={(e) => setCustomCl({ ...customCl, standard_price: e.target.value })}>
                  <option value="" />
                  {listCl.map((cl) => (
                    <option key={cl} value={cl}>
                      {cl}
                    </option>
                  ))}
                </TextField>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box flexDirection="row" display="flex" justifyContent="space-between" alignItems="center">
                <Typography><b>Danh mục</b></Typography>
                <TextField label="Tên tùy chỉnh" value={customCl.category_id} style={{ minWidth: 150, maxWidth: "80%" }} size="small" select variant="outlined" SelectProps={{ native: true }} onChange={(e) => setCustomCl({ ...customCl, category_id: e.target.value })}>
                  <option value="" />
                  {listCl.map((cl) => (
                    <option key={cl} value={cl}>
                      {cl}
                    </option>
                  ))}
                </TextField>
              </Box>
            </Grid>            
            <Grid item sm={6} xs={12}>
              <Box flexDirection="row" display="flex" justifyContent="space-between" alignItems="center">
                <Typography><b>Mã vạch</b></Typography>
                <TextField label="Tên tùy chỉnh" value={customCl.bar_code} style={{ minWidth: 150, maxWidth: "80%" }} size="small" select variant="outlined" SelectProps={{ native: true }} onChange={(e) => setCustomCl({ ...customCl, bar_code: e.target.value })}>
                  <option value="" />
                  {listCl.map((cl) => (
                    <option key={cl} value={cl}>
                      {cl}
                    </option>
                  ))}
                </TextField>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box flexDirection="row" display="flex" justifyContent="space-between" alignItems="center">
                <Typography><b>Đơn vị</b></Typography>
                <TextField label="Tên tùy chỉnh" value={customCl.quantity_per_unit} style={{ minWidth: 150, maxWidth: "80%" }} size="small" select variant="outlined" SelectProps={{ native: true }} onChange={(e) => setCustomCl({ ...customCl, quantity_per_unit: e.target.value })}>
                  <option value="" />
                  {listCl.map((cl) => (
                    <option key={cl} value={cl}>
                      {cl}
                    </option>
                  ))}
                </TextField>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box flexDirection="row" display="flex" justifyContent="space-between" alignItems="center">
                <Typography><b>Tồn nhỏ nhất</b></Typography>
                <TextField label="Tên tùy chỉnh" value={customCl.min_reorder_quantity} style={{ minWidth: 150, maxWidth: "80%" }} size="small" select variant="outlined" SelectProps={{ native: true }} onChange={(e) => setCustomCl({ ...customCl, min_reorder_quantity: e.target.value })}>
                  <option value="" />
                  {listCl.map((cl) => (
                    <option key={cl} value={cl}>
                      {cl}
                    </option>
                  ))}
                </TextField>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box flexDirection="row" display="flex" justifyContent="space-between" alignItems="center">
                <Typography><b>Tồn lớn nhất</b></Typography>
                <TextField label="Tên tùy chỉnh" value={customCl.max_order} style={{ minWidth: 150, maxWidth: "80%" }} size="small" select variant="outlined" SelectProps={{ native: true }} onChange={(e) => setCustomCl({ ...customCl, max_order: e.target.value })}>
                  <option value="" />
                  {listCl.map((cl) => (
                    <option key={cl} value={cl}>
                      {cl}
                    </option>
                  ))}
                </TextField>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box flexDirection="row" display="flex" justifyContent="space-between" alignItems="center">
                <Typography><b>Hình ảnh (url1, url2,...)</b></Typography>
                <TextField label="Tên tùy chỉnh" value={customCl.img_urls} style={{ minWidth: 150, maxWidth: "80%" }} size="small" select variant="outlined" SelectProps={{ native: true }} onChange={(e) => setCustomCl({ ...customCl, img_urls: e.target.value })}>
                  <option value="" />
                  {listCl.map((cl) => (
                    <option key={cl} value={cl}>
                      {cl}
                    </option>
                  ))}
                </TextField>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box flexDirection="row" display="flex" justifyContent="space-between" alignItems="center">
                <Typography><b>Mô tả</b></Typography>
                <TextField label="Tên tùy chỉnh" value={customCl.description} style={{ minWidth: 150, maxWidth: "80%" }} size="small" select variant="outlined" SelectProps={{ native: true }} onChange={(e) => { setCustomCl({ ...customCl, description: e.target.value }) }}>
                  <option value="" />
                  {listCl.map((cl) => (
                    <option key={cl} value={cl}>
                      {cl}
                    </option>
                  ))}
                </TextField>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box flexDirection="row" display="flex" justifyContent="space-between" alignItems="center">
                <Typography><b>Tồn kho</b></Typography>
                <TextField label="Tên tùy chỉnh" value={customCl.quantity} style={{ minWidth: 150, maxWidth: "80%" }} size="small" select variant="outlined" SelectProps={{ native: true }} onChange={(e) => { setCustomCl({ ...customCl, quantity: e.target.value }) }}>
                  <option value="" />
                  {listCl.map((cl) => (
                    <option key={cl} value={cl}>
                      {cl}
                    </option>
                  ))}
                </TextField>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box flexDirection="row" display="flex" justifyContent="space-between" alignItems="center">
                <Typography><b>Lô (Có hoặc không)</b></Typography>
                <TextField label="Tên tùy chỉnh" value={customCl.has_batches} style={{ minWidth: 150, maxWidth: "80%" }} size="small" select variant="outlined" SelectProps={{ native: true }} onChange={(e) => { setCustomCl({ ...customCl, has_batches: e.target.value }) }}>
                  <option value="" />
                  {listCl.map((cl) => (
                    <option key={cl} value={cl}>
                      {cl}
                    </option>
                  ))}
                </TextField>
              </Box>
            </Grid>
          </Grid>
        }
        {custom  && customizable?
          <form>
            <label htmlFor="upload">Chọn file <strong>của bạn</strong>: </label>
            <input
              type="file"
              name="upload"
              id="upload"
              onChange={(e) => { readCustomizedProduct(e) }}
            />
          </form>
          :
          <form>
            <label htmlFor="upload">Chọn file: </label>
            <input
              type="file"
              name="upload"
              id="upload"
              onChange={(e) => {
                if (customizable) {
                  readUploadFile(e, setJsonData);
                } else {
                  readCustomerUploadFile(e, setJsonData);
                }
              }}
            />
          </form>
        }

        <Button
          style={{ marginTop: 40 }}
          variant="contained"
          fullWidth
          color="primary"
          onClick={handleImport}
        >
          Nhập
        </Button>
      </ModalWrapperWithClose>}
    </>

  );
};

export default ToolBar;

const studentData = [
  {
    id: 1,
    name: "Quần dài",
    category: "Thực phẩm",
    price: 220,
    import_price: 130,
  },
  {
    id: 2,
    name: "Quần đùi",
    category: "Bánh kẹo",
    price: 220,
    import_price: 130,
  },
  {
    id: 3,
    name: "Áo dài",
    category: "Đồ dùng",
    price: 250,
    import_price: 120,
  },
  {
    id: 4,
    name: "Bánh",
    category: "Quần áo",
    price: 520,
    import_price: 102,
  },
  {
    id: 5,
    name: "Kẹo",
    category: "Quần áo",
    price: 220,
    import_price: 100,
  },
  {
    id: 6,
    name: "Khăn giấy",
    category: "Quần áo",
    price: 200,
    import_price: 100,
  },
  {
    id: 7,
    name: "Quần dài",
    category: "Quần áo",
    price: 200,
    import_price: 100,
  },
  {
    id: 8,
    name: "Túi xách",
    category: "Quần áo",
    price: 150,
    import_price: 350,
  },
  {
    id: 9,
    name: "Laptop",
    category: "Quần áo",
    price: 203,
    import_price: 152,
  },
  {
    id: 10,
    name: "Máy tính",
    category: "Quần áo",
    price: 203,
    import_price: 152,
  },
  {
    id: 11,
    name: "Máy tính cầm ta",
    category: "Quần áo",
    price: 223,
    import_price: 152,
  },
  {
    id: 12,
    name: "Tập vở",
    category: "Quần áo",
    price: 203,
    import_price: 154,
  },
  {
    id: 13,
    name: "Máy tính",
    category: "Quần áo",
    price: 1223,
    import_price: 354,
  },
];
