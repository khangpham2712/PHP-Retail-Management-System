import React from 'react'
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Input,
    Chip,
    Typography
  } from "@material-ui/core";
  import {useTheme, makeStyles,withStyles,createStyles,lighten} from "@material-ui/core/styles";

  import {useDispatch, useSelector} from 'react-redux';

  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

const BranchSelect = ({selectedBranches,setSelectedBranches, isMultiple, haveAllOption}) => {
  const theme = useTheme();
    // const classes = useStyles(theme);

 const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branches = info.store.branches
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

  return (
    <Box style={{marginLeft:10}}>
    <FormControl  variant="outlined" size="small" sx={{ m: 1 }} fullWidth>
      <Select multiple={isMultiple?isMultiple:false}   value={selectedBranches} onChange={(e)=>setSelectedBranches(e.target.value)}  MenuProps={MenuProps}
        renderValue={(selected) =>{ 
          if(!isMultiple) {if(selected === 'all'){return "Tất cả chi nhánh"}else{return selected.name}}
          else{
            if(selected.length === branches.length) {return "Tất cả chi nhánh"} return  selected.map(((item, index) =>  index === 0 ? item.name : " , "+ item.name))

          }
        }}
      >
        {haveAllOption? 
          <MenuItem  key={"all"}value={"all"} style={getStyles(branches, "all", theme)}>Tất cả chi nhánh</MenuItem>:null
        }
        {branches?.map(branch => {
            return (<MenuItem  key={branch.id}value={branch} style={getStyles(branches, branch.name, theme)}>{branch.name}</MenuItem>)
        })}
      

    </Select>
  </FormControl>
  </Box>
  )
}

export default BranchSelect