import request from "./index";

//获取作品列表
export function getWorks() {
  return request({
    url: "/works/list",
    method: "get",
  });
}

//创建作品
export function createWork(data) {
  return request({
    url: "/works/create",
    method: "post",
    data,
  });
}

//删除作品
export function deleteWorks(data) {
  return request({
    url: "/works/delete",
    method: "post",
    data,
  });
}
