/* eslint-disable no-use-before-define */

import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CheckboxesTags() {
  return (
    <div >
    <Autocomplete
      multiple
    //   size="small"
   
      id="checkboxes-tags-demo"
      options={role}
      disableCloseOnSelect
      getOptionLabel={(option) => option.title}
      renderOption={(option, { selected }) => (
        <React.Fragment>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            // style={{ marginRight: 80, }}
            checked={selected}

          />
          {option.title}
        </React.Fragment>
      )}
      style={{ width: 500 }}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" placeholder="Quyền"  style={{  width:'54%'}}/>
      )}
    />
    </div>
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const role = [
  { title: "Bán hàng", year: 1994 },
  { title: "Kho hàng", year: 1972 },
  { title: "Giao hàng", year: 1974 },
  { title: "HR", year: 1974 },
  { title: "Quản lý", year: 1974 },
];
