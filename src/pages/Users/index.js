import { useState, useEffect } from "react";
import {
  Table,
  Card,
  Form,
  Input,
  DatePicker,
  message,
  Row,
  Col,
  Divider,
  Modal,
  Popconfirm,
  notification,
  Button,
} from "antd";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { getUsers, deleteUser } from "@/services/user";
import { logout } from "@/utils/session";
import { useNavigate } from "react-router-dom";
import {
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import InfoModal from "./InfoModal";
import CreateUserModal from "./CreateUserModal";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
    showQuickJumper: true,
  });
  const [isShowInfoModal, setIsShowInfoModal] = useState(false);
  const [isShowCreateModal, setIsShowCreateModal] = useState(false);
  const [selectRowKeys, setSelectRowKeys] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [form] = Form.useForm();
  const user = useSelector((state) => state.user);
  const navigator = useNavigate();

  const handleUsers = async (page = 1) => {
    const fields = form.getFieldsValue();
    setLoading(true);
    const res = await getUsers({
      current: page - 1,
      username: fields.username || "",
      startTime: fields.startTime ? dayjs(fields.startTime).valueOf() : "",
      endTime: fields.endTime ? dayjs(fields.endTime).valueOf() : "",
    });
    setLoading(false);

    if (res.status === 0) {
      setUsers(res.data.list);
      setPagination((prev) => ({
        ...prev,
        total: res.data.total,
        current: page,
      }));
    }
  };

  /**table分页*/
  const onTableChange = (page) => {
    setPagination(page);
    handleUsers(page.current);
  };

  /**搜索函数*/
  const onSearch = () => {
    handleUsers();
  };

  /**重置函数*/
  const onReset = () => {
    form.resetFields();
    handleUsers();
    setSelectRowKeys([]);
    message.success("重置成功");
  };

  /**打开用户信息模态框*/
  const showInfoModal = (record) => {
    const registrationAddress = record.registrationAddress
      ? JSON.parse(record.registrationAddress)
      : {};
    const lastLoginAddress = record.lastLoginAddress
      ? JSON.parse(record.lastLoginAddress)
      : {};
    const userInfo = {
      username: record.username,
      gender: record.gender,
      rIp: registrationAddress.ip,
      rTime:
        record.registrationTime &&
        dayjs(record.registrationTime).format("YYYY-MM-DD HH:mm:ss"),
      rNation: registrationAddress.ad_info.nation,
      rProvince: registrationAddress.ad_info.province,
      rCity: `${registrationAddress.ad_info.city}（${registrationAddress.ad_info.district}）`,
      lastLoginAddress:
        lastLoginAddress.ip &&
        `${lastLoginAddress.ip}（${lastLoginAddress.ad_info.city}）`,
      lastLoginTime:
        record.lastLoginTime &&
        dayjs(record.lastLoginTime).format("YYYY-MM-DD HH:mm:ss"),
    };
    setUserInfo(userInfo);
    setIsShowInfoModal(true);
  };

  /**关闭用户信息模态框*/
  const closeInfoModal = () => {
    setIsShowInfoModal(false);
    setUserInfo({});
  };

  /**切换新建用户模态框*/
  const toggleCreateUserModal = (visible) => {
    setIsShowCreateModal(visible);
  };

  /**删除个人用户*/
  const singleDelete = async (record) => {
    const res = await deleteUser({ ids: [record.id] });
    if (res.status === 0) {
      notification.success({
        message: "删除成功",
        description: "3秒后自动退出登录",
        duration: 3,
      });
      setTimeout(() => {
        logout();
        navigator("/login");
      }, 3000);
    }
  };

  /**批量删除*/
  const batchDelete = () => {
    Modal.confirm({
      title: "提示",
      content: "您确定批量删除勾选内容吗？",
      onOk: async () => {
        if (!user.isAdmin) {
          message.warning("管理员才可进行批量删除");
          return;
        }
        const res = await deleteUser({ ids: selectRowKeys });
        if (res.status === 0) {
          notification.success({
            message: "删除成功",
            description: res.message,
          });
          setSelectRowKeys([]);
          handleUsers();
        }
      },
    });
  };

  useEffect(() => {
    handleUsers(pagination.current);
  }, [user]);

  const columns = [
    {
      title: "序号",
      key: "num",
      align: "center",
      render: (text, record, index) => {
        let num = (pagination.current - 1) * 10 + index + 1;
        if (num < 10) {
          num = "0" + num;
        }
        return num;
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
      align: "center",
    },
    {
      title: "注册地址",
      dataIndex: "registrationAddress",
      align: "center",
      render: (text) => {
        const info = text && JSON.parse(text);
        if (info) {
          return `${info.ip}（${info.ad_info.city}）`;
        }
      },
    },
    {
      title: "注册时间",
      dataIndex: "registrationTime",
      align: "center",
      render: (text) => text && dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
      sorter: (a, b) => a.registrationTime - b.registrationTime,
    },
    {
      title: "上一次登陆地址",
      dataIndex: "lastLoginAddress",
      align: "center",
      render: (text) => {
        const info = text && JSON.parse(text);
        if (info) {
          return `${info.ip}（${info.ad_info.city}）`;
        }
      },
    },
    {
      title: "上一次登陆时间",
      dataIndex: "lastLoginTime",
      align: "center",
      render: (text) => text && dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
      sorter: (a, b) => a.lastLoginTime - b.lastLoginTime,
    },
    {
      title: "身份",
      dataIndex: "isAdmin",
      align: "center",
      render: (text) => (text ? "管理员" : "游客"),
      filterMultiple: false,
      filters: [
        {
          text: "游客",
          value: 0,
        },
        {
          text: "管理员",
          value: 1,
        },
      ],
      onFilter: (text, record) => record.isAdmin === text,
    },
    {
      title: "操作",
      key: "active",
      align: "center",
      render: (record) => (
        <div>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showInfoModal(record)}
          >
            查看
          </Button>
          {user.username === record.username && (
            <>
              <Divider type="vertical" />
              <Popconfirm
                title="您确定删除当前用户吗？"
                onConfirm={() => singleDelete(record)}
              >
                <Button type="link" danger icon={<DeleteOutlined />}>
                  删除
                </Button>
              </Popconfirm>
            </>
          )}
        </div>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectRowKeys,
    onChange: (selectedRowKeys) => setSelectRowKeys(selectedRowKeys),
    getCheckboxProps: (record) => ({
      disabled: record.id === user.id,
    }),
  };

  return (
    <div style={{ padding: 24 }}>
      <Card bordered={false}>
        <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
          <Row style={{ width: "100%" }}>
            <Col span={6}>
              <Form.Item label="用户名" name="username">
                <Input
                  placeholder="用户名"
                  style={{ width: 200 }}
                  onPressEnter={onSearch}
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="注册开始时间" name="startTime">
                <DatePicker style={{ width: 200 }} showTime />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="注册截至时间" name="endTime">
                <DatePicker style={{ width: 200 }} showTime />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                style={{ marginRight: 0, width: "100%" }}
                wrapperCol={{ span: 24 }}
              >
                <div style={{ textAlign: "right" }}>
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={onSearch}
                  >
                    搜索
                  </Button>
                  &emsp;
                  <Button icon={<ReloadOutlined />} onClick={onReset}>
                    重置
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div style={{ marginBottom: 16, textAlign: "right" }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => toggleCreateUserModal(true)}
          >
            新增
          </Button>
          &emsp;
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            disabled={!selectRowKeys.length}
            onClick={batchDelete}
          >
            批量删除
          </Button>
        </div>
        <Table
          bordered
          rowKey="id"
          dataSource={users}
          columns={columns}
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          onChange={onTableChange}
        />
        <InfoModal
          visible={isShowInfoModal}
          onCancel={closeInfoModal}
          userInfo={userInfo}
        />
        <CreateUserModal
          visivle={isShowCreateModal}
          toggleVisivle={toggleCreateUserModal}
          onRefresh={handleUsers}
        />
      </Card>
    </div>
  );
}
