import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import branchApi from "../../../api/branchApi";
import { infoActions } from "../../../store/slice/infoSlice";
import { useDispatch, useSelector } from "react-redux";
export default function BranchSelectAppBar({ store_uuid, smallScreen }) {
  const dispatch = useDispatch();

  const branches = useSelector((state) => state.info.branches);
  const selectedBranch = useSelector((state) => state.info.branch);

  const handleChange = (event) => {
    const branch = branches.find(
      (branch) => branch.uuid === event.target.value
    );
    dispatch(
      infoActions.setBranch({
        uuid: branch.uuid,
        name: branch.name,
        id: branch.id,
      })
    );
  };

  const loadingData = async () => {
    try {
      let response = await branchApi.getBranches(store_uuid);
      dispatch(infoActions.setBranches(response.data));
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    if (store_uuid) {
      loadingData();
    }
  }, [store_uuid]);

  return (
    <FormControl
      variant="standard"
      sx={!smallScreen ? { m: 1, minWidth: 120 } : { m: 1, width: 120 }}
    >
      <InputLabel>Chi nhánh</InputLabel>
      <Select
        value={selectedBranch.uuid}
        label="Chi nhánh"
        onChange={handleChange}
      >
        {branches.map((branch) => {
          return <MenuItem value={branch.uuid}>{branch.name}</MenuItem>;
        })}
      </Select>
    </FormControl>
  );
}
