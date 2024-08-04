import React, { useState, useEffect } from "react";
import { Button, Space, Typography, Card, message } from "antd";
import { AntDesignOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Vote.css";

const { Text } = Typography;

const Vote = () => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);
  const [description, setDescription] = useState("");
  const [isVotingAllowed, setIsVotingAllowed] = useState(true); // 투표 가능 여부 상태

  useEffect(() => {
    const savedImageUrl = localStorage.getItem("uploadedImageUrl");
    const savedDescription = localStorage.getItem("description");
    setImageUrl(savedImageUrl);
    setDescription(savedDescription);

    // 시작 시간과 끝나는 시간 설정
    const startTime = localStorage.getItem("postStartTime");
    if (startTime) {
      const deadline = new Date(parseInt(startTime) + 7 * 24 * 60 * 60 * 1000); // 1주일 후
      const now = new Date();
      if (now > deadline) {
        setIsVotingAllowed(false); // 데드라인이 지났으면 투표 비활성화
      }
    } else {
      // 시작 시간이 설정되어 있지 않다면 에러 처리
      message.error("투표 시작 시간이 설정되어 있지 않습니다.");
    }
  }, []);

  const handleVote = async (vote) => {
    if (!isVotingAllowed) {
      message.error("투표 시간이 종료되었습니다.");
      return;
    }

    try {
      const response = await fetch("https://your-api-endpoint.com/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vote,
          // 추가적으로 필요한 데이터가 있을 수 있음
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.description}`);
      }

      const data = await response.json();
      // 투표 결과를 받아옴
      navigate("/result");
    } catch (err) {
      console.error("Failed to submit vote:", err);
      // 오류 처리
    }
  };

  return (
    <div className="app-container">
      <h1>검거</h1>
      <div className="content">
        <div className="image-container">
          {imageUrl ? (
            <img src={imageUrl} alt="uploaded" className="arrest-image" />
          ) : (
            <p>이미지가 없습니다.</p>
          )}
        </div>
        <div className="description-container">
          <Card
            bordered={false}
            style={{
              width: "100%",
              maxWidth: 600,
              margin: "20px auto",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
            headStyle={{ padding: 0, borderBottom: "none" }}
            title={<div className="card-title">상황 설명</div>}
          >
            <Text>{description || "상황 설명이 없습니다."}</Text>
          </Card>
        </div>
        <Space className="button-container">
          <Button
            type="primary"
            size="large"
            icon={<AntDesignOutlined />}
            className="vote-button-approve"
            onClick={() => handleVote("approve")}
            disabled={!isVotingAllowed} // 투표 가능 여부에 따라 버튼 비활성화
          >
            찬성
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<AntDesignOutlined />}
            className="vote-button-disapprove"
            onClick={() => handleVote("disapprove")}
            disabled={!isVotingAllowed} // 투표 가능 여부에 따라 버튼 비활성화
          >
            반대
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default Vote;
