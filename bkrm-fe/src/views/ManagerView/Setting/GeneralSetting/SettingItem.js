import React, { useState } from "react";
import { useTheme, withStyles,makeStyles, createStyles } from "@material-ui/core/styles";
import { Typography,Button,Divider, List,Card,ListItem,ListSubheader,TextField,ListItemSecondaryAction,Switch,ListItemIcon, ListItemAvatar,Avatar,ListItemText,Grid, ButtonBase, Tooltip } from "@material-ui/core"; 
import useMediaQuery from "@material-ui/core/useMediaQuery";

const SettingItem = (props) => {
    const {statusChecked,actionToggle, title, subTitle, name,detail,setOpen} = props
    const theme = useTheme();
    // const classes = useStyles(theme);
    const xsScreen = useMediaQuery(theme.breakpoints.down("xs")) ;
  
    const handlePopup = (name) => {
        setOpen((prevState) => {
          return {
            ...prevState,
            [name]: true ,
          };
        });
    };
    return (
      <>
      <ListItem style={{margin:xsScreen?0:null, padding:xsScreen?0:null}}>
          <ListItemIcon >
              {props.children}
          </ListItemIcon>
          <ListItemText
          primary={<Typography style={{ fontSize:16,fontWeight:500 }}>{title}</Typography>} 
          secondary={<Typography style={{ fontSize:13 , color:'#9f9f9f', marginTop:2}}>{subTitle}</Typography>} />
          {detail && statusChecked ?
          <Button variant="outlined"   size="small"style={{marginRight:50, textTransform:'none', fontWeight:700}} color="primary" 
            onClick={()=>handlePopup(name)} > 
            Chi tiết 
          </Button>:null} 
          <ListItemSecondaryAction >
              <IOSSwitch
                  edge="end"
                  name={name}
                  onChange={actionToggle}
                  checked={statusChecked}
              />
          </ListItemSecondaryAction>
      </ListItem>
      <Divider />
      </>
    )
  }
  export default SettingItem
  const IOSSwitch = withStyles((theme) => ({
      root: {
        width: 42,
        height: 26,
        padding: 0,
        margin: theme.spacing(1),
      },
      switchBase: {
        padding: 1,
        '&$checked': {
          transform: 'translateX(16px)',
          color: theme.palette.common.white,
          '& + $track': {
          //   backgroundColor: '#52d869',
              backgroundColor: theme.customization.secondaryColor[500],
            opacity: 1,
            border: 'none',
          },
        },
        '&$focusVisible $thumb': {
          // color: '#52d869',
          color:  theme.customization.secondaryColor[500],
          border: '6px solid #fff',
        },
      },
      thumb: {
        width: 24,
        height: 24,
      },
      track: {
        borderRadius: 26 / 2,
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
      },
      checked: {},
      focusVisible: {},
    }))(({ classes, ...props }) => {
      return (
        <Switch
          focusVisibleClassName={classes.focusVisible}
          disableRipple
          classes={{
            root: classes.root,
            switchBase: classes.switchBase,
            thumb: classes.thumb,
            track: classes.track,
            checked: classes.checked,
          }}
          {...props}
        />
      );
    });
  
  