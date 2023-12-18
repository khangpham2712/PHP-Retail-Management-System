// import React, {useState,useEffect,useRef} from 'react'
// import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
// import {
//     Button,
//     TextField,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     Typography,
//     Grid,
//     Avatar,
//     Dialog,
//     FormControl,
//     InputLabel,
//     Select,
//     MenuItem,
//     Card,
//     FormControlLabel,
//     Checkbox,
//     Divider,
//     ButtonBase,
//     Tooltip,
//     CardHeader,
//     Input,
//     Chip,
//     IconButton,
//     FormLabel,
//     RadioGroup,
//     Radio,
//     Box,
//     ListItem
//   } from "@material-ui/core";
// import clsx  from "clsx"
// import _ from 'lodash'

// import CloseIcon from "@material-ui/icons/Close";
// import CheckCircleIcon from '@material-ui/icons/CheckCircle';
// import { batch, useDispatch, useSelector } from "react-redux";
// import ModalWrapperWithClose from "../../../../../components/Modal/ModalWrapperWithClose"
// import { ThousandSeperatedInput } from '../../../../../components/TextField/NumberFormatCustom';
// import productApi from '../../../../../api/productApi'
// import { statusAction } from '../../../../../store/slice/statusSlice';
// import barcocde1 from "../../../../../assets/img/barcode/1.jpeg"
// import barcocde2 from "../../../../../assets/img/barcode/2.jpeg"
// import barcocde3 from "../../../../../assets/img/barcode/3.jpeg"
// import { useReactToPrint } from "react-to-print";
// import Barcode from 'react-barcode';
// import { returnStatement } from '@babel/types';
// const useStyles = makeStyles((theme) =>
//     createStyles({
//     weight:{
//         fontWeight:500,
//         color: "#000",
//         fontSize: 14,
//     },
//     headerTitle: {
//         fontSize: "1.125rem",
//       },

// })
// );
// const PrintBarcodePopUp = ({open,onClose, row }) => {
//     const theme = useTheme();
//     const classes = useStyles(theme);
   
//     console.log("row",row)

//     const [quantity , setQuantity] = useState(1)
//     const [codeType , setCodeType] = useState("code")
//     const [printStoreName , setPrintStoreName] = useState("yes")
//     const [printBatch , setPrintBatch] = useState(row.has_batches === 0?"no" :"yes")
//     const [col , setCol] = useState(null)
//     const [batchCode , setBatchCode] = useState(row.batches[0]?.batch_code)

//     console.log("ow.has_batch ",row.has_batches )
//     console.log("row.has_batch === 0",row.has_batches === 0 )
//     const [openPrintBarcode,setOpenPrintBarcode] =  useState(row.batches[0]?.batch_code)

//       // toolbar
//   const componentRef = useRef();
//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });
//   const handleChooseBarCode = (col) => {
//     setCol(col)

//   }
//   useEffect (()=>{
//     if(col){handlePrint()}
//   },[col])


//     return (
//         <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth={true}>
//             <Grid container direction="row" justifyContent="space-between" alignItems="center">
//                     <DialogTitle id="form-dialog-title">
//                         <Typography className={classes.headerTitle} variant="h3" >
//                             In mã tem
//                         </Typography>
//                     </DialogTitle>

//                     <IconButton aria-label="close"   onClick={onClose}>
//                         <CloseIcon  fontSize="small" />
//                     </IconButton>
//             </Grid>
           
