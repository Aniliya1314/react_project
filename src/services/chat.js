import request from "./index";

//获取聊天列表
export function getChatList() {
  return request({
    url: "/chat/list",
    method: "get",
  });
}
