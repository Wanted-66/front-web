//수배 이력 페이지
import React, { useContext } from "react";
import { Button, Card, ConfigProvider } from "antd";
import { AntDesignOutlined } from "@ant-design/icons";
import { AppContext } from "../AppContext";
import { css } from "@emotion/react";
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
    navigate(`/wanted/${post.id}`, { state: { post } });
  };

  return (
    <Button
      className={linearGradientButton}
      type="primary"
      size="large"
      icon={<AntDesignOutlined />}
      onClick={handleButtonClick}
    >
      수배 상세 보기
    </Button>
  );
};

const WantedList = () => {
  const { wanted } = useContext(AppContext);

  if (!wanted || wanted.length === 0) {
    return <p>수배 이력이 없습니다.</p>;
  }

  return (
    <div className="card-container">
      {wanted.map((item) => (
        <Card
          key={item.id}
          title={<div className="card-title">{item.title}</div>}
          style={{ width: "100%", textAlign: "left", marginBottom: "16px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="card-content">{item.description}</div>
            <GradientButton post={item} />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default WantedList;
