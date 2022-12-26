import { Form, Input, Modal } from "antd";
import { createWork } from "@/services/collection";
import { useSelector } from "react-redux";
import { GithubOutlined } from "@ant-design/icons";

export default function CreateModal({ visible, toggleVisible, onRefresh }) {
  const [form] = Form.useForm();
  const user = useSelector((state) => state.user);

  const onCancel = () => {
    form.resetFields();
    toggleVisible(false);
  };

  const onSubmit = async (values) => {
    const res = await createWork(values);
    if (res.status === 0) {
      onRefresh();
      onCancel();
    }
  };

  const layouts = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  return (
    <Modal
      title="新增作品(仅管理员)"
      open={visible}
      onCancel={onCancel}
      centered
      okButtonProps={{ disabled: !user.isAdmin }}
      onOk={() => form.submit()}
    >
      <Form form={form} {...layouts} onFinish={onSubmit}>
        <Form.Item
          label="项目名称"
          name="title"
          rules={[{ required: true, message: "请输入项目名称" }]}
        >
          <Input placeholder="请输入项目名称" />
        </Form.Item>
        <Form.Item
          label="项目描述"
          name="description"
          rules={[{ required: true, message: "请输入项目描述" }]}
        >
          <Input.TextArea placeholder="请输入项目描述" />
        </Form.Item>
        <Form.Item
          label="预览地址"
          name="url"
          rules={[
            { required: true, message: "请输入项目预览地址" },
            { type: "url", message: "请输入正确的网址" },
          ]}
        >
          <Input placeholder="请输入项目预览地址" />
        </Form.Item>
        <Form.Item
          label={
            <span>
              <GithubOutlined /> 地址
            </span>
          }
          name="githubUrl"
          rules={[
            { required: true, message: "请输入项目github地址" },
            { type: "url", message: "请输入正确的网址" },
          ]}
        >
          <Input placeholder="请输入项目github地址" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
