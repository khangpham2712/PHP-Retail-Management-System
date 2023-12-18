import React from 'react'
import {useTheme, makeStyles,createStyles} from "@material-ui/core/styles";
import {Grid,Card,Box, Typography,TextField,InputAdornment,DialogActions,DialogContent,IconButton,Button,Dialog,FormControlLabel,Checkbox,FormControl,FormLabel,RadioGroup, Radio} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import AddCustomer from '../../../../views/ManagerView/Customer/AddCustomer/AddCustomer'

//import project 
import * as Input from '../../../TextField/NumberFormatCustom'
import { grey} from '@material-ui/core/colors'

import CustomerData from '../../../../assets/JsonData/customer.json'

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
const CartSummary = (props) => {
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

    // giao hang
    const [deliver, setDeliver] = React.useState(false)
    
        const handleChangeDeliver = (event) => {
        setDeliver(event.target.checked );
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
      <Grid container direction="column" alignItems="flex-start" spacing={3}>
        <Grid container direction="row" justifyContent="space-between">
          {/* 1. BASIC INFO */}
          <Grid
            item
            xs={8}
            container
            direction="column"
            alignItems="flex-start"
          >
            <Typography variant="h5">Chi nhánh</Typography>
            <Typography variant="body2">Chi nhánh trung tâm</Typography>
          </Grid>

          <Grid item xs={4} container direction="column" alignItems="flex-end">
            <Typography variant="body2">22/12/2008</Typography>
            <Typography variant="body2">22:30</Typography>
          </Grid>
        </Grid>

        <div style={{ width: "100%" }}>
          <Autocomplete
            id="free-solo-demo"
            freeSolo
            value={currentCustomer}
            options={CustomerData}
            getOptionLabel={(option) =>
              option.name.concat(" - ").concat(option.phone)
            }
            onChange={(event, value) => {
              updateCustomer(value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                placeholder="Tìm khách hàng"
                margin="normal"
                InputProps={
                  currentCustomer === null
                    ? {
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon style={{ color: grey[500] }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={handleClickOpen}
                            style={{ marginRight: -30 }}
                          >
                            <AddIcon />
                          </IconButton>
                        ),
                      }
                    : {
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon style={{ color: grey[500] }} />
                          </InputAdornment>
                        ),
                      }
                }
              />
            )}
            renderOption={(option) => {
              return (
                <Grid
                  fullWidth
                  container
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography variant="h5">{option.name}</Typography>
                  <Typography variant="body1">{option.phone}</Typography>
                </Grid>
              );
            }}
          />
        </div>

        <AddCustomer
          open={open}
          handleClose={handleClose}
          onReload={() => {}}
        />

        {/* when change mode to menu product */}
        {props.children}

        {/* 2. PAYMENT INFO  */}
        {!mode ? (
          <>
            {/* 2.1 Mode 1 */}
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              className={classes.marginBox}
            >
              <Typography variant="h5">Tổng SL sản phẩm</Typography>
              <Typography variant="body2">5</Typography>
            </Grid>

            <Grid
              container
              direction="row"
              justifyContent="space-between"
              className={classes.marginRow}
            >
              <Typography variant="h5">Tổng tiền hàng</Typography>
              <Typography variant="body2">500.000</Typography>
            </Grid>

            <Grid
              container
              direction="row"
              justifyContent="space-between"
              className={classes.marginRow}
            >
              <Typography variant="h5">Giảm giá</Typography>
              <Input.ThousandSeperatedInput
                id="standard-basic"
                style={{ width: 90 }}
                size="small"
                inputProps={{ style: { textAlign: "right" } }}
              />
            </Grid>

            <Grid
              container
              direction="row"
              justifyContent="space-between"
              className={classes.marginRow}
            >
              <Typography variant="h5">Khách cần trả</Typography>
              <Typography variant="body2">400.000</Typography>
            </Grid>

            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              className={classes.marginRow}
            >
              <Typography variant="h5">Khách thanh toán</Typography>
              <Input.ThousandSeperatedInput
                id="standard-basic"
                style={{ width: 90 }}
                size="small"
                inputProps={{ style: { textAlign: "right" } }}
              />
            </Grid>

            <Grid
              container
              direction="row"
              justifyContent="space-between"
              className={classes.marginRow}
            >
              <Typography variant="h5">Tiền thối</Typography>
              <Typography variant="body2">1.000</Typography>
            </Grid>

            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              className={classes.marginRow}
            >
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="gender"
                  name="gender1"
                  value={payment}
                  onChange={handleChangePayment}
                >
                  <Grid container direction="row">
                    <FormControlLabel
                      labelPlacement="start"
                      value="card"
                      control={<Radio />}
                      label="Thẻ"
                    />
                    <FormControlLabel
                      labelPlacement="start"
                      value="cash"
                      control={<Radio />}
                      label="Tiền mặt"
                    />
                  </Grid>
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Checkbox checked={deliver} onChange={handleChangeDeliver} />
                }
                label="Giao hàng"
              />
            </Grid>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              style={{ marginTop: 40 }}
            >
              Thanh toán
            </Button>
          </>
        ) : (
          /* 2.2 Mode 2 */
          <>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              className={classes.marginRow}
            >
              <Typography variant="h5">Tổng tiền hàng (5)</Typography>
              <Typography variant="body2">500.000</Typography>
            </Grid>

            <Grid
              container
              direction="row"
              justifyContent="space-between"
              className={classes.marginRow}
            >
              <Typography variant="h5">Giảm giá</Typography>
              <Input.ThousandSeperatedInput
                id="standard-basic"
                style={{ width: 90 }}
                size="small"
                inputProps={{ style: { textAlign: "right" } }}
              />
            </Grid>

            <Button
              variant="contained"
              fullWidth
              color="primary"
              style={{ marginTop: 20 }}
              onClick={handleClickOpenPopUp}
            >
              <Grid container direction="row" justifyContent="space-between">
                <Grid item>Tính tiền </Grid>
                <Grid item>500.000 </Grid>
              </Grid>
            </Button>
            <Dialog
              open={openPopUp}
              onClose={handleClosePopUp}
              aria-labelledby="form-dialog-title"
            >
              <CheckoutPopUp />
            </Dialog>
          </>
        )}
      </Grid>
    );
}

