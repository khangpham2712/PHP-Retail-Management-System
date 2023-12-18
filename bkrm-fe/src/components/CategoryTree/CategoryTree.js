import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {TreeView} from '@material-ui/lab';
import {Typography,MenuItem} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';


const useStyles = makeStyles({
  root: {
    height: 110,
    flexGrow: 1,
    maxWidth: 400,
  },
});

export default function CategoryTree() {
  const classes = useStyles();

  const renderTree = (nodes) => (
    // <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
    //   {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    // </TreeItem>
    // <MenuItem>
        <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
           {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
        </TreeItem>

    
  );

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {data.map((nodes)=> renderTree(nodes))}
    </TreeView>
  );
}



const data = [
    {
        id: 'root',
        name: 'Quần áo',
        children: [
          {
            id: '1',
            name: 'Con trai',
          },
          {
            id: '3',
            name: 'Con gái',
            children: [
              {
                id: '4',
                name: 'Đầm',
              },
              {
                id: '5',
                name: 'Váy',
              },
            ],
          },
        ],
    },
    {
        id: 'root3',
        name: 'Bánh keọ',
        children: [
          {
            id: '1',
            name: 'Bánh',
          },
          {
            id: '3',
            name: 'Kẹo',
            children: [
              {
                id: '4',
                name: 'Sigum',
              },
              {
                id: '5',
                name: 'Sigum',
              },
              {
                id: '6',
                name: 'Sigum',
              },
              {
                id: '7',
                name: 'Sigum',
              },
            ],
          },
        ],
    },

];