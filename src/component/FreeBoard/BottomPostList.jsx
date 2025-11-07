import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import "./BottomPostList.css";

export default function BottomPostList({ currentPostId, onPostClick }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 🔥 currentPostId가 변경될 때만 초기화
  useEffect(() => {
    console.log("🔵 currentPostId 변경됨:", currentPostId);
    setPage(0);
  }, [currentPostId]);

  // 🔥 page 또는 currentPostId 변경 시 fetch
  useEffect(() => {
    if (currentPostId) {
      console.log("🟢 fetchNearbyPosts 호출:", { currentPostId, page });
      fetchNearbyPosts(page);
    }
  }, [page, currentPostId]);

  const fetchNearbyPosts = async (pageNum) => {
    try {
      console.log(
        "📡 API 요청:",
        `/api/freeboard/${currentPostId}/nearby?page=${pageNum}&size=10`
      );

      const res = await api.get(
        `/api/freeboard/${currentPostId}/nearby?page=${pageNum}&size=10`
      );

      console.log("📥 API 응답:", res.data);

      // 🔥 응답 구조 확인 및 데이터 설정
      if (res.data.content) {
        setPosts(res.data.content);
        setTotalPages(res.data.totalPages);
        console.log("✅ 데이터 설정 완료:", {
          posts: res.data.content.length,
          totalPages: res.data.totalPages,
        });
      } else {
        console.error("❌ content가 없음:", res.data);
      }
    } catch (err) {
      console.error("❌ 하단 게시글 목록 조회 실패:", err);
    }
  };

  const handlePageChange = (newPage) => {
    console.log("🔄 페이지 변경:", page, "->", newPage);
    setPage(newPage);
  };

  return (
    <div className="bottom-post-section">
      <h3 className="bottom-post-title">다른 게시글</h3>
      <div className="bottom-post-list">
        {posts.length === 0 ? (
          <div className="empty-message">게시글이 없습니다.</div>
        ) : (
          posts.map((post) => (
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
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="bottom-post-pagination">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className="bottom-page-btn"
          >
            이전
          </button>
          <span className="bottom-page-info">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="bottom-page-btn"
          >
            다음
          </button>
        </div>
      )}

      {/* 🔥 디버깅용 정보 */}
      <div style={{ fontSize: "12px", color: "#999", marginTop: "10px" }}>
        현재: {page + 1}페이지 / 총 {totalPages}페이지 / 게시글 {posts.length}개
      </div>
    </div>
  );
}
