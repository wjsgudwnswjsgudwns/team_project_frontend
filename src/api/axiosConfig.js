import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8880",
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 요청 토큰:", token.substring(0, 20) + "...");
    } else {
      console.log("🔑 토큰 없음");
    }

    console.log("📤 요청:", config.method.toUpperCase(), config.url);

    return config;
  },
  (error) => {
    console.error("❌ 요청 인터셉터 에러:", error);
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

      // 로그인 페이지가 아닐 때만 리다이렉트
      if (
        window.location.pathname !== "/login" &&
        !window.location.pathname.startsWith("/oauth2")
      ) {
        alert("인증이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
