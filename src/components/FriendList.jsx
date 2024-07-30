import React, { useState } from "react";
import { Card, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./FriendList.css"; // 수정된 CSS 파일을 임포트

const FriendList = () => {
  const [friends, setFriends] = useState([
    { id: 1, name: "John Doe", avatar: null },
    { id: 2, name: "Jane Smith", avatar: null },
    { id: 3, name: "Bob Johnson", avatar: null },
    { id: 4, name: "Alice Brown", avatar: null },
  ]);

  return (
    <div className="friend-list-container">
      <h2>친구 목록</h2>
      {friends.map((friend) => (
        <Card
          key={friend.id}
          className="friend-list-card"
          cover={
            <div className="friend-list-card-cover">
              <Avatar
                src={friend.avatar}
                icon={!friend.avatar && <UserOutlined />}
                size={64}
                className="friend-list-avatar"
              />
            </div>
          }
        >
          <Card.Meta
            className="friend-list-card-meta"
            title={friend.name}
            description="이곳에 친구의 간단한 설명을 추가하세요."
          />
        </Card>
      ))}
    </div>
  );
};

export default FriendList;
