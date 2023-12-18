import React, { useEffect } from "react";

//import project
import MenuGroup from "./MenuGroup/MenuGroup";
import { Box, ListItem, ListItemText, Typography } from '@material-ui/core';
import { Link } from "react-router-dom";
//import icon
import cartIcon from "../../assets/img/icon/cart1.png";
import invoiceIcon from "../../assets/img/icon/invoice.png";
import invoiceReturnIcon from "../../assets/img/icon/invoiceReturn.png";

import importIcon from "../../assets/img/icon/inventory1.png";
import inventoryIcon from "../../assets/img/icon/inventory2.png";
import inventoryOrderIcon from "../../assets/img/icon/inventoryOrder1.png";
import inventoryReturnOrderIcon from "../../assets/img/icon/inventoryReturn.png";
import suplierIcon from "../../assets/img/icon/supplier4.png";
import orderListIcon from "../../assets/img/icon/check1.png";
import checkIcon from "../../assets/img/icon/magnifiers.png";

import employeeIcon from "../../assets/img/icon/employee7.png";
import scheduleIcon from "../../assets/img/icon/schedule3.png";

import historyIcon from "../../assets/img/icon/piggy-bank.png";
import branchIcon from "../../assets/img/icon/branch5.png";
import customerIcon from "../../assets/img/icon/customer.png";
import statisticIcon from "../../assets/img/icon/statistics.png";

import settingIcon from "../../assets/img/icon/setting.png";
import deliveryIcon from "../../assets/img/icon/history3.png";

//ICON
import PaletteOutlinedIcon from "@material-ui/icons/PaletteOutlined";
import DoneOutlinedIcon from "@material-ui/icons/DoneOutlined";

import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import LoyaltyOutlinedIcon from "@material-ui/icons/LoyaltyOutlined";
import RestorePageOutlinedIcon from "@material-ui/icons/RestorePageOutlined";

import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import PlaylistAddOutlinedIcon from "@material-ui/icons/PlaylistAddOutlined";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import LibraryBooksOutlinedIcon from "@material-ui/icons/LibraryBooksOutlined";
import ReceiptOutlinedIcon from "@material-ui/icons/ReceiptOutlined";
import SyncProblemOutlinedIcon from "@material-ui/icons/SyncProblemOutlined";
import AddIcCallOutlinedIcon from "@material-ui/icons/AddIcCallOutlined";
import FindInPageOutlinedIcon from "@material-ui/icons/FindInPageOutlined";
import FindInPageTwoToneIcon from "@material-ui/icons/FindInPageTwoTone";
import ImageSearchOutlinedIcon from "@material-ui/icons/ImageSearchOutlined";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import ExtensionOutlinedIcon from "@material-ui/icons/ExtensionOutlined";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";

import LocalShippingOutlinedIcon from "@material-ui/icons/LocalShippingOutlined";

import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import EventAvailableOutlinedIcon from "@material-ui/icons/EventAvailableOutlined";

import DonutSmallOutlinedIcon from "@material-ui/icons/DonutSmallOutlined";
import LanguageOutlinedIcon from "@material-ui/icons/LanguageOutlined";
import RestoreOutlinedIcon from "@material-ui/icons/RestoreOutlined";
import StorefrontOutlinedIcon from "@material-ui/icons/StorefrontOutlined";

//ICON 2 COLOR
import PaletteTwoToneIcon from "@material-ui/icons/PaletteTwoTone";
import DoneTwoToneIcon from "@material-ui/icons/DoneTwoTone";

import ShoppingCartTwoToneIcon from "@material-ui/icons/ShoppingCartTwoTone";
import LoyaltyTwoToneIcon from "@material-ui/icons/LoyaltyTwoTone";
import RestorePageTwoToneIcon from "@material-ui/icons/RestorePageTwoTone";

