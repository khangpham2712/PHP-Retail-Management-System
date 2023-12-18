import React from 'react'
import {useTheme} from "@material-ui/core/styles";
import {MenuItem,FormControl,Select} from '@material-ui/core';

const TopSelect = ({handleChangeLimit, limit,name}) => {
  console.log("name",name)
  console.log("limit",limit)
  return (
    <FormControl  style={{marginTop:-5,marginRight:10}} size="small" variant="outlined" >
        <Select size="small" onChange={handleChangeLimit}  defaultValue="7day" value={limit} name={name}>
        <MenuItem value={10}>Top 10</MenuItem>
        <MenuItem value={20}>Top 20</MenuItem>
        <MenuItem value={50}>Top 50</MenuItem>
        <MenuItem value={100}>Top 100</MenuItem>
        </Select>
    </FormControl>
  )
}

export default TopSelect