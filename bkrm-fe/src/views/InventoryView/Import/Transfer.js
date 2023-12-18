import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
//import style
import useStyles from "../../../components/TableCommon/style/mainViewStyle";
import { grey } from "@material-ui/core/colors";
import { CartBottom } from "../../../components/Button/CartButton";

import AddIcon from "@material-ui/icons/Add";
import ArrowBack from "@material-ui/icons/ArrowBack";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { useReactToPrint } from "react-to-print";
import { ImportReceiptPrinter } from "../../../components/ReceiptPrinter/ReceiptPrinter";
import { useHistory } from "react-router-dom";
//import library
import {
  Grid,
  Card,
  Box,
  TableContainer,
  FormControlLabel,
  Switch,
  ListItem,
  TableBody,
  Typography,
  ButtonBase,
  Avatar,
  Tooltip,
  TextField,
  Button,
  CircularProgress,
  Table,
  Divider,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Icon,
} from "@material-ui/core";

//import constant
import * as HeadCells from "../../../assets/constant/tableHead";
import SearchBarCode from "../../../components/SearchBar/SearchBarCode";

//import project
//rieng
import ImportSummary from "../../../components/CheckoutComponent/CheckoutSummary/ImportSummary/ImportSummary";
import { ImportRow, ImportRowMini } from "./ImportTableRow/ImportTableRow";
//chung
import MenuProduct from "../../../components/MenuProduct/MenuProduct";
import ChangeCartBtn from "../../../components/CheckoutComponent/ChangeCartBtn/ChangeCartBtn";
import SearchProduct from "../../../components/SearchBar/SearchProduct";
import TableHeader from "../../../components/TableCommon/TableHeader/TableHeader";
import TableWrapper from "../../../components/TableCommon/TableWrapper/TableWrapper";
import {
  getComparator,
  stableSort,
} from "../../../components/TableCommon/util/sortUtil";

import purchaseOrderApi from "../../../api/purchaseOrderApi";
// update state
import update from "immutability-helper";
import { useSelector, useDispatch } from "react-redux";
import SnackBarGeneral from "../../../components/SnackBar/SnackBarGeneral";
import moment from "moment";
import AddInventory from "../Inventory/AddInventory/AddInventory";
import supplierApi from "../../../api/supplierApi";
import { CartMiniTableRow } from "../../../components/MiniTableRow/MiniTableRow";
import branchApi from "../../../api/branchApi";
import setting from "../../../assets/constant/setting";
import productApi from "../../../api/productApi";
import openNotification from "../../../components/StatusPopup/StatusPopup";
import DialogWrapper from "../../../components/Modal/DialogWrapper";
import ReccomendOrderPopUp from "./RecommendOrderPopUp/RecommendOrderPopUp";
import { infoActions } from "../../../store/slice/infoSlice";
import ModalWrapperWithClose from "../../../components/Modal/ModalWrapperWithClose";
import { currentDate } from "../../../utils";
import InventorySidePanel from "../../../components/CheckoutComponent/CheckoutSummary/ImportSummary/InventorySidePanel";

// FILE này xử lý state -> connect search bar, table, với summary lại + quản lý chọn cart

