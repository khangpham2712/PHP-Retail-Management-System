import React, { useState, useRef } from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import { Typography, Box, Card, Grid } from "@material-ui/core";
import store from "../../../assets/img/store.JPG";
import { grey } from "@material-ui/core/colors";
import EditBranch from "./EditBranch";
import { useReactToPrint } from "react-to-print";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) =>
  createStyles({
    card: {
      background: theme.customization.mode === "Light" ? null : grey[800],
      borderRadius: theme.customization.borderRadius,
      color: "#000000",
      padding: 10,
      boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
      "&:hover": {
        boxShadow: " 0px 10px 10px rgba(0,0,0,0.2)",
      },
    },
    title: {
      flexGrow: 1,
      textAlign: "center",
      fontSize: "15px",
      // fontSize: "12em",
      fontWeight: 700,
      marginTop: 10,
      color: "#000",
    },
    centerQR: {
      flexGrow: 1,
      textAlign: "center",
    },
    center: {
      flexGrow: 1,
      textAlign: "center",
      color: "#000",
      fontSize: "10px",
      // fontSize: "10em",
    },
  })
);

const BranchList = (props) => {
  const { branchList, setChosenBranch, getLocation, onReload } = props;
  const [isEditBranch, setIsEditBranch] = useState(false);
  const [branchToEdit, setBranchToEdit] = useState({
    name: "",
    address: "",
    ward: "",
    district: "",
    city: "",
    phone: "",
  });
  const theme = useTheme();
  const classes = useStyles(theme);
  const info = useSelector((state) => state.info);

  // print QR
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <Grid container spacing={2}>
      {isEditBranch && (
        <EditBranch
          branch={branchToEdit}
          onReload={onReload}
          open={isEditBranch}
          handleClose={() => setIsEditBranch(false)}
        />
      )}
      {branchList.map((branch) => {
        return (
          <Grid item xs={12} sm={6}>
            <Card className={classes.card} style={{ minHeight: 180 }}>
              {/* <CardContent style={{}}> */}
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box
                    component="img"
                    sx={{ height: "100%", width: "100%", borderRadius: 10 }}
                    src={branch.img_url ? branch.img_url : store}
                  />
                </Grid>
                <Grid item xs={8} style={{ minHeight: 140 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    style={{ color: grey[600], marginTop: 5 }}
                  >
                    {branch.name}
                  </Typography>
                  <Typography
                    gutterBottom
                    component="div"
                    style={{ fontSize: "1rem", fontWeight: 400, height: "60%" }}
                  >
                    {`${branch.address} ${branch.ward} ${branch.district} ${branch.province}`}
                  </Typography>
                  <Grid container direction="row" justifyContent="flex-end">
                    <Typography
                      onClick={() => {
                        //                         setChosenBranch({ lat: branch.lat, lng: branch.lng });
                        setChosenBranch({
                          lat: parseFloat(branch.lat),
                          lng: parseFloat(branch.lng),
                        });
                        window.scrollTo(0, 0);
                      }}
                      variant="h5"
                      style={{ cursor: "pointer", color: "#1b74e4" }}
                    >
                      Xem bản đồ
                    </Typography>
                    <Typography
                      onClick={() => {
                        getLocation(branch.lat, branch.lng);
                      }}
                      variant="h5"
                      style={{
                        cursor: "pointer",
                        color: "#1b74e4",
                        marginLeft: 10,
                      }}
                    >
                      Chỉ đường
                    </Typography>
                    {info.role === "owner" && (
                      <Typography
                        onClick={() => {
                          setBranchToEdit(branch);
                          setIsEditBranch(true);
                        }}
                        variant="h5"
                        style={{
                          cursor: "pointer",
                          color: "#1b74e4",
                          marginLeft: 10,
                        }}
                      >
                        Chỉnh sửa
                      </Typography>
                    )}

                    <Typography
                      onClick={() => {
                        handlePrint();
                      }}
                      variant="h5"
                      style={{
                        cursor: "pointer",
                        color: "#1b74e4",
                        marginLeft: 10,
                      }}
                    >
                      In mã QR điểm danh
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              {/* </CardContent> */}
            </Card>

            {/* print barcode */}
            <div style={{ display: "none" }}>
              <div ref={componentRef}>
                <ComponentToPrint
                  branchUuid={branch.uuid}
                  branchName={branch.name}
                />
              </div>
            </div>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default BranchList;


const ComponentToPrint = ({branchName, branchUuid}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  return (<div className={classes.centerQR} style={{marginBottom:5, marginTop: 20}}  >
      <div className={classes.title}><strong>{branchName}</strong></div>
      <div className={classes.title} style={{marginBottom:25, marginTop: 5}}><strong>QUÉT MÃ NÀY ĐỂ ĐIỂM DANH</strong></div>
      <div style={{width: '90%'}}><QRCode value={branchUuid}/></div>
    </div>
  );
};
