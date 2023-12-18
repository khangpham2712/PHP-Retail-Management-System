import React from "react";
import { Fab, IconButton, Tooltip, Box,ButtonBase, Badge } from "@material-ui/core";
import { makeStyles, createStyles, styled } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/styles";
import { IconSettings } from "@tabler/icons";
import ShoppingCartTwoToneIcon from "@material-ui/icons/ShoppingCartTwoTone";
import { Link } from "react-router-dom";
import insIcon from "../../assets/img/icon/instagram.png"
import fbIcon from "../../assets/img/icon/fb.png"

const size = 40
const useStyles = makeStyles((theme) =>
  createStyles({
    btn: {
      position: "fixed",
      top: 300,
      left: -2,
      zIndex: 1050,
    //   boxShadow: "0px 12px 14px 0px #ffe57f4d",
      backgroundColor: "#ffe57f",
      borderRadius: "0px 10px 10px 0px",
      "&:hover": {
        backgroundColor: "#ffcf10",
      },
      height: size,
      width: size,
    },

   
  })
);
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    border: `3px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));
const SocialMediaButton = (props) => {
  const theme = useTheme();
  const classes = useStyles(theme);
 
  return (
    <>
    <Fab className={classes.btn} component={Link} to={`/store/${props.storeInfo?.web_page}/cart`} >
        <Box component="img" sx={{ height: size, width: size, marginLeft: 7,marginRight: 7, borderRadius: 2,}}
             src={insIcon} />
    </Fab>
    <Fab className={classes.btn} style={{marginTop:size+2}}component={Link} to={`/store/${props.storeInfo?.web_page}/cart`} >
        <Box component="img" sx={{ height: size, width: size, marginLeft: 7,marginRight: 7, borderRadius: 2,}}
             src={fbIcon} />
    </Fab>
    </>
  );
};
export default SocialMediaButton