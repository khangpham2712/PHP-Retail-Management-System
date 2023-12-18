import React, { useState, useEffect } from "react";
import { useTheme, makeStyles, styled } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
//import library
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Typography,
  Box,
  Button,
  Grid,
  CardMedia,
  Container,
  Divider,
  TextField
} from "@material-ui/core";
//import icons
import MenuIcon from "@material-ui/icons/Menu";

import video from "../../assets/img/mainPage/video_thesis.mov";
import video1 from "../../assets/img/mainPage/clickVid.mov";
// import app from '../../assets/img/mainPage/Screen Shot 2021-10-26 at 21.16.29.png'
// import app1 from '../../assets/img/mainPage/Screen Shot 2021-10-26 at 21.17.43.png'
import app from "../../assets/img/mainPage/Order - new.png";
import app1 from "../../assets/img/mainPage/Create new product.png";
import web from "../../assets/img/mainPage/web.png";
import web1 from "../../assets/img/mainPage/web1.png";
import web2 from "../../assets/img/mainPage/web2.png";
import web3 from "../../assets/img/mainPage/web3.png";
import inventoryIcon from "../../assets/img/icon/inventory2.png"
import { borderColor } from "@material-ui/system";
import { grey } from "@material-ui/core/colors";
import { Link } from "react-router-dom";
import suplierIcon from "../../assets/img/icon/supplier4.png";
import invoiceIcon from "../../assets/img/icon/invoice.png";
import inventoryOrderIcon from "../../assets/img/icon/inventoryOrder1.png";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    background: theme.palette.background.default,
  },
  appBar: {
    background: theme.palette.background.paper,
    padding: 15,
    boxShadow: "none",
  },
  toolBar: {
    background: theme.palette.background.paper,
    color: theme.customization.themeGreyText,
  },
  btnNav: {
    textTransform: "none",
    marginRight: 10,
  },
  videosm: {
    width: "50%",
  },
  videoupsm: {
    width: "95%",
  },
  color: {},
}));
const ColorButton = styled(Button)(({ theme }) => ({
  color: "#ffffff",
  backgroundColor: "#ff906d",
  width: 100,
  "&:hover": {
    backgroundColor: "#fa6232",
  },
}));
const ColorOutlineButton = styled(Button)(({ theme }) => ({
  color: "#ff906d",
  borderColor: "#ff906d",
  "&:hover": {
    backgroundColor: "#fff0eb",
  },
}));

