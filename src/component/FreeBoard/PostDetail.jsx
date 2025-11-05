export default function PostDetail({
  post,
  isLiked,
  currentUsername,
  onLike,
  onEdit,
  onDelete,
  onBack,
}) {
  const isAuthor = currentUsername && post.username === currentUsername;

  return (
    <div className="content-box">
      <h2 className="detail-title">{post.ftitle}</h2>
      <div className="detail-meta">
        <span>작성자: {post.username}</span>
        <span>조회수: {post.fview}</span>
        <span>좋아요: {post.flike}</span>
        <span>
          작성일:{" "}
          {post.fwriteTime
            ? new Date(post.fwriteTime).toLocaleString("ko-KR")
            : "-"}
        </span>
      </div>

      <div
        className="detail-content"
        dangerouslySetInnerHTML={{ __html: post.fcontent }}
      />

      <div className="like-area">
        <button
          onClick={onLike}
          className="like-btn"
          style={{
            backgroundColor: isLiked ? "#ef4444" : "#f0f0f0",
            color: isLiked ? "white" : "#666",
          }}
        >
          {isLiked ? "❤️ 좋아요 취소" : "🤍 좋아요"}
        </button>
      </div>

      {isAuthor && (
        <div className="action-buttons">
          <button onClick={onEdit} className="edit-btn">
            수정
          </button>
          <button onClick={onDelete} className="delete-btn">
            삭제
          </button>
        </div>
      )}

      <div className="back-button-area">
        <button onClick={onBack} className="back-btn">
          목록으로
        </button>
      </div>
    </div>
  );
}
