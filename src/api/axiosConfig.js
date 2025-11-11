import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8880",
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 - 디버깅 강화
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log(
      "🔑 인터셉터 - 토큰:",
      token ? `${token.substring(0, 20)}...` : "없음"
    );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("📤 요청:", config.method.toUpperCase(), config.url);
    console.log("📋 헤더:", config.headers.Authorization);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    console.log("✅ 응답 성공:", response.config.url, response.status);
    return response;
  },
  (error) => {
    console.log("❌ 응답 실패:", error.config?.url, error.response?.status);

    if (error.response?.status === 401) {
      console.warn("🚫 401 에러 - 인증 실패, 토큰 삭제");
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
