import React,{useState,useEffect} from "react";
import { useTheme, makeStyles, styled ,lighten,darken} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
//import library
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Grid,
  Tooltip,
  ButtonBase,
  Avatar,
  Badge,
  List,
  Drawer,
  ListItem,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core";
//import icons
import MenuIcon from "@material-ui/icons/Menu";
import HoverMenuBtn from "../../../components/Button/HoverMenuBtn";
import { Link, useRouteMatch } from "react-router-dom";
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import ShoppingCartTwoToneIcon from '@material-ui/icons/ShoppingCartTwoTone';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import {ColorButton,ColorOutlineButton} from "../../../components/Button/ColorButton"
import clsx from 'clsx';
import icon from "../../../assets/img/icon/lip.jpeg"
const useStyles = makeStyles((theme) => ({
    appBar: {
        paddingLeft: 20,
        paddingRight: 20,
        boxShadow: "none",
    },
    toolBar: {
        color: theme.customization.themeGreyText,
    },
    btnNav: {
        textTransform: "none",
        marginRight: 10,
    },   
}));

const NavBar = (props) => {
    const {storeInfo,logo,category,number,changeBranch} = props;
    const {buttonLogin,buttonCart,navColor,textNav} = props.webInfo.navBar;
    const  hasAboutUs = props.webInfo.other.status
    const mainColor=`rgba(${ props.webInfo.mainColor.r }, ${ props.webInfo.mainColor.g }, ${ props.webInfo.mainColor.b }, ${ props.webInfo.mainColor.a })`
    const branches = storeInfo.branches
    const webSetting = storeInfo.web_configuration? JSON.parse(storeInfo.web_configuration):null
    const branchOption = webSetting?.orderManagement.branchOption
    // 
    let { url } = useRouteMatch();
    const theme = useTheme();
    const classes = useStyles(theme);
    const matchDownSm = useMediaQuery(theme.breakpoints.down("sm"));

    // customization
    function handleColor (type) {
      if(type===0){return '#000'}
      else if (type===1){return '#fff'}
      else if (type===3){return mainColor}
      else{return theme.darkTextPrimary }
    }
    const textColor = handleColor(parseInt(textNav[0]));
    const textSize = parseInt(textNav[1])
    const textBold = parseInt(textNav[2])
  
    //
    const [state, setState] = React.useState(false);
    const toggleDrawer = (open) => {
      setState(open);
    };

    const [selectedBranch, setSelectedBranch] = useState(localStorage.getItem(storeInfo.uuid));

    // useEffect(()=>{
    //   setSelectedBranch( localStorage.getItem(storeInfo.uuid))
    // },[])
    const drawer = () => (
      <div
        className={clsx(classes.list)}
        role="presentation"
        onClick={()=>toggleDrawer(false)}
        onKeyDown={()=>toggleDrawer(false)}
      >
        <List>
          {[{text:'Trang chủ', link:''}, {text:'Sản phẩm', link:''}, {text:'Cửa hàng', link:'storeInfo'}].map((tab, index) => {
            if(tab.text !== "Sản phẩm" ){
              return(
              <>
                <ListItem button key={tab.text} style={{width:220, margin:7}}
                component={Link}
                to={`/store/${props.storeInfo?.web_page}/${tab.link}`}>
                <Typography style={{ color: '#000',  fontWeight: textBold,  fontSize: textSize,}}>
                  {tab.text} 
                </Typography>
              </ListItem>
                <Divider />
              </>
              )
            }else{
              return( /* Sửa Link Sản Phẩm Sau */
              <>
              <ListItem button key={tab.text}  style={{width:220, margin:7}}>  
                <Typography   style={{ color: '#000',  fontWeight: textBold, fontSize: textSize,}}>
                  {tab.text} 
                </Typography>
               </ListItem>
               <Divider />
            </>)
            }})}
        </List>
      </div>
    );

    return (
      <AppBar
        position="fixed"
        className={classes.appBar}
        style={{
          background: parseInt(navColor) ? mainColor : theme.palette.background.paper,
        }}
      >
        <Toolbar
          className={classes.toolBar}
          style={{
            background: parseInt(navColor) ? mainColor : theme.palette.background.paper,
          }}
        >
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item sm={2} 
            component={Link}
            to={`${url}`}
            >
             {logo? <img src={logo} style={{height:45,marginTop:-5,marginBottom:-5}}/> : 
              <Typography variant="h3" >  BKRM </Typography>
            }
            </Grid>
            {/* Small screen */}
            {matchDownSm ? (
              <Grid>
                <IconButton
                  aria-label="open drawer"
                  onClick={()=>toggleDrawer( true)}
                  edge="start"
                  style={{ marginBottom: -5 }}
                >
                  <MenuIcon />
                </IconButton>
                <React.Fragment key={'right'}>
                  <Drawer anchor="right" open={state} onClose={()=>toggleDrawer(false)}>
                    {drawer()}
                  </Drawer>
                </React.Fragment>
              </Grid>
            ) : (
              //Nav bar
              <Grid container item sm={10} direction="row" alignItems="center">
                <Grid container item sm={7} direction="row">
                  <Button
                    className={classes.btnNav}
                    component={Link}
                    to={`${url}`}
                    style={{
                      color: textColor,
                      fontWeight: textBold,
                      fontSize: textSize,
                    }}
                  >
                    Trang chủ
                  </Button>
                  <HoverMenuBtn
                    className={classes.btnNav}
                    category={category}
                    mainColor={mainColor}
                    textColor={textColor}
                    textSize={textSize}
                    textBold={textBold}
                  >
                  </HoverMenuBtn>
                  {/* <Button
                    className={classes.btnNav}
                    component={Link}
                    to={`${url}/promotion`}
                    style={{
                      color: textColor,
                      fontWeight: textBold,
                      fontSize: textSize,
                    }}
                  >
                    Khuyến mãi
                  </Button> */}
                  <Button
                    className={classes.btnNav}
                    component={Link}
                    to={`${url}/storeInfo`}
                    style={{
                      color: textColor,
                      fontWeight: textBold,
                      fontSize: textSize,
                    }}
                  >
                    Cửa hàng
                  </Button>
                 {hasAboutUs? <Button
                    className={classes.btnNav}
                    component={Link}
                    to={`${url}/aboutUs`}
                    style={{
                      color: textColor,
                      fontWeight: textBold,
                      fontSize: textSize,
                    }}
                  >
                    Giới thiệu
                  </Button>:null}
                </Grid>

                {/* Nút đặng nhập */}
                <Grid
                  container
                  item
                  sm={5}
                  direction="row"
                  justifyContent="flex-end"
                  alignItems='center'
                >
                {branchOption === 'choose'?
                 <Box style={{marginRight:20}}>
                <FormControl variant="standard" sx={{ m: 1, width: 100 }} fullWidth>
                  {/* <InputLabel>Chi nhánh</InputLabel> */}
                  <Select
                    style={{backgroundColor:"#fff",padding:5, borderRadius:30}}
                    value={selectedBranch?selectedBranch:localStorage.getItem(storeInfo.uuid)}
                    // label="Chi nhánh"
                    // variant='contained'
                    onChange={(e)=>{
                      localStorage.setItem(storeInfo.uuid , e.target.value);
                      setSelectedBranch(e.target.value)


                     
                      changeBranch();


                    }}
                  >
                    {branches?.map(branch => {
                        return (
                          <MenuItem key={branch.uuid} value={branch.id}>
                            {branch.name}
                          </MenuItem>
                        );
                    })}
                  </Select>
                </FormControl>
                </Box>:null}
                  {parseInt(buttonLogin) == 0? 
                  <>
                   <ColorOutlineButton
                   mainColor={mainColor}
                   navColor={parseInt(navColor)}
                   className={classes.btnNav}
                   variant="outlined"
                   style={{ borderRadius: 20, marginBottom: 5 }}
                 >
                   Đăng nhập
                 </ColorOutlineButton>
                 <ColorButton
                   mainColor={mainColor}
                   navColor={parseInt(navColor)}
                   className={classes.btnNav}
                   variant="contained"
                   color="secondary"
                   style={{
                     borderRadius: 20,
                     marginLeft: 10,
                     marginBottom: 5,
                   }}
                 >
                   Đăng ký
                 </ColorButton>
                 </>
                  : 
                  <AccountCircleRoundedIcon  style={{width:40, height:40, color:parseInt(navColor) === 0? mainColor:"#fff"}}/>
                  }
                  {/* Nút cart */}
                  {parseInt(buttonCart) === 1 ? 
                    <div style={{backgroundColor:parseInt(navColor) === 0? mainColor:'#fff',width:37, height:37,marginTop:2,paddingTop:7, paddingLeft:7,borderRadius:40,marginLeft:15}}
                    component={Link}
                    to={`${url}/cart`}
                    >
                      <Tooltip title="Giỏ hàng">
                        <StyledBadge color="error" badgeContent={number}>
                          <ShoppingCartIcon  style={{color:parseInt(navColor) === 0?"#fff":mainColor}}/>
                        </StyledBadge>
                      </Tooltip>
                  </div>
                 :null
                  }
                 
                </Grid>
              </Grid>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
    );
}

export default NavBar

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    border: `1px solid #000`,
    padding: "0 4px",
  },
}));