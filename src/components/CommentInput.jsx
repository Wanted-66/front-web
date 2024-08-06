import React, { useState, useEffect } from "react";
import { Input, Button, message, Spin } from "antd";
import { css } from "@emotion/css";
import "./PostDetail.css";
import CommentList from "./CommentList"; // CommentList를 임포트합니다.

const { TextArea } = Input;

const CommentInput = ({  wantedId }) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]); // 댓글 목록 상태 추가
  const [noCommentsMessageVisible, setNoCommentsMessageVisible] =
    useState(true); // 댓글이 없다는 메시지의 가시성 상태 추가

  // 댓글 목록을 불러오는 함수
  const fetchComments = async () => {
    try {
      const response = await fetch(
        `https://wanted66.r-e.kr/api/wanted/${wantedId}/comment`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setComments(data); // 댓글 목록 상태 업데이트

      // 댓글이 없을 때만 메시지 표시
      setNoCommentsMessageVisible(data.length === 0);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setError(err.message);
      message.error("Failed to fetch comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(); // 컴포넌트가 마운트될 때 댓글 목록 불러오기
  }, [wantedId]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    if (comment.trim()) {
      try {
        const response = await fetch(
          `https://wanted66.r-e.kr/api/wanted/${wantedId}/comment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: comment.trim(),
              writerEmail: "user@naver.com", // 이메일 필드가 필요 없는 경우
              username: "user123", // 여기에 실제 사용자 이름 필드를 입력합니다.
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        // 댓글 작성 성공 후 댓글 목록 갱신
        setComments((prevComments) => [
          ...prevComments,
          {
            content: data.content,
            username: data.username, // 댓글 작성자의 이름
            writeDate: new Date(data.writeDate).toLocaleString(), // 작성 날짜 포맷팅
          },
        ]);

        setComment(""); // 입력 필드 초기화

        // 댓글이 추가된 후, 댓글이 없다는 메시지 숨기기
        setNoCommentsMessageVisible(false);
      } catch (err) {
        console.error("Failed to submit comment:", err);
        message.error("댓글 작성에 실패했습니다."); // 오류 메시지 수정
      }
    } else {
      message.warning("댓글을 입력하세요.");
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <div className="comment-input-container">
        <TextArea
          value={comment}
          onChange={handleCommentChange}
          placeholder="댓글을 입력하세요"
          autoSize={{ minRows: 3, maxRows: 6 }}
          className={textAreaStyle}
        />
        <Button type="primary" onClick={handleSubmit} className={buttonStyle}>
          댓글 작성
        </Button>
      </div>
      {/* 댓글이 없다는 메시지와 댓글 목록을 조건부로 렌더링 */}
      {noCommentsMessageVisible && comments.length === 0 && (
        <div className="no-comments-message">댓글이 없습니다.</div>
      )}
      <CommentList comments={comments} /> {/* 댓글 목록 컴포넌트 추가 */}
    </div>
  );
};

// 스타일 정의
const textAreaStyle = css`
  margin-bottom: 10px;
`;

const buttonStyle = css`
  width: 100%;
  background: linear-gradient(135deg, #6253e1, #04befe);
  border: none;
  color: white;
  font-weight: bold;

  &:hover {
    background: linear-gradient(135deg, #04befe, #6253e1);
  }
`;

export default CommentInput;
