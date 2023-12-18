import React,{useState}  from 'react'
import { useTheme, makeStyles, styled ,lighten} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import clsx from "clsx";
import AddIcon from '@mui/icons-material/Add';
// import useStyles from "../../../components/TableCommon/style/mainViewStyle";
//import library 
import {Button,Grid,Card,Box,CardActions,Tabs,Tab,TableContainer,CardContent,CardMedia,CardActionArea,FormControlLabel,Switch,Menu,MenuItem,ListItem,IconButton,TableBody,Typography, darken} from '@material-ui/core'
import icon from '../../../../assets/img/product/default.png';
// import icon from '../../../assets/img/product/tap.png';
// import icon from '../../../assets/img/product/rice.png';
//import project 
// import InventoryList from '../../../../assets/JsonData/inventory.json'
import { grey} from '@material-ui/core/colors'
import { Link } from "react-router-dom";
import { Route, useRouteMatch, useParams } from "react-router-dom";
import {useStyles} from './style'
import {ColorOutlineButtonCart} from "../../../../components/Button/ColorButton"
import { useDispatch, useSelector } from 'react-redux';
import { customerPageActions } from '../../../../store/slice/customerPageSlice';
import { success ,error,warning, info} from '../../../../components/StatusModal/StatusModal';
import defaultProduct from '../../../../assets/img/product/default-product.png'
import _ from 'lodash'
import PopUpProduct from "../PopUpProduct/PopUpProduct"
import openNotification from "../../../../components/StatusPopup/StatusPopup";
import soldOutIcon from "../../../../assets/img/icon/sold-out.png"
import soldOutIcon1 from "../../../../assets/img/icon/sold-out-1.png"
import soldOutIcon2 from "../../../../assets/img/icon/out-of-stock.png"

