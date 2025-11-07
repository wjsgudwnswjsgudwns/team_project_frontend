import React from "react";
import { useCart } from "../context/CartContext";

function CartPanel() {
  const { cart, removeFromCart, totalPrice } = useCart();

  const categoryOrder = [
    "CPU",
    "COOLER",
    "MAINBOARD",
    "MEMORY",
    "GPU",
    "STORAGE",
    "CASE",
    "POWER",
  ];

  return (
    <div className="cart-panel">
      <h3>견적 리스트</h3>

      {categoryOrder.map((cat) => {
        const item = cart[cat];
        return (
          <div key={cat} className="cart-item">
            <div className="cart-item-header">
              <span className="cart-category">{cat}</span>
            </div>

            {item ? (
              <div className="cart-item-content">
                <div className="cart-name">{item.productName}</div>
                <div className="cart-bottom">
                  <span className="cart-quantity">수량: {item.quantity}</span>
                  <span className="cart-price">
                    {parseInt(item.price).toLocaleString()}원
                  </span>
                  <button
                    className="cart-remove"
                    onClick={() => removeFromCart(cat)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-slot">제품이 없습니다.</div>
            )}
          </div>
        );
      })}

      <div className="cart-total">총합: {totalPrice.toLocaleString()}원</div>
    </div>
  );
}

export default CartPanel;
