import React from "react";
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
      제보 상세 보기
    </Button>
  );
};

// ReportsList 컴포넌트 정의
const ReportsList = () => {
  // 샘플 데이터 정의
  const reports = [
    {
      id: 1,
      title: "제보자: 홍길동",
      description:
        "최근에 목격된 사건에 대한 제보입니다. 사건에 대한 자세한 정보가 필요합니다.",
    },
    {
      id: 2,
      title: "제보자: 이순신",
      description:
        "범죄 발생 현장에 대한 제보입니다. 자세한 목격 정보가 포함되어 있습니다.",
    },
    {
      id: 3,
      title: "제보자: 강감찬",
      description:
        "사건과 관련된 중요한 정보를 제공한 제보입니다. 추가 정보가 필요합니다.",
    },
  ];

  // 실제 AppContext 사용 시 주석 처리
  // const { reports } = useContext(AppContext);

  if (!reports || reports.length === 0) {
    return <p>제보 이력이 없습니다.</p>;
  }

  return (
    <div className="card-container">
      {reports.map((report) => (
        <Card
          key={report.id}
          title={<div className="card-title">{report.title}</div>}
          style={{ width: "100%", textAlign: "left", marginBottom: "16px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="card-content">{report.description}</div>
            <GradientButton post={report} />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ReportsList;
