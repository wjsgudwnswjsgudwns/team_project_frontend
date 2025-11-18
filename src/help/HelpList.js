import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../help/Help.css";

function HelpList() {
  const navigate = useNavigate();
  const [helps, setHelps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedHelp, setSelectedHelp] = useState(null);

  useEffect(() => {
    fetchAllHelps();
  }, []);

  const fetchAllHelps = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      const response = await api.get("/api/help/admin/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHelps(response.data);
    } catch (error) {
      console.error("문의 목록 조회 실패:", error);
      if (error.response?.status === 403) {
        alert("관리자 권한이 필요합니다.");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerToggle = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/api/help/admin/${id}/answer?isAnswered=${!currentStatus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("답변 상태가 변경되었습니다.");

      // 선택된 항목 업데이트
      if (selectedHelp && selectedHelp.id === id) {
        setSelectedHelp({ ...selectedHelp, answered: !currentStatus });
      }

      fetchAllHelps();
    } catch (error) {
      console.error("상태 변경 실패:", error);
      alert(error.response?.data || "상태 변경 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/help/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("삭제되었습니다.");
      setSelectedHelp(null);
      fetchAllHelps();
    } catch (error) {
      console.error("삭제 실패:", error);
      alert(error.response?.data || "삭제 중 오류가 발생했습니다.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredHelps = helps.filter((help) => {
    if (filter === "answered") return help.isAnswered;
    if (filter === "pending") return !help.isAnswered;
    return true;
  });

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  // 상세보기
  if (selectedHelp) {
    return (
      <div className="help-detail-container">
        <div className="help-detail-header">
          <button className="back-btn" onClick={() => setSelectedHelp(null)}>
            ← 목록으로
          </button>
        </div>

        <div className="help-detail-card">
          <div className="help-detail-title-section">
            <div>
              <h2>{selectedHelp.title}</h2>
              <span className="help-detail-date">
                {formatDate(selectedHelp.inquiryDate)}
              </span>
            </div>
            <span
              className={`status-badge ${
                selectedHelp.answered ? "answered" : "pending"
              }`}
            >
              {selectedHelp.answered ? "답변 완료" : "답변 대기"}
            </span>
          </div>

          <div className="help-detail-divider"></div>

          <div className="help-detail-content">
            <h3>문의 내용</h3>
            <p>{selectedHelp.content}</p>
          </div>

          <div className="help-detail-divider"></div>
          <div className="help-detail-info">
            <div className="info-row">
              <span className="info-label">작성자:</span>
              <span className="info-value">
                {selectedHelp.user
                  ? `${selectedHelp.user.nickname} (회원)`
                  : `${selectedHelp.name} (비회원)`}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">이메일:</span>
              <span className="info-value">{selectedHelp.email}</span>
            </div>
            {selectedHelp.phone && (
              <div className="info-row">
                <span className="info-label">전화번호:</span>
                <span className="info-value">{selectedHelp.phone}</span>
              </div>
            )}
          </div>

          <div className="help-detail-actions">
            <button
              className={`answer-btn ${
                selectedHelp.answered ? "answered" : ""
              }`}
              onClick={() =>
                handleAnswerToggle(selectedHelp.id, selectedHelp.answered)
              }
            >
              {selectedHelp.answered ? "답변 취소" : "답변 완료"}
            </button>
            <button
              className="delete-btn"
              onClick={() => handleDelete(selectedHelp.id)}
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 목록
  return (
    <div className="help-list-container admin">
      <div className="help-list-header">
        <h2>전체 문의 관리 ({helps.length}건)</h2>
        <div className="filter-buttons">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            전체
          </button>
          <button
            className={filter === "pending" ? "active" : ""}
            onClick={() => setFilter("pending")}
          >
            답변 대기
          </button>
          <button
            className={filter === "answered" ? "active" : ""}
            onClick={() => setFilter("answered")}
          >
            답변 완료
          </button>
        </div>
      </div>

      {filteredHelps.length === 0 ? (
        <div className="empty-list">
          <p>문의가 없습니다.</p>
        </div>
      ) : (
        <div className="help-list">
          {filteredHelps.map((help) => (
            <div key={help.id} className="help-item admin">
              <div className="help-item-header">
                <div>
                  <h3
                    className="help-title-clickable"
                    onClick={() => setSelectedHelp(help)}
                  >
                    {help.title}
                  </h3>
                  <span className="author-info">
                    {help.user
                      ? `회원: ${help.user.nickname}`
                      : `비회원: ${help.name}`}
                  </span>
                </div>
                <span
                  className={`status-badge ${
                    help.idAnswered ? "answered" : "pending"
                  }`}
                >
                  {help.isAnswered ? "답변 완료" : "답변 대기"}
                </span>
              </div>
              <div className="help-item-preview">
                <p>
                  {help.content.substring(0, 100)}
                  {help.content.length > 100 ? "..." : ""}
                </p>
              </div>
              <div className="help-item-footer">
                <span className="help-date">
                  {formatDate(help.inquiryDate)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HelpList;
