import React, { useEffect, useState } from 'react'
import TagsInput from "../../../../components/TextField/TagsInput"
import { useTheme, makeStyles, styled } from "@material-ui/core/styles";

import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import SimpleModal from "../../../../components/Modal/ModalWrapper";

import ModalWrapperWithClose from "../../../../components/Modal/ModalWrapperWithClose";

import DeleteForeverTwoToneIcon from '@material-ui/icons/DeleteForeverTwoTone';
import AddIcon from '@material-ui/icons/Add';
import {Button,TextField, Grid, FormControl, Select,MenuItem,Typography, ListItem} from "@material-ui/core";
import RemoveIcon from '@material-ui/icons/Remove';
const useStyles = makeStyles((theme) => ({
    formControl: {
        marginRight: 10,
        minWidth: 220,
    },
    row: {
        margin: "15px 20px 10px 20px",
    }

}));



const AddAttribute = ({ attributeList, datas, setDatas, setRelatedList, list_price, standard_price }) => {

    const theme = useTheme();
    const classes = useStyles(theme);


    function generateList   ()  {
        let newArr = [...datas];

        var mySet  = [];
        for (let i = 0; i < newArr.length ; i++){
            if(mySet.length === 0 ){
                mySet= newArr[i].items
              
            }
            else{
                var _set = [];
                for (let j = 0; j < mySet.length ; j++ ){
                    for (let k = 0; k < newArr[i].items.length ; k++ ){
                        _set.push(mySet[j].concat( ` -  `,newArr[i].items[k]))
                        // _set.push({name:mySet[j].concat( ' - ',newArr[i].items[k]), attList:[]})

                    }
                }
                if(_set.length !== 0) {mySet = _set}

            }
         }
        return mySet
      }

      useEffect (() =>{
        var list = []
        // generateList().map(e =>list.push({name:e,product_code:"", bar_code: "",standard_price:0, list_price :0}))
        // generateList().map(e =>list.push({name:e,product_code:"", bar_code: "",standard_price:standard_price?standard_price:0, list_price :list_price?list_price:0}))
        generateList().map(e =>list.push({name:e,product_code:"",quantity:0, bar_code: "",standard_price:standard_price?standard_price:0, list_price :list_price?list_price:0}))

        setRelatedList(list)
    

      },[datas])

    const updateFieldChanged = (index, attr) => {
        let newArr = [...datas];
        newArr[index].key = attr;
        setDatas(newArr);

    }
    const updateValueChanged = (index,value)=>{
        let newArr = [...datas];
        newArr[index].items = value;
        setDatas(newArr);
        // var list = []
        // generateList().map(e =>list.push({name:e,product_code:"", bar_code: "",standard_price:0, list_price :0}))
        // setRelatedList(list)
    }

    const deleteAttr = (key) => {
        let newArr = [...datas];
        // newArr = newArr.filter(row => row.key !== key)
        newArr = newArr.filter(row => row.id !== key)
        setDatas(newArr);
        // var list = []
        // generateList().map(e =>list.push({name:e,product_code:"", bar_code: "",standard_price:0, list_price :0}))
        // setRelatedList(list)
    }

    const addAttrRow = () => {
        let newArr = [...datas];
        newArr.push({ id:new Date(), key: "unset", items: []})
        setDatas(newArr);
    //     var list = []
    //     generateList().map(e =>list.push({name:e,product_code:"", bar_code: "",standard_price:0, list_price :0}))
    //     setRelatedList(list)
    }

    return (
        <div style={{ marginBottom: 10 }}>
            {datas.map((data, index) => {
                return (
                    <AttributeRow attributeList={attributeList} index={index} data={data} datas={datas} updateFieldChanged={updateFieldChanged} deleteAttr={deleteAttr}  updateValueChanged={updateValueChanged}/>
                )
            })}
            <Button variant="outlined" size="small" color="primary" style={{ marginLeft: 20, marginTop: 10, textTransform: "none" }}
                startIcon={<AddIcon />}
                onClick={() => addAttrRow()}>
                Thêm thuộc tính
            </Button>

            
        </div>
    )
}

