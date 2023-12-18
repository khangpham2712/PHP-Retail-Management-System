import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ModalWrapper from "../../../../components/Modal/ModalWrapper";
import productApi from "../../../../api/productApi";
import { useSelector, useDispatch } from "react-redux";
import { statusAction } from "../../../../store/slice/statusSlice"
import CategorySelect from "../../../../components/Category/CategorySelect";
import { TreeSelect } from 'antd';


const AddCategory = (props) => {
  const [categoryList, setCategoryList] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState({
    name: "",
    parent_category_uuid: "",
  });
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  
  useEffect(() => {
    const fetchAllCategory = async () => {
      try {
        const response = await productApi.getAllCategory(store_uuid);
        const response_1 = await productApi.getNestedCategory(store_uuid);
        setCategoryList(response_1.data);
      } catch (error) { }
    };
    fetchAllCategory();
  }, [props.reset]);



  const dispatch = useDispatch();
  const handleAddCategory = async () => {
    handleCloseAndReset()
    try {
      const response = await productApi.addCategory(store_uuid, categoryInfo);
      props.onReset()
      dispatch(statusAction.successfulStatus("Tạo danh mục thành công"));


    } catch (error) {
      console.log(error);
      dispatch(statusAction.failedStatus("Tạo danh mục thất bại"));
    }
  };
  const handleCloseAndReset = () => {
    props.handleClose()
    setCategoryInfo({
      name: "",
      parent_category_uuid: "",
    })
  }
  console.log("categoryInfo",categoryInfo)
  return (
    <ModalWrapper {...props}>
      <Typography variant="h4" gutterBottom>
        Thêm danh mục mới
      </Typography>
      <Grid container spacing={2} style={{ marginTop: 10, maxWidth: 300 }}>
        <Grid item xs={12}>
          <TextField
            label="Tên danh mục"
            variant="outlined"
            size="small"
            required
            fullWidth
            onChange={(e) =>
              setCategoryInfo({ ...categoryInfo, name: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12}>
          {/* <FormControl size="small" variant="outlined" fullWidth>
            <InputLabel htmlFor="category">Danh mục cha</InputLabel>
            <Select
              native
              label="Danh mục cha"
              id="category"
              value={categoryInfo.uuid}
              onChange={(e) =>
                setCategoryInfo({
                  ...categoryInfo,
                  parent_category_uuid: e.target.value,
                })
              }
            >
              <option aria-label="None" value="" />
              <CategorySelect categoryList={categoryList}/>
              
            </Select>
          </FormControl> */}
            <TreeSelect
            placeholder="Danh mục cha"
                  id="category"
                  name="category"  
                  style={{ width: '100%'}}   
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto',zIndex:100000000  }}
                  treeData={categoryList}
                  value={categoryInfo.uuid}
                  onChange={(val)=>
                    setCategoryInfo({
                    ...categoryInfo,
                    parent_category_uuid: val,
                  })}
                  treeDefaultExpandAll
                  
                />
        </Grid>
        <Grid
          item
          xs={12}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          {" "}
          <Button
            color="secondary"
            variant="contained"
            style={{ marginRight: 20 }}
            onClick={props.handleClose}
            size="small"
          >
            Hủy
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="small"
            onClick={handleAddCategory}
          >
            Thêm
          </Button>
        </Grid>
      </Grid>
    </ModalWrapper>
  );
};

export default AddCategory;

