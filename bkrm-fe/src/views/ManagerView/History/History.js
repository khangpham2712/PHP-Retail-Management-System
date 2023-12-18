import React, { useState, useEffect } from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import { Typography,Box, Card, Grid, ButtonBase, Tooltip, Select, MenuItem } from "@material-ui/core";
import FilterListIcon from '@material-ui/icons/FilterList';
import { grey } from "@material-ui/core/colors";
import HistoryTable  from './HistoryTable.js'
import { useSelector } from "react-redux";
import HistoryFilter from "./HistoryFilter.js"
import storeApi from "../../../api/storeApi";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      background: theme.customization.mode === "Light" ? null : grey[800],
      borderRadius: theme.customization.borderRadius,
      color: "#000000",
      padding: 18,
    },
    headerTitle: {
      flexGrow: 1,
      textAlign: "center",
      marginTop: 10,
      marginLeft: 40,
    },
    addIcon: {
      background: theme.customization.secondaryColor[500],
      borderRadius: 20,
      color: "#fff",
    },
    addBtn: {
      marginRight: 10,
      marginTop: 5,
    },
    textTitle: {
      flexGrow: 1,
      textAlign: "center",
      marginTop: 5,
      
    },
  })
);

const History = () => {
  const theme = useTheme();
  const classes = useStyles(theme);

   //3.2. filter
   const [openFilter, setOpenFilter] = React.useState(false);
   const handleToggleFilter = () => {
     setOpenFilter(!openFilter);
   };

  const str = "2020-06-11";

  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;

  const [activities, setActivities] = useState([]);
  const [period, setPeriod] = useState(7)
  const [filters, setFilters] = useState(['inventory_check', 'order', 'refund', 'purchase_order', 'purchase_return'])

  const fetchActivities = async () => {
    try {
      const res = await storeApi.getActivities(store_uuid, branch_uuid, period);
      setActivities(res.data);
      console.log(res.data)
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (store_uuid && branch_uuid) {
      fetchActivities();
    }
  }, [store_uuid, branch_uuid, period]);
 
  return (
    <Card className={classes.root}>
      <Grid container direction="row" alignItems="center">
        <Typography className={classes.headerTitle} variant="h2">
          Lịch sử hoạt động
        </Typography>
        <ButtonBase
          className={classes.addBtn}
          // onClick={handleToggleFilter}
        >
          {/* <Tooltip title="Lọc">
            <FilterListIcon size="small" />
          </Tooltip> */}
        </ButtonBase>
      </Grid>
      <Typography className={classes.textTitle} variant="body2">
        ( Chi nhánh {info.branch.name})
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          marginRight: 50,
          gap: 20
        }}
      >
        <Select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          label="Thời gian"
          size="small"
        >
          <MenuItem value={1}>Hôm nay</MenuItem>
          <MenuItem value={7}>7 ngày</MenuItem>
          <MenuItem value={30}>30 ngày</MenuItem>
        </Select>

        <Select 
          multiple
          value={filters}
          onChange={e => setFilters(e.target.value)}
          style={{width: 100}}
        >
          <MenuItem value="order">Bán hàng</MenuItem>
          <MenuItem value="purchase_order">Nhập hàng</MenuItem>
          <MenuItem value="refund">Trả hàng</MenuItem>
          <MenuItem value="purchase_return">Trả hàng nhập</MenuItem>
          <MenuItem value="inventory_check">Kiểm kho</MenuItem>
        </Select>
      </div>
      <Box style={{ marginTop: 15 }}>
        <HistoryTable activities={activities.filter(act => filters.find(filter => act.type === filter))} />
      </Box>

      <HistoryFilter
        openFilter={openFilter}
        handleToggleFilter={handleToggleFilter}
      />
    </Card>
  );
};

export default History;
