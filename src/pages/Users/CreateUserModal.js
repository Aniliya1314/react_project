import { Form, Modal, Input, message } from "antd";
import { encrypt } from "@/utils/utils";
import { register } from "@/services/user";

export default function CreateUserModal({ visivle, toggleVisivle, onRefresh }) {
  const [form] = Form.useForm();

  const onSubmit = async (values) => {
    const ciphertext = encrypt(values.password);
    const res = await register({
      username: values.username,
      password: ciphertext,
    });
    if (res.status === 0) {
      message.success("注册成功");
      onRefresh();
      onCancel();
    }
  };

  const onCancel = () => {
    form.resetFields();
    toggleVisivle(false);
  };

  const layouts = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  return (
    <Modal
      title="新增用户"
      open={visivle}
      onCancel={onCancel}
      onOk={() => form.submit()}
      centered
    >
      <Form form={form} onFinish={onSubmit} {...layouts}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            { required: true, message: "请输入用户名" },
            { pattern: /^[^\s']+$/, message: "不能输入特殊字符" },
            { min: 3, type: "string", message: "用户名至少为3位" },
          ]}
        >
          <Input
            placeholder="用户名"
            autoComplete="new-password"
            maxLength={16}
          />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[
            { required: true, message: "请输入密码" },
            { pattern: "^[^ ]+$", message: "密码不能有空格" },
            { min: 3, type: "string", message: "密码至少为3位" },
          ]}
        >
          <Input.Password maxLength={16} placeholder="密码" />
        </Form.Item>
        <Form.Item
          label="确认密码"
          name="confirm"
          dependencies={["password"]}
          rules={[
            { required: true, message: "请确认密码" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("密码不一致"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="确认密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
