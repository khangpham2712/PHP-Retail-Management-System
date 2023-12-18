import React from 'react'
import {useTheme, makeStyles,withStyles,createStyles,lighten} from "@material-ui/core/styles";
import {Typography,Divider,Card,Grid,Avatar,Paper,Box,Button,InputLabel,MenuItem,FormControl,Select,ListItem,ListItemIcon,ListItemText} from '@material-ui/core';
import { grey, blue,purple} from '@material-ui/core/colors'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ava from '../../assets/img/product/lyimg.jpeg';

const GeneralStatistics = (props) => {
    const {title, ToolBar,typeTitle,limitTitle} = props;
    const theme = useTheme();
    const classes = useStyles(theme);

  return (
    <Card className={classes.hoverCard} style={{padding:25, marginBottom:20}}>
        <Grid container direction="row"justifyContent="space-between" alignItems="center"  style={{marginBottom:30}}>
            <Grid item >
                {title? <Typography style={{color:theme.customization.mode === "Light"  ? '#000' :"#757575",  fontSize:22}} variant="h5">{title} </Typography> :
                <ListItem style={{margin:0, padding:0}}> 
                  <Typography style={{color:theme.customization.mode === "Light"  ? '#000' :"#757575",  fontSize:22, marginRight:5}} variant="h5">{ limitTitle} {typeTitle.includes('bán chạy') ?` sản phẩm` :null} </Typography> 
                  <Typography style={{color:theme.customization.primaryColor[500], fontSize:22,marginRight:5}} variant="h5">{typeTitle} </Typography> 
                  <Typography style={{color:theme.customization.mode === "Light"  ? '#000' :"#757575",  fontSize:22}} variant="h5">{typeTitle.includes('số') ? "nhiều nhất" : typeTitle.includes('bán chạy')  ?'nhất':"cao nhất"}</Typography> 
                </ListItem>}
            </Grid>
            <Grid item  >
                {ToolBar}
            </Grid>
        </Grid>
        {props.children}
    </Card>

  )
}

export default GeneralStatistics




const useStyles = makeStyles((theme) =>
createStyles({
  root: {
    background: theme.customization.mode === "Light"? '#fafbfb': grey[800],
    borderRadius:theme.customization.borderRadius,
    color: '#000000',
    color: '#fafbfb',
    boxShadow: "none",
    padding:20,
    // paddingRight:10,
    // paddingLeft:20,
    margin:-20
  },
  header:{
    paddingTop:20,
    paddingBottom:15
  },
  headerTitle:{
    fontSize: '1.125rem',
  },
  divider:{
      marginBottom:15
  },
  hoverCard:{
    boxShadow:' 0px 10px 20px rgba(0,0,0,0.09)',
    "&:hover": {
      boxShadow:'0px 10px 20px rgba(0,0,0,0.15)',
    },
    // textAlign: 'center',
    color: theme.palette.text.secondary,
    paddingTop:10,
    borderRadius:theme.customization.borderRadius
},
large: {
    width: theme.spacing(2),
    height: theme.spacing(2),
  },
}));