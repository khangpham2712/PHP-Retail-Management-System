import React, { useState, useEffect, useRef  } from "react";
import { useTheme, makeStyles, styled } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import PageNotFound from "../PageNotFound/PageNotFound";

//import library
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core";

import NavBar from "./NavBar/NavBar";
import MainPage from "./MainPage/MainPage";
import ProductPage from "./ProductPage/ProductPage";
import DetailPage from "./ProductPage/DetailPage/DetailPage";
import CartButton from "../../components/Button/CartButton";
import Footer from "./Footer/Footer";
import StorePage from "./StorePage/StorePage";
import AboutUsPage from "./AboutUsPage/AboutUsPage";
import PromotionPage from "./PromotionPage/PromotionPage";
import CartPage from "./CartPage/CartPage";
import customerPageApi from "../../api/customerPageApi";
import { useParams } from "react-router-dom";
import webSetting from "../../assets/constant/webInfo";
import {useDispatch, useSelector} from 'react-redux';
import {customerPageActions} from '../../store/slice/customerPageSlice'
import {  Typography } from "@mui/material";
import { ColorButton } from "../../components/Button/ColorButton";
import SimpleModal from "../../components/Modal/ModalWrapper";
const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.default,
  },
}));

const CustomerPage = () => {
  let { url } = useRouteMatch();
  let { storeWebPage } = useParams();

  const theme = useTheme();
  const classes = useStyles(theme);
  const dispatch = useDispatch()

  const {categories, products, storeInfo,order} = useSelector(state => state.customerPage)

  const storeSetting = storeInfo.store_configuration ? JSON.parse(storeInfo.store_configuration) : null
  // var logoStore = storeSetting?.img_url ?  storeSetting.img_url : "https://cdn.mykiot.vn/2021/11/c3fa6fc1ceef1d611cd9c7ed256db621e1814ba175dd832a37ffb6cc8e43bd6d.jpg"
  var logoStore = storeSetting?.img_url ?  storeSetting.img_url :null

  const [webInfo, setWebInfo] = useState(webSetting)

  useEffect(() => {
    if (!storeWebPage) {
      return;
    }
    let JSONdata = localStorage.getItem(storeWebPage);
    const data = JSON.parse(JSONdata)
    
      if(data){
          dispatch(customerPageActions.setStoreInfo(data.storeInfo))
          dispatch(customerPageActions.setCategories(data.categories));
          dispatch(customerPageActions.setProducts(data.products))
      }
    const fetchStore = async () => {
      try {
        const res = await customerPageApi.storeInfo(storeWebPage);
        setWebInfo(JSON.parse(res.data.web_configuration))
        dispatch(customerPageActions.setStoreInfo(res.data))
        const data = await Promise.all([customerPageApi.storeCategroies(res.data.uuid), 
          customerPageApi.storeProducts(res.data.uuid)]
        )
        dispatch(customerPageActions.setCategories(data[0].data ? data[0].data : []));
        dispatch(customerPageActions.setProducts(data[1].data ? data[1].data : []));

        const  webSetting = JSON.parse(res.data.web_configuration)

        if(webSetting.orderManagement.branchOption==='choose'&& res.data.branches.length > 1 && !webSetting.orderManagement.orderWhenOutOfSctock && !localStorage.getItem(res.data.uuid)){
            setOpenPopUpChooseBranch(true)
        }
        localStorage.setItem(storeWebPage,JSON.stringify({
          storeInfo:res.data,
          products:data[1].data ? data[1].data : [],
          order:localStorage.getItem(storeWebPage) ?localStorage.getItem(storeWebPage).order :  { name: "", phone: "", address: "", cartItem: [], branch_id: 57},
          categories:data[0].data ? data[0].data : []
        }));
      } catch (err) {
        alert("Trang web chưa được kích hoạt");
        localStorage.removeItem(storeWebPage);
      }

    };
    fetchStore();
  }, []);

    const changeBranch = async () => {
      const res = await customerPageApi.storeInfo(storeWebPage);
      setWebInfo(JSON.parse(res.data.web_configuration))
      dispatch(customerPageActions.setStoreInfo(res.data))

      const data = await Promise.all([customerPageApi.storeCategroies(res.data.uuid), 
        customerPageApi.storeProducts(res.data.uuid)]
      )
      dispatch(customerPageActions.setCategories(data[0].data ? data[0].data : []));
      dispatch(customerPageActions.setProducts(data[1].data ? data[1].data : []));
      localStorage.setItem(storeWebPage,JSON.stringify({
        storeInfo:res.data,
        products:data[1].data ? data[1].data : [],
        order:localStorage.getItem(storeWebPage) ?localStorage.getItem(storeWebPage).order :  { name: "", phone: "", address: "", cartItem: [], branch_id: 57},
        categories:data[0].data ? data[0].data : []
      }));
    };
  
  const number = order.cartItem.reduce((partialSum, a) => partialSum + a.quantity, 0)

  const branches = storeInfo.branches
  // const {selectedBranch, setSelectedBranch} = useState(null);

  const [openPopUpChooseBranch , setOpenPopUpChooseBranch] = useState(false)


  const mainColor =  `rgba(${ webInfo.mainColor.r }, ${ webInfo.mainColor.g }, ${ webInfo.mainColor.b }, ${webInfo.mainColor.a })`


  if (storeWebPage) {
  return (<div className={classes.root}>

    {openPopUpChooseBranch ?
    <PopUpChoooseBranch  changeBranch={changeBranch} openPopUpChooseBranch={openPopUpChooseBranch}  setOpenPopUpChooseBranch={setOpenPopUpChooseBranch} branches={branches} mainColor={mainColor}/>
    :null}

    <NavBar
    changeBranch={changeBranch}
      storeInfo={storeInfo}
      category={categories ? categories : []}
      number={number !==0  ?number:"0"}
      logo={logoStore}
      webInfo={webInfo}
    />
    {parseInt(webInfo.navBar.buttonCart) === 0 ?
     <CartButton storeInfo={storeInfo} number={number !==0  ?number:"0"} />:null
    }
    

    <Box style={{ marginTop: 73 }}>
      <Switch>
        <Route exact path={`${url}`}>
          <MainPage webInfo={webInfo} />
        </Route>
        {/* <Route exact path={`${url}/promotion`}>
          <PromotionPage />
        </Route> */}
        <Route exact path={`${url}/storeInfo`}>
          <StorePage />
        </Route>
      {webInfo.other.status?
       <Route exact path={`${url}/aboutUs`}>
          <AboutUsPage webInfo={webInfo}/>
        </Route>:null}

        <Route exact path={`${url}/cart`}>
          <CartPage webInfo={webInfo}  />
        </Route>

        {/* Path product */}
        <Route exact path={`${url}/category/:categoryId`}>
          <ProductPage webInfo={webInfo}   />
        </Route>
        <Route exact path={`${url}/category/:categoryId/products/:productCode`}>
          <DetailPage webInfo={webInfo} />
        </Route>

        {/* <Route exact path={`${url}/products/:productCode`}>
          <DetailPage webInfo={webInfo} />
        </Route> */}
    
        {/* <Route exact path={`${url}/all`}>
          <ProductPage  webInfo={webInfo} />
        </Route> */}

        <Route path={`${url}/*`} component={PageNotFound} />
      </Switch>
    </Box>

    <Footer web={webInfo}/>
  </div>) 
  } else {
    return <div>Error</div>
  }
  
};

