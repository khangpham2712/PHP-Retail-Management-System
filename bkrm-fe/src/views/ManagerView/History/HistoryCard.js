import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import storeApi from "../../../api/storeApi";
import { useSelector } from "react-redux";
import { format, toDate,parseISO } from 'date-fns'
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import Typography from '@material-ui/core/Typography';
import {ListItem,Paper} from '@material-ui/core';
import { makeStyles ,useTheme} from '@material-ui/core/styles';

import {VNDFormat} from "../../../components/TextField/NumberFormatCustom"
import { Grid } from "@mui/material";
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '6px 16px',
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const returnTextAction = (type) =>{
  switch(type){
    case "order":
      return <Typography style={{color:"#8bc34a", fontWeight:600}}>Bán hàng </Typography>  
    case "purchase_order":
        return<Typography style={{color:"#2196f3", fontWeight:600}}>Nhập hàng</Typography>
    case "refund":
        return<Typography style={{color:"#f44336", fontWeight:600}}>Trả hàng</Typography>
    case "purchase_return":
        return<Typography style={{color:"#ff9800", fontWeight:600}}>Trả hàng nhập</Typography>
    case "inventory_check":
        return<Typography style={{color:"purple", fontWeight:600}}>Kiểm kho</Typography>
    default:
      return
  }
  <Typography> Thanh toán hoá đơn</Typography>
}
// const returnColor = (type) =>{
//   switch(type){
//     case "order": return "#8bc34a"
//     case "purchase_order": return "#2196f3"
//     case "refund": return "#f44336"
//     case "purchase_return": return "#ff9800"
//     default: return
//   }
// }


export default function HistoryCard({data}) {
  const classes = useStyles();
  const theme = useTheme();
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs")) ;

  
  return (
    // <Card sx={{ minWidth: 275, marginBottom: 5, borderRadius: 5 }}>
    //   <CardContent>
    //     <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
    //       {"Tài liệu: " + data?.code}
    //     </Typography>
    //     <Typography component="div">
    //       {"Đối tác: " + data?.partner_name}
    //     </Typography>
    //     <Typography sx={{ mb: 1.5 }} color="text.secondary">
    //       {(data?.user_type === "owner" ? "Chủ cửa hàng - " : "Nhân viên - ") +
    //         data?.user_name}
    //     </Typography>
    //     <Typography variant="body2">
    //       {"Tổng giá trị: " + data?.total_amount}
    //     </Typography>
    //   </CardContent>
    //   <CardActions>
    //     <Button size="small">{"Thời gian: " + data?.created_at}</Button>
    //     <Button size="small">{"Địa điểm: " + data?.branch_name}</Button>
    //   </CardActions>
    // </Card>
    <TimelineItem style={{marginLeft:xsScreen ? -30:0}} >
          <TimelineOppositeContent style={{ flex: 0.1 }} >
              <Typography variant="body2" color="textSecondary">{format(parseISO(data?.created_at), 'hh:mm a')}</Typography>  
          </TimelineOppositeContent>

          <TimelineSeparator>
            <TimelineDot variant="outlined" color="primary"  />
            <TimelineConnector />
          </TimelineSeparator>

          <TimelineContent>

            <Paper elevation={3} className={classes.paper}>
                <Typography style={{color:"grey", fontSize:12}} >
                  {data?.branch_name}
                </Typography>
                <Typography style={{fontWeight:600, fontSize:13}} >
                  {data?.user_name}
                </Typography>
                <Grid container direction="row"alignItems="center" > 
                    <Grid item > {returnTextAction(data?.type)}</Grid>
                    <Grid item style={{marginLeft:3,  }}>  đơn</Grid>
                    <Grid item style={{marginLeft:3, marginRight:3,fontWeight:600,}}> {data?.code} </Grid>
                    <Grid item> với giá trị </Grid>
                    <Grid item> <Typography style={{marginLeft:3, fontWeight:600,color:theme.customization.secondaryColor[500] }}> <VNDFormat value={data?.total_amount}/> </Typography></Grid>

                </Grid>
                
                {/* <ListItem style={{marginTop:-5, marginLeft:-16}}>
                {returnTextAction(data?.type)}
                <Typography style={{marginLeft:3,  }}>đơn </Typography>
                <Typography style={{marginLeft:3, marginRight:3,fontWeight:600,}}>  {data?.code}  </Typography>
                <Typography>với giá trị </Typography>
                <Typography style={{marginLeft:3, fontWeight:600,color:theme.customization.secondaryColor[500] }}> <VNDFormat value={data?.total_amount}/> </Typography>
                </ListItem> */}
            </Paper>

          </TimelineContent>
        
      </TimelineItem>

  );
}
