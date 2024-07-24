import React from "react";
import { Typography, Divider } from "antd";
import "./LoginPage.css";

import logoSrc from "../assets/logo.png"; // 로고 이미지 경로
import kakaoLoginImgSrc from "../assets/kakao-login.png"; // 올바른 경로로 수정
import kakaoStartImgSrc from "../assets/kakao-start.png";

const { Title } = Typography;

const LoginPage = () => {
  // 카카오 로그인 페이지로 리다이렉트
  const handleKakaoLogin = () => {
    window.location.href =
      "https://kauth.kakao.com/oauth/authorize?client_id=YOUR_KAKAO_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code";
  };

  // 카카오 시작하기 페이지로 리다이렉트
  const handleKakaoStart = () => {
    // 카카오 시작하기 로직 또는 링크
    alert("카카오 시작하기를 클릭했습니다."); // 실제 링크 또는 로직으로 대체
  };

  return (
    <div className="login-container">
      {/* 로고 이미지 */}
      <div className="logo">
        <img src={logoSrc} alt="Logo" />
      </div>

      {/* 메인 텍스트 */}
      <Title level={2} className="main-title">
        습관을 만드는
        <br />
        66일간의 여정
      </Title>

      {/* 로그인 버튼 및 카카오로 시작하기 이미지 */}
      <div className="login-buttons">
        <button className="kakao-login-button" onClick={handleKakaoLogin}>
          <img src={kakaoLoginImgSrc} alt="Kakao Login" />
        </button>
        <button className="kakao-start-button" onClick={handleKakaoStart}>
          <img src={kakaoStartImgSrc} alt="Kakao Start" />
        </button>
      </div>

      {/* 명언 */}
      <Divider />
      <div className="text-quote">
        사람들은 동기 부여는 오래가지 않는다고 말한다.
        <br />
        목욕도 마찬가지다. 그래서 매일 하라고 하는 것이다.
        <br />- 지그 지글러 -
      </div>
    </div>
  );
};

export default LoginPage;
