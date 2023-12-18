import themes from "./theme";
import React, { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Route,
  Switch,
  Redirect,
  HashRouter,
} from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
// import HomePage from "./pages/HomePage/HomePage";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
// import LoginPage from "./pages/LoginPage/LoginPage";
// import SignupPage from "./pages/SignupPage/SignupPage";
import { verifyToken } from "./store/actionCreator";
import { useEffect, useState } from "react";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import LoadingModal from "./components/LoadingModal/LoadingModal";
// import MainPage from "./pages/MainPage/MainPage";
// import CustomerPage from "./pages/CustomerPage/CustomerPage";
import { Box, CssBaseline } from "@material-ui/core";
import GlobalSnackbar from "./components/GlobalSnackBar/GlobalSnackBar";
import Test from "./components/Category/Test";
import "./index.css";
import { useParams } from "react-router-dom";
const HomePage = React.lazy(() => import("./pages/HomePage/HomePage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage/LoginPage"));
const SignupPage = React.lazy(() => import("./pages/SignupPage/SignupPage"));
const CustomerPage = React.lazy(() => import("./pages/CustomerPage/CustomerPage"));
const MainPage = React.lazy(() => import("./pages/MainPage/MainPage"));

function App() {
  const customization = useSelector((state) => state.customize);
  const store_uuid = useSelector((state) => state.info.store.uuid);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const [path, setPath] = useState("/home");


  useEffect(() => {
    dispatch(verifyToken());
    setPath(sessionStorage.getItem("BKRMprev"));
    // dispatch(loadBranches(store_uuid));

  }, [dispatch]);
  // useEffect(() => {
  //   dispatch(loadBranches(store_uuid));
  // })
  return (
    <ThemeProvider theme={themes(customization)}>
      <Suspense fallback={<LoadingModal />}>

      <Box>
        <LoadingModal />
        <GlobalSnackbar />
        <CssBaseline />
        <HashRouter>
          <Switch>
            {/* Fix lại route */}
            {/* <Route path="/" exact>
              <Redirect to="/home" />
            </Route>{" "} */}
            <PrivateRoute path="/home">
              <HomePage />
            </PrivateRoute>
            {/* <Route path="/login" exact>
              {isLoggedIn ? <Redirect to={path} /> : <LoginPage />}
            </Route>
            <Route path="/signup" exact>
              {isLoggedIn ? <Redirect to={path} /> : <SignupPage />}
            </Route> */}
             <Route path="/login" exact>
              {isLoggedIn ? <Redirect to={"/home"} /> : <LoginPage />}
            </Route>
            <Route path="/signup" exact>
              {isLoggedIn ? <Redirect to={"/home"} /> : <SignupPage />}
            </Route>
            <Route path="/" > 
              <MainPage />
            </Route>
            <Route path="/store">
              <Switch>
                <Route path={"/store/:storeWebPage"}>
                  <CustomerPage />
                </Route>
              </Switch>
            </Route>
            <Route path="/test" component={Test} />
            <Route path="*" component={PageNotFound} />
          </Switch>
        </HashRouter>
        {/* <Customization /> */}
      </Box>
      </Suspense>
    </ThemeProvider>
  );
}
export default App;