//             <DialogContent>
//                 <Grid container  >
//                     <Grid item  xs={4}>
//                         <Typography style={{color:'#000',fontSize:15, fontWeight:500}}>Số lượng in:</Typography>
//                         {/* <TextField value={quantity} onChange={(e)=>setQuantity(e.target.value)}/> */}
//                         <ThousandSeperatedInput style={{width:100}}value={quantity} onChange={(e)=>setQuantity(e.target.value)}/>
//                         <Typography style={{color:'#000',fontSize:15, fontWeight:500, marginTop:25}}>Mã in:</Typography>
//                         <FormControl className={classes.formControl}>
//                             <Select value={codeType} onChange={(e)=>setCodeType(e.target.value)} >
//                             <MenuItem value={"code"}>Mã hàng</MenuItem>
//                             {row.product_code ?<MenuItem value={"barcode"}>Mã vạch</MenuItem>:null}
//                             </Select>
//                         </FormControl>
//                         <Typography style={{color:'#000',fontSize:15, fontWeight:500, marginTop:25}}>Tên cửa hàng</Typography>
//                         <FormControl className={classes.formControl}>
//                             <Select value={printStoreName} onChange={(e)=>setPrintStoreName(e.target.value)} >
//                             <MenuItem value={"yes"}>In tên cửa hàng</MenuItem>
//                             <MenuItem value={"no"}>Không in tên cửa hàng</MenuItem>
//                             </Select>
//                         </FormControl>
//                         {row.has_batches? 
//                             <>
//                          <Typography style={{color:'#000',fontSize:15, fontWeight:500, marginTop:25}}>In lô</Typography>
//                             <FormControl className={classes.formControl}>
//                                 <Select value={printBatch} onChange={(e)=>setPrintBatch(e.target.value)} >
//                                 <MenuItem value={"yes"}>In mã lô</MenuItem>
//                                 <MenuItem value={"nno"}>Không in mã lô</MenuItem>
//                                 </Select>
//                             </FormControl>
//                             {printBatch.includes("yes") ? 
//                             <>
//                             <Typography style={{color:'#000',fontSize:15, fontWeight:500, marginTop:25}}>Mã lô</Typography>
//                             <FormControl className={classes.formControl}>
//                                 <Select value={batchCode} onChange={(e)=>setBatchCode(e.target.value)} >
//                                 { row.batches.map((batch)=>{
//                                     return(
//                                          <MenuItem value={batch?.batch_code}>{batch?.batch_code}</MenuItem>
//                                     )
//                                 }) }
//                                 </Select>
//                             </FormControl>
//                             </>
//                             :null}
//                             </>:null    
//                     }
//                     </Grid>
//                     <Grid item container xs={8} spacing={3}>
//                         <Grid item container>
//                             <Grid item xs={5}><Box component="img" sx={{  height: 100,  width: 100, marginLeft: 7,  marginRight: 7, borderRadius: 2, }}  src={barcocde3} /></Grid>
//                             <Grid item xs={7}>
//                                 <Typography style={{color:'#000',fontSize:15, fontWeight:500}}>Mẫu giấy cuộn 3 nhãn (Khổ giấy in nhãn 104x22mm / 4.2x0.9 inch)  </Typography>
//                                 <Button  onClick={()=>handleChooseBarCode(4)}  variant="contained" size="small"  color="primary" style={{marginTop:20}} >
//                                     Xem bản in 
//                                 </Button>
//                             </Grid>
//                         </Grid>
//                         <Grid item container>
//                             <Grid item xs={5}><Box component="img" sx={{  height: 100,  width: 100, marginLeft: 7,  marginRight: 7, borderRadius: 2, }}  src={barcocde2} /></Grid>
//                             <Grid item xs={7}>
//                                 <Typography style={{color:'#000',fontSize:15, fontWeight:500}}>Mẫu giấy cuộn 2 nhãn (Khổ giấy in nhãn 72x22mm)  </Typography>
//                                 <Button  onClick={()=>handleChooseBarCode(6)}  variant="contained" size="small"  color="primary" style={{marginTop:20}}  >
//                                     Xem bản in 
//                                 </Button>
//                             </Grid>
            
