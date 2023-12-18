import React from 'react'
import {
    useTheme,
    withStyles,
    makeStyles,
    createStyles,
  } from "@material-ui/core/styles";
import {
    Typography,
    Grid,

    ListItem,
  } from "@material-ui/core";
  import { SketchPicker } from "react-color";
  import { grey } from "@material-ui/core/colors";

  const useStyles = makeStyles((theme) =>
  createStyles({

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
     
  
  })
);


const ColorPicker = ({title, mainColor,handleChangeMainColor ,displayColorPicker,setDisplayColorPicker}) => {
    const theme = useTheme();
    const classes = useStyles(theme);
  return (
    <ListItem style={{ padding: 0, margin: 0, marginBottom: 10 }}>
    <Typography style={{ fontWeight: 500, marginRight: 10 }}>
      {title}:{" "}
    </Typography>
    <div>
      <Grid
        container
        onClick={() => setDisplayColorPicker(!displayColorPicker)}
      >
        <Grid item className={classes.swatch}>
          <div
            style={{
              width: 18,
              height: 18,
              background: `rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, ${mainColor.a})`,
            }}
          />
        </Grid>
        <Grid item className={classes.swatch} style={{ width: 70 }}>
          {mainColor.hex}
        </Grid>
        <Grid item className={classes.swatch}>
          {mainColor.a * 100} %
        </Grid>
      </Grid>
      {displayColorPicker ? (
        <div className={classes.popover}>
          <div
            className={classes.cover}
            onClick={() => setDisplayColorPicker(false)}
          />
          <SketchPicker
            color={{
              r: mainColor.r,
              g: mainColor.g,
              b: mainColor.b,
              a: mainColor.a,
            }}
            onChange={handleChangeMainColor}
          />
        </div>
      ) : null}
    </div>
  </ListItem>
  )
}

export default ColorPicker