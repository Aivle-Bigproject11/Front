import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// 컴포넌트 import
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Menu1 from './pages/Menu1';
import Menu2 from './pages/Menu2';
import Menu3 from './pages/Menu3';
import Menu4 from './pages/Menu4';
import MemorialDetail from './pages/MemorialDetail';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Login 컴포넌트와 SignUp 컴포넌트를 임포트합니다. 
import SignUp from './pages/SignUp';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* 회원가입 페이지 경로추가 */}
                <Route path="/signup" element={<SignUp />} /> 

            <Route path="/*" element={<MainLayout />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const MainLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu1" element={<Menu1 />} />
        <Route path="/menu2" element={<Menu2 />} />
        <Route path="/menu3" element={<Menu3 />} />
        <Route path="/menu4" element={<Menu4 />} />
        <Route path="/memorial/:id" element={<MemorialDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
