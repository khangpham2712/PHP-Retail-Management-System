import React,{useEffect,useState,useRef} from 'react'
import { Typography,Box,Toolbar,Fab,Button,Badge,Select,CardActionArea,CardMedia,CardContent,MenuItem,InputAdornment,FormControlLabel,FormLabel,CardHeader,IconButton,Collapse,FormControl,RadioGroup,TextField, ListItem,Card, Radio,Grid, ButtonBase, Tooltip } from "@material-ui/core";
import { useTheme, makeStyles,styled ,lighten,darken} from "@material-ui/core/styles";
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import {ColorButton,ColorOutlineButton} from "../../../../components/Button/ColorButton"
import ShoppingCartTwoToneIcon from "@material-ui/icons/ShoppingCartTwoTone";
import { ThousandSeperatedInput } from '../../../../components/TextField/NumberFormatCustom';
import clsx from "clsx";
import { Link } from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";
// import InfoComponent from "../../../../pages/CustomerPage/ProductPage/ProductList/ProductList"
import InventoryList from '../../../../assets/JsonData/inventory.json'
import icon from '../../../../assets/img/product/tradao.jpeg';
import AddIcon from '@mui/icons-material/Add';

import {ColorOutlineButtonCart} from "../../../../components/Button/ColorButton"

const useStyles = makeStyles((theme) => ({
    toolBar: {
        // background: theme.palette.background.paper,
        color: theme.customization.themeGreyText,
        border:'1px solid #b6b6b6'
    },
    btnNav: {
        textTransform: "none",
        marginRight: 10,
    }, 
    btn: {
        boxShadow: "0px 12px 14px 0px #ffe57f4d",
        backgroundColor: "#ffe57f",
        borderRadius: "10px 0px 0px 10px",
        "&:hover": {
          backgroundColor: "#ffcf10",
        },
        height: 60,
        width: 60,
       
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },  
      alignCenter:{
        flexGrow: 1,textAlign: "center"
    }
}));


