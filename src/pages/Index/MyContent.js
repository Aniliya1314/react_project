import { Tabs, Carousel, Layout } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import bg from "@/assets/images/bg.jpg";
import bg1 from "@/assets/images/bg1.jpg";
import bg2 from "@/assets/images/bg2.jpg";

import LoadableComponent from "@/utils/LoadableComponent";

const { Footer } = Layout;
const imgs = [bg, bg1, bg2];

const Users = LoadableComponent(import("../Users"));
const Collection = LoadableComponent(import("../Collection"));
const About = LoadableComponent(import("../About"));
const MessageBoard = LoadableComponent(import("../MessageBoard"));
const Chat = LoadableComponent(import("../Chat"));

const tabs = {
  Users: <Users />,
  Collection: <Collection />,
  About: <About />,
  MessageBoard: <MessageBoard />,
  Chat: <Chat />,
};

export default function MyContent({
  panes,
  activeMenu,
  changeActiveMenu,
  changePanes,
}) {
  /**标签改变时触发的函数*/
  const onChange = (activeKey) => {
    changeActiveMenu(activeKey);
  };

  /**标签编辑时触发的函数*/
  const onEdit = (targetKey, action) => {
    if (action === "remove") {
      onRemove(targetKey);
    }
  };

  const onRemove = (targetKey) => {
    let preIndex = panes.findIndex((pane) => pane.key === targetKey) - 1;
    preIndex = Math.max(preIndex, 0);

    const curPanes = panes.filter((pane) => pane.key !== targetKey);
    let curMenu = activeMenu;
    if (targetKey === activeMenu) {
      curMenu = panes[preIndex]?.key || "";
      changeActiveMenu(curMenu);
    }
    changePanes(curPanes);
  };

  return (
    <div className="content-container">
      {panes.length ? (
        <Tabs
          style={{ height: "100%" }}
          tabBarStyle={{ background: "#f0f2f5", marginBottom: 0 }}
          onEdit={onEdit}
          onChange={onChange}
          activeKey={activeMenu}
          type="editable-card"
          hideAdd
          items={panes.map((pane) => ({
            ...pane,
            children: (
              <div className="tabpane-box">
                {tabs[pane.key] || pane.content}
                <Footer style={{ textAlign: "center", background: "#fff" }}>
                  React-Admin ©{new Date().getFullYear()} Created by
                  491044408@qq.com{" "}
                  <a
                    target="_blank"
                    href="https://github.com/Aniliya1314"
                    rel="noopener noreferrer"
                  >
                    <GithubOutlined />
                  </a>
                </Footer>
              </div>
            ),
          }))}
        />
      ) : (
        <div className="bg-box">
          <Carousel className="bg-size" autoplay autoplaySpeed={5000}>
            {imgs.map((item) => (
              <div className="bg-size" key={item}>
                <img
                  src={item}
                  style={{ width: "100%", height: "100%" }}
                  alt="carousel"
                />
              </div>
            ))}
          </Carousel>
        </div>
      )}
    </div>
  );
}
