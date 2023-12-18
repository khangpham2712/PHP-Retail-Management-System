import {useTheme, makeStyles,styled,withStyles,createStyles,lighten} from "@material-ui/core/styles";
import {Typography,Divider,Grid,Paper,Box,Button,ButtonGroup,ListItem,ListItemIcon,ListItemText} from '@material-ui/core';

export const ColorButtonPink = withStyles((theme) => ({
    root: {
    //  color: theme.palette.getContrastText("#ff007d"),
    color:'#000',
      backgroundColor: "#ff007d",
      textTransform: 'none',
      '&:hover': {
        backgroundColor: lighten("#ff007d", 0.3),
      },
      borderRadius:15
    },
  }))(Button);
  export  const ColorButtonYellow = withStyles((theme) => ({
    root: {
     color: theme.palette.getContrastText("#ffc02b"),
      backgroundColor: "#ffc02b",
      textTransform: 'none',
      '&:hover': {
        backgroundColor: lighten("#ffc02b", 0.3),
      },
      borderRadius:15
    },
  }))(Button);

  export const ColorButton = styled(Button)(({ theme, mainColor,navColor }) => ({
    color: "#ffffff",
    backgroundColor: navColor? lighten(mainColor, 0.2):mainColor ,
    width: 100,
    "&:hover": {
      backgroundColor: navColor?lighten(mainColor, 0.1) :lighten(mainColor, 0.3),
      
    },
  }));
  export const ColorOutlineButton = styled(Button)(({ theme ,mainColor,navColor}) => ({
    color: mainColor,
    borderColor: mainColor,
    boxShadow:navColor?'0px 2px 2px rgba(0,0,0,0.2)':null,
    backgroundColor: navColor?lighten(mainColor, 0.8):theme.palette.background.paper,
    "&:hover": {
      backgroundColor:navColor?lighten(mainColor, 0.6) :lighten(mainColor, 0.8),
    },
  }));

  export const ColorOutlineButtonCart = styled(Button)(({ theme ,mainColor}) => ({
    color: mainColor,
    borderColor: mainColor,
    backgroundColor:lighten(mainColor, 0.8),
    "&:hover": {
      backgroundColor:lighten(mainColor, 0.6),
    },
    textTransform: "none",
    marginTop:20
  }));



  export const CustomButton = styled(Button)(({ theme, mainColor, textColor='#fff' }) => ({
    // color: theme.palette.getContrastText(mainColor),
    color: textColor,
    backgroundColor: mainColor ,
    // width: 100,
    borderWidth:1, borderColor:'#b6b6b6',
    fontWeight:700,
    height:40,
    borderRadius:5,
    "&:hover": {
      backgroundColor:lighten(mainColor, 0.3),
      
    },
  }));
