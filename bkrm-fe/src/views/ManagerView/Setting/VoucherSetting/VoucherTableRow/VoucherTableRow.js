import React from 'react'
import useRowStyles from '../../../../../components/TableCommon/style/rowStyle'
import clsx from "clsx";
import { grey} from '@material-ui/core/colors'

import {TableCell,TableRow,Avatar,ListItem,Typography} from '@material-ui/core';


import {FormatedStatus} from '../../../../../components/TableCommon/util/format'
import ava from '../../../../../assets/img/product/lyimg.jpeg';
import VoucherDetail from './VoucherDetail/VoucherDetail'


const VoucherTableRow = (props) => {
    const { row, handleOpenRow,openRow} = props;
    const classes = useRowStyles();

    return (
        <>
        {/* ROW */}
            <TableRow
            onClick={() => handleOpenRow(row.uuid)}   
            key={row.uuid}
            className={ clsx(classes.row,(openRow === row.uuid) ? classes.rowClicked : null)}
            >
                <TableCell align="left">MÃ</TableCell>
                <TableCell align="left">TÊN</TableCell>
                <TableCell align="left">TỪ NGÀY</TableCell>
                <TableCell align="left" >ĐẾN NGÀY</TableCell> 
                {/* nhớ format .000 */}
                <TableCell align="left" >SỐ LƯỢNG</TableCell> 
                <TableCell align="left" >MÊNH GIÁ</TableCell> 

                <TableCell align="left" >TRẠNG THÁI</TableCell> 
            </TableRow>

        {/* DETAIL */}
            <TableRow>
              {/* colspan  => số cột trong collapse */}
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>           
                    <VoucherDetail parentProps={props}/>       
              </TableCell>
       
            </TableRow>
        </>
    )
}

export default VoucherTableRow
