import React from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";

import GoogleMapReact from "google-map-react";
import icon from "../../../assets/img/icon/location.png";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
// import icon1 from "../../../assets/img/product/lyimg.jpeg";
import icon1 from "../../../assets/img/store.JPG";

import clsx from "clsx";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      borderRadius: 8,
      color: "#000000",
      boxShadow: "none",
      width: 220,
      height: 135,
      display: "block",
      marginTop: -160,
      zIndex: 90,
      position: "relative",
    },
    hidden: {
      display: "none",
    },
  })
);

export default function Map(props) {
  const { branchList, chosenBranch, getLocation } = props;
  return (
    <div style={{ height: "45vh", width: "100%", marginBottom: 30 }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyCYH6UyW3H3gskCw2JQjkmTnaeSZbw-h4E" }}
        // defaultCenter={{lat:branchList[0].lat,lng: branchList[0].lng}}
        center={chosenBranch}
        defaultZoom={11}
      >
        {branchList.map((branch) => {
          return (
            <Marker
              lat={branch.lat}
              lng={branch.lng}
              id={branch.id}
              branch={branch}
              getLocation={getLocation}
            />
          );
        })}
      </GoogleMapReact>
    </div>
  );
}
const Marker = (props) => {
  const { id, handleClickOpen, branch, getLocation } = props;
  const theme = useTheme();
  const classes = useStyles(theme);

  const [open, setOpen] = React.useState();

  const handleMouseOver = (e) => {
    setOpen(true);
  };
  const handleMouseExit = (e) => {
    setOpen(false);
  };

  return (
    <>
      <Box
        component="img"
        sx={{
          marginLeft: -7,
          marginTop: -50,
          height: 33,
          width: 33,
          zIndex: -1,
        }}
        src={icon}
        onClick={() => {
          console.log("Click");
        }}
        style={{ cursor: "pointer" }}
        // onClick={()=>handleClickOpen(id)}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseExit}
      />
      <Card
        className={clsx(open && classes.root, !open && classes.hidden)}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseExit}
      >
        <CardMedia component="img" height="60" image={icon1} />
        <CardContent
          style={{ marginLeft: -5, marginTop: -9, paddingBottom: -10 }}
        >
          <Typography gutterBottom variant="h5" component="div">
            {branch.name}
          </Typography>
          <p
            style={{
              fontSize: 12,
              marginTop: -3,
              color: grey[700],
              maxHeight: 13,
            }}
          >
            {" "}
            {branch.address}{" "}
          </p>
          <Typography
            onClick={() => {
              getLocation(branch.lat, branch.lng);
            }}
            variant="h6"
            style={{
              cursor: "pointer",
              flexGrow: 1,
              textAlign: "right",
              color: "#1b74e4",
              fontSize: 12,
            }}
          >
            Chỉ đường
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};
