import React from 'react'
import { useTheme, makeStyles, styled } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import TableHeader  from '../../components/TableCommon/TableHeader/TableHeader'
import TableWrapper from '../../components/TableCommon/TableWrapper/TableWrapper'
import {ThousandFormat} from '../../components/TextField/NumberFormatCustom'
import moment from "moment";
import setting from "../../assets/constant/setting"
import {Docso} from "../../utils"
import  clsx from "clsx"
//import library
import {
    Grid,
    Card,
    Box,
    Tabs,
    Tab,
    TableContainer,
    CardContent,
    CardMedia,
    CardActionArea,
    FormControlLabel,
    Switch,
    Menu,
    MenuItem,
    ListItem,
    IconButton,
    TableBody,
    Typography,
    Table,
    TableHead,
    TableRow,TableCell,Divider
  } from "@material-ui/core";
  import ReactQuill, {Quill} from 'react-quill';
  import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
        textAlign: "center",
        // fontSize: "13.5px",
        // fontSize: "12em",
        fontWeight: 700,
        marginTop:10,
        color: "#000",
    },
    centerQR:{
        flexGrow: 1,
        textAlign: "center",
       
    },
    center:{
        flexGrow: 1,
        textAlign: "center",
        color: "#000",
        fontSize:"10px",
        // fontSize: "10em",
    },
    right:{
        flexGrow: 1,
        textAlign: "right",
        color: "#000",
        fontSize: "10px",
        // fontSize: "10em",
    },
    text:{
        color: "#000",
        fontSize: "10px",
        // fontSize: "10em",
        // textAlign: "center",
    },
    Largetext:{
      color: "#000",
      fontSize: "12px",
    },
    media: {
      // height: '10%',
      // // width: '10%'
      // height: 50,
      // width:50
    },
    weight:{
      fontWeight:600
    },
    root: {
      maxWidth: 10,
      
    },
    divider: {
      // Theme Color, or use css color in quote
      background: '#000',
  },
}));
let d = moment.now() / 1000;

let orderTime = moment
.unix(d)
.format("DD/MM/YYYY HH:mm", { trim: false });

let orderDate = moment
.unix(d)
.format("DD/MM/YYYY", { trim: false });

// CON THIEU LINK WEB + LOGO + MA HOA DON
var QRCode = require('qrcode.react');


