import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./main";
import MyPage from "./components/MyPage";
import Register from "./components/Register";
import Arrest from "./components/Arrest";
import List from "./components/List";
import PostDetail from "./components/PostDetail";
import LoginPage from "./components/LoginPage";
import { DatePicker } from "antd";
import { Button, message } from "antd";
import { AntDesignOutlined } from "@ant-design/icons";
import NavigationBar from "./components/NavigationBar";
import BottomNavigationBar from "./components/BottomNavigationBar";
import { AppProvider } from "./AppContext";

function App() {
  const [messageApi, contextHolder] = message.useMessage();

  /*const info = () => {
    messageApi.info("Hello, Ant Design!");
  };*/

  return (
    <>
      <AppProvider>
        <Router>
          <NavigationBar></NavigationBar>
          {contextHolder}
          {/* <Button
        type="primary"
        size="large"
        icon={<AntDesignOutlined />}
        onClick={info}
      >
        Gradient Button
      </Button> */}
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/Arrest" element={<Arrest />} />
            <Route path="/List" element={<List />} />
            <Route path="/post/:postId" element={<PostDetail />} />
            <Route path="Login" element={<LoginPage />} />
          </Routes>
          <BottomNavigationBar></BottomNavigationBar>
        </Router>
      </AppProvider>
    </>
  );
}

export default App;
