import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home2.css";
import api from "../api/axiosConfig";
import comm from "../images/comm.png";
import home1 from "../images/home1.png";
import home2 from "../images/home2.png";
import home3 from "../images/home3.png";
import home4 from "../images/home4.png";

function Home2() {
  const [recentPosts, setRecentPosts] = useState({
    infoBoardPosts: [],
    freeBoardPosts: [],
    counselBoardPosts: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      const response = await api.get("/api/home2/recent");
      setRecentPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("최신 게시글 불러오기 실패:", error);
      setLoading(false);
    }
  };

  const handlePostClick = (boardType, postId) => {
    navigate(`/${boardType}?tab=detail&postId=${postId}`);
  };

  const handleBoardClick = (boardType) => {
    navigate(`/${boardType}`);
  };

  const truncateTitle = (title, maxLength = 20) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    return title;
  };

  const renderBoardSection = (title, posts, boardType) => (
    <div className="board-section">
      <div className="board-header">
        <h2>{title}</h2>
        <button
          className="more-btn"
          onClick={() => handleBoardClick(boardType)}
        >
          더보기 →
        </button>
      </div>
      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="no-posts">게시글이 없습니다</div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="post-item"
              onClick={() => handlePostClick(boardType, post.id)}
            >
              <div className="post-title">{truncateTitle(post.title)}</div>
              <div className="post-comment-count">
                <img src={comm} alt="댓글 아이콘" />
                {post.commentCount}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="home2-container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="home2-container">
      <img src={home1} alt="배너 1"></img>
      <img src={home2} alt="배너 2"></img>
      <img src={home3} alt="배너 3"></img>
      <img src={home4} alt="배너 4"></img>
      <div className="boards-grid">
        {renderBoardSection(
          "상담 게시판",
          recentPosts.counselBoardPosts,
          "counselboard",
          "#ffffffff"
        )}

        {renderBoardSection(
          "자유 게시판",
          recentPosts.freeBoardPosts,
          "freeboard",
          "#ffffffff"
        )}
        {renderBoardSection(
          "정보 게시판",
          recentPosts.infoBoardPosts,
          "infoboard",
          "#ffffffff"
        )}
      </div>
    </div>
  );
}

export default Home2;
