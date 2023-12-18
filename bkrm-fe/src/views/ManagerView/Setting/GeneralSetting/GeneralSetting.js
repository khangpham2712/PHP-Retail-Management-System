import React, { useState } from "react";
import {
  useTheme,
  withStyles,
  makeStyles,
  createStyles,
} from "@material-ui/core/styles";
import {
  Typography,
  Button,
  Divider,
  List,
  Card,
  ListItem,
  ListSubheader,
  TextField,
  ListItemSecondaryAction,
  Switch,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Grid,
  ButtonBase,
  Tooltip,
  Box,
  IconButton,
  Modal
} from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";
import WifiIcon from "@material-ui/icons/Wifi";
import StarsIcon from "@material-ui/icons/Stars";
import SendIcon from "@material-ui/icons/Send";
import TelegramIcon from "@material-ui/icons/Telegram";
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import MoneyIcon from "@material-ui/icons/Money";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import UpdateIcon from "@material-ui/icons/Update";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import ExtensionIcon from "@material-ui/icons/Extension";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import NotificationImportantIcon from "@material-ui/icons/NotificationImportant";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import AddAlertIcon from "@material-ui/icons/AddAlert";
import { grey } from "@material-ui/core/colors";
import ModalWrapperWithClose from "../../../../components/Modal/ModalWrapperWithClose";
import CustomerScoreSetting from "./CustomerScoreSetting";
import EmailSetting from "./EmailSetting";
import NotifyDebtSetting from "./NotifyDebtSetting";
import OrderLowStockSetting from "./OrderLowStockSetting";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MoneyOffIcon from "@material-ui/icons/MoneyOff";
import PrintIcon from "@material-ui/icons/Print";
import storeApi from "../../../../api/storeApi";
import openNotification from "../../../../components/StatusPopup/StatusPopup";
import {
  ReturnLimitSetting,
  DiscountSetting,
  CanFixPriceSellSetting,
  PrintReceiptWhenSellSetting,
  VatSetting,
  DefaultPaymentSetting
} from "./OtherSetting";
import { useDispatch } from "react-redux";
import ConfirmPopUp from '../../../../components/ConfirmPopUp/ConfirmPopUp'
import SettingsIcon from "@material-ui/icons/Settings";
import StoreSetting from "../StoreSetting/StoreSetting";
import SettingItem from "./SettingItem";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { infoActions } from "../../../../store/slice/infoSlice";
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import setting from "../../../../assets/constant/setting"
import ExposureIcon from '@material-ui/icons/Exposure';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import { DeleteOutline } from "@material-ui/icons";
import { statusAction } from "../../../../store/slice/statusSlice";
import DeleteAllModal from "./DeleteAllModal";
import TimelineIcon from '@material-ui/icons/Timeline';
import PaymentIcon from '@material-ui/icons/Payment';
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      background: theme.customization.mode === "Light" ? null : grey[800],
      borderRadius: theme.customization.borderRadius,
      color: "#000000",
      padding: 18,
    },
    headerTitle: {
      marginTop: 10,
      marginLeft: 20,
    },
  })
);

