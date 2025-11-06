import { useState, useEffect } from "react";
import { useFreeComment } from "../../hooks/useFreeComment";
import FreeCommentItem from "./FreeCommentItem";
import "./FreeComment.css";

export default function FreeCommentSection({ boardId, currentUsername }) {
  const {
    comments,
    commentCount,
    fetchComments,
    fetchCommentCount,
    createComment,
    updateComment,
    deleteComment,
  } = useFreeComment();

  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (boardId) {
      fetchComments(boardId);
      fetchCommentCount(boardId);
    }
  }, [boardId, fetchComments, fetchCommentCount]);

  // 새 댓글 작성
  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }

    const success = await createComment(boardId, newComment);
    if (success) {
      setNewComment("");
    }
  };

  // 답글 작성 (boardId를 전달)
  const handleReplySubmit = async (content, parentId) => {
    const success = await createComment(boardId, content, parentId);
    return success;
  };

  // 댓글 수정
  const handleEdit = async (commentId, content) => {
    await updateComment(boardId, commentId, content);
  };

  // 댓글 삭제
  const handleDelete = async (commentId) => {
    await deleteComment(boardId, commentId);
  };

  return (
    <div className="comment-section">
      <div className="comment-header-bar">
        <h3>댓글 {commentCount}개</h3>
      </div>

      {/* 댓글 목록을 먼저 */}
      <div className="comment-list">
        {comments.length === 0 ? (
          <div className="empty-comment">첫 댓글을 작성해보세요!</div>
        ) : (
          comments.map((comment) => (
            <FreeCommentItem
              key={comment.id}
              comment={comment}
              currentUsername={currentUsername}
              depth={0}
              onReplySubmit={handleReplySubmit}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* 댓글 작성 폼 아래로 */}
      <div className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요"
          className="comment-textarea"
          rows="3"
        />
        <button onClick={handleSubmitComment} className="comment-submit-btn">
          댓글 작성
        </button>
      </div>
    </div>
  );
}