const MainPage = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const matchDownXs = useMediaQuery(theme.breakpoints.down("xs"));
  const matchDownSm = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item sm={2}>
              <Typography variant="h3" noWrap className={classes.searchEngine}>
                BKRM
              </Typography>
            </Grid>
            {/* {matchDownSm ? ( */}
              {false ? (
              <Grid>
                <IconButton
                  aria-label="open drawer"
                  onClick={() => {}}
                  edge="start"
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
            ) : (
              <Grid container item sm={10} direction="row" alignItems="center">
                <Grid container item sm={8} direction="row">
                  <Button className={classes.btnNav}
                   component={Link}
                   to="/main"
                   >
                     Trang chủ
                    </Button>
                  <Button className={classes.btnNav}>Giới thiệu</Button>
                  <Button className={classes.btnNav}>Hỗ trợ</Button>
                  <Button className={classes.btnNav}>Liên hệ</Button>
                  {/* <Button className={classes.btnNav}>Giới thiệu</Button> */}
                </Grid>
                <Grid
                  container
                  item
                  sm={4}
                  direction="row"
                  justifyContent="flex-end"
                >
                  <Box  component={Link} to="/login">
                  <ColorOutlineButton
                    className={classes.btnNav}
                    variant="outlined"
                    style={{ borderRadius: 20, marginBottom: 5 }}
                 
                  >
                    
                    Đăng nhập
                  </ColorOutlineButton>
                  </Box>
                  <Box component={Link} to="/signup">
                  <ColorButton
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
                  </Box>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Toolbar>
      </AppBar>

      <Box style={{ marginTop: 130 }}>
        {/* SECTION 1 */}
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid
            container
            item
            xs={12}
            sm={6}
            direction="column"
            style={{ paddingLeft: 45, paddingRight: 20 }}
          >
            {matchDownXs ? null : (
              <Grid container direction="row" justifyContent="flex-end">
                <video
                  // loop={false}
                  loop={true}
                  autoPlay={true}
                  muted={true}
                  style={{ width: "12%" }}
                >
                  <source src={video1} type="video/mp4" />
                </video>
              </Grid>
            )}
            <Typography
              style={{
                fontSize: matchDownXs ? "10vw" : "6vw",
                color: theme.customization.themeText,
              }}
            >
              Phần mềm
            </Typography>
            <Typography
              style={{
                fontSize: matchDownXs ? "10vw" : "6vw",
                color: theme.customization.themeText,
                marginBottom: 20,
              }}
            >
              Quản lý bán lẻ
            </Typography>
            <Grid container style={{ marginBottom: 40 }} direction="row">
              <Grid container item xs={1} style={{ marginRight: -10 }}>
                <Divider
                  orientation="vertical"
                  flexItem
                  style={{ width: 2, backgroundColor: "#ff906d" }}
                />
              </Grid>
              <Grid container item xs={11}>
                <Typography
                  style={{
                    fontSize: 14,
                    color: theme.customization.themeGreyText,
                    paddingRight: 50,
                  }}
                >
                  Hỗ trợ bạn tự động hóa quy trình bán hàng từ việc quản lý tồn kho, bán hàng,
                  nhân sự, nhà cung cấp, khách hàng,... Đơn giản, dễ dùng, tiết kiệm chi phí và phù hợp với nhiều ngành hàng khác nhau. 
                  Đồng thời, bạn cũng có thể tự tạo trang web bán hàng online của riêng mình chỉ với vài thao tác đơn giản.
                </Typography>
              </Grid>
            </Grid>
            <Box component={Link} to="/signup">
              <ColorButton
                className={classes.btnNav}
                variant="contained"
                color="secondary"
                style={{ borderRadius: 20, width: 160 }}
              >
                Dùng thử miễn phí
              </ColorButton>
            </Box>
          </Grid>

          <Grid container item xs={12} sm={6} justifyContent="center">
            <video
              // loop={false}
              loop={true}
              autoPlay={true}
              muted={true}
              className={matchDownXs ? classes.videosm : classes.videoupsm}
            >
              <source src={video} type="video/mp4" />
            </video>
          </Grid>
        </Grid>
        <Box style={{marginLeft: matchDownSm ? "15%" : "10%",marginRight: matchDownSm ? "10%" : "15%",marginTop:200}}>
        <Grid container justifyContent="center" spacing={3} >
              <Grid xs={3}  item container alignItems="center" justifyContent="center">
                  <Box component="img" sx={{ height: 70, width: 70, marginBottom:10 }} src={inventoryIcon}/>
                  <Box style={{flexGrow:1, textAlign:'center'}}>
                    <Typography variant="h4" >
                      Quản lý tồn kho
                    </Typography>
                    <Typography  >
                      Quản lý hàng theo thuộc tính (size, màu,...), quản lý theo lô/ hạn sử dụng
                    </Typography>
                  </Box>
          
              </Grid>
              <Grid xs={3}  item container alignItems="center" justifyContent="center">
                  <Box component="img" sx={{ height: 70, width: 70, marginBottom:10 }} src={invoiceIcon}/>
                  <Box style={{flexGrow:1, textAlign:'center'}}>
                    <Typography variant="h4" >
                    Quản lý bán hàng
                    </Typography>
                    <Typography  >
                      Bán hàng nhanh, theo dõi công nợ, áp dụng khuyến mãi
                    </Typography>
                  </Box>
          
              </Grid>
              <Grid xs={3}  item container alignItems="center" justifyContent="center">
                  <Box component="img" sx={{ height: 70, width: 70, marginBottom:10 }} src={inventoryOrderIcon}/>
                  <Box style={{flexGrow:1, textAlign:'center'}}>
                    <Typography variant="h4" >
                     Trang web bán hàng
                    </Typography>
                    <Typography  >
                      Hỗ trợ tạo website bán hàng nhanh, tiết kiệm
                    </Typography>
                  </Box>
          
              </Grid>
              <Grid xs={3}  item container alignItems="center" justifyContent="center">
                  <Box component="img" sx={{ height: 70, width: 70, marginBottom:10 }} src={suplierIcon}/>
                  <Box style={{flexGrow:1, textAlign:'center'}}>
                    <Typography variant="h4" >
                      Tự động hoá
                    </Typography>
                    <Typography  >
                      Tự động hoá cơ bản giúp giảm thiểu sai sót
                    </Typography>
                  </Box>
          
              </Grid>
             
        </Grid>
        </Box>

        {/* SECTION 2 */}
        <Grid container justifyContent="center"  
          style={{
              backgroundColor: "#f3fdff",
              marginTop: 150,
              justifyContent: "center",
              alignContent:"center"
            }}>
          {/* <Box
           
          > */}
              <Grid item container xs={12} justifyContent="center">
                <Typography variant="h2" style={{marginTop:40}}>
                Nắm bắt tồn kho nhanh, bổ sung hàng kịp thời.
                  </Typography>
                  </Grid>
                  <Grid item container xs={12} justifyContent="center">
                  <Typography style={{color:'#000',fontSize:16,marginTop:20, marginBottom:30,  width: matchDownSm ? "90%" : "70%",}}>
                  Tối thiểu thất thoát hàng hóa nhờ tính năng kiểm kho chính xác. Quản lý số lượng xuất - nhập - tồn mỗi loại hàng hóa chính xác. Cảnh báo hàng sắp hết, hàng tồn nhiều... để bổ sung hoặc xả hàng kịp thời.          
                  </Typography>
              </Grid>
              <Box
                component="img"
                sx={{
                  height: matchDownSm ? "90%" : "70%",
                  width: matchDownSm ? "90%" : "70%",
                  borderRadius: matchDownXs ? 10 : 20,
                 
                  // marginRight:15,
                }}
                border={1}
                borderColor={grey[400]}
                src={web2}
              />
               <Grid item container xs={12} justifyContent="center">
               <Typography variant="h2" style={{marginTop:40}}>
                    Thanh toán nhanh chóng, in hóa đơn tiện lợi
                  </Typography>
                  </Grid>
                  <Grid item container xs={12} justifyContent="center">
                  <Typography style={{color:'#000',fontSize:16,marginTop:20, marginBottom:30, width: matchDownSm ? "90%" : "70%",}}>
                  Quét mã vạch tìm hàng nhanh, tự động tính tiền chính xác, kết nối máy in hóa đơn tiện lợi. Tăng tốc bán hàng, đảm bảo chính xác, giảm thiểu nhầm lẫn.              Quét mã vạch tìm hàng nhanh, tự động tính tiền chính xác, kết nối máy in hóa đơn tiện lợi. Tăng tốc bán hàng, đảm bảo chính xác, giảm thiểu nhầm lẫn.
               </Typography>
              </Grid>
               <Box
                component="img"
                sx={{
                  height: matchDownSm ? "90%" : "70%",
                  width: matchDownSm ? "90%" : "70%",
                  borderRadius: matchDownXs ? 10 : 20,
                  // marginRight:15,
                }}
                border={1}
                borderColor={grey[400]}
                src={web3}
              />
              
              {/* <Grid item container xs={12} justifyContent="center">
                <Typography variant="h2" style={{marginTop:40, width: matchDownSm ? "90%" : "70%",}}>
                  Báo cáo doanh thu lỗ lãi rõ ràng
                  </Typography>
                  </Grid>
                  <Grid item container xs={12} justifyContent="center">
                  <Typography style={{color:'#000',fontSize:16,marginTop:20, marginBottom:30, width: matchDownSm ? "90%" : "70%",}}>
                  Tự động thống kê báo cáo chi tiết về doanh thu, lợi nhuận, chi phí... mỗi ngày. Cập nhật biến động lãi lỗ, tình hình kinh doanh mọi lúc mọi nơi trên các thiết bị: Điện thoại, máy tính, laptop... Giúp chủ shop theo dõi sát sao hiệu quả bán hàng để có kế hoạch kinh doanh phù hợp.               </Typography>
              </Grid> */}
          {/* </Box> */}
        </Grid>

        {/* SECTION 3 */}
        <Grid>
          <Container
            style={{
              backgroundColor: "#f3fdff",
              marginTop: 150,
              justifyContent: "center",
            }}
          >
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Box
                component="img"
                sx={{
                  height: "22%",
                  width: "22%",
                  borderRadius: matchDownXs ? 10 : 30,
                  marginRight: 15,
                }}
                border={1}
                borderColor={grey[400]}
                src={app1}
              />
              <Box
                component="img"
                sx={{
                  height: "22%",
                  width: "22%",
                  borderRadius: matchDownXs ? 10 : 30,
                }}
                border={1}
                borderColor={grey[400]}
                src={app}
              />
             
            </Grid>
          </Container>
        </Grid>

        {/* SECTION 4 */}

        <Grid item container xs={12} justifyContent="center">
          <Typography variant="h1" style={{marginTop:200, marginBottom:50}}>
            Liên hệ
            </Typography>
        </Grid>
        <Box style={{marginLeft:matchDownXs?10:150,marginRight:matchDownXs?10:150}}>
        <Grid  container  justifyContent="center" >
          <Grid item container style={{marginBottom:15}} justifyContent="space-between" >
            <Grid xs={8}><TextField label="Họ và tên" variant="outlined" fullWidth /> </Grid>
            <Grid xs={4}><TextField  label="Số điện thoại" variant="outlined"  fullWidth/> </Grid>
          </Grid>
          {/* <Grid item  container> */}
            <TextField style={{marginBottom:15}} label="Email" variant="outlined" fullWidth />
          {/* </Grid> */}
          {/* <Grid item container> */}
            <TextField  label="Nội dung" variant="outlined"  fullWidth/>
          {/* </Grid> */}
        </Grid>
        </Box>

        {/* FOOTER */}
        <Grid>
          {/* <Container
            style={{
              backgroundColor: "#ff906d",
              marginTop: 150,
              // justifyContent: "center",
            }}
          > */}
            <Grid
              // container
              direction="row"
              // justifyContent="center"
              // alignItems="center"
            >
              <Box
              style={{backgroundColor: "#ff906d", marginTop: 150,}}
                sx={{
                  height: 200,
                  // width:"100%",
                  // width: matchDownSm ? "90%" : "70%",
                  // borderRadius: matchDownXs ? 10 : 20,
                  // marginRight: 15,
                }}
              />
            </Grid>
          {/* </Container> */}
        </Grid>
      </Box>
    </div>
  );
};

export default MainPage;
