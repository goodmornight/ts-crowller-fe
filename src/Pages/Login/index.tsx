import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Redirect } from 'react-router-dom';
import './style.css';
import axios from 'axios';
import qs from 'qs';

interface FormFields {
  password: string;
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(false)

  const onFinish = (values: any) => {

    axios.post('/api/login', qs.stringify({
      password: values.password
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(res => {

      if(res.data?.data) {
        setIsLogin(true);
      } else {
        message.error('登陆失败');
      }
    })
  };

  return (
    isLogin ? (<Redirect to="/" />):
    (<div className="login-page">
      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>)
  );
};

export default Login;
