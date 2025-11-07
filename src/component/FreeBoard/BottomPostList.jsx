import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import "./BottomPostList.css";

export default function BottomPostList({ currentPostId, onPostClick }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchNearbyPosts();
  }, [currentPostId]);

  const fetchNearbyPosts = async () => {
    try {
      const res = await api.get(
        `/api/freeboard/${currentPostId}/nearby?size=10`
      );
      setPosts(res.data.content);
    } catch (err) {
      console.error("하단 게시글 목록 조회 실패:", err);
    }
  };

  return (
    <div className="bottom-post-section">
      <h3 className="bottom-post-title">다른 게시글</h3>
      <div className="bottom-post-list">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`bottom-post-item ${
              post.id === currentPostId ? "current" : ""
            }`}
            onClick={() => onPostClick(post.id)}
          >
            <div className="bottom-post-header">
              <h4 className="bottom-post-title-text">{post.ftitle}</h4>
              {post.ffile && post.ffile !== "[]" && (
                <span className="bottom-image-badge">📷</span>
              )}
            </div>
            <div className="bottom-post-meta">
              <span>{post.username}</span>
              <span>·</span>
              <span>조회 {post.fview}</span>
              <span>·</span>
              <span>
                {post.fwriteTime
                  ? new Date(post.fwriteTime).toLocaleDateString("ko-KR")
                  : "-"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
