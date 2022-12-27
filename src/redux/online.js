import { createSlice } from "@reduxjs/toolkit";

export const onlineSlice = createSlice({
  name: "online",
  initialState: [],
  reducers: {
    initOnlineList(_, action) {
      return action.payload;
    },
  },
});

export const { initOnlineList } = onlineSlice.actions;

export default onlineSlice.reducer;
