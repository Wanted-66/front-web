import "./App.css";
import React from "react";
import ReactDOM from "react-dom";
import Main from "./main";
import { DatePicker } from "antd";
import { Button, message } from "antd";
import { AntDesignOutlined } from "@ant-design/icons";

function App() {
  const [messageApi, contextHolder] = message.useMessage();

  const info = () => {
    messageApi.info("Hello, Ant Design!");
  };

  return (
    <>
      {contextHolder}
      {/* <Button
        type="primary"
        size="large"
        icon={<AntDesignOutlined />}
        onClick={info}
      >
        Gradient Button
      </Button> */}
      <Main />;
    </>
  );
}

export default App;
