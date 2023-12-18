import React from 'react'
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import {
  Grid,
  Box,
  Typography,
  DialogActions,
  DialogContent,
  Button,
  Dialog,
  FormControlLabel,
  Checkbox,
  FormControl,
  RadioGroup,
  Radio,
  ListItem,
  Paper,
  ButtonBase,
  Avatar,
  Popover
} from "@material-ui/core";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import * as Input from "./NumberFormatCustom";
import {
  VNDFormat,
  ThousandFormat,
} from "../TextField/NumberFormatCustom";
const useStyles = makeStyles((theme) =>
  createStyles({
    popup: { borderColor: theme.customization.primaryColor[500], padding: 5, paddingLeft:12, boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.5)" }
  })
);

const DiscountInputDetail = ({handleUpdateDiscountDetail,cartData,setAnchorEl}) =>{
    const theme = useTheme();
    const classes = useStyles(theme);
    
    const handleChangeValue = (e) =>{
      // if(e.target.value < 0){e.target.value = 0}
      console.log("e.target.value.includes('-') ",!e.target.value )

      // if(!e.target.value){e.target.value = 0; return; }
      if(e.target.value < 0 || e.target.value.includes('-') ){return}

      else if(cartData.discountDetail?.type === "%"){
        if(Number(e.target.value) > 100){ 
          handleUpdateDiscountDetail({value:'100', type:'%'})
        }
        else{  
          handleUpdateDiscountDetail({value:!e.target.value?"0": e.target.value, type:'%'})
        }
      }
      else{
        if(Number(e.target.value) > Number(cartData.total_amount)){ 
          handleUpdateDiscountDetail({value: cartData.total_amount, type:'VND'})
        }
        else{ 
          handleUpdateDiscountDetail({value:!e.target.value?"0": e.target.value.toString(), type:'VND'})
  
        }
      }
    }
    const handleChangeType = (type) =>{
      if(type === "%") {
        handleUpdateDiscountDetail({type:'%',value:(Number(cartData.discountDetail?.value) / Number(cartData.total_amount)*100).toFixed(2).toString()})
      }else{
        handleUpdateDiscountDetail({type:'VND',value:((Number(cartData.discountDetail?.value) *Number(cartData.total_amount)/100 / 100).toFixed() * 100).toString()})
      }
    }
  
    return(
      <ClickAwayListener onClickAway={()=>setAnchorEl(null)}>
        <Paper  variant="outlined" className={classes.popup}  >
           <Grid  container alignItems='center' spacing={2} >
                  <Grid item><Typography variant="h5" >Giảm giá </Typography></Grid>
                  <Grid item>
                  <ListItem>
                    <Input.ThousandSeperatedInput style={{color:"#000", marginRight:10, width:90}} 
                     value={cartData.discountDetail?.value}
                     onChange={handleChangeValue}
                    /> 
                    <Grid item style={{ marginRight:5}}> 
                        <ButtonBase sx={{ borderRadius: '16px', }} 
                            onClick={()=>handleChangeType("VND")}
                            // onClick={handleChangeMoneyTypeToVND}
                          >
                          <Avatar variant="rounded"   style={{width: theme.spacing(4),height: theme.spacing(3), background:cartData.discountDetail?.type ==="VND"?  theme.palette.primary.main :null,}} >
                              <Typography  style={{fontSize:13, fontWeight:500}} >VND</Typography>
                          </Avatar>     
                      </ButtonBase>
                      </Grid> 
                      <Grid item> 
                        <ButtonBase sx={{ borderRadius: '16px' }} 
                            onClick={()=>handleChangeType("%")}
                            // onClick={handleChangeMoneyTypeToPercent}
                          >
                          <Avatar variant="rounded"   style={{width: theme.spacing(4),height: theme.spacing(3), background:cartData.discountDetail?.type ==="%"?theme.palette.primary.main :null,}} >
                              <Typography  style={{fontSize:13, fontWeight:500}} >%</Typography>
                          </Avatar>    
                      </ButtonBase>
                    </Grid> 
                    </ListItem> 
                  </Grid>
               </Grid>

               <Grid  container alignItems='center' justifyContent="space-between"spacing={3} >
                    <Grid item><Typography variant="h5" >Khuyến mãi</Typography></Grid>
                    <Grid item>{<VNDFormat value={cartData.discountPro} style={{marginRight:20, }}/>}</Grid>
               </Grid>
  
      </Paper>
      </ClickAwayListener>
    )
  }

export default DiscountInputDetail