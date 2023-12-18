import React, {useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {Table,Button, ListItem,Box,List, Grid,Modal,Dialog, Tooltip} from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import defaultProduct from "../../../../assets/img/product/default-product.png"
import ButtonQuantity from "../../../../components/Button/ButtonQuantity";

// 0. DATA

// 1. SORT
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'product_code', numeric: false, disablePadding: true, label: 'Mã SP', align:'left' },
    { id: 'name', numeric: false, disablePadding: true, label: 'Tên' ,align:'left' },
    { id: 'list_price', numeric: true, disablePadding: false, label: 'Giá bán',align:'right'  },
    { id: 'standard_price', numeric: true, disablePadding: false, label: 'Giá nhập',align:'right' },
    { id: 'quantity', numeric: true, disablePadding: false, label: 'SL đặt' ,align:'center'},
    // { id: 'supplier_uuid', numeric: true, disablePadding: false, label: 'NCC',align:'center' },
  ];
  


function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            // align={headCell.numeric ? 'right' : 'left'}
            align={headCell.align }

            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}


// 3. TOOL BAR

const EnhancedTableToolbar = (props) => {

    const classes = useToolbarStyles();
    // const {rows,selected, cartList} = props;
    const { numSelected ,isNoSupplier,setOpenChooseCart,handleAddToCart,handleClose,onlyOneCart} = props;
    if(numSelected  === 0 ){
        return null
    }
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
      style={{height:10,position:"sticky"}}
    >
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          Đã chọn: {numSelected} 
        </Typography>
        {/* {isNoSupplier? */}
      <Button variant="contained" size='small' color='primary' style={{width:120, marginRight:15}} 
        onClick={()=>{
          if(onlyOneCart){ 
            handleClose() ;
            handleAddToCart(0)
          }
          else{setOpenChooseCart(true)}
        }}
        >
         Bỏ vô giỏ 
      </Button>
      {/* :null } */}
        <Button variant="contained" size='small' color='secondary' style={{width:140}} 
        onClick={()=>{
            handleClose()
            handleAddToCart()      
        }}
        >
         Tạo đơn mới
      </Button>
    </Toolbar>
  );
};



// 4. TABLE ROW


const TableRowWithSelect = (props) => {
  const classes = useStyles();
  const {dataRecommend,hanđleChangeQuantity,handleAddOrderReccomend,handleClose,isNoSupplier,cartList} = props
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('product_code');
  const [selected, setSelected] = React.useState([]);
  const [openChooseCart, setOpenChooseCart] = useState(false)

  const rows = dataRecommend

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.uuid);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, uuid) => {
    const selectedIndex = selected.indexOf(uuid);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, uuid);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (uuid) => selected.indexOf(uuid) !== -1;


  const handleAddToCart = (cartIndex=null) =>{
    // existOrder, newOrder
    let selectRow = rows.filter(row  => selected.includes(row.uuid))
    const cartItem = selectRow.map((row, index)=>{
      let newCartItem = {
        id: index ,
        uuid: row.item.uuid,
        quantity: row.quantity,
        bar_code: row.item.bar_code,
        product_code: row.item.product_code,
        unit_price: row.item.standard_price,
        img_url: row.item.img_url,
        name: row.item.name,
        has_batches: row.item.has_batches,
        batches: [],
        // branch_inventories:row.item.branch_inventories
        branch_inventories:[]
      };
      return newCartItem
    })

    console.log("cartItemsssss",cartItem)
    console.log("newCartList")
    let newCartList = {
      // supplier reccomend này ko đủ như searh trên kia nha .... ko biết có lỗi gì api ko
      supplier: isNoSupplier?null: {name:rows[0].supplier.name, phone:rows[0].supplier.phone, uuid:rows[0].supplier_uuid},       
      cartItem: cartItem,
      total_amount: 0,
      paid_amount: 0,
      discount: 0,
      payment_method: "cash"
    }
    // handleClose()
    handleAddOrderReccomend(newCartList,cartIndex)
  }

  if(!dataRecommend){return}
  return (
    <>
        {openChooseCart ? <ChooseCartPopUp  cartList={cartList} handleAddToCart={handleAddToCart} open={openChooseCart} handleClose={()=>{setOpenChooseCart(false); }} closeAll={handleClose} />:null}

        {/* <EnhancedTableToolbar  handleAddToCart={handleAddToCart} numSelected={selected.length} handleAddOrderReccomend={handleAddOrderReccomend} selected={selected} rows={rows}  handleClose={handleClose} isNoSupplier={isNoSupplier} cartList={cartList} setOpenChooseCart={setOpenChooseCart}/> */}
        <EnhancedTableToolbar onlyOneCart={cartList.length === 1}  handleAddToCart={handleAddToCart} numSelected={selected.length}isNoSupplier={isNoSupplier}setOpenChooseCart={setOpenChooseCart} handleClose={handleClose}/>

        <TableContainer style={{maxHeight:550}} >
          <Table
          stickyHeader
            className={classes.table}
            // size={dense ? 'small' : 'medium'}
            size={'medium'}
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              style={{position:"sticky"}}  

            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
               .map((row, index) => {

                  return<RowData  row={row} index={index} selected={selected} hanđleChangeQuantity={hanđleChangeQuantity} handleClick={handleClick}/>
                })}
             
            </TableBody>
          </Table>
        </TableContainer>
    </>
  );
}

