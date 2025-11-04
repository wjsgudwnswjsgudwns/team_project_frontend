import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axiosConfig";

function OAuth2RedirectHandler({ onLogin, setRole }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      console.log("OAuth2 토큰 받음:", token);

      // 토큰 저장
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 사용자 정보 가져오기
      const fetchUser = async () => {
        try {
          const response = await api.get("/api/auth/me");
          console.log("OAuth2 사용자 정보:", response.data);
          onLogin(response.data.nickname);

          const savedRole = localStorage.getItem("role");
          if (savedRole) {
            setRole(savedRole);
          }

          navigate("/", { replace: true });
        } catch (err) {
          console.error("사용자 정보 가져오기 실패:", err);
          alert("로그인 처리 중 오류가 발생했습니다.");
          navigate("/login");
        }
      };

      fetchUser();
    } else {
      console.error("토큰이 없습니다.");
      navigate("/login");
    }
  }, [searchParams, navigate, onLogin, setRole]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h2>로그인 처리 중...</h2>
        <p>잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}

export default OAuth2RedirectHandler;
