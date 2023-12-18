import React from 'react'
import { Typography,Toolbar,Fab,Button,Badge,Select,MenuItem,InputAdornment,FormControlLabel,FormLabel,CardHeader,IconButton,Collapse,FormControl,RadioGroup,TextField, ListItem,Card, Radio,Grid, ButtonBase, Tooltip } from "@material-ui/core";
import { useTheme, makeStyles,styled ,lighten,darken} from "@material-ui/core/styles";
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import {ColorButton,ColorOutlineButton} from "../../../../components/Button/ColorButton"
import ShoppingCartTwoToneIcon from "@material-ui/icons/ShoppingCartTwoTone";
import { ThousandSeperatedInput } from '../../../../components/TextField/NumberFormatCustom';

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
}));


const NavBarSetting = ({web,handleChangeNavBar,logo,setWeb}) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const mainColor=`rgba(${ web.mainColor.r }, ${ web.mainColor.g }, ${ web.mainColor.b }, ${ web.mainColor.a })`
    const {buttonLogin,buttonCart,navColor,textNav} = web.navBar;

    function handleColor (type) {
        if(type===0){return '#000'}
        else if (type===1){return '#fff'}
        else if (type===3){return mainColor}
        else{return theme.darkTextPrimary }
    }
    const textColor = handleColor(parseInt(textNav[0]));
    const textSize = parseInt(textNav[1])
    const textBold = parseInt(textNav[2])

    const handleChangeNavBarIndex = (event, index)=>{
        var newWeb = {...web};
        newWeb.navBar.textNav[index] = event.target.value;
        setWeb(newWeb)
    }
      
    return (
        <>

        <ListItem style={{margin:0, padding:0, marginBottom:8}}>
                <Typography style={{fontWeight:500, marginRight:20}}>Nút đăng nhập </Typography>
                <FormControl component="fieldset">
                  <RadioGroup name="buttonLogin" value={web.navBar.buttonLogin} onChange={handleChangeNavBar}>
                    <div>
                      <FormControlLabel value={"0"} control={<Radio color="primary" />} label="Kiểu 1" />
                      <FormControlLabel value={"1"} control={<Radio color="primary"/>} label="Kiểu 2" />
                    </div>
                  </RadioGroup>
              </FormControl>
          </ListItem>
          <ListItem style={{margin:0, padding:0, marginBottom:8}}>
                <Typography style={{fontWeight:500, marginRight:20}}>Nút giỏ hàng </Typography>
                <FormControl component="fieldset">
                  <RadioGroup  name="buttonCart" value={web.navBar.buttonCart} onChange={handleChangeNavBar}>
                    <div>
                      <FormControlLabel value={"0"} control={<Radio color="primary"/>} label="Kiểu 1" />
                      <FormControlLabel value={"1"} control={<Radio color="primary"/>} label="Kiểu 2" />
                    </div>
                  </RadioGroup>
              </FormControl>
          </ListItem>
          <ListItem style={{margin:0, padding:0, marginBottom:8}}>
              <Typography style={{fontWeight:500, marginRight:20}}>Màu thanh công cụ </Typography>
              <FormControl component="fieldset">
                <RadioGroup name="navColor" value={web.navBar.navColor} onChange={handleChangeNavBar}>
                  <div>
                    <FormControlLabel value={"0"} control={<Radio color="primary" />} label="Màu trắng" />
                    <FormControlLabel value={"1"} control={<Radio color="primary"/>} label="Màu chính" />
                  </div>
                </RadioGroup>
            </FormControl>
        </ListItem>
        <ListItem style={{margin:0, padding:0, marginBottom:8}}>
              <Typography style={{fontWeight:500, marginRight:20}}>Màu chữ </Typography>
              <FormControl component="fieldset">
                <RadioGroup name="textNav" value={web.navBar.textNav[0]} onChange={(event)=>handleChangeNavBarIndex(event, 0)}>
                  <div>
                    <FormControlLabel value={"0"} control={<Radio color="primary" />} label="Đen" />
                    <FormControlLabel value={"1"} control={<Radio color="primary"/>} label="Trắng" />
                    <FormControlLabel value={"2"} control={<Radio color="primary"/>} label="Xám" />
                    <FormControlLabel value={"3"} control={<Radio color="primary"/>} label="Màu chính" />
                  </div>
                </RadioGroup>
            </FormControl>
        </ListItem>
        <ListItem style={{margin:0, padding:0, marginBottom:8}}>
              <Typography style={{fontWeight:500, marginRight:30,width:55 }}>Cỡ chữ </Typography>   
              <Grid container  >
                <Grid item className={classes.swatch} style={{width:40}}><ThousandSeperatedInput value={web.navBar.textNav[1]} onChange={(event)=>handleChangeNavBarIndex(event, 1)}/></Grid>
                <Grid item className={classes.swatch} style={{width:30, backgroundColor:"#E4E4E4"}}>px</Grid>
            </Grid>
            </ListItem>

        <ListItem style={{margin:0, padding:0, marginBottom:8}}>
              <Typography style={{fontWeight:500, marginRight:20, }}>Độ dày chữ </Typography>   
              <FormControl size="small" variant="outlined" className={classes.formControl} >
                <Select
                    value={web.navBar.textNav[2]}
                    onChange={(event)=>handleChangeNavBarIndex(event, 2)}
                    >
                    <MenuItem value={300}>300</MenuItem>
                    <MenuItem value={400}>400</MenuItem>
                    <MenuItem value={500}>500</MenuItem>
                    <MenuItem value={600}>600</MenuItem>
                    <MenuItem value={700}>700</MenuItem>
                    </Select>
                </FormControl>
            </ListItem>



        {/* Mẫu */}
        <Toolbar
          className={classes.toolBar}
          style={{
            background: parseInt(web.navBar.navColor) ? mainColor : theme.palette.background.paper,
          }}
        >

        <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item sm={2}>
             {logo? <img src={logo} style={{height:50}}/>:
             <Typography variant='h3'>BKRM</Typography>}
            </Grid>
            <Grid container item sm={10} direction="row" alignItems="center">
                <Grid container item sm={8} direction="row">
                    <Button
                        className={classes.btnNav}
                        style={{
                        color: textColor,
                        fontWeight: textBold,
                        fontSize: textSize,
                        }}
                    >
                    Trang chủ
                  </Button>
                  <Button
                        className={classes.btnNav}
                        style={{
                        color: textColor,
                        fontWeight: textBold,
                        fontSize: textSize,
                        }}
                    >
                    Sản phẩm
                  </Button>
                  <Button
                        className={classes.btnNav}
                        style={{
                        color: textColor,
                        fontWeight: textBold,
                        fontSize: textSize,
                        }}
                    >
                    Cửa hàng
                  </Button>
                </Grid>
                <Grid
                  container
                  item
                  sm={4}
                  direction="row"
                  justifyContent="flex-end"
                >
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
                   {parseInt(buttonCart) === 1 ? 
                    <div style={{backgroundColor:parseInt(navColor) === 0? mainColor:'#fff',width:37, height:37,marginTop:2,paddingTop:7, paddingLeft:7,borderRadius:40,marginLeft:15}}
                   
                    >
                      <Tooltip title="Giỏ hàng">
                        <StyledBadge color="error" badgeContent={3}>
                          <ShoppingCartIcon  style={{color:parseInt(navColor) === 0?"#fff":mainColor}}/>
                        </StyledBadge>
                      </Tooltip>
                  </div>
                 :null
                  }
                 
                </Grid>
            </Grid>
        </Grid>
            
        </Toolbar>
        {parseInt(web.navBar.buttonCart) === 0 ?
          <div style={{ flexGrow: 1,textAlign: "right",marginTop:15}}>
            <Fab
            aria-label="add"
            className={classes.btn}
            >
            <ButtonBase size="large" style={{ margin: 10 }}>
              <StyledBadge color="error" badgeContent={3}>
                <ShoppingCartTwoToneIcon />
              </StyledBadge>
            </ButtonBase>
          </Fab>
        </div>:null
        }

            
        </>
    )
}

export default NavBarSetting


const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      border: `1px solid #000`,
      padding: "0 4px",
    },
  }));