import React from 'react'
import { useTheme, withStyles,makeStyles, createStyles } from "@material-ui/core/styles";

import { Typography,MenuItem,Select,TextField,Button,Divider, FormControlLabel,Checkbox,List,Card,ListItem,ListSubheader,ListItemSecondaryAction,Switch,ListItemIcon, ListItemAvatar,Avatar,ListItemText,Grid, ButtonBase, Tooltip } from "@material-ui/core";
import {ThousandSeperatedInput} from "../../../../components/TextField/NumberFormatCustom"

const useStyles = makeStyles((theme) =>
  createStyles({
   
  
  })
);
const NotifyDebtSetting = ({checked,handleClose,handleSubmit,name}) => {

const theme = useTheme();
const classes = useStyles(theme);
const [notifyDebt, setNotifyDebt] = React.useState(checked)


const handleCheckbox= (event) => {
    setNotifyDebt((prevState)=>{
      return {
       ...prevState,
       [event.target.name]:event.target.checked
      }
     })
};

  const handleChangeValue= (event) => {
    setNotifyDebt((prevState)=>{
      return {
       ...prevState,
       [event.target.name]:Math.abs(event.target.value)
      }
     })
  };

  return (
    <>
        <ListItem> 
            <FormControlLabel  style={{marginRight:30}}  control={<Checkbox name="checkDebtAmount" color="primary" checked={notifyDebt.checkDebtAmount}   onChange={handleCheckbox}/>} 
            label={<Typography style={{fontWeight:500, color:"#000"}}>Tổng tiền nợ</Typography>        } />
            <ThousandSeperatedInput name="debtAmount"value={notifyDebt.debtAmount} onChange={handleChangeValue}/>   
        </ListItem>
        {Number(notifyDebt.debtAmount) <= 0 ? <Typography variant="h6" style={{ color: "red" }}>
            Mức tiền nợ cảnh báo phải lớn hơn 0
         </Typography>:null}

        <ListItem> 
            <FormControlLabel  style={{marginRight:40}}  control={<Checkbox name="checkNumberOfDay" color="primary" checked={notifyDebt.checkNumberOfDay} onChange={handleCheckbox}/>} 
            label={<Typography style={{fontWeight:500, color:"#000"}}>Số ngày nợ</Typography>        } />
            <ThousandSeperatedInput name="numberOfDay" style={{width:40,marginRight:15}} value={notifyDebt.numberOfDay}  onChange={handleChangeValue}/>   
            <Typography  style={{marginRight:15}} >ngày tính từ </Typography>
            <Select
                name="typeDebtDay"
                value={notifyDebt.typeDebtDay}
                onChange={handleChangeValue}
                style={{color:theme.customization.primaryColor[500], fontWeight:500}}
                MenuProps={{ classes: { paper: classes.dropdownStyle } }}
            >
                <MenuItem value={"firstDebt"}>giao dịch nợ đầu tiên</MenuItem> 
                <MenuItem value={"lastBuy"}>giao dịch cuối cùng</MenuItem>
          </Select>
        </ListItem>

        <FormControlLabel control={<Checkbox name="canNotContinueBuy"  checked={notifyDebt.canNotContinueBuy}   onChange={handleCheckbox} />} label="Không cho khách hàng mua hàng nếu vượt quá hạn mức nợ"  style={{marginTop:30}}/>
        <FormControlLabel control={<Checkbox name="canNotContinueDebt" checked={notifyDebt.canNotContinueDebt}   onChange={handleCheckbox}/>} label="Không cho khách hàng nợ tiếp nếu vượt quá hạn mức nợ" />

        <Grid item  xs={12} style={{ display: "flex", flexDirection: "row",justifyContent: "flex-end",  paddingTop: 20,  }}  >
          <Button onClick={handleClose} variant="contained"  size="small"  style={{ marginRight: 20 }} color="secondary"  >  Huỷ </Button>
          <Button onClick={()=>handleSubmit(name,notifyDebt)} variant="contained" size="small" color="primary" disabled={Number(notifyDebt.debtAmount) <= 0} >OK  </Button>
      </Grid>
    
    </>


     
  )
}

export default NotifyDebtSetting