import React from "react";
import "./MyPage.css";
import profileImage from "../assets/profile_image.png";

const MyPage = () => {
  return (
    <div className="my-page">
      <div className="profile">
        <img src={profileImage} alt="프로필" className="profile-image" />
        <h1 className="name">윤주원</h1>
        <p className="title">범죄왕(칭호)</p>
      </div>
      <div className="info-section">
        <h2>회원 정보 관리</h2>
        <ul>
          <li>관리</li>
          <li>수정</li>
          <li>등록</li>
        </ul>
      </div>
      <div className="history-section">
        <h2>이력</h2>
        <ul>
          <li>검거 이력</li>
          <li>제보 이력</li>
          <li>현상금 이력</li>
          <li>수배 등록 이력</li>
        </ul>
      </div>
    </div>
  );
};

export default MyPage;
