import { Menu } from "antd";
import {
  UserOutlined,
  BulbOutlined,
  MessageOutlined,
  QqOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import Logo from "@/assets/images/antd.svg";

const menus = [
  {
    label: "用户管理",
    icon: <UserOutlined />,
    key: "Users",
  },
  {
    label: "作品集",
    icon: <BulbOutlined />,
    key: "Collection",
  },
  {
    label: "留言板",
    icon: <MessageOutlined />,
    key: "MessageBoard",
  },
  {
    label: "聊天室",
    icon: <QqOutlined />,
    key: "Chat",
  },
  {
    label: "关于",
    icon: <InfoCircleOutlined />,
    key: "About",
  },
];

export default function MySider({
  theme,
  activeMenu,
  panes,
  changeActiveMenu,
  changePanes,
}) {
  const addPane = (item) => {
    const data = menus.find((menu) => menu.key === item.key);
    if (data && !panes.find((pane) => pane.key === data.key)) {
      changePanes((prev) => [
        ...prev,
        { label: data.label, key: data.key, content: data.label },
      ]);
    }
    changeActiveMenu(item.key);
  };

  return (
    <div className={`my-sider ${theme}`}>
      <div className={`sider-menu-logo ${theme}`}>
        <a
          href="https://ant.design/docs/react/introduce-cn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={Logo} alt="" />
          <h1>Ant Design</h1>
        </a>
      </div>
      <Menu
        theme={theme}
        mode="inline"
        selectedKeys={[activeMenu]}
        onClick={addPane}
        style={{ paddingTop: 16 }}
        items={menus}
      />
    </div>
  );
}
