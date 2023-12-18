import React, { useState } from "react";
import ReactQuill , {Quill}from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { useTheme, withStyles,makeStyles, createStyles } from "@material-ui/core/styles";
import { Typography,Divider, List,Card,ListItem,ListSubheader,ListItemSecondaryAction,Switch,ListItemIcon, ListItemAvatar,Avatar,ListItemText,Grid, ButtonBase, Tooltip } from "@material-ui/core";
import ImageIcon from '@material-ui/icons/Image';
import WifiIcon from '@material-ui/icons/Wifi';

import { grey } from "@material-ui/core/colors";
import ImageResize from 'quill-image-resize-module-react';
Quill.register('modules/imageResize', ImageResize);


const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      background: theme.customization.mode === "Light" ? null : grey[800],
      borderRadius: theme.customization.borderRadius,
      color: "#000000",
      padding: 18,
    },
    headerTitle: {
   
      marginTop: 10,
      marginLeft: 20,
    },
  
  })
);


const EmailSetting = () => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const [checked, setChecked] = React.useState({
    createAccountCustomer:{
      status:true,
      content:''
    },
    notifyDebtCustomer:{
      status:true,
      content:''
    },
    sendVoucherCustomer:{
      status:true,
      content:''
    },
    buyOnlineCustomer:{
      status:true,
      content:''
    },
    completeBuyOnlineCustomer:{
      status:true,
      content:''
    },
    //
    notifyCustomerNotBuyTooLong:{
      status:true,
      content:'voucher'
    },
    notifyDiscount:{
      status:true,
      content:''
    },
    sendDiscountVIPCustomer:{

    },
    //
    createAccountEmployee:{
      status:true,
      content:''
    },
    
  });

  const handleToggle = (event) => {
    const {name,checked} = event.target;
    setChecked((prevState) => {
      return {
        ...prevState,
        [name]:{
          ...prevState[name],
          status:checked
        },
      };
    });
    //CALL API: Mỗi lần toggle là đẩy lên backend
  };

  const handleSubmit = (name,customerScore) =>{   
    // close pop up && set switch
  
    setChecked((prevState) => {
      return {
        ...prevState,
        [name]:{
          ...customerScore,
          status:true
        },
      };
    });

    // CALL API ĐẨY LÊN BACK END HERE....


    // snackbar noti submit thành công

  }


  const [value, setValue] = useState('');
console.log("valueeeee",value)
  return (
    <Card className={classes.root}>
       <Typography className={classes.headerTitle} variant="h3">
            Email
        </Typography>
        <ReactQuill style={{minHeight:300, borderRaidus:5}} theme="snow" value={value} onChange={setValue}  modules={modules} formats={formats}  placeholder={'Write something...'}/>

    </Card>

  );
};
const modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'color':[]}],
    [{'background':[]}],
    [{'list': 'ordered'}, {'list': 'bullet'}, 
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean'],
    
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
  imageResize: {
    parchment: Quill.import('parchment'),
    modules: ['Resize', 'DisplaySize','Toolbar']
 }

}
const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video','color','background'
]


export default EmailSetting;
