import React, {useEffect} from 'react'
import { useTheme, makeStyles, styled } from "@material-ui/core/styles";

import {Button, Grid, TextField,FormControl,TableRow,TableCell,Divider,TableBody, Select,MenuItem, Typography} from "@material-ui/core";
import clsx from "clsx"
import {ThousandFormat, ThousandSeperatedInput} from '../../../../components/TextField/NumberFormatCustom'
import TableWrapper from '../../../../components/TableCommon/TableWrapper/TableWrapper'
import TableHeader  from '../../../../components/TableCommon/TableHeader/TableHeader'
import DeleteForeverTwoToneIcon from '@material-ui/icons/DeleteForeverTwoTone';

const useStyles = makeStyles((theme) => ({
    formControl: {
        marginRight: 10,
        minWidth: 220,
    },
    row: {
        margin: "15px 20px 10px 20px",
    }

}));

const RelaltedItemList = ({relatedList, setRelatedList , list_price,standard_price,isManageInventory}) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    // {name:e,product_code:"", bar_code: "",standard_price:0, unit_price :0, attribute_values}





    const handleDelete = (index)=> {
        var newArr = [...relatedList];
        newArr = newArr.filter(row => row.name !== index)
        setRelatedList(newArr)
    }

    const handleChangeProperties = (index, property, newValue) => {
        const newArr = relatedList.map(row => {
            if (row.name === index) {
                const newRow = {...row}
                newRow[property] = newValue;
                return newRow;
            } else {
                return row
            }
        })
        setRelatedList(newArr);
    }

    return (
        <div>
           <TableWrapper isCart={true}>
                <TableHeader
                    classes={classes}
                    headerData={isManageInventory? CustomerHeadCells :CustomerHeadCells.filter(i => i.id !== "quantity")
                    }
                />
                <TableBody>
                {relatedList.map((row, index) => {
                    return (

                      <TableRow>
                        <TableCell align="center" style={{color:'#000', fontWeight:500}}>{row.name}</TableCell>
                        {/* <TableCell align="center">
                          <TextField
                            value={row.product_code}
                            onChange={(e) =>
                              handleChangeProperties(
                                row.name,
                                "product_code",
                                e.target.value
                              )
                            }
                          />
                        </TableCell> */}
                        <TableCell align="center">
                          <TextField
                            value={row.bar_code}
                            onChange={(e) =>
                              handleChangeProperties(
                                row.name,
                                "bar_code",
                                e.target.value
                              )
                            }
                          />
                          
                        </TableCell>
                       {isManageInventory?
                        <TableCell align="center">
                          <ThousandSeperatedInput
                            value={row.quantity}
                            onChange={(e) =>{
                              handleChangeProperties(
                                row.name,
                                "quantity",
                                Math.abs(e.target.value)
                              )}
                            }
                          />
                        </TableCell>:null}

                        <TableCell align="center">
                          <ThousandSeperatedInput
                            value={row.standard_price}
                            onChange={(e) =>{
                              handleChangeProperties(
                                row.name,
                                "standard_price",
                                Math.abs(e.target.value)
                              )}
                            }
                          />
                        </TableCell>
                        <TableCell align="center">
                          <ThousandSeperatedInput
                            value={row.list_price}
                            onChange={(e) => {
                                handleChangeProperties(
                                  row.name,
                                  "list_price",
                                  Math.abs( e.target.value)
                                )
                            }
                            }
                          />
                        </TableCell>
                        <TableCell align="center">
                          <DeleteForeverTwoToneIcon
                            onClick={() => handleDelete(row.name)}
                          />
                        </TableCell>
                      </TableRow>

                    );
                })}
                </TableBody>
            </TableWrapper>
            
          
        </div>
        
    )
}

export default RelaltedItemList


const CustomerHeadCells = [
    { id: 'name', align: 'center', disablePadding: true, label: 'Tên' },
    // { id: 'product_code', align: 'center', disablePadding: true, label: 'Mã hàng' }, 
    { id: 'bar_code', align: 'center', disablePadding: true, label: 'Mã vạch' }, 
    { id: 'quantity', align: 'center', disablePadding: true, label: 'Tồn kho ban đầu' },  
    { id: 'standard_price', align: 'center', disablePadding: true, label: 'Giá vốn' },
    { id: 'unit_price', align: 'center', disablePadding: true, label: 'Giá bán' },
    { id: 'action', align: 'center', disablePadding: true, label: '' },
];
