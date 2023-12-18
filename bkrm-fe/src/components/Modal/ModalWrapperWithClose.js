import React from "react";
import {
  Modal,
  Box,
  Paper,
  Grid,
  ListItem,
  Typography,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import CloseIcon from "@material-ui/icons/Close";
import { grey } from "@material-ui/core/colors";
import { Button} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
    minWidth: "100%",
  },
  modal: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
}));

export default function ModalWrapperWithClose(props) {
  const {title,open,handleClose,handleSubmit,name,size} = props
  const classes = useStyles();
  return ( 
    <React.Fragment>
      <Modal
        open={open}
        onClose={handleClose}
        className={classes.modal}
  

      >
        <React.Fragment>
          <Paper>
            <Box className={classes.container}>
                <Box>   
                  <Grid container direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant={size?size:"h3"} >{title}</Typography>
                      <IconButton aria-label="close" onClick={handleClose}>
                        <CloseIcon  fontSize="small" />
                      </IconButton>
                </Grid>
                </Box> 
              {props.children}
      
            </Box>
          </Paper>
            
        </React.Fragment>
      </Modal>
    </React.Fragment>
  );
}
