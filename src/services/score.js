import request from "./index";

/**获取评分列表*/
export function getScores() {
  return request({
    url: "/score/list",
    method: "get",
  });
}

/**创建评分*/
export function createScore(data) {
  return request({
    url: "/score/create",
    method: "post",
    data,
  });
}
