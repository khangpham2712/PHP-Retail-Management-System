import { Route, Switch, useRouteMatch } from "react-router-dom";
import DeliveryOrder from './DeliveryOrder/DeliveryOrder';

import React from "react";

const DeliveryView = (props) => {
  const { path } = useRouteMatch();
  return (
      <Switch>
        <Route exact path={path} component={DeliveryOrder}/>  
        <Route exact path={`${path}/delivery`} component={DeliveryOrder} /> 
      </Switch>

  );
};

export default DeliveryView;
