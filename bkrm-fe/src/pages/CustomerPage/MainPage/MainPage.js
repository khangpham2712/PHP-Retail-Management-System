import React, { useEffect, useState } from 'react'
import { useTheme, makeStyles, styled , lighten} from "@material-ui/core/styles";
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import {IconButton,Typography,Box} from '@material-ui/core';
import '../../../index.css';
import ProductList from '../ProductPage/ProductList/ProductList';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import clsx from "clsx";
import InventoryList from '../../../assets/JsonData/inventory.json'
import StoreContext from '../StoreContext';
import customerPageApi from '../../../api/customerPageApi';
import {useSelector} from 'react-redux';
const useStyles = makeStyles((theme) => ({
    arrow: {
        position: 'absolute',
        zIndex: 2,
        top: 'calc(50% - 15px)',  
        cursor: 'pointer',
        opacity:0.2,
        '&:hover': {
            opacity: 1,
        },
    },
    arrowRight:{
        right: 15 ,
    }
}));
const images=[
    "https://minio.thecoffeehouse.com/image/admin/bannerWeb_TCH_TeacherDay_074746.jpg",
    "https://minio.thecoffeehouse.com/image/admin/BANNERWEB(7)_809808.jpg",
    "https://minio.thecoffeehouse.com/image/admin/BANNERWEB(5)_846453.jpg"
]

const MainPage = (props) => {
    const {mainColor} = props.webInfo;
    const {priceStyle,btnStyle,isMargin,border,alignCenter,nameStyle,isBox,marginContainer,boxDistance}=props.webInfo.listProduct;

    const theme = useTheme();
    const classes = useStyles(theme);

    const {products, storeInfo} = useSelector(state => state.customerPage);

      
    let productNoAtt =  products.filter(product => product.attribute_value === null || product.has_variance === 1 ) 


    const banners = JSON.parse(storeInfo.banners ? storeInfo.banners : '[]');
    console.log("banners",banners)
    return (
<>
    {/* // 1. CAROUSE */}
    <Carousel // showArrows={true} showStatus={true} showIndicators={true} showThumbs={true} stopOnHover={true} thumbWidth=""
        interval="3000"
        infiniteLoop={true}
        showStatus={false} 
        autoPlay  
        emulateTouch={true}
        swipeable={true}
        dynamicHeight={false} 
        showThumbs={false} 
        renderArrowPrev={(onClickHandler) =><IconButton className={classes.arrow} onClick={onClickHandler} ><ArrowBackIosIcon  /></IconButton>}
        renderArrowNext={(onClickHandler) =><IconButton className={clsx(classes.arrow, classes.arrowRight)} onClick={onClickHandler} ><ArrowForwardIosIcon  /></IconButton>}
    >
        {banners.map((img)=>
        <div>
        <img  src={img} />
       </div>
        )}
      
       
    
    </Carousel>
    


    {/* // 2. BEST SELLERS  */}
    <Box>
        {/* <Typography variant="h2" style={{flexGrow: 1,textAlign: "center", marginBottom:30,marginTop:50}}>Bán chạy</Typography> */}
        {/* <Typography variant="h2" style={{flexGrow: 1,textAlign: "center", marginBottom:30,marginTop:30}}>Sản phẩm bán chạy</Typography> */}
        <Typography variant="h2" style={{flexGrow: 1,textAlign: "center", marginBottom:30,marginTop:30}}>Sản phẩm</Typography>

        <ProductList InventoryList={productNoAtt} mainColor={`rgba(${mainColor.r }, ${ mainColor.g }, ${ mainColor.b }, ${ mainColor.a })`} priceStyle={priceStyle} btnStyle={btnStyle} isMargin={isMargin} border={border} alignCenter={alignCenter} nameStyle={nameStyle} isBox={isBox} marginContainer={3} boxDistance={1} fromNoCategoryPage={true}/>
        {/* <ProductList InventoryList={products} mainColor={`rgba(${mainColor.r }, ${ mainColor.g }, ${ mainColor.b }, ${ mainColor.a })`} priceStyle={priceStyle} btnStyle={btnStyle} isMargin={isMargin} border={border} alignCenter={alignCenter} nameStyle={nameStyle} isBox={isBox} marginContainer={marginContainer} boxDistance={boxDistance}/> */}

    </Box>

    {/* // 3. NEWS IN  */}
    {/* <Box style={{backgroundColor:lighten(mainColor, 0.9),paddingBottom:20,marginTop:50}}>
        <Typography variant="h2" style={{flexGrow: 1,textAlign: "center", marginBottom:30,paddingTop:50}}>Sản phẩm mới</Typography>
        <ProductList InventoryList={InventoryList} mainColor={mainColor} priceStyle={priceStyle} btnStyle={btnStyle} isMargin={isMargin} border={border} alignCenter={alignCenter} nameStyle={nameStyle} isBox={isBox} marginContainer={10} boxDistance={2}/>
    </Box> */}
    
</>  



    )
}

export default MainPage

