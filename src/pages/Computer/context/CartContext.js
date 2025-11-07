import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../../api/axiosConfig";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    CPU: null,
    COOLER: null,
    MAINBOARD: null,
    MEMORY: null,
    GPU: null,
    STORAGE: null,
    CASE: null,
    POWER: null,
  });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await api.get("/api/cart");
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.cart)
        ? res.data.cart
        : [];

      const mapped = {
        CPU: null,
        COOLER: null,
        MAINBOARD: null,
        MEMORY: null,
        GPU: null,
        STORAGE: null,
        CASE: null,
        POWER: null,
      };

      data.forEach((item) => {
        if (item.category && mapped.hasOwnProperty(item.category)) {
          mapped[item.category] = item;
        }
      });

      setCart(mapped);
      console.log("카테고리별 장바구니:", mapped);
    } catch (err) {
      console.error("장바구니 불러오기 실패:", err);
    }
  };

  const addToCart = async (productId, category) => {
    try {
      console.log("담기 시도:", productId, "카테고리:", category);

      // 기존 카테고리에 이미 상품이 있으면 교체
      const existing = cart[category];
      if (existing) {
        await api.delete(`/api/cart/${existing.id}`);
      }

      // 새 제품 추가
      await api.post("/api/cart", { productId, quantity: 1 });

      // 최신화
      await loadCart();
    } catch (err) {
      console.error("담기 실패:", err);
      if (err.response?.status === 401) {
        alert("로그인이 필요합니다.");
      } else {
        alert("담기 중 오류가 발생했습니다.");
      }
    }
  };

  const removeFromCart = async (category) => {
    try {
      const currentItem = cart[category];
      if (!currentItem) return;

      await api.delete(`/api/cart/${currentItem.id}`);
      await loadCart();
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  const totalPrice = Object.values(cart).reduce((sum, item) => {
    if (!item) return sum;
    const price = parseInt(item.price?.replace(/[^0-9]/g, "") || 0);
    const quantity = item.quantity || 1;
    return sum + price * quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, totalPrice, loadCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
