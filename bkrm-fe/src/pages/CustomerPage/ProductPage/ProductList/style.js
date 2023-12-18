import { useTheme, makeStyles, styled ,lighten,darken} from "@material-ui/core/styles";
import { grey} from '@material-ui/core/colors'

export const useStyles = makeStyles((theme,) => ({
    container:{
        display: 'flex',
        flexWrap: 'wrap',
    },
    grid:{
        display: 'flex',
        flexWrap: 'wrap',
    },
    item:{  
        marginBottom:20,
    },
    colorCard:{
        background: theme.customization.mode === "Light"? null: grey[800],
    },
    multiLineEllipsis: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        "-webkit-line-clamp": 2,
        "-webkit-box-orient": "vertical",
        // height:37, 
        // marginBottom:12,
    },
    oneLineEllipsis: {    
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        "-webkit-line-clamp": 1,
        "-webkit-box-orient": "vertical",
        // marginBottom:8,
       
    },
    name:{
         
    },
    hoverCard:{
        boxShadow:'0px 10px 20px rgba(0,0,0,0.1)',
        "&:hover": {
          boxShadow:'0px 10px 20px rgba(0,0,0,0.15)',
        }
    },
    alignCenter:{
        flexGrow: 1,textAlign: "center"
    }
}));