//                         </Grid>
//                         <Grid item container>
//                             <Grid item xs={5}><Box component="img" sx={{  height: 100,  width: 100, marginLeft: 7,  marginRight: 7, borderRadius: 2, }}  src={barcocde1} /></Grid>
//                             <Grid item xs={7}>
//                                 <Typography style={{color:'#000',fontSize:15, fontWeight:500}}>Mẫu giấy cuộn 1 nhãn  (Khổ giấy in nhãn 50x30mm)  </Typography>
//                                 <Button  onClick={()=>handleChooseBarCode(12)}  variant="contained" size="small"  color="primary"  style={{marginTop:20}} >
//                                     Xem bản in 
//                                 </Button>
//                             </Grid>
//                         </Grid>
//                     </Grid>
//                 </Grid>

//                 <div style={{ display: "none" }}>
//                     <div ref={componentRef}>
//                         <ComponentToPrint row={row} quantity={quantity} codeType={codeType} printStoreName={printStoreName} printBatch={printBatch} col={col} batchCode={batchCode}/>
//                     </div>
//                 </div>

//             </DialogContent>
//             <DialogActions>
//             <Button  onClick={onClose}  variant="contained" size="small"  color="secondary" >
//                 Huỷ 
//             </Button>
          
//             </DialogActions>    
//         </Dialog>
//     )
// }

// export default PrintBarcodePopUp
// const ComponentToPrint = ({ row ,quantity,codeType,printStoreName,printBatch,col,batchCode}) => {
//     const info = useSelector((state) => state.info);
//     const BarCodeModel = ({margin}) =>{
//         return (
//         // <Box style={{ textAlign:'center', padding:20}}>
//         //     {printStoreName.includes("yes") ? <Typography style={{color:'#000',fontSize:15, fontWeight:500}}>{info.store.name}</Typography>:""}
//         //     {/* {printBatch.includes("no")?
//         //     // <div style={{width:100, heigth:20}}>
//         //         <Barcode value={codeType ==="code" ?row.product_code:row.bar_code }   width='1px' 
//         //         height='10px' />
//         //     //  </div>
//         //     : <Barcode value={codeType ==="code" ?row.product_code.concat("_"+ batchCode):row.bar_code.concat("_"+ batchCode) } 
//         //     // format="CODE128" 
//         //     // className="ss" 
//         //     // displayValue={false} 
//         //     width='1px' 
//         //     height='10px'
            
//         //     />} */}
          

              
//         // </Box>
//         <Grid container item xs={col} style={{marginBottom:margin}} >
//              {printBatch.includes("no")?
//              <div>
//                   <div style={{width:102, textAlign:'center'}}>
//               <Typography style={{color:'#000', fontSize:7, marginBottom:3}}>{row.product_code}</Typography> 
//               </div>
//               <Barcode 
//                 value={codeType ==="code" ?row.product_code:row.bar_code }
//                 format="CODE128" 
//                 // className="ss" 
//                 displayValue={false} 
//                 fontSize="10px"
//                 width='1px' 
//                 height='30px'
//                 margin="0px"
//                 padding="0px"

//                 />
//                 <div style={{width:102, textAlign:'center', marginTop:3}}>
//                 <Typography style={{color:'#000', fontSize:7, }}>{row.name}</Typography> 
//                  <Typography style={{color:'#000', fontSize:7,}}>{row.list_price?.toLocaleString()} VNĐ</Typography> 
                 
//                 </div>
                
//              </div>:
//               <div>
//               <Typography>{row.product_code}</Typography> 
//                 <Barcode 
//                 // value={codeType ==="code" ?row.product_code.concat("_"+ batchCode):row.bar_code.concat("_"+ batchCode)}
//                 value={row.product_code.concat("-"+ batchCode)}
//                 format="CODE128" 
//                 fontSize="10px"
//                 // className="ss" 
//                 displayValue={false} 
//                 width='1px' 
//                 height='30px'
//                 />
//                  <Typography>{row.name}</Typography> 
//                  <Typography>{row.list_price}</Typography> 
//                 </div>}
//              </Grid>
//         )
//     }
//     function range(start, end) {
//         return Array(end - start + 1).fill().map((_, idx) => start + idx)
//       }
//       console.log(" range(1,Number(quantity))", range(1,Number(quantity)))

