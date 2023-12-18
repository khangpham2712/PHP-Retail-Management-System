import React ,{useEffect,useState}from 'react'
import {Typography,Divider,Card,Grid,Paper,InputAdornment,Box,TextField,Button,InputLabel,MenuItem,FormControl,Select,ListItem,ListItemIcon,ListItemText} from '@material-ui/core';

import { TreeSelect,Tree } from 'antd';
import productApi from "../../api/productApi";
import { useSelector } from 'react-redux'

const CategorySelect = ({data,saveData,setData, isNotSelect,setOpenFilter}) => {
    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branch_uuid = info.branch.uuid;
    const branches = info.store.branches 
    const [categoryId, setCategoryId] = useState('all');

    const [categoryList, setCategoryList] = useState([]);
    const [allProduct, setAllProduct] =  useState([]);
    // useEffect(()=>{
    //   if ( window.localStorage.getItem("products")) {
    //     const products = JSON.parse(window.localStorage.getItem("products"));
    //     if (products.store_uuid === store_uuid && products.branch_uuid === branch_uuid ) {
    //       setAllProduct(products.data);
    //     }
    //   }
    // },[])


    const recursiveSearchTree = (category) => {
        const findedCategory=category.find(e => e.uuid === categoryId);
        if(findedCategory){return findedCategory}
        for(let i = 0; i< category.length ; i++){
          if(category[i].children.length > 0){return recursiveSearchTree(category[i].children)}
        } 
      };
      const getAllChild  =(cat) => {
        if(!cat){return}
        if(cat.children.length === 0){return cat.uuid}
        return cat.children.map((child)=>{
          return getAllChild(child)
        })
      }
      const filterCategory = () =>{
        if(categoryId === 'all') {
          setData(saveData)
            // setData(allProduct)
        }else{
          let cat =  recursiveSearchTree(categoryList)
          let allChild = cat?.children?.length !== 0? getAllChild(cat) : []
          allChild =  [].concat.apply([], allChild)
          let allCat =  allChild ?[... allChild, cat?.uuid]: allChild
         //   setData(saveData.filter(data =>  allCat?.includes(data.category_uuid ) ))
        //  let newAllProduct = [...allProduct]
        //  newAllProduct = newAllProduct.filter(data =>  allCat?.includes(isNotSelect?data.category.uuid:data.category_uuid ))
        // setData(newAllProduct)
        // var newProductData = [...allProduct]
        // newProductData = setData.filter(data  =>  allCat?.includes(isNotSelect?data.category?.uuid:data.category_uuid ))
        setData(saveData.filter(data  =>  allCat?.includes(isNotSelect?data.category?.uuid:data.category_uuid )))

        }
      }
    
    const fetchAllCategory = async () => {
        try {
            const response = await productApi.getNestedCategory(store_uuid);
            setCategoryList(response.data);
        } catch (error) { }
    };

    useEffect(()=>{
        if (store_uuid && branch_uuid &&saveData) {fetchAllCategory()}
        },[])

    useEffect(()=>{
        if(categoryList&& data &&saveData.length !==0) {
            filterCategory()
            // if(isNotSelect && categoryId) {setOpenFilter(false)}
        }
        
        },[categoryId])

    const [selectedNodeUuid,setSelectedNodeUuid] = useState(null)
    const onSelect = (selectedKeys, info) => {
        if(info.node.uuid){
            setCategoryId(info.node.uuid)
        }else{
            setCategoryId('all')
        }
        // setCategoryId(info.node.uuid)
        setOpenFilter(false)
    };
    console.log("selectedNodeUuid",selectedNodeUuid)

 if(isNotSelect){
     return (
         <>
        <Tree
        // showLine={true}
        // showIcon={true}
        // defaultExpandedKeys={['0-0-0']}
        // onSelect={(selectedKeys, info)=>console.log(info.node.uuid)}
        onSelect={onSelect}
        // onChange={(val)=>setCategoryId(val )}
        treeData={[{ title:'Tất cả danh mục',value:'all'},...categoryList]}
      /> 
      {/* <Button variant="contained"  onClick={()=>{setCategoryId(selectedNodeUuid);}}fullWidth color="primary"  style={{ marginTop: 40 }} > Chọn</Button> */}

      </>
     )
 }       
  return (
    <TreeSelect
        style={{ width: 220}}   
        dropdownStyle={{ maxHeight: 400, overflow: 'auto',zIndex:100000000  }}
        treeData={[{ title:'Tất cả danh mục',value:'all'},...categoryList]}
        value={categoryId}
        onChange={(val)=>setCategoryId(val )}
        treeDefaultExpandAll
        placeholder="Danh mục"
        
    />
  )
}

export default CategorySelect