import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import Cart from "./Cart/Cart";
import Invoice from "./Invoice/Invoice";
import InvoiceReturn from "./InvoiceReturn/InvoiceReturn";
import OrderProductList from "../InventoryView/OrderProductList/OrderProductList";
import React from "react";
import { useSelector } from "react-redux";

const SalesView = (props) => {
  const { path } = useRouteMatch();
  const permissions = useSelector((state) => state.info.user.permissions);
  return (
    <Switch>
      <Route exact path={path}>
        <Redirect
          to={
            permissions?.find((p) => p.name === "sales")
              ? `${path}/cart`
              : "/home"
          }
        />
      </Route>
      <Route exact path={`${path}/cart`} component={Cart} />
      <Route path={`${path}/invoice`} component={Invoice} />
      <Route path={`${path}/invoice-return`} component={InvoiceReturn} />
      {/* <Route path={`${path}/order-list/order`} component={OrderProduct} /> */}
      <Route path={`${path}/order-list`} component={OrderProductList} />
    </Switch>
  );
};

export default SalesView;
