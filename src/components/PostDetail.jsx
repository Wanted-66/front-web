import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "antd";
import "./PostDetail.css";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";

const PostDetail = () => {
  const { postId } = useParams();
  const { state } = useLocation();
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  // 임시 데이터 (실제로는 서버에서 받아온 데이터 사용)
  const post = state?.post;

  if (!post) {
    return <div>Post not found</div>;
  }
  const handleCommentSubmit = (newComment) => {
    setComments([...comments, newComment]);
  };

  // 버튼 클릭 시 호출되는 함수
  const handleArrestClick = () => {
    navigate("/Arrest"); // /Arrest 페이지로 이동
  };

  return (
    <div className="post-detail-container">
      <div className="post-header">
        <h1 className="post-title">{post.title}</h1>
        <Button className="ant-btn-danger" onClick={handleArrestClick}>
          검거
        </Button>
      </div>

      {post.image && (
        <img src={post.image} alt="표지 사진" className="post-image" />
      )}
      <div className="post-info">
        <p>
          <strong>설명:</strong> {post.description}
        </p>
        <p>
          <strong>카테고리:</strong> {post.category || post.customCategory}
        </p>
        <p>
          <strong>날짜 범위:</strong> {post.dateRange.join(" ~ ")}
        </p>
        <p>
          <strong>위치:</strong> {post.location}
        </p>
        <p>
          <strong>현상금:</strong> {post.reward.toLocaleString()} 원
        </p>
      </div>

      <div className="comments-section">
        <h2>댓글</h2>
        <CommentInput onSubmit={handleCommentSubmit} />
        <CommentList comments={comments} />
      </div>
    </div>
  );
};

export default PostDetail;