import AddCircleTwoToneIcon from "@material-ui/icons/AddCircleTwoTone";
import AddTwoToneIcon from "@material-ui/icons/AddTwoTone";
import PlaylistAddTwoToneIcon from "@material-ui/icons/PlaylistAddTwoTone";
import ThumbUpAltTwoToneIcon from "@material-ui/icons/ThumbUpAltTwoTone";
import LibraryBooksTwoToneIcon from "@material-ui/icons/LibraryBooksTwoTone";
import ReceiptTwoToneIcon from "@material-ui/icons/ReceiptTwoTone";
import SyncProblemTwoToneIcon from "@material-ui/icons/SyncProblemTwoTone";
import AddIcCallTwoToneIcon from "@material-ui/icons/AddIcCallTwoTone";
import ImageSearchTwoToneIcon from "@material-ui/icons/ImageSearchTwoTone";
import SearchTwoToneIcon from "@material-ui/icons/SearchTwoTone";
import ExtensionTwoToneIcon from "@material-ui/icons/ExtensionTwoTone";
import FavoriteTwoToneIcon from "@material-ui/icons/FavoriteTwoTone";

import LocalShippingTwoToneIcon from "@material-ui/icons/LocalShippingTwoTone";

import AccountCircleTwoToneIcon from "@material-ui/icons/AccountCircleTwoTone";
import EventAvailableTwoToneIcon from "@material-ui/icons/EventAvailableTwoTone";

import DonutSmallTwoToneIcon from "@material-ui/icons/DonutSmallTwoTone";
import LanguageTwoToneIcon from "@material-ui/icons/LanguageTwoTone";
import RestoreTwoToneIcon from "@material-ui/icons/RestoreTwoTone";
import StorefrontTwoToneIcon from "@material-ui/icons/StorefrontTwoTone";

const icons = {
  PaletteOutlinedIcon,
  LoyaltyOutlinedIcon,
  DoneOutlinedIcon,
  DonutSmallOutlinedIcon,
  LanguageOutlinedIcon,
  RestorePageOutlinedIcon,
  RestoreOutlinedIcon,
  StorefrontOutlinedIcon,
  AccountCircleOutlinedIcon,
  EventAvailableOutlinedIcon,
  LocalShippingOutlinedIcon,
  SearchOutlinedIcon,
  AddIcCallOutlinedIcon,
  RestorePageOutlinedIcon,
  ShoppingCartOutlinedIcon,
  ReceiptOutlinedIcon,
  FavoriteBorderOutlinedIcon,
  ExtensionOutlinedIcon,
  SyncProblemOutlinedIcon,
  ThumbUpAltOutlinedIcon,
  PlaylistAddOutlinedIcon,
  AddOutlinedIcon,
  AddCircleOutlineOutlinedIcon,
  LibraryBooksOutlinedIcon,
  ImageSearchOutlinedIcon,
  FindInPageOutlinedIcon,
};
const icons1 = {
  PaletteTwoToneIcon,
  LoyaltyTwoToneIcon,
  DoneTwoToneIcon,
  DonutSmallTwoToneIcon,
  LanguageTwoToneIcon,
  RestorePageTwoToneIcon,
  RestoreTwoToneIcon,
  StorefrontTwoToneIcon,
  AccountCircleTwoToneIcon,
  EventAvailableTwoToneIcon,
  LocalShippingTwoToneIcon,
  SearchTwoToneIcon,
  AddIcCallTwoToneIcon,
  RestorePageTwoToneIcon,
  ShoppingCartTwoToneIcon,
  ReceiptTwoToneIcon,
  FavoriteTwoToneIcon,
  LibraryBooksTwoToneIcon,
  ExtensionTwoToneIcon,
  SyncProblemTwoToneIcon,
  ThumbUpAltTwoToneIcon,
  PlaylistAddTwoToneIcon,
  AddTwoToneIcon,
  AddCircleTwoToneIcon,
  ImageSearchTwoToneIcon,
  FindInPageTwoToneIcon,
};

