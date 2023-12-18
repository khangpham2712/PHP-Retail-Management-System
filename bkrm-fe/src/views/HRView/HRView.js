import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import Employee from './Employee/Employee';
import Schedule from './Schedule/Schedule'

import React from "react";
import { useSelector } from "react-redux";

const HRView = (props) => {
  const { path } = useRouteMatch();
  const permissions = useSelector((state) => state.info.user.permissions);
  return (
      <Switch>
        <Route exact path={path} >
          <Redirect to={permissions?.find((p) => p.name === "employee") ? `${path}/employee` : "/home"}/>
        </Route>
        <Route exact path={`${path}/employee`} component={Employee} />
        <Route path={`${path}/schedule`} component={Schedule} />
      </Switch>

  );
};

export default HRView;
