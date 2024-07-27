import React, { useState, useEffect } from "react";
import { Layout, Progress, Avatar, Button, Calendar, message } from "antd";
import avatar1 from "./assets/image.png";
import "./main.css";
import moment from "moment";

const { Content, Footer } = Layout;

const Main = () => {
  const [avatars, setAvatars] = useState([]); // 초기 빈 배열
  const [startDate, setStartDate] = useState(null); // 시작 날짜 상태 추가
  const [endDate, setEndDate] = useState(null); // 종료 날짜 상태 추가
  const [daysLeft, setDaysLeft] = useState(null);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [showBlankScreen, setShowBlankScreen] = useState(false);

  const addAvatar = (newAvatarSrc) => {
    setAvatars([...avatars, newAvatarSrc]);
  };

  const handleAddAvatar = () => {
    const newAvatarSrc = avatar1;
    addAvatar(newAvatarSrc);
  };

  const calculateDaysLeft = (selectedDate) => {
    const today = moment().startOf("day");
    const end = moment(selectedDate).startOf("day");
    return end.diff(today, "days");
  };

  const calculateProgress = (endDate) => {
    if (!startDate || !endDate) return 0;

    const today = moment().startOf("day");
    const end = moment(endDate).startOf("day");
    const totalDays = end.diff(moment(startDate).startOf("day"), "days") + 1;
    const daysElapsed = totalDays - calculateDaysLeft(endDate);

    return Math.min((daysElapsed / totalDays) * 100, 100);
  };

  const onSelectDate = (date) => {
    if (!startDate) {
      setStartDate(date.toDate()); // 시작 날짜 설정
    } else {
      const selectedEndDate = date.toDate();
      if (moment(selectedEndDate).isBefore(moment(startDate))) {
        message.error("종료 날짜는 시작 날짜 이후여야 합니다.");
        return; // 종료 날짜가 시작 날짜보다 이전일 경우 처리하지 않음
      }
      setEndDate(selectedEndDate); // 종료 날짜 설정
      const leftDays = calculateDaysLeft(selectedEndDate);
      setDaysLeft(leftDays);
      setProgressPercentage(calculateProgress(selectedEndDate));
      setShowBlankScreen(leftDays <= 0);
    }
  };

  // 현재 날짜 이전의 날짜를 비활성화
  const disabledDate = (current) => {
    return current && current < moment().startOf("day");
  };

  useEffect(() => {
    if (endDate) {
      const updateProgress = () => {
        setProgressPercentage(calculateProgress(endDate));
      };

      // 초기 progress 업데이트
      updateProgress();

      // 매일 progress 업데이트
      const interval = setInterval(updateProgress, 86400000); // 24시간

      return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 정리
    }
  }, [endDate]);

  return (
    <Layout className="main-container">
      <div className="main-content-wrapper">
        <Content className="main-content">
          <div
            className={`avatar-group-container ${
              avatars.length > 0 ? "has-avatars" : ""
            }`}
          >
            {avatars.map((src, index) => (
              <div key={index} className="avatar-wrapper">
                <Avatar
                  key={index}
                  src={src}
                  size={125}
                  style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
                />
              </div>
            ))}
          </div>
          <div
            className={`text-d-day-wrapper ${
              avatars.length > 0 ? "has-avatars" : ""
            }`}
          >
            <div className="text-d-day">
              {/* 조건부 렌더링 */}
              {startDate && endDate ? (
                <>
                  <div className="date-info">
                    시작 날짜: {moment(startDate).format("YYYY-MM-DD")}
                  </div>
                  <div className="date-info">
                    종료 날짜: {moment(endDate).format("YYYY-MM-DD")}
                  </div>
                  <div className="date-info">
                    달성까지:{" "}
                    {daysLeft !== null
                      ? `${daysLeft}일 남음`
                      : "날짜를 선택하세요"}
                  </div>
                </>
              ) : (
                <div>시작 날짜와 종료 날짜를 선택하세요</div>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <Progress
              percent={progressPercentage}
              showInfo={false}
              strokeColor="#274C77"
              trailColor="#6096BA"
              strokeWidth={20}
            />
          </div>

          <Calendar
            fullscreen={false}
            style={{ margin: "0 auto" }}
            onSelect={onSelectDate}
            disabledDate={disabledDate}
          />

          <div className="text-quote">
            사람들은 동기 부여는 오래가지 않는다고 말한다.
            <br />
            목욕도 마찬가지다. 그래서 매일 하라고 하는 것이다.
            <br />- 지그 지글러 -
          </div>
          <div className="submit-button">
            <Button type="primary" onClick={handleAddAvatar}>
              Add Avatar
            </Button>
          </div>
        </Content>
      </div>
      <Footer style={{ textAlign: "center" }}></Footer>
    </Layout>
  );
};

export default Main;
