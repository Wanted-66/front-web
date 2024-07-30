import React, { useState, useRef, useEffect } from "react";
import { Layout, Progress, Avatar, Button, Calendar, message } from "antd";
import { useNavigate } from "react-router-dom";
import { FloatButton } from "antd";
import avatar1 from "./assets/image.png";
import "./main.css";
import moment from "moment";
import { EditOutlined } from "@ant-design/icons";

const { Content, Footer } = Layout;

const Main = () => {
  const [avatars, setAvatars] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [showBlankScreen, setShowBlankScreen] = useState(false);
  const containerRef = useRef(null); // 컨테이너의 참조를 위한 Ref
  const navigate = useNavigate();

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
      setStartDate(date.toDate());
    } else {
      const selectedEndDate = date.toDate();
      if (moment(selectedEndDate).isBefore(moment(startDate))) {
        message.error("종료 날짜는 시작 날짜 이후여야 합니다.");
        return;
      }
      setEndDate(selectedEndDate);
      const leftDays = calculateDaysLeft(selectedEndDate);
      setDaysLeft(leftDays);
      setProgressPercentage(calculateProgress(selectedEndDate));
      setShowBlankScreen(leftDays <= 0);
    }
  };

  const disabledDate = (current) => {
    return current && current < moment().startOf("day");
  };

  useEffect(() => {
    if (endDate) {
      const updateProgress = () => {
        setProgressPercentage(calculateProgress(endDate));
      };

      updateProgress();

      const interval = setInterval(updateProgress, 86400000); // 24시간

      return () => clearInterval(interval);
    }
  }, [endDate]);

  // 드래그 기능 추가
  useEffect(() => {
    const container = containerRef.current;
    let isDragging = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDragging = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      container.classList.add("dragging"); // 드래그 중 클래스 추가
    };

    const handleMouseLeave = () => {
      isDragging = false;
      container.classList.remove("dragging"); // 드래그 중 클래스 제거
    };

    const handleMouseUp = () => {
      isDragging = false;
      container.classList.remove("dragging"); // 드래그 중 클래스 제거
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2; // 이동 속도 조절
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleAvatarClick = () => {
    navigate("/postDetail");
  };

  return (
    <Layout className="main-container">
      <div className="main-content-wrapper">
        <Content className="main-content">
          <div
            ref={containerRef} // 참조 추가
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
                  onClick={handleAvatarClick}
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
                <div>
                  도전을 시작해 보세요! <br />
                  시작 날짜와 종료 날짜를 선택하세요
                </div>
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
      <Footer style={{ textAlign: "center" }}>{/* Footer content */}</Footer>
      <FloatButton
        className="custom-float-button"
        icon={<EditOutlined />}
        onClick={() => navigate("/register")}
      />
    </Layout>
  );
};

export default Main;
