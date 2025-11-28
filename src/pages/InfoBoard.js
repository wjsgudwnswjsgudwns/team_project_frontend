import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useInfoBoard } from "../hooks/useInfoBoard";
import { useAuth } from "../hooks/useAuth";
import { useSearch } from "../hooks/useSearch";
import InfoPostList from "../component/InfoBoard/InfoPostList";
import InfoPostDetail from "../component/InfoBoard/InfoPostDetail";
import InfoPostForm from "../component/InfoBoard/InfoPostForm";
import SearchBar from "../component/FreeBoard/SearchBar";
import api from "../api/axiosConfig";
import "./FreeBoard.css";

export default function InfoBoard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("posts");
  const [formData, setFormData] = useState({ iTitle: "", iContent: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isCollecting, setIsCollecting] = useState(false); // ✅ 추가

  const isNavigatingRef = useRef(false);

  const { currentUsername } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // role 가져오기 (App.js에서 전달받거나 localStorage에서)
  const role = localStorage.getItem("role");

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
  } = useInfoBoard();

  const {
    searchType,
    searchKeyword,
    isSearching,
    setSearchType,
    setSearchKeyword,
    handleSearch,
    resetSearch,
  } = useSearch();

  // ✅ 뉴스 수집 함수
  const handleCollectNews = async () => {
    if (
      !window.confirm(
        "지금 즉시 최신 뉴스를 수집하시겠습니까?\n(약 1-2분 소요)"
      )
    ) {
      return;
    }

    setIsCollecting(true);
    try {
      const res = await api.get("/api/admin/news/collect-now");
      alert(
        res.data.message +
          "\n\n잠시 후 새로고침하면 새 게시글을 확인할 수 있습니다."
      );

      // 30초 후 자동 새로고침
      setTimeout(() => {
        fetchPosts();
        setIsCollecting(false);
      }, 30000);
    } catch (err) {
      alert("뉴스 수집 실패: " + err.message);
      setIsCollecting(false);
    }
  };

  useEffect(() => {
    if (isNavigatingRef.current) {
      isNavigatingRef.current = false;
      return;
    }

    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    const postId = params.get("postId");

    if (postId && tab === "detail") {
      const id = parseInt(postId);
      if (!selectedPost || selectedPost.id !== id) {
        fetchPostDetail(id);
      }
      setActiveTab("detail");
    } else if (tab === "write") {
      // 로그인 체크
      if (!currentUsername) {
        alert("로그인이 필요한 서비스입니다.");
        navigate("/login");
        return;
      }
      setActiveTab("write");
    } else {
      setActiveTab("posts");
    }
  }, [location.search]);

  useEffect(() => {
    if (activeTab === "posts") {
      fetchPosts();
    }
  }, [page, fetchPosts, activeTab]);

  const handlePostClick = async (id, fromPage = page) => {
    isNavigatingRef.current = true;
    await fetchPostDetail(id);
    setActiveTab("detail");
    const targetPage = fromPage !== undefined ? fromPage : page;
    navigate(`/infoboard?tab=detail&postId=${id}&page=${targetPage}`, {
      replace: false,
    });
  };

  const handleBackToList = () => {
    isNavigatingRef.current = true;
    setActiveTab("posts");
    navigate("/infoboard?tab=posts", { replace: false });
  };

  const handleSubmit = async () => {
    if (!formData.iTitle.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!formData.iContent.trim() || formData.iContent === "<br>") {
      alert("내용을 입력해주세요.");
      return;
    }

    const success = isEditing
      ? await updatePost(editingId, formData)
      : await createPost(formData);

    if (success) {
      setFormData({ iTitle: "", iContent: "" });
      setIsEditing(false);
      setEditingId(null);
      fetchPosts();
      isNavigatingRef.current = true;
      setActiveTab("posts");
      navigate("/infoboard?tab=posts", { replace: true });
    }
  };

  const startEdit = (post) => {
    isNavigatingRef.current = true;
    setIsEditing(true);
    setEditingId(post.id);
    setFormData({
      iTitle: post.ititle,
      iContent: post.icontent,
    });
    setActiveTab("write");
    navigate("/infoboard?tab=write", { replace: false });
  };

  const handleDeleteClick = async () => {
    const success = await deletePost(selectedPost.id);
    if (success) {
      fetchPosts();
      isNavigatingRef.current = true;
      setActiveTab("posts");
      navigate("/infoboard?tab=posts", { replace: true });
    }
  };

  const handleCancelEdit = () => {
    isNavigatingRef.current = true;
    setIsEditing(false);
    setEditingId(null);
    setFormData({ iTitle: "", iContent: "" });
    setActiveTab("posts");
    navigate("/infoboard?tab=posts", { replace: false });
  };

  const handleSearchClick = () => {
    handleSearch((data) => {
      setSearchResults(data);
      setPage(0);
      setActiveTab("posts");
    });
  };

  const handleResetSearch = () => {
    resetSearch(() => {
      setPage(0);
      fetchPosts();
    });
  };

  return (
    <div className="freeboard-container">
      <div className="freeboard-wrapper">
        <div className="tab-buttons">
          <button
            onClick={() => {
              isNavigatingRef.current = true;
              setActiveTab("posts");
              navigate("/infoboard?tab=posts", { replace: false });
              fetchPosts();
            }}
            className={`tab-btn ${activeTab === "posts" ? "active" : ""}`}
          >
            게시글 목록
          </button>
          <button
            onClick={() => {
              // 로그인 한 사람만 글쓰기 가능
              if (!currentUsername) {
                alert("로그인 후 작성 가능합니다.");
                navigate("/login");
                return;
              }
              isNavigatingRef.current = true;
              setActiveTab("write");
              navigate("/infoboard?tab=write", { replace: false });
              setIsEditing(false);
              setFormData({ iTitle: "", iContent: "" });
            }}
            className={`tab-btn ${activeTab === "write" ? "active" : ""}`}
          >
            글쓰기
          </button>

          {/* ✅ 관리자 전용 뉴스 수집 버튼 */}
          {role === "ROLE_ADMIN" && (
            <button
              onClick={handleCollectNews}
              disabled={isCollecting}
              className="tab-btn"
              style={{
                backgroundColor: isCollecting
                  ? "#666"
                  : "rgba(16, 185, 129, 0.2)",
                borderColor: isCollecting ? "#666" : "#10b981",
                color: isCollecting ? "#999" : "#10b981",
                cursor: isCollecting ? "not-allowed" : "pointer",
              }}
            >
              {isCollecting ? "⏳ 수집 중..." : "🤖 뉴스 자동 수집"}
            </button>
          )}
        </div>

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

            <InfoPostList
              posts={posts}
              onPostClick={handlePostClick}
              isSearching={isSearching}
              currentPage={page}
            />

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

        {activeTab === "write" && (
          <div className="content-box">
            <h2 className="section-title">
              {isEditing ? "게시글 수정" : "게시글 작성"}
            </h2>
            <InfoPostForm
              formData={formData}
              isEditing={isEditing}
              onFormChange={setFormData}
              onSubmit={handleSubmit}
              onCancel={handleCancelEdit}
            />
          </div>
        )}

        {activeTab === "detail" && selectedPost && (
          <InfoPostDetail
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
