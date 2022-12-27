import { useEffect, useRef, useState } from "react";
import { message, Avatar, Divider } from "antd";
import { throttle, replaceImg } from "@/utils/utils";
import dayjs from "dayjs";
import ReactQuill from "react-quill";
import { List, CellMeasurer, CellMeasurerCache } from "react-virtualized";
import { useSelector, useDispatch } from "react-redux";
import { getAllUsers } from "@/services/user";
import { initWebsocket } from "@/redux/websocket";
import hedaer1 from "./imgs/header1.png";
import header2 from "./imgs/header2.png";
import avaPng from "./imgs/react.png";
import zanwu from "./imgs/zanwu.png";
import admin from "./imgs/administrator.png";
import "react-quill/dist/quill.snow.css";
import "./style.less";

const cache = new CellMeasurerCache({
  defaultHeight: 96,
  fixedWidth: true,
});

export default function Chat() {
  const [editorValue, setEditValue] = useState("");
  const [userList, setUserList] = useState([]); //所有用户列表
  const websocket = useSelector((state) => state.websocket);
  const user = useSelector((state) => state.user);
  const chatList = useSelector((state) => state.chat);
  const onlineList = useSelector((state) => state.online);
  const dispatch = useDispatch();
  const chatContainerRef = useRef();
  const chatBoxRef = useRef();
  const chatHeaderRef = useRef();
  const chatListDomRef = useRef();
  const scrollToRowTimer = useRef();
  const mouse = useRef();
  const isDown = useRef();

  const scrollToRow = () => {
    //页面首次进入时并没有滚动到最底部，用下面这种方式进行处理
    const rowIndex = chatList.length - 1;
    chatListDomRef.current.scrollToRow(rowIndex);
    clearTimeout(scrollToRowTimer.current);
    scrollToRowTimer.current = setTimeout(() => {
      chatListDomRef.current?.scrollToRow(rowIndex);
    }, 10);
  };

  /**获取所有用户列表*/
  const getUserList = async () => {
    const res = await getAllUsers();
    handleUserList(res.data || []);
  };

  /**处理用户列表(管理员、在线用户放在数组前面)*/
  const handleUserList = (userList) => {
    let admins = [];
    let onlines = [];
    let others = [];
    for (let item of userList) {
      const isHave = onlineList.find((i) => i.id === item.id);
      const user = {
        ...item,
        online: !!isHave,
      };
      if (item.isAdmin) {
        admins.push(user);
      } else if (!!isHave) {
        onlines.push(user);
      } else {
        others.push(user);
      }
    }
    setUserList(admins.concat(onlines, others));
  };

  /**编辑框onchange*/
  const handleEditChange = (value) => {
    setEditValue(value);
  };

  /**定制键盘命令*/
  const handleKeyCommand = (event) => {
    //如果是回车就发送信息
    if (event.key === "Enter") {
      onSend();
    }
  };

  /**发送信息*/
  const onSend = () => {
    const div = document.createElement("div");
    div.innerHTML = editorValue;
    if (div.textContent.length === 0) {
      message.warning("请先输入聊天内容");
      return;
    }
    if (websocket.readyState !== 1) {
      //断开连接，重新连接
      dispatch(initWebsocket(user));
      message.warning("消息发送失败，请重新发送");
    }
    websocket.send(JSON.stringify({ content: editorValue }));
    setEditValue("");
  };

  /**记录鼠标点击时位置*/
  const onMouseDown = (e) => {
    e.persist();
    e.preventDefault();
    isDown.current = true;
    chatHeaderRef.current.style.cursor = "move";
    //保存初始位置
    mouse.current = {
      startX: e.clientX,
      startY: e.clientY,
      offsetLeft: chatBoxRef.current.offsetLeft,
      offsetTop: chatBoxRef.current.offsetTop,
    };
  };

  const onMouseMove = throttle((e) => {
    if (!isDown.current) {
      return;
    }
    //计算偏移位置
    let offsetLeft =
      mouse.current.offsetLeft + e.clientX - mouse.current.startX;
    let offsetTop = mouse.current.offsetTop + e.clientY - mouse.current.startY;
    //设置偏移距离的范围[0,chatContainerRef.current.clientWidth - 780]
    offsetLeft = Math.max(
      0,
      Math.min(offsetLeft, chatContainerRef.current.clientWidth - 780)
    );
    offsetTop = Math.max(0, Math.min(offsetTop, window.innerHeight - 624));

    chatBoxRef.current.style.left = offsetLeft + "px";
    chatBoxRef.current.style.top = offsetTop + "px";
  }, 10);

  const onMouseUp = () => {
    isDown.current = false;
    chatHeaderRef.current.style.cursor = "default";
    mouse.current = null;
  };

  /**处理时间*/
  const handleTime = (time, small) => {
    if (!time) {
      return "";
    }
    const HHmm = dayjs(time).format("HH:mm");
    //不在同一年，就算时间差一秒都要显示完整时间
    if (dayjs().format("YYYY") !== dayjs(time).format("YYYY")) {
      return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
    }
    //判断时间是否在同一天
    if (dayjs().format("YYYY-MM-DD") === dayjs(time).format("YYYY-MM-DD")) {
      return HHmm;
    }
    //判断时间是否在昨天。不在同一天又相差不超过24小时就是昨天
    if (dayjs().diff(time, "days") === 0) {
      return `昨天 ${HHmm}`;
    }
    //判断时间是否相隔一周
    if (dayjs().diff(time, "days") < 7) {
      const weeks = ["一", "二", "三", "四", "五", "六", "日"];
      return `星期${weeks[dayjs(time).day]} ${HHmm}`;
    }
    if (small) {
      return dayjs(time).format("MM-DD HH:mm");
    } else {
      return dayjs(time).format("M月D日 HH:mm");
    }
  };

  useEffect(() => {
    if (websocket?.readyState !== 1) {
      dispatch(initWebsocket(user));
    }
    scrollToRow();
    getUserList();
    window.onmouseup = onMouseUp;
    return () => {
      window.onmouseup = null;
    };
  }, []);

  const lastChat = chatList[chatList.length - 1] || {};
  const styles = {
    contentStyle: {
      height: 100,
      paddingBottom: 0,
      transform: "translateY(-15px)",
      fontSize: 14,
    },
    controlBarStyle: {
      boxShadow: "none",
    },
    center: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  };

  return (
    <div className="chat-container" ref={chatContainerRef}>
      <div className="chat-box" ref={chatBoxRef}>
        <div
          className="chat-header"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          ref={chatHeaderRef}
        >
          <div className="header-left">
            <img src={hedaer1} alt="header1" />
          </div>
          <div className="header-center">
            <img src={header2} alt="header2" />
          </div>
          <div className="header-right">
            <Avatar src={user.avatar} />
          </div>
        </div>
        <div className="chat-body">
          <div className="left">
            <div className="left-item">
              <div>
                <Avatar size="large" src={avaPng} />
              </div>
              <div className="left-item-text">
                <div className="group-name">
                  <span>聊天室01</span>
                  {/* <span>
                    {handleTime(lastChat.createTime, true).split(" ")[0]}
                  </span> */}
                  <div
                    className="group-message"
                    style={{ display: lastChat.userId ? "flex" : "none" }}
                  >
                    <div style={{ flexFlow: 1, flexShrink: 0 }}>
                      {lastChat.username}:&nbsp;
                    </div>
                    <div
                      className="ellipsis"
                      dangerouslySetInnerHTML={{
                        __html: replaceImg(lastChat.content),
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="main">
            <List
              ref={chatListDomRef}
              width={443}
              height={328}
              style={{ outline: "none" }}
              rowCount={chatList.length}
              deferredMeasurementCache={cache}
              rowHeight={cache.rowHeight}
              rowRenderer={({ index, key, parent, style }) => (
                <CellMeasurer
                  cache={cache}
                  columnIndex={0}
                  key={key}
                  parent={parent}
                  rowIndex={index}
                >
                  <div style={style} className="chat-item">
                    {(index === 0 ||
                      chatList[index].createTime -
                        chatList[index - 1].createTime >
                        3 * 60 * 1000) && (
                      <div className="time">
                        {handleTime(chatList[index].createTime)}
                      </div>
                    )}
                    <div
                      className={`chat-item-info ${
                        user.id === chatList[index].userId ? "chat-right" : ""
                      }`}
                    >
                      <div>
                        <Avatar src={chatList[index].userAvatar} />
                      </div>
                      <div className="chat-main">
                        <div className="username">
                          {chatList[index].username}
                        </div>
                        <div
                          className="chat-content"
                          dangerouslySetInnerHTML={{
                            __html: chatList[index].content,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CellMeasurer>
              )}
            />
            <div className="chat-editor-wrapper">
              <ReactQuill
                style={{ height: "calc(100% - 40px)" }}
                value={editorValue}
                onChange={handleEditChange}
                onKeyDown={handleKeyCommand}
              />
            </div>
          </div>
          <div className="right">
            <div style={{ height: 162 }}>
              <div style={{ padding: 5 }}>群公告</div>
              <div style={styles.center}>
                <img src={zanwu} alt="暂无" style={{ width: "80%" }} />
              </div>
              <Divider style={{ margin: "10px 0 0" }} />
              <div className="member">
                成员 {onlineList.length}/{userList.length}
              </div>
            </div>
            <List
              width={134}
              height={296}
              style={{ outline: "none" }}
              rowCount={userList.length}
              rowHeight={35}
              rowRenderer={({ key, index, style }) => (
                <div key={key} className="user-item" style={style}>
                  <div className={`avatar-box`}>
                    <img
                      style={{ width: "100%", height: "100%" }}
                      src={userList[index].avatar}
                      alt="avatar"
                    />
                    <div />
                  </div>
                  <div
                    className="ellipsis"
                    style={{ flexGrow: 1, margin: "0 3px 0 5px" }}
                  >
                    {userList[index].username}
                  </div>
                  <div
                    style={{
                      display: userList[index].isAdmin ? "block" : "none",
                    }}
                  >
                    <img width={18} height={20} src={admin} alt="admin" />
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
