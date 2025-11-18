import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../help/Help.css";

function MyHelp() {
  const navigate = useNavigate();
  const [helps, setHelps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyHelps();
  }, []);

  const fetchMyHelps = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      const response = await api.get("/api/help/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHelps(response.data);
    } catch (error) {
      console.error("문의 목록 조회 실패:", error);
      if (error.response?.status === 401) {
        alert("로그인이 필요합니다.");
        navigate("/login");
      }
    } finally {
      setLoading(false);
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

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="help-list-container">
      <div className="help-list-header">
        <h2>내 문의 내역</h2>
        <button className="new-help-btn" onClick={() => navigate("/help")}>
          새 문의 작성
        </button>
      </div>

      {helps.length === 0 ? (
        <div className="empty-list">
          <p>등록된 문의가 없습니다.</p>
          <button onClick={() => navigate("/help")}>문의 작성하기</button>
        </div>
      ) : (
        <div className="help-list">
          {helps.map((help) => (
            <div key={help.id} className="help-item">
              <div className="help-item-header">
                <h3
                  className="help-title-clickable"
                  onClick={() => navigate(`/help/${help.id}`)}
                >
                  {help.title}
                </h3>
                <span
                  className={`status-badge ${
                    help.isAnswered ? "answered" : "pending"
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

export default MyHelp;