export default CustomerPage;



const PopUpChoooseBranch = ({openPopUpChooseBranch,changeBranch,setOpenPopUpChooseBranch,branches,mainColor}) =>{
  const {storeInfo} = useSelector(state => state.customerPage)
  const [selectedBranch, setSelectedBranch] = useState(null);
  return (
    <SimpleModal open={openPopUpChooseBranch}>
          <Typography  style={{ fontSize:21, fontWeight:500, color:'#000',marginTop:10, marginBottom:15, marginRight:30}}>Chọn chi nhánh gần bạn</Typography>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} fullWidth>
          <InputLabel>Chi nhánh</InputLabel>
          <Select
            value={selectedBranch}
            label="Chi nhánh"
            onChange={(e)=>setSelectedBranch(e.target.value)}
          >
            {branches?.map(branch => {
                return (<MenuItem  key={branch.id}value={branch}>{branch.name}</MenuItem>)
             })}
          </Select>
        </FormControl>
        <Box style={{display:'flex',justifyContent:'flex-end'}}>
        <ColorButton varaint='contained' style={{marginTop:30}}  mainColor={selectedBranch?mainColor:"#dddddd"} 
            disabled={!selectedBranch }
            onClick={()=>{
              localStorage.setItem(storeInfo.uuid , selectedBranch.id);
              setOpenPopUpChooseBranch(false)
              changeBranch()
            }}
         >
          Xác nhận
        </ColorButton>
        </Box>
    </SimpleModal>
  )
}