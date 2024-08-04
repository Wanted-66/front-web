import React, { useState, useEffect } from "react";
import { Card, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import "./MyReportList.css"; // CSS 스타일 파일 임포트

const MyReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 유저 이메일 설정 (여기서 이메일을 가져오거나 prop으로 받는 방법을 사용)
  const userEmail = "user@naver.com"; // 실제 이메일로 대체 필요

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(
          `https://wanted66.r-e.kr/api/wanted/all/${userEmail}`
        );
        if (!response.ok) {
          throw new Error("수배 목록을 가져오는 데 실패했습니다.");
        }
        const data = await response.json();
        setReports(data);
      } catch (error) {
        setError(error.message);
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [userEmail]);

  const handleCardClick = (id) => {
    navigate(`/wanted/${id}`); // ID를 사용하여 상세 페이지로 이동
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>오류가 발생했습니다: {error}</div>;
  }

  return (
    <div className="myreport-container">
      <h2>내 수배 목록</h2>
      {reports.length === 0 ? (
        <div>수배 목록이 없습니다.</div>
      ) : (
        reports.map((report) => (
          <Card
            key={report.id}
            className="myreport-card"
            cover={
              report.mainImage ? (
                <img
                  alt={`수배자 ${report.title}`}
                  src={report.mainImage} // 실제 이미지 URL로 대체
                  className="myreport-image"
                />
              ) : (
                <img
                  alt="기본 프로필 이미지"
                  src="https://example.com/path/to/default/image.png" // 기본 이미지 URL로 대체
                  className="myreport-image"
                />
              )
            }
            onClick={() => handleCardClick(report.id)} // 카드 클릭 시 핸들러 호출
            hoverable // 카드에 호버 효과 추가
          >
            <Card.Meta
              className="myreport-card-meta"
              title={report.title}
              description={report.description}
            />
          </Card>
        ))
      )}
    </div>
  );
};

export default MyReportList;
