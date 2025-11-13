import { Link } from "react-router-dom";
import logo from "../images/logo-white-Photoroom.png";
import "./Navbar.css";
import { useState } from "react";

function Navbar({ user, onLogout, role }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav>
        <Link to="/">
          <img src={logo} alt="로고" className="navbar-logo"></img>
        </Link>
        <div>
          {!user && <Link to="/login">로그인</Link>}

          {user && (
            <div className="user-menu-container">
              <span className="user-nickname">{user} 님</span>

              <div className="dropdown-menu">
                <Link to="/mypage" className="menu-item">
                  마이페이지
                </Link>
                <button
                  className="menu-item logout-btn-dropdown"
                  onClick={onLogout}
                >
                  로그아웃
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="sub-navbar-container">
        <button className="menu-toggle-btn" onClick={toggleMenu}>
          ☰
        </button>

        {/* 주요 메뉴 항목 */}
        <div className="sub-navbar-menu">
          <Link to="/ai" className="sub-menu-item">
            AI 컴퓨터 견적
          </Link>
          <Link to="/aichart" className="sub-menu-item">
            시세 차트
          </Link>
          <Link to="/counsel-board" className="sub-menu-item">
          <Link to="/counselboard" className="sub-menu-item">
            PC 구매 상담
          </Link>
          <Link to="/freeboard" className="sub-menu-item">
            자유 게시판
          </Link>
          <Link to="/infoboard" className="sub-menu-item">
            정보 게시판
          </Link>
          <Link to="/cpu" className="sub-menu-item">
            PC 주요 구성
          </Link>
        </div>
      </div>

      {isMenuOpen && (
        <div className="side-dropdown-menu">
          <div className="side-menu-section">
            <Link to="/cpu" className="side-menu-item" onClick={toggleMenu}>
              CPU
            </Link>
            <Link to="/cooler" className="side-menu-item" onClick={toggleMenu}>
              쿨러
            </Link>
            <Link
              to="/mainboard"
              className="side-menu-item"
              onClick={toggleMenu}
            >
              메인보드
            </Link>
            <Link to="/memory" className="side-menu-item" onClick={toggleMenu}>
              메모리
            </Link>
            <Link to="/gpu" className="side-menu-item" onClick={toggleMenu}>
              그래픽카드
            </Link>
            <Link to="/disk" className="side-menu-item" onClick={toggleMenu}>
              디스크 (SSD/HDD)
            </Link>
            <Link to="/case" className="side-menu-item" onClick={toggleMenu}>
              케이스
            </Link>
            <Link to="/power" className="side-menu-item" onClick={toggleMenu}>
              파워
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
