import React, { useRef, useState } from "react";
import ComputerSidebar from "./ComputerSidebar";
import "./Input.css";
import api from "../../api/axiosConfig";
import axios from "axios";

function Input() {
  // 기본 상품 정보
  const [product, setProduct] = useState({
    name: "",
    manufacturer: "",
    price: "",
    category: "CPU",
  });

  // 동적 스펙 필드들
  const [specs, setSpecs] = useState({});

  // 새 필드 추가용
  const [newFieldKey, setNewFieldKey] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이미지 관련
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const keyInputRef = useRef(null);

  // 기본 상품 정보 변경
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 스펙 필드 값 변경
  const handleSpecChange = (key, value) => {
    setSpecs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 새 스펙 필드 추가
  const addSpecField = () => {
    if (newFieldKey.trim() && newFieldValue.trim()) {
      setSpecs((prev) => ({
        ...prev,
        [newFieldKey]: newFieldValue,
      }));
      setNewFieldKey("");
      setNewFieldValue("");
      keyInputRef.current?.focus();
    } else {
      alert("필드명과 값을 모두 입력해주세요.");
    }
  };

  // 스펙 필드 삭제
  const removeSpecField = (key) => {
    const newSpecs = { ...specs };
    delete newSpecs[key];
    setSpecs(newSpecs);
  };

  // 이미지 선택 시 미리보기 & 업로드
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "http://localhost:8880/api/products/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드 실패. 다시 시도해주세요.");
    }
  };

  // 엔터키로 필드 추가
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSpecField();
    }
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name || !product.price) {
      alert("상품명과 가격은 필수입니다.");
      return;
    }

    setIsSubmitting(true);

    const productData = {
      name: product.name,
      manufacturer: product.manufacturer,
      price: product.price,
      category: product.category,
      specs: specs,
      imageUrl: imageUrl,
    };

    console.log("전송할 데이터:", productData);

    try {
      const response = await api.post("/api/products", productData);
      console.log("등록 성공:", response.data);
      alert(`상품이 성공적으로 등록되었습니다!\n상품명: ${response.data.name}`);

      // 폼 초기화
      setProduct({
        name: "",
        manufacturer: "",
        price: "",
        category: "CPU",
      });
      setSpecs({});
    } catch (error) {
      console.error("등록 실패:", error);
      alert("상품 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cpu-page-container">
      <ComputerSidebar />
      <div className="input-cpu-content">
        <h2>상품 등록 (관리자용)</h2>

        <form onSubmit={handleSubmit} className="cpu-spec-form">
          {/* 기본 상품 정보 */}
          <div className="spec-group">
            <h3>기본 정보</h3>
            <table className="spec-table">
              <tbody>
                <tr>
                  <td className="label-cell">상품명 *</td>
                  <td className="input-cell">
                    <input
                      type="text"
                      name="name"
                      value={product.name}
                      onChange={handleProductChange}
                      placeholder="예: 인텔 코어 i9-14900K"
                      className="spec-input"
                      required
                      disabled={isSubmitting}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="label-cell">제조사</td>
                  <td className="input-cell">
                    <input
                      type="text"
                      name="manufacturer"
                      value={product.manufacturer}
                      onChange={handleProductChange}
                      placeholder="예: Intel, AMD"
                      className="spec-input"
                      disabled={isSubmitting}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="label-cell">가격 (원) *</td>
                  <td className="input-cell">
                    <input
                      type="text"
                      name="price"
                      value={product.price}
                      onChange={handleProductChange}
                      placeholder="예: 750000"
                      className="spec-input"
                      required
                      disabled={isSubmitting}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="label-cell">카테고리</td>
                  <td className="input-cell">
                    <select
                      name="category"
                      value={product.category}
                      onChange={handleProductChange}
                      className="spec-select"
                      disabled={isSubmitting}
                    >
                      <option value="CPU">CPU</option>
                      <option value="COOLER">쿨러</option>
                      <option value="MAINBOARD">메인보드</option>
                      <option value="MEMORY">메모리</option>
                      <option value="GPU">그래픽카드</option>
                      <option value="STORAGE">디스크</option>
                      <option value="CASE">케이스</option>
                      <option value="POWER">파워</option>
                    </select>
                  </td>
                </tr>

                {/* ✅ 이미지 업로드 섹션 */}
                <tr>
                  <td className="label-cell">상품 이미지</td>
                  <td className="input-cell">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isSubmitting}
                    />
                    {imagePreview && (
                      <div style={{ marginTop: "10px" }}>
                        <img
                          src={imagePreview}
                          alt="미리보기"
                          style={{
                            width: "180px",
                            height: "auto",
                            borderRadius: "6px",
                            border: "1px solid #eee",
                          }}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 상세 스펙 (동적) */}
          <div className="spec-group">
            <h3>상세 스펙</h3>

            {/* 기존 스펙 목록 */}
            {Object.keys(specs).length > 0 && (
              <table className="spec-table">
                <tbody>
                  {Object.entries(specs).map(([key, value]) => (
                    <tr key={key}>
                      <td className="label-cell">{key}</td>
                      <td className="input-cell">
                        <input
                          type="text"
                          value={value}
                          onChange={(e) =>
                            handleSpecChange(key, e.target.value)
                          }
                          className="spec-input"
                          disabled={isSubmitting}
                        />
                      </td>
                      <td className="action-cell">
                        <button
                          type="button"
                          onClick={() => removeSpecField(key)}
                          className="remove-btn"
                          disabled={isSubmitting}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 새 필드 추가 영역 */}
            <div className="add-field-section">
              <h4>새 스펙 필드 추가</h4>
              <div className="add-field-inputs">
                <input
                  type="text"
                  value={newFieldKey}
                  onChange={(e) => setNewFieldKey(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="필드명 (예: 코어수)"
                  className="field-key-input"
                  disabled={isSubmitting}
                  ref={keyInputRef}
                />
                <input
                  type="text"
                  value={newFieldValue}
                  onChange={(e) => setNewFieldValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="값 (예: 24)"
                  className="field-value-input"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={addSpecField}
                  className="add-field-btn"
                  disabled={isSubmitting}
                >
                  + 추가
                </button>
              </div>
              <p className="hint-text">* Enter 키를 눌러도 추가됩니다</p>
            </div>
          </div>

          {/* 제출 버튼 */}
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "등록 중..." : "상품 등록"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Input;
