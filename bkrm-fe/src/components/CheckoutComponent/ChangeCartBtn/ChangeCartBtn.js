import React from 'react'
import {useTheme} from "@material-ui/core/styles";
import useStyles from "../../TableCommon/style/mainViewStyle";

//import library 
import {Grid,Card,Box,Tabs,Tab,TableContainer,CardContent,CardMedia,CardActionArea,FormControlLabel,Switch,Menu,MenuItem,ListItem,IconButton,TableBody,Typography} from '@material-ui/core'

import AddIcon from '@material-ui/icons/Add';
import SwapVertTwoToneIcon from '@material-ui/icons/SwapVertTwoTone';
import HighlightOffTwoToneIcon from '@material-ui/icons/HighlightOffTwoTone';

const ChangeCartBtn = (props) => {
    const {selectedIndex,anchorEl,cartList,handleClick,handleClose,handleChoose,handleDelete,handleAdd, isCart} =props;

    const theme = useTheme();
    const classes = useStyles(theme);
    let hardText = isCart ? "Khách lẻ" :"Nhà cung cấp lẻ";

    const getTitle = (cart) => {
        if (isCart) {
            return cart.customer === null ? hardText : cart.customer.name
        } else {
            return cart.supplier === null  ? hardText: cart.supplier.name
        }
    }

    return (
        <>

        {cartList.length === 1 ?
            <IconButton  size="small" style={{marginLeft:25,color:'#000000', backgroundColor:theme.customization.primaryColor[100]}}>
                <AddIcon fontSize="inherit" onClick={handleAdd} />
            </IconButton>:
            <IconButton  size="small" style={{marginLeft:25,color:'#000000', backgroundColor:theme.customization.primaryColor[100]}}>
                <SwapVertTwoToneIcon fontSize="inherit"  onClick={handleClick}/>
            </IconButton>
        }
            <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            
        >
            {cartList.map((cart, index) => (
                <MenuItem
                    key={index}
                    selected={index === selectedIndex}
                >
                    <Grid container direction="row" justifyContent="space-between"spacing={1}>
                        <Grid container item onMouseDown={()=>handleChoose(index)} item xs={10}  >
                            <Box style={{marginRight:10}}>#{index + 1}</Box>
                            {getTitle(cart)}         
                        </Grid>
                
                        <Grid container xs={2} item>
                            <IconButton  size="small" style={{color:'#000000'}}>
                                <HighlightOffTwoToneIcon fontSize="inherit" onClick={()=>handleDelete(index )} />
                            </IconButton>
                        </Grid>
                    </Grid>
                    
                </MenuItem>
                ))}

            <MenuItem onClick={handleAdd}><Box style={{marginRight:10, fontSize:20}}>+</Box>Tạo giỏ mới</MenuItem>
        </Menu> 
        </>
    )
}

export default ChangeCartBtn