const RowData = ({row, index,selected,hanđleChangeQuantity,handleClick}) =>{
  const classes = useStyles();
  const isSelected = (uuid) => selected.indexOf(uuid) !== -1;
  console.log(row)
  const isItemSelected = isSelected(row.uuid);
    const labelId = `enhanced-table-checkbox-${index}`;
    const [quantity, setQuantity] = useState(row.quantity)

    const updateQuantity = (newQuantity) => {
      setQuantity(newQuantity)
      hanđleChangeQuantity(row.uuid, newQuantity);
    };
    return (
      <Tooltip title={`Tồn kho cần: ${row.item.reorder_quantity}, Đang đặt: ${row.item.ordering_quantity}, Tồn kho hiện tại: ${row.item.inventory}, Tổng bán: ${row.item.total}`}>

      <TableRow
        hover
        // onClick={(event) => handleClick(event, row.uuid)}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.uuid}
        selected={isItemSelected}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={isItemSelected}
            inputProps={{ 'aria-labelledby': labelId }}
            onClick={(event) => handleClick(event, row.uuid)}
          />
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="none" style={{minWidth:100}}>
          {row?.product_code}
        </TableCell>
        <TableCell align="left"   style={{width:250,paddingTop:10, paddingBottom:10 }} padding="none" >
              <ListItem
                  style={{ margin:0,marginLeft: -30, marginTop: -10, marginBottom: -10 , padding:0, }}
              >
                  <Box
                  component="img"
                  sx={{ height: 50, width: 50, borderRadius: 10, marginRight: 15 }}
                  src={row.img || defaultProduct}
                  />
                  <Typography className={classes.fontName}>{row?.name}</Typography>
              </ListItem>
        </TableCell>
        <TableCell align="right"  style={{minWidth:110}}>{row?.list_price.toLocaleString()}</TableCell>
        <TableCell align="right"  style={{minWidth:120}}>{row?.standard_price.toLocaleString()}</TableCell>
        
       
          <TableCell align="center" style={{ minWidth: 100 }}>
            <ButtonQuantity
              quantity={quantity}
              setQuantity={updateQuantity}
              isMini={true}
            />


          </TableCell>
        {/* <TableCell align="right">{row.supplier?.name}</TableCell> */}
        
      </TableRow>
        </Tooltip>
    );
}
export default  TableRowWithSelect



EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };
  
EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
    },
  }));
  const useStyles = makeStyles((theme) => ({
      root: {
        width: '100%',
      },
      paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
      },
      table: {
        minWidth: 750,
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
  

const ChooseCartPopUp = ({cartList,handleClose,open,closeAll,handleAddToCart}) => {
  const getTitle = (cart) => {
    return cart.supplier === null ||cart.supplier?.name?.length === 0  ? "Nhà cung cấp lẻ": cart.supplier.name
  }
  return (
    <Dialog
    open={open}
    onClose={handleClose}
    // fullWidth={true}
    maxWidth={"xs"}
    >
    <Box style={{margin:20, marginBottom:0}}>
      <Typography variant='h3' style={{marginBottom:10}}>Chọn giỏ hàng</Typography>
      <div style={{width:300, marginRight:20}}>
       
        <List >
       {cartList?.map((cart, index) => (
          <ListItem
              key={index}
              style={{padding:0, margin:0, marginBottom:20}}
              alignItems='center'
          >
          <Grid container direction="row" justifyContent="space-between"spacing={1} alignItems='center'>
              <Grid container item  xs={10}  >
                  <Box style={{marginRight:20, color:'#000', fontWeight:500, fontSize:17}}>#{index + 1}</Box>
                  {/* <Typography style={{color:'#000', fontWeight:400, fontSize:16}}>{getTitle(cart)}  </Typography>        */}
              </Grid>
              <Grid container xs={2} item >
                  <Button color='primary' variant='contained' size="small"
                  onClick={()=>{
                    handleClose()
                    closeAll()
                    handleAddToCart( index)
                  }} >
                      Chọn
                  </Button>
              </Grid>
          </Grid>
          
      </ListItem>
      ))} 
      </List>
      </div>   
    </Box>
  </Dialog>
  )
}