import React ,{useState,useRef}from 'react'
import ReportCard from "../../../../components/CardWrapper/ReportCard"
import Chart from 'react-apexcharts';
import {Typography,Divider,Tooltip,IconButton,Card,Grid,Paper,InputAdornment,Modal,Dialog,Box,TextField,Button,InputLabel,MenuItem,FormControl,Select,ListItem,ListItemIcon,ListItemText} from '@material-ui/core';
import TypeReportSelect from "../../../../components/Select/TypeReportSelect"
import DayReportSelect from "../../../../components/Select/DayReportSelect"

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import BranchSelect from "../../../../components/Select/BranchSelect"
import { useSelector } from 'react-redux'
import moment from 'moment';
import { useReactToPrint } from "react-to-print";
import PrintTwoToneIcon from "@material-ui/icons/PrintTwoTone";

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });
  

const FinancialReport = () => {
    const classes = useStyles();
    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branch_uuid = info.branch.uuid;
    const branches = info.store.branches

      // must be in format
      const today = new Date()
      const [dayQuery,setDayQuery] = useState({
          fromDate:  moment(new Date(today.getFullYear(), today.getMonth(), 1)).format("YYYY-MM-DD") ,
          toDate:  moment(new Date(today.getFullYear(), today.getMonth()+1, 0)).format("YYYY-MM-DD"),
      });
      // const [selectedBranches, setSelectedBranches] = useState(branches?branches:[]);
      const [selectedBranches, setSelectedBranches] = useState('all');
      // unit used for chart data split by day/ month/ year
      const [unit, setUnit] = useState("day");





    //   
    let chartData = {
        height: 350,
        type: 'bar',
        options: {
            chart: {height: 300, type: 'bar', toolbar: { show: true,offsetX: 0,  offsetY: 0, tools: { download: true,selection: true,zoom: true,  zoomin: true,zoomout: true, pan: true, reset: true | '<img src="/static/icons/reset.png" width="20">', customIcons: [] },}},    
            dataLabels: { enabled: false },
            stroke: { show: true, width: 2,  colors: ['transparent'] },
            plotOptions: {
               bar: { horizontal: false,   columnWidth: '55%', endingShape: 'rounded'},
            },
            xaxis: { 
              type: 'date', categories: ["Tháng 1/2022", "Tháng 2/2022"],
              labels: { 
                  formatter: function (value) { return value},
                  style: {colors: ['#000'], fontSize: '14px', fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 500, cssClass: 'apexcharts-xaxis-label',  }, 
              }, 
              tickAmount: 7,
            },
            yaxis: {
              labels: { 
                   formatter: function (value) {  return value},
                  style: { colors: ['#000'], fontSize: '14px', fontFamily: 'Helvetica, Arial, sans-serif',  fontWeight: 500, cssClass: 'apexcharts-yaxis-label', },
               },
  
              },
             fill: {  opacity: 1 },
              tooltip: { x: {   format: 'dd/MM/yy' } },
              colors:['#00e5ff','#ffc400',  '#ff007d']
          },
    }
    let profitData = {
        ...chartData,
        series: [
            {name: 'Thu',data: [29860000,28300000] }, 
            // { name: 'Thu - Chi',data:statistics.purchase? statistics.revenue.map((item, index) => (Number(item) - Number(statistics.purchase[index])) ) : [] }, 
        ],
    };


     // toolbar
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const Report = () =>{
      return (
        <TableContainer style={{marginTop:-20}}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead >
            <TableRow style={{backgroundColor:'lightBlue', }}>
              <TableCell></TableCell>
              <TableCell style={{color:'#000', fontWeight:500, fontSize:15}} align="right">Tháng 1/2022</TableCell>
              <TableCell style={{color:'#000', fontWeight:500,fontSize:15}} align="right">Tháng 2/2022</TableCell>
              <TableCell style={{color:'#000', fontWeight:500,fontSize:15}} align="right">Tổng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{color:'#000'}}>
              <TableRow >
                <TableCell style={{color:'#000', fontWeight:500}} component="th" scope="row">Doanh thu bán hàng (1) </TableCell>
                <TableCell style={{color:'#000',}}align="right">147.230.000</TableCell>
                <TableCell style={{color:'#000',}}align="right">120.500.000</TableCell>
                <TableCell style={{color:'#000',}}align="right">267.730.000</TableCell>
              </TableRow>
  
              <TableRow >
                <TableCell  style={{color:'#000', fontWeight:500}}  component="th" scope="row">Chiết khấu hoá đơn (2)</TableCell>
                <TableCell style={{color:'#000',}}align="right">30.230.000</TableCell>
                <TableCell style={{color:'#000',}}align="right">20.500.000</TableCell>
                <TableCell style={{color:'#000',}}align="right">50.730.000</TableCell>
              </TableRow>
  
              <TableRow >
                <TableCell  style={{color:'#000', fontWeight:500}}  component="th" scope="row">Doanh thu thuần (3 = 1 - 2) </TableCell>
                <TableCell style={{color:'#000',}}align="right">117.230.000</TableCell>
                <TableCell style={{color:'#000',}}align="right">100.500.000</TableCell>
                <TableCell style={{color:'#000',}}align="right">217.730.000</TableCell>
              </TableRow>
  
  
              <TableRow >
                <TableCell  style={{color:'#000', fontWeight:500}} component="th" scope="row">Giá vốn bán hàng (4)</TableCell>
                <TableCell style={{color:'#000',}}align="right">50.100.000</TableCell>
                <TableCell style={{color:'#000',}}align="right">39.200.000</TableCell>
                <TableCell style={{color:'#000',}}align="right">89.000.000</TableCell>
              </TableRow>
  
              <TableRow >
                <TableCell  style={{color:'#000', fontWeight:500}} component="th" scope="row">Lợi nhuận gộp bán hàng (5 = 3 - 4)</TableCell>
                <TableCell style={{color:'#000',}}align="right">67.130.000</TableCell>
                <TableCell style={{color:'#000',}}align="right">61.300.000</TableCell>
                <TableCell style={{color:'#000',}}align="right">128.430.000</TableCell>
              </TableRow>
  
              {/*  */}
  
              <TableRow >
                <TableCell  style={{color:'#000', fontWeight:500}}  component="th" scope="row">Chi phí khác (6)</TableCell>
                <TableCell style={{color:'#000',}}align="right">42.500.000</TableCell>
                <TableCell style={{color:'#000',}}align="right">37.000.000</TableCell>
                <TableCell style={{color:'#000',}}align="right">79.500.000</TableCell>
              </TableRow>
  
              <TableRow >
                <TableCell style={{color:'#000',}} component="th" scope="row">{"\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"}Xuất huỷ hàng hoá</TableCell>
                <TableCell style={{color:'#000',}} align="right">500.000</TableCell>
                <TableCell style={{color:'#000',}} align="right">0</TableCell>
                <TableCell style={{color:'#000',}} align="right">500.000</TableCell>
              </TableRow>
  
              <TableRow >
                <TableCell style={{color:'#000',}} component="th" scope="row">{"\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"}Lương nhân viên</TableCell>
                <TableCell style={{color:'#000',}} align="right">20.000.000</TableCell>
                <TableCell style={{color:'#000',}} align="right">15.000.000</TableCell>
                <TableCell style={{color:'#000',}} align="right">35.000.000</TableCell>
              </TableRow>
  
              <TableRow >
                <TableCell style={{color:'#000',}} component="th" scope="row">{"\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"}Tiền mặt bằng</TableCell>
                <TableCell style={{color:'#000',}} align="right">22.000.000</TableCell>
                <TableCell style={{color:'#000',}} align="right">22.000.000</TableCell>
                <TableCell style={{color:'#000',}} align="right">44.000.000</TableCell>
              </TableRow>
  
              <TableRow >
                <TableCell style={{color:'#000',}} component="th" scope="row">{"\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"}Phí dịch vụ giao hàng</TableCell>
                <TableCell style={{color:'#000',}} align="right">0</TableCell>
                <TableCell style={{color:'#000',}} align="right">0</TableCell>
                <TableCell style={{color:'#000',}} align="right">0</TableCell>
              </TableRow>
  
  
              <TableRow >
                <TableCell  style={{color:'#000', fontWeight:500}}  component="th" scope="row">Thu nhập khác (7)</TableCell>
                <TableCell style={{color:'#000',}} align="right">5.230.000</TableCell>
                <TableCell style={{color:'#000',}} align="right">4.000.000</TableCell>
                <TableCell style={{color:'#000',}} align="right">9.230.000</TableCell>
              </TableRow>
  
              <TableRow >
                <TableCell style={{color:'#000',}}  component="th" scope="row">{"\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"}Phí trả hàng</TableCell>
                <TableCell style={{color:'#000',}} align="right">230.000</TableCell>
                <TableCell style={{color:'#000',}} align="right">0</TableCell>
                <TableCell style={{color:'#000',}}  align="right">230.000</TableCell>
              </TableRow>
  
              <TableRow >
                <TableCell style={{color:'#000',}}   component="th" scope="row">{"\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"}Phí dịch vụ</TableCell>
                <TableCell  style={{color:'#000',}} align="right">5.000.000</TableCell>
                <TableCell style={{color:'#000',}} align="right">4.000.000</TableCell>
                <TableCell style={{color:'#000',}} align="right">9.000.000</TableCell>
              </TableRow>
  
  
  
              <TableRow >
                <TableCell  style={{color:'#000', fontWeight:500}} component="th" scope="row">Lợi nhuận thuần (8 = 5 - 6 + 7)</TableCell>
                <TableCell style={{color:'#000', fontWeight:500}} align="right">29.860.000</TableCell>
                <TableCell style={{color:'#000',fontWeight:500}} align="right">28.300.000</TableCell>
                <TableCell style={{color:'#000',fontWeight:500}} align="right">58.160.000</TableCell>
              </TableRow>
  
          </TableBody>
        </Table>
      </TableContainer>
      )
  }
  return (
      <>
    <ReportCard  title={"Báo cáo tài chính"}  ToolBar={
        <ListItem >
            <Box>
                <FormControl  size="small" variant="outlined" >
                    <Select size="small" 
                    //  onChange={(e)=>setUnit(e.target.value)}  value={unit} 
                      >
                        <MenuItem value="day">Theo ngày</MenuItem>
                        <MenuItem value="month">Theo tháng</MenuItem>
                        <MenuItem value="year">Theo năm</MenuItem>   
                    </Select>
                </FormControl>
            </Box>
            {branches?.length === 1?null: <BranchSelect haveAllOption={true} selectedBranches={selectedBranches} setSelectedBranches={setSelectedBranches}/>}
            <DayReportSelect dayQuery={dayQuery} setDayQuery={setDayQuery}/>
            <Tooltip title="In danh sách">
              <IconButton
                aria-label="filter list"
                onClick={() => {
                  handlePrint();
                }}
              >
                <PrintTwoToneIcon className={classes.icon} />
              </IconButton>
            </Tooltip>
        </ListItem>

    }>
       
      <Report />
      <div style={{display:'none'}}> 
        <div ref={componentRef}>
        <div style={{padding:10}}>
                <Typography style={{color:'#000'}}>Ngày lập:  {moment(new Date()).format("DD/MM/YYYY HH:mm")}</Typography>
                <Box style={{ margin: 10,flexGrow: 1,  textAlign: "center" ,color: "#000"}}>
                <Typography style={{  fontSize: 20, fontWeight: 500}} >
                    Báo cáo tài chính 
                </Typography>
                <Typography  > {`Tất cả chi nhánh`} </Typography>
                <Typography  > {`Từ 01/01/2022 - Đến 28/02/2022`} </Typography>

                </Box>
             
            </div>
            <Box style={{marginTop:20}}>
            <Report />
               </Box>
          
        </div>
    </div>
    
    </ReportCard>
    <ReportCard  title={"Biểu đồ lợi nhuận thuần"}  >
    <Chart {...profitData}/> 
    
    </ReportCard>
    </>




  )
}

export default FinancialReport
const title = [" số đơn hàng", " doanh thu"," lợi nhuận" ]
