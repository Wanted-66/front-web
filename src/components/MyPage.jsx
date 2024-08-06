import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, List, Typography, Upload, message } from "antd";
import profileImage from "../assets/profile_image.png";
import "./MyPage.css";
import { UploadOutlined } from "@ant-design/icons";

const { Text } = Typography;

const MyPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("범죄왕(칭호)");
  const [titles, setTitles] = useState([]);
  const [profilePic, setProfilePic] = useState(profileImage);
  const [newTitle, setNewTitle] = useState(""); // 칭호 추가용 상태

  const navigate = useNavigate();

  useEffect(() => {
    // 컴포넌트 마운트 시 칭호 목록 가져오기
    const fetchTitles = async () => {
      try {
        const response = await fetch("https://wanted66.r-e.kr/api/user/designation", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch titles");
        }

        const data = await response.json();
        setTitles(data);
        setCurrentTitle(data[0]); // 기본 칭호를 첫 번째 칭호로 설정
      } catch (error) {
        message.error("칭호를 가져오는 데 실패했습니다.");
      }
    };

    fetchTitles();
  }, []);

  const fetchAccessToken = async (refreshToken) => {
    try {
      const response = await fetch("https://wanted66.r-e.kr/api/auth/issue/access", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${refreshToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch access token");
      }

      const data = await response.json();
      return data.accessToken;
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw error;
    }
  };

  const changeTitle = async (newTitle) => {
    const refreshToken = "your-refresh-token"; // 실제 Refresh Token으로 교체

    try {
      const accessToken = await fetchAccessToken(refreshToken);

      const response = await fetch(
        `https://wanted66.r-e.kr/api/user/designation/${encodeURIComponent(newTitle)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`, // 발급받은 Access Token을 사용
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update title");
      }

      setCurrentTitle(newTitle);
      message.success("칭호가 업데이트되었습니다.");
    } catch (error) {
      message.error("칭호를 업데이트하는 데 실패했습니다.");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleProfilePicChange = async (file) => {
    const refreshToken = "your-refresh-token"; // 실제 Refresh Token으로 교체

    try {
      const accessToken = await fetchAccessToken(refreshToken);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("https://wanted66.r-e.kr/api/user/image", {
        method: "PATCH",
        body: formData,
        headers: {
          "Authorization": `Bearer ${accessToken}`, // 발급받은 Access Token을 사용
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update profile picture");
      }

      const data = await response.json();
      setProfilePic(data.url);
      message.success("프로필 사진이 업데이트되었습니다.");
    } catch (error) {
      message.error("프로필 사진 업로드에 실패했습니다.");
    }
  };

  const uploadProps = {
    customRequest: async ({ file }) => {
      await handleProfilePicChange(file);
    },
    showUploadList: false,
    headers: {
      Authorization: "Bearer YOUR_ACCESS_TOKEN",
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
        <p className="title" onClick={() => setIsModalOpen(true)}>
          {currentTitle}
        </p>
      </div>
      <div className="history-section">
        <h2>이력</h2>
        <ul>
          <li className="list-item-button" onClick={() => navigate("/reports")}>
            제보 이력
          </li>
          <li className="list-item-button" onClick={() => navigate("/bounties")}>
            현상금 이력
          </li>
          <li className="list-item-button" onClick={() => navigate("/wanted")}>
            수배 등록 이력
          </li>
          <li className="list-item-button" onClick={() => navigate("/sendFriendRequest")}>
            친구 요청 이력
          </li>
        </ul>
      </div>
      <Modal
        title="칭호 정보"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
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
