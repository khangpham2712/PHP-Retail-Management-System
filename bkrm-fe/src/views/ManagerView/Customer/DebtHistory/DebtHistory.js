import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    ListItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography
} from "@material-ui/core";
import React, { useEffect, useState } from 'react'

import SearchBar from "../../../../components/SearchBar/SearchBar"
import TableHeader from "../../../../components/TableCommon/TableHeader/TableHeader"
import customerApi from '../../../../api/customerApi';
import moment from "moment"
import {useFormik} from 'formik'
import { useSelector } from "react-redux";
import useStyles from "../../../../components/TableCommon/style/mainViewStyle";

const DebtHistory = ({open,onClose}) => {
    const [debtHistory, setDebtHistory] = useState([]);
    const current = moment(new Date()).format("YYYY-MM-DD")
    const formik = useFormik({
        initialValues: {
            startDate: current,
            endDate: current,
            searchKey: ''
        },
        onSubmit: (query) => {
            fetchData(query)
        }
    })
    const classes = useStyles()
    const info = useSelector(state => state.info)
    const store_uuid = info.store.uuid

    const fetchData = async (query) => {
        try {
            const res = await customerApi.getCustomerDebts(store_uuid, query);
            setDebtHistory(res.data);
        } catch(err) {
            console.log(err)
        }
    }
    useEffect(() => {
        if (store_uuid) fetchData(formik.initialValues);
    }, [store_uuid])
  return (
    <Dialog open={open} onClose={onClose}  maxWidth="sm" fullWidth={true} >
        <Paper style={{padding:15}}>
            <Grid container justifyContent="space-between">
                <Grid item><Typography style={{marginBottom:20, marginTop:10 }}  variant="h2"> Lịch sử thu nợ  </Typography> </Grid>
                <Grid  item >
                    <ListItem style={{margin:0, padding:0}}>
                        <TextField id="startDate" label="Từ"  type="date"  name="startDate" variant="outlined" size="small" fullWidth   className={classes.textField}  InputLabelProps={{ shrink: true }} 
                            value={formik.values.startDate.length === 0 ? current :formik.values.startDate} 
                            onChange={formik.handleChange}
                        />
                        <TextField style={{marginLeft:5}} id="endDate" label="Đến" type="date" name="endDate" variant="outlined" size="small"  fullWidth className={classes.textField}   InputLabelProps={{ shrink: true }} 
                            value={formik.values.endDate}  
                            onChange={formik.handleChange}
                        />
                        <Button variant="contained" color="primary" size="small" style={{marginLeft:10}} onClick={formik.handleSubmit}>Lọc</Button>
                    </ListItem >
                </Grid>
            </Grid>
            <Grid container  justifyContent="flex-end" >
                <SearchBar name="searchKey" value={formik.values.searchKey} onChange={formik.handleChange} title={"Tìm kiếm khách hàng ..."} style={{width:250,  marginBottom:20}}/>
             </Grid>
     
            <TableContainer style={{maxHeight: '64vh', minHeight:'60vh'}}>
                <Table size={ 'small' } >
                    <TableHeader
                        classes={classes}
                        order={debtHistory}
                        color="#000"
                        headerData={DebtHistoryHeadCells}
                    />
                    <TableBody>
                        {debtHistory.map((row, index) => {
                        return (
                            <TableRow>
                                <TableCell align="left" style={{color:'#000'}}> {row.date?.split(" ")[0].split('-').reverse().join('/').concat("\u00a0\u00a0"+ row.date?.split(" ")[1].substr(0, 5)) } </TableCell>
                                <TableCell align="left" style={{color:'#000'}} > {row.customer_name}  {row.customer_phone ? ` - ${row.customer_phone}` :null}</TableCell>
                                <TableCell align="left" style={{color:'#000'}} > {row.created_user_name}</TableCell>
                                <TableCell align="right" style={{color:'#000'}} > {row.amount} </TableCell>
                            </TableRow>
                        );
                        })}
                        
                    </TableBody>
                </Table>       
          </TableContainer>
        </Paper>
    </Dialog>
  )
}

export default DebtHistory

const DebtHistoryHeadCells = [
    { id: "date", align: "left", disablePadding: false, label: "Ngày thu" },
    { id: "customer", align: "left", disablePadding: false, label: "Khách hàng" },
    { id: "customer", align: "left", disablePadding: false, label: "Người thực hiện" },
    { id: "total", align: "right", disablePadding: false, label: "Tiền thu" },
]