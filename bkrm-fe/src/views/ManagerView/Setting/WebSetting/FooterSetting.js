import React from 'react'
import {
    Button,
    Typography,
    InputAdornment,
    FormControlLabel,
    FormLabel,
    CardHeader,
    IconButton,
    Dialog,
    Divider,
    AppBar,
    Toolbar,
    Slide,
    Switch,
    Modal,
    ListItem,
    Box, Grid,
    Link,
    FormControl,
    RadioGroup,
    Radio,
    Checkbox,
    Fab
  } from "@material-ui/core";
  import PhoneIcon from '@material-ui/icons/Phone';
  import LocationOnIcon from '@material-ui/icons/LocationOn';
  import EmailIcon from '@material-ui/icons/Email';
  import InstagramIcon from '@material-ui/icons/Instagram';
  import FacebookIcon from '@material-ui/icons/Facebook';
  import insIcon from "../../../../assets/img/icon/instagram.png"
import fbIcon from "../../../../assets/img/icon/fb.png"
import { useSelector ,useDispatch} from "react-redux";
import ColorPicker from "../../../../components/ColorPicker/ColorPicker"
import SocialMediaButton from "../../../../components/Button/SocialMediaButton"
import { useTheme,makeStyles, createStyles, styled } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    btn: {
     
      height: 40,
      width: 40,
    },

   
  })
);

