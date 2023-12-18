import React from 'react'
import {Table,TableContainer,Box,Grid,FormControlLabel,Switch,Paper, TablePagination,Typography} from '@material-ui/core';
import { Pagination } from 'antd';

const Paginations = ({ pagingState, setPagingState, list}) => {

  React.useEffect(()=>{
    window.scrollTo(0, 0);
  },[list])



  return (
    <TablePagination
        // style={{marginTop:-25,marginBottom:60, marginLeft:-5}}
        rowsPerPageOptions={[10, 25, 100]}
        rowsPerPage={10}
        labelRowsPerPage={"Dòng"}
        component="div"
        count={pagingState?.total_rows}
        rowsPerPage={pagingState?.limit}
        page={pagingState?.page}
        onPageChange={(e, page) => setPagingState({ ...pagingState, page: page })}
        onRowsPerPageChange={(e) => setPagingState({ ...pagingState, page: 0, limit: +e.target.value })}
    />
    // <Box style={{width:500}}>
    // <Pagination

    //       style={{minWidth:500}}
    //         size="small"
    //         total={pagingState?.total_rows}
    //         current={pagingState?.page +1}
    //         onChange={(newCurrent, newPageSize) => {
    //             const pageSizeChange = pagingState?.limit !== newPageSize;
    //             if (!pageSizeChange) {
    //                 setPagingState({ ...pagingState, page: newCurrent -1 })
    //                 // tableRef.current && tableRef.current.scrollIntoView();
    //             } else {
    //                 setPagingState({ ...pagingState, page: 0, limit: newPageSize})
    //                 // tableRef.current && tableRef.current.scrollIntoView();

    //             }
    //           }}
    //           showSizeChanger={true}
    //         />
  // </Box>
  )
}

export default Paginations