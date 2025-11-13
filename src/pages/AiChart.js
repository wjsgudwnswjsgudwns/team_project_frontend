import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../api/axiosConfig";
import "./AiChart.css";

function AiChart() {
  const [productName, setProductName] = useState(""); // 입력한 제품 이름
  const [priceData, setPriceData] = useState([]); // 가격 데이터
  const [loading, setLoading] = useState(false); // 로딩 중
  const [error, setError] = useState(""); // 에러 메시지

  const fetchPriceData = async () => {
    if (!productName.trim()) {
      // 제품명 빈칸일시
      setError("제품을 입력해주세요.");
      return; // 종료
    }

    setLoading(true);
    setError(""); // 에러 초기화
    setPriceData([]); // 이전 가격 데이터 초기화

    try {
      const response = await api.post("/api/ai/chart/history", {
        productName: productName, // 요청
      });

      setPriceData(response.data.priceHistory);
    } catch (err) {
      console.error(err);
      setError("가격 데이터를 가져오는데 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 엔터키
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchPriceData();
    }
  };

  return (
    <div className="ai-chart-container">
      <div className="input-section">
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="product-input"
          placeholder="제품 이름을 입력하세요. (예 : RTX 5060)"
          onKeyPress={handleKeyPress}
        ></input>

        <button
          onClick={fetchPriceData}
          disabled={loading}
          className={`search-button ${loading ? "loading" : ""}`}
        >
          시세 확인
        </button>
      </div>

      {/* 로딩 중 */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>가격 데이터를 불러오는 중...</p>
        </div>
      )}

      {/* 에러 발생 */}
      {error && <div className="error-message">{error}</div>}

      {!loading && priceData.length > 0 && (
        <div className="chart-container">
          <h2>{productName} 가격 변동 추이</h2>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="month"
                label={{ value: "월", position: "insideBottom", offset: -5 }}
              />

              <YAxis
                label={{
                  value: "가격 (원)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />

              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey="price"
                stroke="#8884d8"
                strokeWidth={2}
                name="가격"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default AiChart;
