import React, { useEffect, useState } from "react";
import RootCategory from "./List/RootCategory";
import productApi from "../../api/productApi";
import { useSelector } from "react-redux";
import { Box } from "@material-ui/core";

const CategoryTree = (props) => {
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const [parentCategories, setParentCategories] = useState([]);
  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const categories = await productApi.getParentCategory(store_uuid);
        setParentCategories(categories.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategoryList();
  }, [store_uuid,props.reset]);
  return (
    <Box {...props}>
      {parentCategories.map((category) => (
        <RootCategory key={category.uuid} category={category} reset={props.reset} onReset={props.onReset} fromRoot={true}/>
      ))}
    </Box>
  );
};

export default CategoryTree;
