import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, List, Typography, Upload, message } from "antd";
import profileImage from "../assets/profile_image.png";
import "./MyPage.css";
import { UploadOutlined } from "@ant-design/icons";

const { Text } = Typography;

const MyPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("범죄왕(칭호)");
  const [titles, setTitles] = useState([
    "범죄왕(칭호)",
    "수사왕(칭호)",
    "탐정왕(칭호)",
    "정보왕(칭호)",
  ]);
  const [profilePic, setProfilePic] = useState(profileImage); // 프로필 이미지 상태 추가

  const navigate = useNavigate();

  const handleReportsListClick = () => {
    navigate("/reports");
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const changeTitle = async (title) => {
    try {
      const response = await fetch(
        "https://wanted66.r-e.kr/api/user/update-title",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update title");
      }

      setCurrentTitle(title);
      message.success("칭호가 업데이트되었습니다.");
    } catch (error) {
      message.error("칭호를 업데이트하는 데 실패했습니다.");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleProfilePicChange = async (info) => {
    if (info.file.status === "done") {
      // 업로드 성공 시 서버에서 새로운 이미지 URL을 반환한다고 가정
      const newProfilePic = info.file.response?.url; // 서버에서 반환된 이미지 URL
      setProfilePic(newProfilePic);
      message.success("프로필 사진이 업데이트되었습니다.");
    } else if (info.file.status === "error") {
      message.error("프로필 사진 업로드에 실패했습니다.");
    }
  };

  const uploadProps = {
    action: "https://wanted66.r-e.kr/api/user/update-profile-picture",
    showUploadList: false,
    onChange: handleProfilePicChange,
    headers: {
      Authorization: "Bearer YOUR_ACCESS_TOKEN", // 필요한 경우 인증 헤더 추가
    },
  };

  const handleHistoryClick = (path) => {
    navigate(path);
  };

  return (
    <div className="my-page">
      <div className="profile">
        <div className="profile-image-container">
          <img src={profilePic} alt="프로필" className="profile-image" />
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>프로필 사진 변경</Button>
          </Upload>
        </div>
        <h1 className="name">윤주원</h1>
        <p className="title" onClick={showModal}>
          {currentTitle}
        </p>
      </div>
      <div className="history-section">
        <h2>이력</h2>
        <ul>
          <li className="list-item-button" onClick={handleReportsListClick}>
            제보 이력
          </li>
          <li
            className="list-item-button"
            onClick={() => handleHistoryClick("/bounties")}
          >
            현상금 이력
          </li>
          <li
            className="list-item-button"
            onClick={() => handleHistoryClick("/wanted")}
          >
            수배 등록 이력
          </li>
          <li
            className="list-item-button"
            onClick={() => handleHistoryClick("/sendFriendRequest")}
          >
            친구 요청 이력
          </li>
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
              <Text>{item}</Text>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default MyPage;
