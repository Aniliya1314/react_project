import { useState } from "react";
import { Form, Input, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { register } from "@/services/user";
import { debounce, encrypt } from "@/utils/utils";
import { checkName } from "@/services/user";

export default function RegisterForm({ toggleShow }) {
  const [focusItem, setFocusItem] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const backLogin = () => {
    form.resetFields();
    toggleShow();
  };

  const onSubmit = () => {
    form.submit();
  };

  const onRegister = async (values) => {
    if (loading) return;
    setLoading(true);
    const key = "register";
    messageApi.open({
      key,
      type: "loading",
      content: "注册中...",
    });
    const ciphertext = encrypt(values.password);
    try {
      const res = await register({
        username: values.username,
        password: ciphertext,
      });
      setLoading(false);
      if (res.status === 0) {
        messageApi.open({
          key,
          type: "success",
          content: "注册成功",
        });
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const onCheckName = debounce(async (value) => {
    if (value) {
      const res = await checkName({ username: value });
      if (res.data.num) {
        form.setFields([
          {
            name: "username",
            value,
            errors: ["用户名已存在"],
          },
        ]);
      }
    }
  });

  return (
    <div>
      {contextHolder}
      <h3 className="title">管理员注册</h3>
      <Form
        form={form}
        requiredMark={false}
        colon={false}
        onFinish={onRegister}
      >
        <Form.Item
          label={
            <UserOutlined style={{ opacity: focusItem === 0 ? 1 : 0.6 }} />
          }
          name="username"
          rules={[
            { required: true, message: "请输入用户名" },
            { pattern: /^[^\s']+$/, message: "不能输入特殊字符" },
            { min: 3, type: "string", message: "用户名至少为3位" },
          ]}
          wrapperCol={{
            span: 20,
            pull: focusItem === 0 ? 1 : 0,
          }}
          labelCol={{
            span: 3,
            pull: focusItem === 0 ? 1 : 0,
          }}
        >
          <Input
            className="myInput"
            placeholder="用户名"
            autoComplete="new-password"
            maxLength={16}
            onFocus={() => setFocusItem(0)}
            onBlur={() => setFocusItem(-1)}
            onChange={(e) => onCheckName(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label={
            <LockOutlined style={{ opacity: focusItem === 1 ? 1 : 0.6 }} />
          }
          name="password"
          rules={[
            { required: true, message: "请输入密码" },
            { pattern: "^[^ ]+$", message: "密码不能有空格" },
            { min: 3, type: "string", message: "密码至少为3位" },
          ]}
          wrapperCol={{
            span: 20,
            pull: focusItem === 1 ? 1 : 0,
          }}
          labelCol={{
            span: 3,
            pull: focusItem === 1 ? 1 : 0,
          }}
        >
          <Input
            type="password"
            maxLength={16}
            className="myInput"
            onFocus={() => setFocusItem(1)}
            onBlur={() => setFocusItem(-1)}
            placeholder="密码"
          />
        </Form.Item>
        <Form.Item
          label={
            <LockOutlined style={{ opacity: focusItem === 2 ? 1 : 0.6 }} />
          }
          name="confirm"
          dependencies={["password"]}
          style={{ marginBottom: 35 }}
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
          wrapperCol={{
            span: 20,
            pull: focusItem === 2 ? 1 : 0,
          }}
          labelCol={{
            span: 3,
            pull: focusItem === 2 ? 1 : 0,
          }}
        >
          <Input
            type="password"
            className="myInput"
            onFocus={() => setFocusItem(2)}
            onBlur={() => setFocusItem(-1)}
            placeholder="确认密码"
          />
        </Form.Item>
        <Form.Item>
          <div className="btn-box">
            <div className="loginBtn" onClick={onSubmit}>
              注册
            </div>
            <div className="registerBtn" onClick={backLogin}>
              返回登录
            </div>
          </div>
        </Form.Item>
      </Form>
      <div className="footer">欢迎登陆后台管理系统</div>
    </div>
  );
}
