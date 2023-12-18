import React, {useState} from 'react'
import { useTheme, makeStyles,styled ,lighten,darken} from "@material-ui/core/styles";

import { Typography,Toolbar,Fab,Box,Button,ButtonGroup,Badge,Select,MenuItem,InputAdornment,FormControlLabel,FormLabel,CardHeader,IconButton,Collapse,FormControl,RadioGroup,TextField, ListItem,Card, Radio,Grid, ButtonBase, Tooltip } from "@material-ui/core";
import { ThousandSeperatedInput } from '../../../../components/TextField/NumberFormatCustom';
import { Carousel } from "react-responsive-carousel";
import {CustomButton} from "../../../../components/Button/ColorButton"
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const useStyles = makeStyles((theme) => ({
    swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },  
}));


const DetailSetting = ({handleChangeCart,web,setWeb}) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const mainColor = `rgba(${ web.mainColor.r }, ${ web.mainColor.g }, ${ web.mainColor.b }, ${web.mainColor.a })` ; 

    const {priceStyle, nameStyle} = web.detailPage
    const handleChangeNameIndex = (event, index)=>{
        var newWeb = {...web};
        newWeb.detailPage.nameStyle[index] = event.target.value;
        setWeb(newWeb)
    }
    const handleChangePriceIndex = (event, index)=>{
        var newWeb = {...web};
        newWeb.detailPage.priceStyle[index] = event.target.value;
        setWeb(newWeb)
    }
    const [quantity, setQuantity]  = useState(1)

    const image = [
        "https://minio.thecoffeehouse.com/image/admin/Bottle_TraDao_836487.jpg",
    "https://minio.thecoffeehouse.com/image/admin/1633147051_photo-2021-10-02-10-52-45.jpg",
    "https://minio.thecoffeehouse.com/image/admin/1633147050_photo-2021-10-02-10-52-44.jpg",
    ]

  return (
    <>
    <Grid container spacing={8}>

     <Grid item>
           <Typography style={{fontWeight:500, marginRight:20, color:"#000",fontSize:15}}>Tên sản phẩm: </Typography>
                <ListItem style={{margin:0, padding:0, marginBottom:8}}>
                    <Typography style={{fontWeight:500, marginRight:20}}>Màu chữ </Typography>
                    <FormControl component="fieldset">
                        <RadioGroup name="nameStyle" value={web.detailPage.nameStyle[0].toString()} onChange={(event)=>{handleChangeNameIndex(event,0)}}>
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
                        <Grid item className={classes.swatch} style={{width:40}}><ThousandSeperatedInput value={web.detailPage.nameStyle[1]} onChange={(event)=>{handleChangeNameIndex(event,1)}}/></Grid>
                        <Grid item className={classes.swatch} style={{width:30, backgroundColor:"#E4E4E4"}}>px</Grid>
                    </Grid>
                </ListItem>
                <ListItem style={{margin:0, padding:0, marginBottom:8}}>
                    <Typography style={{fontWeight:500, marginRight:20}}>Độ dày </Typography>
                    <FormControl size="small" variant="outlined" className={classes.formControl} >
                        <Select
                            value={web.detailPage.nameStyle[2]}
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
                        <RadioGroup name="textNav" value={web.detailPage.priceStyle[0].toString()} onChange={(event)=>{handleChangePriceIndex(event,0)}}>
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
                        <Grid item className={classes.swatch} style={{width:40}}><ThousandSeperatedInput value={web.detailPage.priceStyle[1]} onChange={(event)=>{handleChangePriceIndex(event,1)}}/></Grid>
                        <Grid item className={classes.swatch} style={{width:30, backgroundColor:"#E4E4E4"}}>px</Grid>
                    </Grid>
                </ListItem>
                <ListItem style={{margin:0, padding:0, marginBottom:8}}>
                    <Typography style={{fontWeight:500, marginRight:20}}>Độ dày </Typography>
                    <FormControl size="small" variant="outlined" className={classes.formControl} >
                        <Select
                            value={web.detailPage.priceStyle[2]}
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
      </Grid>
      {/* Mẫu */}
      <Grid container  direction="row" justifyContent="space-between" alignItems="flex-start" spacing={8}>
        <Grid item xs={12} md={6}>
            <Carousel   showArrows={true} showStatus={false} infiniteLoop={true} emulateTouch={true} swipeable={true} dynamicHeight={false}  showThumbs={true}
            >
                {image?.map((img)=> <img  src={img}style={{borderRadius:10}} />)}
            </Carousel>  
        </Grid>

        <Grid item xs={12} md={6}>
          <Box>
              <Typography variant="h1" style={{marginBottom:25,color:nameStyle[0] === "0" ? "#000": mainColor , fontWeight:nameStyle[2], fontSize: Number(nameStyle[1])}}>Sản phẩm 1</Typography>
              <Typography variant="h2" style={{color:priceStyle[0] === "0" ? "#000": mainColor , fontWeight:priceStyle[2], fontSize: Number(priceStyle[1])}}>500.000 đ</Typography>
              <Typography variant="h5" style={{marginTop:40, marginBottom:10}}>Số lượng :</Typography>
              <ButtonGroup disableElevation variant="contained"  >
                <CustomButton mainColor='#f7f7f7'  textColor='#000' size="small" color='secondary'onClick={()=>{if(quantity>1){setQuantity(quantity-1)}}}> <RemoveIcon /></CustomButton>
                <CustomButton mainColor='#fff'  textColor='#000'  >{quantity}</CustomButton>
                <CustomButton mainColor='#f7f7f7' textColor='#000'size="small" onClick={()=>{setQuantity(quantity + 1)}}><AddIcon /></CustomButton>
            </ButtonGroup>

          </Box>
          <CustomButton fullWidth mainColor={mainColor} style={{marginTop:100}}  >Thêm vào giỏ hàng</CustomButton>
        </Grid>
      </Grid>
    </>
  )
}

export default DetailSetting