export const salesModule = {
  title: "Bán hàng",
  key: "salesModule",
  children: [
    {
      id: 1,
      title: "Bán Hàng",
      key: "Bán Hàng",
      url: "/home/sales/cart",
      icon: (
        <Box
          component="img"
          sx={{ height: 24, width: 24 }}
          src={cartIcon}
          style={{ marginLeft: -10 }}
        />
      ),
      iconColor: cartIcon,
      icon1: icons.ShoppingCartOutlinedIcon,
      icon2: icons1.ShoppingCartTwoToneIcon,
    },
    {
      id: 2,
      title: "Hóa Đơn",
      key: "Hóa Đơn",
      url: "/home/sales/invoice",
      icon: (
        <Box
          component="img"
          sx={{ height: 24, width: 24 }}
          src={invoiceIcon}
          style={{ marginLeft: -10 }}
        />
      ),
      iconColor: invoiceIcon,
      icon1: icons.LoyaltyOutlinedIcon,
      icon2: icons1.LoyaltyTwoToneIcon,
    },
    {
      id: 3,
      title: "Đơn Trả",
      key: "Đơn Trả",
      url: "/home/sales/invoice-return",
      icon: (
        <Box
          component="img"
          sx={{ height: 24, width: 24 }}
          src={invoiceReturnIcon}
          style={{ marginLeft: -10 }}
        />
      ),
      iconColor: invoiceReturnIcon,
      icon1: icons.RestorePageOutlinedIcon,
      icon2: icons1.RestorePageTwoToneIcon,
    },
    {
      id: 22,
      title: "Đặt Hàng",
      key: "Đặt Hàng",
      url: "/home/sales/order-list",
      icon: (
        <Box
          component="img"
          sx={{ height: 24, width: 24 }}
          src={orderListIcon}
          style={{ marginLeft: -10 }}
        />
      ),
      iconColor: orderListIcon,
      icon1: icons.AddIcCallOutlinedIcon,
      icon2: icons1.AddIcCallTwoToneIcon,
    },
  ],
};

export const inventoryModule = {
  title: "Kho Hàng",
  key: "inventoryModule",
  children: [
    {
      id: 4,
      title: "Nhập Hàng",
      key: "Nhập Hàng",
      url: "/home/inventory/import",
      icon: (
        <Box
          component="img"
          sx={{ height: 24, width: 24 }}
          src={importIcon}
          style={{ marginLeft: -10 }}
        />
      ),
      iconColor: importIcon,
      icon1: icons.AddCircleOutlineOutlinedIcon,
      icon2: icons1.AddCircleTwoToneIcon,
    },
    {
      id: 5,
      title: "Sản phẩm",
      key: "Sản phẩm",
      url: "/home/inventory/inventory",
      icon: (
        <Box
          component="img"
          sx={{ height: 24, width: 24 }}
          src={inventoryIcon}
          style={{ marginLeft: -10 }}
        />
      ),
      iconColor: inventoryIcon,
      icon1: icons.ThumbUpAltOutlinedIcon,
      icon2: icons1.ThumbUpAltTwoToneIcon,
    },
    {
      id: 6,
      title: "Đơn Nhập Hàng",
      key: "Đơn Nhập Hàng",
      url: "/home/inventory/receipt",
      icon: (
        <Box
          component="img"
          sx={{ height: 24, width: 24 }}
          src={inventoryOrderIcon}
          style={{ marginLeft: -10 }}
        />
      ),
      iconColor: inventoryOrderIcon,
      icon1: icons.LibraryBooksOutlinedIcon,
      icon2: icons1.LibraryBooksTwoToneIcon,
    },
    {
      id: 7,
      title: "Đơn Trả Hàng Nhập",
      key: "Đơn Trả Hàng Nhập",
      url: "/home/inventory/returns",
      icon: (
        <Box
          component="img"
          sx={{ height: 24, width: 24 }}
          src={inventoryReturnOrderIcon}
          style={{ marginLeft: -10 }}
        />
      ),
      iconColor: inventoryReturnOrderIcon,
      icon1: icons.SyncProblemOutlinedIcon,
      icon2: icons1.SyncProblemTwoToneIcon,
    },
    {
      id: 9,
      title: "Đơn chuyển kho",
      key: "Đơn chuyển kho",
      url: "/home/inventory/transfer-inventory",
      icon: (
        <Box
          component="img"
          sx={{ height: 24, width: 24 }}
          src={deliveryIcon}
          style={{ marginLeft: -10 }}
        />
      ),
      iconColor: deliveryIcon,
      icon1: icons.AddIcCallOutlinedIcon,
      icon2: icons1.AddIcCallTwoToneIcon,
    },
    {
      id: 11,
      title: "Kiểm Kho",
      key: "Kiểm Kho",
      url: "/home/inventory/check-history",
      icon: (
        <Box
          component="img"
          sx={{ height: 24, width: 24 }}
          src={checkIcon}
          style={{ marginLeft: -10 }}
        />
      ),
      iconColor: checkIcon,
      icon1: icons.FindInPageOutlinedIcon,
      icon2: icons1.FindInPageTwoToneIcon,
    },
    {
      id: 12,
      title: "Nhà Cung Cấp",
      key: "Nhà Cung Cấp",
      url: "/home/inventory/supplier",
      icon: (
        <Box
          component="img"
          sx={{ height: 24, width: 24 }}
          src={suplierIcon}
          style={{ marginLeft: -10 }}
        />
      ),
      iconColor: suplierIcon,
      icon1: icons.ExtensionOutlinedIcon,
      icon2: icons1.ExtensionTwoToneIcon,
    },
  ],
};
export const deliveryModule = {
  title: "Giao hàng",
  children: [
    {
      id: 13,
      title: "Đơn giao hàng",
      key: "Đơn giao hàng",
      url: "/home/delivery/delivery",
      icon: (
        <Box
          component="img"
          sx={{ height: 24, width: 24 }}
          src={deliveryIcon}
          style={{ marginLeft: -10 }}
        />
      ),
      iconColor: deliveryIcon,
      icon1: icons.LocalShippingOutlinedIcon,
      icon2: icons1.LocalShippingTwoToneIcon,
    },
  ],
};
export const hrModule = {
  title: "Nhân Sự",
  key: "hrModule",
  children: [
    {
      id: 14,
      title: "Nhân Viên",
      key: "Nhân Viên",
      url: "/home/hr/employee",
      icon: (
        <Box
          component="img"
          sx={{ height: 24, width: 24 }}
          src={employeeIcon}
          style={{ marginLeft: -10 }}
        />
      ),
      iconColor: employeeIcon,
      icon1: icons.AccountCircleOutlinedIcon,
      icon2: icons1.AccountCircleTwoToneIcon,
    },
    {
      id: 15,
      title: "Ca Làm Việc",
      key: "Ca Làm Việc",
      url: "/home/hr/schedule",
      icon: (
        <Box
          component="img"
          sx={{ height: 24, width: 24 }}
          src={scheduleIcon}
          style={{ marginLeft: -10 }}
        />
      ),
      iconColor: scheduleIcon,
      icon1: icons.EventAvailableOutlinedIcon,
      icon2: icons1.EventAvailableTwoToneIcon,
    },
  ],
};
export const manual = {
  title: "HDSD",
  key: "manual",
  url: "/home/manual",
  children: [],
};

