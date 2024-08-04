import React, { useState, useEffect } from "react";
import { Card, Avatar, Spin, message, Button, Tabs, Modal, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./FriendList.css"; // 수정된 CSS 파일을 임포트

const { TabPane } = Tabs;
const { Search } = Input;

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]); // 필터링된 친구 목록 상태 추가
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addedFriends, setAddedFriends] = useState([]);

  // 서버에서 친구 목록을 가져오는 함수
  const fetchFriends = async () => {
    try {
      const exampleFriends = [
        {
          id: 1,
          name: "John Doe",
          nickname: "johnny", // 닉네임 추가
          avatar: "https://randomuser.me/api/portraits/men/1.jpg",
          title: "Software Engineer",
          description: "Loves coding and coffee.",
        },
        {
          id: 2,
          name: "Jane Smith",
          nickname: "janeart", // 닉네임 추가
          avatar: "https://randomuser.me/api/portraits/women/2.jpg",
          title: "Graphic Designer",
          description: "Passionate about design and art.",
        },
        {
          id: 3,
          name: "Sam Wilson",
          nickname: "sammy", // 닉네임 추가
          avatar: "https://randomuser.me/api/portraits/men/3.jpg",
          title: "Product Manager",
          description: "Focused on delivering great products.",
        },
      ];
      setFriends(exampleFriends);
      setFilteredFriends(exampleFriends); // 초기 필터링된 목록 설정
      // const response = await fetch("https://wanted66.r-e.kr/api/friends"); // 친구 목록 API 엔드포인트
      // if (!response.ok) {
      //   throw new Error("친구 목록을 가져오는 데 실패했습니다.");
      // }
      // const data = await response.json();
      // setFriends(data);
      // setFilteredFriends(data);
    } catch (error) {
      setError(error.message);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트가 마운트될 때 친구 목록을 가져옵니다
  useEffect(() => {
    fetchFriends();
  }, []);

  // 친구 목록을 필터링하는 함수
  useEffect(() => {
    setFilteredFriends(
      friends.filter((friend) =>
        friend.nickname.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, friends]);

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

  const handleAdd = (id) => {
    const friendToAdd = friends.find((friend) => friend.id === id);

    // 이미 추가된 친구인지 확인
    if (addedFriends.some((friend) => friend.id === id)) {
      message.info("이미 추가된 친구입니다.");
      return;
    }

    if (friendToAdd) {
      setAddedFriends([...addedFriends, friendToAdd]);
      message.success("친구가 추가되었습니다.");
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
                    src={friend.avatar}
                    icon={!friend.avatar && <UserOutlined />}
                    size={64}
                    className="friend-list-avatar"
                  />
                  <Card.Meta
                    className="friend-list-card-meta"
                    title={friend.name}
                    description={friend.description}
                  />
                  <Button
                    type="primary"
                    className="friend-delete-button"
                    danger
                    onClick={(e) => {
                      e.stopPropagation(); // 클릭 이벤트 전파 방지
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
              style={{ height: "32px" }} // 입력 필드와 버튼의 높이를 맞추기 위해 설정
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
                    src={friend.avatar}
                    icon={!friend.avatar && <UserOutlined />}
                    size={64}
                    className="friend-list-avatar"
                  />
                  <Card.Meta
                    className="friend-list-card-meta"
                    title={`${friend.nickname} (${friend.name})`}
                    description={friend.description}
                  />
                  <Button
                    type="primary"
                    className="friend-add-button"
                    onClick={(e) => {
                      e.stopPropagation(); // 클릭 이벤트 전파 방지
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
              src={selectedFriend.avatar}
              icon={!selectedFriend.avatar && <UserOutlined />}
              size={250}
              className="friend-list-modal-avatar"
            />
            <div className="friend-list-modal-info">
              <h3>{selectedFriend.name}</h3>
              <h4>{selectedFriend.title || "No Title"}</h4>
              <p>{selectedFriend.description || "No Description"}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FriendList;
