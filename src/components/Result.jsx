import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import "./Result.css";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const Result = () => {
  const navigate = useNavigate();
  const [voteCounts, setVoteCounts] = useState({ approve: 0, disapprove: 0 });
  const [isVotingEnded, setIsVotingEnded] = useState(false);

  useEffect(() => {
    const checkIfVotingEnded = () => {
      const startTime = localStorage.getItem("postStartTime");
      if (startTime) {
        const deadline = new Date(
          parseInt(startTime) + 7 * 24 * 60 * 60 * 1000
        ); // 1주일 후
        const now = new Date();
        if (now > deadline) {
          setIsVotingEnded(true);
        } else {
          setIsVotingEnded(false);
        }
      }
    };

    const fetchVoteCounts = async () => {
      if (isVotingEnded) {
        try {
          const response = await fetch(
            "https://your-api-endpoint.com/vote-counts"
          );
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${errorData.description}`);
          }

          const data = await response.json();
          setVoteCounts(data.voteCounts);
        } catch (err) {
          console.error("Failed to fetch vote counts:", err);
          // 오류 처리
        }
      } else {
        message.error("투표 시간이 아직 종료되지 않았습니다.");
        navigate("/vote"); // 투표 페이지로 리디렉션
      }
    };

    checkIfVotingEnded();
    fetchVoteCounts();
  }, [navigate, isVotingEnded]);

  const data = {
    labels: ["찬성", "반대"],
    datasets: [
      {
        label: "투표 결과",
        data: [voteCounts.approve, voteCounts.disapprove],
        backgroundColor: ["#04befe", "#ff4d4f"],
        borderColor: ["#ffffff", "#ffffff"],
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
