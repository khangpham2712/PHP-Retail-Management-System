import React from "react";
import { Fab, IconButton, Tooltip, ButtonBase, Badge } from "@material-ui/core";
import { makeStyles, createStyles, styled } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/styles";
import { IconSettings } from "@tabler/icons";
import ShoppingCartTwoToneIcon from "@material-ui/icons/ShoppingCartTwoTone";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) =>
  createStyles({
    btn: {
      position: "fixed",
      top: 200,
      right: 0,
      zIndex: 1050,
      boxShadow: "0px 12px 14px 0px #ffe57f4d",
      backgroundColor: "#ffe57f",
      borderRadius: "10px 0px 0px 10px",
      "&:hover": {
        backgroundColor: "#ffcf10",
      },
      height: 60,
      width: 60,
    },

    btnBottom: {
      position: "fixed",
      top: 100,
      right: 0,
      zIndex: 1050,
      boxShadow: "0px 12px 14px 0px #ffe57f4d",
      backgroundColor: "#ffe57f",
      borderRadius: "10px 0px 0px 10px",
      "&:hover": {
        backgroundColor: "#ffcf10",
      },
      height: 60,
      width: 60,
    },
  })
);
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    border: `3px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));
const CartButton = (props) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const {number} = props
  return (
    // <Tooltip title="Giỏ hàng">
    <Fab
      aria-label="add"
      className={classes.btn}
      component={Link}
      to={`/store/${props.storeInfo?.web_page}/cart`}
    >
      <ButtonBase size="large" style={{ margin: 10 }}>
        <StyledBadge color="error" badgeContent={number}>
          <ShoppingCartTwoToneIcon />
        </StyledBadge>
      </ButtonBase>
    </Fab>
    /* </Tooltip> */
  );
};

export const CartBottom = ({numberItem}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  return (
    // <Tooltip title="Giỏ hàng">
    <Fab
      className={classes.btnBottom} 
      onClick={()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:"smooth"})}
    >
      <ButtonBase size="large" style={{ margin: 10 }} >
        <StyledBadge color="error" badgeContent={numberItem}>
          <ShoppingCartTwoToneIcon />
        </StyledBadge>
      </ButtonBase>
    </Fab>
    /* </Tooltip> */
  );
};

export default CartButton;
