import React from 'react'
import BranchMap from '../../../components/BranchMap/BranchMap'
import {Typography,Box,Card, Button ,Grid,ButtonBase,Avatar,Tooltip,TableBody} from '@material-ui/core';

const StorePage = () => {
    return (
        <Box style={{marginTop:100, marginLeft:50, marginRight:50}}>
            <Typography style={{flexGrow: 1,textAlign: "center",}} variant="h2">
                Chi nhánh
            </Typography>
            <BranchMap />
        </Box>
    )
}

export default StorePage
