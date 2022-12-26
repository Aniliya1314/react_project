import { useState, useEffect } from "react";
import { Card, Button, Empty, Modal, Checkbox, message, Spin } from "antd";
import "./style.less";
import AnimatedBook from "@/components/AnimatedBook";
import { deleteWorks, getWorks } from "@/services/collection";
import CreateModal from "./CreateModal";
import { useSelector } from "react-redux";
import { GithubOutlined, PlusOutlined } from "@ant-design/icons";

export default function Collection() {
  const [collections, setCollections] = useState([]);
  const [isShowCreateModal, setIsShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);

  const getCollections = async () => {
    setLoading(true);
    try {
      const res = await getWorks();
      setCollections(res.data || []);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const toggleCreateModal = (visible) => {
    setIsShowCreateModal(visible);
  };

  const openDeleteModal = () => {
    let ids = [];
    Modal.confirm({
      title: "请在下面勾选要删除的项目(仅管理员)",
      content: (
        <div style={{ marginTop: 30 }}>
          <Checkbox.Group onChange={(values) => (ids = values)}>
            {collections.map((item) => (
              <p key={item.id}>
                <Checkbox value={item.id}>{item.title}</Checkbox>
              </p>
            ))}
          </Checkbox.Group>
        </div>
      ),
      maskClosable: true,
      okButtonProps: { disabled: !user.isAdmin },
      onOk: async () => {
        const res = await deleteWorks({ ids });
        if (res.status === 0) {
          message.success("删除成功");
          getCollections();
        }
      },
    });
  };

  useEffect(() => {
    getCollections();
  }, []);

  const colors = ["#f3b47e", "#83d3d3", "#8bc2e8", "#a3c7a3"];

  const styles = {
    box: {
      display: "flex",
      width: "100%",
      flexWrap: "wrap",
    },
  };

  return (
    <div>
      <Spin spinning={loading}>
        <Card bordered={false}>
          <div style={{ textAlign: "right", marginBottom: 40 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => toggleCreateModal(true)}
            >
              创建
            </Button>
            &emsp;
            <Button type="primary" danger onClick={openDeleteModal}>
              删除
            </Button>
          </div>
          <div style={styles.box}>
            {collections.map((item, index) => (
              <AnimatedBook
                key={item.id}
                cover={
                  <div
                    className="cover-box"
                    style={{ background: colors[index % 4] }}
                  >
                    <h3 className="title ellipsis">{item.title}</h3>
                    <p className="ellipsis">{item.description}</p>
                  </div>
                }
                content={
                  <div className="content-box">
                    <div className="btn">
                      <a
                        href={item.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GithubOutlined />
                      </a>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        预览地址
                      </a>
                    </div>
                  </div>
                }
              />
            ))}
          </div>
          {!collections.length && <Empty />}
        </Card>
      </Spin>
      <CreateModal
        visible={isShowCreateModal}
        onRefresh={getCollections}
        toggleVisible={toggleCreateModal}
      />
    </div>
  );
}
