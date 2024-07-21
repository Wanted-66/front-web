import React, { useState } from "react";
import { Layout, Progress, Calendar, Avatar, Button } from "antd";
import avatar1 from "./assets/image.png";
import "./main.css";

const { Content, Footer } = Layout;

const Main = () => {
  const [avatars, setAvatars] = useState([]); //초기 빈배열

  const addAvatar = (newAvatarSrc) => {
    setAvatars([...avatars, newAvatarSrc]);
  };
  //예시
  const handleAddAvatar = () => {
    //const newAvatarSrc = `path/to/avatar${avatars.length + 1}.png`; // 새로운 아바타 URL 생성
    const newAvatarSrc = avatar1;
    addAvatar(newAvatarSrc);
  };

  return (
    <Layout>
      <Content style={{ padding: "0 50px", marginTop: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <div className="avatar-group-container">
            {avatars.map((src, index) => (
              <Avatar
                key={index}
                src={src}
                size={125}
                style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
              />
            ))}
          </div>
        </div>
        <div className="text-d-day-wrapper"></div>
        <div className="text-d-day">달성까지 D-Day</div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Progress
            percent={80}
            showInfo={false}
            strokeColor="#274C77"
            trailColor="#6096BA"
            strokeWidth={20}
          />
        </div>
        <Calendar
          fullscreen={false}
          style={{ margin: "0 auto" /*maxWidth: "400px"*/ }}
        />
        <div className="text-quote">
          사람들은 동기 부여는 오래가지 않는다고 말한다.
          <br />
          목욕도 마찬가지다. 그래서 매일 하라고 하는 것이다.
          <br />- 지그 지글러 -
        </div>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button type="primary" onClick={handleAddAvatar}>
            Add Avatar
          </Button>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}></Footer>
    </Layout>
  );
};

export default Main;
