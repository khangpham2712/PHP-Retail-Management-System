import React from 'react'
import { useTheme, withStyles,makeStyles, createStyles } from "@material-ui/core/styles";

import { Typography,Divider,Button, TextField,FormControlLabel,Checkbox,List,Card,ListItem,ListSubheader,ListItemSecondaryAction,Switch,ListItemIcon, ListItemAvatar,Avatar,ListItemText,Grid, ButtonBase, Tooltip } from "@material-ui/core";
import {ThousandSeperatedInput} from "../../../../components/TextField/NumberFormatCustom"
import { useFormik } from "formik";
import * as Yup from "yup";

const EmailSetting = ({checked,handleClose,handleSubmit,name}) => {

    const theme = useTheme();

    const [email, setEmail] = React.useState(checked)


    const formik = useFormik({
      initialValues: {
        emailAddress:  checked?.emailAddress || "",
        password: checked?.password  || "",
      },
      validationSchema: Yup.object({ 
        emailAddress: Yup.string().required("Email không được trống")
        .email("Email không chính xác"),
        password: Yup.string().required("Mật khẩu không được trông")
      }),
    })

    const handleChangeValue= (event) => {
      setEmail((prevState)=>{
        return {
        ...prevState,
        [event.target.name]:event.target.value
        }
      })
      formik.setFieldValue(event.target.name, event.target.value)
    };

  
    return (
      <>
      <ListItem>
          <Typography style={{fontWeight:500, color:"#000", marginRight:20}}>Email gửi</Typography>
          <TextField  name="emailAddress" value={email.emailAddress} onChange={handleChangeValue} style={{width:250}} 
           error={formik.touched.emailAddress && formik.errors.emailAddress}
           helperText={formik.touched.emailAddress ? formik.errors.emailAddress : null}
           onBlur={formik.handleBlur}
           />
      </ListItem>
      <ListItem>
          <Typography style={{fontWeight:500, color:"#000", marginRight:20}}>Mật khẩu</Typography>
          <TextField  type="password" value={email.password} onChange={handleChangeValue} style={{width:250}} 
          error={formik.touched.password && formik.errors.password}
          helperText={formik.touched.password ? formik.errors.password : null}
          onBlur={formik.handleBlur}
          />
      </ListItem>

      <Grid item  xs={12} style={{ display: "flex", flexDirection: "row",justifyContent: "flex-end",  paddingTop: 20,  }}  >
            <Button onClick={handleClose} variant="contained"  size="small"  style={{ marginRight: 20 }} color="secondary"  >  Huỷ </Button>
            <Button onClick={()=>handleSubmit(name,email)} variant="contained" size="small" color="primary" disabled={!(formik.isValid)}>OK  </Button>
        </Grid>
    
      </>      
    )
}

export default EmailSetting