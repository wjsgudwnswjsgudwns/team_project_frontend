import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFreeBoard } from "../hooks/useFreeBoard";
import { useAuth } from "../hooks/useAuth";
import { useSearch } from "../hooks/useSearch";
import PostList from "../component/FreeBoard/PostList";
import PostDetail from "../component/FreeBoard/PostDetail";
import PostForm from "../component/FreeBoard/PostForm";
import SearchBar from "../component/FreeBoard/SearchBar";
import "./FreeBoard.css";

export default function FreeBoard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("posts");
  const [formData, setFormData] = useState({ fTitle: "", fContent: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Custom Hooks
  const { currentUsername } = useAuth();
  const {
    posts,
    selectedPost,
    page,
    totalPages,
    isLiked,
    setPage,
    setSearchResults,
    fetchPosts,
    fetchPostDetail,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
  } = useFreeBoard();

  const {
    searchType,
    searchKeyword,
    isSearching,
    setSearchType,
    setSearchKeyword,
    handleSearch,
    resetSearch,
  } = useSearch();

  // URL 파라미터로 activeTab 관리
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    const postId = params.get("postId");

    if (postId) {
      handlePostClick(parseInt(postId));
    } else if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab("posts");
    }
  }, [location.search]);

  useEffect(() => {
    if (activeTab === "posts") {
      fetchPosts();
    }
  }, [page, fetchPosts, activeTab]);

  // 게시글 클릭 (URL 업데이트)
  const handlePostClick = async (id) => {
    await fetchPostDetail(id);
    setActiveTab("detail");
    navigate(`/freeboard?tab=detail&postId=${id}`);
  };

  // 글쓰기/수정 제출
  const handleSubmit = async () => {
    if (!formData.fTitle.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!formData.fContent.trim() || formData.fContent === "<br>") {
      alert("내용을 입력해주세요.");
      return;
    }

    const success = isEditing
      ? await updatePost(editingId, formData)
      : await createPost(formData);

    if (success) {
      setFormData({ fTitle: "", fContent: "" });
      setIsEditing(false);
      setEditingId(null);
      fetchPosts();
      setActiveTab("posts");
      navigate("/freeboard?tab=posts");
    }
  };

  // 수정 시작
  const startEdit = (post) => {
    setIsEditing(true);
    setEditingId(post.id);
    setFormData({
      fTitle: post.ftitle,
      fContent: post.fcontent,
    });
    setActiveTab("write");
    navigate("/freeboard?tab=write");
  };

  // 삭제
  const handleDeleteClick = async () => {
    const success = await deletePost(selectedPost.id);
    if (success) {
      fetchPosts();
      setActiveTab("posts");
      navigate("/freeboard?tab=posts");
    }
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ fTitle: "", fContent: "" });
    setActiveTab("posts");
    navigate("/freeboard?tab=posts");
  };

  // 검색
  const handleSearchClick = () => {
    handleSearch((data) => {
      setSearchResults(data);
      setPage(0);
      setActiveTab("posts");
    });
  };

  // 검색 초기화
  const handleResetSearch = () => {
    resetSearch(() => {
      setPage(0);
      fetchPosts();
    });
  };

  // 목록으로 돌아가기
  const handleBackToList = () => {
    setActiveTab("posts");
    navigate("/freeboard?tab=posts");
    fetchPosts();
  };

  return (
    <div className="freeboard-container">
      <div className="freeboard-wrapper">
        {/* 탭 버튼 */}
        <div className="tab-buttons">
          <button
            onClick={() => {
              setActiveTab("posts");
              navigate("/freeboard?tab=posts");
              fetchPosts();
            }}
            className={`tab-btn ${activeTab === "posts" ? "active" : ""}`}
          >
            게시글 목록
          </button>
          <button
            onClick={() => {
              setActiveTab("write");
              navigate("/freeboard?tab=write");
              setIsEditing(false);
              setFormData({ fTitle: "", fContent: "" });
            }}
            className={`tab-btn ${activeTab === "write" ? "active" : ""}`}
          >
            글쓰기
          </button>
        </div>

        {/* 게시글 목록 */}
        {activeTab === "posts" && (
          <div className="content-box">
            <SearchBar
              searchType={searchType}
              searchKeyword={searchKeyword}
              isSearching={isSearching}
              onSearchTypeChange={setSearchType}
              onSearchKeywordChange={setSearchKeyword}
              onSearch={handleSearchClick}
              onReset={handleResetSearch}
            />

            {isSearching && (
              <div className="search-result-text">
                검색결과: "{searchKeyword}"
              </div>
            )}

            <PostList
              posts={posts}
              onPostClick={handlePostClick}
              isSearching={isSearching}
            />

            {/* 페이지네이션 */}
            <div className="pagination">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="page-btn"
              >
                이전
              </button>
              <span className="page-info">
                {page + 1} / {totalPages || 1}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="page-btn"
              >
                다음
              </button>
            </div>
          </div>
        )}

        {/* 글쓰기/수정 */}
        {activeTab === "write" && (
          <div className="content-box">
            <h2 className="section-title">
              {isEditing ? "게시글 수정" : "게시글 작성"}
            </h2>
            <PostForm
              formData={formData}
              isEditing={isEditing}
              onFormChange={setFormData}
              onSubmit={handleSubmit}
              onCancel={handleCancelEdit}
            />
          </div>
        )}

        {/* 게시글 상세 */}
        {activeTab === "detail" && selectedPost && (
          <PostDetail
            post={selectedPost}
            isLiked={isLiked}
            currentUsername={currentUsername}
            onLike={() => toggleLike(selectedPost.id)}
            onEdit={() => startEdit(selectedPost)}
            onDelete={handleDeleteClick}
            onBack={handleBackToList}
            onPostClick={handlePostClick}
          />
        )}
      </div>
    </div>
  );
}