const GeneralSetting = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const dispatch = useDispatch();

  //call api here
  // redux
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  // useEffect(()=>{

  // })

  const store_setting = info.store.general_configuration? JSON.parse(info.store.general_configuration): setting
  // const store_setting = setting

  // store_setting
  const [checked, setChecked] = React.useState(store_setting)
  const [change, setChange] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const response = await storeApi.getStoreInfo(store_uuid);
      if (response.data.general_configuration) {
        setChecked(JSON.parse(response.data.general_configuration));
      }
    };
    if (store_uuid) {
      loadData();
    }
  }, [store_uuid]);

  // const [checked, setChecked] = React.useState({
  //   //
  //   inventory: { status: true },
  //   recommendedProduct: { status: true },
  //   variation: { status: true },
  //   expiryDate: { status: true },

  //   //
  //   customerScore: {
  //     status: false,
  //     value: 10000,
  //     exceptDiscountProduct: false,
  //     exceptDiscountInvoice: false,
  //     exceptVoucher: false,
  //   },
  //   email: {
  //     status: false,
  //     emailAddress: "",
  //     password: "",
  //   },
  //   notifyDebt: {
  //     status: true,
  //     checkDebtAmount: true,
  //     debtAmount: "500000",
  //     checkNumberOfDay: false,
  //     numberOfDay: "15",
  //     typeDebtDay: "firstDebt",
  //     canNotContinueBuy: false,
  //     canNotContinueDebt: false,
  //   },

  //   //
  //   returnLimit: {
  //     status: false,
  //     day: 7,
  //   },
  //   canFixPriceSell: {
  //     status: false,
  //     cart: false,
  //     import: true,
  //     returnCart: true,
  //     returnImport: true,
  //   },
  //   printReceiptWhenSell: {
  //     status: true,
  //     cart: true,
  //     import: false,
  //     returnCart: false,
  //     returnImport: false,
  //     order: false,
  //     checkInventroy: false,
  //   },
  //   alowDebt: {
  //     status: true,
  //   },
  //   canSellWhenNegativeQuantity: {
  //     status: true,
  //   },
  //   canEnterDiscountWhenSell:{
  //     status: true,
  //   },
  //   discount: {
  //     status: true,
  //     applyMultiple: false,
  //     applyOnline: true,
  //   },
  //   voucher: { status: true },
  //   delivery: { status: true },

  //   vat: {
  //     status: false,
  //     listCost: [{ key: "1", costName: "", value: 0, type: "%" }],
  //   },

  //   //
  //   orderLowStock: {
  //     status: true,
  //     choiceQuantity: "select", //number
  //     selectQuantity: "latest", //avg
  //     inputQuantity: 10,
  //     selectSuplier: "latest", //manytime
  //   },
  //   autoApplyDiscount: { status: true },
  // });


  useEffect(() =>{
    if(change){
      callApi()
      setChange(false)
    }
  }, [change])

  const callApi = async() =>{
    try {
      dispatch(infoActions.setStore({...info.store, general_configuration:JSON.stringify(checked)}));

      const response = storeApi.updateStoreInfo(store_uuid, {
        general_configuration: JSON.stringify(checked),
      });
      openNotification("success", "Lưu cài đặt chung thành công");
      console.log("checked",checked)
      // dispatch(infoActions.setStore({...info.store, general_configuration:JSON.stringify(checked)}));
      
    } catch (err) {
      console.log(err);
      openNotification("error", "Lưu cài đặt chung thất bại");
    }
  
  }
  const handleToggle =  (event) => {
    const { name } = event.target;
     setChecked((prevState) => {
      return {
        ...prevState,
        [name]: {
          ...prevState[name],
          status: event.target.checked,
        },
      };
    });
    //CALL API: Mỗi lần toggle là đẩy lên backend
    // như vậy nhiều quá á, làm nút SAVE nha
    // callApi()
    setChange(true)
  };

  const [open, setOpen] = React.useState({
    customerScore: false,
    email: false,
    notifyDebt: false,
    returnLimit: false,
    discount: false,
    vat: false,
    orderLowStock: false,
    canFixPriceSell: false,
    printReceiptWhenSell: false,
    inventory:false,
    defaultPaymentAmount:false
  });

  const handleTogglePopup = (event, name) => {
    if (event.target.checked) {
      setOpen((prevState) => {
        return {
          ...prevState,
          [name]: true,
        };
      });
    } else {
        setChecked((prevState) => {
        return {
          ...prevState,
          [name]: {
            ...prevState[name],
            status: false,
          },
        };
      });
    
      setChange(true)
  
    }
  };

  const handleClosePopup = () => {
    setOpen({ customerScore: false });
  };

  const handleSubmit = (name, customerScore) => {
    // close pop up && set switch
    if (name === "inventory") {
      const res = storeApi.toggleInventory(store_uuid);
    }
    handleClosePopup();
    setChecked((prevState) => {
      return {
        ...prevState,
        [name]: {
          ...customerScore,
          status: true,
        },
      };
    });
    setChange(true)

    // CALL API ĐẨY LÊN BACK END HERE....

    // snackbar noti submit thành công
  };
  const deleteAll = async (body) => {
    try {
      const res = await storeApi.deleteAllTransactions(store_uuid, body);
      setOpenDeleteAll(false);
      dispatch(statusAction.successfulStatus('Xóa tất cả giao dịch thành công'))
    } catch (err) {
      dispatch(statusAction.failedStatus('Xóa tất cả giao dịch thất bại'))
    }
  }
  const [openStore, setOpenStore] = useState(false);
  const [openDeleteAll, setOpenDeleteAll] = useState(false);

  return (
    <Card className={classes.root}>
      {openStore && <StoreSetting open={openStore} handleClose={() => setOpenStore(false)} />}
      {openDeleteAll && <DeleteAllModal 
        deleteAll={deleteAll}
        openDeleteAll={openDeleteAll}
        setOpenDeleteAll={setOpenDeleteAll}
      />}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        style={{ paddingRight: "2vw" }}
      >
        <Typography className={classes.headerTitle} variant="h3">
          Cài đặt chung
        </Typography>
        <Grid direction="row">
          <Tooltip title="Cài đặt chung">
            <IconButton aria-label="setting" onClick={() => setOpenStore(true)}>
              <SettingsIcon color="secondary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa dữ liệu">
            <IconButton aria-label="setting" onClick={() => setOpenDeleteAll(true)}>
              <DeleteOutline color="secondary" />
            </IconButton>
          </Tooltip>
        </Grid>
        
      </Box>
      {/* 1 */}
      <List
        subheader={<ListSubheader>Hàng hoá</ListSubheader>}
        className={classes.root}
      >
        {/* <SettingItem
          name="inventory"
          statusChecked={checked.inventory.status}
          actionToggle={(e) => {
            handleToggle(e);
            const res = storeApi.toggleInventory(store_uuid);
          }}
          title="Quản lý tồn kho"
          subTitle="Quản lý sản phẩm theo số lượng tồn kho"
        >
          <AccountTreeIcon
            style={{
              fill: checked.inventory.status
                ? theme.customization.secondaryColor[500]
                : null,
            }}
          />
        </SettingItem> */}
        <SettingItem
          name="averageCost"
          statusChecked={checked?.averageCost?.status}
          actionToggle={handleToggle}
          title="Giá vốn trung bình"
          subTitle="Giá vốn được tính theo phương pháp tính trung bình từ các giao dịch nhập hàng để tính lợi nhuận"
        >
          <TimelineIcon
            style={{
              fill: checked?.averageCost?.status
                ? theme.customization.secondaryColor[500]
                : null,
            }}
          />
        </SettingItem>

        <SettingItem
          name="inventory"
          statusChecked={checked?.inventory?.status}
          // detail={true}
          setOpen={setOpen}
          actionToggle={(e) => {
            // handleTogglePopup(e, "inventory");
            if (!e.target.checked) {
              setOpen((prevState) => {
                return {
                  ...prevState,
                  inventory: true,
                };
              });
            }else{
              setChecked((prevState) => {
                return {
                  ...prevState,
                  inventory: {
                    status: true,
                  },
                };
              });
              const res = storeApi.toggleInventory(store_uuid);
              setChange(true)
            }
          }}
          title="Quản lý tồn kho"
          subTitle="Quản lý sản phẩm theo số lượng tồn kho"
        >
          <AccountTreeIcon
            style={{
              fill: checked?.inventory?.status
                ? theme.customization.secondaryColor[500]
                : null,
            }}
          />
        </SettingItem>

        <SettingItem
          name="recommendedProduct"
          statusChecked={checked?.recommendedProduct?.status}
          actionToggle={handleToggle}
          title="Tự động gợi ý thông tin hàng hoá"
          subTitle="Cho phép tự động gợi ý tên, mã, mô tả, hình ảnh hàng hóa khi thêm mới"
        >
          <NotificationImportantIcon
            style={{
              fill: checked?.recommendedProduct?.status
                ? theme.customization.secondaryColor[500]
                : null,
            }}
          />
        </SettingItem>

        <SettingItem
          name="variation"
          statusChecked={checked.variation.status}
          actionToggle={handleToggle}
          title="Hàng hoá có thuộc tính"
          subTitle="Quản lý sản phẩm có thuộc tính (size, màu,...)"
        >
          <ExtensionIcon
            style={{
              fill: checked.variation.status
                ? theme.customization.secondaryColor[500]
                : null,
            }}
          />
        </SettingItem>

        <SettingItem
          name="expiryDate"
          statusChecked={checked.expiryDate.status}
          actionToggle={handleToggle}
          title="Quản lý tồn kho theo Lô/Hạn sử dụng"
          subTitle="Quản lý hạn sử dụng của sản phẩm, thông báo khi sản phẩm sắp hết hạn sử dụng"
        >
          <EventAvailableIcon
            style={{
              fill: checked.expiryDate.status
                ? theme.customization.secondaryColor[500]
                : null,
            }}
          />
        </SettingItem>
      </List>
      {/* 2 */}
      <List
        subheader={<ListSubheader>Khách hàng</ListSubheader>}
        className={classes.root}
      >
        <SettingItem
          name="customerScore"
          detail={true}
          setOpen={setOpen}
          statusChecked={checked.customerScore.status}
          actionToggle={(e) => {
            handleTogglePopup(e, "customerScore");
          }}
          title="Tích điểm"
          subTitle="Tích điểm thưởng cho khách hàng khi mua hàng, sử dụng điểm thưởng để chia nhóm khách hàng."
        >
          <StarsIcon
            style={{
              fill: checked.customerScore.status
                ? theme.customization.secondaryColor[500]
                : null,
            }}
          />
        </SettingItem>

        <SettingItem
          name="email"
          detail={true}
          setOpen={setOpen}
          statusChecked={checked.email.status}
          actionToggle={(e) => {
            handleTogglePopup(e, "email");
          }}
          title="Gửi Email"
          subTitle="Cho phép sử dụng tính năng Email  "
        >
          <TelegramIcon
            style={{
              fill: checked.email.status
                ? theme.customization.secondaryColor[500]
                : null,
            }}
          />
        </SettingItem>

        <SettingItem
          name="notifyDebt"
          detail={true}
          setOpen={setOpen}
          statusChecked={checked.notifyDebt.status}
          actionToggle={(e) => {
            handleTogglePopup(e, "notifyDebt");
          }}
          title="Cảnh báo công nợ khách hàng"
          subTitle="Cho phép thiết lập hạn mức công nợ để cảnh báo khách hàng."
        >
          <RecordVoiceOverIcon
            style={{
              fill: checked.notifyDebt.status
                ? theme.customization.secondaryColor[500]
                : null,
            }}
          />
        </SettingItem>
      </List>

      {/* 3 */}
      <List
        subheader={<ListSubheader>Giao dịch</ListSubheader>}
        className={classes.root}
      >
        <SettingItem
          name="returnLimit"
          detail={true}
          setOpen={setOpen}
          statusChecked={checked.returnLimit.status}
          actionToggle={(e) => {
            handleTogglePopup(e, "returnLimit");
          }}
          title="Giới hạn thời gian trả hàng"
          subTitle="Không cho phép trả hàng khi vuợt quá thời gian giới hạn"
        >
          <UpdateIcon
            style={{
              fill: checked.returnLimit.status
                ? theme.customization.secondaryColor[500]
                : null,
            }}
          />
        </SettingItem>

        <SettingItem
          name="canFixPriceSell"
          detail={true}
          setOpen={setOpen}
          statusChecked={checked.canFixPriceSell.status}
          actionToggle={(e) => {
            handleTogglePopup(e, "canFixPriceSell");
          }}
          title="Có thể sửa giá khi thực hiện giao dịch"
          subTitle="Cho phép sửa giá bán, giá nhập, giá trả khi thực hiện giao dịch"
        >
          <MoneyOffIcon
            style={{
              fill: checked.canFixPriceSell?.status
                ? theme.customization.secondaryColor[500]
                : null,
            }}
          />
        </SettingItem>

        <SettingItem
          name="printReceiptWhenSell"
          detail={true}
          setOpen={setOpen}
          statusChecked={checked.printReceiptWhenSell?.status}
          actionToggle={(e) => {
            handleTogglePopup(e, "printReceiptWhenSell");
          }}
          title="In hoá đơn ngay sau khi thực hiện giao dịch"
          subTitle="In hoá đơn ngay sau khi hoàn thành giao dịch (bán hàng, nhập hàng, trả hàng, đặt hàng, kiểm kho,...)"
        >
          <PrintIcon
            style={{
              fill: checked?.printReceiptWhenSell?.status
                ? theme.customization.secondaryColor[500]
                : null,
            }}
          />
        </SettingItem>

        <SettingItem
          name="canSellWhenNegativeQuantity"
          statusChecked={checked?.canSellWhenNegativeQuantity?.status}
          actionToggle={handleToggle}
          title="Cho phép bán hàng khi hết hàng tồn kho"
          subTitle="Khi tồn kho bằng 0 vẫn có thể bán hàng, hệ thống sẽ ghi nhận giá trị âm" 
        >
          <ExposureIcon
            style={{
              fill: checked?.canSellWhenNegativeQuantity?.status
                ? theme.customization.secondaryColor[500]
                : null,
            }}
          />
        </SettingItem>

        <SettingItem
          name="alowDebt"
          statusChecked={checked?.alowDebt?.status}
          actionToggle={handleToggle}
          title="Cho phép khách hàng nợ khi mua hàng"
          subTitle="Tiền khách hàng thanh toán không được nhỏ hơn tổng tiền hoá đơn" 
        >
          <DescriptionOutlinedIcon
            style={{
              fill: checked?.alowDebt?.status
                ? theme.customization.secondaryColor[500]
                : null,
            }}
          />
        </SettingItem>

        <SettingItem
          name="canEnterDiscountWhenSell"
          statusChecked={checked?.canEnterDiscountWhenSell?.status}
          actionToggle={handleToggle}
          title="Cho phép nhập giảm giá"
          subTitle="Cho phép nhân viên sửa giảm giá chiết khấu hoá đơn" 
        >
          <LoyaltyIcon
            style={{
              fill: checked?.canEnterDiscountWhenSell?.status
                ? theme.customization.secondaryColor[500]
                : null,
            }}
          />
        </SettingItem>

        <SettingItem
          name="defaultPaymentAmount"
          detail={true}
          setOpen={setOpen}
          statusChecked={checked.defaultPaymentAmount?.status}
          actionToggle={(e) => {
            handleTogglePopup(e, "defaultPaymentAmount");
          }}
          title="Mặc định tiền thanh toán giao dịch"
          subTitle="Hệ thống sẽ mặc định tiền khách thanh toán / tiền trả NCC bằng tổng tiền hoá đơn. Nếu không bật thì mặc định là 0." 
        >
          <PaymentIcon
            style={{
              fill: checked?.defaultPaymentAmount?.status
                ? theme.customization.secondaryColor[500]
                : null,
            }}
          />
        </SettingItem>


        <SettingItem
          name="discount"
          detail={true}
          setOpen={setOpen}
          statusChecked={checked.discount.status}
          actionToggle={(e) => {
            handleTogglePopup(e, "discount");
          }}
          title="Khuyến mãi"
          subTitle="Áp dụng chương trinh khuyến mãi cho sản phẩm hoặc hoá đơn"
        >
          <CardGiftcardIcon
            style={{
              fill: checked.discount.status
                ? theme.customization.secondaryColor[500]
                : null,
            }}
          />
        </SettingItem>

        <SettingItem
          name="voucher"
          statusChecked={checked.voucher.status}
          actionToggle={handleToggle}
          title="Voucher"
          subTitle="Áp dụng voucher vào trả tiền hoá đơn"
        >
          <MoneyIcon
            style={{
              fill: checked.voucher.status
                ? theme.customization.secondaryColor[500]
                : null,
            }}
          />
        </SettingItem>

        <SettingItem
          name="delivery"
          statusChecked={checked.delivery.status}
          actionToggle={handleToggle}
          title="Giao hàng"
          subTitle="Quản lý giao hàng"
        >
          <LocalShippingIcon
            style={{
              fill: checked.delivery.status
                ? theme.customization.secondaryColor[500]
                : null,
            }}
          />
        </SettingItem>

        <SettingItem
          name="vat"
          detail={true}
          setOpen={setOpen}
          statusChecked={checked.vat.status}
          actionToggle={(e) => {
            handleTogglePopup(e, "vat");
          }}
          title="Thu khác khi bán hàng"
          subTitle="Áp dụng phí thu khác khi bán hàng (VAT, phí dịch vụ, ...)"
        >
          <AccountBalanceIcon
            style={{
              fill: checked.vat.status
                ? theme.customization.secondaryColor[500]
                : null,
            }}
          />
        </SettingItem>
      </List>
      {/* 4 */}
      <List
        subheader={<ListSubheader>Khác</ListSubheader>}
        className={classes.root}
      >
        <SettingItem
          name="orderLowStock"
          detail={true}
          setOpen={setOpen}
          statusChecked={checked.orderLowStock.status}
          actionToggle={(e) => {
            handleTogglePopup(e, "orderLowStock");
          }}
          title="Gợi ý tạo đơn đặt hàng NCC"
          subTitle="Tự động gợi ý tạo đơn đặt hàng nhà cung cấp khi sản phẩm sắp hết"
        >
          <AddAlertIcon
            style={{
              fill: checked.orderLowStock.status
                ? theme.customization.secondaryColor[500]
                : null,
            }}
          />
        </SettingItem>

        <SettingItem
          name="autoApplyDiscount"
          statusChecked={checked.autoApplyDiscount.status}
          actionToggle={handleToggle}
          title="Tự động áp dụng khuyến mãi"
          subTitle="Tự động áp dụng khuyến mãi khi bán hàng (nếu không cho áp dụng gộp nhiều sản phẩm thì hệ thống sẽ tự động áp dụng khuyến mãi có lợi nhất cho khách hàng trong trường hợp có nhiều khuyến mãi) "
        >
          <AddShoppingCartIcon
            style={{
              fill: checked.autoApplyDiscount.status
                ? theme.customization.secondaryColor[500]
                : null,
            }}
          />
        </SettingItem>
      </List>

      {/* Modal */}
      {open.customerScore ? (
        <ModalWrapperWithClose
          title="Thiết lập tích điểm"
          open={open.customerScore}
          handleClose={handleClosePopup}
        >
          <CustomerScoreSetting
            checked={checked.customerScore}
            handleSubmit={handleSubmit}
            name="customerScore"
            handleClose={handleClosePopup}
          />
        </ModalWrapperWithClose>
      ) : null}

      {open.email ? (
        <ModalWrapperWithClose
          title="Thiết lập Email"
          open={open.email}
          handleClose={handleClosePopup}
        >
          <EmailSetting
            checked={checked.email}
            handleSubmit={handleSubmit}
            name="email"
            handleClose={handleClosePopup}
          />
        </ModalWrapperWithClose>
      ) : null}

      {open.notifyDebt ? (
        <ModalWrapperWithClose
          title="Thiết lập cảnh báo công nợ khách hàng"
          open={open.notifyDebt}
          handleClose={handleClosePopup}
        >
          <NotifyDebtSetting
            checked={checked.notifyDebt}
            handleSubmit={handleSubmit}
            name="notifyDebt"
            handleClose={handleClosePopup}
          />
        </ModalWrapperWithClose>
      ) : null}

      {open.returnLimit ? (
        <ModalWrapperWithClose
          title="Thiết lập thời gian trả hàng"
          open={open.returnLimit}
          handleClose={handleClosePopup}
        >
          <ReturnLimitSetting
            checked={checked.returnLimit}
            handleSubmit={handleSubmit}
            name="returnLimit"
            handleClose={handleClosePopup}
          />
        </ModalWrapperWithClose>
      ) : null}
      {open.canFixPriceSell ? (
        <ModalWrapperWithClose
          title="Thiết lập chức năng sửa giá"
          open={open.canFixPriceSell}
          handleClose={handleClosePopup}
        >
          <CanFixPriceSellSetting
            checked={checked.canFixPriceSell}
            handleSubmit={handleSubmit}
            name="canFixPriceSell"
            handleClose={handleClosePopup}
          />
        </ModalWrapperWithClose>
      ) : null}
      {open.printReceiptWhenSell ? (
        <ModalWrapperWithClose
          title="Thiết lập in hoá đơn sau giao dịch"
          open={open.printReceiptWhenSell}
          handleClose={handleClosePopup}
        >
          <PrintReceiptWhenSellSetting
            checked={checked.printReceiptWhenSell}
            handleSubmit={handleSubmit}
            name="printReceiptWhenSell"
            handleClose={handleClosePopup}
          />
        </ModalWrapperWithClose>
      ) : null}
      {open.discount ? (
        <ModalWrapperWithClose
          title="Thiết lập khuyến mãi"
          open={open.discount}
          handleClose={handleClosePopup}
        >
          <DiscountSetting
            checked={checked.discount}
            handleSubmit={handleSubmit}
            name="discount"
            handleClose={handleClosePopup}
          />
        </ModalWrapperWithClose>
      ) : null}
      {open.vat ? (
        <ModalWrapperWithClose
          title="Thiết lập thu khác khi bán hàng"
          open={open.vat}
          handleClose={handleClosePopup}
        >
          <VatSetting
            checked={checked.vat}
            handleSubmit={handleSubmit}
            name="vat"
            handleClose={handleClosePopup}
          />
        </ModalWrapperWithClose>
      ) : null}
      {open.orderLowStock ? (
        <ModalWrapperWithClose
          title="Thiết lập tự động tạo đơn đặt hàng NCC"
          open={open.orderLowStock}
          handleClose={handleClosePopup}
        >
          <OrderLowStockSetting
            checked={checked.orderLowStock}
            handleSubmit={handleSubmit}
            name="orderLowStock"
            handleClose={handleClosePopup}
          />
        </ModalWrapperWithClose>
      ) : null}

      {open.inventory ? (
        <ModalWrapperWithClose
          title="Cảnh báo"
          open={open.inventory}
          handleClose={handleClosePopup}
          
        >
         <Typography style={{color:'#000', fontSize:16, marginTop:10}}> Nếu tắt chế độ quản lý tồn kho thì những sản phẩm  </Typography>
         <Typography style={{color:'#000', fontSize:16, marginBottom:20}}>  đang có tồn kho sẽ được <b style={{color:theme.customization.secondaryColor[500]}}>cập nhật về 0. </b> </Typography>
         <Typography style={{color:theme.customization.primaryColor[500], fontWeight:600,fontSize:16}}> Bạn có chắc muốn tắt chế độ này không ?</Typography>
         <Grid item  xs={12} style={{ display: "flex", flexDirection: "row",justifyContent: "flex-end",  paddingTop: 20,  }}  >
            <Button onClick={handleClosePopup} variant="contained"  size="small"  style={{ marginRight: 20 }} color="secondary"  >  Huỷ </Button>
            <Button onClick={()=>{
                handleClosePopup();
                setChecked((prevState) => {
                  return {
                    ...prevState,
                    inventory: {
                      status: false,
                    },
                  };
                });
                setChange(true)

            }} variant="contained" size="small" color="primary" >OK  </Button>
        </Grid>
        
        </ModalWrapperWithClose>
      ) : null}
     
      {open.defaultPaymentAmount ? (
        <ModalWrapperWithClose
          title="Thiết lập mặc định tiền thanh toán giao dịch"
          open={open.defaultPaymentAmount}
          handleClose={handleClosePopup}
        >
          <DefaultPaymentSetting
            checked={checked.defaultPaymentAmount}
            handleSubmit={handleSubmit}
            name="defaultPaymentAmount"
            handleClose={handleClosePopup}
          />
        </ModalWrapperWithClose>
      ) : null}

      {/* <Button
        onClick={async () => {
          try {
            const response = storeApi.updateStoreInfo(store_uuid, {
              general_configuration: JSON.stringify(checked),
            });
            openNotification("success", "Lưu cài đặt chung thành công");
            dispatch(infoActions.setStore({...info.store, general_configuration:JSON.stringify(checked)}));
            
          } catch (err) {
            console.log(err);
            openNotification("error", "Lưu cài đặt chung thất bại");
          }
        }}
      >
        Lưu thay đổi
      </Button> */}
    </Card>
  );
};


export default GeneralSetting;
