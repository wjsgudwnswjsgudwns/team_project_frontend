import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ComputerSidebar from "./ComputerSidebar";
import api from "../../api/axiosConfig";
import "./CpuView.css";

function CpuView({ role }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/products/${id}`);
      setProduct(response.data);
      setError(null);
    } catch (err) {
      console.error("상품 조회 실패:", err);
      setError("상품 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      await api.delete(`/api/products/${id}`);
      alert("삭제되었습니다.");
      navigate("/cpu");
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제에 실패했습니다.");
    }
  };

  const goBack = () => {
    navigate("/cpu");
  };

  if (loading) {
    return (
      <div className="cpu-page-container">
        <ComputerSidebar />
        <div className="cpu-view-content">
          <div className="loading">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="cpu-page-container">
        <ComputerSidebar />
        <div className="cpu-view-content">
          <div className="error">{error || "상품을 찾을 수 없습니다."}</div>
          <button onClick={goBack} className="back-btn">
            목록으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cpu-page-container">
      <ComputerSidebar />
      <div className="cpu-view-content">
        {/* 상단 헤더 */}
        <div className="view-header">
          <h1>{product.name}</h1>
        </div>

        {/* 기본 정보 */}
        <div className="info-section">
          <h2>기본 정보</h2>
          <table className="info-table">
            <tbody>
              <tr>
                <td className="info-label">제조사</td>
                <td className="info-value">{product.manufacturer || "-"}</td>
              </tr>
              <tr>
                <td className="info-label">가격</td>
                <td className="info-value">
                  {parseInt(product.price).toLocaleString()}원
                </td>
              </tr>
              <tr>
                <td className="info-label">카테고리</td>
                <td className="info-value">{product.category}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 상세 스펙 */}
        <div className="spec-section">
          <h2>상세 스펙</h2>
          {product.specs && Object.keys(product.specs).length > 0 ? (
            <table className="spec-table">
              <tbody>
                {Object.entries(product.specs).map(([key, value]) => (
                  <tr key={key}>
                    <td className="spec-label">{key}</td>
                    <td className="spec-value">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-specs">등록된 상세 스펙이 없습니다.</p>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="view-actions">
          <button onClick={goBack} className="list-btn">
            목록
          </button>
          {role === "ROLE_ADMIN" && (
            <>
              <Link to={`/cpu/edit/${id}`} className="edit-btn">
                수정
              </Link>
              <button onClick={handleDelete} className="delete-btn">
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CpuView;
