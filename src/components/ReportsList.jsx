import React, { useEffect, useState, useContext } from "react";
import { Spin, message, Card, Button } from "antd";
import { AppContext } from "../AppContext";
import { AntDesignOutlined } from "@ant-design/icons";
import "./ReportList.css";

const GradientButton = ({ report }) => {
  const handleButtonClick = () => {
    // Handle button click here
  };

  return (
    <Button
      className="gradient-button"
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
  const { currentUser } = useContext(AppContext); // 현재 로그인한 사용자 정보
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wantedId, setWantedId] = useState(null);

  useEffect(() => {
    const fetchWantedId = async () => {
      if (!currentUser) {
        setError("로그인 정보가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching Wanted ID for user:", currentUser.email);
        const response = await fetch(`/api/wanted/all/${currentUser.email}`);
        const data = await response.json();
        if (data && data.length > 0) {
          setWantedId(data[0].id); // 첫 번째 wanted 항목의 id 사용
        } else {
          setError("No Wanted IDs found for the current user.");
        }
      } catch (err) {
        console.error("Wanted ID 로드 오류:", err);
        setError(err.message);
        message.error("Wanted ID 로드 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchWantedId();
  }, [currentUser]);

  useEffect(() => {
    const fetchReports = async () => {
      if (!wantedId) return; // wantedId가 없으면 대기

      setLoading(true); // 제보 목록 로딩 시작

      try {
        console.log("Fetching reports for Wanted ID:", wantedId);
        const response = await fetch(`/api/wanted/${wantedId}/report`);
        const data = await response.json();
        setReports(data);
      } catch (err) {
        console.error("제보 이력 로드 오류:", err);
        setError(err.message);
        message.error("제보 이력 로드 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [wantedId]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!reports || reports.length === 0) {
    return <p>제보 이력이 없습니다.</p>;
  }

  return (
    <div className="card-container">
      <h2>제보 이력</h2>
      {reports.map((report) => (
        <Card
          key={report.id}
          title={<div className="card-title">{report.username}</div>}
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
            <GradientButton report={report} />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ReportsList;
