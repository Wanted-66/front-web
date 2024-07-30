import React, { useContext } from "react";
import { Button, Card, ConfigProvider } from "antd";
import { AntDesignOutlined } from "@ant-design/icons";
import { AppContext } from "../AppContext";
import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import "./WantedList.css";

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
    navigate(`/postDetail/${post.id}`, { state: { post } });
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
  // 임시 데이터
  const wanted = [
    {
      id: 1,
      title: "사례: 김철수",
      description: "도난 사건의 주요 용의자입니다. 경고: 위험할 수 있음.",
    },
    {
      id: 2,
      title: "사례: 박영희",
      description: "부유층을 대상으로 한 사기 사건의 피의자입니다.",
    },
    {
      id: 3,
      title: "사례: 이민호",
      description: "강도 사건에 관련된 용의자입니다. 정보 제공 시 보상 있음.",
    },
  ];

  // 실제 AppContext 사용 시 주석 처리
  // const { wanted } = useContext(AppContext);
  // if (!wanted || wanted.length === 0) {
  //   return <p>수배 이력이 없습니다.</p>;
  // }

  return (
    <div className="card-container">
      <h2>수배 이력</h2>
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
