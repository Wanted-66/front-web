//제보 이력 페이지
import React, { useContext } from "react";
import { Button, Card } from "antd";
import { AntDesignOutlined } from "@ant-design/icons";
import { AppContext } from "../AppContext";
import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";

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
    navigate(`/reports/${post.id}`, { state: { post } });
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

const ReportsList = () => {
  const { reports } = useContext(AppContext);

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
