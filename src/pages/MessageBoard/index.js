import { useState, useEffect } from "react";
import { Comment } from "@ant-design/compatible";
import {
  Divider,
  Button,
  Card,
  message,
  Tooltip,
  Input,
  Modal,
  notification,
  Tag,
  Spin,
  Pagination,
} from "antd";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { getMessages, createMessage, deleteMessage } from "@/services/message";
import {
  CommentOutlined,
  DeleteOutlined,
  DownCircleOutlined,
  LikeOutlined,
  UpCircleOutlined,
} from "@ant-design/icons";
import ReactQuill from "react-quill";
import Score from "./Score";
import "./style.less";
import "react-quill/dist/quill.snow.css";

const styles = {
  actionItem: {
    fontSize: 14,
  },
};

export default function MessageBoard() {
  const [messages, setMessages] = useState([]); //留言内容
  const [isShowEditor, setIsShowEditor] = useState(false);
  const [editorValue, setEditValue] = useState("");
  const [reply, setReply] = useState({
    replyPid: "", //回复第几条的父级id
    replyContent: "", //回复内容
    replyUser: null, //回复对象
  });
  const [expandIds, setExpandIds] = useState([]); //展开的id列表
  const [placeholder, setPlaceHolder] = useState(""); //回复的placeholder
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 100,
    current: 1,
    pageSize: 10,
    showQuickJumper: true,
    showSizeChanger: true,
  });

  const user = useSelector((state) => state.user);

  /**获取留言列表*/
  const handleMessages = async (page = 1, pageSize = 10) => {
    setLoading(true);
    const res = await getMessages({ current: page - 1, pageSize });
    if (res.status === 0) {
      setMessages(res.data.list || []);
      setPagination((prev) => ({
        ...prev,
        total: res.data.total,
        current: page,
        pageSize,
      }));
    }
    setLoading(false);
  };

  /**发表留言*/
  const sendMessage = async () => {
    const div = document.createElement("div");
    div.innerHTML = editorValue;
    if (!div.textContent.length) {
      message.warning("请先输入内容");
      return;
    }
    const res = await createMessage({ content: editorValue });
    if (res.status === 0) {
      message.success("留言成功");
      setEditValue("");
      setIsShowEditor(false);
      handleMessages();
    }
  };

  /**取消留言*/
  const closeMessage = () => {
    setEditValue("");
    setIsShowEditor(false);
  };

  /**点赞功能*/
  const onLike = () => {
    notification.warning({
      message: "提示",
      description: "暂不支持点赞功能",
      duration: 3,
    });
  };

  /**回复功能*/
  const showReply = (item, pid) => {
    setReply({ replyPid: pid, replyContent: "", replyUser: item });
    setPlaceHolder(`${user.username} @ ${item.userName}`);
  };

  /**取消回复*/
  const closeReply = () => {
    setReply({ replyPid: "", replyContent: "", replyUser: "" });
    setPlaceHolder("");
  };

  /**留言输入框的onchange*/
  const handleReplyChange = (e) => {
    setReply((prev) => ({ ...prev, replyContent: e.target.value }));
  };

  /**确认回复*/
  const confirmReply = async (item) => {
    const { replyContent, replyPid, replyUser } = reply;
    if (!replyContent) {
      message.warning("请输入回复内容");
      return;
    }
    const params = {
      content: replyContent,
      type: 1,
      pid: replyPid,
      targetUserId: replyUser.userId,
    };
    const res = await createMessage(params);
    if (res.status === 0) {
      message.success("回复成功");
      closeReply();
      const { pageSize, current } = pagination;
      handleMessages(current, pageSize);
      if (!expandIds.includes(item.id)) {
        setExpandIds((prev) => [...prev, item.id]);
      }
    }
  };

  /**删除回复*/
  const onDelete = (item) => {
    Modal.confirm({
      title: "提示",
      content: `确定删除该留言${
        item.children?.length ? "及其底下的回复" : ""
      }吗`,
      onOk: async () => {
        const res = await deleteMessage({ id: item.id });
        if (res.status === 0) {
          notification.success({
            message: "删除成功",
            description: res.message,
            duration: 3,
          });
          const { current, pageSize } = pagination;
          handleMessages(current, pageSize);
        }
      },
    });
  };

  /**折叠回复*/
  const foldReply = (item) => {
    setExpandIds((prev) => prev.filter((id) => id !== item.id));
  };

  /**展开回复*/
  const expandReply = (item) => {
    setExpandIds((prev) => [...prev, item.id]);
  };

  /**分页改变*/
  const pageChange = (page, pageSize) => {
    console.log(page, pageSize);
    handleMessages(page, pageSize);
  };

  /**渲染操作列表 */
  const renderActions = (item, pid) => {
    return [
      <span>
        <Tooltip title="回复时间">
          {dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss")}
        </Tooltip>
      </span>,
      <span style={styles.actionItem}>
        <Tooltip title="赞">
          <span onClick={onLike}>
            <LikeOutlined />
            &nbsp;赞
          </span>
        </Tooltip>
      </span>,
      <span style={styles.actionItem}>
        <Tooltip title="回复">
          <span onClick={() => showReply(item, pid)}>
            <CommentOutlined />
            &nbsp;回复
          </span>
        </Tooltip>
      </span>,
      (user.isAdmin || user.id === item.userId) && (
        <span style={styles.actionItem}>
          <Tooltip title="删除">
            <span onClick={() => onDelete(item)}>
              <DeleteOutlined />
              &nbsp;删除
            </span>
          </Tooltip>
        </span>
      ),
    ].filter(Boolean);
  };

  useEffect(() => {
    handleMessages();
  }, [user]);

  return (
    <div style={{ padding: 24 }}>
      <Card bordered={false} bodyStyle={{ paddingTop: 0 }}>
        <div>
          {isShowEditor ? (
            <div style={{ marginTop: 10 }}>
              <div className="editor-wrapper">
                <ReactQuill
                  theme="snow"
                  value={editorValue}
                  style={{ height: "100%" }}
                  onChange={setEditValue}
                />
              </div>
              <Button type="primary" onClick={sendMessage}>
                发表
              </Button>
              &emsp;
              <Button onClick={closeMessage}>取消</Button>
            </div>
          ) : (
            <Button onClick={() => setIsShowEditor(true)}>我要留言</Button>
          )}
        </div>
        <Divider />
        <Spin
          spinning={loading}
          style={{ position: "fixed", top: "50%", left: "50%" }}
        />
        <div className="message-list-box">
          {Array.isArray(messages) &&
            messages.map((item, index) => (
              <Comment
                key={item.id}
                author={
                  <span style={{ fontSize: 16 }}>
                    {item.userName}&emsp;
                    {item.userIsAdmin === 1 && (
                      <Tag color="#87d068">管理员</Tag>
                    )}
                  </span>
                }
                avatar={
                  <img
                    className="avatar-img"
                    src={item.userAvatar}
                    alt="avatar"
                  />
                }
                content={
                  <div
                    className="info-box braft-output-content"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                }
                actions={renderActions(item, item.id)}
                datetime={`第${
                  pagination.total -
                  (pagination.current - 1) * pagination.pageSize -
                  index
                }楼`}
              >
                {item.children
                  .slice(
                    0,
                    expandIds.includes(item.id) ? item.children.length : 1
                  )
                  .map((i) => (
                    <Comment
                      key={i.id}
                      author={
                        <span style={{ fontSize: 15 }}>
                          {i.userName}&emsp;
                          {i.userIsAdmin === 1 && (
                            <Tag color="#87d068">管理员</Tag>
                          )}
                          &emsp; @ {i.targetUserName}&emsp;
                          {i.targetUserIsAdmin === 1 && (
                            <Tag color="#87d068">管理员</Tag>
                          )}
                        </span>
                      }
                      avatar={
                        <img
                          className="avatar-img-small"
                          src={i.userAvatar}
                          alt="avatar"
                        />
                      }
                      content={
                        <div
                          className="info-box"
                          dangerouslySetInnerHTML={{ __html: i.content }}
                        />
                      }
                      actions={renderActions(i, item.id)}
                    />
                  ))}
                <div
                  className="toggle-reply-box"
                  style={{
                    display: item.children.length > 1 ? "block" : "none",
                  }}
                >
                  {expandIds.includes(item.id) ? (
                    <span onClick={() => foldReply(item)}>
                      收起全部{item.children.length}条回复&nbsp;
                      <UpCircleOutlined />
                    </span>
                  ) : (
                    <span onClick={() => expandReply(item)}>
                      展开全部{item.children.length}条回复&nbsp;
                      <DownCircleOutlined />
                    </span>
                  )}
                </div>
                {reply.replyPid === item.id && (
                  <div style={{ width: "70%", textAlign: "right" }}>
                    <Input.TextArea
                      rows={4}
                      style={{ marginBottom: 10 }}
                      value={reply.replyContent}
                      placeholder={placeholder}
                      onChange={handleReplyChange}
                    />
                    <Button size="small" onClick={closeReply}>
                      取消
                    </Button>
                    &emsp;
                    <Button size="small" type="primary" onClick={confirmReply}>
                      回复
                    </Button>
                  </div>
                )}
              </Comment>
            ))}
        </div>
        <Pagination {...pagination} onChange={pageChange} />
        <div className="score-box">
          <Score />
        </div>
      </Card>
    </div>
  );
}
