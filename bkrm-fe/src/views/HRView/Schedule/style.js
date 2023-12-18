import {useTheme, makeStyles,createStyles} from "@material-ui/core/styles";
import { grey} from '@material-ui/core/colors'
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import { amber, pink,green } from '@material-ui/core/colors';
export const useStyles = makeStyles((theme) =>
createStyles({
  root: {
    background: theme.customization.mode === "Light"? null: grey[800],
    borderRadius:theme.customization.borderRadius,
    color: '#000000',
    boxShadow: "none",
    padding:18,
  },
  headerTitle:{
    flexGrow: 1,
    textAlign: "center",
    marginTop:10,
  },
  textTitle:{
    flexGrow: 1,
    textAlign: "center",
    marginBottom:20
  },
  divider:{
      marginBottom:20
  },
  search: {
    borderRadius: theme.customization.borderRadius,
    height: 40,
    marginTop: 10,
    backgroundColor:
      theme.customization.mode === "Light" ? grey[50] : grey[700],
  },
  box: {
    backgroundColor:
      theme.customization.mode === "Light" ? grey[50] : grey[700],
  },
  addIcon:{
    background:theme.customization.secondaryColor[500],
    borderRadius:20,
    color:"#fff",
    
  },
  addShiftIcon:{
    background:grey[100],
    borderRadius:20,
    color:grey[700],
  },
  btnChoose:{
      background:theme.customization.primaryColor[500],
      color:'#fff',
      "&:hover": {
        background:theme.customization.primaryColor[500],
      },
  },
  center:{
    flexGrow: 1,textAlign: "center"
  },
  minWidthBox:{
      minWidth:70
  },


  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
  // whiteBg:{
  //   color: theme.customization.primaryColor[500],
  //   backgroundColor: '#fff',
   
  //   border: '0.1px solid lightgray',
  //   borderColor: theme.customization.primaryColor[500], 
  // }
  whiteBg:{
    backgroundColor: theme.customization.primaryColor[500],
    color: '#fff',
   
    border: '0.1px solid lightgray',
    borderColor: grey,
  },
  mode:{
    display: "flex", justifyContent: "flex-end", marginTop: 20,
  },
  boxName:{
   
    margin:5,
    height:44,
    borderRadius:10,
    
    padding:10,
    display:'flex',
    alignItems:'center',
  },
  boxNameDay:{
    // margin:5,
    // height:44,
    // borderRadius:10,
  },
  boxRed:{
    backgroundColor: pink[300],
    "&:hover": {
      backgroundColor: pink[400],
    },
  },
  boxGreen:{
    backgroundColor: green[300],
    "&:hover": {
      backgroundColor: green[400],
    },
  },
  boxYellow:{
    backgroundColor: amber[300],
    "&:hover": {
      backgroundColor: amber[400],
    },
  },
  nameText:{
    color:'#fff',
    fontSize:16,
    fontWeight:400,
    
  },
  

}));
