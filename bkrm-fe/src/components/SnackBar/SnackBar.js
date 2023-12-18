import React from 'react'
import MuiAlert from '@material-ui/lab/Alert';
import {Snackbar} from '@material-ui/core';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const SnackBar = (props) => {
    const {handleCloseBar,openBar,addStatus} =props;
    return (
        <Snackbar
        anchorOrigin={{ vertical: 'top',horizontal:  'right' }}
        open={openBar}
        onClose={handleCloseBar}
        autoHideDuration={2000} 
      >
        {addStatus === "Success" ? 
        <Alert onClose={handleCloseBar} severity="success">
            Thêm thành công
        </Alert> 
        :  <Alert onClose={handleCloseBar} severity="error">
            Thêm thất bại
        </Alert> }

      </Snackbar>
    )
}

export default SnackBar
