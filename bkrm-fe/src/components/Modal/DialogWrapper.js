import React from 'react'
import {

    DialogContent,
    DialogTitle,
    Typography,

    Dialog,
  } from "@material-ui/core";
const DialogWrapper = (props) => {

    const {handleClose, title,open} = props
  return (
    <Dialog  open={open} onClose={handleClose} maxWidth={'md'} >
      <DialogTitle id="form-dialog-title">
        <Typography style={{paddingTop: '24px', marginTop:-15, marginBottom:-10, }}  variant="h2">
         {title}
        </Typography>

      </DialogTitle>

      <DialogContent>
          {props.children}
      </DialogContent>
    
    </Dialog>
  )
}

export default DialogWrapper