import axios from "axios";
import queryString from "query-string";
import store from "../store/index";
import { authActions } from "../store/slice/authSlice"
import { statusAction } from "../store/slice/statusSlice"
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "content-type": "application/json",
    Accept: "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});
axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    config.headers.authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.status == "401"  ) {
      if (!(document.URL.includes("/login") || document.URL.includes("/signup") )) {
        console.log(!document.URL.includes("/login"))
        store.dispatch(authActions.logOut())
        store.dispatch(statusAction.failedStatus("Hết phiên đăng nhập"))
      }
    }
    throw error
  }
);
export default axiosClient;
