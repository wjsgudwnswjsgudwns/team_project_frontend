import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./Login.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("로그인 시도:", { username, password });

    try {
      // JSON 형식으로 전송
      const loginResponse = await api.post("/api/auth/login", {
        username,
        password,
      });

      console.log("로그인 응답:", loginResponse.data);

      // 토큰 저장
      const token = loginResponse.data.token;
      localStorage.setItem("token", token);

      // Authorization 헤더에 토큰 설정
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 사용자 정보 가져오기
      const userResponse = await api.get("/api/auth/me");
      console.log("사용자 정보:", userResponse.data);

      onLogin(userResponse.data.username);
      alert("로그인 성공!");
      navigate("/", { replace: true });
    } catch (err) {
      console.error("로그인 에러:", err);
      console.error("에러 응답:", err.response?.data);
      console.error("에러 상태:", err.response?.status);

      if (err.response?.status === 401) {
        alert("잘못된 아이디 또는 비밀번호입니다.");
      } else if (err.response?.status === 403) {
        alert("접근이 거부되었습니다.");
      } else {
        alert("로그인 실패: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">OPTICORE</div>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            className="login-input"
            value={username}
            placeholder="아이디"
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
          <input
            type="password"
            className="login-input"
            value={password}
            placeholder="비밀번호"
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            className="login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>
        <div className="login-signup-link">
          <span>아직 계정이 없으신가요? </span>
          <Link to="/signup">회원가입</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
