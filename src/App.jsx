import logo from './logo.svg';
import './App.css';
import React from 'react';
import { DatePicker } from 'antd';
import { Button, message } from "antd";
import { AntDesignOutlined } from '@ant-design/icons';
import NavigationBar from './NavigationBar';
import BottomNavigationBar from './BottomNavigationBar';

function App() {
  const [messageApi, contextHolder] = message.useMessage();

  const info = () => {
    messageApi.info('Hello, Ant Design!');
  };

  return (

    <>
      <NavigationBar></NavigationBar>
      {contextHolder}
      <Button type="primary" size="large" icon={<AntDesignOutlined />} onClick={info} >
        Gradient Button
      </Button>

      <BottomNavigationBar></BottomNavigationBar>
    </>
  );
}

export default App;
