import React from 'react'
import {useTheme} from "@material-ui/core/styles";
import {MenuItem,FormControl,Select,InputLabel} from '@material-ui/core';

const TypeReportSelect = ({handleChangeType,type, label,title,limitTitle}) => {
  return (
    <FormControl
      style={{ marginTop: -5, minWidth: 150 }}
      size="small"
      variant="outlined"
    >
      {label ? (
        <InputLabel id="demo-select-small">Sắp xếp theo</InputLabel>
      ) : (
        <InputLabel id="demo-select-small">Theo</InputLabel>
      )}
      <Select
        size="small"
        defaultValue="7day"
        onChange={handleChangeType}
        value={type}
        label={label ? "Sắp xếp theo" : "Theo"}
      >
        <MenuItem value="best-seller">
          {title[0] === "Bán chạy" ? title[0] : `Theo ${title[0]}`}
        </MenuItem>
        <MenuItem value="revenue">Theo {title[1]}</MenuItem>
        {title[2] ? <MenuItem value="profit">Theo {title[2]}</MenuItem> : null}
      </Select>
    </FormControl>
  );
}

export default TypeReportSelect