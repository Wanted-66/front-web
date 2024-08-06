import React, { useState, useEffect } from "react";
import { Card, Avatar, Spin, message, Button, Tabs, Modal, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./FriendList.css";

const { TabPane } = Tabs;
const { Search } = Input;

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addedFriends, setAddedFriends] = useState([]);
  const [refreshToken, setRefreshToken] = useState("your_refresh_token"); // 리프레시 토큰 설정
  const [accessToken, setAccessToken] = useState(null); // 액세스 토큰 상태 추가

  // 액세스 토큰을 발급받는 함수
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
        throw new Error("액세스 토큰을 발급받는 데 실패했습니다.");
      }

      const data = await response.json();
      return data.accessToken;
    } catch (error) {
      console.error("액세스 토큰을 발급받는 데 오류가 발생했습니다:", error);
      throw error;
    }
  };

  // 서버에서 친구 목록을 가져오는 함수
  const fetchFriends = async (token) => {
    try {
      const response = await fetch("https://wanted66.r-e.kr/api/friend", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("친구 목록을 가져오는 데 실패했습니다.");
      }

      const data = await response.json();
      setFriends(data);
      setFilteredFriends(data);
    } catch (error) {
      setError(error.message);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 친구를 닉네임으로 검색하는 함수
  const fetchFriendsByNickname = async (nickname, token) => {
    try {
      const response = await fetch(`https://wanted66.r-e.kr/api/friend/${nickname}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("친구 목록을 검색하는 데 실패했습니다.");
      }

      const data = await response.json();
      setFilteredFriends(data);
    } catch (error) {
      setError(error.message);
      message.error(error.message);
    }
  };

  // 컴포넌트 마운트 시 액세스 토큰 발급 및 친구 목록 요청
  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const token = await fetchAccessToken(refreshToken);
        setAccessToken(token);
      } catch (error) {
        setError(error.message);
        message.error(error.message);
      }
    };
    getAccessToken();
  }, [refreshToken]);

  useEffect(() => {
    if (accessToken) {
      fetchFriends(accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    if (searchTerm && accessToken) {
      fetchFriendsByNickname(searchTerm, accessToken);
    } else {
      setFilteredFriends(friends);
    }
  }, [searchTerm, friends, accessToken]);

  const handleDelete = (id) => {
    setFriends(friends.filter((friend) => friend.id !== id));
    setFilteredFriends(filteredFriends.filter((friend) => friend.id !== id));
    setAddedFriends(addedFriends.filter((friend) => friend.id !== id));
  };

  const handleCardClick = (friend) => {
    setSelectedFriend(friend);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleAdd =async  (id) => {
    const friendToAdd = friends.find((friend) => friend.id === id);

    if (addedFriends.some((friend) => friend.id === id)) {
      message.info("이미 추가된 친구입니다.");
      return;
    }

    if (friendToAdd) {
      try {
        const response = await fetch("https://wanted66.r-e.kr/api/friend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            senderId: "SENDER_ID_HERE", // 보내는 쪽의 ID
            receiverId: id, // 친구의 ID
            status: "WAITING",
          }),
        });

        if (!response.ok) {
          throw new Error("친구 요청을 보내는 데 실패했습니다.");
        }

        setAddedFriends([...addedFriends, friendToAdd]);
        message.success("친구가 추가되었습니다.");
      } catch (error) {
        message.error(error.message);
        console.error("Failed to add friend:", error.message);
      }
    }
  };


  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>오류가 발생했습니다: {error}</div>;
  }

  return (
    <div className="friend-list-container">
      <Tabs defaultActiveKey="1" className="friend-list-tabs">
        <TabPane tab="친구 목록" key="1">
          {friends.length === 0 ? (
            <div>친구가 없습니다.</div>
          ) : (
            friends.map((friend) => (
              <Card
                key={friend.id}
                className="friend-list-card"
                onClick={() => handleCardClick(friend)}
              >
                <div className="friend-list-card-content">
                  <Avatar
                    src={friend.profileImage} // 필드 이름 수정
                    icon={!friend.profileImage && <UserOutlined />}
                    size={64}
                    className="friend-list-avatar"
                  />
                  <Card.Meta
                    className="friend-list-card-meta"
                    title={friend.name}
                    description={friend.introduction} // 필드 이름 수정
                  />
                  <Button
                    type="primary"
                    className="friend-delete-button"
                    danger
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(friend.id);
                    }}
                  >
                    친구 삭제
                  </Button>
                </div>
              </Card>
            ))
          )}
        </TabPane>
        <TabPane tab="친구 찾기" key="2">
          <div className="friend-search-container">
            <Search
              placeholder="유저 닉네임으로 검색"
              onSearch={handleSearch}
              enterButton
              className="friend-search-input"
              style={{ height: "32px" }}
            />
          </div>
          {filteredFriends.length === 0 ? (
            <div>검색 결과가 없습니다.</div>
          ) : (
            filteredFriends.map((friend) => (
              <Card
                key={friend.id}
                className="friend-list-card"
                onClick={() => handleCardClick(friend)}
              >
                <div className="friend-list-card-content">
                  <Avatar
                    src={friend.profileImage} // 필드 이름 수정
                    icon={!friend.profileImage && <UserOutlined />}
                    size={64}
                    className="friend-list-avatar"
                  />
                  <Card.Meta
                    className="friend-list-card-meta"
                    title={`${friend.nickname} (${friend.name})`}
                    description={friend.introduction} // 필드 이름 수정
                  />
                  <Button
                    type="primary"
                    className="friend-add-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd(friend.id);
                    }}
                  >
                    친구 추가
                  </Button>
                </div>
              </Card>
            ))
          )}
        </TabPane>
      </Tabs>
      {selectedFriend && (
        <Modal
          title={selectedFriend.name}
          visible={isModalVisible}
          onCancel={handleModalCancel}
          footer={null}
          centered
        >
          <div className="friend-list-modal-content">
            <Avatar
              src={selectedFriend.profileImage} // 필드 이름 수정
              icon={!selectedFriend.profileImage && <UserOutlined />}
              size={250}
              className="friend-list-modal-avatar"
            />
            <div className="friend-list-modal-info">
              <h3>{selectedFriend.name}</h3>
              <h4>{selectedFriend.designation || "No Title"}</h4> {/* 필드 이름 수정 */}
              <p>{selectedFriend.introduction || "No Description"}</p> {/* 필드 이름 수정 */}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FriendList;
