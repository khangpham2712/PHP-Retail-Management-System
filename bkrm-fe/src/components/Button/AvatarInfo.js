import React from 'react'
import { useTheme, createStyles } from "@material-ui/core/styles";

import { makeStyles,withStyles } from "@material-ui/core";
import {Chip,ButtonBase,Avatar} from "@material-ui/core";
import icon from '../../assets/img/product/lyimg.jpeg'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DoneIcon from '@material-ui/icons/Done';

const StyleChip = withStyles((theme) => ({
  root: {
    'color': theme.customization.primaryColor[500],
    'fontWeight':500,
    'backgroundColor': `${theme.customization.primaryColor[50]} !important`,
    '&:hover': {
      'backgroundColor': `${theme.customization.primaryColor[400]} !important`,
      'color': '#fff',
  },
},
  outlined: {
      border: `1px solid ${theme.customization.primaryColor[300]}`,
 
  },
  deleteIcon: {
    color:  theme.customization.primaryColor[200] ,
    marginLeft:-11,

  },
//   '&:active': {
//     boxShadow: 'none',
//     backgroundColor: props.color,
//     borderColor: props.color,
// },
}))(Chip);

function CustomChip(props) {
  const { size = 1, ...restProps } = props;
  const classes = useStyles({ size });

  return (
    <StyleChip
      variant="outlined"
      className={classes.root}
      classes={{ avatar: classes.avatar, deleteIcon: classes.deleteIcon }}
      {...restProps}
    />
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: (props) => `${props.size * 0.8125}rem`,
    height: (props) => `${props.size * 32}px`,
    borderRadius: "9999px",
  },
  avatar: {
    "&&": {
      height: (props) => `${props.size * 24}px`,
      width: (props) => `${props.size * 24}px`,
      fontSize: (props) => `${props.size * 0.75}rem`
    }
  },
  text:{
    textTransform:'none'
  },
  
  
}));


const AvatarInfo = (props) => {
    const {name} = props;
    const theme = useTheme();
    const classes = useStyles(theme);

    const firstName = name.split(' ').at(-1)
    const len = firstName.length
    return (
   
            <ButtonBase  className={classes.text}>
              <CustomChip
                size={1.25}
                avatar={<Avatar  src={icon} />}
                label={firstName}
                style={{paddingRight: len < 4 ? 10:0}}
                // onDelete={(event)=>{event.preventDefault()}}
                // deleteIcon={<ExpandMoreIcon fontSize="small" sx={{ color: '#000' }} />}
                />
             </ButtonBase> 
    
    )
}

export default AvatarInfo
