import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import {
  useTheme,
  withStyles,
  makeStyles,
  createStyles,
} from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { grey } from "@material-ui/core/colors";
import AddIcon from "@material-ui/icons/Add";

import supplierApi from "../../api/supplierApi";
import { useSelector } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { render } from "sass";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import PersonIcon from "@material-ui/icons/Person";
import { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { removeAccents } from "../../utils";

const useStyles = makeStyles((theme) =>
  createStyles({
    input: {
      borderRadius: "20px",
    },
    multilineColor: {
      color: theme.customization.primaryColor[500],
      marginRight: -20,
    },
  })
);

const SearchBranch = ({
  selectedBranch,
  branches,
  handleClickOpen,
  handleSelectBranch,
  currentBranch,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const renderOption = (option) => {
    return (
      <Grid fullWidth container direction="row" justifyContent="space-between">
        <Typography variant="h5">{option.name}</Typography>
        <Typography variant="body1">{option.phone}</Typography>
      </Grid>
    );
  };

  const renderInput = (params) => (
    <TextField
      {...params}
      fullWidth
      placeholder="Chọn chi nhánh"
      margin="normal"
      InputProps={
        // props.selectedBranch?.name?.length === 0
        !selectedBranch
          ? {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: grey[500] }} />
                </InputAdornment>
              ),
              endAdornment: (
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={handleClickOpen}
                  style={{ marginRight: -30 }}
                >
                  <AddIcon />
                </IconButton>
              ),
            }
          : {
              ...params.InputProps,
              classes: { input: classes.multilineColor },
              startAdornment: (
                <InputAdornment position="start">
                  {/* <SearchIcon style={{ color: grey[500] }} /> */}
                  <PersonIcon
                    style={{ color: theme.customization.primaryColor[500] }}
                  />
                </InputAdornment>
              ),
            }
      }
    />
  );

  return (
    <div style={{ width: "100%" }}>
      <Autocomplete
        freeSolo
        value={selectedBranch}
        options={branches.filter((branch) => branch.id !== currentBranch?.id)}
        onChange={(event, value) => {
          if (value) {
            handleSelectBranch(value);
          }
        }}
        renderInput={renderInput}
        renderOption={renderOption}
        getOptionLabel={(option) => option.name}
      />
    </div>
  );
};

export default SearchBranch;
