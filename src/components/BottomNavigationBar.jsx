import styles from "./NavigationBar.module.css";
import smallIcon from "../assets/smallLogo.png";
import React from "react";
import { Link } from "react-router-dom";

const BottomNavigationBar = () => {
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
