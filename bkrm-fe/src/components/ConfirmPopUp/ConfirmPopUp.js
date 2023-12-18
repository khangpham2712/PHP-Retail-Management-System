import { Box, Button, Typography, TextField } from "@material-ui/core";
import React,{useState} from "react";
import ModalWrapper from "../Modal/ModalWrapper";
const ConfirmPopUp = (props) => {
  const [pwd,setPwd] = useState("")
  return (
    <ModalWrapper {...props}>
      <Box>
        <Typography>{props.message}</Typography>
        {props.passwordRequired ?
          <TextField
          onChange = {(e) => setPwd(e.target.value)}
          style={{marginTop:20}}
            id="name"
            name="name"
            label="Mật khẩu"
            variant="outlined"
            type="password"
            fullWidth
            size="small"
          /> : null}

      </Box>
      <Box
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <Button
          color="secondary"
          size="small"
          // variant="outlined"
          variant="contained"
          style={{ marginRight: 20 }}
          onClick={props.handleClose}
        >
          Hủy
        </Button>
        <Button
          color="primary"
          size="small"
          variant="contained"
          // variant="outlined"
          onClick={() => {
            props.handleConfirm(pwd);
          }}
        >
          {" "}
          Xác nhận
        </Button>
      </Box>
    </ModalWrapper>
  );
};

export default ConfirmPopUp;
