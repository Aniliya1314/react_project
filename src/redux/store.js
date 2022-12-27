import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user";
import themeReducer from "./theme";
import websocketReducer from "./websocket";
import chatReducer from "./chat";
import onlineReducer from "./online";
export default configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
    websocket: websocketReducer,
    chat: chatReducer,
    online: onlineReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
});