const ProductSetting = ({web,handleChangeListProduct,setWeb}) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const mainColor=`rgba(${ web.mainColor.r }, ${ web.mainColor.g }, ${ web.mainColor.b }, ${ web.mainColor.a })`
 
    const { priceStyle,btnStyle,nameStyle,isBox,boxDistance} = web.listProduct;
     //customization 

     const isMargin = Number(web.listProduct.isMargin)
     const border = Number(web.listProduct.border)
     const marginContainer = web.listProduct.marginContainer
    let  numOfItemInRow=5;
     let widthSize = `${((100-marginContainer*2 )/numOfItemInRow)-boxDistance*2}vw`
     function handleColor (type) {
         if(type==="0"){return '#000'}
         else if (type==="1"){return mainColor }
         else{return mainColor}
     }
     const nameColor = handleColor(nameStyle[0])
     const nameSize = nameStyle[1];
     const nameBold = nameStyle[2];
     const priceColor = handleColor(priceStyle[0])
     const priceSize =priceStyle[1]
     const priceBold = priceStyle[2]

     const alignCenter = Number(web.listProduct.alignCenter)
     

    const handleChangeNameIndex = (event, index)=>{
        var newWeb = {...web};
        newWeb.listProduct.nameStyle[index] = event.target.value;
        setWeb(newWeb)
    }
    const handleChangePriceIndex = (event, index)=>{
        var newWeb = {...web};
        newWeb.listProduct.priceStyle[index] = event.target.value;
        setWeb(newWeb)
    }
    const handleChangeButtonIndex = (event, index)=>{
        var newWeb = {...web};
        newWeb.listProduct.btnStyle[index] = event.target.value;
        setWeb(newWeb)
    }

    useEffect(()=>{
        if(Number(web.listProduct.btnStyle[1]) === 0 &&  web.listProduct.alignCenter){
            var newWeb = {...web};
            newWeb.listProduct.btnStyle[1] = "1"
            setWeb(newWeb)
        }
    }, [web.listProduct.alignCenter])

    useEffect(()=>{
        if(Number(web.listProduct.btnStyle[1]) === 0 && web.listProduct.alignCenter){
            var newWeb = {...web};
            web.listProduct.alignCenter = 0
            setWeb(newWeb)
        }
    }, [web.listProduct.btnStyle[1]])
      
   
    return (
        <>
       <Grid container justifyContent='space-between'>
           <Grid item>
           <Typography style={{fontWeight:500, marginRight:20, color:"#000",fontSize:15}}>Tên sản phẩm: </Typography>
                <ListItem style={{margin:0, padding:0, marginBottom:8}}>
                    <Typography style={{fontWeight:500, marginRight:20}}>Màu chữ </Typography>
                    <FormControl component="fieldset">
                        <RadioGroup name="nameStyle" value={web.listProduct.nameStyle[0].toString()} onChange={(event)=>{handleChangeNameIndex(event,0)}}>
                        <div>
                            <FormControlLabel value={"0"} control={<Radio color="primary" />} label="Đen" />
                            <FormControlLabel value={"1"} control={<Radio color="primary"/>} label="Màu chính" />
                        </div>
                        </RadioGroup>
                    </FormControl>
                </ListItem>
                <ListItem style={{margin:0, padding:0,marginBottom:15}}>
                    <Typography style={{fontWeight:500, marginRight:20,width:60 }}>Cỡ chữ </Typography>
                    <Grid container  >
                        <Grid item className={classes.swatch} style={{width:40}}><ThousandSeperatedInput value={web.listProduct.nameStyle[1]} onChange={(event)=>{handleChangeNameIndex(event,1)}}/></Grid>
                        <Grid item className={classes.swatch} style={{width:30, backgroundColor:"#E4E4E4"}}>px</Grid>
                    </Grid>
                </ListItem>
                <ListItem style={{margin:0, padding:0, marginBottom:8}}>
                    <Typography style={{fontWeight:500, marginRight:20}}>Độ dày </Typography>
                    <FormControl size="small" variant="outlined" className={classes.formControl} >
                        <Select
                            value={web.listProduct.nameStyle[2]}
                            onChange={(event)=>{handleChangeNameIndex(event,2)}}
                            >
                            <MenuItem value={300}>300</MenuItem>
                            <MenuItem value={400}>400</MenuItem>
                            <MenuItem value={500}>500</MenuItem>
                            <MenuItem value={600}>600</MenuItem>
                            <MenuItem value={700}>700</MenuItem>
                            </Select>
                        </FormControl>
                </ListItem>
           </Grid>
           <Grid item >
           <Typography style={{fontWeight:500, marginRight:20, color:"#000",fontSize:15}}>Giá sản phẩm: </Typography>
                <ListItem style={{margin:0, padding:0, marginBottom:8}}>
                    <Typography style={{fontWeight:500, marginRight:20}}>Màu số </Typography>
                    <FormControl component="fieldset">
                        <RadioGroup name="textNav" value={web.listProduct.priceStyle[0].toString()} onChange={(event)=>{handleChangePriceIndex(event,0)}}>
                        <div>
                            <FormControlLabel value={"0"} control={<Radio color="primary" />} label="Đen" />
                            <FormControlLabel value={"1"} control={<Radio color="primary"/>} label="Màu chính" />
                        </div>
                        </RadioGroup>
                    </FormControl>
                </ListItem>
                <ListItem style={{margin:0, padding:0,marginBottom:15}}>
                    <Typography style={{fontWeight:500, marginRight:20,width:55 }}>Cỡ số </Typography>
                    <Grid container  >
                        <Grid item className={classes.swatch} style={{width:40}}><ThousandSeperatedInput value={web.listProduct.priceStyle[1]} onChange={(event)=>{handleChangePriceIndex(event,1)}}/></Grid>
                        <Grid item className={classes.swatch} style={{width:30, backgroundColor:"#E4E4E4"}}>px</Grid>
                    </Grid>
                </ListItem>
                <ListItem style={{margin:0, padding:0, marginBottom:8}}>
                    <Typography style={{fontWeight:500, marginRight:20}}>Độ dày </Typography>
                    <FormControl size="small" variant="outlined" className={classes.formControl} >
                        <Select
                            value={web.listProduct.priceStyle[2]}
                            onChange={(event)=>{handleChangePriceIndex(event,2)}}
                            >
                            <MenuItem value={300}>300</MenuItem>
                            <MenuItem value={400}>400</MenuItem>
                            <MenuItem value={500}>500</MenuItem>
                            <MenuItem value={600}>600</MenuItem>
                            <MenuItem value={700}>700</MenuItem>
                            </Select>
                        </FormControl>
                </ListItem>
           </Grid>
           <Grid item >
           <Typography style={{fontWeight:500, marginRight:20, color:"#000",fontSize:15}}>Nút mua nhanh: </Typography>
                <ListItem style={{margin:0, padding:0, marginBottom:8}}>
                    <Typography style={{fontWeight:500, marginRight:20}}>Hiển thị </Typography>
                    <FormControl component="fieldset">
                        <RadioGroup name="textNav" value={web.listProduct.btnStyle[0].toString()} onChange={(event)=>{handleChangeButtonIndex(event,0)}}>
                        <div>
                            <FormControlLabel value={"0"} control={<Radio color="primary" />} label="Không " />
                            <FormControlLabel value={"1"} control={<Radio color="primary"/>} label="Có" />
                        </div>
                        </RadioGroup>
                    </FormControl>
                </ListItem>
                {Number(web.listProduct.btnStyle[0] )?<ListItem style={{margin:0, padding:0,marginBottom:15}}>
                    <Typography style={{fontWeight:500, marginRight:20,width:55 }}>Kiểu nút </Typography>
                    <FormControl component="fieldset">
                        <RadioGroup name="textNav" value={web.listProduct.btnStyle[1].toString()} onChange={(event)=>{handleChangeButtonIndex(event,1)}}>
                        <div>
                            <FormControlLabel value={"0"} control={<Radio color="primary" />} label="Dạng tròn" />
                            <FormControlLabel value={"1"} control={<Radio color="primary"/>} label="Dạng hộp" />
                        </div>
                        </RadioGroup>
                    </FormControl>
                </ListItem>:null}
                
        </Grid>

        <Grid container spacing={8} style={{marginTop:5}}>
           <Grid item >
           <Typography style={{fontWeight:500, marginRight:20, color:"#000",fontSize:15}}>Khung sản phẩm: </Typography>
                <ListItem style={{margin:0, padding:0, marginBottom:8}}>
                    <Typography style={{fontWeight:500, marginRight:20}}>Khung: </Typography>
                    <FormControl component="fieldset">
                        <RadioGroup name="isBox" value={web.listProduct.isBox.toString()} onChange={handleChangeListProduct}>
                        <div>
                            <FormControlLabel value={"0"} control={<Radio color="primary" />} label="Không" />
                            <FormControlLabel value={"1"} control={<Radio color="primary"/>} label="Có" />
                        </div>
                        </RadioGroup>
                    </FormControl>
                </ListItem>

                <ListItem style={{margin:0, padding:0, marginBottom:8}}>
                    <Typography style={{fontWeight:500, marginRight:20}}>Độ rộng: </Typography>
                    <FormControl component="fieldset">
                        <RadioGroup name="isMargin" value={web.listProduct.isMargin.toString()} onChange={handleChangeListProduct}>
                        <div>
                            <FormControlLabel value={"0"} control={<Radio color="primary" />} label="Nhỏ" />
                            <FormControlLabel value={"1"} control={<Radio color="primary"/>} label="Lớn" />
                        </div>
                        </RadioGroup>
                    </FormControl>
                </ListItem>

                <ListItem style={{margin:0, padding:0, marginBottom:8}}>
                    <Typography style={{fontWeight:500, marginRight:20}}>Viền cong: </Typography>
                    <FormControl component="fieldset">
                        <RadioGroup name="border" value={web.listProduct.border.toString()} onChange={handleChangeListProduct}>
                        <div>
                            <FormControlLabel value={"0"} control={<Radio color="primary" />} label="Không" />
                            <FormControlLabel value={"1"} control={<Radio color="primary"/>} label="Có" />
                        </div>
                        </RadioGroup>
                    </FormControl>
                </ListItem>
          </Grid  >
          <Grid item >
                <ListItem style={{margin:0, padding:0, marginBottom:8}}>
                    <Typography style={{fontWeight:500, marginRight:20}}>Khoảng cách sản phẩm: </Typography>
                    <FormControl size="small" variant="outlined" className={classes.formControl} >
                        <Select
                            value={web.listProduct.boxDistance}
                            onChange={handleChangeListProduct}
                            name="boxDistance"
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={1.2}>2</MenuItem>
                            <MenuItem value={1.4}>3</MenuItem>
                            <MenuItem value={1.6}>4</MenuItem>
                            <MenuItem value={1.8}>5</MenuItem>
                            <MenuItem value={2}>6</MenuItem>
                            </Select>
                        </FormControl>
                </ListItem>

                <ListItem style={{margin:0, padding:0, marginBottom:8}}>
                    <Typography style={{fontWeight:500, marginRight:20}}>Khoảng cách viền: </Typography>
                    <FormControl size="small" variant="outlined" className={classes.formControl} >
                        <Select
                            value={web.listProduct.marginContainer}
                            onChange={handleChangeListProduct}
                            name="marginContainer"
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={4}>2</MenuItem>
                            <MenuItem value={7}>3</MenuItem>
                            <MenuItem value={10}>4</MenuItem>
                            <MenuItem value={12}>5</MenuItem>
                            <MenuItem value={15}>6</MenuItem>
                            </Select>
                        </FormControl>
                </ListItem>

                <ListItem style={{margin:0, padding:0, marginBottom:8}}>
                    <Typography style={{fontWeight:500, marginRight:20}}>Căn giữa: </Typography>
                    <FormControl component="fieldset">
                        <RadioGroup name="alignCenter" value={web.listProduct.alignCenter.toString()} onChange={handleChangeListProduct}>
                        <div>
                            <FormControlLabel value={"0"} control={<Radio color="primary" />} label="Không" />
                            <FormControlLabel value={"1"} control={<Radio color="primary"/>} label="Có" />
                        </div>
                        </RadioGroup>
                    </FormControl>
                </ListItem>
                </Grid  >
           </Grid>
       </Grid>

        {/* Mẫu */}
        <Box   style={{backgroundColor:'#f2fdff', paddingTop:10, paddingBottom:10}} >
        <Box   style={{marginLeft:`${marginContainer}vw`,marginRight:`${marginContainer}vw`,}}>
            <Grid container direction="row" spacing={2} justifyContent="center" >
             {
             InventoryList?.map((item,index)=>{
                 return( 
                     <>
                     {Number(isBox)?
                     <Grid item  xs={6} sm={4} md={3} >
                     <Card  className={clsx(classes.hoverCard,classes.item,classes.colorCard)} style={{margin:`${boxDistance}%`,  borderRadius:border?7:0}} >
                        <CardActionArea >
                            <CardMedia
                                style={{height:widthSize, margin:isMargin?10:0, marginBottom:isMargin?-5:0, borderRadius:border&& isMargin ?7:0}}
                                image={icon}
                            />
                            <Box style={{marginTop:10}}>
                                <CardContent>
                                    < InfoComponent  item={item} mainColor={mainColor} btnStyle={btnStyle} alignCenter={alignCenter} nameColor={nameColor} priceColor={priceColor} nameSize={nameSize} nameBold={nameBold} priceBold={priceBold}priceSize={priceSize} />
                                </CardContent>   
                            </Box>
                        </CardActionArea>
                    </Card>
                    </Grid> :
                     <Grid item  xs={6} sm={4} md={3} >
                    <Box  className={clsx(/*classes.hoverCard,*/classes.item)} style={{margin:`${boxDistance}%`, borderRadius:border?7:0}} >
                        <CardActionArea >
                            <CardMedia
                                style={{height:widthSize, margin:isMargin?10:0, marginBottom:isMargin?-5:0, borderRadius:border?7:0}}
                                image={icon}
                            />
                            <Box style={{marginTop:10}}>
                                {isMargin? 
                                <CardContent>
                                    < InfoComponent item={item} mainColor={mainColor} btnStyle={btnStyle} alignCenter={alignCenter} nameColor={nameColor} priceColor={priceColor} nameSize={nameSize} nameBold={nameBold} priceBold={priceBold}priceSize={priceSize} />
                                </CardContent>
                                :
                                < InfoComponent  item={item} mainColor={mainColor} btnStyle={btnStyle} alignCenter={alignCenter} nameColor={nameColor} priceColor={priceColor} nameSize={nameSize} nameBold={nameBold}  priceBold={priceBold}priceSize={priceSize} />
                            }    
                            </Box>
                        </CardActionArea>
                    </Box>
                    </Grid>
                     } 
                </>
                )
             }
             )
             }
            </Grid>
        </Box>
        </Box>
        </>
    )
}

