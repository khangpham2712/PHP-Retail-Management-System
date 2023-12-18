import React, { useEffect } from 'react'
import {useTheme, makeStyles,createStyles} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

//import library
import {Tooltip, Chip, Dialog,Card,DialogContent,Box,Grid,TableHead,TableBody,Typography,Table,TableCell,TableRow,Collapse,Button,ListItemIcon,ListItemText,IconButton} from '@material-ui/core';

//import icon
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PrintTwoToneIcon from '@material-ui/icons/PrintTwoTone';
import GetAppTwoToneIcon from '@material-ui/icons/GetAppTwoTone';


//import project 
import {StyledMenu,StyledMenuItem} from '../../../../../components/Button/MenuButton'
import InventoryReturnPopUp from '../../../../../components/PopUpReturn/InventoryReturnPopUp/InventoryReturnPopUp';
import {ThousandFormat, VNDFormat} from "../../../../../components/TextField/NumberFormatCustom"


import { grey} from '@material-ui/core/colors'

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
  },
  card: {
    background: theme.customization.mode === "Light"? null: grey[800],
    borderRadius:theme.customization.borderRadius,
    color: '#000000',
    borderWidth:2,
  },
  background:{
    background: theme.customization.mode === "Light"? theme.customization.primaryColor[50]: grey[700]
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },

}));


