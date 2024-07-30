import React, { useState } from "react";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import "./MyReportList.css"; // CSS 스타일 파일 임포트
import profile from "../assets/image.png";

const MyReportList = () => {
  // 사용자 데이터와 수배 데이터 설정
  const [reports, setReports] = useState([
    {
      id: 1,
      name: "John Doe",
      report: "범죄 유형: 절도",
      imageUrl: profile,
    },
  ]);

  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleCardClick = (id) => {
    navigate(`/post/${id}`); // ID를 사용하여 상세 페이지로 이동
  };

  return (
    <div className="myreport-container">
      <h2>내 수배 목록</h2>
      {reports.map((report) => (
        <Card
          key={report.id}
          className="myreport-card"
          cover={<img alt={`수배자 ${report.name}`} src={report.imageUrl} />}
          onClick={() => handleCardClick(report.id)} // 카드 클릭 시 핸들러 호출
          hoverable // 카드에 호버 효과 추가
        >
          <Card.Meta
            className="myreport-card-meta"
            title={report.name}
            description={report.report}
          />
        </Card>
      ))}
    </div>
  );
};

export default MyReportList;
