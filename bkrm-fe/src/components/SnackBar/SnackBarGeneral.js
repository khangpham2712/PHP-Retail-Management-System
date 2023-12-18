import React from 'react'
import MuiAlert from '@material-ui/lab/Alert';
import {Snackbar} from '@material-ui/core';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const SnackBarGeneral = (props) => {
    const {open,status, handleClose} =props;
    return (
        <Snackbar
        anchorOrigin={{ vertical: 'top',horizontal:  'right' }}
        open={open}
        onClose={handleClose}
        autoHideDuration={2000} 
      >
        <Alert severity={status.style} onClose={handleClose}>
            {status.message}
        </Alert> 
      </Snackbar>
    )
}

export default SnackBarGeneral
