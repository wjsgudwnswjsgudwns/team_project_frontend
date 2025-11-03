import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./Signup.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});

    // 전송할 데이터 확인
    const signupData = {
      username,
      password,
      passwordCheck,
      email,
      nickname,
    };
    console.log("전송 데이터:", signupData);

    try {
      const response = await api.post("/api/auth/signup", signupData);
      console.log("성공 응답:", response.data);
      alert("회원 가입 성공");
      navigate("/login");
    } catch (err) {
      console.error("에러 전체:", err);
      console.error("에러 응답:", err.response);
      console.error("에러 데이터:", err.response?.data);

      if (err.response && err.response.status === 400) {
        const errorData = err.response.data;
        console.log("400 에러 상세:", errorData);
        setErrors(errorData);

        // 에러 메시지 콘솔 출력
        Object.keys(errorData).forEach((key) => {
          console.log(`${key}: ${errorData[key]}`);
        });
      } else {
        console.error("회원가입 실패:", err.message);
        alert("회원 가입 실패: " + err.message);
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">회원가입</h2>
        <form onSubmit={handleSignup} className="signup-form">
          <input
            type="text"
            className="signup-input"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {errors.username && <p className="signup-error">{errors.username}</p>}
          {errors.userIdDuplicated && (
            <p className="signup-error">{errors.userIdDuplicated}</p>
          )}

          <input
            type="text"
            className="signup-input"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
          {errors.nickname && <p className="signup-error">{errors.nickname}</p>}
          {errors.nicknameDuplicated && (
            <p className="signup-error">{errors.nicknameDuplicated}</p>
          )}

          <input
            type="password"
            className="signup-input"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className="signup-error">{errors.password}</p>}
          {errors.passwordLengthError && (
            <p className="signup-error">{errors.passwordLengthError}</p>
          )}

          <input
            type="password"
            className="signup-input"
            placeholder="비밀번호 확인"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            required
          />
          {errors.passwordCheck && (
            <p className="signup-error">{errors.passwordCheck}</p>
          )}
          {errors.passwordNotSame && (
            <p className="signup-error">{errors.passwordNotSame}</p>
          )}

          <input
            type="email"
            className="signup-input"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className="signup-error">{errors.email}</p>}

          <button type="submit" className="signup-submit-btn">
            회원가입
          </button>
        </form>
        <div className="signup-login-link">
          이미 계정이 있으신가요?
          <Link to="/login">로그인</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
