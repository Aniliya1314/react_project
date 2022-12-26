import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
import { Button, ConfigProvider, Result } from "antd";
import zhCN from "antd/locale/zh_CN";
import LoadableComponent from "./utils/LoadableComponent";
import PrivateRoute from "@/components/PrivateRoute";
import { useSelector } from "react-redux";

import "./App.css";

const Index = LoadableComponent(import("./pages/Index"));
const Login = LoadableComponent(import("./pages/Login"));
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="当前页面不存在"
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          返回首页
        </Button>
      }
    />
  );
};

function App() {
  const color = useSelector((state) => state.theme.color);

  return (
    <ConfigProvider locale={zhCN} theme={{ token: { colorPrimary: color } }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route index element={<Index />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
