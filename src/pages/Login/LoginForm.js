import { useEffect, useRef, useState } from "react";
import { Form, Input, Row, Col } from "antd";
import { UserOutlined, LockOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { checkName, login } from "@/services/user";
import { randomNum, encrypt } from "@/utils/utils";
import { authenticateSuccess } from "@/utils/session";

export default function LoginForm({ toggleShow }) {
  const [focusItem, setFocusItem] = useState(-1); //当前焦点聚焦
  const [code, setCode] = useState(""); //验证码
  const [form] = Form.useForm();
  const ref = useRef();
  const navigate = useNavigate();

  const _createCode = () => {
    const ctx = ref.current.getContext("2d");
    const chars = [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "j",
      "k",
      "l",
      "m",
      "n",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "J",
      "K",
      "L",
      "M",
      "N",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];
    let code = "";
    ctx.clearRect(0, 0, 80, 40);
    for (let i = 0; i < 4; i++) {
      const char = chars[randomNum(0, 57)];
      code += char;
      ctx.font = randomNum(20, 25) + "px SimHei"; //设置字体随机大小
      ctx.fillStyle = "#D3D7F7";
      ctx.textBaseline = "middle";
      ctx.shadowOffsetX = randomNum(-3, 3);
      ctx.shadowOffsetY = randomNum(-3, 3);
      ctx.shadowBlur = randomNum(-3, 3);
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      let x = (80 / 5) * (i + 1);
      let y = 40 / 2;
      let deg = randomNum(-25, 25);
      ctx.save();
      /**设置旋转角度与坐标原点*/
      ctx.translate(x, y);
      ctx.rotate((deg * Math.PI) / 180);
      ctx.fillText(char, 0, 0);
      /**恢复旋转角度*/
      ctx.restore();
    }
    setCode(code);
  };

  const goRegister = () => {
    form.resetFields();
    toggleShow();
    _createCode();
  };

  const onSubmit = () => {
    form.submit();
  };

  const onLogin = async (values) => {
    const { username, password } = values;
    const res = await checkName({ username });
    if (!res.data.num) {
      form.setFields([
        {
          name: "username",
          value: username,
          errors: ["用户名不存在"],
        },
      ]);
      changeCaptcha();
      return;
    }
    const ciphertext = encrypt(password);
    const res2 = await login({ username, password: ciphertext });
    if (res2.status !== 0) {
      changeCaptcha();
      return;
    }
    localStorage.setItem("username", username);
    authenticateSuccess(res2.data.token);
    navigate("/", { replace: true });
  };

  const changeCaptcha = () => {
    form.resetFields(["captcha"]);
    _createCode();
  };

  useEffect(() => {
    _createCode();
  }, []);

  return (
    <div>
      <h3 className="title">管理员登录</h3>
      <Form requiredMark={false} colon={false} form={form} onFinish={onLogin}>
        <Form.Item
          label={
            <UserOutlined style={{ opacity: focusItem === 0 ? 1 : 0.6 }} />
          }
          name="username"
          rules={[
            { required: true, message: "请输入用户名" },
            { pattern: /^[^\s']+$/, message: "不能输入特殊字符" },
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
            onFocus={() => setFocusItem(0)}
            onBlur={() => setFocusItem(-1)}
          />
        </Form.Item>
        <Form.Item
          label={
            <LockOutlined style={{ opacity: focusItem === 1 ? 1 : 0.6 }} />
          }
          name="password"
          rules={[{ required: true, message: "请输入密码" }]}
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
            className="myInput"
            onFocus={() => setFocusItem(1)}
            onBlur={() => setFocusItem(-1)}
            placeholder="密码"
          />
        </Form.Item>
        <Form.Item
          label={<EyeOutlined style={{ opacity: focusItem === 2 ? 1 : 0.6 }} />}
          wrapperCol={{
            span: 20,
            pull: focusItem === 2 ? 1 : 0,
          }}
          labelCol={{
            span: 3,
            pull: focusItem === 2 ? 1 : 0,
          }}
        >
          <Row gutter={8}>
            <Col span={15}>
              <Form.Item
                name="captcha"
                rules={[
                  { required: true, message: "请输入验证码" },
                  () => ({
                    validator(_, value) {
                      if (
                        !value ||
                        value.toUpperCase() === code.toUpperCase()
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("验证码错误"));
                    },
                  }),
                ]}
              >
                <Input
                  className="myInput"
                  placeholder="验证码"
                  onFocus={() => setFocusItem(2)}
                  onBlur={() => setFocusItem(-1)}
                />
              </Form.Item>
            </Col>
            <Col span={9}>
              <canvas
                ref={ref}
                onClick={changeCaptcha}
                width="80"
                height="40"
              />
            </Col>
          </Row>
        </Form.Item>
        <Form.Item>
          <div className="btn-box">
            <div className="loginBtn" onClick={onSubmit}>
              登录
            </div>
            <div className="registerBtn" onClick={goRegister}>
              注册
            </div>
          </div>
        </Form.Item>
      </Form>
      <div className="footer">欢迎登陆后台管理系统</div>
    </div>
  );
}