export default AddAttribute


const AttributeRow = ({ attributeList, data, datas, updateFieldChanged, index, deleteAttr, setDatas ,updateValueChanged}) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const [inputAttr, setInputAttr] =  useState(false)


    //  popup
  const [openPopupAddAttr, setOpenPopupAddAttr] = useState(false);
  const [isEditPopUp, setIsEditPopUp] = useState(false);


    const [value, setValue] = React.useState([]);


    const handleChangeAttr = (event) => {
        var valid = true;
        datas.map((row)=>{if(row.key === event.target.value){valid = false}    })

        if (valid){
            updateFieldChanged(index, event.target.value)   
        } else{}
    };

    const [selectedItem, setSelectedItem] = React.useState([]);

    function handleSelecetedTags(items) {
        setValue(items);
    }

    useEffect(() => {
        updateValueChanged(index, value)  
    }, [value]);

    return (
        <Grid container className={classes.row} alignItems="center">
            <Grid container item xs={11} alignItems="center" >
               {!inputAttr? <FormControl className={classes.formControl}>
                    <Select value={data.key} onChange={handleChangeAttr}  >
                        <MenuItem value="unset" selected disabled hidden>Chọn thuộc tính...</MenuItem>
                        {attributeList.map((attr) => {
                            return (<MenuItem value={attr.name}>{attr.name}</MenuItem>)
                        })}
                        {/* <MenuItem   hidden>
                            <AddIcon fontSize="small"style={{marginRight:5, marginLeft:-5}}/>
                            <Typography style={{color:"#000", fontSize:12}} onClick={()=>{setOpenPopupAddAttr(true); setIsEditPopUp(false)}}>Tạo thuộc tính mới</Typography>
                        </MenuItem> */}
                    </Select>

                </FormControl>:
                <TextField
                style={{width:230}}
                        value={data.key}
                        onChange={handleChangeAttr}
                />
                                /* <EditTwoToneIcon style={{ marginRight: 60 }}  onClick={()=>{setOpenPopupAddAttr(true); setIsEditPopUp(true)}}/> */
                    }
                {inputAttr === false ?
                <AddIcon style={{ marginRight: 60 }}  onClick={()=>{setInputAttr(true); updateFieldChanged(index, '')    }} />:    
                <RemoveIcon style={{ marginRight: 60 }}  onClick={()=>{setInputAttr(false);updateFieldChanged(index, '')  }} />
                }
                <TagsInput style={{ minWidth: 270 }} selectedTags={handleSelecetedTags} selectedItem={selectedItem} setSelectedItem={setSelectedItem} placeholder="Nhấn giá trị và enter"
                />
            </Grid>

            <Grid container item xs={1} >
                {/* <DeleteForeverTwoToneIcon onClick={() => { deleteAttr(data.key) }} /> */}
                <DeleteForeverTwoToneIcon onClick={() => { deleteAttr(data.id) }} />
            </Grid>

            <ModalWrapperWithClose     
                open={openPopupAddAttr}
                handleClose={() => setOpenPopupAddAttr(false)}
                title={isEditPopUp? "Sửa thuộc tính" :"Thêm thuộc tính"}
            >
                 <Grid container alignItems="center" style={{margin:"20px 10px 30px 10px"}}>
                    <Typography style={{marginRight:40, color:"#000", fontWeight:500}}>Tên thuộc tính:  </Typography> 
                    <TextField />
                 </Grid>
                 {isEditPopUp?
                    //  Edit, Delete
                    // null
                    <div style={{flexGrow: 1,textAlign: "right"}}>
                        <Button size="small" variant="contained" color="secondary">Xoá</Button>
                        <Button size="small" variant="contained" color="primary" style={{marginLeft:10}}>Sửa</Button>
                    </div>
                    :
                    // add
                    <Button style={{flexGrow: 1,textAlign: "center"}} variant="contained" color="primary">Thêm</Button>               
                }       
            </ModalWrapperWithClose>

        </Grid>
    )
}
