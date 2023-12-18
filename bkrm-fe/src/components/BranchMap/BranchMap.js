import React, { useState, useEffect } from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

import Map from "./Map/Map";
import BranchList from "./BranchList/BranchList";
import { useSelector } from "react-redux";
import branchApi from "../../api/branchApi";

const useStyles = makeStyles((theme) =>
  createStyles({
    textTitle: {
      flexGrow: 1,
      textAlign: "center",
      marginBottom: 20,
    },
  })
);

const Branch = (props) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;

  const [branchList, setBranchList] = useState([]);

  useEffect(() => {
    const fetchBranchList = async () => {
      try {
        const response = await branchApi.getAllBranches(store_uuid);
        setBranchList(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBranchList();
  }, [store_uuid, props.reload]);

  //MAP
  const [currentLocation, setCurrentLocation] = React.useState(null);
  const handleSetLocation = (location) => {
    setCurrentLocation(
      `${location.coords.latitude},${location.coords.longitude}`
    );
  };
  function getLocation(lat, lng) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location) => {
        handleSetLocation(location);
        window.open(
          `https://www.google.com/maps/dir/${currentLocation}/${lat},${lng}`,
          "_blank"
        );
      });
    } else {
    }
  }

  //map
  const [chosenBranch, setChosenBranch] = React.useState({
    lat: 10.772717,
    lng: 106.62628,
  });

  return (
    <>
      <Typography className={classes.textTitle} variant="body2">
        ( {branchList.length} chi nhánh )
      </Typography>
      <Map
        branchList={branchList}
        chosenBranch={chosenBranch}
        getLocation={getLocation}
      />
      <BranchList
        branchList={branchList}
        setChosenBranch={setChosenBranch}
        getLocation={getLocation}
        onReload={props.onReload}
      />
    </>
  );
};

export default Branch;
