import React from "react";
import { Modal, Box, Paper } from "@material-ui/core";
import useStyles from "./styles";
import { useSelector } from "react-redux";
export default function SimpleModal() {
  const isLoading = useSelector((state) => state.loading.isLoading);
  const classes = useStyles();
  return (
    <React.Fragment>
      <Modal
        open={isLoading}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <React.Fragment>
          <Paper>
            <Box className={classes.container}></Box>
          </Paper>
        </React.Fragment>
      </Modal>
    </React.Fragment>
  );
}
