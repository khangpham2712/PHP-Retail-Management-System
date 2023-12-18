import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Button,
    IconButton,
} from "@material-ui/core";
import React from 'react'
import TableHeader from "../TableCommon/TableHeader/TableHeader";
import useStyles from "../TableCommon/style/mainViewStyle";
import { Delete, Edit } from '@material-ui/icons'
const mappingCriteria = (criteria) => {
    if (criteria === 'totalAmount') return "Tổng tiền mua";
    if (criteria === 'numOfOrder') return "Số hóa đơn";
    if (criteria === 'points') return "Điểm thưởng";
    if (criteria === 'time') return "Ngày tạo";
}
const CustomerGroupView = ({ custGroups, handleDelete, onSelect }) => {
    const classes = useStyles()
    return (<TableContainer style={{ maxHeight: '64vh', minHeight: '60vh' }}>
        <Table size={'small'} >
            <TableHeader
                classes={classes}
                color="#000"
                headerData={HeadCells}
            />
            <TableBody>
                {custGroups.map((row, index) => {
                    return (
                        <TableRow >
                            <TableCell align="left" style={{ color: '#000' }}> {row.name} </TableCell>
                            <TableCell align="left" style={{ color: '#000' }} >{row.discount}</TableCell>
                            <TableCell align="left" style={{ color: '#000' }} > {JSON.parse(row.conditions).map(cond => (<div><strong>{mappingCriteria(cond.criteria)}</strong> {`${cond.operation} ${cond.thres}`}</div>))}</TableCell>
                            
                            <TableCell align="right">
                                <div style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
                                    <IconButton size="small"  onClick={() => onSelect(row.id)} aria-label="delete" color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDelete(row.id)} aria-label="delete" color="secondary">
                                        <Delete />
                                    </IconButton>
                                </div>

                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    </TableContainer>);
}

export default CustomerGroupView;

const HeadCells = [
    { id: "name", align: "left", disablePadding: false, label: "Tên nhóm" },
    { id: "discount", align: "left", disablePadding: false, label: "Giảm giá" },
    { id: "condition", align: "left", disablePadding: false, label: "Điều kiện" },
]