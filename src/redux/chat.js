import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getChatList } from "@/services/chat";

export const chatSlice = createSlice({
  name: "chat",
  initialState: [],
  reducers: {
    initChatList(_, action) {
      return action.payload;
    },
    addChat(state, action) {
      state.push(action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchChat.fulfilled, (_, action) => {
      return action.payload;
    });
  },
});

export const fetchChat = createAsyncThunk("chat/fetchChat", async () => {
  const response = await getChatList();
  return response.data || [];
});

export const { initChatList, addChat } = chatSlice.actions;

export default chatSlice.reducer;