//     return (
//         // <Grid container>
//         //     {range(1,Number(quantity)).map(()=> {
//         //         return(
//         //             <Grid container item xs={col} justifyContent="center">
//         //                 <BarCodeModel />
//         //             </Grid>    
//         //         )
//         //     })}

//         // </Grid>
        
//        <div style={{paddingTop:25,paddingLeft:40}}>
//            <Grid container >
//              <BarCodeModel  margin={70} />
//              <BarCodeModel  margin={70}/>
//              <BarCodeModel  margin={0}/>
//              </Grid>
//        </div>
       
     
//     );
//   };
  
import React, {useState,useEffect,useRef} from 'react'
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import {
    Button,
    TextField,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Grid,
    Avatar,
    Dialog,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    FormControlLabel,
    Checkbox,
    Divider,
    ButtonBase,
    Tooltip,
    CardHeader,
    Input,
    Chip,
    IconButton,
    FormLabel,
    RadioGroup,
    Radio,
    Box,
    ListItem
  } from "@material-ui/core";
import clsx  from "clsx"
import _ from 'lodash'

import CloseIcon from "@material-ui/icons/Close";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { batch, useDispatch, useSelector } from "react-redux";
import ModalWrapperWithClose from "../../../../../components/Modal/ModalWrapperWithClose"
import { ThousandSeperatedInput } from '../../../../../components/TextField/NumberFormatCustom';
import productApi from '../../../../../api/productApi'
import { statusAction } from '../../../../../store/slice/statusSlice';
import barcocde1 from "../../../../../assets/img/barcode/1.jpeg"
import barcocde2 from "../../../../../assets/img/barcode/2.jpeg"
import barcocde3 from "../../../../../assets/img/barcode/3.jpeg"
import { useReactToPrint } from "react-to-print";
import Barcode from 'react-barcode';
import { returnStatement } from '@babel/types';
const useStyles = makeStyles((theme) =>
    createStyles({
    weight:{
        fontWeight:500,
        color: "#000",
        fontSize: 14,
    },
    headerTitle: {
        fontSize: "1.125rem",
      },

})
);
const PrintBarcodePopUp = ({open,onClose, row }) => {
    const theme = useTheme();
    const classes = useStyles(theme);
   
    console.log("row",row)

    const [quantity , setQuantity] = useState(1)
    const [codeType , setCodeType] = useState("code")
    const [printStoreName , setPrintStoreName] = useState("yes")
    const [printBatch , setPrintBatch] = useState(row.has_batches === 0?"no" :"yes")
    const [col , setCol] = useState(null)
    const [batchCode , setBatchCode] = useState(row.batches[0]?.batch_code)

    console.log("ow.has_batch ",row.has_batches )
    console.log("row.has_batch === 0",row.has_batches === 0 )
    const [openPrintBarcode,setOpenPrintBarcode] =  useState(row.batches[0]?.batch_code)

      // toolbar
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const handleChooseBarCode = (col) => {
    setCol(col)

  }
  useEffect (()=>{
    if(col){handlePrint()}
  },[col])


    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth={true}>
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
                    <DialogTitle id="form-dialog-title">
                        <Typography className={classes.headerTitle} variant="h3" >
                            In mã tem
                        </Typography>
                    </DialogTitle>

                    <IconButton aria-label="close"   onClick={onClose}>
                        <CloseIcon  fontSize="small" />
                    </IconButton>
            </Grid>
           
            <DialogContent>
                <Grid container  >
                    <Grid item  xs={4}>
                        <Typography style={{color:'#000',fontSize:15, fontWeight:500}}>Số lượng in:</Typography>
                        {/* <TextField value={quantity} onChange={(e)=>setQuantity(e.target.value)}/> */}
                        <ThousandSeperatedInput style={{width:100}}value={quantity} onChange={(e)=>setQuantity(e.target.value)}/>
                        <Typography style={{color:'#000',fontSize:15, fontWeight:500, marginTop:25}}>Mã in:</Typography>
                        <FormControl className={classes.formControl}>
                            <Select value={codeType} onChange={(e)=>setCodeType(e.target.value)} >
                            <MenuItem value={"code"}>Mã hàng</MenuItem>
                            {row.product_code ?<MenuItem value={"barcode"}>Mã vạch</MenuItem>:null}
                            </Select>
                        </FormControl>
                        <Typography style={{color:'#000',fontSize:15, fontWeight:500, marginTop:25}}>Tên cửa hàng</Typography>
                        <FormControl className={classes.formControl}>
                            <Select value={printStoreName} onChange={(e)=>setPrintStoreName(e.target.value)} >
                            <MenuItem value={"yes"}>In tên cửa hàng</MenuItem>
                            <MenuItem value={"no"}>Không in tên cửa hàng</MenuItem>
                            </Select>
                        </FormControl>
                        {row.has_batches? 
                            <>
                         <Typography style={{color:'#000',fontSize:15, fontWeight:500, marginTop:25}}>In lô</Typography>
                            <FormControl className={classes.formControl}>
                                <Select value={printBatch} onChange={(e)=>setPrintBatch(e.target.value)} >
                                <MenuItem value={"yes"}>In mã lô</MenuItem>
                                <MenuItem value={"nno"}>Không in mã lô</MenuItem>
                                </Select>
                            </FormControl>
                            {printBatch.includes("yes") ? 
                            <>
                            <Typography style={{color:'#000',fontSize:15, fontWeight:500, marginTop:25}}>Mã lô</Typography>
                            <FormControl className={classes.formControl}>
                                <Select value={batchCode} onChange={(e)=>setBatchCode(e.target.value)} >
                                { row.batches.map((batch)=>{
                                    return(
                                         <MenuItem value={batch?.batch_code}>{batch?.batch_code}</MenuItem>
                                    )
                                }) }
                                </Select>
                            </FormControl>
                            </>
                            :null}
                            </>:null    
                    }
                    </Grid>
                    <Grid item container xs={8} spacing={3}>
                        <Grid item container>
                            <Grid item xs={5}><Box component="img" sx={{  height: 100,  width: 100, marginLeft: 7,  marginRight: 7, borderRadius: 2, }}  src={barcocde3} /></Grid>
                            <Grid item xs={7}>
                                <Typography style={{color:'#000',fontSize:15, fontWeight:500}}>Mẫu giấy cuộn 3 nhãn (Khổ giấy in nhãn 104x22mm / 4.2x0.9 inch)  </Typography>
                                <Button  onClick={()=>handleChooseBarCode(4)}  variant="contained" size="small"  color="primary" style={{marginTop:20}} >
                                    Xem bản in 
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item container>
                            <Grid item xs={5}><Box component="img" sx={{  height: 100,  width: 100, marginLeft: 7,  marginRight: 7, borderRadius: 2, }}  src={barcocde2} /></Grid>
                            <Grid item xs={7}>
                                <Typography style={{color:'#000',fontSize:15, fontWeight:500}}>Mẫu giấy cuộn 2 nhãn (Khổ giấy in nhãn 72x22mm)  </Typography>
                                <Button  onClick={()=>handleChooseBarCode(6)}  variant="contained" size="small"  color="primary" style={{marginTop:20}}  >
                                    Xem bản in 
                                </Button>
                            </Grid>
            
                        </Grid>
                        <Grid item container>
                            <Grid item xs={5}><Box component="img" sx={{  height: 100,  width: 100, marginLeft: 7,  marginRight: 7, borderRadius: 2, }}  src={barcocde1} /></Grid>
                            <Grid item xs={7}>
                                <Typography style={{color:'#000',fontSize:15, fontWeight:500}}>Mẫu giấy cuộn 1 nhãn  (Khổ giấy in nhãn 50x30mm)  </Typography>
                                <Button  onClick={()=>handleChooseBarCode(12)}  variant="contained" size="small"  color="primary"  style={{marginTop:20}} >
                                    Xem bản in 
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <div style={{ display: "none" }}>
                    <div ref={componentRef}>
                        <ComponentToPrint row={row} quantity={quantity} codeType={codeType} printStoreName={printStoreName} printBatch={printBatch} col={col} batchCode={batchCode}/>
                    </div>
                </div>

            </DialogContent>
            <DialogActions>
            <Button  onClick={onClose}  variant="contained" size="small"  color="secondary" >
                Huỷ 
            </Button>
          
            </DialogActions>    
        </Dialog>
    )
}