const CheckHistoryDetail = (props) => {
    const {row, openRow }= props.parentProps;
    const {isMini}= props;
    
  //  tam thoi
    const currentUser = "Minh Tri";

    const theme = useTheme();
    const classes = useStyles(theme);
    const xsScreen = useMediaQuery(theme.breakpoints.down("xs")) ;

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    //calculate
    const moneyDif = row.details
    ?.map((detail) => detail.quantity * detail.unit_price)
    .reduce((total, ele) => total + ele, 0)

 
    return (
      // <Collapse in={ openRow === row.id } timeout="auto" unmountOnExit>
      <Collapse
        in={isMini ? true : openRow === row.uuid}
        timeout="auto"
        unmountOnExit
      >
        <Box margin={1}>
          <Typography
            variant="h3"
            gutterBottom
            component="div"
            className={classes.typo}
          >
            {row.product_name}
          </Typography>

          <Grid container direction="row" justifyContent="flex-start">
            <Grid item xs={12} sm={5}>
              <Grid container direction="row" justifyContent="flex-start">
                <Grid item xs={5} sm={5}>
                  <Typography variant="h5" gutterBottom component="div">
                    Mã đơn kiểm
                  </Typography>
                </Grid>
                <Grid item sm={4}>
                  <Typography variant="body1" gutterBottom component="div">
                    {row.inventory_check_code}{" "}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container direction="row" justifyContent="flex-start">
                <Grid item xs={5} sm={5}>
                  <Typography variant="h5" gutterBottom component="div">
                    Ngày kiểm{" "}
                  </Typography>
                </Grid>
                <Grid item sm={4}>
                  <Typography variant="body1" gutterBottom component="div">
                    {/* {row.created_at}{" "} */}
                    {row.created_at?.split(" ")[0].split('-').reverse().join('/').concat("\u00a0\u00a0"+ row.created_at?.split(" ")[1].substr(0, 5)) }

                  </Typography>
                </Grid>
              </Grid>
              {/* <Grid container direction="row" justifyContent="flex-start">
                <Grid item xs={5}>
                  <Typography variant="h5" gutterBottom component="div">
                    Tổng tồn kho
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1" gutterBottom component="div">
                    {row.tongtonkho}
                  </Typography>
                </Grid>
              </Grid> */}
              {/* <Grid container direction="row" justifyContent="flex-start">
                <Grid item xs={5}>
                  <Typography variant="h5" gutterBottom component="div">
                    SL thực tế
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1" gutterBottom component="div">
                    {row.details.sum}{" "}
                  </Typography>
                </Grid>
              </Grid> */}
            </Grid>
            <Grid item xs={12} sm={5}>
              {/* <Grid container direction="row" justifyContent="flex-start">
                <Grid item xs={6}>
                  <Typography variant="h5" gutterBottom component="div">
                    Trạng thái
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1" gutterBottom component="div">
                    Không cân bằng
                  </Typography>
                </Grid>
              </Grid> */}
              {/* <Grid container direction="row" justifyContent="flex-start">
                <Grid item xs={6}>
                  <Typography variant="h5" gutterBottom component="div">
                    Tổng lệch
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1" gutterBottom component="div">
                    {row.tongSLthucte - row.tongtonkho}
                  </Typography>
                </Grid>
              </Grid> */}
              <Grid container direction="row" justifyContent="flex-start">
                <Grid item xs={5} sm={6}>
                  <Typography variant="h5" gutterBottom component="div">
                    Chi nhánh thực hiện
                  </Typography>
                </Grid>
                <Grid item sm={4}>
                  <Typography variant="body1" gutterBottom component="div">
                    {row.branch_name}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container direction="row" justifyContent="flex-start">
                <Grid item xs={5} sm={6}>
                  <Typography variant="h5" gutterBottom component="div">
                    Người thực hiện
                  </Typography>
                </Grid>
                <Grid item sm={4}>
                  <Typography variant="body1" gutterBottom component="div">
                    {row.user_name}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Typography
            variant="h4"
            gutterBottom
            component="div"
            style={{ marginTop: 30 }}
          >
            Danh sách sản phẩm
          </Typography>
          <Table size="small" aria-label="purchases">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Sản phẩm</TableCell>
                {/* <TableCell>Mã vạch</TableCell> */}
                <TableCell align="right">Tồn kho</TableCell>
                <TableCell align="right">SL thực tế</TableCell>
                <TableCell align="right">Lệch</TableCell>
                <TableCell align="right">Giá trị</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {row.details?.map((detail) => (
                <TableRow key={detail.product_id}>
                  <TableCell component="th" scope="row">
                    {detail.product_code}
                  </TableCell>
                  <TableCell>{detail.product_name}</TableCell>
                  <TableCell align="right">
                    <ThousandFormat value={detail.branch_inventory} />

                    <div>
                      {JSON.parse(detail.batches)?.filter((batch) => batch.is_checked)
                        .map((checked_batch) => (
                          <div>
                          <Tooltip
                            title={`${
                              checked_batch.position ? checked_batch.position : ""
                            }-${
                              checked_batch.expiry_date
                                ? checked_batch.expiry_date
                                : ""
                            }`}
                          >
                            <Chip
                              label={`${checked_batch.batch_code}-${checked_batch.quantity}`}
                              size="small"
                            ></Chip>
                          </Tooltip>
                        </div>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    <ThousandFormat
                      value={
                        Number(detail.branch_inventory) +
                        Number(detail.quantity)
                      }
                    />
                    <div>
                      {JSON.parse(detail.batches)?.filter((batch) => batch.is_checked)
                        .map((checked_batch) => (
                          <div>
                          <Tooltip
                            title={`${
                              checked_batch.position ? checked_batch.position : ""
                            }-${
                              checked_batch.expiry_date
                                ? checked_batch.expiry_date
                                : ""
                            }`}
                          >
                            <Chip
                              size="small"
                              label={`${checked_batch.batch_code}-${checked_batch.checked_quantity}`}
                            ></Chip>
                          </Tooltip>
                        </div>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 700 }}>
                    <ThousandFormat value={detail.quantity} />
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 700 }}>
                    <VNDFormat value={detail.quantity * detail.unit_price} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box
            className={classes.background}
            style={{
              padding: 10,
              borderRadius: theme.customization.borderRadius,
              marginTop: 10,
            }}
          >
            <Grid container direction="column">
              <Grid container direction="row" justifyContent={"flex-end"}>
                <Grid item xs={5} sm={2}>
                  <Typography variant="h5" gutterBottom component="div">
                    Tổng SL lệch
                  </Typography>
                </Grid>
                <Grid item xs={3} sm={2}>
                  <Typography variant="body1" gutterBottom component="div">
                    <ThousandFormat
                      value={row.details
                        ?.map((detail) => detail.quantity)
                        .reduce((total, ele) => total + ele, 0)}
                    />
                  </Typography>
                </Grid>
              </Grid>
              <Grid container direction="row" justifyContent={"flex-end"}>
                <Grid item xs={5} sm={2}>
                  <Typography variant="h5" gutterBottom component="div">
                    Tổng tiền lệch
                  </Typography>
                </Grid>
                <Grid item xs={3} sm={2}>
                  <Typography variant="body1" gutterBottom component="div">
                    <VNDFormat
                      style={{
                        fontWeight: 700,
                        color: moneyDif > 0 ? "green" : "red",
                      }}
                      value={moneyDif}
                    />
                  </Typography>
                </Grid>
              </Grid>

              {/* <Grid container direction="row" justifyContent="flex-end">
                <Grid item xs={2}>
                  <Typography variant="h5" gutterBottom component="div">
                    Tổng lệch
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body1" gutterBottom component="div">
                    {row.total}{" "}
                  </Typography>
                </Grid>
              </Grid> */}
            </Grid>
          </Box>

          {/* <Grid
            container
            direction="row"
            justifyContent={"flex-end"}
            style={{ marginTop: 20 }}
          >
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClick}
              size="small"
              style={{ marginLeft: 10 }}
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
                <ListItemIcon style={{ marginRight: -15 }}>
                  <PrintTwoToneIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="In đơn nhập" />
              </StyledMenuItem>

              <StyledMenuItem>
                <ListItemIcon style={{ marginRight: -15 }}>
                  <GetAppTwoToneIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Xuất excel" />
              </StyledMenuItem>
            </StyledMenu>
          </Grid> */}
        </Box>
      </Collapse>
    );
}

export default CheckHistoryDetail

const headCells = [
  { id: 'stt', numeric: false, disablePadding: true, label: 'Stt' },
  { id: 'id', numeric: false, disablePadding: true, label: '#' },
  { id: 'name', numeric: false, disablePadding: true, label: 'Tên' },
  { id: 'price', numeric: true, disablePadding: true, label: 'Đơn giá' },
  { id: 'quantity', numeric: true, disablePadding: true, label: 'Số lượng' },
  { id: 'protein1', numeric: true, disablePadding: true, label: 'Thành tiền' },]
;
