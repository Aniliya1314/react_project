import { useEffect, useState } from "react";
import { Layout } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "@/redux/user";
import MySider from "./MySider";
import MyHeader from "./MyHeader";
import MyContent from "./MyContent";
import "./style.less";

const { Header, Sider, Content } = Layout;

function Index() {
  const [collapsed, setCollapsed] = useState(); //侧边栏的折叠和展开
  const [panes, setPanes] = useState([]); //网站打开的标签页列表
  const [activeMenu, setActiveMenu] = useState(); //网站活动的菜单
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light"); //侧边栏主题
  const disptch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const init = async () => {
      try {
        const username = localStorage.getItem("username");
        await disptch(fetchUser({ username })).unwrap();
      } catch (e) {}
    };
    init();
  }, [disptch]);

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme={theme}>
        <MySider
          theme={theme}
          panes={panes}
          activeMenu={activeMenu}
          changePanes={setPanes}
          changeActiveMenu={setActiveMenu}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0 }}>
          <MyHeader
            user={user}
            theme={theme}
            changeCollapsed={setCollapsed}
            changeTheme={setTheme}
            collapsed={collapsed}
          />
        </Header>
        <Content>
          <MyContent
            panes={panes}
            activeMenu={activeMenu}
            changePanes={setPanes}
            changeActiveMenu={setActiveMenu}
          />
        </Content>
      </Layout>
    </Layout>
  );
}

export default Index;
