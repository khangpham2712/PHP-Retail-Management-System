import React, { useEffect, useState } from "react";
import {
  Card,
  ListItem,
  DialogContent,
  Box,
  Grid,
  TableBody,
  Typography,
  FormControl,
  Select,
  InputLabel,
  Table,
  MenuItem,
  TableCell,
  TableRow,
  Collapse,
  Chip,
  TextField,
  Button,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
  Switch,
  FormControlLabel,
  TableContainer
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SelectBatch from "../SelectBatch/SelectBatch";
import { DeleteOutline } from "@material-ui/icons";
import update from "immutability-helper";
import { useDispatch,useSelector } from "react-redux";
import SearchBarCode from "../SearchBar/SearchBarCode";
import moment from "moment";
import { Input } from "@mui/material";
import { VNDFormat, ThousandFormat } from "../TextField/NumberFormatCustom";
import useStyles from "../TableCommon/style/mainViewStyle";

import * as HeadCells from "../../assets/constant/tableHead";
import SearchProduct from "../SearchBar/SearchProduct";
import TableHeader from "../TableCommon/TableHeader/TableHeader";
import TableWrapper from "../TableCommon/TableWrapper/TableWrapper";
import inventoryCheckApi from "../../api/inventoryCheckApi";
import SnackBarGeneral from "../SnackBar/SnackBarGeneral";
import InventoryCheckSummary from "../CheckoutComponent/CheckoutSummary/InventoryCheckSumary/InventroyCheckSumary";
import ModalWrapperWithClose from "../Modal/ModalWrapperWithClose";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import ButtonQuantity from "../Button/ButtonQuantity";

import { CheckMiniTableRow } from "../../components/MiniTableRow/MiniTableRow";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import productApi from "../../api/productApi";
import { infoActions } from "../../store/slice/infoSlice";
import MenuProduct from "../../components/MenuProduct/MenuProduct";
import {
  getComparator,
  stableSort,
} from "../../components/TableCommon/util/sortUtil";

function InventoryCheckPopUp({
  classes,
  setReload,
  handleCloseReturn,
  success,
  failure,
}) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const theme = useTheme();
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("stt");
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const dispatch = useDispatch();

  // redux
  const info = useSelector((state) => state.info);
  const searchBarState = info.searchBarState;

  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const user_name = info.user.name;
  const branch_name = info.branch.name;
  const [isUpdateTotalAmount, setIsUpdateTotalAmount] = React.useState(false);
  const [inventoryCheck, setInventoryCheck] = React.useState({
    total_amount: 0,
    details: [],
    note: "",
  });

  const [products, setProducts] = useState([]);
  const [reloadProduct, setReloadProduct] = useState(false);

  const loadProducts = async () => {
    try {
      const response = await productApi.searchBranchProduct(
        store_uuid,
        branch_uuid,
        ""
      );
      setProducts(response.data)
      
     
    } catch (err) {
      console.log(err)
    }
    // dispatch(infoActions.setProducts(response.data));
  };

  useEffect(()=>{
    if (window.localStorage.getItem("mode")) {
      const cartMode = JSON.parse(window.localStorage.getItem("mode"));
      if (cartMode.store_uuid === store_uuid ) {
        setTypeShow(cartMode.typeShow)
        setMode(cartMode.mode);
        setShowImage(cartMode.showImage);
       
      }
    }

  },[])
  useEffect(() => {
    if (store_uuid && branch_uuid) {
      loadProducts();
    }
    //  loadingActions.finishLoad();
    const intervalID = setInterval(() => {
      if (store_uuid && branch_uuid) {
        loadProducts();
      }
    }, 60000 * 5);

    return () => {
      clearInterval(intervalID)
    }
  }, [store_uuid, branch_uuid]);

  const [openSnack, setOpenSnack] = React.useState(false);
  const [snackStatus, setSnackStatus] = React.useState({
    style: "error",
    message: "Kiểm kho thất bại",
  });

  useEffect(() => {
    updateTotalAmount();
  }, [isUpdateTotalAmount]);

  const updateTotalAmount = () => {
    let total = 0;
    inventoryCheck.details.forEach((item) => {
      total +=
        (Number(item.real_quantity) - Number(item.branch_quantity)) *
        Number(item.standard_price);
    });

    const newInventoryCheck = update(inventoryCheck, {
      total_amount: { $set: total },
    });
    setInventoryCheck(newInventoryCheck);
  };

  const handleDeleteItem = (itemId) => {
    const itemIndex = inventoryCheck.details.findIndex(
      (item) => item.id === itemId
    );
    const newInventoryCheck = update(inventoryCheck, {
      details: { $splice: [[itemIndex, 1]] },
    });
    setInventoryCheck(newInventoryCheck);
    setIsUpdateTotalAmount(!isUpdateTotalAmount);
  };

  const handleItemRealQuantityChange = (itemId, newQuantity) => {
    
    const itemIndex = inventoryCheck.details.findIndex(
      (item) => item.id === itemId
    );
    
    if(isNaN(newQuantity)){newQuantity = ''}
    if (newQuantity === inventoryCheck.details[itemIndex].real_quantity && !inventoryCheck.details[itemIndex].has_batches) {
      handleDeleteItem(itemId);
      return;
    }
    if (newQuantity < 0){return } 


    const newInventoryCheck = update(inventoryCheck, {
      details: {
        [itemIndex]: {
          real_quantity: { $set: newQuantity },
        },
      },
    });
    console.log(newInventoryCheck)
    setInventoryCheck(newInventoryCheck);
    setIsUpdateTotalAmount(!isUpdateTotalAmount);
  };

  const handleConfirm = () => {
    var emptyCart = inventoryCheck.details.length === 0;
    var notExistNullQuantity =   inventoryCheck.details.every(function (element, index) {
      if (element.real_quantity === '') return false;
        else return true;
    })
    if (emptyCart) {
      setOpenSnack(true);
      setSnackStatus({
        style: "error",
        message: "Kiểm kho trống",
      });
    }else if(!notExistNullQuantity){
      setOpenSnack(true);
      setSnackStatus({
        style: "error",
        message: "Có sản phẩm chưa nhập số lượng",
      });
    } else {
      setOpen(true);
    }
  };

  const handleConfirmBalance = async () => {
    const d = moment.now() / 1000;

    const export_date = moment
      .unix(d)
      .format("YYYY-MM-DD HH:mm:ss", { trim: false });

    const body = {
      total_amount: inventoryCheck.total_amount,
      details: inventoryCheck.details.map((detail) => ({
        product_id: detail.id,
        quantity: Number(detail.real_quantity) - Number(detail.branch_quantity),
        unit_price: detail.standard_price,
        uuid: detail.uuid,
        branch_inventory: detail.branch_quantity,
        batches: detail.batches.length ? detail.batches : ""
      })),
      note: inventoryCheck.note,
    };

    try {
      const res = await inventoryCheckApi.create(store_uuid, branch_uuid, body);
      handleCloseReturn();
      success(res.data?.inventory_check_code);
    } catch (err) {
      failure();
      console.log(err);
    }
    loadProducts();
  };
  const handleCloseSnackBar = (event, reason) => {
    setOpenSnack(false);
  };

  const handleProductSelect = (product) => {
    if (inventoryCheck.details.find((d) => d.id === product.id)) {
      return;
    }
    const newDetails = [
      ...inventoryCheck.details,
      {
        ...product,
        // real_quantity: 0,
        real_quantity: Number(product.branch_quantity),
      },
    ];
    setInventoryCheck({ ...inventoryCheck, details: newDetails });
    setIsUpdateTotalAmount(!isUpdateTotalAmount);
  };
  const [barcodeChecked, setBarcodeChecked] = useState(true);
  const handleSwitchChange = () => {
    setBarcodeChecked(!barcodeChecked);
  };
  
  const handleChangeDetailBatches = (itemId, batches) => {
    const itemIndex = inventoryCheck.details.findIndex(
      (item) => item.id === itemId
    );
    
    const newInventoryCheck = {...inventoryCheck};
    newInventoryCheck.details[itemIndex].batches = batches;
  }

//mode
  const [mode, setMode] = React.useState(false);
  const [showImage, setShowImage] = React.useState(true);
  const [typeShow, setTypeShow] = useState('list')
  const handleChangeMode = (event) => {
    setMode(event.target.checked);
  };
  useEffect(() => {
    window.localStorage.setItem(
      "mode",
      JSON.stringify({store_uuid: store_uuid,  mode: mode, typeShow: typeShow , showImage:showImage})
    );
  }, [mode,typeShow,showImage]);

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <SnackBarGeneral handleClose={handleCloseSnackBar} open={openSnack} status={snackStatus}  />

        <Grid item>
          <ListItem
            style={{ paddingTop: 20, marginBottom: -20, marginLeft: 25 }}
          >
            <Grid container alignItems="center">
              <Grid item>
                <Typography variant="h3" style={{ marginRight: 20 }}>
                  Kiểm kho
                </Typography>
              </Grid>
              {!mode? 
                  <>
                  <Grid item>
                    <FormControlLabel   control={ <Switch  size="small"  checked={searchBarState === 'barcode'}  onChange={(e, checked) => { dispatch(infoActions.setSearchBarState(checked ? 'barcode' : 'search'))  }} color="primary"  />  } label={"Dùng mã vạch"}  />

                  </Grid>
                  <Grid item>
                    {false ? (
                      <SearchBarCode products={products} handleSearchBarSelect={handleProductSelect} />
                    ) : (
                      <SearchProduct products={products} handleSearchBarSelect={handleProductSelect} />
                    )}
                  </Grid>
                  </>:
                 <SearchProduct products={products} setProducts={setProducts} isFilter={true} />
              }
            </Grid>
          </ListItem>
        </Grid>

        <Grid item>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleCloseReturn}
          >
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>

      <DialogContent style={{ marginTop: 25 }}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={12} sm={typeShow==='list' && mode?7:8}>
            <Card className={classes.card}>
              <Box style={{ padding: 30, minHeight: "72vh" }}>
                {/* JSON data attribute phải giongso table head id */}

                {/* <ListItem headCells={HeadCells.CartReturnHeadCells}  cartData={row.list} tableType={TableType.CART_RETURN} /> */}
                {/* {!xsScreen ? ( */}
                  {!mode ? (
                  <TableWrapper isCart>
                    <TableHeader
                      classes={classes}
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      headerData={HeadCells.InventoryCheckHeadCells}
                    />
                    <TableBody>
                      {stableSort( inventoryCheck.details, getComparator(order, orderBy) ).map((detail, index) => (
                        <InventoryCheckTableRow
                          handleItemRealQuantityChange={
                            handleItemRealQuantityChange
                          }
                          detail={detail}
                          handleDeleteItem={handleDeleteItem}
                          handleChangeDetailBatches={handleChangeDetailBatches}
                          imageType={typeShow==='image' && mode}
                          index={inventoryCheck.details.length - index}

                        />
                      ))}
                    </TableBody>
                  </TableWrapper>
                  ) : (
                    //  Mode nha hang
                    <MenuProduct 
                      products={products} 
                      handleSearchBarSelect={handleProductSelect}
                      // isCart={true}
                      selectedItem={inventoryCheck.details}
                      typeShow={typeShow}
                      setTypeShow={setTypeShow}
                      setProducts={setProducts}
                      isCheck={true}
                      showImage={showImage}
                      setShowImage={setShowImage}
                    />
                  )}
                {/* ) : (
                  // inventoryCheck.details.map((detail, index) => (
                  ["helo", "xin chao"].map((detail, index) => (
                    <CheckMiniTableRow
                      handleItemRealQuantityChange={
                        handleItemRealQuantityChange
                      }
                      detail={detail}
                      handleDeleteItem={handleDeleteItem}
                    />
                  )) */}
                {/* )} */}
              </Box>
              <FormControlLabel  control={<Switch  size="small"  checked={mode} onChange={handleChangeMode} />}style={{ display: "flex",  justifyContent: "flex-end"}} />

            </Card>
          </Grid>

          <Grid item xs={12} sm={typeShow==='list' && mode?5:4} className={classes.card}>
            <Card className={classes.card}>
              <InventoryCheckSummary
                handleConfirm={handleConfirm}
                data={inventoryCheck}
                userName={user_name}
                branchName={branch_name}
                mode={mode}
              >
                 {!mode ? null:
                  <TableContainer  style={{ maxHeight: "39vh", height:"39vh"}} >
                   <Table  size="small">
                    <TableBody>
                      {stableSort( inventoryCheck.details, getComparator(order, orderBy) )
                        .map((detail, index) => {
                        return (
                          <InventoryCheckTableRow
                            key={`${detail.uuid}_index`}
                            handleItemRealQuantityChange={
                              handleItemRealQuantityChange
                            }
                            detail={detail}
                            handleDeleteItem={handleDeleteItem}
                            handleChangeDetailBatches={handleChangeDetailBatches}
                            
                            mini={true}
                            imageType={typeShow==='image' && mode}
                            index={inventoryCheck.details.length - index}
                            

                          />
                        );
                      })}
                       </TableBody>
                    </Table>
                  </TableContainer>
                  }
              </InventoryCheckSummary>
            </Card>
          </Grid>

          <ModalWrapperWithClose
            title="Cân bằng kho"
            open={open}
            handleClose={handleClose}
          >
            <Typography style={{ marginTop: 10, marginBottom: 10 }}>
              Cân bằng kho sẽ thay đổi tồn kho hiện tại của hàng hóa được lưu
              trong hệ thống.
            </Typography>
            <Typography style={{ fontWeight: 500 }}>
              Bạn có chắc chắn muốn Cân bằng kho?
            </Typography>

            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                paddingTop: 20,
              }}
            >
              <Button
                onClick={handleClose}
                variant="contained"
                size="small"
                style={{ marginRight: 20 }}
                color="secondary"
              >
                {" "}
                Huỷ{" "}
              </Button>
              <Button
                onClick={() => handleConfirmBalance()}
                variant="contained"
                size="small"
                color="primary"
              >
                Xác nhận{" "}
              </Button>
            </Grid>

            {/* <Button
              onClick={() => handleClose()}
              variant="contained"
              size="small"
              color="secondary"
            >
              Huỷ
            </Button>
            <Button
              style={{ marginTop: 40 }}
              variant="contained"
              size="small"
              color="primary"
              onClick={() => {
                handleConfirmBalance();

                // handleCloseReturn();
              }}
            >
              Xác nhận
            </Button> */}
          </ModalWrapperWithClose>
        </Grid>
      </DialogContent>
    </>
  );
}

