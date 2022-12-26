import request from "./index";

//获取作品列表
export function getMessages(params) {
  return request({
    url: "/message/list",
    method: "get",
    params,
  });
}

//创建作品
export function createMessage(data) {
  return request({
    url: "/message/create",
    method: "post",
    data,
  });
}

//删除作品
export function deleteMessage(data) {
  return request({
    url: "/message/delete",
    method: "post",
    data,
  });
}
