import React, { useState, useRef, useMemo } from "react";
import "./AiConsult.css";

const AiConsult = () => {
  const [aiResult, setAiResult] = useState("");

  // 폼 상태: 사용자가 최종 선택한 값
  const [formData, setFormData] = useState({
    usage: "고성능 게임",
    minBudget: 100, // 최소 예산 (만원)
    maxBudget: 200, // 최대 예산 (만원)
    cpu: "AMD",
    gpu: "엔비디아",
    mainboard: "AMD",
    memory: "32G",
  });

  // UI 상태: 현재 활성화된 필드와 드롭다운 위치
  const [activeField, setActiveField] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    left: 0,
    top: 0,
    minWidth: 0,
  });

  // 항목별 데이터 (선언 순서 수정)
  const options = {
    usage: ["고성능 게임", "영상 편집", "작곡", "사무용", "상관없음"],
    cpu: ["인텔", "AMD", "상관 없음"],
    gpu: ["엔비디아", "AMD", "상관없음"],
    mainboard: ["인텔", "AMD", "상관없음"],
    memory: ["64G", "32G", "16G", "8G", "상관없음"],
  };

  // 항목 배열 (렌더링 순서) (선언 순서 수정)
  const fieldOrder = [
    { id: "usage", label: "사용 용도" },
    { id: "budget", label: "금액 범위" },
    { id: "cpu", label: "CPU" },
    { id: "gpu", label: "그래픽 카드" },
    { id: "mainboard", label: "메인 보드" },
    { id: "memory", label: "메모리" },
  ];

  const itemRefs = useMemo(
    () => new Map(fieldOrder.map((item) => [item.id, React.createRef()])),
    [fieldOrder]
  );

  const handleFieldClick = (field) => {
    if (activeField === field) {
      setActiveField(null); // 같은 항목을 다시 누르면 닫기
      return;
    }

    const ref = itemRefs.get(field);
    if (ref && ref.current) {
      setDropdownPosition({
        left: ref.current.offsetLeft,
        top: ref.current.offsetTop + ref.current.offsetHeight + 10,
        minWidth: ref.current.offsetWidth,
      });
      setActiveField(field);
    }
  };

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name !== "minBudget" && name !== "maxBudget") {
      setActiveField(null);
    }
  };

  const handleBudgetChange = (type, value) => {
    handleChange(type, Number(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8880/api/ai/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData }),
      });

      const data = await response.json();
      console.log("AI 응답:", data.result);
      setAiResult(JSON.stringify(data.result, null, 2));
    } catch (err) {
      console.error(err);
      alert("AI 요청 실패");
    }
  };

  // --- 개별 드롭다운 패널 렌더링 함수 ---

  const renderOptionPanel = (fieldId, currentOptions) => (
    <div className="option-panel">
      {currentOptions.map((option) => (
        <div
          key={option}
          className={`option-item ${
            formData[fieldId] === option ? "selected" : ""
          }`}
          onClick={() => handleChange(fieldId, option)}
        >
          {option}
        </div>
      ))}
    </div>
  );

  const renderBudgetPanel = () => (
    <div className="option-panel budget-panel">
      <div className="budget-range-display">
        {formData.minBudget}만 원 ~ {formData.maxBudget}만 원
      </div>
      <div className="slider-controls">
        <label>최소 예산 ({formData.minBudget}만 원)</label>
        <input
          type="range"
          min="50"
          max="500"
          step="10"
          value={formData.minBudget}
          onChange={(e) => handleBudgetChange("minBudget", e.target.value)}
        />
        <label>최대 예산 ({formData.maxBudget}만 원)</label>
        <input
          type="range"
          min="50"
          max="500"
          step="10"
          value={formData.maxBudget}
          onChange={(e) => handleBudgetChange("maxBudget", e.target.value)}
        />
      </div>
    </div>
  );

  // --- 컴포넌트 렌더링 ---
  return (
    <form className="ai-consult-form-grid" onSubmit={handleSubmit}>
      <div className="form-grid-container">
        {/* 1. 클릭 가능한 항목 버튼 영역 */}
        {fieldOrder.map((field, index) => (
          <React.Fragment key={field.id}>
            <div
              ref={itemRefs.get(field.id)} // ref 연결
              className={`form-item ${
                activeField === field.id ? "active" : ""
              }`}
              onClick={() => handleFieldClick(field.id)}
            >
              <label className="input-label">{field.label}</label>
              <div className="selected-value">
                {field.id === "budget"
                  ? `${formData.minBudget}만 ~ ${formData.maxBudget}만`
                  : formData[field.id]}
              </div>
            </div>
          </React.Fragment>
        ))}

        {/* 2. 검색하기 버튼 */}
        <button type="submit" className="search-button">
          검색하기
        </button>
      </div>

      {/* 3. 활성화된 필드에 따른 드롭다운 패널 */}
      {activeField && (
        <div
          className="dropdown-wrapper"
          style={{
            left: dropdownPosition.left,
            top: dropdownPosition.top,
            minWidth: dropdownPosition.minWidth,
          }}
        >
          {/* 닫기 버튼 */}
          <button
            className="close-panel-btn"
            onClick={() => setActiveField(null)}
          >
            &times;
          </button>

          {activeField === "budget" && renderBudgetPanel()}
          {options[activeField] &&
            renderOptionPanel(activeField, options[activeField])}
        </div>
      )}

      {aiResult && (
        <div className="ai-result-panel">
          <pre>{aiResult}</pre>
        </div>
      )}
    </form>
  );
};

export default AiConsult;
