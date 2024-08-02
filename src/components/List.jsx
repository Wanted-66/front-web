// ListComponent.jsx
import React, { useEffect, useState, useContext } from "react";
import "./List.css";
import { Button, ConfigProvider, Card, Spin, message } from "antd";
import { AntDesignOutlined } from "@ant-design/icons";
import { AppContext } from "../AppContext";
import { css } from "@emotion/css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const GradientButton = ({ post }) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const navigate = useNavigate();

  const linearGradientButton = css`
    &.${rootPrefixCls}-btn-primary:not([disabled]):not(
        .${rootPrefixCls}-btn-dangerous
      ) {
      border-width: 0;

      > span {
        position: relative;
      }

      &::before {
        content: "";
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: 0;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `;

  const handleButtonClick = () => {
    navigate(`/post/${post.id}`, { state: { post } }); // post.id가 wanted-id로 사용됨
  };

  return (
    <Button
      className={linearGradientButton}
      type="primary"
      size="large"
      icon={<AntDesignOutlined />}
      onClick={handleButtonClick}
    >
      현상수배 보기
    </Button>
  );
};

const ListComponent = () => {
  const { userEmail } = useParams(); // URL 파라미터에서 userEmail 추출
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userEmail) {
        setError("No user email provided.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://wanted66.r-e.kr/api/wanted/all/${userEmail}`
        );
        if (!response.ok) {
          throw new Error(`API 요청 실패: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Received data:", data); // 데이터 구조 확인
        if (!Array.isArray(data)) {
          throw new Error("응답 데이터가 예상과 다릅니다.");
        }
        setPosts(data);
      } catch (err) {
        console.error("게시물 로드 오류:", err);
        setError(err.message);
        message.error("게시물 로드 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userEmail]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="card-container">
      {posts.length === 0 ? (
        <div className="no-data">No wanted posts available.</div>
      ) : (
        posts.map((post) => (
          <Card
            key={post.id}
            title={<div className="card-title">{post.title}</div>}
            style={{ width: "100%", textAlign: "left", marginBottom: "16px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="card-content">{post.description}</div>
              <GradientButton post={post} />
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default ListComponent;
