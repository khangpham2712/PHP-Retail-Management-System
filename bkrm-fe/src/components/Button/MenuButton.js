import {withStyles} from "@material-ui/core/styles";
import {Menu,MenuItem,} from '@material-ui/core';

export const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5',
    },
  })((props) => (
    <Menu
      
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      {...props}
    />
  ));
  
export  const StyledMenuItem = withStyles((theme) => ({
    root: {
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white,
        },
      },
    },
  }))(MenuItem);