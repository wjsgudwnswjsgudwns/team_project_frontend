export default function InfoPostList({
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
            <h3 className="post-title">{post.ititle}</h3>
            {post.ifile && post.ifile !== "[]" && (
              <span className="image-badge">📷</span>
            )}
          </div>
          <div className="post-meta">
            <span>작성자: {post.username || "Unknown"}</span>
            <span>조회수: {post.iview}</span>
            <span>좋아요: {post.ilike}</span>
            <span>
              작성일:{" "}
              {post.iwriteTime
                ? new Date(post.iwriteTime).toLocaleDateString("ko-KR")
                : "-"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
