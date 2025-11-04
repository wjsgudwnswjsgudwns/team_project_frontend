import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./Login.css";

function Login({ onLogin, setRole }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // 일반 로그인
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

      // 토큰 저장, 유저 역할 저장
      const token = loginResponse.data.token;
      const userRole = loginResponse.data.role;

      localStorage.setItem("token", token);
      localStorage.setItem("role", userRole);

      // Authorization 헤더에 토큰 설정
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 사용자 정보 가져오기
      const userResponse = await api.get("/api/auth/me");
      console.log("사용자 정보:", userResponse.data);

      onLogin(userResponse.data.nickname);
      setRole(userRole); // 역할 설정

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

  // 네이버 로그인
  const handleNaverLogin = () => {
    window.location.href = "http://localhost:8880/oauth2/authorization/naver";
  };

  return (
    <div className="login-container">
      {/* 일반 로그인 시작 */}
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
        {/* 일반 로그인 끝 */}

        {/* 네이버 로그인 시작 */}
        <div className="divider">
          <span>또는</span>
        </div>

        <button
          className="naver-login-btn"
          onClick={handleNaverLogin}
          type="button"
        >
          <svg viewBox="0 0 20 20" className="naver-icon">
            <g>
              <path
                fill="#fff"
                d="M13.48 10.77L8.57 3.25H4.8V16.8h5.16V9.28l4.91 7.52h3.77V3.25h-5.16v7.52z"
              />
            </g>
          </svg>
          네이버 로그인
        </button>
        {/* 네이버 로그인 끝 */}

        {/* 회원 가입 시작 */}
        <div className="login-signup-link">
          <span>아직 계정이 없으신가요? </span>
          <Link to="/signup">회원가입</Link>
        </div>
        {/* 회원 가입 끝 */}
      </div>
    </div>
  );
}

export default Login;
