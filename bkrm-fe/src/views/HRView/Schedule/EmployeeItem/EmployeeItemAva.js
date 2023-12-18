import React from "react";
import {
  useTheme,
  makeStyles,
  createStyles,
  withStyles,
} from "@material-ui/core/styles";
import {
  Badge,
  Avatar,
  Tooltip,
} from "@material-ui/core";

import ava1 from "../../../../assets/img/ava/ava1.png";
import ava2 from "../../../../assets/img/ava/ava2.png";
import ava3 from "../../../../assets/img/ava/ava3.png";
import ava4 from "../../../../assets/img/ava/ava4.png";
import ava5 from "../../../../assets/img/ava/ava5.png";
import ava6 from "../../../../assets/img/ava/ava6.png";
import ava7 from "../../../../assets/img/ava/ava7.png";
import ava8 from "../../../../assets/img/ava/ava8.png";
import ava9 from "../../../../assets/img/ava/ava9.png";
import ava10 from "../../../../assets/img/ava/ava10.png";

const listImg = [ava1, ava2, ava3, ava4, ava5, ava6, ava7, ava8, ava9, ava10];
function returnImage() {
  return listImg[Math.floor(Math.random() * 11)];
}
const StyledBadgeGreen = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);
const StyledBadgeRed = withStyles((theme) => ({
  badge: {
    backgroundColor: "#eb0202",
    color: "#eb0202",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const StyledBadgeYellow = withStyles((theme) => ({
  badge: {
    backgroundColor: "#ffae00",
    color: "#ffae00",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

export const Dot = (props) => {
  const { status } = props;
  if (status === -1) {
    return (
      <StyledBadgeRed
        overlap="circular"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        variant="dot"
      >
        {props.children}
      </StyledBadgeRed>
    );
  } else if (status === 0) {
    return (
      <StyledBadgeYellow
        overlap="circular"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        variant="dot"
      >
        {props.children}
      </StyledBadgeYellow>
    );
  } else {
    return (
      <StyledBadgeGreen
        overlap="circular"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        variant="dot"
      >
        {props.children}
      </StyledBadgeGreen>
    );
  }
};

export const EmployeeItemAva = ({ src, status, name }) => {
  return (
    <Tooltip title={name} arrow>
      <Dot status={status}>
        <Avatar style={{ margin: 5 }} alt="Remy Sharp" src={src} />
      </Dot>
    </Tooltip>
  );
};

export default EmployeeItemAva;
