import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Upload,
  message,
  Input,
  Radio,
  DatePicker,
  Alert,
} from "antd";
import { updateUser } from "@/services/user";
import { useDispatch, useSelector } from "react-redux";
import { initUser } from "@/redux/user";
import Icon, { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { isAuthenticated, authenticateSuccess } from "@/utils/session";
import dayjs from "dayjs";

export default function EditInfoModal({ visible, toggleVisible }) {
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  /**关闭模态框*/
  const onCancel = () => {
    form.resetFields();
    toggleVisible(false);
  };

  /**更新用户信息*/
  const onSubmit = async (values) => {
    const data = {
      ...values,
      birth: values.birth && dayjs(values.birth).valueOf(),
    };
    const res = await updateUser(data);
    if (res.status === 0) {
      localStorage.setItem("username", values.username);
      authenticateSuccess(res.data.token);
      dispatch(initUser(res.data));
      message.success("修改信息成功");
      onCancel();
    }
  };

  /**转换上传组件表单的值*/
  const _normFile = (e) => {
    if (e.file.response && e.file.response.data) {
      return e.file.response.data.url;
    } else {
      return "";
    }
  };

  useEffect(() => {
    visible &&
      form &&
      form.setFieldsValue({
        ...user,
        birth: user.birth ? dayjs(user.birth) : null,
      });
  }, [user, visible, form]);

  const layouts = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const styles = {
    avatarUploader: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 150,
      height: 150,
      backgroundColor: "#fff",
    },
    icon: {
      fontSize: 28,
      color: "#999",
    },
    avatar: {
      maxWidth: "100%",
      maxHeight: "100%",
    },
  };

  const uploadProps = {
    name: "avatar",
    maxCount: 1,
    listType: "picture-card",
    headers: {
      Authorization: `Bearer ${isAuthenticated()}`,
    },
    action: "http://localhost:3000/upload?isImg=1",
    showUploadList: false,
    accept: "image/*",
    beforeUpload: (file) => {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("头像大小需小于2M");
      }
      return isLt2M;
    },
    onChange: (info) => {
      if (info.file.status !== "uploading") {
        setUploading(true);
      }
      if (info.file.status === "done") {
        setUploading(false);
        message.success("上传头像成功");
      } else if (info.file.status === "error") {
        setUploading(false);
        message.error(info.file.response.message || "上传头像失败");
      } else {
        setUploading(false);
      }
    },
  };

  return (
    <Modal
      title="编辑个人信息"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      centered
    >
      <div style={{ height: "60vh", overflow: "auto" }}>
        <Form form={form} onFinish={onSubmit} {...layouts}>
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              return (
                <Form.Item
                  label="头像"
                  name="avatar"
                  getValueFromEvent={_normFile}
                  rules={[{ required: true, message: "请上传用户头像" }]}
                >
                  <Upload {...uploadProps} style={styles.avatarUploader}>
                    {getFieldValue("avatar") ? (
                      <img
                        src={getFieldValue("avatar")}
                        alt="avatar"
                        style={styles.avatar}
                      />
                    ) : (
                      <Icon
                        style={styles.icon}
                        component={uploading ? LoadingOutlined : PlusOutlined}
                      />
                    )}
                  </Upload>
                </Form.Item>
              );
            }}
          </Form.Item>
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: "请输入用户名" },
              { pattern: /^[^\s']+$/, message: "不能输入特殊字符" },
              { min: 3, type: "string", message: "用户名至少为3位" },
            ]}
          >
            <Input maxLength={26} placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item label="出生年日月" name="birth">
            <DatePicker />
          </Form.Item>
          <Form.Item label="电话" name="phone">
            <Input placeholder="请输入电话号码" />
          </Form.Item>
          <Form.Item label="所在地" name="location">
            <Input placeholder="请输入所在地" />
          </Form.Item>
          <Form.Item label="性别" name="gender">
            <Radio.Group>
              <Radio value="男">男</Radio>
              <Radio value="女">女</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
        <Alert message="注：此信息仅为项目模拟数据，无其他用途" type="info" />
      </div>
    </Modal>
  );
}
