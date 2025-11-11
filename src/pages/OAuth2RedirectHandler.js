import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axiosConfig";

function OAuth2RedirectHandler({ onLogin, setRole }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      console.error("토큰이 없습니다.");
      alert("로그인에 실패했습니다.");
      navigate("/login");
      return;
    }

    console.log("OAuth2 토큰 받음:", token);

    // 토큰 저장 및 헤더 설정
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // 사용자 정보 가져오기
    const fetchUser = async () => {
      try {
        const response = await api.get("/api/auth/me");
        console.log("OAuth2 사용자 정보:", response.data);

        const { nickname, role } = response.data;

        // ✅ role 저장
        if (role) {
          localStorage.setItem("role", role);
          setRole(role);
        }

        onLogin(nickname || response.data.username);

        alert("로그인 성공!");
        navigate("/", { replace: true });
      } catch (err) {
        console.error("사용자 정보 가져오기 실패:", err);
        console.error("에러 응답:", err.response?.data);

        // 토큰이 유효하지 않은 경우
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];

        alert("로그인 처리 중 오류가 발생했습니다.");
        navigate("/login");
      }
    };

    fetchUser();
  }, [searchParams, navigate, onLogin, setRole]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "5px solid #f3f3f3",
            borderTop: "5px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px",
          }}
        ></div>
        <h2>로그인 처리 중...</h2>
        <p>잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}

export default OAuth2RedirectHandler;
