// src/components/SendFriendRequest.jsx
import React from "react";
import { Button, Typography } from "antd";
import profileImage from "../assets/profile_image.png";
import "./SendFriendRequest.css"; // CSS 파일 임포트

const { Title, Text } = Typography;

const SendFriendRequest = () => {
  // 친구 요청 버튼 클릭 시 동작할 함수
  const handleSendRequest = () => {
    // 친구 요청을 보내는 로직을 추가합니다
    console.log("친구 요청이 전송되었습니다.");
  };

  return (
    <div className="card-container">
      <img alt="profile" src={profileImage} className="profile-image" />
      <Title level={4} className="name-title">
        유저 이름
      </Title>
      <Text type="secondary" className="user-title">
        칭호
      </Text>
      <div style={{ marginTop: 16 }}>
        <Button type="primary" size="large" onClick={handleSendRequest}>
          친구 요청 보내기
        </Button>
      </div>
    </div>
  );
};

export default SendFriendRequest;
