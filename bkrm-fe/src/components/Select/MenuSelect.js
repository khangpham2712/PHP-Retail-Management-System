import React, { useState } from 'react';
import { Tree } from 'antd';
// import {salesModule,inventoryModule,hrModule,reportModule} from "../MenuList/MenuList"
import {salesModule,inventoryModule,hrModule,reportModule}from "../MenuList/MenuList"
import { useTheme } from "@material-ui/core/styles";
import { grey} from '@material-ui/core/colors'

import setting from "../../assets/constant/setting"
import { useDispatch,useSelector } from "react-redux";
import * as _ from 'lodash'

const MenuSelect = ({handleShowMenu,showMenu}) => {
  const theme = useTheme();
  // var {salesModule,inventoryModule,hrModule,reportModule} = modules


  const info = useSelector((state) => state.info);
  const store_setting = info.store.general_configuration? JSON.parse(info.store.general_configuration): setting
  const permissions = info.user.permissions
  console.log('permissions',permissions)

  let tree = [salesModule,inventoryModule,hrModule,reportModule]
  
  permissions.map((item)=>{
      if(item.name.includes('sales')){return}
      else{tree.filter(i =>  i.key !== 'salesModule')}
      if(item.name.includes('inventory')){return}
      else{tree.filter(i =>  i.key !== 'inventoryModule')}
      if(item.name.includes('employee')){return}
      else{tree.filter(i =>  i.key !== 'hrModule')}
      if(item.name.includes('report')){return}
      else{tree.filter(i =>  i.key !== 'reportModule')}
  })
  const treeData = _.cloneDeep(tree)

  const report = treeData.find(item => item.key==='reportModule')
  const sales = treeData.find(item => item.key==='salesModule')
  const inventory = treeData.find(item => item.key==='inventoryModule')
  console.log('report[0]',report)
  if(!store_setting.discount.status&& report ){
    report.children[3].children=report.children[3].children.filter(item => item.id !== 19.2)
  }
  if(!store_setting.voucher.status&& report){
    report.children[3].children=report.children[3].children.filter(item => item.id !== 19.3)
  }
  if(!store_setting.email.status && report){
    report.children[3].children=report.children[3].children.filter(item => item.id !== 19.4)
  }
  if(!store_setting.inventory.status && inventory){
    inventory.children = inventory.children.filter(item => ![4,6,7,11].includes(item.id) )
  }
  if (!info.store?.web_configuration && sales){
    sales.children = sales.children.filter(item => item.id  !== 22 )
  }


  const [checkedKeys, setCheckedKeys] = useState(showMenu);

  const onCheck = (checkedKeysValue) => {
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
    handleShowMenu(checkedKeysValue)
  };

  return (
    <Tree
    style={{backgroundColor:theme.customization.mode === "Light"? '#fff': '#2d2d2d', color:theme.customization.mode === "Light"? null: '#fff'}}
      showIcon
      checkable
      defaultExpandAll
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      // onSelect={onSelect}
      // selectedKeys={selectedKeys}
      // treeData={[salesModule,inventoryModule,hrModule,reportModule]}
      treeData={treeData}
    />
  );
};

export default MenuSelect


  // const [selectedKeys, setSelectedKeys] = useState([]);
  // const [autoExpandParent, setAutoExpandParent] = useState(true);

  // const onSelect = (selectedKeysValue, info) => {
  //   console.log('onSelect', info);
  //   setSelectedKeys(selectedKeysValue);
  // };
