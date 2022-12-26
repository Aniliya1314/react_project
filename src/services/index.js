import axios from "axios";
import { message } from "antd";
const services = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
  timeout: "15000",
  validateStatus: (status) => {
    return status >= 200 && status < 500;
  },
});

services.interceptors.request.use((config) => {
  return config;
});

services.interceptors.response.use(
  (res) => {
    const data = res.data || {};
    if (data.status !== 0) {
      message.error(data.message);
    }
    return Promise.resolve(data);
  },
  (err) => {
    const data = err.response.data || {};
    let msg = data.message || err.message;
    if (msg === "Network Error") {
      msg = "后端接口连接异常";
    } else if (msg.includes("timeout")) {
      msg = "系统接口请求超时";
    } else if (msg.includes("Request failed with status code")) {
      msg = "系统接口" + msg.substr(msg.length - 3) + "异常";
    }
    message.error(msg);
    return Promise.reject(err);
  }
);

export default services;
