import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./main";
import MyPage from "./components/MyPage";
import Register from "./components/Register";
import Arrest from "./components/Arrest";
import ListComponent from "./components/List";
import PostDetail from "./components/PostDetail";
import LoginPage from "./components/LoginPage";
import Vote from "./components/Vote";
import { DatePicker } from "antd";
import { Button, message } from "antd";
import { AntDesignOutlined } from "@ant-design/icons";
import NavigationBar from "./components/NavigationBar";
import BottomNavigationBar from "./components/BottomNavigationBar";
import { AppProvider } from "./AppContext";
import WantedList from "./components/WantedList";
import ReportsList from "./components/ReportsList";
import BountiesList from "./components/BountiesList";
import SendFriendRequest from "./components/SendFriendRequest";
import FriendList from "./components/FriendList";
import MyReportList from "./components/MyReportList";
import Result from "./components/Result";

function App() {
  const [messageApi, contextHolder] = message.useMessage();

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
            {/* <Route path="/Arrest" element={<Arrest />} /> */}
            <Route path="/post/:wantedId/Arrest" element={<Arrest />} />
            {/* <Route path="/List" element={<List />} /> */}
            <Route path="/post/:wantedId" element={<PostDetail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/Vote" element={<Vote />} />
            <Route path="/wanted" element={<WantedList />} />
            <Route path="/bounties" element={<BountiesList />} />
            <Route path="/reports" element={<ReportsList />} />
            <Route path="/sendFriendRequest" element={<SendFriendRequest />} />
            <Route path="/friend" element={<FriendList />} />
            <Route path="/myList" element={<MyReportList />} />
            <Route path="/result" element={<Result />} />
            <Route path="/list/:userEmail" element={<ListComponent />} />
          </Routes>
          <BottomNavigationBar></BottomNavigationBar>
        </Router>
      </AppProvider>
    </>
  );
}

export default App;
