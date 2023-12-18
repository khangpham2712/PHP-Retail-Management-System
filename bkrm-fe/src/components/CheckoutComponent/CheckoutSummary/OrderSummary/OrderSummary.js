import React from 'react'
import {useTheme, makeStyles,createStyles} from "@material-ui/core/styles";
import {Grid,Card,Box, Typography,TextField,InputAdornment,DialogActions,DialogContent,IconButton,Button,Dialog,FormControlLabel,Checkbox,FormControl,FormLabel,RadioGroup, Radio} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import AddSupplier from '../../../../views/InventoryView/Supplier/AddSupplier/AddSupplier'

import SearchSupplier from '../../../SearchBar/SearchSupplier';

//import project 
import * as Input from '../../../TextField/NumberFormatCustom'
import { grey} from '@material-ui/core/colors'

import SupplierData from '../../../../assets/JsonData/supplier.json'
import supplierApi from '../../../../api/supplierApi';

const useStyles = makeStyles((theme) =>
createStyles({
  marginBox:{
    marginTop:30
  },
  marginRow:{
    marginTop:5
  },
  hidden:{
    display: "none",
  },
  headerTitle:{
    fontSize: "1.125rem",
  }
}));
const OrderSummary = (props) => {
    const {cartData, updateCustomer,currentCustomer, mode} = props;
    const theme = useTheme();
    const classes = useStyles(theme);
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
      };
    const handleClose = (status) => {
        setOpen(false);
    };

    //phuong thuc thanh toan
    const [payment, setPayment] = React.useState('cash');

    const handleChangePayment = (event) => {
        setPayment(event.target.value);
    };
    //mode 2: popup
    const [openPopUp, setOpenPopUp] = React.useState(false);
    const handleClickOpenPopUp = () => {
        setOpenPopUp(true);
    };

    const handleClosePopUp = () => {
        setOpenPopUp(false);
    };


    return (
        
        <Box style={{padding:30,minHeight:'80vh'}}>
                    
            <Grid container direction="column"  alignItems="flex-start" spacing={3}>
                <Grid container direction="row" justifyContent="space-between" >
                        {/* 1. BASIC INFO */}
                    <Grid item  xs={8} container direction="column"  alignItems="flex-start">
                        <Typography variant="h5">
                            Chi nhánh 
                        </Typography>
                        <Typography variant="body2">
                            Chi nhánh trung tâm
                        </Typography>
                        
                    </Grid>
                    
                    <Grid item xs={4} container direction="column"  alignItems="flex-end">
                        <Typography variant="body2">
                            22/12/2008
                        </Typography>
                        <Typography variant="body2">
                            22:30
                        </Typography>
                    </Grid>
                </Grid>
                
                <div style={{ width: '100%'}}>
                    
                        {/* <Autocomplete
                            id="free-solo-demo"
                            freeSolo
                            value={currentCustomer}
                            options={SupplierData}
                            getOptionLabel={(option) => option.name.concat(" - ").concat(option.phone) } 
                            onChange={(event, value) => {updateCustomer(value);}} 
                            renderInput={(params) => (
                                <TextField 
                                {...params}
                                fullWidth 
                                placeholder="Tìm nhà cung cấp"
                                margin="normal"  
                                InputProps={currentCustomer === null? {
                                    ...params.InputProps,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                        <SearchIcon style={{color:grey[500]}}/>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <IconButton aria-label="delete"  size="small" onClick={handleClickOpen} style={{marginRight:-30}}>
                                            <AddIcon/>
                                        </IconButton>
                                        ),
                                    }: {
                                    ...params.InputProps,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                        <SearchIcon style={{color:grey[500]}}/>
                                        </InputAdornment>
                                    ),
                                    }}
                                
                                />
                            )}  
                            renderOption={(option) => {
                                return (
                                <Grid fullWidth container direction="row" justifyContent="space-between"  >
                                    <Typography variant="h5">{option.name}</Typography>
                                    <Typography variant="body1">{option.phone}</Typography>               
                                </Grid>
                                )
                              }}          
                        /> */}

                        <SearchSupplier handleClickOpen={handleClickOpen} selectedSupplier={{name: "", phone:""}}/>

                </div>
                
                <AddSupplier  open={open} handleClose={handleClose}/>
            
                {/* when change mode to menu product */}
                {props.children}

                {/* 2. PAYMENT INFO  */}
                <Grid container direction="row" justifyContent="space-between" className={classes.marginBox}>
                    <Typography variant="h5">
                        Tổng số mặt hàng
                    </Typography>
                    <Typography variant="body2">
                            5
                    </Typography>
                </Grid>

                <Grid container direction="row" justifyContent="space-between" className={classes.marginRow}>
                    <Typography variant="h5">
                        Khoảng tiền hàng
                    </Typography>
                    <Typography variant="body2">
                            500.000
                    </Typography>
                </Grid>

                {/* <Grid container direction="row" justifyContent="space-between"className={classes.marginRow}>
                    <Typography variant="h5">
                        Tiền đã cọc
                    </Typography>
                    <Typography variant="body2">
                        400.000
                    </Typography>
                </Grid> */}           
                <Button variant="contained" fullWidth color="primary" style={{marginTop:40}} onClick={()=>{console.log("Gui mail NCC")}}>
                    Đặt hàng
                </Button>
        </Grid>
    </Box>

    )
}

export default OrderSummary