export default CartSummary


const CheckoutPopUp = (props)=>{
    const {onClose,handleChangePayment,payment,handleChangeDeliver,deliver}= props;
    const theme = useTheme();
    const classes = useStyles(theme);
    return(
       <>
        <Box style={{marginTop:20, marginLeft:15, marginBottom:10}}>
            <Typography className={classes.headerTitle} variant="h5">
            Tính tiền
            </Typography>
        </Box>
        <DialogContent>
            <Grid container direction="row" justifyContent="space-between" className={classes.marginRow}>
                <Typography variant="h5">
                    Tổng tiền hàng 
                </Typography>
                <Typography variant="body2">
                    500.000
                </Typography>
            </Grid>
            <Grid container direction="row" justifyContent="space-between"  alignItems="center" className={classes.marginRow}>
                <Typography variant="h5" style={{paddingRight:50}}>
                    Khách thanh toán
                </Typography>
                <Input.ThousandSeperatedInput id="standard-basic" style={{width:90 }} size="small" inputProps={{style: { textAlign: "right" }}}   />
            </Grid>
            <Grid container direction="row" justifyContent="space-between" className={classes.marginRow}>
                <Typography variant="h5">
                    Tiền thối
                </Typography>
                <Typography variant="body2">
                    1.000
                </Typography>
            </Grid>
            <Grid container direction="row" justifyContent="flex-end" alignItems="center" className={classes.marginRow}>
                    <FormControl component="fieldset">
                        <RadioGroup aria-label="gender" name="gender1" value={payment} onChange={handleChangePayment}>
                            <Grid container direction="row">
                                <FormControlLabel labelPlacement="start" value="card" control={<Radio />} label="Thẻ" />
                                <FormControlLabel labelPlacement="start" value="cash" control={<Radio />} label="Tiền mặt" />
                                
                            </Grid>
                        </RadioGroup>
                    </FormControl>

                </Grid>
                <Grid container direction="row" justifyContent="flex-end" alignItems="center" >
                    <FormControlLabel
                        labelPlacement="start"
                        control={ <Checkbox  checked={deliver} onChange={handleChangeDeliver} />  }
                        label="Giao hàng"
                    />
                </Grid>
        </DialogContent>
        <DialogActions>
            <Button variant="contained" onClick={onClose} fullWidth color="primary" style={{marginTop:40}}>
                Thanh toán
            </Button>
        </DialogActions>
      
        </>
    )
}