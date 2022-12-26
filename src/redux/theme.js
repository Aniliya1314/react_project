import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: { color: localStorage.getItem("theme-color") || "#13c2c2" },
  reducers: {
    changeColor(state, action) {
      state.color = action.payload;
    },
  },
});

export const { changeColor } = themeSlice.actions;

export default themeSlice.reducer;
