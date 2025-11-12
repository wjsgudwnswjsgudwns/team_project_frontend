export default function CounselPostList({
  posts,
  onPostClick,
  isSearching,
  currentPage,
}) {
  if (!posts || !Array.isArray(posts) || posts.length === 0) {
    return (
      <div className="empty-message">
        {isSearching ? "검색 결과가 없습니다." : "게시글이 없습니다."}
      </div>
    );
  }

  return (
    <div className="posts-list">
      {posts.map((post) => (
        <div
          key={post.id}
          className="post-item"
          onClick={() => onPostClick(post.id, currentPage)}
        >
          <div className="post-header">
            <h3 className="post-title">{post.ctitle}</h3>
            {post.cfile && post.cfile !== "[]" && (
              <span className="image-badge">📷</span>
            )}
          </div>
          <div className="post-meta">
            <span>작성자: {post.username || "Unknown"}</span>
            <span>조회수: {post.cview}</span>
            <span>좋아요: {post.clike}</span>
            <span>
              작성일:{" "}
              {post.cwriteTime
                ? new Date(post.cwriteTime).toLocaleDateString("ko-KR")
                : "-"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
