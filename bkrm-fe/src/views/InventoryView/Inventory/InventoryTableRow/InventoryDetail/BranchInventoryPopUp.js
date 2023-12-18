import React, {useState} from 'react'
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import {
    Button,
    TextField,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Grid,
    Avatar,
    Dialog,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    FormControlLabel,
    Checkbox,
    Divider,
    ButtonBase,
    Tooltip,
    CardHeader,
    Input,
    Chip,
    IconButton,
    FormLabel,
    RadioGroup,
    Radio,
    Box,
    ListItem
  } from "@material-ui/core";
import clsx  from "clsx"
import _ from 'lodash'

import CloseIcon from "@material-ui/icons/Close";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { batch, useDispatch, useSelector } from "react-redux";
import ModalWrapperWithClose from "../../../../../components/Modal/ModalWrapperWithClose"
import { ThousandSeperatedInput } from '../../../../../components/TextField/NumberFormatCustom';
import productApi from '../../../../../api/productApi'
import { statusAction } from '../../../../../store/slice/statusSlice';
const useStyles = makeStyles((theme) =>
    createStyles({

    weight:{
        fontWeight:500,
        color: "#000",
        fontSize: 14,
    },
    headerTitle: {
        fontSize: "1.125rem",
      },

})
);
const BranchInventoryPopUp = ({open,onClose, branchs,branch_inventories,setReload,batches,has_batches,row }) => {
    const theme = useTheme();
  const classes = useStyles(theme);
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  console.log("branch_inventories",branch_inventories)
  const findBranchQuantity = (id) => {
    // if(!branch_inventories){return -1}
    const rs = branch_inventories?.find(x => x.uuid === id)?.quantity_available
    if(rs){return rs.toLocaleString() }
    else{ return 0}
  }
  const [openModal, setOpenModal] = useState(null)
  const dispatch = useDispatch();
    const generateInitial = () =>{
        let arr = []
         batches.map(item => arr.push({batch_code: item.batch_code , quantity: 0, expiry_date: item.expiry_date, position: item.position} ))
        return arr
    }
    const [valueQuantity,setValueQuantity] = useState(!has_batches?0:generateInitial())
  const confirmTransferQuantity = async () => {  
    //CALL API HERE
    //   openModal : branch chuyển tới

    //   valueQuantity: SL chuyển 
    //( + nếu là lô thì là array object [{batch_code:"L0001", quantity:"2"}])
     //( + nếu ko là lô thì là số 

    const body = {
        to_id: openModal.id,
        value_quantity: has_batches ? _.sumBy(valueQuantity, 'quantity') : valueQuantity,
        batches: JSON.stringify(Array.isArray(valueQuantity) ? valueQuantity.filter(batch => batch.quantity) : []),
        has_batches: has_batches,
        product_id: row.id,
        to_name: openModal.name,
        created_user_id: info.user.id,
        created_user_name: info.user.name,
        created_user_type: info.role,
    }
    try {
        const res = await productApi.transferInventory(store_uuid, branch_uuid, body);
        dispatch(statusAction.successfulStatus('Chuyển tồn kho thành công!'))
    } catch (err) {
        console.log(err)
        dispatch(statusAction.failedStatus('Chuyển tồn kho thất bại'))
    }

    setOpenModal(null)
    onClose()
    setReload()
  }
  const currenBranchInventory = findBranchQuantity(branch_uuid)
 var totalQuantity = 0;
    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="xs" fullWidth={true}>
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
                    <DialogTitle id="form-dialog-title">
                        <Typography className={classes.headerTitle} variant="h3" >
                            Chi tiết tồn kho
                        </Typography>
                    </DialogTitle>

                    <IconButton aria-label="close"   onClick={onClose}>
                        <CloseIcon  fontSize="small" />
                    </IconButton>
            </Grid>
           
            <DialogContent>
               
                  {batches?.length !== 0 ? 
                  <>
                  <Grid container  style={{ marginBottom:10}}>
                        <Grid item xs={3} style={{color:'#000', fontWeight:500}}> Mã lô </Grid>
                        <Grid item xs={4} style={{color:'#000', fontWeight:500}}> Ngày hết hạn </Grid>
                        <Grid item xs={3} style={{color:'#000', fontWeight:500}}> Vị trí </Grid>
                        <Grid item xs={2} style={{color:'#000', fontWeight:500}}> Tồn kho </Grid>
                    </Grid>

                    {batches?.map((batch) => (
                        <Grid container  spacing={2}>
                                <Grid item xs={3}> {batch?.batch_code} </Grid>
                                <Grid item xs={4}> {batch?.expiry_date?.substring(0, 10)} </Grid>
                                <Grid item xs={3}> {batch?.position} </Grid>
                                <Grid item xs={2}> {batch?.quantity} </Grid>
                        </Grid>
                     )) } 
                      <Divider style={{margin:20}} />
                    </>
                     :null}
              
               
                <Grid container style={{marginBottom:10}}>
                    <Grid item xs={6}> </Grid>
                    <Grid item xs={2} style={{color:'#000', fontWeight:500}}> Đặt </Grid>
                    <Grid item xs={2} style={{color:'#000', fontWeight:500}}> Tồn </Grid>
                    <Grid item xs={2}> </Grid>
                </Grid>
                {branchs.map((item=>{ 
                const quantity  = findBranchQuantity(item.uuid)
                totalQuantity = totalQuantity +Number(quantity) 
                    return (
                    <Grid container>
                        <Grid item xs={6} style={{color:'#000', fontWeight:500, marginBottom:25}}>
                            {item.name}
                        {item.uuid === branch_uuid ? <CheckCircleIcon style={{marginLeft:10}}fontSize="small" color='primary'/> :null} </Grid>

                        <Grid item xs={2}>{row.branch_inventories.find(b => b.uuid === item.uuid)?.ordering_quantity}</Grid>
                        <Grid item xs={2}>{quantity}</Grid>

                       <Grid item xs={2}> {item.uuid !== branch_uuid ? <Button color='primary' variant='contained'size='small'style={{textTransform:'none'}} onClick={()=>setOpenModal(item)}>Chuyển</Button>:null}</Grid>
                    </Grid>
                )}))}

                
                <Divider />
                <Grid container>
                    <Grid item xs={7} ></Grid>
                    <Grid item xs={2} style={{color:'#000', fontWeight:500}}>Tổng: {totalQuantity}</Grid>
                    <Grid item xs={3}> </Grid>
                </Grid>



                {openModal?<ModalWrapperWithClose size='h4' title={<ListItem><Typography variant='h4'>Chuyển tồn kho đến </Typography><Typography variant='h4' style={{marginLeft:5,color:theme.customization.primaryColor[500]}}>{openModal.name} </Typography>  </ListItem>}open={openModal !== null}handleClose={()=>setOpenModal(null)}>
                        
                {!has_batches?
                        <>
                        <Typography variant='h5'>Số lượng </Typography>
                        <ListItem>
                            <ThousandSeperatedInput value={valueQuantity} onChange={(e)=>{setValueQuantity(e.target.value)}}/>
                            <Typography style={{fontWeight:500}}> / {currenBranchInventory}</Typography>
                        </ListItem>
                        {valueQuantity > Number(currenBranchInventory)? <Typography variant='h6' style={{color:'red'}}>Số lượng chuyển vượt tồn kho</Typography>:null}
                    </>:
                    batches.map((batch) => {
                        let newValueQuantity = [...valueQuantity]
                        let index = newValueQuantity.findIndex(item=>item.batch_code ===  batch?.batch_code)
                      
                     return(
                        <Grid container  spacing={3} alignItems='center' style={{margin:2}}>
                            <Grid item xs={3}> {batch?.batch_code} </Grid>
                            <Grid item xs={3}> {batch?.expiry_date?.substring(0, 10)} </Grid>
                            <Grid container item xs={4}  alignItems='center'>  
                                    <Grid item xs={6}>
                                        <ThousandSeperatedInput 
                                        value={newValueQuantity[index]?.quantity} 
                                            onChange={(e)=>{
                                                newValueQuantity[index].quantity= Number(e.target.value)
                                                setValueQuantity(newValueQuantity)                                          
                                            }}
                                            />
                                    </Grid>
                                    <Grid item xs={6}> <Typography style={{fontWeight:500}}> / {batch?.quantity}</Typography></Grid>
                                    {newValueQuantity[index]?.quantity > Number(batch?.quantity)? <Typography variant='h6' style={{color:'red'}}>Số lượng chuyển vượt tồn kho</Typography>:null}
                            </Grid>
                        </Grid>
                     )})  
                    
                    }
                        <Button disabled={valueQuantity > Number(currenBranchInventory) || valueQuantity === 0} onClick={()=>{confirmTransferQuantity()}}  variant="contained" size="small"  color="secondary" style={{marginTop:20}}>
                            Xác nhận 
                        </Button>

                    </ModalWrapperWithClose>:null}

            </DialogContent>
            <DialogActions>
        <Button  onClick={onClose}  variant="contained" size="small"  color="secondary" >
            Huỷ 
        </Button>
       
      </DialogActions>
  
              
        </Dialog>
    )
}

export default BranchInventoryPopUp
