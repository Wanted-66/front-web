import React, { useContext } from "react";
import "./List.css";
import { Button, ConfigProvider, Space, Card } from "antd";
import { AntDesignOutlined } from "@ant-design/icons";
import { AppContext } from "../AppContext";
import { css } from "@emotion/css";
import { useNavigate } from "react-router-dom";

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
    navigate(`/post/${post.id}`, { state: { post } });
  };

  return (
    <Button
      className={linearGradientButton}
      type="primary"
      size="large"
      icon={<AntDesignOutlined />}
      onClick={() => handleButtonClick(post)}
    >
      현상수배 보기
    </Button>
  );
};

const ListComponent = () => {
  const { posts } = useContext(AppContext);

  return (
    <div className="card-container">
      {posts.map((post, index) => (
        <Card
          key={index}
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
            <div className="card-content">{post.content}</div>
            <GradientButton post={post} />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ListComponent;
