import React, { useEffect, useState } from "react";
import {
  useTheme,
  withStyles,
} from "@material-ui/core/styles";
import {
  Button,
  Typography,
  CardHeader,
  IconButton,
  Collapse,
  TextField,
  Card,
  Grid,
  Tooltip,
  Box,
  Switch,
  ListItem,
} from "@material-ui/core";
import ColorPicker from "../../../../components/ColorPicker/ColorPicker"
import LanguageIcon from "@material-ui/icons/Language";
import LinkIcon from "@material-ui/icons/Link";
import ModalWrapperWithClose from "../../../../components/Modal/ModalWrapperWithClose";
import { grey } from "@material-ui/core/colors";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
// import NavBar from "../../../../pages/CustomerPage/NavBar/"
import NavBarSetting from "./NavBarSetting";
import ProductSetting from "./ProductSetting";
import MainPageSetting from "./MainPageSetting"
import FooterSetting from "./FooterSetting"
import OrderManagement from "./OrderManagement"
import { useStyles } from "./style";
import { useSelector ,useDispatch} from "react-redux";
import storeApi from "../../../../api/storeApi";
import openNotification from "../../../../components/StatusPopup/StatusPopup";
import CartSetting from "./CartSetting"
import { Link } from "react-router-dom";
import { customizeAction } from "../../../../store/slice/customizeSlice";
import DetailSetting from "./DetailSetting"
import { error } from '../../../../components/StatusModal/StatusModal';

