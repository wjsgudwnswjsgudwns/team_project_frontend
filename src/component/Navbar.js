import { Link } from "react-router-dom";
import logo from "../images/logo.png";
import "./Navbar.css";

function Navbar({ user, onLogout }) {
  return (
    <nav>
      <Link to="/">
        <img src={logo} alt="로고" className="navbar-logo"></img>
      </Link>
      <div>
        {!user && <Link to="/login">로그인</Link>}

        {user && (
          <button className="logout-btn" onClick={onLogout}>
            로그아웃
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
