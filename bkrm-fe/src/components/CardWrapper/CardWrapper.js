import React from 'react';

// material-ui
import { Typography,Card, Divider } from '@material-ui/core';
import {useTheme, makeStyles,createStyles} from "@material-ui/core/styles";


//= =============================|| SAMPLE PAGE ||==============================//
const useStyles = makeStyles((theme) =>
createStyles({
  root: {
    backgroundColor: theme.palette.background,
    borderRadius: theme.customization.borderRadius,
    borderColor:theme.palette.primary.light,
    margin:15
    
  },
  headerTitle:{
    padding: '20px',
    fontSize: '0.85rem'
  }
})
);
const CardWrapper = (props) => {
    const {title, children}=  props;
    const theme = useTheme();
    const classes = useStyles(theme);
    return ( 
      <Card className={classes.root}>
          <Typography className={classes.headerTitle} variant="h5">
                {title}
              </Typography>
            <Divider/>
            {children}
        
        </Card>
    )
        

};

export default CardWrapper;
