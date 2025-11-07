import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ComputerSidebar from "./ComputerSidebar";
import api from "../../api/axiosConfig";
import "./Cpu.css";

function Cpu({ role }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [addingToCart, setAddingToCart] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/products");
      const cpuProducts = response.data.filter(
        (product) => product.category === "CPU"
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = (productId) => {
    navigate(`/cpu/${productId}`);
  };

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();

    try {
      setAddingToCart((prev) => ({ ...prev, [productId]: true }));
      await api.post("/api/cart", {
        productId: productId,
        quantity: 1,
      });
      alert("장바구니에 추가되었습니다.");
    } catch (err) {
      console.error("장바구니 추가 실패:", err);
      if (err.response?.status === 401) {
        alert("로그인이 필요합니다.");
        navigate("/login");
      } else {
        alert("장바구니 추가에 실패했습니다.");
      }
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
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
        <div className="page-header">
          <h1>CPU</h1>
        </div>

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

        <div className="product-list">
          {filteredProducts.length === 0 ? (
            <div className="no-data">
              {searchTerm ? "검색 결과가 없습니다." : "등록된 상품이 없습니다."}
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-item"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="product-number">{product.id}</div>

                <div className="product-image">
                  <img src={product.imageUrl} alt={product.name} />
                </div>

                <div className="product-info">
                  <h3 className="product-title">{product.name}</h3>

                  <div className="product-specs">
                    {product.manufacturer && (
                      <span className="spec-text">{product.manufacturer}</span>
                    )}
                    {product.specifications &&
                      Object.entries(JSON.parse(product.specifications)).map(
                        ([key, value], index) => (
                          <span key={index} className="spec-text">
                            {value}
                          </span>
                        )
                      )}
                  </div>
                </div>

                <div className="product-actions">
                  <div className="price-section">
                    <span className="price-label">판매가</span>
                    <span className="product-price">
                      {parseInt(product.price).toLocaleString()}원
                    </span>
                  </div>

                  <button
                    className="cart-btn"
                    onClick={(e) => handleAddToCart(e, product.id)}
                    disabled={addingToCart[product.id]}
                  >
                    {addingToCart[product.id] ? "추가중..." : "담기"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Cpu;
