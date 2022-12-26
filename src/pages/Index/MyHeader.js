import { useState } from "react";
import { Menu, Avatar } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Icon, {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  EditOutlined,
  LogoutOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  AntDesignOutlined,
  createFromIconfontCN,
} from "@ant-design/icons";
import { logout } from "@/utils/session";
import { useNavigate } from "react-router-dom";
import { changeColor } from "@/redux/theme";
import screenfull from "screenfull";
import ColorPicker from "@/components/ColorPicker";
import LoadableComponent from "@/utils/LoadableComponent";

const EditPasswordModal = LoadableComponent(import("./EditPasswordModal"));
const EditInfoModal = LoadableComponent(import("./EditInfoModal"));

const MyIcon = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_731989_0s6wteco74wa.js",
});

export default function MyHeader({
  user,
  theme,
  changeCollapsed,
  changeTheme,
  collapsed,
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigator = useNavigate();

  const color = useSelector((state) => state.theme.color);
  const dispatch = useDispatch();

  /**切换侧边栏的折叠和展开*/
  const toggleCollapsed = () => {
    changeCollapsed((prev) => !prev);
  };

  /**切换全屏*/
  const toggleFullscreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle().then(() => {
        setIsFullscreen(screenfull.isFullscreen);
      });
    }
  };

  /**切换主题*/
  const onChangeColor = (color) => {
    localStorage.setItem("theme-color", color);
    dispatch(changeColor(color));
  };

  /**重置主题*/
  const resetColor = () => {
    const color = "#13c2c2";
    localStorage.setItem("theme-color", color);
    dispatch(changeColor(color));
  };

  /**展开/关闭修改信息模态框*/
  const toggleInfoVisible = (visible) => {
    setInfoVisible(visible);
  };

  /**展开/关闭修改密码模态框*/
  const togglePasswordVisible = (visible) => {
    setPasswordVisible(visible);
  };

  /**退出登录*/
  const onLogout = () => {
    logout(); //清空cookie
    navigator("/login");
  };

  const onChangeTheme = () => {
    const curTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", curTheme);
    changeTheme(curTheme);
  };

  const handleClick = (e) => {
    switch (e.key) {
      case "edit":
        toggleInfoVisible(true);
        break;
      case "password":
        togglePasswordVisible(true);
        break;
      case "logout":
        onLogout();
        break;
      case "fullscreen":
        toggleFullscreen();
        break;
      case "reset":
        resetColor();
        break;
      default:
        break;
    }
  };

  const styles = {
    headerRight: {
      float: "right",
      display: "flex",
      height: 64,
      marginRight: 50,
    },
    headerItem: {
      display: "flex",
      alignItems: "center",
      padding: "0 20px",
    },
    avatarBox: {
      display: "flex",
      alignItems: "center",
    },
  };

  const menus = [
    {
      label: (
        <div style={styles.avatarBox}>
          <Avatar size="small" src={user.avatar} />
          &nbsp;<span>{user.username}</span>
        </div>
      ),
      key: "user",
      children: [
        {
          type: "group",
          label: "用户中心",
          children: [
            {
              label: "编辑个人信息",
              key: "edit",
              icon: <UserOutlined />,
            },
            {
              label: "修改密码",
              key: "password",
              icon: <EditOutlined />,
            },
            {
              label: "退出登录",
              key: "logout",
              icon: <LogoutOutlined />,
            },
          ],
        },
        {
          type: "group",
          label: "设置中心",
          children: [
            {
              label: "切换全屏",
              key: "fullscreen",
              icon: isFullscreen ? (
                <FullscreenExitOutlined />
              ) : (
                <FullscreenOutlined />
              ),
            },
            {
              label: "恢复默认主题",
              key: "reset",
              icon: <AntDesignOutlined />,
            },
          ],
        },
      ],
    },
  ];

  return (
    <div style={{ background: "#fff", padding: "0 16px" }}>
      <Icon
        component={collapsed ? MenuUnfoldOutlined : MenuFoldOutlined}
        style={{ fontSize: 18 }}
        onClick={toggleCollapsed}
      />
      <div style={styles.headerRight}>
        <div style={styles.headerItem}>
          <ColorPicker color={color} onChange={onChangeColor} />
        </div>
        <div style={styles.headerItem}>
          <MyIcon
            type={theme === "dark" ? "icon-yueliang1" : "icon-taiyang"}
            style={{ fontSize: 24 }}
            onClick={onChangeTheme}
          />
        </div>
        <div style={styles.headerItem}>
          <Menu
            mode="horizontal"
            items={menus}
            selectable={false}
            onClick={handleClick}
          />
        </div>
      </div>
      <EditPasswordModal
        visible={passwordVisible}
        toggleVisible={togglePasswordVisible}
      />
      <EditInfoModal visible={infoVisible} toggleVisible={toggleInfoVisible} />
    </div>
  );
}
