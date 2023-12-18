import React from 'react'
import { useTheme, withStyles,makeStyles, createStyles } from "@material-ui/core/styles";

import { Typography,Divider, Button,FormControlLabel,Checkbox,List,Card,ListItem,ListSubheader,ListItemSecondaryAction,Switch,ListItemIcon, ListItemAvatar,Avatar,ListItemText,Grid, ButtonBase, Tooltip } from "@material-ui/core";
import {ThousandSeperatedInput} from "../../../../components/TextField/NumberFormatCustom"


const CustomerScoreSetting = ({checked,handleClose,handleSubmit,name}) => {

const theme = useTheme();
const [customerScore, setCustomerScore] = React.useState(checked)


const handleCheckbox = (event) => {
  setCustomerScore((prevState) => {
    return {
      ...prevState,
      [event.target.name]: event.target.checked,
    };
  });
};

const handleChangeValue = (event) => {
  setCustomerScore((prevState) => {
    return {
      ...prevState,
      value: event.target.value,
    };
  });
};

const handleChangeScoreValue = (event) => {
  setCustomerScore((prevState) => {
    return {
      ...prevState,
      scoreValue: event.target.value,
    };
  });
};

return (
  <>
    <div style={{ marginBottom: 15 }}>
      <Grid container direction="row" alignItems="center" spacing={3}>
        <Grid item>
          <Typography style={{ fontWeight: 500, color: "#000" }}>
            Tỷ lệ quy đổi điểm thưởng
          </Typography>
        </Grid>
        <Grid item>
          <ListItem>
            <ThousandSeperatedInput
              value={customerScore.value}
              onChange={handleChangeValue}
            />
            <Avatar
              variant="rounded"
              style={{
                width: theme.spacing(5),
                height: theme.spacing(3),
                backgroundColor: theme.palette.primary.main,
                marginLeft: 10,
                marginRight: 20,
              }}
            >
              <Typography style={{ fontSize: 13, fontWeight: 500 }}>
                VND
              </Typography>
            </Avatar>
            <Typography style={{ marginRight: 15 }}> = </Typography>
            <Typography> 1 điểm thưởng</Typography>
          </ListItem>
          {Number(customerScore.value) <= 0 ? (
            <Typography variant="h6" style={{ color: "red" }}>
              Tiền quy đổi điểm phải lớn hơn 0
            </Typography>
          ) : null}
        </Grid>
      </Grid>
    </div>
    <div style={{ marginBottom: 15 }}>
      <Grid container direction="row" alignItems="center" spacing={3}>
        <Grid item>
          <Typography style={{ fontWeight: 500, color: "#000" }}>
            Giá trị điểm thưởng
          </Typography>
        </Grid>
        <Grid item>
          <ListItem>
            <ThousandSeperatedInput
              value={customerScore.scoreValue || 1000}
              onChange={handleChangeScoreValue}
            />
            <Avatar
              variant="rounded"
              style={{
                width: theme.spacing(5),
                height: theme.spacing(3),
                backgroundColor: theme.palette.primary.main,
                marginLeft: 10,
                marginRight: 20,
              }}
            >
              <Typography style={{ fontSize: 13, fontWeight: 500 }}>
                VND
              </Typography>
            </Avatar>
          </ListItem>
          {Number(customerScore.scoreValue) <= 0 ? (
            <Typography variant="h6" style={{ color: "red" }}>
              giá trị điểm thưởng phải lớn hơn 0
            </Typography>
          ) : null}
        </Grid>
      </Grid>
    </div>
    <FormControlLabel
      control={
        <Checkbox
          name="exceptDiscountProduct"
          checked={customerScore.exceptDiscountProduct}
          onChange={handleCheckbox}
        />
      }
      label="Không tích điểm cho sản phẩm khuyến mãi"
    />
    <FormControlLabel
      control={
        <Checkbox
          name="exceptDiscountInvoice"
          checked={customerScore.exceptDiscountInvoice}
          onChange={handleCheckbox}
        />
      }
      label="Không tích điểm cho hoá đơn khuyến mãi"
    />
    <FormControlLabel
      control={
        <Checkbox
          name="exceptVoucher"
          checked={customerScore.exceptVoucher}
          onChange={handleCheckbox}
        />
      }
      label="Không tích điểm cho hoá đơn thanh toán bằng voucher"
    />

    <Grid
      item
      xs={12}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingTop: 20,
      }}
    >
      <Button
        onClick={handleClose}
        variant="contained"
        size="small"
        style={{ marginRight: 20 }}
        color="secondary"
      >
        {" "}
        Huỷ{" "}
      </Button>
      <Button
        onClick={() => handleSubmit(name, customerScore)}
        variant="contained"
        size="small"
        color="primary"
        disabled={
          Number(customerScore.value) <= 0 ||
          Number(customerScore.scoreValue) <= 0
        }
      >
        OK{" "}
      </Button>
    </Grid>
  </>
);
}

export default CustomerScoreSetting