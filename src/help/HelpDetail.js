import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import HelpAnswer from "./HelpAnswer";
import "../help/Help.css";

function HelpDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [help, setHelp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHelpDetail();
  }, [id]);

  const fetchHelpDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/api/help/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      console.log("Help 데이터:", response.data);
      console.log("isAnswered:", response.data.isAnswered);
      console.log("helpAnswer 객체:", response.data.helpAnswer);

      setHelp(response.data);
    } catch (error) {
      console.error("문의 조회 실패:", error);
      alert("문의를 찾을 수 없습니다.");
      navigate("/myhelp");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/help/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("삭제되었습니다.");
      navigate("/myhelp");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert(error.response?.data || "삭제 중 오류가 발생했습니다.");
    }
  };

  const handleAnswerUpdate = () => {
    fetchHelpDetail();
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

  if (!help) {
    return <div className="loading">문의를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="help-detail-container">
      <div className="help-detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← 목록으로
        </button>
      </div>

      <div className="help-detail-card">
        <div className="help-detail-title-section">
          <div>
            <h2>{help.title}</h2>
            <span className="help-detail-date">
              {formatDate(help.inquiryDate)}
            </span>
          </div>
          <span
            className={`status-badge ${
              help.isAnswered ? "answered" : "pending"
            }`}
          >
            {help.isAnswered ? "답변 완료" : "답변 대기"}
          </span>
        </div>

        <div className="help-detail-divider"></div>

        <div className="help-detail-content">
          <h3>문의 내용</h3>
          <p>{help.content}</p>
        </div>

        {help.user && (
          <>
            <div className="help-detail-divider"></div>
            <div className="help-detail-info">
              <div className="info-row">
                <span className="info-label">작성자:</span>
                <span className="info-value">{help.user.nickname}</span>
              </div>
              <div className="info-row">
                <span className="info-label">이메일:</span>
                <span className="info-value">{help.email}</span>
              </div>
            </div>
          </>
        )}

        {!help.user && (
          <>
            <div className="help-detail-divider"></div>
            <div className="help-detail-info">
              <div className="info-row">
                <span className="info-label">이름:</span>
                <span className="info-value">{help.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">이메일:</span>
                <span className="info-value">{help.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">전화번호:</span>
                <span className="info-value">{help.phone}</span>
              </div>
            </div>
          </>
        )}

        {/* 답변 섹션 추가 */}
        {help.isAnswered && help.answer && (
          <>
            <div className="help-detail-divider"></div>
            <div className="answer-display-readonly">
              <div className="answer-header">
                <h3>관리자 답변</h3>
                <div className="answer-meta">
                  <span className="answer-author">
                    {help.answer.admin?.nickname || "관리자"}
                  </span>
                  {help.answer.answeredDate && (
                    <span className="answer-date">
                      {formatDate(help.answer.answeredDate)}
                    </span>
                  )}
                </div>
              </div>
              <div className="answer-content">
                <p>{help.answer.answer}</p>
              </div>
            </div>
          </>
        )}

        {/* 디버깅용 - 나중에 제거 */}
        {help.isAnswered && !help.answer && (
          <div style={{ color: "yellow", padding: "20px" }}>
            ⚠️ isAnswered는 true인데 answer 객체가 없습니다.
          </div>
        )}

        <div className="help-detail-actions">
          <button className="delete-btn" onClick={handleDelete}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

export default HelpDetail;
