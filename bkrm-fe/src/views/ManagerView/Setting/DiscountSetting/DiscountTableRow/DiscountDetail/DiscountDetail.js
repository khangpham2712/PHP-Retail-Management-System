import React from 'react'
import {useTheme, makeStyles,createStyles} from "@material-ui/core/styles";

//import library
import {Box,Grid,Collapse,Divider,ListItem,Typography,Button,ListItemIcon,ListItemText,IconButton,Table,  TableRow, TableCell, TableHead, TableBody} from '@material-ui/core';

//import icon
import MoreVertIcon from '@material-ui/icons/MoreVert';
import HighlightOffTwoToneIcon from '@material-ui/icons/HighlightOffTwoTone';

//import image
import avaUpload from '../../../../../../assets/img/product/lyimg.jpeg';

//import project 
import {StyledMenu,StyledMenuItem} from '../../../../../../components/Button/MenuButton'

import customerApi from '../../../../../../api/customerApi';
import { useSelector } from 'react-redux';
import clsx from "clsx"
import { ThousandFormat, VNDFormat } from '../../../../../../components/TextField/NumberFormatCustom';
const useStyles = makeStyles((theme) =>
createStyles({
  root: {
    '& .MuiTextField-root': {
      marginTop: theme.spacing(2),
    },
  },
  headerTitle:{
    fontSize: '1.125rem'
  },
  typo:{
    marginBottom:20
  },
  weight: {
    fontWeight: 500,
    color: "#000",
    fontSize: 14,
  },
  tag:{
    display: "flex",
    alignItems: "center",
    height: 24,
    margin: 2,
    lineHeight: 22,
    backgroundColor: "#fafafa",
    border: "1px solid #e8e8e8",
    borderRadius: 2,
    boxSizing: "contentBox",
    padding: "0 4px 0 10px",
    outline: 0,
    
  },
  span:{
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }

}));

