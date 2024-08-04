import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Drawer } from "antd";
import styles from "./NavigationBar.module.css";
import largeIcon from "../assets/logo.png";
import bell from "../assets/image 28.png";

const NavigationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [notifications, setNotifications] = useState([]);

  // 현재 시간 설정
  useEffect(() => {
    const now = new Date();
    setCurrentTime(
      `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(
        2,
        "0"
      )}.${String(now.getDate()).padStart(2, "0")} ${String(
        now.getHours()
      ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    );
  }, []); // 빈 배열을 의존성으로 지정하여 한 번만 실행되게 함

  // 알림 가져오기
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "https://your-api-endpoint.com/notifications",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();
        setNotifications(data.notifications);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // 로그인 페이지 경로가 "/login"인지 확인
  if (location.pathname === "/login") {
    return null; // 로그인 페이지에서는 네비게이션 바를 렌더링하지 않음
  }

  const showLoading = () => {
    setOpen(true);
    setLoading(true);

    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleDrawerClick = (type, id) => {
    if (type === "notification") {
      navigate(`/vote/${id}`);
    } else if (type === "comments") {
      navigate("/comments");
    } else if (type === "other") {
      // 다른 페이지로 이동할 경우 처리
    }
  };

  return (
    <>
      <div className={styles.navigationBar}>
        <div className={styles.counter}>
          <Link to="/">
            <img src={largeIcon} alt="logo" />
          </Link>
        </div>
        <div className={styles.notification}>
          <img src={bell} alt="notification" onClick={showLoading} />
          <span className={styles.notificationBadge}>
            {notifications.length}
          </span>
        </div>
      </div>
      <Drawer
        closable
        destroyOnClose
        title={<p>알림</p>}
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <p
                  key={notification.id}
                  onClick={() =>
                    handleDrawerClick(notification.type, notification.id)
                  }
                  style={{ cursor: "pointer", marginBottom: "10px" }}
                >
                  {notification.message} - {notification.time}
                </p>
              ))
            ) : (
              <p>새로운 알림이 없습니다.</p>
            )}
          </div>
        )}
      </Drawer>
    </>
  );
};

export default NavigationBar;
