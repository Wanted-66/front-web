import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { css } from "@emotion/css";
import "./PostDetail.css";

const { TextArea } = Input;

const CommentInput = ({ onSubmit, wantedId }) => {
  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState(""); // 유저 이름 상태 추가

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleAuthorChange = (e) => {
    setAuthor(e.target.value);
  };

  const handleSubmit = async () => {
    if (comment.trim() && author.trim()) {
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
              writerEmail: author.trim(), // 이메일로 사용
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        // 댓글 작성 성공 후 상위 컴포넌트에 새로운 댓글 전달
        onSubmit({
          text: data.content,
          user: data.username,
          date: data.writeDate,
        });

        // 입력 필드 초기화
        setComment("");
        setAuthor("");
      } catch (err) {
        console.error("Failed to submit comment:", err);
        message.error("Failed to submit comment.");
      }
    } else {
      message.warning("Please enter both comment and nickname.");
    }
  };

  return (
    <div className="comment-input-container">
      <Input
        value={author}
        onChange={handleAuthorChange}
        placeholder="이메일 입력"
        className={inputStyle}
        style={{ marginBottom: 10 }}
      />
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
  );
};

// 스타일 정의
const inputStyle = css`
  margin-bottom: 10px;
`;

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
