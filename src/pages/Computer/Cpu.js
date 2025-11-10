import React, { useEffect, useState } from "react";
import { useCart } from "./context/CartContext";
import api from "../../api/axiosConfig";
import CartPanel from "./cartcomponents/CartPanel";
import ComputerSidebar from "./ComputerSidebar";
import { Link, useNavigate } from "react-router-dom";
import "./Cpu.css";

function Cpu({ role }) {
  const [products, setProducts] = useState([]);
  const [searchName, setSearchName] = useState(""); // 검색어
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [totalElements, setTotalElements] = useState(0); // 전체 상품 수
  const [pageSize] = useState(10); // 페이지당 상품 수

  const { addToCart } = useCart();
  const navigate = useNavigate();

  // 상품 목록 불러오기
  useEffect(() => {
    loadProducts();
  }, [currentPage, searchName]);

  const loadProducts = () => {
    // 검색어가 있으면 검색 API, 없으면 전체 조회 API
    const url = searchName.trim()
      ? `/api/products/search?name=${searchName}&page=${currentPage}&size=${pageSize}&sortBy=id`
      : `/api/products/paging?page=${currentPage}&size=${pageSize}&sortBy=id`;

    // 페이징 응답에서 CPU 카테고리만 필터링
    api
      .get(url)
      .then((res) => {
        const cpuProducts = res.data.content.filter(
          (p) => p.category === "CPU"
        );
        setProducts(cpuProducts);
        setTotalPages(res.data.totalPages);
        setTotalElements(res.data.totalElements);
      })
      .catch((err) => console.error(err));
  };

  // 검색 버튼 클릭
  const handleSearch = () => {
    setCurrentPage(0); // 검색 시 첫 페이지로
    loadProducts();
  };

  // 검색어 입력 시 Enter 키 처리
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 페이지 변경
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // 상세보기로 이동
  const handleRowClick = (productId) => {
    navigate(`/cpu/${productId}`);
  };

  return (
    <div>
      <div className="page-container">
        <ComputerSidebar />
        <div className="product-list">
          <div className="category-title">CPU</div>

          {/* 검색창 */}
          <div className="search-container">
            <input
              type="text"
              placeholder="상품명으로 검색"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
            <button onClick={handleSearch} className="search-btn">
              검색
            </button>
          </div>

          {/* 상품 목록 */}
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <img src={p.imageUrl} alt={p.name} width="120" />
              <h4 onClick={() => handleRowClick(p.id)}>{p.name}</h4>
              <div className="product-price-container">
                <p>{Number(p.price).toLocaleString()}원</p>
                <button onClick={() => addToCart(p.id, "CPU")}>담기</button>
              </div>
            </div>
          ))}

          {/* 페이지네이션 */}
          {totalPages > 0 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="page-btn"
              >
                &lt;
              </button>

              <span className="page-info">
                {currentPage + 1} / {totalPages} 페이지
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="page-btn"
              >
                &gt;
              </button>
            </div>
          )}

          {/* 글쓰기 버튼 (관리자만) */}
          {role === "ROLE_ADMIN" && (
            <div className="write-btn-container">
              <Link to="/input" className="write-btn">
                글쓰기
              </Link>
            </div>
          )}
        </div>

        <CartPanel />
      </div>
    </div>
  );
}

export default Cpu;