export default ProductSetting


const InfoComponent = (props)=>{
    const {openPopUp,item,mainColor,btnStyle,alignCenter, nameColor,priceColor,nameSize,nameBold,priceSize,priceBold} = props;
    const theme = useTheme();
    const classes = useStyles(theme);

   return (
        <>
        <Typography gutterBottom className={clsx( classes.multiLineEllipsis, classes.name, alignCenter && classes.alignCenter)} style={{fontSize:Number(nameSize),color:nameColor, fontWeight:nameBold, }}>
        {item.name}
        </Typography>
        {
            !alignCenter && ! Number(btnStyle[1])? 
            <Grid container direction="row" alignItems="center" justifyContent="space-between" style={{marginBottom:-9}}>
                <Grid item>
                    <Typography variant="body2" style={{color:priceColor, fontWeight:priceBold, fontSize:Number(priceSize)}}  >
                        {item.price}.000đ
                    </Typography>
                
                </Grid>
                {Number(btnStyle[0])?
                    <Grid item>
                        <IconButton size="small"  style={{color:'#fff', background:mainColor}} 
                            // Stop Ripple Effect
                            onTouchStart={(event) => event.stopPropagation()}
                            onMouseDown={(event) => event.stopPropagation()}
                           
                        >
                            <AddIcon fontSize="small"/>
                        </IconButton>
                    </Grid> :null }

            </Grid>
            :
            <>
            <Typography   className={alignCenter &&classes.alignCenter} style={{color:priceColor, fontWeight:priceBold, fontSize:Number(priceSize)}}  >
                {item.price}.000đ
            </Typography>

            {Number(btnStyle[0])?
            <ColorOutlineButtonCart variant="outlined" fullWidth mainColor={mainColor} 
                onClick={(event) => {
                    // Prevent CardActionArea Click
                    event.preventDefault()
                    openPopUp(item);
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
