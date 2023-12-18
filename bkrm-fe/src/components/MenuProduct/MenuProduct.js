import React, {useState,useEffect} from 'react'
import icon from '../../assets/img/product/tch.jpeg';
import InventoryList from '../../assets/JsonData/inventory.json';
import {useTheme} from "@material-ui/core/styles";
import useStyles from "../../components/TableCommon/style/mainViewStyle";
import { useSelector } from 'react-redux';
//import library 
import {Grid,Card,Box,Table,TableCell,Modal,Tooltip,Dialog,Tabs,Tab,TableRow,TableContainer,CardContent,CardMedia,CardActionArea,FormControlLabel,Switch,Menu,MenuItem,ListItem,IconButton,TableBody,Typography, Button} from '@material-ui/core'
import { VNDFormat } from "../TextField/NumberFormatCustom";
import defaultProduct from "../../assets/img/product/default-product.png"
import setting from "../../assets/constant/setting"
import TableHeader from "../TableCommon/TableHeader/TableHeader" 
import TableWrapper from "../TableCommon/TableWrapper/TableWrapper" 
import ListIcon from '@material-ui/icons/List';
import ImageTwoToneIcon from '@material-ui/icons/ImageTwoTone';
import ListAltTwoToneIcon from '@material-ui/icons/ListAltTwoTone';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import FilterListTwoToneIcon from "@material-ui/icons/FilterListTwoTone";
import clsx from "clsx"
import { TreeSelect } from 'antd';
import CategorySelect from "../Select/CategorySelect"
import { grey } from "@material-ui/core/colors";
import BrokenImageTwoToneIcon from '@material-ui/icons/BrokenImageTwoTone';
import WallpaperTwoToneIcon from '@material-ui/icons/WallpaperTwoTone';
const MenuProduct = ({
  products,
  setProducts,
  handleSearchBarSelect,
  isCart,
  selectedItem,
  typeShow,
  setTypeShow,
  isCheck,
  showImage,
  setShowImage,
  isInventory,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const InventoryHeadCells = [
    { id: "id", align: "left", disablePadding: true, label: "Mã SP" },
    { id: "name", align: "left", disablePadding: false, label: "Tên" },
    {
      id: "price",
      align: "right",
      disablePadding: false,
      label: isCart ? "Giá bán" : "Giá vốn",
    },
    {
      id: "inventory",
      align: "right",
      disablePadding: false,
      label: "Tồn kho",
    },
    { id: "", align: "right", disablePadding: false, label: "" },
  ];
  const [categoryList, setCategoryList] = useState([]);
  const [categoryId, setCategoryId] = useState("all");
  // redux
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const store_setting = info.store.general_configuration
    ? JSON.parse(info.store.general_configuration)
    : setting;

  // const [typeShow, setTypeShow] = useState('list')
  const [allProduct, setAllProduct] = useState([]);
  useEffect(() => {
    if (window.localStorage.getItem("products")) {
      const products = JSON.parse(window.localStorage.getItem("products"));
      if (
        products.store_uuid === store_uuid &&
        products.branch_uuid === branch_uuid
      ) {
        setAllProduct(products.data);
      }
    }
  }, []);

  const selectedItemUuid =
    selectedItem.length === 0 ? [] : selectedItem.map((item) => item.uuid);
  const findItem = (item) => {
    const findedItem = selectedItem.find((row) => item.uuid === row.uuid);
    if (isCheck) {
      return findedItem?.real_quantity;
    }
    return findedItem?.quantity;
    // return findedItem?.real_quantity
    // console.log("findedItem",findedItem)
  };

  const [openFilter, setOpenFilter] = useState(false);
  const [filter, setFilter] = useState(null);
  const renderListOption = () => {
    const color = theme.customization.mode === "Light" ? "#000" : "#fff";
    return (
      <>
        <TableContainer style={{ maxHeight: "64vh", minHeight: "60vh" }}>
          <Table size={"small"} stickyHeader>
            <TableHeader
              classes={classes}
              headerData={
                store_setting?.inventory.status
                  ? InventoryHeadCells
                  : InventoryHeadCells.filter((item) => item.id !== "inventory")
              }
              color={color}
            />
            <TableBody>
              {products.map((row, index) => {
                let findedItem = findItem(row);
                return (
                  <TableRow
                    key={row.uuid}
                    onClick={() => handleSearchBarSelect(row)}
                    style={{
                      color: color,
                      backgroundColor:
                        selectedItemUuid.includes(row.uuid) &&
                        (theme.customization.mode === "Light"
                          ? theme.customization.primaryColor[50]
                          : grey[700]),
                    }}
                  >
                    <TableCell align="left" style={{ color: color }}>
                      {" "}
                      {row.product_code}{" "}
                    </TableCell>
                    <TableCell align="left">
                      <ListItem
                        style={{
                          marginLeft: -30,
                          marginTop: -10,
                          marginBottom: -10,
                        }}
                      >
                        {showImage ? (
                          <Box
                            component="img"
                            sx={{
                              height: 35,
                              width: 35,
                              borderRadius: 10,
                              marginRight: 15,
                            }}
                            src={
                              JSON.parse(row.img_urls)?.at(0) || defaultProduct
                            }
                          />
                        ) : null}
                        <Typography
                          className={classes.fontName}
                          style={{ color: color }}
                        >
                          {row.name}
                        </Typography>
                      </ListItem>
                    </TableCell>
                    <TableCell align="right">
                      {" "}
                      <VNDFormat
                        value={isCart ? row.list_price : row.standard_price}
                        style={{ color: color }}
                      />{" "}
                    </TableCell>
                    {store_setting?.inventory.status ? (
                      <TableCell
                        align="right"
                        className={classes.fontName}
                        style={{ fontWeight: 500, color: color }}
                      >
                        {" "}
                        {row.branch_quantity}{" "}
                      </TableCell>
                    ) : null}
                    <TableCell
                      align="right"
                      style={{
                        color: theme.customization.secondaryColor[500],
                        fontWeight: 600,
                      }}
                    >
                      {findedItem ? `x ${findItem(row)}` : ""}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  const renderImageOption = () => {
    return (
      <TableContainer style={{ maxHeight: "64vh", minHeight: "60vh" }}>
        <Grid container spacing={2}>
          {products.map((item, index) => {
            let findedItem = findItem(item);
            return (
              <Grid item>
                <Card
                  className={clsx(
                    classes.hoverCard,
                    classes.item,
                    classes.colorCard
                  )}
                  style={{
                    width: 120,
                    borderRadius: 7,
                    backgroundColor:
                      theme.customization.mode === "Light" ? null : grey[700],
                  }}
                >
                  <CardActionArea onClick={() => handleSearchBarSelect(item)}>
                    {showImage ? (
                      <CardMedia
                        style={{
                          height: 120,
                          margin: 5,
                          marginBottom: -5,
                          borderRadius: 7,
                        }}
                        image={
                          JSON.parse(item.img_urls ? item.img_urls : "[]")
                            .length
                            ? JSON.parse(
                                item.img_urls ? item.img_urls : "[]"
                              ).at(0)
                            : defaultProduct
                        }
                      />
                    ) : null}
                    <CardContent style={{ margin: -5 }}>
                      <Typography
                        gutterBottom
                        style={{
                          color: "#000",
                          fontWeight: 500,
                          fontSize: Number(12),
                        }}
                      >
                        {" "}
                        {item.name}{" "}
                      </Typography>
                      <Grid
                        container
                        alignItem="center"
                        justifyContent="space-between"
                      >
                        <Typography
                          className={classes.alignCenter}
                          style={{
                            color: "#000",
                            fontWeight: "#000",
                            fontSize: Number(12),
                          }}
                        >
                          {item.list_price.toLocaleString()} đ
                        </Typography>
                        <Typography
                          style={{
                            color: theme.customization.secondaryColor[500],
                            fontWeight: 600,
                            marginTop: -2,
                          }}
                        >
                          {findedItem ? `x ${findItem(item)}` : ""}{" "}
                        </Typography>
                      </Grid>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </TableContainer>
    );
  };

  return (
    <div style={{ marginTop: -25 }}>
      {/* <Tooltip title="Dạng danh sách"> <ListAltTwoToneIcon fontSize="small" onClick={()=>setTypeShow('list')} style={{marginRight:5}}/> </Tooltip> */}
      <Tooltip title="Dạng danh sách" aria-label="add">
        <ListAltTwoToneIcon
          fontSize="small"
          onClick={() => setTypeShow("list")}
          style={{ marginRight: 5 }}
        />
      </Tooltip>
      <Tooltip title="Dạng hình ảnh" aria-label="add">
        <ImageTwoToneIcon
          fontSize="small"
          onClick={() => setTypeShow("image")}
          style={{ marginRight: 5 }}
        />
      </Tooltip>
      <Tooltip title="Lọc" aria-label="add">
        <FilterListTwoToneIcon
          fontSize="small"
          onClick={() => setOpenFilter(true)}
          style={{ marginRight: 5 }}
        />
      </Tooltip>
      <Tooltip title="Hiển thị hình" aria-label="add">
        <WallpaperTwoToneIcon
          fontSize="small"
          onClick={() => setShowImage(!showImage)}
        />
      </Tooltip>

      {typeShow === "list" && renderListOption()}
      {typeShow === "image" && renderImageOption()}
      <Dialog open={openFilter} onClose={() => setOpenFilter(false)}>
        <Box style={{ marginTop: 10, marginBottom: 10, padding: 10 }}>
          <Typography
            variant="h5"
            style={{ fontSize: 18, marginBottom: 20, paddingRight: 100 }}
          >
            Chọn danh mục
          </Typography>

          <CategorySelect
            data={products}
            saveData={allProduct}
            setData={setProducts}
            isNotSelect={true}
            setOpenFilter={setOpenFilter}
          />
          {/* <Button variant="contained"  onClick={()=>setOpenFilter(false)}fullWidth color="primary"  style={{ marginTop: 40 }} > Chọn</Button> */}
        </Box>
      </Dialog>
    </div>
  );
};

export default MenuProduct





















// const categoryBig = ['Quần áo', 'Bánh kẹo', 'Đồ dùng', 'Điện thoại', 'Máy tính']


   // //tab menu
    // const [value, setValue] = React.useState(0);
    // const handleChange = (event, newValue) => {
    //     setValue(newValue);
    // }; 
/* <Tabs style={{marginBottom:10, marginLeft:-20}}  variant="scrollable" scrollButtons="auto" indicatorColor="secondary" textColor="secondary"value={value} onChange={handleChange} aria-label="simple tabs example">
  {categoryBig.map((item)=>{
  return(
      <Tab label={item} style={{ minWidth: 100,textTransform: 'none'}} />          
      )
  })}
</Tabs> */