import React, { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";

const RedirectPage = () => {
  const { setCurrentUser } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // URL에서 카카오 인증 코드를 추출합니다.
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    if (code) {
      // 서버에 인증 코드 보내기
      fetch("YOUR_SERVER_ENDPOINT_TO_HANDLE_KAKAO_CODE", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
        .then((response) => response.json())
        .then((data) => {
          // 서버에서 사용자 정보를 받아 currentUser 설정
          setCurrentUser(data.user);
          navigate("/"); // 로그인 후 홈으로 리다이렉트
        })
        .catch((error) => {
          console.error("로그인 처리 오류:", error);
          // 오류 처리
        });
    }
  }, [location.search, setCurrentUser, navigate]);

  return <div>로그인 처리 중...</div>;
};

export default RedirectPage;
