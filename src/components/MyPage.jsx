import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyPage.css";
import profileImage from "../assets/profile_image.png";
import { Button, Modal, List, Typography } from "antd";

const MyPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("범죄왕(칭호)");
  const [titles, setTitles] = useState([
    "범죄왕(칭호)",
    "수사왕(칭호)",
    "탐정왕(칭호)",
    "정보왕(칭호)",
  ]);

  const navigate = useNavigate();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const changeTitle = (title) => {
    setCurrentTitle(title);
    setIsModalOpen(false);
  };

  const handleHistoryClick = (path) => {
    navigate(path);
  };

  return (
    <div className="my-page">
      <div className="profile">
        <img src={profileImage} alt="프로필" className="profile-image" />
        <h1 className="name">윤주원</h1>
        <p className="title" onClick={showModal}>
          {currentTitle}
        </p>
      </div>
      <div className="history-section">
        <h2>이력</h2>
        <ul>
          <li onClick={() => handleHistoryClick("/reports")}>제보 이력</li>
          <li onClick={() => handleHistoryClick("/bounties")}>현상금 이력</li>
          <li onClick={() => handleHistoryClick("/wanted")}>수배 등록 이력</li>
          <li>친구 요청 이력</li>{" "}
          {/* 친구 요청 이력 페이지는 별도로 구현 필요 */}
        </ul>
      </div>
      <Modal
        title="칭호 정보"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <List
          dataSource={titles}
          renderItem={(item) => (
            <List.Item onClick={() => changeTitle(item)}>
              <Typography.Text>{item}</Typography.Text>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default MyPage;
