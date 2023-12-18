import { useTheme,withStyles, makeStyles, createStyles } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";

export const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      background: theme.customization.mode === "Light" ? null : grey[800],
      borderRadius: theme.customization.borderRadius,
      color: "#000000",
      padding: 18,
    },
    headerTitle: {
      flexGrow: 1,
      textAlign: "center",
      marginTop: 10,
      marginLeft: 40,
      marginBottom:15
    },
     color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
      color: {
        width: '17px',
        height: '17px',
        borderRadius: '2px',
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
      expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
        }),
      },
      expandOpen: {
        transform: 'rotate(180deg)',
      },
      attrHead:{
        backgroundColor:"#E4E4E4", height:40, color:"#000"
      },
      attrCard:{
        marginBottom:15
      }
  
  })
);
