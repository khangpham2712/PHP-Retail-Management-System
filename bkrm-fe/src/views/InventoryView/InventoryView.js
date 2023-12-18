import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import Import from "./Import/Import";
import Inventory from "./Inventory/Inventory";
import InventoryOrder from "./InventoryOrder/InventoryOrder";
import InventoryReturnOrder from "./InventoryReturnOrder/InventoryReturnOrder";
import OrderProduct from "./OrderProduct/OrderProduct";
import OrderProductList from "./OrderProductList/OrderProductList";
import Check from "./Check/Check";
import CheckHistory from "./CheckHistory/CheckHistory";
import Supplier from "./Supplier/Supplier";
import PageNotFound from "../../pages/PageNotFound/PageNotFound";

import React from "react";
import { useSelector } from "react-redux";
import TransferInventory from "./TransferInventory/TransferInventory";
import Transfer from "./Import/Transfer";
import TransferDetail from "./Import/TransferDetail";

const InventoryView = (props) => {
  const { path } = useRouteMatch();
  const permissions = useSelector((state) => state.info.user.permissions);
  console.log();
  return (
    <Switch>
      <Route exact path={path}>
        <Redirect
          to={
            permissions?.find((p) => p.name === "inventory")
              ? `${path}/import`
              : "/home"
          }
        />
      </Route>
      <Route exact path={`${path}/import`} component={Import} />
      <Route exact path={`${path}/transfer`} component={Transfer} />
      <Route
        exact
        path={`${path}/transfer-detail`}
        component={TransferDetail}
      />
      <Route path={`${path}/inventory`} component={Inventory} />
      <Route path={`${path}/receipt`} component={InventoryOrder} />
      <Route path={`${path}/returns`} component={InventoryReturnOrder} />

      <Route
        path={`${path}/transfer-inventory`}
        component={TransferInventory}
      />
      {/* <Route path={`${path}/order-list/order`}  component={OrderProduct}/>   
          <Route path={`${path}/order-list`}  component={OrderProductList}/>     */}
      <Route path={`${path}/check-history/check`} component={Check} />
      <Route path={`${path}/check-history`} component={CheckHistory} />
      <Route path={`${path}/supplier`} component={Supplier} />
      <Route exact path={`${path}/*`} component={PageNotFound} />
    </Switch>
  );
};

export default InventoryView;
