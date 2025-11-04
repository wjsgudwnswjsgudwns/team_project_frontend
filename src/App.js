import { useEffect, useState } from "react";
import "./App.css";

import api from "./api/axiosConfig";
import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./component/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import OAuth2RedirectHandler from "./pages/OAuth2RedirectHandler";

function App() {
  const [user, setUser] = useState(null); // 현재 로그인한 유저의 이름

  const navigate = useNavigate("");

  // 사용자 확인
  const checkUser = async () => {
    try {
      const res = await api.get("/api/auth/me");
      console.log("/api/auth/me 응답:", res.data);
      setUser(res.data.nickname);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  // 로그 아웃
  const handleLogout = async () => {
    localStorage.removeItem("token");
    // await api.get("/api/auth/logout");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="App">
      <Navbar onLogout={handleLogout} user={user} />
      <Routes>
        <Route path="/" element={<Home user={user} />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login onLogin={setUser} />}></Route>
        <Route
          path="/oauth2/redirect"
          element={<OAuth2RedirectHandler onLogin={setUser} />}
        />
      </Routes>
    </div>
  );
}

export default App;
