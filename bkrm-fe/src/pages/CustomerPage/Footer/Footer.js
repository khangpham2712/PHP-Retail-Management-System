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
    // Link
  } from "@material-ui/core";
  import PhoneIcon from '@material-ui/icons/Phone';
  import LocationOnIcon from '@material-ui/icons/LocationOn';
  import EmailIcon from '@material-ui/icons/Email';
  import InstagramIcon from '@material-ui/icons/Instagram';
  import FacebookIcon from '@material-ui/icons/Facebook';
  import insIcon from "../../../assets/img/icon/instagram.png"
import fbIcon from "../../../assets/img/icon/fb.png"
import { useSelector ,useDispatch} from "react-redux";
import { useParams } from "react-router-dom";
import SocialMediaButton from "../../../components/Button/SocialMediaButton";

import { Route, useRouteMatch } from "react-router-dom";
import { Link } from "react-router-dom";

const Footer = ({web}) => {
    const {storeInfo} = useSelector(state => state.customerPage)
    const storeSetting = storeInfo.store_configuration ? JSON.parse(storeInfo.store_configuration) : null
    let { url } = useRouteMatch();
    const email = storeInfo.email_configuration? JSON.parse(storeInfo.email_configuration).username: null

    function returnColor(type){
        if(type ==='0'){return '#fff'}
        else if(type ==='1'){return '#000'}
        else{return  `rgba(${web.mainColor.r}, ${web.mainColor.g}, ${web.mainColor.b}, ${web.mainColor.a})`}
    }
    const color = `rgba(${web.footer?.bgColor.r}, ${web.footer?.bgColor.g}, ${web.footer?.bgColor.b}, ${web.footer?.bgColor.a})`
    const textColor = returnColor(web.footer.color)
    // const textColor = '#000'

    return (
        <div style={{minHeight:200, marginTop:140, background:color, padding:20}}>
            { web.footer.showSocial? <SocialMediaButton /> :null}
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
                    <Box  style={{ marginBottom:8, fontWeight:500,}} ><Typography style={{ color:textColor}}component={Link}  to={`${url}`}> Trang chủ</Typography> </Box>
                    <Box  style={{ marginBottom:8, fontWeight:500, }} ><Typography style={{ color:textColor}} component={Link} > Sản phẩm</Typography>  </Box>
                    <Box  style={{ marginBottom:8, fontWeight:500, }} ><Typography style={{ color:textColor}} component={Link}  to={`${url}/storeInfo`}> Cửa hàng</Typography> </Box>
                    <Box  style={{ marginBottom:8, fontWeight:500,}} ><Typography  style={{ color:textColor}} component={Link} > Giới thiệu</Typography> </Box>
                </Grid>
                <Grid item >
                    <Typography variant='h4' style={{ marginBottom:25,color:textColor}}>Hỗ trợ</Typography>     
                    <Box  style={{ marginBottom:8, fontWeight:500}} ><Typography style={{ color:textColor}}  component={Link}> Khuyến mãi</Typography> </Box>
                       {/* ship, payment method, đổi trả, size guide */}
          
                </Grid>
                <Grid  item >
                    <Typography variant='h4' style={{ marginBottom:25,color:textColor}}>Thông tin</Typography>     
                    {web.footer.btnType === '0'?
                    <>
                    <FacebookIcon style={{marginRight:10,cursor: 'pointer'}}  onClick={()=>{   if(storeSetting.facebook) {window.open(storeSetting.facebook)}  }} />
                    <InstagramIcon style={{cursor: 'pointer'}} onClick={()=>{if(storeSetting.instagram) {window.open(storeSetting.instagram)} }}/>
                    </>:
                    <>
                    <Box component="img" sx={{ height: 25, width: 25, marginLeft: 7,marginRight: 7, borderRadius: 2,cursor: 'pointer'}}
                            src={fbIcon} onClick={()=>{   if(storeSetting.facebook) {window.open(storeSetting.facebook)}  }}/>
                    <Box component="img" sx={{ height: 25, width: 25, marginLeft: 7,marginRight: 7, borderRadius: 2,cursor: 'pointer'}}
                        src={ insIcon} onClick={()=>{if(storeSetting.instagram) {window.open(storeSetting.instagram)} }} />
                        </>}
                </Grid>
            </Grid>
        </div>
    )
}

export default Footer
