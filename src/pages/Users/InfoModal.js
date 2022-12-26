import { Modal, Row, Col, Form, Input, Button } from "antd";
import { useEffect } from "react";

export default function InfoModal({ visible, userInfo, onCancel }) {
  const [form] = Form.useForm();

  useEffect(() => {
    form && form.setFieldsValue(userInfo);
  }, [visible]);

  const layout = {
    labelCol: {
      span: 10,
    },
    wrapperCol: {
      span: 14,
    },
  };

  return (
    <Modal
      title="用户注册信息"
      open={visible}
      onCancel={onCancel}
      centered
      width={800}
      footer={
        <Button type="primary" onClick={onCancel}>
          确定
        </Button>
      }
    >
      <Form form={form} {...layout} style={{ marginLeft: -40 }}>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label="用户名" name="username">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="性别" name="gender">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="注册IP地址" name="rIp">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="注册时间" name="rTime">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="注册国家" name="rNation">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="注册省份" name="rProvince">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="注册城市" name="rCity">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="上一次登陆地址" name="lastLoginAddress">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="上一次登陆时间" name="lastLoginTime">
              <Input readOnly />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
