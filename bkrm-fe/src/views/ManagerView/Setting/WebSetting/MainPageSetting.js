import React, {useState} from 'react'
import { Carousel } from "react-responsive-carousel";
import {
    Button,
    TextField,
    Typography,
    Grid,
    Box,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    IconButton,
    Tooltip,
    Dialog,
    FormControlLabel,
    Switch,
    Collapse,
    Paper,
    Card,
    CardHeader,
    Checkbox,
    ListItem
    
  } from "@material-ui/core";
  import { useTheme, makeStyles, styled , lighten} from "@material-ui/core/styles";
import '../../../../index.css';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import clsx from "clsx";
import AddIcon from "@material-ui/icons/Add";
import avaUpload from "../../../../assets/img/product/default-product.png";
import AddMultipleImage from '../../../../components/AddMultipleImage/AddMultipleImage';
import { ThousandSeperatedInput } from '../../../../components/TextField/NumberFormatCustom';

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


const MainPageSetting = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const {imageURL, setImageURL,images,setImages,display,setDisplay,web,setWeb} = props
    const handleChangeChecked = (event) => {
        const { name, checked } = event.target;
        setWeb((prevState) => {
          return {
            ...prevState,
            mainPage: {
              ...prevState["mainPage"],
              [name]: checked,
            },
          };
        });
      };
    
      const handleChangeValue = (event) => {
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
  return (
    <>
        <Typography style={{fontWeight:500, marginRight:20, color:"#000",fontSize:15}}>Hình ảnh Banner: </Typography>

        <AddMultipleImage imageURL={imageURL} setImageURL={setImageURL} images={images} setImages={setImages} display={display} setDisplay={setDisplay} />
     

        <FormControlLabel
            style={{marginTop:20}}
            control={ <Checkbox  checked={web.mainPage.showbestSeller} name="showbestSeller"  onChange={handleChangeChecked}/> }
            label={<Typography style={{fontWeight:500, color:'#000'}}>Hiển thị sản phẩm bán chạy</Typography>}
        />
        <ListItem>
            Top <ThousandSeperatedInput name="numberTopBestSeller" style={{marginRight:5}}value={web.mainPage.numberTopBestSeller} onChange={handleChangeValue}/> sản phẩm bán chạy nhất
        </ListItem>

        <FormControlLabel
            control={ <Checkbox  checked={web.mainPage.showNewArrival} name="showNewArrival" onChange={handleChangeChecked} /> }
            label={<Typography style={{fontWeight:500, color:'#000'}}>Hiển thị sản phẩm mới</Typography>}

        />
         <ListItem>
            Top <ThousandSeperatedInput  name="numberTopNewArrival" style={{marginRight:5}} value={web.mainPage.numberTopNewArrival} onChange={handleChangeValue}/> sản phẩm mới nhất
        </ListItem>

        <FormControlLabel
            control={ <Checkbox  checked={web.mainPage.showDiscount}  name="showDiscount" onChange={handleChangeChecked} /> }
            label={<Typography style={{fontWeight:500, color:'#000'}}>Hiển thị sản phẩm khuyến mãi</Typography>}

        />

        <Carousel 
           
           interval="3000" infiniteLoop={true} showStatus={false}  autoPlay   emulateTouch={true} swipeable={true}  dynamicHeight={false}  showThumbs={false} 
           renderArrowPrev={(onClickHandler) =><IconButton className={classes.arrow} onClick={onClickHandler} ><ArrowBackIosIcon  /></IconButton>}
           renderArrowNext={(onClickHandler) =><IconButton className={clsx(classes.arrow, classes.arrowRight)} onClick={onClickHandler} ><ArrowForwardIosIcon  /></IconButton>}
       >
           {display.map((img)=><img  src={img.link} />)}
   
       </Carousel>
    </>
  )
}

export default MainPageSetting


