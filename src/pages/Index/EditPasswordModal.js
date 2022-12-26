import { Form, Modal, Input, message } from "antd";
import { useEffect } from "react";
import { encrypt } from "@/utils/utils";
import { updateUser, login } from "@/services/user";
import { useSelector } from "react-redux";

export default function EditPasswordModal({ visible, toggleVisible }) {
  const [form] = Form.useForm();
  const user = useSelector((state) => state.user);

  const onSubmit = async (values) => {
    //加密密码
    const ciphertext = encrypt(values.oldPassword);
    const res = await login({
      username: values.username,
      password: ciphertext,
    });
    if (res.status === 0) {
      const ciphertext2 = encrypt(values.password);
      const res2 = await updateUser({
        username: values.username,
        password: ciphertext2,
      });
      if (res2.status === 0) {
        message.success("修改密码成功");
        onCancel();
      }
    }
  };

  const onCancel = () => {
    form.resetFields();
    toggleVisible(false);
  };

  useEffect(() => {
    form && form.setFieldValue("username", user.username);
  }, [user, visible, form]);

  const layouts = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  return (
    <Modal
      title="修改密码"
      open={visible}
      centered
      onOk={() => form.submit()}
      onCancel={onCancel}
    >
      <Form form={form} onFinish={onSubmit} {...layouts}>
        <Form.Item label="用户名" name="username">
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="旧密码"
          name="oldPassword"
          rules={[{ required: true, message: "请输入旧密码" }]}
        >
          <Input.Password
            placeholder="请输入旧密码"
            autoComplete="new-password"
          />
        </Form.Item>
        <Form.Item
          label="新密码"
          name="password"
          rules={[
            { required: true, message: "请输入新密码" },
            { min: 3, type: "string", message: "密码至少为3位" },
            { pattern: "^[^ ]+$", message: "密码不能有空格" },
          ]}
        >
          <Input.Password
            maxLength={26}
            placeholder="请输入新密码"
            autoComplete="new-password"
          />
        </Form.Item>
        <Form.Item
          label="确认密码"
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "请确认密码" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("密码不一致");
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="请确认密码"
            autoComplete="new-password"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
