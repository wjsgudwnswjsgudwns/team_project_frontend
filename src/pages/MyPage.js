import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./MyPage.css";

export default function MyPage() {
  const navigate = useNavigate();

  // 인증 상태
  const [isVerified, setIsVerified] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // 탭 상태
  const [activeTab, setActiveTab] = useState("info");

  // 마이페이지 데이터
  const [myPageData, setMyPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 회원정보 수정
  const [updateForm, setUpdateForm] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordCheck: "",
    nickname: "",
    email: "",
  });

  // 회원탈퇴
  const [deletePassword, setDeletePassword] = useState("");

  // 로그인 체크
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [navigate]);

  // 비밀번호 인증
  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      const res = await api.post("/api/mypage/verify-password", {
        password: verifyPassword,
      });

      if (res.data.success) {
        setIsVerified(true);
        fetchMyPageData();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        alert("비밀번호가 일치하지 않습니다.");
      } else {
        alert("인증 실패: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // 마이페이지 데이터 조회
  const fetchMyPageData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/api/mypage/info");
      setMyPageData(res.data);

      // 수정 폼 초기값 설정
      setUpdateForm({
        currentPassword: "",
        newPassword: "",
        newPasswordCheck: "",
        nickname: res.data.nickname,
        email: res.data.email,
      });
    } catch (err) {
      alert("데이터 조회 실패: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 회원정보 수정
  const handleUpdateInfo = async (e) => {
    e.preventDefault();

    // OAuth 사용자가 아닌 경우 비밀번호 필수
    if (!myPageData.provider && !updateForm.currentPassword) {
      alert("현재 비밀번호를 입력해주세요.");
      return;
    }

    // 새 비밀번호 입력 시 확인
    if (updateForm.newPassword) {
      if (updateForm.newPassword !== updateForm.newPasswordCheck) {
        alert("새 비밀번호가 일치하지 않습니다.");
        return;
      }

      // 비밀번호 복잡도 체크
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
      if (!passwordRegex.test(updateForm.newPassword)) {
        alert(
          "비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다."
        );
        return;
      }
    }

    try {
      const res = await api.put("/api/mypage/update", updateForm);

      if (res.data.success) {
        alert(res.data.message);
        fetchMyPageData(); // 데이터 갱신
        // 비밀번호 필드 초기화
        setUpdateForm({
          ...updateForm,
          currentPassword: "",
          newPassword: "",
          newPasswordCheck: "",
        });
      }
    } catch (err) {
      alert("수정 실패: " + (err.response?.data?.message || err.message));
    }
  };

  // 회원탈퇴
  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "정말로 회원탈퇴 하시겠습니까?\n모든 데이터가 삭제되며 복구할 수 없습니다."
      )
    ) {
      return;
    }

    // OAuth 사용자가 아닌 경우 비밀번호 확인
    if (!myPageData.provider && !deletePassword) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    try {
      const res = await api.delete("/api/mypage/delete", {
        data: { password: deletePassword },
      });

      if (res.data.success) {
        alert(res.data.message);
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        window.location.href = "/";
      }
    } catch (err) {
      alert("탈퇴 실패: " + (err.response?.data?.message || err.message));
    }
  };

  // 게시글 클릭 시 해당 게시판으로 이동
  const handlePostClick = (post) => {
    const boardMap = {
      free: "freeboard",
      counsel: "counselboard",
      info: "infoboard",
    };
    const board = boardMap[post.boardType];
    navigate(`/${board}?tab=detail&postId=${post.id}`);
  };

  // 댓글 클릭 시 해당 게시글로 이동
  const handleCommentClick = (comment) => {
    const boardMap = {
      free: "freeboard",
      counsel: "counselboard",
      info: "infoboard",
    };
    const board = boardMap[comment.boardType];
    navigate(`/${board}?tab=detail&postId=${comment.boardId}`);
  };

  // 비밀번호 인증 화면
  if (!isVerified) {
    return (
      <div className="mypage-container">
        <form className="password-verify-box" onSubmit={handleVerifyPassword}>
          <h2 className="verify-title">본인 확인</h2>
          <p className="verify-subtitle">
            마이페이지 접근을 위해 비밀번호를 입력해주세요
          </p>
          <input
            type="password"
            className="verify-input"
            placeholder="비밀번호"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
            disabled={isVerifying}
            required
          />
          <button type="submit" className="verify-btn" disabled={isVerifying}>
            {isVerifying ? "확인 중..." : "확인"}
          </button>
        </form>
      </div>
    );
  }

  // 로딩 중
  if (isLoading || !myPageData) {
    return (
      <div className="mypage-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="mypage-container">
      <div className="mypage-wrapper">
        {/* 탭 버튼 */}
        <div className="mypage-tabs">
          <button
            onClick={() => setActiveTab("info")}
            className={`mypage-tab-btn ${activeTab === "info" ? "active" : ""}`}
          >
            회원정보
          </button>
          <button
            onClick={() => navigate(`/user/${myPageData.username}`)}
            className="mypage-tab-btn"
          >
            활동내역 보기
          </button>
          <button
            onClick={() => setActiveTab("delete")}
            className={`mypage-tab-btn ${
              activeTab === "delete" ? "active" : ""
            }`}
          >
            회원탈퇴
          </button>
        </div>

        {/* 회원정보 탭 */}
        {activeTab === "info" && (
          <div className="mypage-content-box">
            <h3 className="section-title">기본 정보</h3>

            <div className="user-info-grid">
              <div className="info-item">
                <div className="info-label">아이디</div>
                <div className="info-value">{myPageData.username}</div>
              </div>
              <div className="info-item">
                <div className="info-label">닉네임</div>
                <div className="info-value">{myPageData.nickname}</div>
              </div>
              <div className="info-item">
                <div className="info-label">이메일</div>
                <div className="info-value">{myPageData.email}</div>
              </div>
              <div className="info-item">
                <div className="info-label">가입일</div>
                <div className="info-value">
                  {new Date(myPageData.createAccount).toLocaleDateString(
                    "ko-KR"
                  )}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">계정 유형</div>
                <div className="info-value">
                  {myPageData.provider ? (
                    <>
                      OAuth 연동
                      <span className="oauth-badge">
                        {myPageData.provider.toUpperCase()}
                      </span>
                    </>
                  ) : (
                    "일반 회원"
                  )}
                </div>
              </div>
            </div>

            <h3 className="section-title">활동 통계</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">
                  {myPageData.activityStats.totalPosts}
                </div>
                <div className="stat-label">작성 게시글</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {myPageData.activityStats.totalComments}
                </div>
                <div className="stat-label">작성 댓글</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {myPageData.activityStats.totalLikesReceived}
                </div>
                <div className="stat-label">받은 좋아요</div>
              </div>
            </div>

            <h3 className="section-title">정보 수정</h3>
            <form onSubmit={handleUpdateInfo}>
              {!myPageData.provider && (
                <>
                  <div className="form-group">
                    <label className="form-label">현재 비밀번호 *</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="현재 비밀번호"
                      value={updateForm.currentPassword}
                      onChange={(e) =>
                        setUpdateForm({
                          ...updateForm,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      새 비밀번호 (변경 시에만 입력)
                    </label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="새 비밀번호"
                      value={updateForm.newPassword}
                      onChange={(e) =>
                        setUpdateForm({
                          ...updateForm,
                          newPassword: e.target.value,
                        })
                      }
                    />
                    <p className="form-note">
                      영문, 숫자, 특수문자 포함 8자 이상
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">새 비밀번호 확인</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="새 비밀번호 확인"
                      value={updateForm.newPasswordCheck}
                      onChange={(e) =>
                        setUpdateForm({
                          ...updateForm,
                          newPasswordCheck: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label">닉네임 *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="닉네임"
                  value={updateForm.nickname}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, nickname: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">이메일 *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="이메일"
                  value={updateForm.email}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="button-group">
                <button type="submit" className="primary-btn">
                  정보 수정
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 활동내역 탭
        {activeTab === "activity" && (
          <div className="mypage-content-box">
            <h3 className="section-title">최근 작성 글</h3>
            {myPageData.recentPosts.length === 0 ? (
              <div className="empty-message">작성한 게시글이 없습니다.</div>
            ) : (
              <div className="post-list">
                {myPageData.recentPosts.map((post) => (
                  <div
                    key={`${post.boardType}-${post.id}`}
                    className="post-item"
                    onClick={() => handlePostClick(post)}
                  >
                    <div className="post-title">
                      <span className="board-type-badge">
                        {post.boardType === "free"
                          ? "자유"
                          : post.boardType === "counsel"
                          ? "상담"
                          : "정보"}
                      </span>
                      {post.title}
                    </div>
                    <div className="post-meta">
                      <span>
                        {new Date(post.writeTime).toLocaleDateString("ko-KR")}
                      </span>
                      <span>·</span>
                      <span>조회 {post.views}</span>
                      <span>·</span>
                      <span>좋아요 {post.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h3 className="section-title" style={{ marginTop: "48px" }}>
              최근 작성 댓글
            </h3>
            {myPageData.recentComments.length === 0 ? (
              <div className="empty-message">작성한 댓글이 없습니다.</div>
            ) : (
              <div className="comment-list">
                {myPageData.recentComments.map((comment) => (
                  <div
                    key={`${comment.boardType}-${comment.id}`}
                    className="comment-item"
                    onClick={() => handleCommentClick(comment)}
                  >
                    <div className="comment-board-title">
                      <span className="board-type-badge">
                        {comment.boardType === "free"
                          ? "자유"
                          : comment.boardType === "counsel"
                          ? "상담"
                          : "정보"}
                      </span>
                      {comment.boardTitle}
                    </div>
                    <div className="comment-content">{comment.content}</div>
                    <div className="comment-meta">
                      <span>
                        {new Date(comment.writeTime).toLocaleDateString(
                          "ko-KR"
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )} */}

        {/* 회원탈퇴 탭 */}
        {activeTab === "delete" && (
          <div className="mypage-content-box">
            <h3 className="section-title">회원 탈퇴</h3>
            <p style={{ color: "#888", marginBottom: "32px", lineHeight: 1.8 }}>
              회원 탈퇴 시 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
              <br />
              작성한 게시글, 댓글 등 모든 활동 내역이 삭제됩니다.
            </p>

            {!myPageData.provider && (
              <div className="form-group">
                <label className="form-label">비밀번호 확인 *</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="비밀번호"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  style={{ maxWidth: "400px" }}
                />
              </div>
            )}

            <div className="button-group">
              <button onClick={handleDeleteAccount} className="danger-btn">
                회원 탈퇴
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
