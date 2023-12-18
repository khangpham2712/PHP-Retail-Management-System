import React, {useEffect} from 'react'
import {
    Button,
    Typography,
    InputAdornment,
    FormControlLabel,
    FormLabel,
    CardHeader,
    IconButton,
    Collapse,
    FormControl,
    RadioGroup,
    TextField,
    Checkbox,
    Card,
    Radio,
    Grid,
    ButtonBase,
    Tooltip,
    Box,
    Switch,
    ListItem,
    MenuItem,
    Select
  } from "@material-ui/core";
  import MoreInfo from "../../../../components/MoreInfo/MoreInfo"
  import { useSelector ,useDispatch} from "react-redux";

const OrderManagement = ({web,setWeb,handleChangeOrderManagement,showOutOfStock}) => {
    const info = useSelector((state) => state.info);
    // const branches = info.branchsOfStore
    const branches = info.store.branches

    const handleChangeChecked= (e) => {
        var newWeb = { ...web };
        newWeb.orderManagement.orderWhenOutOfSctock = e.target.checked;
        setWeb(newWeb);
     };



  return (
    <>
<Typography style={{ fontWeight: 500, marginRight: 10, marginBottom: 15 }}>
        Quản lý đơn đặt hàng:
      </Typography>
      {/* <div style={{border: "1px solid #c8c8c8",marginBottom:30, padding:15, borderRadius:20}}> */}
      {branches?.length > 1 ?
      <Box style={{marginLeft:30}}> 
        <FormControl>
        <Typography style={{fontWeight:500, marginRight:20, color:'#6B6B6B'}}>Chi nhánh nhận đơn đặt hàng: </Typography>  
          <RadioGroup
            defaultValue="default"
            name="branchOption"
            style={{marginLeft:30}}
            value={web.orderManagement.branchOption}
            onChange={handleChangeOrderManagement}

          >
            {/* Nếu đã lưu vô database xong chi nhánh mặc định này bị xoá thì làm sao biết */}
           <FormControlLabel value="default" control={<Radio color='primary'/>} label={
             <ListItem style={{margin:0, padding:0}}>
                  <Typography style={{marginRight:15}}>Chi nhánh mặc định</Typography>
                  <Select
                    name="branchDefault"
                    value={web.orderManagement.branchDefault}
                    onChange={handleChangeOrderManagement}
                  >
                    {branches?.map((branch)=>{
                      return (
                        <MenuItem key={branch.uuid} value={branch.id}>{branch.name}</MenuItem>
                      )
                    })}
                  </Select>
            </ListItem>
           } />
           <FormControlLabel value="choose" control={<Radio color='primary'/>} label="Cho khách hàng chọn chi nhánh khi truy cập trang web" />

            <FormControlLabel value="auto"  control={<Radio color='primary'/>} label={
              <ListItem style={{margin:0, padding:0}}>
                    <Typography style={{marginRight:15}}>Tự động gủi đơn về chi nhánh gần nhất</Typography>
                    <AutoInfo />
              </ListItem>
            } />
          </RadioGroup>
        </FormControl>
      </Box>: null}




      {showOutOfStock? 
      <FormControlLabel
            style={{marginBottom:30}}
            control={ <Checkbox  checked={web.orderManagement.orderWhenOutOfSctock}  name="orderWhenOutOfSctock" 
            value={web.orderManagement.orderWhenOutOfSctock}
            onChange={handleChangeChecked}

            /> }
            label={ <Typography style={{fontWeight:500, marginLeft:20, color:'#6B6B6B'}}>Cho phép đặt hàng khi hết tồn kho </Typography>}
            labelPlacement="start"
      />:null}
      {/* </div> */}
     
      


    </>
  )
}

export default OrderManagement

const AutoInfo = () =>{
    return(
      <MoreInfo> 
          <Typography variant='h6'>
              - Nếu cho phép đặt hàng khi hết tồn kho thì: đơn sẽ được gửi về chi nhánh gần nhất
          </Typography>
          <Typography variant='h6'>
              - Nếu không cho phép đặt hàng khi hết tồn kho thì:
          </Typography>
          <Typography variant='h6'>
              + Sản phẩm không còn tồn kho ở tất cả các chi nhánh, hệ thông báo sẽ thông báo hết tồn kho và khách hàng không đặt được sản phẩm đó
          </Typography>
          <Typography variant='h6'>
            + Đơn sẽ được gửi tới chi nhánh gần nhất mà tất cả sản phẩm trong đơn đặt hàng đều đủ tồn kho.
                Nếu không có chi nhánh nào mà tất cả sản phẩm trong đơn đặt hàng đều thoả tồn kho, 
                thì đơn hàng sẽ được gửi về chi nhánh gần nhất và thoả nhiều tồn kho trong đơn đặt nhất để xử lý
          </Typography>
      </MoreInfo>
    )
  }