import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { initOnlineList } from "./online";
import { notification, Avatar } from "antd";
import { addChat, fetchChat } from "./chat";
import { replaceImg } from "@/utils/utils";

export const websocketSlice = createSlice({
  name: "websocket",
  initialState: null,
  extraReducers(builder) {
    builder.addCase(initWebsocket.fulfilled, (_, action) => {
      return action.payload;
    });
  },
});

export const initWebsocket = createAsyncThunk(
  "websocket/initWebsocket",
  async (user, { dispatch }) => {
    const websocket = new WebSocket(`ws://${window.location.hostname}:8081`);
    //建立连接时触发
    websocket.onopen = function () {
      const data = {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
      };
      //当用户第一次建立websocket连接时，发送用户信息到后台，告诉它是谁建立的连接
      websocket.send(JSON.stringify(data));
    };
    //监听服务端的消息事件
    websocket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      //在线人数变化的消息
      if (data.type === 0) {
        dispatch(initOnlineList(data.msg.onlineList));
        data.msg.text &&
          notification.info({
            message: "提示",
            description: data.msg.text,
          });
      }
      //聊天的信息
      if (data.type === 1) {
        dispatch(addChat(data.msg));
        notification.open({
          message: data.msg.username,
          description: (
            <div
              style={{ wordBreak: "break-all" }}
              dangerouslySetInnerHTML={{ __html: replaceImg(data.msg.content) }}
            />
          ),
          icon: <Avatar src={data.msg.userAvatar} />,
        });
      }
      console.log(11, data);
    };
    dispatch(fetchChat());
    return websocket;
  }
);
export default websocketSlice.reducer;
