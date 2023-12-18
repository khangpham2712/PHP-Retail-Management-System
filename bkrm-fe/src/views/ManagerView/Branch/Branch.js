import React, { useState } from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import { Typography, Card, Grid, ButtonBase, Tooltip } from "@material-ui/core";
import SnackBar from "../../../components/SnackBar/SnackBar";
import BranchMap from "../../../components/BranchMap/BranchMap";

import AddIcon from "@material-ui/icons/Add";
import AddBranch from "./AddBranch/AddBranch";
import { grey } from "@material-ui/core/colors";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      background: theme.customization.mode === "Light" ? null : grey[800],
      borderRadius: theme.customization.borderRadius,
      color: "#000000",
      padding: 18,
    },
    headerTitle: {
      flexGrow: 1,
      textAlign: "center",
      marginTop: 10,
      marginLeft: 40,
    },
    addIcon: {
      background: theme.customization.secondaryColor[500],
      borderRadius: 20,
      color: "#fff",
    },
    addBtn: {
      marginRight: 10,
      marginTop: 5,
    },
  })
);

const Branch = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const info = useSelector((state) => state.info);

  const [reload, setReload] = useState(false);

  const onReload = () => setReload(!reload);

  //// 1. Add pop up + noti
  //add
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card className={classes.root}>
      <Grid container direction="row" alignItems="center">
        <Typography className={classes.headerTitle} variant="h2">
          Chi nhánh
        </Typography>
        {info.role === "owner" && (
          <ButtonBase className={classes.addBtn} onClick={handleClickOpen}>
            <Tooltip title="Thêm chi nhánh">
              <AddIcon size="small" className={classes.addIcon} />
            </Tooltip>
          </ButtonBase>
        )}

        {open && (
          <AddBranch
            onReload={onReload}
            open={open}
            handleClose={handleClose}
          />
        )}
      </Grid>
      <BranchMap reload={reload} onReload={onReload} />
    </Card>
  );
};

export default Branch;


