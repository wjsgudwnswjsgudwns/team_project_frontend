import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../help/Help.css";

function GuestInquiry() {
  const navigate = useNavigate();

  // 이름 핸드폰 번호 입력 초기값 searchData -> GuestHelpDto
  const [searchData, setSearchData] = useState({
    name: "",
    phone: "",
  });

  const [helps, setHelps] = useState([]); // 문의
  const [searched, setSearched] = useState(false); // 검색 결과 영역을 화면 true -> 비회원 문의 내역 리스트
  const [selectedHelp, setSelectedHelp] = useState(null); // 사용자가 선택한 특정 문의 항목

  // 값 입력
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 비회원 문의 조회
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchData.name.trim() || !searchData.phone.trim()) {
      alert("이름과 휴대폰 번호를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await api.post("/api/help/guest/inquiry", searchData);
      setHelps(response.data);
      setSearched(true);
      setSelectedHelp(null);
    } catch (error) {
      console.error("조회 실패:", error);
      if (error.response?.status === 404) {
        alert("해당 정보로 등록된 문의가 없습니다.");
        setHelps([]);
      } else {
        alert(error.response?.data || "조회 중 오류가 발생했습니다.");
      }
      setSearched(true);
    }
  };

  // 문의 삭제
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      await api.delete(`/api/help/guest/${id}`, {
        data: searchData,
      });

      alert("삭제되었습니다.");
      setSelectedHelp(null);
      handleSearch(new Event("submit")); // 삭제 로직 후 목록 재호출
    } catch (error) {
      console.error("삭제 실패:", error);
      alert(error.response?.data || "삭제 중 오류가 발생했습니다.");
    }
  };

  // 날짜
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

  return (
    <div className="guest-inquiry-container">
      <div className="guest-inquiry-form-section">
        <div className="help-form-title">비회원 문의 조회</div>

        {/* 조회 입력창 */}
        <form className="help-form" onSubmit={handleSearch}>
          <div className="form-group">
            <label className="form-label">이름</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="문의 시 입력한 이름"
              value={searchData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">휴대폰 번호</label>
            <input
              type="text"
              name="phone"
              className="form-input"
              placeholder="문의 시 입력한 번호 (ex: 01012345678)"
              value={searchData.phone}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-btn">
            내 문의 조회하기
          </button>
        </form>
      </div>

      {searched && (
        <div className="help-list-section">
          {helps.length === 0 ? (
            <div className="empty-list">
              <p>등록된 문의가 없습니다.</p>
            </div>
          ) : (
            <div className="help-list">
              <h3>문의 내역 ({helps.length}건)</h3>
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
      )}
    </div>
  );
}

export default GuestInquiry;