export const NomalReceiptPrinter = ({cart, date,code, type}) => {
    const info = useSelector((state) => state.info);
    const store_setting = info.store.general_configuration? JSON.parse(info.store.general_configuration): setting


    const store = info.store.store_configuration? JSON.parse(info.store.store_configuration): null

//     const web_link = store_setting.status ? info.store.web_page:null
//     var link = web_link ? web_link : store? store.custom_web : null ;
//     var logo  = store? store.img_url :null ;

    var link = info.store.web_page ? "https://cuahangcuatoi.net/#/store/" + info.store.web_page : "";
    var logo  = store_setting?.img_url ;

    const theme = useTheme();
    const classes = useStyles(theme);
    const item = cart.cartItem? cart.cartItem :cart.details
    const otherfee = store_setting?.vat
    let otherFeeMoney = otherfee?.listCost ? otherfee?.listCost?.reduce((sum,fee)=>fee.type!=="%"? sum + Number(fee.value):sum , 0) :0;

   
    return (
      <div style={{ paddingLeft: -10 }}>
        {/* Logo */}
        {logo ? (
          <div className={classes.centerQR} style={{ marginBottom: 5 }}>
            <img src={logo} style={{ height: 50 }} />
          </div>
        ) : null}

        {/* In đơn cũ thì ko lấy store?? */}
        {/* {
             cart.branch ?
             <>
             <Typography className={classes.center}>Địa chỉ: {cart.branch.address}, {cart.branch.ward} , {cart.branch.district}</Typography>
            <Typography className={classes.center}>Điện thoại: {cart.branch.phone}</Typography>
             </>:
            //  get current branch
            <>
             <Typography className={classes.center}>Địa chỉ: {info.store.district}, P. {info.store.ward} ,Q. {info.store.district}, {info.store.province}</Typography>
             <Typography className={classes.center}>Điện thoại: {info.store.phone}</Typography>
            </>
           } */}

        {/*  */}
        <Typography className={classes.title} style={{ fontSize: "13.5px" }}>
          HOÁ ĐƠN BÁN HÀNG
        </Typography>
        <Typography className={classes.center}>Mã HĐ: {code}</Typography>
        <Typography className={classes.center} style={{ marginBottom: 10 }}>
          Ngày: {date ? date : orderTime}
        </Typography>

        <Box style={{ marginBottom: 5 }}>
          <Typography className={classes.text}>
            Thu ngân:{" "}
            {cart.created_by_user ? cart.created_by_user.name : info.user.name}
          </Typography>
          <Typography className={classes.text}>
            Khách hàng: {cart.customer ? cart.customer?.name : "Khách lẻ"}{" "}
          </Typography>
        </Box>
        {/* List */}

        {type === "large" ? (
          <>
            <Divider classes={{ root: classes.divider }} />
            <Grid container direction="row" justifyContent="space-between">
              <Grid item xs={4}>
                <Typography className={clsx(classes.text, classes.weight)}>
                  Sản phẩm
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography
                  className={clsx(classes.text, classes.weight)}
                  style={{ textAlign: "center" }}
                >
                  Đơn giá
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography
                  className={clsx(classes.text, classes.weight)}
                  style={{ textAlign: "center" }}
                >
                  SL
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography
                  className={clsx(classes.text, classes.weight)}
                  style={{ textAlign: "center" }}
                >
                  T.Tiền
                </Typography>
              </Grid>
            </Grid>
            <Divider classes={{ root: classes.divider }} />

            {item.map((row, index) => {
              return (
                <>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Grid item xs={4}>
                      <Typography className={classes.text}>
                        {row.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography
                        className={classes.text}
                        style={{ textAlign: "center" }}
                      >
                        <ThousandFormat value={row.unit_price} />
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography
                        className={classes.text}
                        style={{ textAlign: "center" }}
                      >
                        <ThousandFormat value={row.quantity} />
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography
                        className={classes.text}
                        style={{ textAlign: "center" }}
                      >
                        <ThousandFormat value={row.quantity * row.unit_price} />
                      </Typography>
                    </Grid>
                  </Grid>
                  <Divider classes={{ root: classes.divider }} />
                </>
              );
            })}
          </>
        ) : (
          <>
            <Divider classes={{ root: classes.divider }} />
            <Grid container direction="row" justifyContent="space-between">
              <Grid item xs={7}>
                <Typography className={clsx(classes.text, classes.weight)}>
                  Sản phẩm
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography
                  className={clsx(classes.text, classes.weight)}
                  style={{ textAlign: "center" }}
                >
                  T.Tiền
                </Typography>
              </Grid>
            </Grid>
            <Divider classes={{ root: classes.divider }} />

            {item.map((row, index) => {
              return (
                <>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Grid item xs={7}>
                      <Typography className={classes.text}>
                        {row.name}
                      </Typography>
                      <ListItem style={{ padding: 0, margin: 0 }}>
                        <Typography className={classes.text}>
                          <ThousandFormat value={row.quantity} /> x{" "}
                          <ThousandFormat value={row.unit_price} />
                        </Typography>
                      </ListItem>
                    </Grid>
                    <Grid item xs={5}>
                      <Typography
                        className={classes.text}
                        style={{ textAlign: "center" }}
                      >
                        <ThousandFormat value={row.quantity * row.unit_price} />
                      </Typography>
                    </Grid>
                  </Grid>
                  <Divider classes={{ root: classes.divider }} />
                </>
              );
            })}
          </>
        )}

        {cart.listGiftItem?.length > 0 ? (
          <>
            <ListItem>
              <Typography className={classes.text}>
                <b>Khuyến mãi hoá đơn</b>
              </Typography>
              <CardGiftcardIcon
                style={{ marginLeft: 7, width: 15, height: 15, color: "#000" }}
              />
            </ListItem>
            <Divider />

            {cart.listGiftItem?.map((row, index) => {
              return (
                <>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Grid item xs={7}>
                      <ListItem style={{ margin: 0, padding: 0 }}>
                        <Typography className={classes.text}>
                          {row.name}
                        </Typography>
                        <div>
                          <Box
                            style={{
                              backgroundColor: "red",
                              color: "#fff",
                              fontSize: 8,
                              height: 15,
                              fontWeight: 500,
                              borderRadius: 5,
                              marginLeft: 7,
                              paddingTop: -3,
                              paddingBottom: -3,
                              paddingLeft: 5,
                              paddingRight: 5,
                            }}
                          >
                            KM
                          </Box>
                        </div>
                      </ListItem>
                      <ListItem style={{ padding: 0, margin: 0 }}>
                        <Typography className={classes.text}>
                          <ThousandFormat value={row.quantity} /> x
                          <ThousandFormat value={row.unit_price} />
                          {/* <ThousandFormat value={0}/> */}
                        </Typography>
                      </ListItem>
                    </Grid>
                    <Grid item xs={5}>
                      <Typography
                        className={classes.text}
                        style={{ textAlign: "center" }}
                      >
                        <ThousandFormat value={0} />
                      </Typography>
                    </Grid>
                  </Grid>
                  <Divider />
                </>
              );
            })}
          </>
        ) : null}

        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          style={{ marginTop: 10 }}
        >
          <Grid item xs={5}>
            {Number(cart.discount) > 0 || Number(cart.otherFee) > 0 ? (
              <>
                <Typography className={clsx(classes.text, classes.weight)}>
                  {" "}
                  Tổng tiền hàng:{" "}
                </Typography>
              </>
            ) : null}
            {Number(cart.discount) + Number(cart.discountPro) > 0 ? (
              <ListItem style={{ margin: 0, padding: 0 }}>
                <Typography className={clsx(classes.text, classes.weight)}>
                  {" "}
                  Giảm giá:{" "}
                  {cart.bestDetailSelectedPromotion?.type === "%" ? (
                    <b style={{ color: "red" }}>
                      ({cart.bestDetailSelectedPromotion?.discountValue}%)
                    </b>
                  ) : (
                    ""
                  )}
                </Typography>
                {cart.selectedPromotion?.discountKey === "invoice" &&
                cart.selectedPromotion?.discountType === "discountInvoice" ? (
                  <div>
                    <Box
                      style={{
                        backgroundColor: "red",
                        color: "#fff",
                        fontSize: 8,
                        height: 15,
                        fontWeight: 500,
                        borderRadius: 5,
                        marginLeft: 7,
                        paddingTop: -3,
                        paddingBottom: -3,
                        paddingLeft: 5,
                        paddingRight: 5,
                      }}
                    >
                      KM
                    </Box>
                  </div>
                ) : null}
              </ListItem>
            ) : null}
            {otherfee?.listCost?.map((fee) => (
              <Typography className={clsx(classes.text, classes.weight)}>
                {fee.name}{" "}
              </Typography>
            ))}
            <Typography className={clsx(classes.text, classes.weight)}>
              Tổng cộng:{" "}
            </Typography>
            <Typography className={clsx(classes.text, classes.weight)}>
              Khách đưa:{" "}
            </Typography>
            <Typography className={clsx(classes.text, classes.weight)}>
              Tiền thối:{" "}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            {Number(cart.discount) > 0 || Number(cart.otherFee) > 0 ? (
              <>
                <Typography className={clsx(classes.text, classes.weight)}>
                  {" "}
                  <ThousandFormat value={cart.total_amount} />
                </Typography>
                <Typography>
                  <ThousandFormat
                    className={clsx(classes.text, classes.weight)}
                    value={Number(cart.discount) + Number(cart.discountPro)}
                  />
                </Typography>
              </>
            ) : null}
            {otherfee?.listCost?.map((fee) => (
              <Typography className={clsx(classes.text, classes.weight)}>
                {" "}
                <ThousandFormat
                  value={
                    fee.type === "%"
                      ? (Number(fee.value) *
                          (Number(cart.total_amount) - Number(cart.score_amount) -
                            Number(cart.discount) -
                            Number(cart.discountPro))) /
                        100
                      : fee.value
                  }
                />
              </Typography>
            ))}

            <Typography className={clsx(classes.text, classes.weight)}>
              {" "}
              <ThousandFormat
                value={
                  cart.total_amount - cart.score_amount - 
                  cart.discount -  
                  cart.discountPro +
                  cart.otherFee
                }
              />
            </Typography>
            <Typography className={clsx(classes.text, classes.weight)}>
              {" "}
              <ThousandFormat value={cart.paid_amount} />
            </Typography>
            <Typography className={clsx(classes.text, classes.weight)}>
              <ThousandFormat
                value={
                  cart.paid_amount -
                  (cart.total_amount - cart.score_amount -
                    cart.discount - 
                    cart.discountPro +
                    cart.otherFee)
                }
              />
            </Typography>
          </Grid>
        </Grid>
        {store_setting.printReceiptWhenSell.contentNote ? (
          <Box>
            <ReactQuill
              theme="bubble"
              value={store_setting.printReceiptWhenSell.contentNote}
              style={{ color: "#000", fontSize: "8px", height: 75 }}
              readOnly={true}
            />
          </Box>
        ) : null}

        <Typography className={classes.center}>
          {" "}
          --------------------------
        </Typography>
        {link ? (
          <>
            <Typography className={classes.center}>
              {" "}
              Mở camera và quét mã để truy cập trang web
            </Typography>
            <div
              className={classes.centerQR}
              style={{ marginBottom: 10, marginTop: 10 }}
            >
              {/* <QRCode value={link}  style={{height:"50%", width:"50%"}}/> */}
              <QRCode value={link} size={65} />
            </div>
          </>
        ) : null}
        <Typography className={classes.center}>
          Cảm ơn và hẹn gặp lại !
        </Typography>
      </div>
    );
}

export const ReceiptPrinter = ({cart, date,code,type}) => {
  const info = useSelector((state) => state.info);
  const store_setting = info.store.general_configuration? JSON.parse(info.store.general_configuration): setting

  var link = store_setting?.custom_web;
  var logo  = store_setting?.img_url ;
  const theme = useTheme();
  const classes = useStyles(theme);

  const item = cart.cartItem? cart.cartItem :cart.details
  // console.log("typetypetype",type)
  if(type !== 'other'){
    return <NomalReceiptPrinter cart={cart} date={date} code={code} type={type}/>
  }
 
  return (
      <div style={{padding:30, }} >
          {/* Logo */}
          {/* <Typography className={classes.title} style={{fontSize: "18px", marginBottom:-2}}>HOÁ ĐƠN BÁN HÀNG</Typography>
          <Typography className={classes.center} style={{ fontSize: "12px", marginBottom:15}}>Ngày: {date? date: orderDate} - Mã HĐ: {code}</Typography> */}
          <Grid container justifyContent='space-between'  alignItems='center' style={{marginBottom:15}}>
              
              <Grid>
              <Typography className={classes.title} style={{fontSize: "18px"}}>PHIẾU XUẤT KHO</Typography>
              <Typography className={classes.center} style={{ fontSize: "12px"}}>Ngày: {date? date: orderDate} - Mã HĐ: {code}</Typography>
              </Grid>
              <Grid >
              <Typography className={classes.Largetext} style={{marginTop:10}}> <b>Khách hàng:</b> {cart.customer? cart.customer?.name :"Khách lẻ"} </Typography> 
              <Typography className={classes.Largetext} ><strong>Điện thoại:</strong> {cart.customer?.phone} </Typography> 
              </Grid>
          </Grid>

          {/* <Box style={{marginBottom:10}}>
            <Grid container>
              <Grid item xs={7}><Typography className={classes.Largetext} style={{fontWeight:500}}>Khách hàng: {cart.customer? cart.customer?.name :"Khách lẻ"} </Typography>  </Grid>
              <Grid item xs={5}><Typography className={classes.Largetext} style={{fontWeight:500}}>Điện thoại: {cart.customer?.phone} </Typography>  </Grid>
            </Grid>
            <Typography className={classes.Largetext} style={{fontWeight:500}}>Địa chỉ: {cart.customer?.address } </Typography> 
          </Box> */}
          {/* List */}
            <Divider classes={{root: classes.divider}}/>
              <ListItem  style={{margin:0, padding:0,}}>
                  <ListItem style={{margin:0, padding:0, justifyContent:'space-between' , width:400}} >
                        <Divider orientation="vertical" classes={{root: classes.divider}} flexItem/>
                        <Typography className={clsx(classes.Largetext,classes.weight)}style={{marginTop:3, marginBottom:3}} >STT</Typography>
                        <Divider orientation="vertical" classes={{root: classes.divider}} flexItem/>
                  </ListItem>
                  <ListItem style={{margin:0, padding:0,justifyContent:'space-between', width:2100 }}>
                        <Typography className={clsx(classes.Largetext,classes.weight)}style={{flexGrow:1,textAlign: "center",marginTop:3, marginBottom:3}}>Tên hàng hoá, dịch vụ</Typography>
                        <Divider orientation="vertical" classes={{root: classes.divider}} flexItem/>
                  </ListItem>
                  <ListItem style={{margin:0, padding:0,justifyContent:'space-between',width: 620 }}>
                        <Typography className={clsx(classes.Largetext,classes.weight)} style={{flexGrow:1,textAlign: "center",marginTop:3, marginBottom:3}}>Đơn vị</Typography>
                        <Divider orientation="vertical" classes={{root: classes.divider}} flexItem/>
                  </ListItem>
                  <ListItem style={{margin:0, padding:0,justifyContent:'space-between', width: 650}}>
                        <Typography className={clsx(classes.Largetext,classes.weight)}style={{flexGrow:1,textAlign: "center",marginTop:3, marginBottom:3}}>Số lượng</Typography>
                        <Divider orientation="vertical" classes={{root: classes.divider}} flexItem/>
                  </ListItem>
                  <ListItem style={{margin:0, padding:0,justifyContent:'space-between', width: 750}}>
                        <Typography className={clsx(classes.Largetext,classes.weight)}style={{flexGrow:1,textAlign: "center",marginTop:3, marginBottom:3}}>Đơn giá</Typography>
                        <Divider orientation="vertical" classes={{root: classes.divider}} flexItem/>
                  </ListItem>
                  <ListItem style={{margin:0, padding:0,justifyContent:'space-between', width: 950}}>
                        <Typography className={clsx(classes.Largetext,classes.weight)} style={{flexGrow:1,textAlign: "center",marginTop:3, marginBottom:3}}>Thành tiền</Typography>
                        <Divider orientation="vertical" classes={{root: classes.divider}} flexItem/>
                  </ListItem>
              </ListItem>
            <Divider classes={{root: classes.divider}}/>
                {item.map((row, index) => {
                  return (
                    <>
                    <ListItem  style={{margin:0, padding:0,}}>
                        <ListItem style={{margin:0, padding:0, justifyContent:'space-between' , width:400}} >
                              <Divider orientation="vertical" classes={{root: classes.divider}} flexItem/>
                              <Typography className={clsx(classes.Largetext)}style={{marginTop:2, marginBottom:2}} >{index +1}</Typography>
                              <Divider orientation="vertical" classes={{root: classes.divider}} flexItem />
                        </ListItem>
                        <ListItem style={{margin:0, padding:0,justifyContent:'space-between', width:2100 }}>
                              <Typography className={clsx(classes.Largetext)}style={{flexGrow:1,textAlign: "left",marginTop:2, marginBottom:2, paddingLeft:4}}>{row.name}</Typography>
                              <Divider orientation="vertical" classes={{root: classes.divider}} flexItem/>
                        </ListItem>
                        <ListItem style={{margin:0, padding:0,justifyContent:'space-between',width: 620 }}>
                              <Typography className={clsx(classes.Largetext)} style={{flexGrow:1,textAlign: "center",marginTop:2, marginBottom:2}}>{row.quantity_per_unit ?row.quantity_per_unit :"Cái"}</Typography>
                              <Divider orientation="vertical" classes={{root: classes.divider}} flexItem/>
                        </ListItem>
                        <ListItem style={{margin:0, padding:0,justifyContent:'space-between', width: 650}}>
                              <Typography className={clsx(classes.Largetext)}style={{flexGrow:1,textAlign: "center",marginTop:2, marginBottom:2}}><ThousandFormat value={ row.quantity}/></Typography>
                              <Divider orientation="vertical" classes={{root: classes.divider}} flexItem/>
                        </ListItem>
                        <ListItem style={{margin:0, padding:0,justifyContent:'space-between', width: 750}}>
                              <Typography className={clsx(classes.Largetext)}style={{flexGrow:1,textAlign: "right", marginTop:2, marginBottom:2, paddingRight:4}}><ThousandFormat value={ row.unit_price}/></Typography>
                              <Divider orientation="vertical" classes={{root: classes.divider}} flexItem/>
                        </ListItem>
                        <ListItem style={{margin:0, padding:0,justifyContent:'space-between', width: 950}}>
                              <Typography className={clsx(classes.Largetext)} style={{flexGrow:1,textAlign: "right",marginTop:2, marginBottom:2, paddingRight:4}}><ThousandFormat value={row.quantity * row.unit_price}/></Typography>
                              <Divider orientation="vertical" classes={{root: classes.divider}} flexItem/>
                        </ListItem>
                  </ListItem>
                   <Divider classes={{root: classes.divider}}/>  
                   
                  </>
                  );
              })} 
            {/* <Divider classes={{root: classes.divider}}/>   */}
          <ListItem  style={{margin:0, padding:0,}}>    
            <ListItem style={{margin:0, padding:0, justifyContent:'space-between' , width:3120}} >
                  <Divider orientation="vertical" classes={{root: classes.divider}}  flexItem/>
                  <Typography className={clsx(classes.Largetext,)}style={{marginTop:3, marginBottom:3, fontWeight:600}} >TỔNG CỘNG</Typography>
                  <Divider orientation="vertical" classes={{root: classes.divider}} flexItem />
            </ListItem>
            <ListItem style={{margin:0, padding:0,justifyContent:'space-between', width: 650}}>
                  <Typography className={clsx(classes.Largetext)}style={{flexGrow:1,textAlign: "center",marginTop:3, marginBottom:3, fontWeight:600}}><ThousandFormat value={ item?.reduce((sum,a) => sum + Number(a.quantity),0)}/></Typography>
                  <Divider orientation="vertical" classes={{root: classes.divider}} flexItem/>
            </ListItem>
            <ListItem style={{margin:0, padding:0,justifyContent:'space-between', width: 1700}}>
                  <Typography className={clsx(classes.Largetext)} style={{flexGrow:1,textAlign: "right",marginTop:3, marginBottom:3, paddingRight:4, fontWeight:600}}><ThousandFormat value={cart.total_amount}/></Typography>
                  <Divider orientation="vertical" classes={{root: classes.divider}} flexItem/>
            </ListItem>
        </ListItem>
        <Divider classes={{root: classes.divider}}/>  
        <ListItem  style={{margin:0, padding:0,justifyContent:'space-between' , }}> 
            <ListItem  style={{margin:0, padding:0,}}> 
                <Divider orientation="vertical" classes={{root: classes.divider}}  flexItem/>
                <Typography className={clsx(classes.Largetext)} style={{fontWeight:600,marginTop:2, marginBottom:2,marginLeft:5}}>Viết bằng chữ:</Typography>
                <Typography className={clsx(classes.Largetext)} style={{marginTop:2, marginBottom:2,marginLeft:5, fontStyle:'italic'}}> {new Docso().doc(Number(cart.total_amount))} đồng./.</Typography>
            </ListItem> 
            <Divider orientation="vertical" classes={{root: classes.divider}}  flexItem/>

        </ListItem> 
        <Divider classes={{root: classes.divider}}/>  
        
      {store_setting.printReceiptWhenSell.contentNote?
      <Box>
      <ReactQuill theme="bubble"  value={store_setting.printReceiptWhenSell.contentNote}style={{color:"#000", fontSize:'8px',height:75}} readOnly={true} /></Box>:null}

      <div>
          <Grid container justifyContent='space-around' style={{marginTop:20}}>
            <Grid item xs={4}><Typography className={classes.Largetext} style={{fontWeight:500,textAlign: "center",}}>Người mua hàng </Typography>  </Grid>
            <Grid item xs={4}><Typography className={classes.Largetext} style={{fontWeight:500,textAlign: "center",}}>Người giao hàng </Typography>  </Grid>
            <Grid item xs={4}><Typography className={classes.Largetext} style={{fontWeight:500,textAlign: "center",}}>Người bán hàng </Typography>  </Grid>
          </Grid>
        </div> 
      </div>
  )

}

export const ImportReceiptPrinter = ({cart, date}) => {
  const info = useSelector((state) => state.info);

  const theme = useTheme();
  const classes = useStyles(theme);

  const item = cart.cartItem? cart.cartItem :cart.details
    return (
          <div >

          {/*  */}
          <Typography className={classes.title} >PHIẾU NHẬP HÀNG</Typography>
          <Typography className={classes.center}>Mã phiếu: {}</Typography>
          <Typography className={classes.center} style={{marginBottom:25}}>Thời gian: {date? date: orderTime}</Typography>
        
          
          <Typography className={classes.text} >Chi nhánh nhập: {cart.branch ? cart.branch.name :info.branch.name}</Typography>
          <Typography className={classes.text} >Người tạo: {cart.created_by_user ? cart.created_by_user.name :info.user.name}</Typography>
          <Typography className={classes.text} style={{marginBottom:10}}>Nhà cung cấp: {cart.supplier?.name} </Typography>
        
          {/* List */}
      
          <Divider classes={{root: classes.divider}}/>
              <Grid container direction="row" justifyContent="space-between">
                  <Grid item xs={1}>
                  <Typography className={clsx(classes.text,classes.weight)} >STT</Typography>
                  </Grid>
                  <Grid item xs={2}>
                  <Typography className={clsx(classes.text,classes.weight)} >Mã hàng</Typography>
                  </Grid>
                  <Grid item xs={4}>
                  <Typography className={clsx(classes.text,classes.weight)} >Sản phẩm</Typography>
                  </Grid>
                  <Grid item xs={2}>
                  <Typography className={clsx(classes.text,classes.weight)} >Đơn giá</Typography>
                  </Grid>
                  <Grid item xs={1}>
                  <Typography className={clsx(classes.text,classes.weight)} >SL</Typography>
                  </Grid>
                  <Grid item xs={2}>
                  <Typography className={clsx(classes.text,classes.weight)} >T.Tiền</Typography>
                  </Grid>
              </Grid>
              <Divider classes={{root: classes.divider}}/>      

         
                  {item.map((row, index) => {
                  return (
                      <>
                     
                      <Grid container direction="row" justifyContent="space-between">
                        <Grid item xs={1}>
                        <Typography className={clsx(classes.text,classes.weight)} >{index+1}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                        <Typography className={clsx(classes.text,classes.weight)} >{row.bar_code}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                        <Typography className={clsx(classes.text,classes.weight)} >{row.name}</Typography>
                        </Grid>
                       
                        <Grid item xs={2}>
                        <Typography className={clsx(classes.text,classes.weight)} ><ThousandFormat value={row.unit_price}/></Typography>
                        </Grid>
                        <Grid item xs={1}>
                        <Typography className={clsx(classes.text,classes.weight)} ><ThousandFormat value={row.quantity}/></Typography>
                        </Grid>
                        <Grid item xs={2}>
                        <Typography className={clsx(classes.text,classes.weight)} ><ThousandFormat value={row.quantity * row.unit_price}/></Typography>
                        </Grid>
                    </Grid>
                    <Divider classes={{root: classes.divider}}/>      
                      </>
                  );
              })}
            
            <Grid container direction="row" justifyContent="flex-end" style={{marginTop:20}}>
              <Grid item xs={5}>
                <Typography className={clsx(classes.text,classes.weight)}> Tổng tiền hàng:{" "}</Typography>
                <Typography className={clsx(classes.text,classes.weight)}> Giảm giá:{" "}</Typography>
                <Typography className={clsx(classes.text,classes.weight)}>
                Tổng cộng:{" "} 
                </Typography>
                <Typography className={clsx(classes.text,classes.weight)}>
                Tiền trả NCC:{" "}
                </Typography>
                <Typography className={clsx(classes.text,classes.weight)}>
                Còn lại:{" "}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography className={clsx(classes.text,classes.weight)}>   <ThousandFormat value={cart.total_amount} /></Typography>
                <Typography >
                  <ThousandFormat className={clsx(classes.text,classes.weight)} value={cart.discount} />
                </Typography>
                <Typography className={clsx(classes.text,classes.weight)}>  <ThousandFormat value={cart.total_amount - cart.discount}/></Typography>
                <Typography className={clsx(classes.text,classes.weight)}> <ThousandFormat value={cart.paid_amount} /></Typography>
                <Typography className={clsx(classes.text,classes.weight)}><ThousandFormat value={cart.paid_amount - (cart.total_amount- cart.discount)} /></Typography>

              </Grid>
            </Grid>   

        <Grid container direction="row" justifyContent="space-around">
              <Typography className={clsx(classes.text,classes.weight)}>
                  Nhà cung cấp
              </Typography>
 
            <Typography className={clsx(classes.text,classes.weight)}>
                  Người lập phiếu
              </Typography>
          </Grid>
      </div>
    )
}

