import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./Result.css";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const Result = () => {
  //const [voteCounts, setVoteCounts] = useState({ approve: 0, disapprove: 0 });
  const navigate = useNavigate();

  //   useEffect(() => {
  //     // 로컬 스토리지에서 투표 결과를 가져옴
  //     const savedVoteCounts = JSON.parse(localStorage.getItem("voteCounts")) || {
  //       approve: 0,
  //       disapprove: 0,
  //     };
  //     setVoteCounts(savedVoteCounts);
  //   }, []);

  //   const handleResetVotes = () => {
  //     localStorage.removeItem("voteCounts");
  //     setVoteCounts({ approve: 0, disapprove: 0 });
  //   };
  const voteCounts = { approve: 80, disapprove: 20 };

  const data = {
    labels: ["찬성", "반대"],
    datasets: [
      {
        label: "투표 결과",
        data: [voteCounts.approve, voteCounts.disapprove],
        backgroundColor: ["#04befe", "#ff4d4f"], // 파란색과 빨간색
        borderColor: ["#ffffff", "#ffffff"], // 흰색 테두리
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="result-container">
      <h1 className="result-header">투표 결과</h1>
      <div className="chart-container">
        <Pie data={data} />
      </div>
      <div className="button-container">
        <Button className="primary" onClick={() => navigate("/")}>
          메인 페이지로 돌아가기
        </Button>
      </div>
    </div>
  );
};

export default Result;
