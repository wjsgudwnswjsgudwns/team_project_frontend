import React, { useEffect, useState } from "react";
import { useCart } from "./context/CartContext";
import api from "../../api/axiosConfig";
import CartPanel from "./cartcomponents/CartPanel";
import ComputerSidebar from "./ComputerSidebar";
import { Link, useNavigate } from "react-router-dom";
import "./Cpu.css";

function HardCase({ role }) {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    api
      .get("/api/products")
      .then((res) => {
        const cpuProducts = res.data.filter((p) => p.category === "CASE");
        setProducts(cpuProducts);
      })
      .catch((err) => console.error(err));
  }, []);

  const navigate = useNavigate();

  // 상세보기로 이동
  const handleRowClick = (productId) => {
    navigate(`/case/${productId}`);
  };

  return (
    <div>
      <div className="page-container">
        <ComputerSidebar />
        <div className="product-list">
          <div className="category-title">케이스</div>
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <img src={p.imageUrl} alt={p.name} width="120" />
              <h4 onClick={() => handleRowClick(p.id)}>{p.name}</h4>
              <div className="product-price-container">
                <p>{Number(p.price).toLocaleString()}원</p>
                <button onClick={() => addToCart(p.id, "CASE")}>담기</button>
              </div>
            </div>
          ))}

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

export default HardCase;
