import React, { useState } from "react";
import { Input, Button } from "antd";
import { css } from "@emotion/css";
import "./PostDetail.css";
const { TextArea } = Input;

const CommentInput = ({ onSubmit }) => {
  const [comment, setComment] = useState("");

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    if (comment.trim()) {
      // 댓글 데이터와 유저 닉네임을 포함하여 제출
      onSubmit({ text: comment.trim(), user: "닉네임" });
      setComment("");
    }
  };

  return (
    <div className="comment-input-container">
      <TextArea
        value={comment}
        onChange={handleChange}
        placeholder="댓글을 입력하세요"
        autoSize={{ minRows: 3, maxRows: 6 }}
        className="comment-input-textarea"
      />
      <Button type="primary" onClick={handleSubmit} className={buttonStyle}>
        댓글 작성
      </Button>
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
