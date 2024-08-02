import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spin, message } from "antd";
import "./PostDetail.css";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";

const PostDetail = () => {
  const { wantedId } = useParams(); // URL 파라미터에서 wantedId를 추출
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Wanted ID:", wantedId);
    const fetchPost = async () => {
      if (!wantedId) {
        setError("No post ID provided.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://wanted66.r-e.kr/api/wanted/${wantedId}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Post Data:", data); // 응답 데이터 확인
        setPost(data);
      } catch (err) {
        console.error("Fetch post error:", err);
        setError(err.message);
        message.error("Failed to load post details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [wantedId]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  const handleCommentSubmit = (newComment) => {
    setComments([...comments, newComment]);
  };

  const handleArrestClick = () => {
    navigate(`/post/${post.id}/arrest`);
  };

  return (
    <div className="post-detail-container">
      <div className="post-header">
        <h1 className="post-title">{post.title}</h1>
        <Button className="ant-btn-danger" onClick={handleArrestClick}>
          검거
        </Button>
      </div>

      {post.mainImage && (
        <img src={post.mainImage} alt="표지 사진" className="post-image" />
      )}
      <div className="post-info">
        <p>
          <strong>작성자:</strong> {post.author || "정보 없음"}
        </p>
        <p>
          <strong>설명:</strong> {post.description || "정보 없음"}
        </p>
        <p>
          {/* <strong>카테고리:</strong>{" "}
          {post.category === "기타" ? post.customCategory : post.category} */}
          <strong>카테고리:</strong> {post.category || "정보 없음"}
        </p>
        <p>
          {/* <strong>날짜 범위:</strong> {post.dateRange[0]} ~ {post.dateRange[1]} */}
          <strong>날짜 범위:</strong> {post.startDate} ~ {post.endDate}
        </p>
        <p>
          <strong>다짐:</strong> {post.promise || "정보 없음"}
        </p>
        <p>
          <strong>현상금:</strong>{" "}
          {post.prize ? post.prize.toLocaleString() : "정보 없음"} 원
        </p>
      </div>

      <div className="comments-section">
        <h2>댓글</h2>
        <CommentInput onSubmit={handleCommentSubmit} wantedId={wantedId} />
        <CommentList comments={comments} />
      </div>
    </div>
  );
};

export default PostDetail;
