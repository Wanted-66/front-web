import React, { useContext } from "react";
import { Button, Card } from "antd";
import { AntDesignOutlined } from "@ant-design/icons";
import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";

// GradientButton 컴포넌트 정의
const GradientButton = ({ post }) => {
  const navigate = useNavigate();

  const linearGradientButton = css`
    &.ant-btn-primary:not([disabled]):not(.ant-btn-dangerous) {
      border-width: 0;
      position: relative;
      overflow: hidden;

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
    navigate(`/PostDetail/${post.id}`, { state: { post } });
  };

  return (
    <Button
      className={linearGradientButton}
      type="primary"
      size="large"
      icon={<AntDesignOutlined />}
      onClick={handleButtonClick}
    >
      현상금 상세 보기
    </Button>
  );
};

// BountiesList 컴포넌트 정의
const BountiesList = () => {
  // 임시 데이터 정의
  const bounties = [
    {
      id: 1,
      title: "범죄자: 김철수",
      description:
        "최근 도난 사건의 주요 용의자입니다. 정보 제공 시 보상 제공.",
    },
    {
      id: 2,
      title: "범죄자: 박영희",
      description: "사기 사건의 피의자입니다. 목격자 정보는 보상 대상입니다.",
    },
    {
      id: 3,
      title: "범죄자: 이민호",
      description:
        "강도 사건에 연루된 용의자입니다. 제공된 정보는 철저히 조사됩니다.",
    },
  ];

  // 실제 AppContext 사용 시 주석 처리
  // const { bounties } = useContext(AppContext);

  if (!bounties || bounties.length === 0) {
    return <p>현상금 이력이 없습니다.</p>;
  }

  return (
    <div className="card-container">
      {bounties.map((bounty) => (
        <Card
          key={bounty.id}
          title={<div className="card-title">{bounty.title}</div>}
          style={{ width: "100%", textAlign: "left", marginBottom: "16px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="card-content">{bounty.description}</div>
            <GradientButton post={bounty} />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default BountiesList;
