import React, { useEffect, useState } from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { statusAction } from "../../store/slice/statusSlice";
import { useDispatch, useSelector } from "react-redux";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const SnackBar = () => {
  const isOpen = useSelector((state) => state.status.open);
  const isSuccess = useSelector((state) => state.status.status);
  const message = useSelector((state) => state.status.message);
  const dispatch = useDispatch();
  useEffect(() => {
    const closeStatus = () => {
      dispatch(statusAction.closeStatus());
    };
    if (isOpen) {
      setTimeout(closeStatus, 1000);
    }
  }, [isOpen, dispatch]);
  return (
    <React.Fragment>
      {isSuccess == 1 ? (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={isOpen}
        >
          <Alert severity="success">{message}</Alert>
        </Snackbar>
      ) : isSuccess == 0 ? (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={isOpen}
        >
          <Alert severity="error">{message}</Alert>
        </Snackbar>
      ) : null}
    </React.Fragment>
  );
};

export default SnackBar;