export default PrintBarcodePopUp
const ComponentToPrint = ({ row ,quantity,codeType,printStoreName,printBatch,col,batchCode}) => {
    const info = useSelector((state) => state.info);
    const BarCodeModel = ({margin}) =>{
        return (
        // <Box style={{ textAlign:'center', padding:20}}>
        //     {printStoreName.includes("yes") ? <Typography style={{color:'#000',fontSize:15, fontWeight:500}}>{info.store.name}</Typography>:""}
        //     {/* {printBatch.includes("no")?
        //     // <div style={{width:100, heigth:20}}>
        //         <Barcode value={codeType ==="code" ?row.product_code:row.bar_code }   width='1px' 
        //         height='10px' />
        //     //  </div>
        //     : <Barcode value={codeType ==="code" ?row.product_code.concat("_"+ batchCode):row.bar_code.concat("_"+ batchCode) } 
        //     // format="CODE128" 
        //     // className="ss" 
        //     // displayValue={false} 
        //     width='1px' 
        //     height='10px'
            
        //     />} */}
          

              
        // </Box>
        <Grid container item xs={col} style={{marginBottom:margin}} >
             {printBatch.includes("no")?
             <div>
                  <div style={{width:102, textAlign:'center'}}>
              <Typography style={{color:'#000', fontSize:8, marginBottom:3}}>{row.product_code}</Typography> 
              </div>
              <Barcode 
                value={codeType ==="code" ?row.product_code:row.bar_code }
                format="CODE128" 
                // className="ss" 
                displayValue={false} 
                fontSize="10px"
                width='1px' 
                height='30px'
                margin="0px"
                padding="0px"

                />
                <div style={{width:102, textAlign:'center', marginTop:3}}>
                <Typography style={{color:'#000', fontSize:8, }}>{row.name}</Typography> 
                 <Typography style={{color:'#000', fontSize:8,}}>{row.list_price?.toLocaleString()} VNĐ</Typography> 
                 
                </div>
                
             </div>:
             <div>
             <div style={{width:150, textAlign:'center'}}>
         <Typography style={{color:'#000', fontSize:8, marginBottom:3}}>{row.product_code.concat("_"+ batchCode)}</Typography> 
         </div>
         <Barcode 
            value={row.product_code.concat("_"+ batchCode)}
           format="CODE128" 
           // className="ss" 
           displayValue={false} 
           fontSize="10px"
        //    width={0.7} 
        width='1px' 
           height='30px'
           margin="0px"
           padding="0px"

           />
           <div style={{width:150, textAlign:'center', marginTop:3}}>
           <Typography style={{color:'#000', fontSize:8, }}>{row.name}</Typography> 
            <Typography style={{color:'#000', fontSize:8,}}>{row.list_price?.toLocaleString()} VNĐ</Typography> 
            
           </div>
           
        </div>
    }
             </Grid>
        )
    }
    function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
      }
      console.log(" range(1,Number(quantity))", range(1,Number(quantity)))

    return (
        // <Grid container>
        //     {range(1,Number(quantity)).map(()=> {
        //         return(
        //             <Grid container item xs={col} justifyContent="center">
        //                 <BarCodeModel />
        //             </Grid>    
        //         )
        //     })}

        // </Grid>
        
       <div style={{paddingTop:30,paddingLeft:20}}>
           <Grid container >
             <BarCodeModel  margin={65} />
             <BarCodeModel  margin={65}/>
             <BarCodeModel  margin={0}/>
             </Grid>
       </div>
    );
  };
  