export default InventoryCheckPopUp;

function InventoryCheckTableRow({
  detail,
  handleItemRealQuantityChange,
  handleDeleteItem,
  handleChangeDetailBatches,
  mini,
  imageType, index
}) {
  const classes = useStyles();
  const [show, setShow] = React.useState("none");
  

  const [batches, setBatches] = useState([]);
  const onChangeRealQuantity = (newQuantity) => {
    handleItemRealQuantityChange(detail.id, newQuantity);
  };
  const [selectBatchOpen, setSelectBatchOpen] = useState(false);


  useEffect(() => {
    if (detail.has_batches) {
      setBatches(detail.batches.map(batch => ({...batch, is_checked: false, checked_quantity: batch.quantity })));
    }
  }, [])
  const handleSelectBatch = (index) => {
    const newBatches = [...batches];
    newBatches[index].is_checked = true;
    setBatches(newBatches)
  }
  const handleChangeBatchQuantity = (e, checkedBatch) => {
    const value = Number(e.target.value)
    if (value < 0) {
      return;
    }
    const newBatches = [...batches];
    const indexOfBatch = newBatches.findIndex(batch => batch.batch_code === checkedBatch.batch_code)
    if (indexOfBatch >= 0 ) {
      newBatches[indexOfBatch].checked_quantity = value
    }
    setBatches(newBatches)
  }
  const handleDeleteBatch = (checkedBatch ) => {
    const newBatches = [...batches];
    const indexOfBatch = newBatches.findIndex(batch => batch.batch_code === checkedBatch.batch_code)
    if (indexOfBatch >= 0 ) {
      newBatches[indexOfBatch].is_checked = false;
      newBatches[indexOfBatch].checked_quantity = newBatches[indexOfBatch].quantity;
      setBatches(newBatches)
    }
  }

  useEffect(() => {
    let total = 0;
    batches.forEach(batch => total += Number(batch.checked_quantity));
    onChangeRealQuantity(total);
    handleChangeDetailBatches(detail.id, batches)
  }, [batches])

  return (
    <>
      <TableRow hover key={detail.id}>
        <TableCell align="left" style={{ width: 5 }} padding={'none'} >
          {index}.
        </TableCell>
        {!mini?
        <TableCell align="left" style={{ width: 5 }} >
          {detail.product_code}
        </TableCell>:null}
        {/* <TableCell align="left">{row.id}</TableCell> */}
        <TableCell align="left" >{detail.name}</TableCell>
        <TableCell align="right" padding={'none'}>
          {" "}
          <ThousandFormat value={detail.branch_quantity} />
          {detail.has_batches ? (
            <>
              <div>
                {batches
                  .filter((batch) => batch.is_checked)
                  .map((checked_batch) => (
                    <div>
                      <Tooltip
                        title={`${
                          checked_batch.position ? checked_batch.position : ""
                        }-${
                          checked_batch.expiry_date
                            ? checked_batch.expiry_date
                            : ""
                        }`}
                      >
                        <Chip
                          label={`${checked_batch.batch_code}-${checked_batch.quantity}`}
                        ></Chip>
                      </Tooltip>
                    </div>
                  ))}
              </div>
            </>
          ) : null }
        </TableCell>

        <TableCell align="left" padding="none">
          {detail.has_batches ? (
            <>
              <div style={{textAlign:'right', maxWidth:80}}>{detail.real_quantity}</div>
              <div>
                {batches
                  .filter((batch) => batch.is_checked)
                  .map((checkedBatch) => (
                    <div>
                      <Chip
                        label={
                          <TextField
                            type="number"
                            style={{ width: 100 }}
                            value={checkedBatch.checked_quantity}
                            onChange={(e) =>handleChangeBatchQuantity(e, checkedBatch)}
                          />
                        }
                        variant="outlined"
                        deleteIcon={<DeleteOutline/>}
                        onDelete={(e) => handleDeleteBatch(checkedBatch)}
                      ></Chip>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <ButtonQuantity
              quantity={detail.real_quantity}
              setQuantity={onChangeRealQuantity}
              show={show}
              setShow={setShow}
              limit={detail.quantity}
              isReturn={false}
              // miniCart={mini}
            />
          )}
        </TableCell>

        <TableCell align="center" >
          <ThousandFormat
            value={
              Number(detail.real_quantity) - Number(detail.branch_quantity)
            }
            style={{fontWeight:mini?600:null}}
          />
        </TableCell>

       {!mini?
        <TableCell align="center" className={classes.boldText}>
          <VNDFormat
            value={
              (Number(detail.real_quantity) - Number(detail.branch_quantity)) *
              detail.standard_price
            }
          />
        </TableCell>:null}
        <TableCell align="right" className={classes.boldText}>
          <IconButton
            aria-label="expand row"
            size="small"
            style={{ marginLeft: -25 }}
          >
            <DeleteForeverOutlinedIcon
              onClick={() => handleDeleteItem(detail.id)}
            />
          </IconButton>
        </TableCell>
      </TableRow>
      {detail.has_batches ? (
        <TableRow>
          <TableCell colSpan={1}></TableCell>
          <TableCell colSpan={10}>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Chọn lô
              </InputLabel>
              <Select
                onChange={(e) => handleSelectBatch(e.target.value)}
                style={{ width: 200 }}
              >
                {batches.map((batch, index) => (
                  <MenuItem value={index}>{`${batch.batch_code}(${
                    batch.expiry_date ? batch.expiry_date.substring(0, 10) : ""
                  }${batch.position ? "-" + batch.position : ""}): ${
                    batch.quantity
                  }`}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </TableCell>
        </TableRow>
      ) : null}
    </>
  );
}
