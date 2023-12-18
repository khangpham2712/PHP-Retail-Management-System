import React from 'react'

import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Input,
    Chip,
    Checkbox,
    ListItemText
  } from "@material-ui/core";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const MultipleSelect = ({chonsenValue,handleAction, label,options,handleDeleteChip}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
    return (
        <FormControl className={classes.formControl}>
            <InputLabel>{label}</InputLabel>
            <Select
            multiple
            value={chonsenValue}
            onChange={handleAction}
            input={<Input id="select-multiple-chip" />}
            renderValue={(selected) => (
                <div className={classes.chips}>
                {selected.map((value) => (
                    <Chip key={value} label={value}  className={classes.chip}  size="small" 
                    deleteIcon={
                      <CancelIcon
                        onMouseDown={(event) => event.stopPropagation()}
                      />
                    }
                    clickable
                     onDelete={ handleDeleteChip(value)}/>
                ))}
                </div>
            )}
            MenuProps={MenuProps}
            >
             {options.map((name) => (
            <MenuItem key={name} value={name} style={{height:40}}>
              <Checkbox checked={chonsenValue.indexOf(name) > -1} style={{marginLeft:-10}}/>
              <ListItemText primary={name} />
            </MenuItem>
          ))}
            </Select>
        </FormControl>
    )
}

export default MultipleSelect

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