const FooterSetting = ({web,setWeb,handleChangeFooter}) => {
    const storeInfo = useSelector((state) => state.info.store);
    const storeSetting = storeInfo.store_configuration ? JSON.parse(storeInfo.store_configuration) : null

    const theme = useTheme();
    const classes = useStyles(theme);

  
    const email = storeInfo.email_configuration? JSON.parse(storeInfo.email_configuration).username: null


    const handleChangeBgColor = (color) => {
        var newWeb = { ...web };
        newWeb.footer.bgColor.r = color.rgb.r;
        newWeb.footer.bgColor.g = color.rgb.g;
        newWeb.footer.bgColor.b = color.rgb.b;
        newWeb.footer.bgColor.a = color.rgb.a;
        newWeb.footer.bgColor.hex = color.hex;
        setWeb(newWeb);
      };
      const handleChangeChecked= (e) => {
        var newWeb = { ...web };
        newWeb.footer.showSocial = e.target.checked;
        setWeb(newWeb);
      };
      const [displayColorPicker, setDisplayColorPicker] = React.useState(false);
function returnColor(type){
    if(type ==='0'){return '#fff'}
    else if(type ==='1'){return '#000'}
    else{return  `rgba(${web.mainColor.r}, ${web.mainColor.g}, ${web.mainColor.b}, ${web.mainColor.a})`}
}
const color = `rgba(${web.footer?.bgColor.r}, ${web.footer?.bgColor.g}, ${web.footer?.bgColor.b}, ${web.footer?.bgColor.a})`
const textColor = returnColor(web.footer.color)

return (
    <>
     <ListItem style={{margin:0, padding:0, marginBottom:8}}>
        <Typography style={{fontWeight:500, marginRight:20}}>Màu chữ </Typography>
        <FormControl component="fieldset">
            <RadioGroup name="color" value={web.footer.color.toString()} onChange={handleChangeFooter}>
            <div>
            <FormControlLabel value={"0"} control={<Radio color="primary"/>} label="Trắng" />
                <FormControlLabel value={"1"} control={<Radio color="primary" />} label="Đen" />
                <FormControlLabel value={"2"} control={<Radio color="primary"/>} label="Màu chính" />
            </div>
            </RadioGroup>
        </FormControl>
    </ListItem>
    <ColorPicker title={"Màu nền"} mainColor={web.footer?.bgColor}  handleChangeMainColor={handleChangeBgColor} displayColorPicker={displayColorPicker} setDisplayColorPicker={setDisplayColorPicker}/>
    <ListItem style={{margin:0, padding:0, marginBottom:8}}>
        <Typography style={{fontWeight:500, marginRight:20}}>Dạng social icon </Typography>
        <FormControl component="fieldset">
            <RadioGroup name="btnType" value={web.footer.btnType.toString()} onChange={handleChangeFooter}>
            <div>
                <FormControlLabel value={"0"} control={<Radio color="primary" />} label="Dạng icon" />
                <FormControlLabel value={"1"} control={<Radio color="primary"/>} label="Dạng logo" />
            </div>
            </RadioGroup>
        </FormControl>
    </ListItem>
    <FormControlLabel
        control={ <Checkbox  checked={web.footer.showSocial} onChange={handleChangeChecked} name="showSocial" /> }
        label="Hiển thị thanh mạng xã hội"
        />

    {/* // Mẫu */}
   { web.footer.showSocial? 
    <>
    <div style={{ flexGrow: 1,textAlign: "left",marginTop:20, marginBottom:-20, marginLeft:-10}}>
    <Box> <Fab className={classes.btn} onClick={()=>{   if(storeSetting.facebook) {window.open(storeSetting.facebook)}  }} >
        <Box component="img" sx={{ height: 40, width: 40, borderRadius: 2,}}
             src={ fbIcon} />
    </Fab></Box>
    <Box><Fab className={classes.btn} onClick={()=>{   if(storeSetting.facebook) {window.open(storeSetting.instagram)}  }}>
        <Box component="img" sx={{ height: 40, width: 40,  borderRadius: 2,}}
             src={insIcon} />
    </Fab></Box>
    </div>
    </>:null
}
    <div style={{minHeight:200, marginTop:40, background:color, padding:20}}>
    <Divider  style={{marginBottom:20}}/>

            <Grid container style={{color:textColor}} justifyContent="space-between">
                <Grid item >
                    <Typography variant='h4' style={{marginLeft:20, marginBottom:10,color:textColor}}>Liên hệ</Typography>     
                    <ListItem>
                        <PhoneIcon style={{marginRight:20}} />
                        <Typography >{storeInfo.phone} </Typography>                 
                    </ListItem>
                    <ListItem>
                        <LocationOnIcon  style={{marginRight:20}}/>
                        <Typography> {storeInfo.address} {storeInfo.ward} {storeInfo.district} {storeInfo.province}</Typography>                 
                    </ListItem>
                    <ListItem>
                        <EmailIcon style={{marginRight:20}} />
                        <Typography >{email}</Typography>                 
                    </ListItem>
                </Grid>
                <Grid item direction='column'>
                    <Typography variant='h4' style={{ marginBottom:25,color:textColor}}>Về chúng tôi</Typography>   
                    <Box  style={{ marginBottom:8, fontWeight:500}}><Link  href={null} underline="none" color="inherit"> Trang chủ</Link></Box>
                    <Box  style={{ marginBottom:8, fontWeight:500}}><Link  href={null} underline="none"  color="inherit"> Sản phẩm</Link></Box>
                    <Box  style={{ marginBottom:8, fontWeight:500}}><Link  href={null} underline="none"  color="inherit"> Cửa hàng</Link></Box>
                    <Box  style={{ marginBottom:8, fontWeight:500}}><Link  href={null} underline="none" color="inherit"> Giới thiệu</Link></Box>
                </Grid>
                <Grid item >
                    <Typography variant='h4' style={{ marginBottom:25,color:textColor}}>Hỗ trợ</Typography>     
                    <Box  style={{ marginBottom:8, fontWeight:500}}><Link  href={null} underline="none" color="inherit"> Khuyến mãi</Link></Box>
  
                       {/* ship, payment method, đổi trả, size guide */}
          
                </Grid>
                <Grid  item >
                    <Typography variant='h4' style={{ marginBottom:25,color:textColor}}>Thông tin</Typography>     
                    {web.footer.btnType === '0'?
                    <>
                    <FacebookIcon style={{marginRight:10}}  onClick={()=>{   if(storeSetting.facebook) {window.open(storeSetting.facebook)}  }} />
                    <InstagramIcon  onClick={()=>{if(storeSetting.instagram) {window.open(storeSetting.instagram)} }}/>
                    </>:
                    <>
                    <Box component="img" sx={{ height: 25, width: 25, marginLeft: 7,marginRight: 7, borderRadius: 2,}}
                            src={fbIcon} onClick={()=>{   if(storeSetting.facebook) {window.open(storeSetting.facebook)}  }}/>
                    <Box component="img" sx={{ height: 25, width: 25, marginLeft: 7,marginRight: 7, borderRadius: 2,}}
                        src={ insIcon} onClick={()=>{if(storeSetting.instagram) {window.open(storeSetting.instagram)} }} />
                    </>}
                </Grid>
            </Grid>
        </div>

    </>
  )
}

export default FooterSetting