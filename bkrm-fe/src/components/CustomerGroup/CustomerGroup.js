import {
    Avatar,
    Dialog,
    Grid,
    Paper,
    ButtonBase,
    Typography,
    Tooltip
} from "@material-ui/core";
import React, { useEffect, useState } from 'react'
import AddIcon from '@material-ui/icons/Add';
import { useFormik } from 'formik'
import { useSelector } from "react-redux";
import useStyles from "../TableCommon/style/mainViewStyle";
import customerApi from "../../api/customerApi";
import CustomerGroupForm from "./CustomerGroupForm";
import CustomerGroupView from "./CustomerGroupView";
import {useDispatch} from 'react-redux';
import {statusAction} from '../../store/slice/statusSlice'
const CustomerGroup = ({ open, onClose, custGroups, fetchData }) => {
    const classes = useStyles();
    const info = useSelector(state => state.info);
    const store_uuid = info.store.uuid;
    const dispatch = useDispatch();

    const [selectedGroup, setSelectedGroup] = useState(-1);
    
    const [isAddOpen, setIsAddOpen] = useState(false);
    
    const handleDelete = async (id) => {
        try {
            const response = await customerApi.deleteCustomerGroup(store_uuid, id);
            await fetchData();
            dispatch(statusAction.successfulStatus("Xóa thành công"))
        } catch (err) {
            console.log(err);
            dispatch(statusAction.failedStatus("Xóa thất bại"))
        }
    }

    const handleSave = async (customerGroup) => {
        try {
            const body = {...customerGroup, store_id: info.store.id, conditions: JSON.stringify(customerGroup.conditions)}
            if (customerGroup.id) {
                const response = await customerApi.updateCustomerGroup(store_uuid, customerGroup.id, body);
                dispatch(statusAction.successfulStatus("Chỉnh sửa thành công"));
            } else {
                const response = await customerApi.createCustomerGroup(store_uuid, body);
                dispatch(statusAction.successfulStatus("Thêm thành công"));
            }
            setIsAddOpen(false);
            setSelectedGroup(-1);
            await fetchData();
        } catch(err) {
            console.log(err)
            dispatch(statusAction.failedStatus("Thất bại"))
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth={true} >

            <Paper style={{ padding: 15 }}>
                <Grid container justifyContent="space-between">
                    <Grid item><Typography style={{ marginBottom: 20, marginTop: 10 }} variant="h2">Nhóm khách hàng</Typography> </Grid>
                    <ButtonBase sx={{ borderRadius: '16px' }}
                        onClick={() => setIsAddOpen(!isAddOpen)}
                    >
                        <Avatar variant="rounded" className={classes.headerAvatar}  >
                            <Tooltip title='Thêm nhóm khách hàng'>
                                <AddIcon stroke={1.5} size="1.3rem" />
                            </Tooltip>
                        </Avatar>
                    </ButtonBase>
                </Grid>

                {isAddOpen ? <CustomerGroupForm customerGroup={custGroups.find((c) => c.id === selectedGroup)} onSave={handleSave} onClose={() => setIsAddOpen(false)} /> :
                    <CustomerGroupView custGroups={custGroups} onSelect={(index) => {console.log(index); setSelectedGroup(index); setIsAddOpen(true)}} handleDelete={handleDelete}/>}
            </Paper>
        </Dialog>
    )
}

export default CustomerGroup;