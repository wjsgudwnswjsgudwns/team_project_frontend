import { useEffect, useState } from "react";
import "./App.css";

import api from "./api/axiosConfig";
import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./component/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import OAuth2RedirectHandler from "./pages/OAuth2RedirectHandler";
import Cpu from "./pages/Computer/Cpu";
import AiConsult from "./pages/AiConsult";
import Input from "./pages/Computer/Input";
import CpuView from "./pages/Computer/CpuView";

function App() {
  const [user, setUser] = useState(null); // 현재 로그인한 유저의 이름
  const [role, setRole] = useState(null); // 사용자 역할

  const navigate = useNavigate("");

  // 사용자 확인
  const checkUser = async () => {
    try {
      const res = await api.get("/api/auth/me");
      console.log("/api/auth/me 응답:", res.data);
      setUser(res.data.nickname);

      const savedRole = localStorage.getItem("role"); // 역할 가져오기
      setRole(savedRole); // 역할 저장
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  // 로그 아웃
  const handleLogout = async () => {
    localStorage.removeItem("token"); // 토큰 삭제
    localStorage.removeItem("role"); // 권한 삭제

    setUser(null);
    setRole(null);
    navigate("/");
  };

  return (
    <div className="App">
      <Navbar onLogout={handleLogout} user={user} role={role} />
      <Routes>
        <Route path="/" element={<Home user={user} role={role} />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route
          path="/login"
          element={<Login onLogin={setUser} setRole={setRole} />}
        ></Route>
        <Route
          path="/oauth2/redirect"
          element={
            <OAuth2RedirectHandler onLogin={setUser} setRole={setRole} />
          }
        />
        <Route path="/cpu" element={<Cpu role={role} />}></Route>
        <Route path="/inputCpu" element={<Input />}></Route>
        <Route path="/ai" element={<AiConsult />}></Route>
        <Route path="/cpu/:id" element={<CpuView role={role} />}></Route>
      </Routes>
    </div>
  );
}

export default App;
