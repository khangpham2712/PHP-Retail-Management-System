import * as React from "react";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import { Notifications } from "@material-ui/icons";
import NotificationContent from "./NotificationContent";
import {
    IconButton,
} from "@material-ui/core";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {useSelector} from 'react-redux';
import storeApi from "../../api/storeApi";
import CustomerListItem from "./CustomerListItem";
import OutOfStockListItem from "./OutOfStockListItem";
import OutOfDateListItem from "./OutOfDateListItem";
import BasicTabs from "../Tab/BasicTab";
export default function Notification() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };
  const info = useSelector(state => state.info)
  const store_uuid = info.store.uuid
  const branch_uuid = info.branch.uuid
  const [tabItems, setTabItems] = React.useState([]);
  const getNotification = async () => {
    try {
      if (store_uuid && branch_uuid) {
        const res = await storeApi.getNotification(store_uuid, branch_uuid);
        console.log(res.data)
        const tabItems = []
        tabItems.push({
          label: "Công nợ",
          content: <NotificationContent>{res.data["customers"].map(customer => (<CustomerListItem customer={customer}/>))}</NotificationContent>
        })
        tabItems.push({
          label: "Tồn kho",
          content: <NotificationContent>{res.data["out_of_stock_products"].map(product => (<OutOfStockListItem product={product}/>))}</NotificationContent>
        })
        tabItems.push({
          label: "Lô hết hạn",
          content: <NotificationContent>{res.data["out_of_date_batches"].map(product => (<OutOfDateListItem product={product}/>))}</NotificationContent>
        })

        setTabItems(tabItems)
      }
    } catch(err) {
      console.log(err)
    }
  }

  React.useEffect(async () => {
    if (store_uuid && branch_uuid && open) {
      getNotification();
     }
  }, [open]) 

  return (
    <Box sx={{ width: 50 }}>
      <IconButton color="primary"  onClick={handleClick} >
        <Notifications/>
      </IconButton>
      <Popper open={open} anchorEl={anchorEl} transition style={{zIndex: 1500}}>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <BasicTabs items={tabItems} />
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
}
