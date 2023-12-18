import React from 'react'
import {useTheme, makeStyles,createStyles} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

//import library
import {Box,Grid,Collapse,Typography,Button,ListItemIcon,ListItemText,IconButton} from '@material-ui/core';

//import icon
import MoreVertIcon from '@material-ui/icons/MoreVert';
import HighlightOffTwoToneIcon from '@material-ui/icons/HighlightOffTwoTone';

//import image
import avaUpload from '../../../../../../assets/img/product/lyimg.jpeg';

//import project 
import {StyledMenu,StyledMenuItem} from '../../../../../../components/Button/MenuButton'

import customerApi from '../../../../../../api/customerApi';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) =>
createStyles({
  root: {
    '& .MuiTextField-root': {
      marginTop: theme.spacing(2),
    },
  },
  headerTitle:{
    fontSize: '1.125rem'
  },
  typo:{
    marginBottom:20
  }

}));

const UploadImage  = () => {
  return (
    <Box
      component="img"
      sx={{
        height: 120,
        width: 120, 
        borderRadius:120,
        marginLeft:15,

      }}
      src={avaUpload}
    />
    
  )
}
const VoucherDetail = (props) => {
    const {row,openRow }= props.parentProps;

    const theme = useTheme();
    const classes = useStyles(theme);
    const xsScreen = useMediaQuery(theme.breakpoints.down("xs")) ;


    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const info = useSelector(state => state.info)
    const store_uuid = info.store.uuid

    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
        <Collapse in={ openRow === row.uuid } timeout="auto" unmountOnExit>
             <Box margin={1}>
                <Typography variant="h3" gutterBottom component="div" className={classes.typo}>
                 {row.name}
               </Typography>

              <Grid  container direction="row" justifyContent="flex-start">
                  
                <Grid item xs={12} sm={4}>
                      <Grid container direction="row" justifyContent="flex-start" > 
                        <Grid item xs={3} sm={5} >
                          <Typography variant="h5" gutterBottom component="div">Mã voucher </Typography>    
                        </Grid>
                        <Grid item xs={6} >
                          <Typography variant="body1" gutterBottom component="div">{row.uuid} </Typography>
                        </Grid>
                      </Grid>
                      <Grid container direction="row" justifyContent="flex-start">
                        <Grid item xs={3} sm={5} >
                          <Typography variant="h5" gutterBottom component="div">Tên voucher </Typography>    
                        </Grid>
                        <Grid item xs={6} >
                          <Typography variant="body1" gutterBottom component="div">{row.name} </Typography>
                        </Grid>
                      </Grid>
                      <Grid container direction="row" justifyContent="flex-start">
                          <Grid item xs={3} sm={5} >
                            <Typography variant="h5" gutterBottom component="div">Mệnh giá</Typography>    
                          </Grid>
                          <Grid item xs={6} >
                            <Typography variant="body1" gutterBottom component="div">{row.phone}</Typography>
                          </Grid>
                      </Grid>
                      <Grid container direction="row" justifyContent="flex-start">
                          <Grid item xs={3} sm={5} >
                            <Typography variant="h5" gutterBottom component="div">Số lượng</Typography>    
                          </Grid>
                          <Grid item xs={6} >
                            <Typography variant="body1" gutterBottom component="div">{row.payment_info}</Typography>
                          </Grid>
                      </Grid>
                      
                  </Grid>
                <Grid item xs={12} sm={4}>
                    <Grid container direction="row" justifyContent="flex-start">
                        <Grid item xs={3} sm={6} >
                          <Typography variant="h5" gutterBottom component="div">Thời gian</Typography>    
                        </Grid>
                        <Grid item xs={6} >
                          <Typography variant="body1" gutterBottom component="div">3.000.000</Typography>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justifyContent="flex-start">
                        <Grid item xs={3} sm={6} >
                          <Typography variant="h5" gutterBottom component="div">Trạng thái</Typography>    
                        </Grid>
                        <Grid item xs={6} >
                          <Typography variant="body1" gutterBottom component="div">500.000</Typography>
                        </Grid>
                    </Grid>
                    
                  </Grid>
               
              </Grid>

              {/* Button */}
              <Grid container direction="row" justifyContent={"flex-end" } style={{marginTop:20}}> 
                          <Button variant="contained" size="small" style={{marginLeft:15}}>Sửa</Button>
                          <Button variant="contained" size="small" style={{marginLeft:15}}>Xoá</Button>
                          
                          <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={handleClick}
                            size="small"
                            style={{marginLeft:10}}

                          >
                            <MoreVertIcon />
                          </IconButton>
                          
                          <StyledMenu
                            id="customized-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            
                           
                          >
                            <StyledMenuItem>
                              <ListItemIcon style={{marginRight:-15}}>
                                <HighlightOffTwoToneIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary="Ngừng hoạt động" />
                            </StyledMenuItem>

                          </StyledMenu>


                      </Grid>

             </Box>
           </Collapse>
    )
}

export default VoucherDetail
