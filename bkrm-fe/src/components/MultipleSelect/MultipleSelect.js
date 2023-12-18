import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

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

//const names = ["Bán hàng", "Kho hàng", "Nhân viên", "Quản lý"];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelect(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    setPersonName(event.target.value);
    props.handleSelect(event.target.value);
  };

  return (
    <div>
      <FormControl
        className={classes.formControl}
        fullWidth
        size="small"
        variant="outlined"
        style={{ marginLeft: -2 }}
      >
        <InputLabel id="demo-mutiple-chip-label">Chức năng</InputLabel>
        <Select
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          multiple
          value={personName}
          defaultValues={props.selected ? props.selected : []}
          onChange={handleChange}
          input={<Input id="select-multiple-chip" />}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {selected.map((choice) => (
                <Chip
                  key={choice.id}
                  label={choice.description}
                  className={classes.chip}
                />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {props.choices.map((choice) => (
            <MenuItem
              key={choice.id}
              value={choice}
              // style={getStyles(choice.value, personName, theme)}
            >
              {choice.description}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
