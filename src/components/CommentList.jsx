import React from "react";
import { css } from "@emotion/css";
import "./PostDetail.css";
const CommentList = ({ comments }) => (
  <div className="comments-list">
    {comments.length > 0 ? (
      comments.map((comment, index) => (
        <div key={index} className={commentStyle}>
          <p className={commentTextStyle}>{comment.text}</p>
          <span className={userNameStyle}>{comment.user}</span>
        </div>
      ))
    ) : (
      <p>댓글이 없습니다.</p>
    )}
  </div>
);

// 스타일 정의
const commentStyle = css`
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
  font-size: 1rem;
  color: #333;

  &:last-child {
    border-bottom: none;
  }
`;
const commentTextStyle = css`
  flex: 1;
`;

const userNameStyle = css`
  color: #888;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export default CommentList;