const UploadImage  = () => {
  return (
    <Box
      component="img"
      sx={{
        height: 120,
        width: 120, 
        borderRadius:120,
        marginLeft:15,

      }}
      src={avaUpload}
    />
    
  )
}
const DiscountDetail = (props) => {
    const {row,openRow }= props.parentProps;
    const {promotion_condition,dateAdvanceSetting,type,isMini} = props;

    const rowsInvoice  = props.promotion_condition;
    console.log("rowsInvoice",props.promotion_condition)
    // const rowsInvoice = props.promotion_condition;

    
    // const discountKey= promotion_condition?.discountKey;// invoice, product
    // const discountType = promotion_condition?.discountType; //discountInvoice , sendGift, sendVoucher,priceByQuantity

    const discountKey= row.discountKey;// invoice, product
    const discountType = row.discountType; //discountInvoice , sendGift, sendVoucher,priceByQuantity


    // CALL APII (đổi thanhd api)




    const theme = useTheme();
    const classes = useStyles(theme);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const info = useSelector(state => state.info)
    const store_uuid = info.store.uuid

    const handleClose = () => {
      setAnchorEl(null);
    };

    const isActive =  (startDay, endDay) =>{
      const current   = new Date() 
      // return (startDay !== "0000-00-00" ?new Date(startDay) <= current : true) && ( endDay !== "0000-00-00" ?current <= new Date(endDay) :true)
      return (startDay   ?new Date(startDay) <= current : true) && ( endDay  ?current <= new Date(endDay) :true)

    }
    return (
        <Collapse in={ isMini ? true :openRow === row.id } timeout="auto" unmountOnExit>
             <Box margin={1}>
                <Typography variant="h3" gutterBottom component="div" className={classes.typo}>
                 {row.name}
               </Typography>

              <Grid  container direction="row" justifyContent="flex-start">
                  <Grid item xs={12} sm={6}>
                      <Grid container direction="row" justifyContent="flex-start" > 
                        <Grid item xs={3} sm={4} >
                          <Typography variant="h5" gutterBottom component="div">Mã khuyến mãi </Typography>    
                        </Grid>
                        <Grid item  >
                          <Typography variant="body1" gutterBottom component="div">{row.promotion_code} </Typography>
                        </Grid>
                      </Grid>
                      <Grid container direction="row" justifyContent="flex-start">
                        <Grid item xs={3} sm={4} >
                          <Typography variant="h5" gutterBottom component="div">Tên khuyến mãi </Typography>    
                        </Grid>
                        <Grid item>
                          <Typography variant="body1" gutterBottom component="div">{row.name} </Typography>
                        </Grid>
                      </Grid>
                      <Grid container direction="row" justifyContent="flex-start">
                          <Grid item xs={3} sm={4} >
                            <Typography variant="h5" gutterBottom component="div">Hình thức</Typography>    
                          </Grid>
                          <Grid item  >
                            <Typography variant="body1" gutterBottom component="div">{type}</Typography>
                          </Grid>
                      </Grid>
                      
                  </Grid>


                <Grid item xs={12} sm={6}>
                    <Grid container direction="row" justifyContent="flex-start">
                        <Grid item xs={3} sm={2} >
                          <Typography variant="h5" gutterBottom component="div">Trạng thái</Typography>    
                        </Grid>
                        <Grid item  >
                          <Typography variant="body1" gutterBottom component="div">{row.status ==='active' && isActive(row.start_date,row.end_date)? "Hoạt động" : 'Chưa hoạt động' }</Typography>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justifyContent="flex-start">
                      
                        <Grid item xs={3} sm={2} >
                          <Typography variant="h5" gutterBottom component="div">Thời gian</Typography>    
                        </Grid>
                        <Grid item >
                          <Typography variant="body1" gutterBottom component="div">{row.start_date ? `Từ ${row.start_date?.split('-').reverse().join('/')}` : null}  {row.end_date ? `-  Đến ${row.end_date?.split('-').reverse().join('/')}` :"(Không giới hạn)"}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justifyContent="flex-start">
                      
                        <Grid item xs={3} sm={2} >
                          <Typography variant="h5" gutterBottom component="div">Áp dụng</Typography>    
                        </Grid>
                        <Grid item >
                          <Typography variant="body1" gutterBottom component="div">{row.times} lần</Typography>
                        </Grid>
                    </Grid>

                    <Grid container direction="row" justifyContent="flex-start">
                      
                        <Grid item xs={3} sm={2} >
                          <Typography variant="h5" gutterBottom component="div">Tổng tiền</Typography>    
                        </Grid>
                        <Grid item >
                        <VNDFormat value={row.totalAmount} />
                        </Grid>
                    </Grid>

                    {/* Thay TRUE thành nếu list theo thứ ngày tháng,.. ko empty thì show */}
                    {dateAdvanceSetting.byMonth?.length !== 0 ?
                      <Grid container direction="row" justifyContent="flex-start">
                        <Grid item xs={3} sm={4} >
                          <Typography variant="h5" gutterBottom component="div">Theo tháng</Typography>    
                        </Grid>
                        <Grid item>
                          <Typography variant="body1" gutterBottom component="div">{dateAdvanceSetting.byMonth?.toString()}</Typography>
                        </Grid>
                    </Grid> : null
                    }
                    {dateAdvanceSetting.byMonth?.length !== 0 ?
                      <Grid container direction="row" justifyContent="flex-start">
                        <Grid item xs={3} sm={4} >
                          <Typography variant="h5" gutterBottom component="div">Theo ngày</Typography>    
                        </Grid>
                        <Grid item sm={4} >
                          <Typography variant="body1" gutterBottom component="div">{dateAdvanceSetting.byDay?.toString()}</Typography>
                        </Grid>
                    </Grid> : null
                    }
                    {dateAdvanceSetting.byMonth?.length !== 0 ?
                      <Grid container direction="row" justifyContent="flex-start">
                        <Grid item xs={3} sm={4}>
                          <Typography variant="h5" gutterBottom component="div">Theo thứ</Typography>    
                        </Grid>
                        <Grid item sm={4} >
                          <Typography variant="body1" gutterBottom component="div">{dateAdvanceSetting.byDate?.toString()}</Typography>
                        </Grid>
                    </Grid> : null
                    }
                    {dateAdvanceSetting.byMonth?.length !== 0 ?
                      <Grid container direction="row" justifyContent="flex-start">
                        <Grid item xs={3} sm={4} >
                          <Typography variant="h5" gutterBottom component="div">Theo giờ</Typography>    
                        </Grid>
                        <Grid item sm={4} >
                          <Typography variant="body1" gutterBottom component="div">{dateAdvanceSetting.byTime?.toString()}</Typography>
                        </Grid>
                    </Grid> : null
                    }
                    {row.customer_birth?
                      <Typography style={{fontWeight:500, color:"red"}}> * Áp dụng vào ngày sinh nhật của khách hàng *</Typography> : null
                    }
                    
                  </Grid>
               
              </Grid>
          
          
          
          {/* Header */}
         <div style={{backgroundColor:theme.customization.primaryColor[50], height:35, marginTop:20,paddingTop:10, paddingLeft:15, marginLeft:10, marginRight:10}}>
          <Grid  container direction="row" justifyContent="">
              {/* col 1 */}
              {discountKey ==="invoice"?
              <Grid item style={{width:150, marginRight:30}}>
                <Typography className={clsx(classes.text,classes.weight)} >Tổng tiền hàng</Typography>
              </Grid>:null
              }
              {discountKey ==="product" && discountType ==="sendGift" || discountType=="priceByQuantity" ?
              <>
              <Grid item style={{width:50, marginRight:50}}>
                  <Typography className={clsx(classes.text,classes.weight)} style={{textAlign: "center"}}>SL mua</Typography>
              </Grid>
              <Grid item style={{ marginRight:190}}>
                  <Typography className={clsx(classes.text,classes.weight)} style={{textAlign: "center"}}>SP/nhóm hàng mua</Typography>
              </Grid>
               </>:null
              }
               { discountType ==="discountInvoice"?
                  <Grid item >
                  <Typography className={clsx(classes.text,classes.weight)} style={{textAlign: "center"}}>Giá trị khuyến mãi</Typography>
                </Grid>:null
                }
                {['sendGift','sendVoucher'].includes(discountType) ?
                  <Grid item style={{width:50, marginRight:50}}>
                  <Typography className={clsx(classes.text,classes.weight)} style={{textAlign: "center"}}>SL tặng</Typography>
              </Grid>:null
                }
                {discountType ==="sendGift"?
                    <Grid item >
                        <Typography className={clsx(classes.text,classes.weight)} style={{textAlign: "center"}}>SP/nhóm hàng tặng</Typography>
                    </Grid> :null
               }
               {discountType ==="sendVoucher"?
                    <Grid item >
                        <Typography className={clsx(classes.text,classes.weight)} style={{textAlign: "center"}}>Voucher</Typography>
                    </Grid> :null
               }
            </Grid>
          </div>

          {rowsInvoice?.map((discountRow, index) => {
              return (
                  <>
                  <div style={{paddingLeft:15, marginLeft:10, marginRight:10}}>
                  <Grid container direction="row" justifyContent="">
                      {/* col 1 */}
                      {discountKey ==="invoice"?
                      <Grid item  container direction="row" alignItems="center" style={{width:130,marginRight:52, height:40}} >
                          <Grid item> <Typography style={{marginRight:10, color:"#000", fontSize:13}}> Từ </Typography> </Grid> 
                          <Grid item> <VNDFormat style={{marginRight:10, color:"#000", fontSize:13}} value= {discountRow.totalCost}> </VNDFormat> </Grid> 
                      </Grid>:null
                      }
                      {discountKey ==="product" && discountType ==="sendGift" || discountType ==='priceByQuantity'?
                      <>
                      <Grid item style={{width:80,height:40, marginTop:10}} >
                          <Typography style={{marginRight:10, color:"#000", fontSize:13}}> {discountRow.numberBuyItem} </Typography> 
                      </Grid>
                      <Grid item style={{ marginTop:6, width:360,}} >
                            <div style={{width:280,display: 'flex',flexWrap: "wrap"}}>
                               {discountRow.listBuyItem.map((tag) =>{
                                  return(
                                      <div className={classes.tag}>
                                        <span className={classes.span}>{tag.product_code} - {tag.name} </span> 
                                    </div>
                                  )                
                                })}
                              </div>
                            
                        </Grid> 
                      </>
                      :null }
                      {
                        discountType ==='priceByQuantity'? 
                        <>
                          <Grid item style={{width:70,marginRight:50, height:40, marginTop:10}} >
                            <Typography style={{color:"#000", fontWeight:500,fontSize:14}}> {discountRow.typeDiscountItem === "price" ? "Giá bán:" : "Giảm giá"}   </Typography>
                          </Grid>
                        </>
                        :null
                      }
                      {/* col 2 */}
                      {discountType ==="discountInvoice"  || discountType ==='priceByQuantity'?
                      <Grid item >
                        <Grid item  container direction="row" alignItems="center" style={{height:40}}>
                          <Grid item> <ThousandFormat style={{color:"#000", fontSize:13, marginRight:5}} value={discountRow.discountValue}>  </ThousandFormat> </Grid> 
                          <Grid item> <Typography style={{color:"#000", fontSize:13}}>   {discountRow.type}  </Typography> </Grid> 
                        </Grid>
                      </Grid>
                      :null
                      }
                    {/* col 3 */}
                    {['sendGift','sendVoucher'].includes(discountType) ?
                    <Grid item style={{width:50,marginRight:30, height:4, marginTop:10}} >
                        <Typography style={{color:"#000", fontSize:13}}>{discountRow.numberGiftItem}  </Typography>
                    </Grid>:null
                    }
                    {discountType ==="sendGift"?
                          <Grid item style={{ marginTop:6}} >
                              <div style={{width:280,display: 'flex',flexWrap: "wrap"}}>
                               {discountRow.listGiftItem.map((tag) =>{
                                  return(
                                      <div className={classes.tag}>
                                        <span className={classes.span}>{tag.product_code} - {tag.name}  </span> 
                                    </div>
                                  )                
                                })}
                              </div>
                          </Grid>  :null
                    }
                    {discountType ==="sendVoucher"?
    
                          <Grid item style={{ marginTop:10}} >
                            <div style={{width:280,display: 'flex',flexWrap: "wrap"}}>
                               {discountRow.listGiftItem.map((tag) =>{
                                  return(
                                      <div className={classes.tag}>
                                        <span className={classes.span}>{tag.name}</span> 
                                    </div>
                                  )                
                                })}
                              </div>
                          </Grid> :null
                    }
                  
                      
                </Grid>
                </div>
                
                <Divider classes={{root: classes.divider}} style={{marginLeft:10, marginRight:10}}/>
                  </>


            );
          })}
          {row.orders?.length ? <Table size="small" aria-label="purchases" style={{marginTop:20}}>
            <TableHead>
              <TableRow style={{backgroundColor:theme.customization.primaryColor[50], color: "#000"}}>
                <TableCell>Mã Hóa đơn</TableCell>
                <TableCell>Ngày bán</TableCell>
                {/* <TableCell>Mã vạch</TableCell> */}
                <TableCell align="right">Khuyến mãi</TableCell>
                <TableCell align="right">Hóa đơn</TableCell>
                <TableCell align="right">Người tạo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {row.orders.map((o) =>  <TableRowDetailCart detail={o} />)}
            </TableBody>

          </Table> : null}
          
              {/* Button */}
              <Grid container direction="row" justifyContent="flex-end" style={{marginTop:20}}> 
                          <Button variant="contained" size="small" style={{marginLeft:15}}>Sửa</Button>
                          <Button variant="contained" size="small" style={{marginLeft:15}}>Xoá</Button>
                          
                          <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={handleClick}
                            size="small"
                            style={{marginLeft:10}}

                          >
                            <MoreVertIcon />
                          </IconButton>
                          
                          <StyledMenu
                            id="customized-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                          >
                            <StyledMenuItem>
                              <ListItemIcon style={{marginRight:-15}}>
                                <HighlightOffTwoToneIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary="Ngừng hoạt động" />
                            </StyledMenuItem>

                          </StyledMenu>


                      </Grid>

             </Box>
           </Collapse>
    )
}

export default DiscountDetail

const TableRowDetailCart = ({ detail }) => {
  return (
    <TableRow key={detail.order_id}>
      <TableCell component="th" scope="row">
        {detail.order_code}
      </TableCell>
      <TableCell>{detail.creation_date}</TableCell>
      <TableCell align="right">
        <VNDFormat value={detail.promotion_value} />
      </TableCell>
      <TableCell align="right" style={{ fontWeight: 700 }}>
        <VNDFormat value={detail.total_amount} />
      </TableCell>
      <TableCell component="right" scope="row">
        {detail.created_user_name}
      </TableCell>
    </TableRow>
  )
}