const WebSetting = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const domainName ="https://www.cuahangcuatoi.net/#/store/";
  // redux 
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  // const branches = info.branchsOfStore
  const branches = info.store.branches

  const webInfo = {
    webAddress: "",
    status: "inactive",
    orderManagement:{
      branchOption:'default',
      branchDefault: branches?  branches[0]?.id:null,
      // branchDefault: null,
      orderWhenOutOfSctock:false,
    },
    mainColor: { r: "250", g: "140", b: "22", a: "1", hex: "#fa8c16" }, //#f2a5ae , //#fa8c16"       // mainColor: {  r: '242', g: '165', b: '174',  a: '1', hex:'#fa8c16'},
    bgColor: { r: "255", g: "255", b: "255", a: "1", hex: "#ffffff" },
    navBar: {
      buttonLogin: "0", // 0: nut, 1:icon
      buttonCart: "0", //0: special, 1: normal
      navColor: "1", //0:white, 1- maincolor
      textNav: ["1", 17, 600], //0-left 1-right //color: black-white-grey-maincolor, size: small - large(16):,  bold:no() -yes (600)
    },
    listProduct: {
      priceStyle: ["0", 18, 400], //0-left 1-right //color: normal-maincolor , size: small - large(16), bold:no() -yes (600)
      nameStyle: ["0", 19, 600], //0-left 1-right //color: normal-maincolor , size: small - large(16), bold:no() -yes (600), maxNumberOFline: 1-2
      btnStyle: ["1", "0"], //0-left 1-right //haveBtn: no-yes, style:circle - box
      isBox: "1",
      isMargin: "0",
      border: "1",
      alignCenter:"0",
      marginContainer: 4,
      boxDistance: 1,
    },
    cart:{
      summaryPosition:'right',
      header:"show"
    },
    other:{
      status:false,
      detail:{
        id:"f9yq8g",
        rows:[],
        version:1
      },
    },
    detailPage:{
      priceStyle: ["0", 24, 700],
      nameStyle: ["0", 34, 700],
    },
    mainPage:{
      showbestSeller:true,
      numberTopBestSeller:10,
      showNewArrival:false,
      numberTopNewArrival:10,
      showDiscount:false
    },
    footer:{
      color:'0',
      bgColor:{ r: "0", g: "0", b: "0", a: "1", hex: "#000000" },
      btnType:'0',
      showSocial:false

    }
  };
  const [web, setWeb] = React.useState(webInfo);
  const [images, setImages] = useState([]);
  const [display, setDisplay] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const [displayColorPicker, setDisplayColorPicker] = React.useState(false);
  const [displayColorPicker1, setDisplayColorPicker1] = React.useState(false);
  const [openLinkWarningPopup, seOpenLinkWarningPopup] = React.useState(false);
  const dispatch = useDispatch();

  // var logoStore =  "https://cdn.mykiot.vn/2021/11/c3fa6fc1ceef1d611cd9c7ed256db621e1814ba175dd832a37ffb6cc8e43bd6d.jpg";
  let haveNotActiveBefore = false
  const [logoStore,setLogoStore] = useState(null)
  const [ show_OrderManagement_canOrderWhenOutOfSctock_Status , setShow_OrderManagement_canOrderWhenOutOfSctock_Status] = useState(true)
  useEffect(() => {
    const loadData = async () => {
      const response = await storeApi.getStoreInfo(store_uuid);
     
      if (response.data.web_configuration) {
        setWeb(JSON.parse(response.data.web_configuration));
        // setLogoStore(JSON.parse(response.data.store_configuration).img_url)

        const bannerUrls = JSON.parse(response.data.banners ? response.data.banners : "[]")?.map((url, i) => ({
          index: i,
          link: url,
          isUrl: true,
        }));
        setDisplay(bannerUrls);
      }else{
        haveNotActiveBefore = true
      }
      if(response.data.general_configuration){
        setShow_OrderManagement_canOrderWhenOutOfSctock_Status(JSON.parse(response.data.general_configuration).inventory.status)
      }
      if (response.data.store_configuration) {
        setLogoStore(JSON.parse(response.data.store_configuration).img_url)
      }
    };

    if (store_uuid) {
      loadData();
    }
  }, [store_uuid]);

  useEffect(() => {
    console.log('banner iamge', images);
    console.log('display', display)
  }, [images, display])

  // 1.
  const handleWebAddress = (e) => {
    var newWeb = { ...web };
    newWeb.webAddress = e.target.value;
    setWeb(newWeb);
  };

  const openLinkTab = () => {
    if (web.status === "active" ) {
      window.open(domainName + web.webAddress);
    } else {
      seOpenLinkWarningPopup(true);
    }
  };

  // 2.
  const handleChangeMainColor = (color) => {
    var newWeb = { ...web };
    console.log(color.rgb);
    newWeb.mainColor.r = color.rgb.r;
    newWeb.mainColor.g = color.rgb.g;
    newWeb.mainColor.b = color.rgb.b;
    newWeb.mainColor.a = color.rgb.a;
    newWeb.mainColor.hex = color.hex;
    setWeb(newWeb);
  };
  const handleChangeBgColor = (color) => {
    var newWeb = { ...web };
    newWeb.bgColor.r = color.rgb.r;
    newWeb.bgColor.g = color.rgb.g;
    newWeb.bgColor.b = color.rgb.b;
    newWeb.bgColor.a = color.rgb.a;
    newWeb.bgColor.hex = color.hex;
    setWeb(newWeb);
  };

  // 3.
  const [expandedNavBar, setExpandedNavBar] = React.useState(false);
  const [expandedListProduct, setExpandedListProduct] = React.useState(false);
  const [expandedDetailProduct, setExpandedDetailProduct] =  React.useState(false);
  const [expandedCart, setExpandedCart] = React.useState(false);
  const [expandedMainPage, setExpandedMainPage] = React.useState(false);
  const [expandedOther, setExpandedOther] = React.useState(false);
  const [expandedFooter, setExpandedFooter] = React.useState(false);

  
  const handleChangeOrderManagement = (event) => {
    const { name, value } = event.target;

    setWeb((prevState) => {
      return {
        ...prevState,
        orderManagement: {
          ...prevState["orderManagement"],
          [name]: value,
        },
      };
    });
  };

  const handleChangeNavBar = (event) => {
    const { name, value } = event.target;
    setWeb((prevState) => {
      return {
        ...prevState,
        navBar: {
          ...prevState["navBar"],
          [name]: value,
        },
      };
    });
  };
  const handleChangeListProduct = (event) => {
    const { name, value } = event.target;
   setWeb((prevState) => {
      return {
        ...prevState,
        listProduct: {
          ...prevState["listProduct"],
          [name]: value,
        },
      };
    });
  };
  const handleChangeCart = (event) => {
    const { name, value } = event.target;
    setWeb((prevState) => {
      return {
        ...prevState,
        cart: {
          ...prevState["cart"],
          [name]: value,
        },
      };
    });
  };

  const handleChangeMainPage = (event) => {
    const { name, value } = event.target;
    setWeb((prevState) => {
      return {
        ...prevState,
        mainPage: {
          ...prevState["mainPage"],
          [name]: value,
        },
      };
    });
  };
  const handleChangeFooter = (event) => {
    const { name, value } = event.target;
    setWeb((prevState) => {
      return {
        ...prevState,
        footer: {
          ...prevState["footer"],
          [name]: value,
        },
      };
    });
  };
  

  return (
    <Card className={classes.root}>
      <Grid container direction="row" alignItems="center">
          <Typography className={classes.headerTitle} variant="h2" style={{marginRight:-50}}>
            Trang web
          </Typography>
          <Button variant='contained'size='small' color='primary' 
          onClick={()=>{
             if(web.status === "inactive"){
                  // if(web.webAddress.length === 0) {
                    if(haveNotActiveBefore) {
                    error("Chưa cài đặt địa chỉ trang web"," Cài đặt trang web và lưu thay đổi trước khi kích hoạt trang web");   
                  }else{
                    try {
                      var newWeb = { ...web };
                      newWeb.status = 'active';
                      setWeb(newWeb);
                      const response = storeApi.updateStoreInfo(store_uuid, {
                        web_configuration: JSON.stringify(newWeb),
                      });
                      openNotification("success", "Kích hoạt thành công");
                    } catch (err) {
                      console.log(err);
                      openNotification("success", "Kích hoạt thất bại");
                    }
                  }
                 
             }else{
                  try {
                    var newWeb = { ...web };
                    newWeb.status = 'inactive';
                    setWeb(newWeb);
                    const response = storeApi.updateStoreInfo(store_uuid, {
                      web_configuration: JSON.stringify(newWeb),
                    });
                    openNotification("success", "Ngưng kích hoạt thành công");
                  } catch (err) {
                    console.log(err);
                    openNotification("success", "Ngưng kích hoạt thất bại");
                  }
             }
        }}
            >
           {web.status === "inactive"?  "Kích hoạt" : "Ngưng kích hoạt"  }
          </Button>
      </Grid>

      {/* 1.Địa chỉ trang web */}
      <Typography
        style={{ fontWeight: 500, marginRight: 10, marginBottom: 10 }}
      >
        Địa chỉ trang web:{" "}
      </Typography>
      <div
        style={{
          display: "flex",
          height: 45,
          marginBottom: 20,
          border: "1px solid #b8b8b8",
          borderRadius: 15,
          padding: 1,
          alignItems: "center",
        }}
      >
        <LanguageIcon style={{ color: grey[700], margin: 10 }} />
        <Typography>{domainName}</Typography>
        <input
          value={web.webAddress}
          onChange={(e) => {
            handleWebAddress(e);
          }}
          placeholder="ĐIỀN_TÊN_CỬA_HÀNG"
          style={{
            border: 0,
            outline: 0,
            color: theme.customization.primaryColor[500],
            fontWeight: 700,
          }}
        />

        <Grid item container direction="row" justifyContent="flex-end">
          <Tooltip title="Xem trang web">
            <LinkIcon
              style={{ textAlign: "left", marginRight: 10 }}
              onClick={() => openLinkTab()}
            />
          </Tooltip>
        </Grid>
      </div>

      {openLinkWarningPopup ? (
        <ModalWrapperWithClose
          title="Lỗi trang web"
          open={openLinkWarningPopup}
          handleClose={() => {
            seOpenLinkWarningPopup(false);
          }}
        >
          Trang web khách hàng chưa được tạo hoặc đang trong trạng thái không
          kích hoạt.
        </ModalWrapperWithClose>
      ) : null}

      {/*1. Tồn kho */}
      <OrderManagement 
       web={web}
       handleChangeOrderManagement={handleChangeOrderManagement}
       setWeb={setWeb}
       showOutOfStock={show_OrderManagement_canOrderWhenOutOfSctock_Status}
      />

     
    
      {/* 2.Tổng quan */}
      <ColorPicker title={"Màu chính"} mainColor={web.mainColor}  handleChangeMainColor={handleChangeMainColor} displayColorPicker={displayColorPicker} setDisplayColorPicker={setDisplayColorPicker}/>
      <ColorPicker title={"Màu nền"} mainColor={web.bgColor}  handleChangeMainColor={handleChangeBgColor} displayColorPicker={displayColorPicker1} setDisplayColorPicker={setDisplayColorPicker1}/>


     
      {/* 3.Thanh công cụ*/}
      <SettingCollapse
        title="Thanh công cụ"
        expand={expandedNavBar}
        setExpanded={setExpandedNavBar}
      >
        <NavBarSetting
          web={web}
          handleChangeNavBar={handleChangeNavBar}
          logo={logoStore}
          setWeb={setWeb}
        />
      </SettingCollapse>

       {/*7. Trang chính */}
       <SettingCollapse
        title="Trang chủ"
        expand={expandedMainPage}
        setExpanded={setExpandedMainPage}
      >
        <MainPageSetting
          web={web} handleChangeNavBar={handleChangeMainPage} setWeb={setWeb}
          images={images} setImages={setImages} display={display} setDisplay={setDisplay} imageURL={imageURL} setImageURL={setImageURL}
        />
      </SettingCollapse>
      {/*4. Danh sách sản phẩm */}
      <SettingCollapse
        title="Danh sách sản phẩm"
        expand={expandedListProduct}
        setExpanded={setExpandedListProduct}
      >
        <ProductSetting
          web={web}
          handleChangeListProduct={handleChangeListProduct}
          setWeb={setWeb}
        />
      </SettingCollapse>
      {/*5. Chi tiết sản phẩm */}
      <SettingCollapse
        title="Chi tiết sản phẩm"
        expand={expandedDetailProduct}
        setExpanded={setExpandedDetailProduct}
      >
        <DetailSetting web={web} setWeb={setWeb}/>
      </SettingCollapse>

      {/*6. Giỏ hàng */}
      <SettingCollapse
        title="Giỏ hàng"
        expand={expandedCart}
        setExpanded={setExpandedCart}
      >
       <CartSetting 
       web={web}
       setWeb={setWeb}
       handleChangeCart={handleChangeCart}
       />
      </SettingCollapse>

        {/*6. Footer */}
        <SettingCollapse
        title="Footer"
        expand={expandedFooter}
        setExpanded={setExpandedFooter}
      >
       <FooterSetting 
          web={web}
          setWeb={setWeb}
          handleChangeFooter={handleChangeFooter}
       />
      </SettingCollapse>

      {/*6. Khác */}
      <SettingCollapse
        title="Khác"
        expand={expandedOther}
        setExpanded={setExpandedOther}
      >
       {/* <CartSetting 
       web={web}
       setWeb={setWeb}
       /> */}
       
       <ListItem style={{margin:0, padding:0, marginBottom:10}}>
        <Typography style={{fontWeight:500, marginRight:20, color:"#000",fontSize:15}}>Trang "Giới thiệu": </Typography>
        <Switch checked={web.other.status} onChange={()=>{
            let newWeb = {...web}
            newWeb.other.status = !newWeb.other.status
            setWeb(newWeb)
        }}
        />
    </ListItem>  
    <Button variant='contained' color='primary'  component={Link} to={'/home/manager/aboutus-setting'} onClick={()=> {dispatch(customizeAction.setSidebarOpen(false));}}>Tạo giao diện</Button>


      
      {/* <AbousUsSetting   web={web}  setWeb={setWeb} 
      /> */}
      
      </SettingCollapse>

     

      <Box  style={{flexGrow:1, textAlign:'right'}}>
      <Button
        variant='contained'
        color='primary'
        onClick={async () => {
          try {
            if(web.webAddress.length === 0) {
              error("Tên địa chỉ trang web trống"," Chưa cài đặt địa chỉ trang web. Cài đạt trang web và lưu thay đổi trước khi kích hoạt trang web");
            }else{
              var bodyFormData = new FormData();
              bodyFormData.append("web_configuration", JSON.stringify(web));
              images.forEach((image) => bodyFormData.append("images[]", image));
              display.filter(image => image.isUrl).forEach(image => bodyFormData.append("img_urls[]", image.link))
              const response = storeApi.updateStoreInfo(store_uuid, bodyFormData);
              // CHECK TÊN NÀY TỒN TẠI CHƯA
              openNotification("success", "Lưu cài đặt chung thành công");
              // setWebNameBeforeSave(web.webAddress)
              haveNotActiveBefore = true
            }
            
          } catch (err) {
            console.log(err);
            openNotification("success", "Lưu cài đặt chung thất bại");
          }
        }}
      >
        Lưu thay đổi
      </Button>
      </Box>
    </Card>
  );
};

export default WebSetting;

const SettingCollapse = (props) => {
  const { expand, setExpanded, title } = props;
  const theme = useTheme();
  const classes = useStyles(theme);

  return (
    <Card className={classes.attrCard}>
      <CardHeader
        onClick={() => setExpanded(!expand)}
        action={
          <IconButton
            size="small"
            className={clsx(classes.expand, {
              [classes.expandOpen]: expand,
            })}
            onClick={() => setExpanded(!expand)}
          >
            <ExpandMoreIcon />
          </IconButton>
        }
        title={title}
        className={classes.attrHead}
      />
      <Collapse
        in={expand}
        timeout="auto"
        unmountOnExit
        style={{ padding: 10 }}
      >
        {props.children}
      </Collapse>
    </Card>
  );
};

export const CustomTextField = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderRadius: 14,
      },
    },
  },
})(TextField);

