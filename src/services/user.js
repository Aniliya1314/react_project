import request from "./index";

//检查用户名
export function checkName(params) {
  return request({
    url: "/users/checkName",
    method: "get",
    params,
  });
}

//注册用户
export function register(data) {
  return request({
    url: "/users/register",
    method: "post",
    data,
  });
}

//用户登录
export function login(data) {
  return request({
    url: "/users/login",
    method: "post",
    data,
  });
}

//获取用户
export function getUser(params) {
  return request({
    url: "/users/getUser",
    method: "get",
    params,
  });
}

//更新用户
export function updateUser(data) {
  return request({
    url: "/users/update",
    method: "post",
    data,
  });
}

//获取用户列表
export function getUsers(params) {
  return request({
    url: "/users/getUsers",
    method: "get",
    params,
  });
}

//删除用户
export function deleteUser(data) {
  return request({
    url: "/users/delete",
    method: "post",
    data,
  });
}

//获取全部用户
export function getAllUsers() {
  return request({
    url: "/users/getAllUsers",
    method: "get",
  });
}
