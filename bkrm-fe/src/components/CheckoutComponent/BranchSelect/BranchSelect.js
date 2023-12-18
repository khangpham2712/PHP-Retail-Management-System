import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import branchApi from '../../../api/branchApi';
import { useSelector } from 'react-redux';

export default function BranchSelect(props) {
  const {selectedBranch, setSelectedBranch} = props;
  const [branches, setBranches] = React.useState([])

  // redux
  const info = useSelector(state => state.info)
  const store_uuid = info.store.uuid
  const current_branch_uuid = info.branch.uuid

  const handleChange = (event) => {
    setSelectedBranch(event.target.value);
  };

  const loadingData = async () => {
    try {

      let response = await branchApi.getBranches(store_uuid);
      setBranches(response.data);
      setSelectedBranch(response.data.filter(branch => branch.uuid === current_branch_uuid)[0]);
    } catch (err) {
      console.log(err)
    }
  }
  React.useEffect(() => {
    if (store_uuid) {
      loadingData()
    }
  }, [])
  const renderMenuItem = () => {
    return branches.map(branch => {
      return (<MenuItem value={branch}>{branch.name}</MenuItem>)
    });
  }
  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} fullWidth>
      <InputLabel>Chi nhánh</InputLabel>
      <Select
        value={selectedBranch}
        label="Chi nhánh"
        onChange={handleChange}
      >
        {renderMenuItem()}
      </Select>
    </FormControl>
  );
}