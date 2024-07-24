import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./PostDetail.css"; // 필요시 CSS 추가
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";

const PostDetail = () => {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);

  // 임시 데이터 (실제로는 서버에서 받아온 데이터 사용)
  const post = {
    id: postId,
    title: "게 임 금 지",
    description: "수배에 대한 상세 설명",
    category: "게임 중독",
    customCategory: "",
    dateRange: ["2024-07-01", "2024-07-31"],
    location: "서울",
    priority: 3,
    reward: 1000000,
    image:
      "https://an2-img.amz.wtchn.net/image/v1/watcha/image/upload/c_fill,h_1080,q_80,w_1920/v1609744969/wnelhqncan9yi3ekiibv.jpg", // 예시 이미지 URL
  };

  const handleCommentSubmit = (newComment) => {
    setComments([...comments, newComment]);
  };

  return (
    <div className="post-detail-container">
      <h1 className="post-title">{post.title}</h1>
      <img src={post.image} alt="표지 사진" className="post-image" />
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
          <strong>우선순위:</strong> {post.priority}
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
