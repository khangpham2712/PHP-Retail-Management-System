import React from 'react'
import {useTheme, makeStyles,createStyles} from "@material-ui/core/styles";
import {Grid,Card,Box, Typography,DialogTitle,TextField,InputAdornment,DialogActions,DialogContent,IconButton,Button,Dialog,FormControlLabel,Checkbox,FormControl,FormLabel,RadioGroup, Radio} from '@material-ui/core'
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
const CheckSummary = (props) => {
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

     //check confirm
    const [openConfirm, setOpenConfirm] = React.useState(false);
     const handleOpenConfirm = () => {
        setOpenConfirm(true);
       };
    const handleCloseConfirm = (status) => {
        setOpenConfirm(false);
        setAddStatus(status);
        if(status === "Success"){
            // onReload();
            setOpenBar(true);
        }else if (status === "Fail"){
            setOpenBar(true);
        }
    };
    //status add
    const [addStatus, setAddStatus] = React.useState(null);
    
    //noti
    const [openBar, setOpenBar] = React.useState(false);
    const handleCloseBar = () => {
      setOpenBar(false)
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
                
               
                        
                {/* when change mode to menu product */}
                {props.children}

                {/* 2. PAYMENT INFO  */}
                <Grid container direction="row" justifyContent="space-between" className={classes.marginBox}>
                    <Typography variant="h5">
                        Tổng tồn kho
                    </Typography>
                    <Typography variant="body2">
                            5
                    </Typography>
                </Grid>

                <Grid container direction="row" justifyContent="space-between" className={classes.marginRow}>
                    <Typography variant="h5">
                       Tổng SL thực tế
                    </Typography>
                    <Typography variant="body2">
                            500.000
                    </Typography>
                </Grid>
                <Grid container direction="row" justifyContent="space-between" className={classes.marginRow}>
                    <Typography variant="h5">
                       Tổng lệch
                    </Typography>
                    <Typography variant="body2">
                            500.000
                    </Typography>
                </Grid>

                        
                <Button variant="contained" fullWidth color="primary" style={{marginTop:40}} onClick={handleOpenConfirm}>
                    Kiểm  kho
                </Button>
                <Dialog open={openConfirm} onClose={handleCloseConfirm} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">
                        <Typography className={classes.headerTitle} variant="h5">
                        Xác nhận
                        </Typography>
                    </DialogTitle>

                    <DialogContent>
                        Cân bằng kho của bạn
                    </DialogContent>

                    <DialogActions>
                        <Button
                        onClick={() => handleCloseConfirm(null)}
                        variant="contained"
                        size="small"
                        color="secondary"
                        >
                        Huỷ
                        </Button>
                        <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        >
                        OK
                        </Button>
                    </DialogActions>
                    </Dialog>


        </Grid>
    </Box>

    )
}

export default CheckSummary

