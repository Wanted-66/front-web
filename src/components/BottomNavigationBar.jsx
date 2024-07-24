import styles from "./NavigationBar.module.css";
import smallIcon from "../assets/smallLogo.png";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const BottomNavigationBar = () => {
  const location = useLocation();
  // 로그인 페이지 경로가 "/login"인지 확인
  if (location.pathname === "/Login") {
    return null; // 로그인 페이지에서는 네비게이션 바를 렌더링하지 않음
  }
  return (
    <div>
      <nav className={styles.bottomNavigationBar}>
        <div className={styles.navItem}>
          <img src="home_icon.png" alt="Home" />
          <span>Home</span>
        </div>
        <div className={styles.navItem}>
          <img src="search_icon.png" alt="Search" />
          <span>Search</span>
        </div>
        <div className={styles.bottomCounter}>
          <div className={styles.circleContainer}>
            <div className={styles.circle}>
              <img src={smallIcon} alt="logo" />
            </div>
          </div>
        </div>
        <div className={styles.navItem}>
          <img src="notifications_icon.png" alt="Notifications" />
          <span>Notifications</span>
        </div>
        <div className={styles.navItem}>
          <Link to="/mypage">
            <img src="profile_icon.png" alt="Profile" />
            <span>Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default BottomNavigationBar;
