import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <BootstrapNavbar expand="lg" bg="dark" variant="dark">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          추모관 시스템
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              active={location.pathname === "/"}
            >
              홈
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/menu1-1" 
              active={location.pathname.startsWith("/menu1")}
            >
              장례서류작성
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/menu2" 
              active={location.pathname === "/menu2"}
            >
              대시보드
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/menu3" 
              active={location.pathname === "/menu3"}
            >
              전환서비스추천
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/menu4" 
              active={location.pathname === "/menu4"}
            >
              디지털 추모관
            </Nav.Link>
          </Nav>
          <Nav>
            <BootstrapNavbar.Text className="me-3">
              환영합니다, {user?.username || user?.name}님!
            </BootstrapNavbar.Text>
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              로그아웃
            </Button>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