export const reportModule = {
  title: "Quản Lý",
  key: "reportModule",

  children: [
    {
      id: 16,
      title: "Lịch Sử Hoạt Động",
      key: "Lịch Sử Hoạt Động",
      url: "/home/manager/history",
      icon: (
        <Box
          component="img"
          sx={{ height: 24, width: 24 }}
          src={historyIcon}
          style={{ marginLeft: -10 }}
        />
      ),
      iconColor: historyIcon,
      icon1: icons.RestoreOutlinedIcon,
      icon2: icons1.RestoreTwoToneIcon,
    },
    {
      id: 17,
      title: "Cửa Hàng",
      key: "Cửa Hàng",
      url: "/home/manager/branch",
      icon: (
        <Box
          component="img"
          sx={{ height: 24, width: 24 }}
          src={branchIcon}
          style={{ marginLeft: -10 }}
        />
      ),
      iconColor: branchIcon,
      icon1: icons.StorefrontOutlinedIcon,
      icon2: icons1.StorefrontTwoToneIcon,
    },
    {
      id: 18,
      title: "Khách Hàng",
      key: "Khách Hàng",
      url: "/home/manager/customer",
      icon: (
        <Box
          component="img"
          sx={{ height: 24, width: 24 }}
          src={customerIcon}
          style={{ marginLeft: -10 }}
        />
      ),
      iconColor: customerIcon,
      icon1: icons.FavoriteBorderOutlinedIcon,
      icon2: icons1.FavoriteTwoToneIcon,
    },
    {
      id: 19,
      title: "Cài đặt",
      key: "Cài đặt",
      url: "/home/manager/setting",
      icon: (
        <Box
          component="img"
          sx={{ height: 24, width: 24 }}
          src={settingIcon}
          style={{ marginLeft: -10 }}
        />
      ),
      // icon: webIcon,
      iconColor: settingIcon,
      icon1: icons.LanguageOutlinedIcon,
      icon2: icons1.LanguageTwoToneIcon,
      children: [
        {
          id: 19.1,
          title: "Cài đặt chung",
          key: "Cài đặt chung",
          url: "/home/manager/setting",
        },
        {
          id: 19.2,
          title: "Khuyến mãi",
          key: "Khuyến mãi",
          url: "/home/manager/setting-discount",
          disabled: false,
        },
        {
          id: 19.3,
          title: "Voucher",
          key: "Voucher",
          url: "/home/manager/setting-voucher",
          disabled: false,
        },
        {
          id: 19.4,
          title: "Mẫu email",
          key: "Mẫu email",
          url: "/home/manager/setting-email",
          disabled: false,
        },
        {
          id: 19.5,
          title: "Trang web",
          key: "Trang web",
          url: "/home/manager/setting-web",
        },
      ],
    },
    {
      id: 20.1,
      title: "Thống Kê",
      title: "Thống Kê",
      url: "/home/manager/end-date-report",
      icon: (
        <Box
          component="img"
          sx={{ height: 24, width: 24 }}
          src={statisticIcon}
          style={{ marginLeft: -10 }}
        />
      ),
      iconColor: statisticIcon,
      icon1: icons.DonutSmallOutlinedIcon,
      icon2: icons1.DonutSmallTwoToneIcon,
      children: [
        // { id: 20.1, title: "Tổng quan", url: "/home/manager/report" },
        {
          id: 20.2,
          title: "Sổ quỹ",
          key: "Sổ quỹ",
          url: "/home/manager/cashbook",
        },

        // { id: 20.8, title: "Tổng quan", url: "/home/manager/general-report" },
        {
          id: 20.3,
          title: "Báo cáo cuối ngày",
          key: "Báo cáo cuối ngày",
          url: "/home/manager/end-date-report",
        },
        {
          id: 20.9,
          title: "Doanh thu",
          key: "Doanh thu",
          url: "/home/manager/income-report",
        },
        {
          id: 20.4,
          title: "Hàng hoá",
          key: "Hàng hoá",
          url: "/home/manager/product-report",
        },
        {
          id: 20.5,
          title: "Khách hàng",
          key: "Khách hàng",
          url: "/home/manager/customer-report",
        },
        {
          id: 20.6,
          title: "Nhân viên",
          key: "Nhân viên",
          url: "/home/manager/employee-report",
        },
        {
          id: 20.7,
          title: "Nhà cung cấp",
          key: "Nhà cung cấp",
          url: "/home/manager/supplier-report",
        },
        {
          id: 20.1,
          title: "Chi nhánh",
          key: "Chi nhánh",
          url: "/home/manager/branch-report",
        },
        {
          id: 20.11,
          title: "Tài chính (lãi lỗ)",
          key: "Tài chính (lãi lỗ)",
          url: "/home/manager/financial-report",
        },
        {
          id: 21.11,
          title: "Biểu đồ cá nhân hoá",
          key: "Biểu đồ cá nhân hoá",
          url: "/home/manager/metabase",
        },
      ],
    },
  ],
};

// const menuItems = {
//   items: [salesModule, inventoryModule, deliveryModule, hrModule, reportModule],
// };

const MenuList = ({ permissions }) => {
  // const navItems = menuItems.items.map((item) => {
  //     return <MenuGroup  item={item} />;
  // });
  console.log("---------permissions", permissions)
  useEffect(() => {}, [permissions]);
  return (
    <>
      {permissions?.find((p) => p.name === "sales") && (
        <MenuGroup item={salesModule} />
      )}
      {permissions?.find((p) => p.name === "inventory") && (
        <MenuGroup item={inventoryModule} />
      )}
      {permissions?.find((p) => p.name === "employee") && (
        <MenuGroup item={hrModule} />
      )}
      {permissions?.find((p) => p.name === "report") && (
        <MenuGroup item={reportModule} />
      )}
      <ListItem to={manual.url} button component={Link}>
        <ListItemText
          primary={<Typography variant="caption">HDSD</Typography>}
        />
      </ListItem>
    </>
  );

  // return navItems;
};

export default MenuList;
