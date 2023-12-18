import { createSlice } from "@reduxjs/toolkit";


const initialCustomerPage = {
  // storeInfo: {},
  storeInfo: {},
  products: [],
  order: { name: "", phone: "", address: "", cartItem: [], branch_id: 57},
  categories: [],
};
const customerPageSlice = createSlice({
  name: "customerPage",
  initialState: initialCustomerPage,
  reducers: {
    setProducts(state, action) {
      state.products = action.payload;
    },
    setOrder(state, action) {
      state.order = action.payload;
    },
    setCategories(state, action) {
      state.categories = action.payload;
    },
    setStoreInfo(state, action) {
      state.storeInfo = action.payload;
    },
    
  },
});
export default customerPageSlice;
export const customerPageActions = customerPageSlice.actions;
