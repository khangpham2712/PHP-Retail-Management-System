import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Redirect, useLocation } from "react-router-dom";
const PrivateRoute = ({ children, ...rest }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const location = useLocation()
  if(isLoggedIn){
    sessionStorage.setItem("BKRMprev",location.pathname)
  }
  return (
    <Route
      {...rest}
      render={() =>
        isLoggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
            }}
          />
        )
      }
    />
  );
};
export default PrivateRoute;
