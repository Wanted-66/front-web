import styles from "./NavigationBar.module.css";
import smallIcon from "../assets/smallLogo.png";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Profile from "../assets/profile_icon.png";
import friend from "../assets/friend_icon.png";
import list from "../assets/list.png";
import home from "../assets/home.png";

const BottomNavigationBar = ({ userEmail }) => {
  const location = useLocation();
  // 로그인 페이지 경로가 "/login"인지 확인
  if (location.pathname === "/Login") {
    return null; // 로그인 페이지에서는 네비게이션 바를 렌더링하지 않음
  }
  return (
    <div>
      <nav className={styles.bottomNavigationBar}>
        <div className={styles.navItem}>
          <Link to="/MyList">
            <img src={home} alt="Home" />
          </Link>
        </div>
        <div className={styles.navItem}>
          <Link to={`/list/${userEmail}`}>
            <img src={list} alt="List" />
          </Link>
        </div>
        <div className={styles.bottomCounter}>
          <div className={styles.circleContainer}>
            <div className={styles.circle}>
              <Link to="/">
                <img src={smallIcon} alt="logo" />
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.navItem}>
          <Link to="/Friend">
            <img src={friend} alt="friend" />
          </Link>
        </div>
        <div className={styles.navItem}>
          <Link to="/mypage">
            <img src={Profile} alt="Profile" />
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default BottomNavigationBar;
