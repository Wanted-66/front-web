import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./NavigationBar.module.css";
import largeIcon from "../assets/logo.png";
import smallIcon from "../assets/smallLogo.png";
import bell from "../assets/image 28.png";

const NavigationBar = () => {
  const location = useLocation();
  // 로그인 페이지 경로가 "/login"인지 확인
  if (location.pathname === "/Login") {
    return null; // 로그인 페이지에서는 네비게이션 바를 렌더링하지 않음
  }
  return (
    <>
      <div className={styles.navigationBar}>
        <div className={styles.counter}>
          <img src={largeIcon} alt="logo" />
        </div>
        <div className={styles.notification}>
          <img src={bell} alt="notification" />
          <span className={styles.notificationBadge}>1</span>
        </div>
      </div>
    </>
  );
};

export default NavigationBar;
