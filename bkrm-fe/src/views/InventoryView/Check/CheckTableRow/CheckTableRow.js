import React from 'react'
//import style
import useStyles from "../../../../components/TableCommon/style/mainViewStyle";
//impỏrt library
import {Box,TextField,ListItem,IconButton,TableRow,TableCell,Typography} from '@material-ui/core'
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
//import project 
import * as Input from '../../../../components/TextField/NumberFormatCustom'
import ButtonQuantity from "../../../../components/Button/ButtonQuantity";

import icon from '../../../../assets/img/product/tch.jpeg';


export const CheckRow = ({row}) =>{
    const classes = useStyles(); 
    const [quantity, setQuantity] = React.useState(row.quantity);

    return (
      <TableRow hover key={row.id}>
         <TableCell align="left" style={{width:5}}>{row.stt}</TableCell>
          {/* <TableCell align="left">{row.id}</TableCell> */}
          <TableCell align="left" style={{minWidth:200}}>
            <ListItem  style={{marginLeft:-30, marginTop:-10, marginBottom:-10 }}> 
                <Box component="img" sx={{ height: 40, width: 40,  borderRadius:10,  marginRight:15 }}src={icon} />
                {row.name}
            </ListItem>  
            </TableCell>
          <TableCell align="right">
            100
          </TableCell>
  
          <TableCell align="left" padding='none' >
            <ButtonQuantity quantity={quantity} setQuantity={setQuantity}/> 
          </TableCell> 

          <TableCell align="right">
             {99 -100}
          </TableCell>
          
          <TableCell align="right"className={classes.boldText}>{row.price * row.quantity}</TableCell>
          <TableCell align="right" >
            <IconButton aria-label="expand row" size="small" >
                <DeleteForeverOutlinedIcon/>
            </IconButton>
          </TableCell>
        </TableRow>
    )
  }
export const CheckRowMini = ({row}) =>{
    const classes = useStyles(); 

    return (
        <TableRow hover key={row.id}>
        
          <TableCell align="left" >
            <ListItem  style={{marginLeft:-30, marginTop:-10, marginBottom:-10 }}> 
                <Box component="img" sx={{ height: 40, width: 40,  borderRadius:10,  marginRight:15 }}src={icon} />
                <Box direction="column">

                    <Typography className={classes.boldText} style={{marginBottom:3, fontSize:14.5,width:135, textOverflow: 'ellipsis' ,overflow: 'hidden',whiteSpace: 'nowrap' }}>{row.name}</Typography>
                    <Typography>100</Typography>
                    
                </Box>
            </ListItem>  
        </TableCell>
     
          <TableCell align="left" padding='none' >
              <TextField variant="outlined" defaultValue={row.quantity} style={{width:37,margin: 0}}  size="small" inputProps={{style: { paddingLeft: 5,paddingRight: 5, textAlign: "center"}}} />
          </TableCell> 
          
          <TableCell align="right"className={classes.boldText}>-5</TableCell>
          <TableCell align="left" >
            <IconButton aria-label="expand row" size="small"style={{marginLeft:-25}} >
                <DeleteForeverOutlinedIcon/>
            </IconButton>
          </TableCell>
        </TableRow>
    )
  }


