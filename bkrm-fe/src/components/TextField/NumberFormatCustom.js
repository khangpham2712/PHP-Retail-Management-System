import React from "react";
import NumberFormat from "react-number-format";
import TextField from "@material-ui/core/TextField";

export const VNDFormat = (props) => {
  return (
    <NumberFormat
      {...props}
      thousandSeparator
      isNumericString
      displayType="text"
      type="text"
      suffix=" đ"
    />
  )
}
export const ThousandFormat = (props) => {
  return (
    <NumberFormat
      {...props}
      thousandSeparator
      isNumericString
      displayType="text"
      type="text"
      suffix=""
    />
  )
}

function VNDFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      suffix=" đ"
    />
  );
}

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
    />
  );
}

export default function VNDInput(props) {
  return (
    <TextField
      name="numberformat"
      InputProps={{
        endAdornment: props.endAdornment,
        inputComponent: VNDFormatCustom,
        inputProps: {
          style: { textAlign: "right" },
        }
      }}
      {...props}
    />
  );
}
export function ThousandSeperatedInput(props) {
  const { defaultPrice, value, max } = props
  return (
    <TextField
      name="numberformat"
      defaultValue={defaultPrice}
      value={value ? value : null}
      InputProps={{
        inputComponent: NumberFormatCustom,
        inputProps: {
          style: { textAlign: "right" },
          max: max? max:null,
          min:0
        }
         
      }}
      {...props}
    />
  );
}
