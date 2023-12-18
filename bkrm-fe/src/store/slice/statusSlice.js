import { createSlice } from "@reduxjs/toolkit";
const initialStatusSlice = { status: null, message: "", open: false };
const statusSlice = createSlice({
  name: "loading",
  initialState: initialStatusSlice,
  reducers: {
    successfulStatus(state, action) {
      state.status = true;
      state.message = action.payload;
      state.open = true;
    },
    failedStatus(state, action) {
      state.status = false;
      state.message = action.payload;
      state.open = true;
    },
    closeStatus(state) {
      state.open = false;
      state.message = "";
      state.status = null;
    },
  },
});
export default statusSlice;
export const statusAction = statusSlice.actions;
