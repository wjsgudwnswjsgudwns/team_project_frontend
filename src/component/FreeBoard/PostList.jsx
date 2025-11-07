export default function PostList({ posts, onPostClick, isSearching }) {
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
          onClick={() => onPostClick(post.id)}
        >
          <div className="post-header">
            <h3 className="post-title">{post.ftitle}</h3>
            {post.ffile && post.ffile !== "[]" && (
              <span className="image-badge">📷</span>
            )}
          </div>
          <div className="post-meta">
            <span>작성자: {post.username || "Unknown"}</span>
            <span>조회수: {post.fview}</span>
            <span>좋아요: {post.flike}</span>
            <span>
              작성일:{" "}
              {post.fwriteTime
                ? new Date(post.fwriteTime).toLocaleDateString("ko-KR")
                : "-"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
