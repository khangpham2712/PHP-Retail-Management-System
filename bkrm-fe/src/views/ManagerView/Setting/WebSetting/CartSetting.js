import React from 'react'
import { Typography,Toolbar,Fab,Button,Badge,Select,MenuItem,InputAdornment,FormControlLabel,FormLabel,CardHeader,IconButton,Collapse,FormControl,RadioGroup,TextField, ListItem,Card, Radio,Grid, ButtonBase, Tooltip } from "@material-ui/core";

const CartSetting = ({handleChangeCart,web,setWeb}) => {
  return (
    <>
     <ListItem style={{margin:0, padding:0, marginBottom:8}}>
        <Typography style={{fontWeight:500, marginRight:20, color:"#000",fontSize:15}}>Vị trí thông tin hoá đơn: </Typography>
        <FormControl component="fieldset">
            <RadioGroup name="summaryPosition" value={web.cart.summaryPosition}  onChange={handleChangeCart}>
            <div>
                <FormControlLabel value={"right"} control={<Radio color="primary" />} label="Bên phải" />
                <FormControlLabel value={"bottom"} control={<Radio color="primary"/>} label="Phía dưới" />
            </div>
            </RadioGroup>
        </FormControl>
    </ListItem>

    <ListItem style={{margin:0, padding:0, marginBottom:8}}>
        <Typography style={{fontWeight:500, marginRight:20, color:"#000",fontSize:15}}>Tên cột: </Typography>
        <FormControl component="fieldset">
            <RadioGroup  name="header" value={web.cart.header} onChange={handleChangeCart}>
            <div>
                <FormControlLabel value={"show"} control={<Radio color="primary"/>} label="Hiển thị" />

                <FormControlLabel value={"none"} control={<Radio color="primary" />} label="Không hiển thị" />
            </div>
            </RadioGroup>
        </FormControl>
    </ListItem>
    </>
  )
}

export default CartSetting