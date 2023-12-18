import React, {useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    Typography,
    InputAdornment,
    FormControlLabel,
    FormLabel,
    CardHeader,
    IconButton,
    Dialog,
    Divider,
    AppBar,
    Toolbar,
    Slide,
    Switch,
    Modal,
    ListItem,
    Box
  } from "@material-ui/core";

import Editor from '@react-page/editor'

import "@react-page/editor/lib/index.css";
import "@react-page/plugins-image/lib/index.css";
// import "@react-page/plugins-spacer/lib/index.css";
import "@react-page/plugins-slate/lib/index.css";

import { useDispatch, useSelector } from "react-redux";
import storeApi from "../../../../api/storeApi";
import openNotification from "../../../../components/StatusPopup/StatusPopup";
import cellPlugins from './util'

      
const AbousUsSetting = () => {
    const [value, setValue] = React.useState(null)

    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const [web, setWeb] = React.useState(null);

    useEffect(() => {
        const loadData = async () => {
            const response = await storeApi.getStoreInfo(store_uuid);
            if (response.data.web_configuration) {
                setValue(JSON.parse(response.data.web_configuration).other.detail);
                setWeb(JSON.parse(response.data.web_configuration));
            }
        };

        if (store_uuid) {
            loadData();
        }
  }, [store_uuid]);

    const saveSetting =  async () => {
        try {
            let newWeb = {...web}
            newWeb.other.detail = value
            const response = storeApi.updateStoreInfo(store_uuid, {
            web_configuration: JSON.stringify(newWeb),
            });
            openNotification("success", "Lưu cài đặt chung thành công");
        } catch (err) {
            console.log(err);
            openNotification("success", "Lưu cài đặt chung thất bại");
        }
    }
    
    
  return (
    <>

    <div style={{backgroundColor:"#fff"}}>
    <Editor
        cellPlugins={cellPlugins}
        value={value}
        onChange={setValue}
    />
        <Box  style={{flexGrow:1, textAlign:'right'}}> <Button variant='contained' size='small'color='primary' style={{margin:10}}
        
        onClick={saveSetting}> Lưu thay đổi</Button> </Box>

    </div>
    {/* </Dialog> */}

    </>
  )
}

export default AbousUsSetting