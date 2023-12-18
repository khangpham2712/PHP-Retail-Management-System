import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 240;

export default makeStyles((theme) => ({
  root: {
    display: "flex",
    background: theme.palette.background.default,
  },
  appBar: {
    background: theme.palette.background.paper,
    boxShadow: "none",

  },
  hide: {
    display: "none",
  },
  drawerPaper: {
    width: drawerWidth,
    // marginTop: 48 + 16 + 16,
    marginTop: 48 + 16 ,
    borderColor: theme.palette.background.paper,
    paddingLeft: 20,
    paddingBottom:48 + 16 + 16,
  },
  _drawerPaper: {
    width: drawerWidth,
    borderColor: theme.palette.background.paper,
    paddingLeft: 20,
  },
  drawerHeader: {
    display: "flex",
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: "100%",
  },

  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    marginLeft: drawerWidth,
  },

  background: {
    background:
      theme.customization.mode === "Light"
        ? theme.palette.primary.light
        : theme.customization.primaryColor[theme.customization.colorLevel],
    borderRadius: theme.customization.borderRadius,
    marginRight: 20,
    padding: 20,
    // marginTop:40,
    marginTop:25,
 
  },
  backgroundMini: {
    background:
      theme.customization.mode === "Light"
        ? theme.palette.primary.light
        : theme.customization.primaryColor[theme.customization.colorLevel],
    borderRadius: theme.customization.borderRadius,
    marginRight: 5,
    marginLeft:5,
    padding: 10,
    // marginTop:40,
    marginTop:25,
    
  },
  marginBackground:{
    marginLeft: 20
  },
  toolBar: {
    background: theme.palette.background.paper,
    // padding:12,
    padding:5,
  },
  searchEngine: {
    paddingLeft: 20,
  },
  scroll: {
    // maxHeight: 10,
  },
 
}));
