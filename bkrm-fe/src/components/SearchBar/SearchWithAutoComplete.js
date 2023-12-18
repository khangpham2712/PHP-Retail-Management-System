/* eslint-disable no-use-before-define */
import React, { useRef, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Box, Button, Grid, InputAdornment, Typography } from "@material-ui/core";
import productApi from "../../api/productApi";
import { useEffect } from "react";
import SearchIcon from "@material-ui/icons/Search";
export default function SearchWithAutoComplete(props) {
  const {
    searchApiCall,
    onSelect,
    renderInput,
    renderOption,
    getOptionLabel,
    value,
    nextRef,
    handleDefaultSelect
  } = props;
  const [options, setOptions] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const loadingData = async (e, searchKey) => {
    setSearchValue(searchKey);
  };


  useEffect(() => {
    const fetchData = async (searchKey = searchValue) => {
      if (searchKey !== "") {
        try {
          const key = searchKey.slice(0, searchKey.indexOf("("))
          const response = await searchApiCall(key);
          setOptions(response.data);
          onSelect(response.data[0])
        } catch (error) {
          console.log(error)
        }
      }
    };
    const timer = setTimeout(() => fetchData(), 500);
    return () => clearTimeout(timer);
  }, [searchValue]);
  return (
    <Autocomplete
      options={options}
      freeSolo
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      onInputChange={loadingData}
      autoSelect
      getOptionSelected={(option, value) => option.bar_code === value.bar_code}
      onChange={(e, value) => onSelect(value)}
      size="small"
      renderInput={renderInput}

    />
  );
}
