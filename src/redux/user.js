import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUser } from "@/services/user";

export const userSlice = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    initUser(_, action) {
      return action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchUser.fulfilled, (_, action) => {
      return action.payload;
    });
  },
});

export const fetchUser = createAsyncThunk("user/featchUser", async (params) => {
  const response = await getUser(params);
  return response.data;
});

export const { initUser } = userSlice.actions;

export default userSlice.reducer;
