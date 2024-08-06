// src/components/SendFriendRequest.js
import React, { useState, useEffect } from "react";
import { Button, Typography, message, Spin } from "antd";
import profileImage from "../assets/profile_image.png";
import "./SendFriendRequest.css"; // CSS 파일 임포트

const { Title, Text } = Typography;

const SendFriendRequest = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // 초기 상태를 true로 설정
  const [requesting, setRequesting] = useState(false);
  // const [friendRequests, setFriendRequests] = useState([
  //   { id: 1, name: "친구1", profileImg: profileImage },
  //   { id: 2, name: "친구2", profileImg: profileImage },
  //   { id: 3, name: "친구3", profileImg: profileImage },
  // ]);
  // 테스트용 이메일 주소
  const [friendRequests, setFriendRequests] = useState([]);
  const [accessToken, setAccessToken] = useState("YOUR_ACCESS_TOKEN"); // 액세스 토큰 상태 추가
  const userEmail = "user@naver.com"; // 나중에 지워야함

  // 유저의 Wanted 항목 로딩
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://wanted66.r-e.kr/api/wanted/all/${encodeURIComponent(
            userEmail
          )}`
        );
        if (!response.ok) {
          const errorMessage = await response.text(); // 응답 내용을 텍스트로 읽기
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorMessage}`
          );
        }
        const data = await response.json();

        // 데이터가 배열이므로, 첫 번째 Wanted 항목을 사용합니다
        if (data.length > 0) {
          setUserData({
            name: data[0].title || "유저 이름", // 첫 번째 Wanted의 title을 name으로 사용
            title: data[0].category || "칭호", // 첫 번째 Wanted의 category를 title로 사용
          });
        } else {
          setUserData({
            name: "유저 이름",
            title: "칭호",
          });
        }
      } catch (error) {
        message.error("유저 정보를 가져오는 데 실패했습니다.");
        console.error("Failed to fetch user data:", error.message); // 자세한 오류 메시지 로그
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userEmail]);

  // 친구 요청 목록을 가져오는 함수
  useEffect(() => {
    const fetchFriendRequests = async () => {
    try {
      if (!accessToken) {
        throw new Error("액세스 토큰이 없습니다.");
      }

      const response = await fetch(
        "https://wanted66.r-e.kr/api/friend/request", // API 엔드포인트 업데이트
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`, // 헤더에 액세스 토큰 추가
          },
        }
      );
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
      }
      const data = await response.json();
      setFriendRequests(data);
    } catch (error) {
      message.error("친구 요청 목록을 가져오는 데 실패했습니다.");
      console.error("Failed to fetch friend requests:", error.message);
    }
  };

    fetchFriendRequests();
  }, [accessToken]);

  // 친구 요청을 수락하는 함수
  const handleAcceptRequest = async (requestId) => {
    setRequesting(true);
    try {
      const response = await fetch(
        `https://wanted66.r-e.kr/api/friend`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            senderId: requestId, // 또는 적절한 값으로 설정 (수정해야함)
            receiverId: userEmail, // 또는 적절한 값으로 설정
            status: "FRIEND",
          }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text(); // 응답 내용을 텍스트로 읽기
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorMessage}`
        );
      }

      message.success("친구 요청을 수락했습니다.");
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requestId)
      );
    } catch (error) {
      message.error("친구 요청을 수락하는 데 실패했습니다.");
      console.error("Failed to accept friend request:", error.message); // 자세한 오류 메시지 로그
    } finally {
      setRequesting(false);
    }
  };


  // 친구 요청을 거절하는 함수
  const handleRejectRequest = async (requestId) => {
    setRequesting(true);
    try {
      const response = await fetch(
        `https://wanted66.r-e.kr/api/friend`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            senderId: requestId, // 또는 적절한 값으로 설정 "{보내는 쪽의 ID}"
            receiverId: userEmail, // 또는 적절한 값으로 설정 "{받는 쪽의 ID}"
            status: "REFUSAL",
          }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text(); // 응답 내용을 텍스트로 읽기
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorMessage}`
        );
      }

      message.success("친구 요청을 거절했습니다.");
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requestId)
      );
    } catch (error) {
      message.error("친구 요청을 거절하는 데 실패했습니다.");
      console.error("Failed to reject friend request:", error.message); // 자세한 오류 메시지 로그
    } finally {
      setRequesting(false);
    }
  };

  // // 친구 요청을 서버로 보내는 함수
  // const handleSendRequest = async () => {
  //   setRequesting(true);
  //   try {
  //     // 실제 API 엔드포인트가 없으므로, 이 부분은 나중에 수정 필요
  //     const response = await fetch(
  //       "https://wanted66.r-e.kr/api/friend-request",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ userEmail }),
  //       }
  //     );

  //     if (!response.ok) {
  //       const errorMessage = await response.text(); // 응답 내용을 텍스트로 읽기
  //       throw new Error(
  //         `HTTP error! status: ${response.status}, message: ${errorMessage}`
  //       );
  //     }

  //     message.success("친구 요청이 전송되었습니다.");
  //   } catch (error) {
  //     message.error("친구 요청을 보내는 데 실패했습니다.");
  //     console.error("Failed to send friend request:", error.message); // 자세한 오류 메시지 로그
  //   } finally {
  //     setRequesting(false);
  //   }
  // };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!userData) {
    return <p>유저 정보가 없습니다.</p>;
  }

  return (
    <div className="card-container">
      <div style={{ marginTop: 16 }}></div>
      <div className="friend-requests">
        <Title level={4}>친구 요청</Title>
        {friendRequests.length === 0 ? (
          <p>받은 친구 요청이 없습니다.</p>
        ) : (
          friendRequests.map((request) => (
            <div key={request.id} className="friend-request">
              <div className="friend-info">
                <img
                  src={request.profileImage || profileImage}
                  alt="profile"
                  className="profile-image"
                />
                <Text>{request.name}</Text>
              </div>
              <div className="friend-request-buttons">
                <Button
                  type="primary"
                  onClick={() => handleAcceptRequest(request.id)}
                  loading={requesting}
                  className="friend-request-button accept-button"
                >
                  수락
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleRejectRequest(request.id)}
                  loading={requesting}
                  className="friend-request-button reject-button"
                >
                  거절
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SendFriendRequest;