const Transfer = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [selectedBranch, setSelectedBranch] = useState({});
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const history = useHistory();
  // redux
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const searchBarState = info.searchBarState;
  const dispatch = useDispatch();

  const branch = info.branch;
  const user_uuid = useSelector((state) => state.info.user.uuid);
  const store_setting = info.store.general_configuration
    ? JSON.parse(info.store.general_configuration)
    : setting;
  const canEnterDiscountWhenSell =
    store_setting?.canEnterDiscountWhenSell?.status;
  const defaultPaymentAmount =
    store_setting?.defaultPaymentAmount.status &&
    store_setting?.defaultPaymentAmount.import;
  const [recommendOption, setRecommendOption] = useState({
    mode: "lastXdays",
    historyPeriod: 30,
    forecastPeriod: 30,

    currentDate: currentDate().substring(0, 10),
    numOfYears: 1,
    period: 30,
  });

  const loadLocalImportListStorage = () => {
    if (window.localStorage.getItem("importListData")) {
      const data = JSON.parse(window.localStorage.getItem("importListData"));
      console.log("data", data);
      if (data.user_uuid === user_uuid) {
        return data.cartList;
      }
    }
    return [
      {
        supplier: null,
        cartItem: [],
        total_amount: 0,
        paid_amount: 0,
        discount: 0,
        payment_method: "cash",
        discountDetail: { value: "0", type: "VND" },
      },
    ];
  };
  const [cartList, setCartList] = React.useState(loadLocalImportListStorage());
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = React.useState([]);
  ////------------ I. DATA (useState) ----------------

  // local storage
  // fetch localstorage
  useEffect(() => {
    if (window.localStorage.getItem("products")) {
      const products = JSON.parse(window.localStorage.getItem("products"));
      if (
        products.store_uuid === store_uuid &&
        products.branch_uuid === branch_uuid
      ) {
        setProducts(products.data);
      }
    }
    if (window.localStorage.getItem("mode")) {
      const cartMode = JSON.parse(window.localStorage.getItem("mode"));
      if (cartMode.store_uuid === store_uuid) {
        setTypeShow(cartMode.typeShow);
        setMode(cartMode.mode);
        setShowImage(cartMode.showImage);
      }
    }

    if (window.localStorage.getItem("suppliers")) {
      const suppliers = JSON.parse(window.localStorage.getItem("suppliers"));
      if (suppliers.store_uuid === store_uuid) {
        setSuppliers(suppliers.data);
      }
    }
  }, [store_uuid, branch_uuid]);

  // update localstorage
  useEffect(() => {
    if (suppliers.length) {
      window.localStorage.setItem(
        "suppliers",
        JSON.stringify({
          store_uuid: store_uuid,
          data: suppliers,
        })
      );
    }
  }, [suppliers]);
  useEffect(() => {
    if (products.length) {
      window.localStorage.setItem(
        "products",
        JSON.stringify({
          store_uuid: store_uuid,
          branch_uuid: branch_uuid,
          data: products,
        })
      );
    }
  }, [products]);
  useEffect(() => {
    window.localStorage.setItem(
      "importListData",
      JSON.stringify({ user_uuid: user_uuid, cartList: cartList })
    );
  }, [cartList]);

  const loadProducts = async () => {
    const response = await productApi.searchBranchProduct(
      store_uuid,
      branch_uuid,
      ""
    );
    setProducts(response.data);
    // dispatch(infoActions.setProducts(response.data));
  };

  // call API
  useEffect(() => {
    const fetchSupplier = async () => {
      const response = await supplierApi.getSuppliers(store_uuid);
      setSuppliers(response.data);
    };

    if (store_uuid) {
      fetchSupplier();
    }
    if (store_uuid && branch_uuid) {
      loadProducts();
    }

    const intervalID = setInterval(() => {
      if (store_uuid && branch_uuid) {
        loadProducts();
      }
    }, 60000 * 5);

    return () => {
      clearInterval(intervalID);
    };
  }, [store_uuid, branch_uuid]);

  //// ----------II. FUNCTION
  // 1.Cart
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [addProduct, setAddProduct] = useState(false);
  const [isUpdateTotalAmount, setIsUpdateTotalAmount] = React.useState(false);

  const [openSnack, setOpenSnack] = React.useState(false);
  const [snackStatus, setSnackStatus] = React.useState({
    style: "error",
    message: "Nhập hàng thất bại",
  });

  useEffect(() => {
    updateTotalAmount();
  }, [isUpdateTotalAmount]);

  const [reloadSupplier, setReloadSupplier] = useState(false);
  const [reloadProduct, setReloadProduct] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [reloadProduct]);

  useEffect(() => {
    const fetchSupplier = async () => {
      const response = await supplierApi.getSuppliers(store_uuid);
      setSuppliers(response.data);
    };

    fetchSupplier();
  }, [reloadSupplier]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  console.log("selectedIndex", selectedIndex);
  const handleCloseSnackBar = (event, reason) => {
    setOpenSnack(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChoose = (index) => {
    setSelectedIndex(index);
    handleClose();
  };
  const handleAdd = () => {
    // ADD CART
    setCartList([
      ...cartList,
      {
        supplier: null,
        cartItem: [],
        total_amount: 0,
        paid_amount: 0,
        discount: 0,
        payment_method: "cash",
        discountDetail: { value: "0", type: "VND" },
      },
    ]);
    setSelectedIndex(cartList.length);
    handleClose();
  };

  const handleDelete = (index) => {
    // DELETE CART
    cartList.splice(index, 1);
    if (cartList.length === 0) {
      setCartList([
        {
          supplier: null,
          cartItem: [],
          total_amount: "0",
          paid_amount: "0",
          discount: "0",
          payment_method: "cash",
          discountDetail: { value: "0", type: "VND" },
        },
      ]);
      setSelectedIndex(0);
    } else {
      setCartList(cartList);
    }
    if (selectedIndex === index) {
      setSelectedIndex(0);
    } else if (selectedIndex > index) {
      setSelectedIndex(selectedIndex - 1);
    }
    handleClose();
  };
  const updateCustomer = (value) => {
    let newArr = [...cartList]; // copying the old datas array
    newArr[selectedIndex].customer = value;
    setCartList(newArr);
  };

  //2. Table sort
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState(null);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  //mode
  const [mode, setMode] = React.useState(false);
  const [showImage, setShowImage] = React.useState(true);
  const [typeShow, setTypeShow] = useState("list");
  const handleChangeMode = (event) => {
    setMode(event.target.checked);
  };

  // order or import
  const [isOrder, setIsOrder] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(
      "mode",
      JSON.stringify({
        store_uuid: store_uuid,
        mode: mode,
        typeShow: typeShow,
        showImage: showImage,
      })
    );
  }, [mode, typeShow, showImage]);

  // handle search select item add to cart
  const handleSearchBarSelect = (selectedOption) => {
    let itemIndex = cartList[selectedIndex].cartItem.findIndex(
      (item) => item.uuid === selectedOption.uuid
    );
    let item = cartList[selectedIndex].cartItem.find(
      (item) => item.uuid === selectedOption.uuid
    );

    if (!item) {
      let newCartItem = {
        id: cartList[selectedIndex].cartItem.length,
        uuid: selectedOption.uuid,
        quantity: selectedOption.has_batches ? 0 : 1,
        bar_code: selectedOption.bar_code,
        product_code: selectedOption.product_code,
        unit_price: selectedOption.standard_price,
        img_urls: selectedOption.img_urls,
        name: selectedOption.name,
        has_batches: selectedOption.has_batches,
        batches: selectedOption.batches,
        branch_inventories: selectedOption.branch_inventories,
        extreme: selectedOption.extreme,
      };

      let newCartList = update(cartList, {
        [selectedIndex]: { cartItem: { $push: [newCartItem] } },
      });
      setCartList(newCartList);
      setIsUpdateTotalAmount(!isUpdateTotalAmount);
      return;
    }

    if (!item.has_batches) {
      handleChangeItemQuantity(
        selectedOption.uuid,
        cartList[selectedIndex].cartItem[itemIndex].quantity + 1
      );
    }
  };

  const handleDeleteItemCart = (itemUuid) => {
    let itemIndex = cartList[selectedIndex].cartItem.findIndex(
      (item) => item.uuid === itemUuid
    );
    let newCartList = update(cartList, {
      [selectedIndex]: { cartItem: { $splice: [[itemIndex, 1]] } },
    });
    setCartList(newCartList);
    setIsUpdateTotalAmount(!isUpdateTotalAmount);
  };

  const handleChangeItemQuantity = (itemUuid, newQuantity) => {
    let itemIndex = cartList[selectedIndex].cartItem.findIndex(
      (item) => item.uuid === itemUuid
    );
    let item = cartList[selectedIndex].cartItem.find(
      (item) => item.uuid === itemUuid
    );
    if (isNaN(newQuantity)) {
      newQuantity = "";
    }
    if (newQuantity === 0 && !item.has_batches) {
      handleDeleteItemCart(itemUuid);
      return;
    }
    if (newQuantity < 0) {
      return;
    }

    let newCartList = [...cartList];
    newCartList[selectedIndex].cartItem[itemIndex].quantity = newQuantity;
    setCartList(newCartList);
    setIsUpdateTotalAmount(!isUpdateTotalAmount);
  };

  const handleChangeItemPrice = (itemUuid, newPrice) => {
    if (newPrice < 0) {
      return;
    }
    let itemIndex = cartList[selectedIndex].cartItem.findIndex(
      (item) => item.uuid === itemUuid
    );
    let newCartList = update(cartList, {
      [selectedIndex]: {
        cartItem: { [itemIndex]: { unit_price: { $set: newPrice } } },
      },
    });
    setCartList(newCartList);
    setIsUpdateTotalAmount(!isUpdateTotalAmount);
  };

  const handleSelectSupplier = (selectedSupplier) => {
    let newCartList = update(cartList, {
      [selectedIndex]: { supplier: { $set: selectedSupplier } },
    });
    setCartList(newCartList);
  };

  const handleUpdatePaidAmount = (amount) => {
    if (amount < 0) {
      return;
    }
    let newCartList = update(cartList, {
      [selectedIndex]: { paid_amount: { $set: amount } },
    });

    setCartList(newCartList);
  };

  const handleUpdateBatches = (itemUuid, selectedBatches) => {
    let itemIndex = cartList[selectedIndex].cartItem.findIndex(
      (item) => item.uuid === itemUuid
    );

    if (itemIndex === -1) return;
    const newCartList = [...cartList];
    newCartList[selectedIndex].cartItem[itemIndex].selectedBatches =
      selectedBatches;

    setCartList(newCartList);
  };

  const handleUpdatePaymentMethod = (method) => {
    let newCartList = update(cartList, {
      [selectedIndex]: { payment_method: { $set: method } },
    });
    setCartList(newCartList);
  };
  const handleUpdateDiscountDetail = (obj) => {
    let discountUpdate =
      obj.type === "%"
        ? (
            (
              (Number(obj.value) *
                Number(cartList[selectedIndex].total_amount)) /
              100 /
              100
            ).toFixed() * 100
          ).toString()
        : obj.value;
    let newCartList = update(cartList, {
      // [selectedIndex]: { discountDetail: { $set: obj } , discount:{ $set: discountUpdate }, paid_amount:{ $set: (Number(cartList[selectedIndex].total_amount) -Number(discountUpdate)).toString() }},
      [selectedIndex]: defaultPaymentAmount
        ? {
            discountDetail: { $set: obj },
            discount: { $set: discountUpdate },
            paid_amount: {
              $set: (
                Number(cartList[selectedIndex].total_amount) -
                Number(discountUpdate)
              ).toString(),
            },
          }
        : { discountDetail: { $set: obj }, discount: { $set: discountUpdate } },
    });

    setCartList(newCartList);
  };

  const handleUpdateDiscount = (amount) => {
    let newCartList = update(cartList, {
      // [selectedIndex]: { discount: { $set: amount } },
      // [selectedIndex]: { discount: { $set: amount },paid_amount: { $set: (Number(cartList[selectedIndex].total_amount) -Number(amount)).toString() }  },
      [selectedIndex]: defaultPaymentAmount
        ? {
            discount: { $set: amount },
            paid_amount: {
              $set: (
                Number(cartList[selectedIndex].total_amount) - Number(amount)
              ).toString(),
            },
          }
        : { discount: { $set: amount } },
    });
    setCartList(newCartList);
  };

  const updateTotalAmount = () => {
    let total = 0;
    cartList[selectedIndex].cartItem.forEach((item) => {
      total += item.unit_price * item.quantity;
    });

    let newCartList = update(cartList, {
      [selectedIndex]: { total_amount: { $set: total } },
    });
    // newCartList = update(newCartList, {
    //   [selectedIndex]: {
    //     paid_amount: { $set: total - cartList[selectedIndex].discount },
    //   },
    // });
    if (defaultPaymentAmount) {
      newCartList = update(newCartList, {
        [selectedIndex]: {
          paid_amount: { $set: total - cartList[selectedIndex].discount },
        },
      });
    }

    setCartList(newCartList);
  };

  const handleConfirm = async (type) => {
    // type ===  1 là nhập , type ===  0 là đặt
    // CHECK ĐẶT THÀNH CÔNG ĐƠN ĐẶT SẼ VỀ SCREEN ĐƠN NHẬP HÀNG (trạng thái chờ nhận hàng)
    // table row DETAIL có thể sửa giá nhập (nếu lúc nhập khác lúc đặt)

    // Nếu đạt import summary có cho nnhapaj giảm giá + thanh toán trc ko ????

    // BỎ  NÚT TRẢ HÀNG
    // ??? CÓ CHO NHẬP TỪNG PHẦN KO ??
    // + NẾU KO thì sẽ có nút nhập ở cuối -> bâms vào show tổng tiền nhập đã đc tính lại, tiền thanh toán, giảm gía, tiền đã thanh toán trc,...
    // -----> thành công sẽ update lại trạng thái + nhập vô kho
    // + NẾU CÓ thì sẽ mỗi row sp có thêm nút nhập -> bấm vô thì sẽ cộng tồn kho , vậy còn tiền thì sao ??(trừ theo mỗi lần bấm nhập -> nếu v thì sẽ ko âply đc giảm giá hay trừ đc khoản thanh toán trc ?? )
    //  tiền -> phía dưới sẽ có nút thanh toán??

    // NẾU SỬA LẠI ĐƠN ĐẶT HOẶC HUỶ ĐƠN THÌ SAO ???

    // NẾU LÀ SẢN PHẨM CÓ LÔ THÌ SAO ??

    let cart = cartList[selectedIndex];
    console.log("cart.supplier", cart.supplier);
    const printReceiptWhenSell = store_setting?.printReceiptWhenSell;
    var emptyCart = cart.cartItem.filter((item) => item.quantity).length === 0;
    // CHECK NẾU TYPE BẰNG 0(đặt) thì NCC ko đc null
    // CHECK NẾU TYPE BẰNG 0(đặt) thì setting có  gửi mail NCC ko , nếu có thì warning email NCC rỗng  ?
    var notExistNullQuantity = cart.cartItem.every(function (element, index) {
      if (element.quantity === "" || Number(element.quantity) === 0)
        return false;
      else return true;
    });

    var extremeQuantity = cart.cartItem.filter((element, index) => {
      if (Number(element.quantity) >= element.extreme && element.extreme !== 0)
        return true;
      else return false;
    });
    if (emptyCart) {
      setOpenSnack(true);
      setSnackStatus({
        style: "error",
        message: "Giỏ hàng trống",
      });

      // setOpenSnack(true);
      // console.log(err);
    } else if (!notExistNullQuantity) {
      setOpenSnack(true);
      setSnackStatus({
        style: "error",
        message: "Có sản phẩm chưa nhập số lượng",
      });
    } else if (
      cart.paid_amount < cart.total_amount - cart.discount &&
      !cart.supplier
    ) {
      setOpenPopUpWarning(true);
      return;
    } else if (extremeQuantity.length) {
      setExtremes(extremeQuantity);
      setOpenExtremeWarning(true);
    } else {
      handleConfirmCallApi(type);
    }
  };

  const handleConfirmCallApi = async (type) => {
    let cart = cartList[selectedIndex];
    const printReceiptWhenSell = store_setting?.printReceiptWhenSell;

    let d = moment.now() / 1000;
    let importTime = moment
      .unix(d)
      .format("YYYY-MM-DD HH:mm:ss", { trim: false });

    let body = {
      supplier_uuid: cart.supplier ? cart.supplier.uuid : "",
      total_amount: cart.total_amount.toString(),
      payment_method: cart.payment_method,
      paid_amount: Math.min(
        cart.paid_amount,
        Number(cart.total_amount) - Number(cart.discount)
      ),
      discount: cart.discount.toString(),
      // CHECK NẾU TYPE BẰNG 0  thì status là chờ hàng
      status:
        Number(cart.total_amount) - Number(cart.discount) >=
        Number(cart.paid_amount)
          ? "debt"
          : "closed",
      details: cart.cartItem.map((item) => ({
        ...item,
        selectedBatches: item.selectedBatches
          ? item.selectedBatches.map((batch) => ({
              ...batch,
              returned_quantity: 0,
            }))
          : [],
      })),
      import_date: importTime,
      is_imported: isOrder ? 0 : 1,
    };
    try {
      console.log(body);
      // CHECK NẾU TYPE BẰNG 0(đặt)  thì gọi api đặt hàng (hoặc sửa luôn api này nhưng ko cộng tòn kho)
      // CHECK NẾU TYPE BẰNG 0(đặt) thì setting có  gửi mail NCC ko , nếu có api gửi mail ?
      let res = await purchaseOrderApi.addInventory(
        store_uuid,
        branch.uuid,
        body
      );
      setSnackStatus({
        style: "success",
        message:
          type === 1
            ? "Nhập hàng thành công: " + res.data.purchase_order_code
            : "Đặt hàng thành công: " + res.data?.purchase_order_code,
      });
      setOpenSnack(true);
      if (
        printReceiptWhenSell.status &&
        printReceiptWhenSell.import &&
        type === 1
      ) {
        handlePrint();
      }
      // handlePrint();
      handleDelete(selectedIndex);
    } catch (err) {
      setSnackStatus({
        style: "error",
        message: type === 1 ? "Nhập hàng thất bại! " : "Dặt hàng thất bại! ",
      });
      setOpenSnack(true);
      console.log(err);
    }
    loadProducts();
  };

  //print
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  //   }
  // };

  const [barcodeChecked, setBarcodeChecked] = useState(true);
  const [openPopUpWarning, setOpenPopUpWarning] = useState(false);
  const [extremes, setExtremes] = useState([]);
  const [openExtremeWarning, setOpenExtremeWarning] = useState(false);

  const handleCloseWarning = () => {
    setOpenPopUpWarning(false);
  };

  // ******* GỢI Ý ĐẶT HÀNG ********
  const handleClickRecommend = async () => {
    if (store_uuid && branch_uuid) {
      try {
        const res = await productApi.productOrderRecommend(
          store_uuid,
          branch_uuid,
          recommendOption
        );
        // alert(JSON.stringify(res.data, null, 2))
        // setDataRecommend(JSON.stringify(res.data, null, 2))
        setDataRecommend(res.data);

        // setDataRecommend(null)
        setOpenRecommendOrderPopUp(true);
      } catch (err) {
        console.log(err);
        openNotification("error", "Không thể tạo gợi ý", "");
        setLoadingOrderButton(false);
      }
    }
  };

  useEffect(() => {
    handleClickRecommend();
  }, [recommendOption]);
  const [openRecommendOrderPopUp, setOpenRecommendOrderPopUp] = useState(false);
  const [dataRecommend, setDataRecommend] = useState(null);

  const [loadingOrderButton, setLoadingOrderButton] = useState(false);
  const handleAddOrderReccomend = (newCartList, cartIndex) => {
    if (cartIndex !== null) {
      // ADD EXIST CART
      let newCart = [...cartList];
      newCart[cartIndex].cartItem = [
        ...newCart[cartIndex].cartItem,
        ...newCartList.cartItem,
      ];

      setCartList(newCart);
      setSelectedIndex(cartIndex);
    } else {
      // ADD NEW CART
      setCartList([...cartList, newCartList]);
      setSelectedIndex(cartList.length);
    }
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      {addProduct && (
        <AddInventory
          open={addProduct}
          handleClose={() => {
            setAddProduct(false);
          }}
          setReload={() => {
            setReloadProduct(!reloadProduct);
          }}
        />
      )}{" "}
      <SnackBarGeneral
        handleClose={handleCloseSnackBar}
        open={openSnack}
        status={snackStatus}
      />
      {/* 1. TABLE CARD (left) */}
      <Grid item xs={12} sm={typeShow === "list" && mode ? 7 : 8}>
        <Card className={classes.root}>
          <Box
            style={{
              padding: xsScreen ? 0 : 30,
              minHeight: "79vh",
              paddingBottom: 0,
            }}
          >
            <Box style={{ height: xsScreen ? null : "70vh" }}>
              {/* 1.1 TITLE + BTN CHANGE CART +  SEARCH */}
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                style={{ marginTop: -10, marginBottom: 30 }}
              >
                <Grid>
                  <ListItem>
                    <ArrowBack
                      onClick={() => {
                        history.goBack();
                      }}
                      style={{ cursor: "pointer", marginRight: 10 }}
                    />
                    <Typography variant="h3"> Chuyển hàng </Typography>
                  </ListItem>
                </Grid>
                <Grid>
                  <Grid container alignItems="center">
                    {!mode ? (
                      <>
                        <Grid item>
                          <FormControlLabel
                            control={
                              <Switch
                                size="small"
                                checked={searchBarState === "barcode"}
                                onChange={(e, checked) => {
                                  dispatch(
                                    infoActions.setSearchBarState(
                                      checked ? "barcode" : "search"
                                    )
                                  );
                                }}
                                color="primary"
                              />
                            }
                            label={"Dùng mã vạch"}
                          />
                        </Grid>
                        <Grid item>
                          {searchBarState === "barcode" ? (
                            <SearchBarCode
                              products={products}
                              handleSearchBarSelect={handleSearchBarSelect}
                            />
                          ) : (
                            <SearchProduct
                              products={products}
                              handleSearchBarSelect={handleSearchBarSelect}
                            />
                          )}
                        </Grid>
                      </>
                    ) : (
                      <SearchProduct
                        products={products}
                        setProducts={setProducts}
                        isFilter={true}
                      />
                    )}
                    <Grid item>
                      <ButtonBase
                        sx={{ borderRadius: "1px" }}
                        onClick={() => {
                          setAddProduct(true);
                        }}
                        style={{ marginLeft: 10 }}
                      >
                        <Avatar
                          variant="rounded"
                          className={classes.headerAvatar}
                        >
                          <Tooltip title="Thêm sản phẩm">
                            <AddIcon stroke={1.5} size="1.3rem" />
                          </Tooltip>
                        </Avatar>
                      </ButtonBase>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {/* 1.2 TABLE */}
              {!mode ? (
                <TableWrapper isCart={true}>
                  <TableHeader
                    classes={classes}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    headerData={HeadCells.TableInventoryHeadCells}
                    isCart={true}
                  />
                  <TableBody>
                    {stableSort(
                      cartList[selectedIndex].cartItem,
                      getComparator(order, orderBy)
                    ).map((row, index) => {
                      return (
                        <ImportRow
                          key={`${row.uuid}_index`}
                          row={row}
                          handleDeleteItemCart={handleDeleteItemCart}
                          handleChangeItemPrice={handleChangeItemPrice}
                          handleChangeItemQuantity={handleChangeItemQuantity}
                          handleUpdateBatches={handleUpdateBatches}
                          // branchs={branchs}
                          index={
                            cartList[selectedIndex].cartItem.length - index
                          }
                          showImage={showImage}
                        />
                      );
                    })}
                  </TableBody>
                </TableWrapper>
              ) : (
                <MenuProduct
                  products={products}
                  handleSearchBarSelect={handleSearchBarSelect}
                  selectedItem={cartList[selectedIndex].cartItem}
                  typeShow={typeShow}
                  setTypeShow={setTypeShow}
                  setProducts={setProducts}
                  showImage={showImage}
                  setShowImage={setShowImage}
                />
              )}
            </Box>
            {/* 1.3 CHANGE MODE  */}
            {/* <FormControlLabel control={<Switch size="small" checked={mode} onChange={handleChangeMode} />}style={{ display: "flex",  justifyContent: "flex-end",   margin: -20,  marginTop: 40, }} /> */}
          </Box>
          <FormControlLabel
            control={
              <Switch size="small" checked={mode} onChange={handleChangeMode} />
            }
            style={{ display: "flex", justifyContent: "flex-end" }}
          />
        </Card>
      </Grid>
      {/* 2.SUMMARY CARD (right) */}
      <Grid
        item
        xs={12}
        sm={typeShow === "list" && mode ? 5 : 4}
        className={classes.root}
      >
        <Card className={classes.root}>
          <Box style={{ padding: 0, minHeight: "82vh" }}>
            <InventorySidePanel
              setSelectedBranch={setSelectedBranch}
              selectedBranch={selectedBranch}
              cartData={cartList[selectedIndex]}
              handleSelectSupplier={handleSelectSupplier}
              handleUpdateDiscount={handleUpdateDiscount}
              handleUpdatePaidAmount={handleUpdatePaidAmount}
              handleUpdatePaymentMethod={handleUpdatePaymentMethod}
              handleConfirm={handleConfirm}
              currentSupplier={cartList[selectedIndex].supplier}
              mode={mode}
              currentBranch={branch}
              suppliers={suppliers}
              reloadSuppliers={() => setReloadSupplier(!reloadSupplier)}
              handleUpdateDiscountDetail={handleUpdateDiscountDetail}
              setIsOrder={setIsOrder}
              isOrder={isOrder}
            >
              {!mode ? null : (
                <>
                  <TableContainer
                    style={{
                      maxHeight:
                        Number(cartList[selectedIndex].discount) !== 0
                          ? "37vh"
                          : "44vh",
                      height:
                        Number(cartList[selectedIndex].discount) !== 0
                          ? "37vh"
                          : "44vh",
                    }}
                  >
                    <Table size="small">
                      <TableBody>
                        {stableSort(
                          cartList[selectedIndex].cartItem,
                          getComparator(order, orderBy)
                        ).map((row, index) => {
                          return (
                            <ImportRow
                              row={row}
                              handleUpdateBatches={handleUpdateBatches}
                              handleDeleteItemCart={handleDeleteItemCart}
                              handleChangeItemPrice={handleChangeItemPrice}
                              handleChangeItemQuantity={
                                handleChangeItemQuantity
                              }
                              mini={true}
                              imageType={typeShow === "image" && mode}
                              index={
                                cartList[selectedIndex].cartItem.length - index
                              }
                              typeShow={typeShow}
                              showImage={showImage}
                            />
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </InventorySidePanel>
          </Box>
        </Card>
      </Grid>
      <PopUpWarningZeroPrice
        open={openPopUpWarning}
        handleClose={handleCloseWarning}
        handleConfirmCallApi={handleConfirmCallApi}
      />
      <PopUpWarningExtreme
        open={openExtremeWarning}
        handleClose={() => setOpenExtremeWarning(false)}
        handleConfirmCallApi={handleConfirmCallApi}
        items={extremes}
      />
      {/* 3. Receipt */}
      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <ImportReceiptPrinter cart={cartList[selectedIndex]} />
        </div>
      </div>
    </Grid>
  );
};

export default Transfer;

const PopUpWarningZeroPrice = ({
  open,
  handleClose,
  handleConfirmCallApi,
  isDebtWarning,
}) => {
  const theme = useTheme();

  return (
    <ModalWrapperWithClose
      title={"Đơn nhập nợ chưa có thông tin nhà cung cấp"}
      open={open}
      handleClose={handleClose}
    >
      <Typography style={{ marginTop: 10, marginBottom: 10 }}>
        Bạn chưa nhập thông tin nhà cung cấp. Hệ thống không theo dõi công nợ
        với nhà cung cấp lẻ.
      </Typography>
      {/* {existZeroPrice && isDebtWarning?
    <>
      <Typography variant="h3" style={{ marginTop: 10, marginBottom: 10 }}>
        Có sản phẩm đang có giá bán bằng 0
      </Typography>
      <Typography style={{ marginTop: 10, marginBottom: 30 }}>
         Giỏ hàng đang có sản phẩm có giá bán bằng 0
      </Typography>
      </>:null} */}

      <Typography
        style={{
          fontWeight: 600,
          color: theme.customization.primaryColor[500],
        }}
      >
        Bạn có chắc chắn muốn tiếp tục thanh toán?
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
          onClick={() => {
            handleConfirmCallApi();
            handleClose();
          }}
          variant="contained"
          size="small"
          color="primary"
        >
          Xác nhận{" "}
        </Button>
      </Grid>
    </ModalWrapperWithClose>
  );
};

const PopUpWarningExtreme = ({
  open,
  handleClose,
  handleConfirmCallApi,
  isDebtWarning,
  items,
}) => {
  const theme = useTheme();

  return (
    <ModalWrapperWithClose
      title={"Đơn nhập có lượng nhập bất thường"}
      open={open}
      handleClose={handleClose}
    >
      <Typography style={{ marginTop: 10, marginBottom: 10 }}>
        Sản phẩm có lượng nhập nhiều hơn mức thường gặp.
      </Typography>

      {items.map((item) => (
        <div>
          <strong>{item.name}</strong> vượt <strong>{item.extreme}</strong>
        </div>
      ))}

      <Typography
        style={{
          fontWeight: 600,
          color: theme.customization.primaryColor[500],
        }}
      >
        Bạn có chắc chắn muốn tiếp tục tạo đơn nhập
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
          onClick={() => {
            handleConfirmCallApi();
            handleClose();
          }}
          variant="contained"
          size="small"
          color="primary"
        >
          Xác nhận{" "}
        </Button>
      </Grid>
    </ModalWrapperWithClose>
  );
};

function ButtonComponent(props) {
  const { onClick, loading } = props;
  // const theme = useTheme();

  return (
    <Button {...props} onClick={onClick} disabled={loading}>
      {loading && (
        <>
          {props.title}
          <CircularProgress style={{ marginLeft: 10 }} size={14} />
        </>
      )}
      {!loading && props.title}
    </Button>
  );
}

const RecommendTitle = ({ recommendOption, setRecommendOption }) => {
  const handleChange = (e) => {
    setRecommendOption({ ...recommendOption, [e.target.name]: e.target.value });
  };
  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <Grid container direction="row" spacing={2} alignContent="center">
        <Grid item xs={5}>
          <div>Gợi ý đặt hàng nhập</div>
        </Grid>

        <Grid item xs={2}>
          <TextField
            select
            value={recommendOption.mode}
            onChange={handleChange}
            label="Chế độ"
            name="mode"
          >
            <MenuItem value={"lastXdays"}>X ngày qua</MenuItem>
            <MenuItem value={"samePeriodPastYear"}>Cùng kỳ năm ngoái</MenuItem>
          </TextField>
        </Grid>

        {recommendOption.mode === "lastXdays" ? (
          <>
            <Grid item xs={2}>
              <TextField
                name="historyPeriod"
                onChange={handleChange}
                label="Số ngày mẫu"
                type="number"
                value={recommendOption.historyPeriod}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                name="forecastPeriod"
                onChange={handleChange}
                label="Số ngày gợi ý"
                type="number"
                value={recommendOption.forecastPeriod}
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={2}>
              <TextField
                name="currentDate"
                onChange={handleChange}
                label="Ngày"
                type="date"
                value={recommendOption.currentDate}
              />
            </Grid>
            <Grid item xs={1}>
              <TextField
                name="numOfYears"
                onChange={handleChange}
                width={50}
                label="Số năm cũ"
                type="number"
                value={recommendOption.numOfYears}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                name="period"
                onChange={handleChange}
                label="Số ngày gợi ý"
                type="number"
                value={recommendOption.period}
              />
            </Grid>
          </>
        )}
      </Grid>
    </FormControl>
  );
};
