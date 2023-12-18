import { createSlice } from "@reduxjs/toolkit";
const initialUserInfoSlice = {
  user: {
    user_name: "",
    name: "",
    email: "",
    email_verified_at: null,
    phone: "",
    date_of_birth: "",
    status: "",
    gender: null,
    uuid: "",
    created_at: "",
    updated_at: "",
    permissions: [],
  },
  store: {
    uuid: "",
    name: "",
    address: "",
    ward: "",
    province: "",
    phone: "",
    status: "",
    image: "",
    created_at: "",
    updated_at: "",
    district: "",
    general_configuration: null,
    store_configuration:
      '{"facebook":null,"instagram":null,"custom_web":null,"img_url":null}',
  },
  branch: {
    uuid: "",
    name: "",
    id: "",
  },
  branches: [],
  role: "",
  products: [],
  searchBarState: "search",
  // branchsOfStore:[]
};
const infoSlice = createSlice({
  name: "info",
  initialState: initialUserInfoSlice,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setStore(state, action) {
      state.store = action.payload;
    },
    setRole(state, action) {
      state.role = action.payload;
    },
    setBranch(state, action) {
      state.branch = action.payload;
    },
    setBranches(state, action) {
      state.branches = action.payload;
      state.branch = action.payload[0] || {
        uuid: "",
        name: "",
        id: "",
      };
    },
    setProducts(state, action) {
      state.products = action.payload;
    },
    setSearchBarState(state, action) {
      state.searchBarState = action.payload;
    },
    // setBranchsOfStore(state, action) {
    //   state.branchsOfStore = action.payload;
    // },
  },
});
export default infoSlice;
export const infoActions = infoSlice.actions;
