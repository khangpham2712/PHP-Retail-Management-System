import React ,{useState}from 'react'
import ReportCard from "../../../../components/CardWrapper/ReportCard"
import Chart from 'react-apexcharts';
import {Typography,Divider,Card,Grid,Paper,InputAdornment,Modal,Dialog,Box,TextField,Button,InputLabel,MenuItem,FormControl,Select,ListItem,ListItemIcon,ListItemText} from '@material-ui/core';
import TypeReportSelect from "../../../../components/Select/TypeReportSelect"
import DayReportSelect from "../../../../components/Select/DayReportSelect"
import { useEffect } from "react";
import branchApi from "../../../../api/branchApi";
import { useSelector } from "react-redux";

const BranchStatistics = () => {
  const today = new Date();
  const [dayQuery, setDayQuery] = useState({
    fromDate: new Date(today.setDate(today.getDate() - 7 + 1))
      .toISOString()
      .split("T")[0],
    toDate: new Date().toISOString().split("T")[0],
  });
  const [categoryData, setCategoryData] = useState({
    value: [],
    title: [],
  });

  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;

  const dataCategory = {
    type: "donut",
    // DATA HERE : value
    series: categoryData.value,

    options: {
      // DATA HERE : name
      labels: categoryData.title,
      chart: {
        type: "donut",
      },
      colors: [
        "#06C9D6",
        "#FFC90C",
        "#E56A75",
        "#00C292",
        "#FB9677",
        "#ff007d",
        "#9c4afb",
        "#b6fb4a",
        "#4afbe8",
      ],
      // colors:[ '#00e5ff','#FFC90C', '#ff007d','#00C292','#FB9677','#E56A75',],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 50,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };
  const sumAllValue = categoryData.value.reduce((a, b) => a + b, 0);
  const [type, setType] = useState("revenue");
  useEffect(() => {
    branchApi
      .reportBranch(store_uuid, dayQuery.fromDate, dayQuery.toDate)
      .then((res) => {
        const branches = res.data;

        const newType = type === "best-seller" ? "orders" : type;
        const categoryData = {
          value: branches.map((branch) => branch[newType] || 0),
          title: branches.map((branch) => branch.branch_name),
        };

        setCategoryData(categoryData);
      });
  }, [dayQuery, type]);
  return (
    <ReportCard
      title={"Chi nhánh"}
      ToolBar={
        <ListItem style={{ margin: 0, padding: 0 }}>
          <TypeReportSelect
            type={type}
            handleChangeType={(e) => setType(e.target.value)}
            title={title}
          />
          <DayReportSelect
            dayQuery={dayQuery}
            setDayQuery={setDayQuery}
            short
          />
        </ListItem>
      }
    >
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={6}>
          <Chart {...dataCategory} />
        </Grid>

        <Grid item xs={6}>
          {categoryData.value?.map((value, index) => {
            return (
              <Box key={index} style={{ marginBottom: 10 }}>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  style={{ marginBottom: 10 }}
                >
                  {/* <Grid item xs={4}><Typography style={{ fontSize:16,textAlign:"center"}}>{index + 1}</Typography></Grid> */}
                  <Grid item xs={4}>
                    <Typography style={{ fontSize: 16, textAlign: "center" }}>
                      {categoryData.title[index]}
                    </Typography>
                  </Grid>
                  {/* <Grid item xs={4}><Typography style={{ fontSize:16,textAlign:"center"}}>{value}{` / `}{(Number(value) / Number(sumAllValue)*100).toFixed(2)}%</Typography></Grid> */}
                  <Grid item xs={4}>
                    <Typography style={{ fontSize: 16, textAlign: "center" }}>
                      {value ? value.toLocaleString() : "0"}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography style={{ fontSize: 16, textAlign: "center" }}>
                      {(
                        (Number(value) / Number(sumAllValue)) * 100 || 0
                      ).toFixed(2)}
                      %
                    </Typography>
                  </Grid>
                </Grid>
                <Divider />
              </Box>
            );
          })}
        </Grid>
      </Grid>
    </ReportCard>
  );
};

export default BranchStatistics
const title = [" số đơn hàng", " doanh thu"," lợi nhuận" ]
