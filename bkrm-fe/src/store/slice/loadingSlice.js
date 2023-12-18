import { createSlice } from "@reduxjs/toolkit";

const initialLoadingState = { isLoading: false };
const loadingSlice = createSlice({
  name: "loading",
  initialState: initialLoadingState,
  reducers: {
    startLoad(state) {
      state.isLoading = true;
    },
    finishLoad(state) {
      state.isLoading = false;
    },
  },
});

export default loadingSlice;
export const loadingActions = loadingSlice.actions;
