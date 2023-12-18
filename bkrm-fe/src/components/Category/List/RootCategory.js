import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CategoryIcon from "@material-ui/icons/Category";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { useSelector } from "react-redux";
import productApi from "../../../api/productApi";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { Box, Button, Typography } from "@material-ui/core";
import zIndex from "@material-ui/core/styles/zIndex";
import Tooltip from '@material-ui/core/Tooltip';
import UpdateCategory from "./UpdateCategory";

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(2),
  },
}));

export default function RootCategory(props) {
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const [subCategories, setSubCategories] = useState([]);
  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const categories = await productApi.getSubCategory(
          store_uuid,
          props.category.uuid
        );
        setSubCategories(categories.data);
      } catch (error) {
        console.log(error);
      }
    };
    if(!props.useNestedApi){
      fetchCategoryList();
    }else{
      setSubCategories()
    }
  }, [store_uuid, props.category.uuid, props.reset]);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
    handleClose()
  };
  const [update, setUpdate] = useState(false)
  const handleOpenEdit = () => setUpdate(true)
  const handleClose = () => setUpdate(false)
  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={props.fromRoot ? classes.root : classes.nested}
    >
      <UpdateCategory onReset={props.onReset} open={update} handleClose={handleClose} category={props.category}/>
      <ListItem >
        <ListItemText
          primary={
            <Tooltip  title="Cập nhật">
              <Button style={{display:"flex",flexDirection:"row",justifyContent:"flex-start", textDecoration:"none",textTransform:"none"}} fullWidth onClick={handleOpenEdit}>
                <ListItemIcon>
                  <CategoryIcon/>
                </ListItemIcon>
                {props.category.name}
              </Button>
            </Tooltip>
          }
        />
        {props.category.children.length === 0 ? null : open ? (
          <IconButton size="small" onClick={handleClick} >
            {" "}
            <ExpandLess />{" "}
          </IconButton>
        ) : (
          <IconButton size="small" onClick={handleClick} >
            {" "}
            <ExpandMore button />{" "}
          </IconButton>
        )}
      </ListItem>
      <Collapse in={open} unmountOnExit>
        {subCategories.map((category) => (
          <RootCategory key={category.uuid} category={category} onReset={props.onReset} reset={props.reset}/>
        ))}
      </Collapse>
    </List>
  );
}
