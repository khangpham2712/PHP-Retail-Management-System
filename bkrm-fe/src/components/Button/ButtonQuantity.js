import React, { useEffect } from 'react'
import {Grid,Card,Box,Tooltip,TextField,ListItem,Divider,IconButton,TableRow,TableCell,TableBody,Typography} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import useStyles from "../../components/TableCommon/style/mainViewStyle";
import {withStyles} from "@material-ui/core/styles";

import RemoveIcon from '@material-ui/icons/Remove';
import clsx from "clsx";
import WarningIcon from '@material-ui/icons/Warning';
const ButtonQuantity = (props) =>{
    const classes = useStyles();
    const {quantity,setQuantity, limit, isReturn,branch_quantity,isMini,miniCart,isCustomer,isManageInventory, mini} = props;
    const [show, setShow] = React.useState('none');
  
    const handleIncrement = () => {
      //them cai nay
       if (limit && Number(limit) === 0){
        setQuantity(quantity)
        return
      }

      else if(limit) {
        if(quantity >= Number(limit)) {
          setQuantity(quantity)
          return
        } 
      } 
     
      setQuantity(quantity+ 1);
    };
  
    const handleDecrement = () => {
      if(quantity >=1){setQuantity(quantity- 1);}
    };

    
    const handleShow = () => {
      setShow('block');
    };
    const handleClose = () => {
      setShow('none');
    };
  
    const HtmlTooltip = withStyles((theme) => ({
      tooltip: {
        backgroundColor: '#9f9fa1',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
      },
    }))(Tooltip);

    var error_quantity = quantity > branch_quantity;

    const handleQuantity = (e) =>{

      //  if (!isNaN(e.target.value) && e.target.value >0){
      //   setQuantity(parseInt(e.target.value))
      // } 
     setQuantity(parseInt(e.target.value))
    }
   
    return(
    <ListItem onMouseOver={handleShow} onMouseOut={handleClose} style={isMini ||miniCart? {padding:0,paddingTop:5,paddingBottom:5, margin:0} : {}} > 

        {error_quantity && isMini && isManageInventory?
            <HtmlTooltip title={ <React.Fragment>
                <Typography color="inherit"><b>Vượt tồn kho</b> </Typography>   <u>{"Tồn kho:"}</u> <b>{branch_quantity}</b> 
                </React.Fragment> } >
              <WarningIcon fontSize="small"  style={{fill: "red"}}/> 
          </HtmlTooltip>:null}

          {/* margin:isMini?0:null, padding:isMini?0:null */}
         {!miniCart? <IconButton style={{ display: isMini?true:show ,color: error_quantity && isManageInventory ? "red":null,margin:isMini?0:null, padding:isMini?0:null,}} aria-label="delete" className={classes.margin} size="small" onClick={handleDecrement} >
            <RemoveIcon fontSize="inherit" />
          </IconButton> :null}
             
           <TextField  variant={isMini || miniCart? "outlined" : "standard"} id="standard-basic" style={{width:isMini||miniCart?35 + (quantity).toString().length*10-10:35,minWidth:45,padding:0, marginLeft:isCustomer || isMini?20:null,marginRight:isCustomer|| isMini?20:null}} className={clsx(classes.textfieldClass,(show === 'none'||miniCart) ? classes.padding : null)}  size="small" inputProps={{style: { textAlign: isMini?"center": "right", color: error_quantity  && isManageInventory  ? "red":null, fontWeight:error_quantity  && isManageInventory ? 600:null,
              backgroundColor:error_quantity  && isManageInventory ?"#ffe8e8":null, height:miniCart?12:null
            }}} 
          value={quantity} onChange={handleQuantity}/>
     
           
          {isReturn ? `/${limit}`: null}
          {!miniCart? <IconButton style={{ display: isMini?true:show ,color: error_quantity  && isManageInventory  ? "red":null ,margin:isMini?0:null, padding:isMini?0:null,} } aria-label="delete" className={classes.margin} size="small" onClick={handleIncrement}>
            <AddIcon fontSize="inherit" />
          </IconButton>:null}



{/* Error  */}
          {error_quantity && !isMini  && isManageInventory  && !miniCart?
     
        <HtmlTooltip
        title={
          <React.Fragment>
            <Typography color="inherit"><b>Vượt tồn kho</b> </Typography>
            <u>{"Tồn kho:"}</u> <b>{branch_quantity}</b> 
           
          </React.Fragment>
        }
      >
         <WarningIcon fontSize="small"  style={{fill: "red"}}/> 
      </HtmlTooltip>
         
          
          :null}

    </ListItem>  
    )
  }

export default ButtonQuantity