const ProductList = (props) => {
    let { categoryId } = useParams();
    let {url} = useRouteMatch();
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch()
    const {isMargin,mainColor,priceStyle,btnStyle,border,nameStyle,isBox,marginContainer,boxDistance,InventoryList, fromNoCategoryPage} = props

    const {order, storeInfo} = useSelector(state => state.customerPage)
    const storeManageInventory = storeInfo.general_configuration? JSON.parse(storeInfo.general_configuration).inventory.status: true
    const webSetting = storeInfo.web_configuration? JSON.parse(storeInfo.web_configuration):null
    const orderWhenOutOfSctock = webSetting?.orderManagement.orderWhenOutOfSctock ||  !storeManageInventory
    const branchOption = webSetting?.orderManagement.branchOption
    const {products} = useSelector(state => state.customerPage);


    // function getStockQuantity (product, all_child_product=null) {
    //     if(!product){return }
    //     if(orderWhenOutOfSctock){
    //         return 999999999
    //     }else{
    //         if (product?.has_variance){
    //             all_child_product= all_child_product? all_child_product: products.filter( item => item.parent_product_code === product.product_code)
    //             console.log("all_child_product",all_child_product)
    //             let sum =  all_child_product?.reduce((sum,a)=>sum + Number(a.quantity_available), 0)
    //             return sum
    //         }
    //         if(branchOption === 'auto'  ){
    //             return Number(product?.quantity_available) ? Number(product?.quantity_available):0
    //         }
    //         else if(branchOption === 'default'){
    //             let branchId = webSetting?.orderManagement.branchDefault
    //             const branch = product.branch_inventories?.find(branch => Number(branch.branch_id) === Number(branchId))
    //             return Number(branch?.quantity_available) ? Number(branch?.quantity_available):0
    //         }else {
    //             let branchId = localStorage.getItem(storeInfo.uuid);
    //             const branch = product.branch_inventories?.find(branch => Number(branch.branch_id) === Number(branchId))
    //             return Number(branch?.quantity_available)  ? Number(branch?.quantity_available) :0
    //         }
    //     }
    
    // }
    function getStockQuantity (product) {
        if(!product){return }
        if(orderWhenOutOfSctock ){
            return 999999999
        }else{          
            if(branchOption === 'auto'  ){
                return Number(product?.quantity_available) ? Number(product?.quantity_available):0
            }
            else if(branchOption === 'default'){
                let branchId = webSetting?.orderManagement.branchDefault
                const branch = product.branch_inventories?.find(branch => Number(branch.branch_id) === Number(branchId))
                return Number(branch?.quantity_available) ? Number(branch?.quantity_available):0
            }else {
                let branchId = localStorage.getItem(storeInfo.uuid);
                const branch = product.branch_inventories?.find(branch => Number(branch.branch_id) === Number(branchId))
                return Number(branch?.quantity_available)  ? Number(branch?.quantity_available) :0
            }
        }
    
    }
    function getIsAllVarianceOutOfStock (product) {   
        if(!product || !product.has_variance){return }
        if(orderWhenOutOfSctock){
            return false
        }else{      

            const all_child_product =  products.filter( item => item.parent_product_code === product.product_code)
            if(branchOption === 'auto'  ){
                for (let i = 0; i < all_child_product?.length ; i++){
                    if (Number(all_child_product[i]?.quantity_available)>0){return false} 
                }
                return true
            }
            else if(branchOption === 'default'){
                let branchId = webSetting?.orderManagement.branchDefault
                for (let i = 0; i < all_child_product?.length ; i++){
                    const branch = all_child_product[i]?.branch_inventories?.find(branch => Number(branch.branch_id) === Number(branchId))
                    if (Number(branch?.quantity_available)>0){return false} 
                }
                console.log("alo")
                return true 
            }else {
                let branchId = localStorage.getItem(storeInfo.uuid);
                for (let i = 0; i < all_child_product?.length ; i++){
                    const branch = all_child_product[i]?.branch_inventories?.find(branch => Number(branch.branch_id) === Number(branchId))
                    if (Number(branch?.quantity_available)>0){return false} 
                }
                return true 
            }
        }
    
    }

   

    //customization 
    const lgScreen = useMediaQuery(theme.breakpoints.down("lg")) ;
    const mdScreen = useMediaQuery(theme.breakpoints.down("md")) ;
    const smScreen = useMediaQuery(theme.breakpoints.down("sm")) ;
    const xsScreen = useMediaQuery(theme.breakpoints.down("xs")) ;
    let numOfItemInRow = 6;
    if(xsScreen){numOfItemInRow=2}
    else if(smScreen){numOfItemInRow=3}
    else if(mdScreen){numOfItemInRow=4}
    else if(lgScreen){numOfItemInRow=5}
    else {numOfItemInRow=6}
    let widthSize = `${((100-marginContainer*2)/numOfItemInRow)-boxDistance*2}vw`
    function handleColor (type) {
        if(type==="0"){return '#000'}
        else if (type==="1"){return mainColor }
        else{return mainColor}
    }
    const nameColor = handleColor(nameStyle[0])
    const nameSize = nameStyle[1];
    const nameBold = nameStyle[2];
    const nameLineClass = classes.multiLineEllipsis

    const priceColor = handleColor(priceStyle[0])
    const priceSize =priceStyle[1]
    const priceBold = priceStyle[2]
    const alignCenter = Number(props.alignCenter)

    

    const [openQuickPopUp, setOpenQuickPopUp] = useState(false)
    const [selectedItem, setSelectedItem] = useState(false)

    const addProductToCart = (product, stockQuantity, addQuantity=1) => {
        const newItem = {...product}  
        try {
            const itemInCart = order.cartItem.find(item => item.uuid === product.uuid);
            let totalQuantityWillInCart  = itemInCart?Number(itemInCart.quantity) +addQuantity:addQuantity 
            if(stockQuantity < totalQuantityWillInCart) {
              const mess = !itemInCart.quantity ? `Số lượng đặt vượt tồn kho. \n  Tồn kho: ${stockQuantity}`:
                    `Số lượng đặt vượt tồn kho. \n  Tồn kho: ${stockQuantity}.\r      Giỏ hàng đang có: ${Number(itemInCart.quantity)}`
              warning(mess)
              return 
             }
            const index = order.cartItem.findIndex(item => item.uuid === newItem.uuid);
            const newOrder = _.cloneDeep(order);
            if (index !== -1) {
                // newOrder.cartItem[index].quantity += 1;
                newOrder.cartItem[index].quantity += addQuantity;
            } else {
                // newItem.quantity = 1;
                newItem.quantity = addQuantity;
                newOrder.cartItem.push(newItem);
            }
            dispatch(customerPageActions.setOrder(newOrder))
            // success("Thêm sản phẩm thành công")
            openNotification("success", "Thêm sản phẩm thành công");
        } catch(err) {
            console.log(err)
        }
    }
    const openPopUp = (product,stockQuantity) =>{
        if(stockQuantity <= 0){
            warning("Sản phẩm hết hàng")
            return
        }
        if(product.has_variance){
            setOpenQuickPopUp(true)
            return
        }
        // addProductToCart(product,stockQuantity)
        addProductToCart(product,stockQuantity,1)

    }
    
    
    return (
        <Box className={classes.container} style={{marginLeft:`${marginContainer}vw`,marginRight:`${marginContainer}vw`,}}>
            <Grid container direction="row" spacing={2} justifyContent="center" >
             {/* Đổi list đúng với category */}
            {openQuickPopUp? <PopUpProduct getStockQuantity={getStockQuantity} addProductToCart={addProductToCart}mainColor={mainColor} product={selectedItem}open={openQuickPopUp} onClose={()=>setOpenQuickPopUp(false)} />:null}
             {InventoryList?.map(item=>{
                 const image = JSON.parse(item.img_urls) ?JSON.parse(item.img_urls) [0]:null
                const varianceProductStatus = getIsAllVarianceOutOfStock(item.has_variance?item:null) ? 0 : 99
                const stockQuantity  = !item.has_variance ? getStockQuantity(item) : varianceProductStatus
               
                console.log("item",item)
                 return( 
                     <>
                     {Number(isBox)?
                     <Card  className={clsx(classes.hoverCard,classes.item,classes.colorCard)} style={{margin:`${boxDistance}%`, width:widthSize, borderRadius:border?7:0}} >

                        <CardActionArea 
                            // component={Link} to={`${url}/products/${item.product_code}`} 
                            component={Link} to={fromNoCategoryPage?`${url}/category/${item.category.id}/products/${item.product_code}`: `${url}/products/${item.product_code}`} 
                        >

                            <CardMedia
                                style={{height:widthSize, margin:isMargin?10:0, marginBottom:isMargin?-5:0, borderRadius:border&& isMargin ?7:0}}
                                image={JSON.parse(item.img_urls ? item.img_urls : "[]").length  ? JSON.parse(item.img_urls ? item.img_urls : "[]").at(0) : defaultProduct}
                            >
                             {/* <Box component="img" sx={{  height: 40, width: 40, }} style={{zIndex:20,marginTop:10}} src={soldOutIcon}/> */}
                           {/* display:'flex', justifyContent:'flex-end' */}
                           {stockQuantity <= 0? <Box style={{paddingTop:2, }}><Box style={{backgroundColor:'#000', color:'#fff', maxWidth:55, paddingLeft:2, paddingRight:2,fontWeight:500, marginTop:10, fontSize:12}}>Hết hàng</Box></Box>:null}
                            </CardMedia>

                            <Box style={{marginTop:10}}>
                                <CardContent>
                                    < InfoComponent stockQuantity={stockQuantity} setSelectedItem={setSelectedItem} openPopUp={openPopUp}  item={item} mainColor={mainColor} btnStyle={btnStyle} alignCenter={alignCenter} nameColor={nameColor} priceColor={priceColor} nameSize={nameSize} nameBold={nameBold} nameLineClass={nameLineClass} priceBold={priceBold}priceSize={priceSize} />
                                </CardContent>   
                            </Box>
                        </CardActionArea>
                    </Card> :
                    <Box  className={clsx(/*classes.hoverCard,*/classes.item)} style={{margin:`${boxDistance}%`,width:widthSize, borderRadius:border?7:0}} >
                        <CardActionArea 
                            // component={Link} to={`${url}/products/${item.product_code}`}
                            component={Link} to={fromNoCategoryPage?`${url}/category/${item.category.id}/products/${item.product_code}`: `${url}/products/${item.product_code}`} 

                        >
                            <CardMedia
                                style={{height:widthSize, margin:isMargin?10:0, marginBottom:isMargin?-5:0, borderRadius:border?7:0}}
                                image={JSON.parse(item.img_urls ? item.img_urls : "[]").length  ? JSON.parse(item.img_urls ? item.img_urls : "[]").at(0) : defaultProduct}
                            >
                            {stockQuantity <= 0? <Box style={{paddingTop:2}}><Box style={{backgroundColor:'#000', color:'#fff', maxWidth:55, paddingLeft:2, paddingRight:2,fontWeight:500, marginTop:10, fontSize:12}}>Hết hàng</Box></Box>:null}

                            </CardMedia>
                            <Box style={{marginTop:10}}>
                                {isMargin? 
                                <CardContent>
                                    < InfoComponent stockQuantity={stockQuantity}  setSelectedItem={setSelectedItem} openPopUp={openPopUp}  item={item} mainColor={mainColor} btnStyle={btnStyle} alignCenter={alignCenter} nameColor={nameColor} priceColor={priceColor} nameSize={nameSize} nameBold={nameBold} nameLineClass={nameLineClass} priceBold={priceBold}priceSize={priceSize} />
                                </CardContent>
                                :
                                < InfoComponent stockQuantity={stockQuantity}  setSelectedItem={setSelectedItem} openPopUp={openPopUp}  item={item} mainColor={mainColor} btnStyle={btnStyle} alignCenter={alignCenter} nameColor={nameColor} priceColor={priceColor} nameSize={nameSize} nameBold={nameBold} nameLineClass={nameLineClass} priceBold={priceBold}priceSize={priceSize} />
                            }    
                            </Box>
                        </CardActionArea>
                    </Box>
                     } 
                </>
                )
             })}
            </Grid>
        </Box>
        
    )
}
export const InfoComponent = (props)=>{
    const {openPopUp,stockQuantity,setSelectedItem,item,mainColor,btnStyle,alignCenter, nameColor,priceColor,nameSize,nameBold,nameLineClass,priceSize,priceBold} = props;
    let { path } = useRouteMatch();
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <>
        <Typography gutterBottom className={clsx( nameLineClass, classes.name, alignCenter && classes.alignCenter)} style={{color:nameColor, fontWeight:nameBold, fontSize:Number(nameSize)}}>
        {item.name}
        </Typography>
        {
            !alignCenter && !Number(btnStyle[1])? 
            <Grid container direction="row" alignItems="center" justifyContent="space-between" style={{marginBottom:-9}}>
                <Grid item>
                    <Typography variant="body2" style={{color:priceColor, fontWeight:priceBold, fontSize:Number(priceSize)}}  >
                        {item.list_price.toLocaleString()} đ
                    </Typography>
                
                </Grid>
                {Number(btnStyle[0])?
                    <Grid item>     
                        <IconButton size="small"  style={{color:'#fff', background:mainColor}} 
                            // Stop Ripple Effect
                            onTouchStart={(event) => event.stopPropagation()}
                            onMouseDown={(event) => event.stopPropagation()}
                            onClick={(event) => {
                                // Prevent CardActionArea Click
                                event.preventDefault()
                                openPopUp(item,stockQuantity);
                                setSelectedItem(item)
                            }}
                        >
                            <AddIcon fontSize="small"/>
                        </IconButton>:
                    </Grid> :null }

            </Grid>
            :
            <>
            <Typography   className={alignCenter &&classes.alignCenter} style={{color:priceColor, fontWeight:priceBold, fontSize:Number(priceSize)}} >
                {item.list_price.toLocaleString()} đ
            </Typography>

            {Number(btnStyle[0])?
            <ColorOutlineButtonCart variant="outlined" fullWidth mainColor={mainColor} 
                onClick={(event) => {
                    // Prevent CardActionArea Click
                    event.preventDefault()
                    openPopUp(item,stockQuantity);
                    setSelectedItem(item)
                }}
                style={{marginBottom:-12,marginTop:10 }}
                >
                Giỏ hàng
            </ColorOutlineButtonCart>   
            
            :null }
            </>
        }
        </>
    )
}



export default ProductList