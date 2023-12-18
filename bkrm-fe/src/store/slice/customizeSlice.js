import colors from "../../assets/scss/_themes-vars.module.scss";
import { pink, blue, grey } from "@material-ui/core/colors";
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  fontFamily: `'Roboto', sans-serif`,
  borderRadius: 12,
  mode: "Light",
  menu:"1",
  themeBackground: colors.paper,
  themeText: colors.grey900,
  themeGreyText: colors.grey700,
  primaryColor: blue,
  secondaryColor: pink,
  colorLevel: 50,
  isSidebarOpen: null,
  itemMenuOpen:  localStorage.getItem("BKRMopening") ? localStorage.getItem("BKRMopening"):-1 ,
  showMenu:['salesModule','inventoryModule','hrModule','reportModule']

};

const customizeSlice = createSlice({
  name: "customize",
  initialState: initialState,
  reducers: {
    setFontFamily(state, action) {
      state.fontFamily = action.payload;
    },
    setMenu(state, action) {
      state.menu = action.payload;
    },
    setShowMenu(state, action) {
      state.showMenu = action.payload;
    },
    setBorderRadius(state, action) {
      state.borderRadius = action.payload;
    },
    setMode(state, action) {
      if (action.payload === "Light") {
        state.mode = action.payload;
        state.themeBackground = colors.paper;
        state.themeText = colors.grey900;
        state.themeGreyText = colors.grey700;
        state.primaryColor = blue;
        state.colorLevel = 50;
      } else {
        state.mode = action.payload;
        state.themeBackground = colors.grey800;
        state.themeText = colors.grey50;
        state.themeGreyText = colors.grey50;
        state.primaryColor = grey;
        state.colorLevel = 700;
      }
    },
    setPrimaryColor(state, action) {
      state.primaryColor = action.payload;
    },
    setSecondaryColor(state, action) {
      state.secondaryColor = action.payload;
    },
    setColorLevel(state, action) {
      if (action.payload === 0) {
        state.colorLevel = 50;
      } else {
        state.colorLevel = action.payload;
      }
    },
    setState(state, action) {
      state = action.payload;
    },
    setSidebarOpen(state, action) {
      state.isSidebarOpen = action.payload;
    },
    setItemMenuOpen(state, action) {
      state.itemMenuOpen = action.payload;
    }
  },
});
export default customizeSlice;
export const customizeAction = customizeSlice.actions;
