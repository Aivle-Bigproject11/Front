import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 
import icon from '../../assets/logo/lumora bgx.png';
import { User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const maskName = (name) => {
    if (!name) return '';
    return name.length > 1 ? name.slice(0, -1) + 'O' : 'O';
  };

  // --- 스타일 정의 ---
  // Jumbotron과 유사한 골드 그라데이션 스타일
  const navbarStyle = {
    background: 'linear-gradient(135deg, #3c2d20, #7a4e24)',                

    boxShadow: '0 4px 12px rgba(44, 31, 20, 0.2)',
    padding: '0.5rem 0',
  };

  // 기본 링크 스타일
  const linkStyle = {
    color: '#FFFBEB',
    fontWeight: '500',
    textShadow: '1px 1px 2px rgba(44, 31, 20, 0.5)',
    margin: '0 10px',
    transition: 'color 0.3s ease',
  };

  // 활성화된 링크 스타일
  const activeLinkStyle = {
    color: '#FFFFFF',
    fontWeight: '700',
  };
  
  // 사용자 환영 메시지 스타일
  const welcomeTextStyle = {
    color: '#FFFBEB',
    textShadow: '1px 1px 2px rgba(44, 31, 20, 0.5)',
  };

  // 로그아웃 버튼 스타일
  const logoutButtonStyle = {
    borderColor: '#FFFBEB',
    color: '#FFFBEB',
    transition: 'all 0.3s ease',
  };

  // 로그인하지 않은 경우 Navbar를 렌더링하지 않음
  if (!isAuthenticated) {
    return null;
  }

  return (
    <BootstrapNavbar expand="lg" variant="dark" style={navbarStyle} sticky="top">
      <Container style={{ maxWidth: '1600px' }}>
        <BootstrapNavbar.Brand as={Link} to="/" style={{...linkStyle, fontWeight: 'bold'}} className="d-flex align-items-center">
           <img
            src={icon}
            width="50"
            height="50"
            className="d-inline-block align-top me-2" // 이미지와 텍스트 사이에 여백
            alt="Lumora logo"
            style={{ marginTop: '-10px', marginBottom: '-10px' }} 
          />
          Lumora - AI 플랫폼
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* 각 메뉴 링크에 현재 경로와 비교하여 활성 스타일을 동적으로 적용합니다. */}
            <Nav.Link as={Link} to="/menu5" style={location.pathname.startsWith("/menu5") ? {...linkStyle, ...activeLinkStyle} : linkStyle}>고객 관리</Nav.Link>
            <Nav.Link as={Link} to="/menu3" style={location.pathname === "/menu3" ? {...linkStyle, ...activeLinkStyle} : linkStyle}>고객 맞춤형 Upselling</Nav.Link>
            <Nav.Link as={Link} to="/menu2N" style={location.pathname === "/menu2N" ? {...linkStyle, ...activeLinkStyle} : linkStyle}>인력운영 어드바이저</Nav.Link>
            <Nav.Link as={Link} to="/menu1-1" style={location.pathname.startsWith("/menu1") ? {...linkStyle, ...activeLinkStyle} : linkStyle}>장례서류 자동화</Nav.Link>
            <Nav.Link as={Link} to="/menu4" style={location.pathname === "/menu4" ? {...linkStyle, ...activeLinkStyle} : linkStyle}>디지털 추모관</Nav.Link>
          </Nav>
          <Nav>
            <span className="welcome-text">환영합니다, {maskName(user?.username || user?.name)}님!</span>
            <button onClick={() => navigate('/password-check')} className="lobby-logout-button user-config-button">
                <User size={12} style={{ marginRight: '6px' }} />내 정보
            </button>
            <button onClick={handleLogout} className="lobby-logout-button">
                <LogOut size={12} style={{ marginRight: '6px' }} />로그아웃
            </button>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
