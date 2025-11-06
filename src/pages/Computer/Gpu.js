import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ComputerSidebar from "./ComputerSidebar";
import api from "../../api/axiosConfig";
import "./Cpu.css";

function Gpu({ role }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // 상품 목록 가져오기
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/products");
      const cpuProducts = response.data.filter(
        (product) => product.category === "GPU"
      );
      setProducts(cpuProducts);
      setError(null);
    } catch (err) {
      console.error("상품 목록 조회 실패:", err);
      setError("상품 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 검색 필터링
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 상세보기로 이동
  const handleRowClick = (productId) => {
    navigate(`/gpu/${productId}`);
  };

  if (loading) {
    return (
      <div className="cpu-page-container">
        <ComputerSidebar />
        <div className="cpu-content">
          <div className="loading">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cpu-page-container">
        <ComputerSidebar />
        <div className="cpu-content">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cpu-page-container">
      <ComputerSidebar />
      <div className="cpu-content">
        {/* 헤더 */}
        <div className="page-header">
          <h1>그래픽카드</h1>
        </div>

        {/* 검색 & 등록 버튼 */}
        <div className="board-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="상품명 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="search-btn">🔍</button>
          </div>
          {role === "ROLE_ADMIN" && (
            <Link to="/input" className="write-btn">
              글쓰기
            </Link>
          )}
        </div>

        {/* 게시판 테이블 */}
        <div className="board-wrapper">
          <table className="board-table">
            <thead>
              <tr>
                <th className="col-no">이미지</th>
                <th className="col-title">상품</th>
                <th className="col-manufacturer">제조사</th>
                <th className="col-price">가격</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-data">
                    {searchTerm
                      ? "검색 결과가 없습니다."
                      : "등록된 상품이 없습니다."}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    onClick={() => handleRowClick(product.id)}
                    className="board-row"
                  >
                    <td className="col-no">
                      <img src={product.imageUrl} alt={product.name} />
                    </td>
                    <td className="col-title">{product.name}</td>
                    <td className="col-manufacturer">
                      {product.manufacturer || "-"}
                    </td>
                    <td className="col-price">
                      {parseInt(product.price).toLocaleString()}원
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Gpu;
