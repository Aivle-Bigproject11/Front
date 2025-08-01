import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// 컴포넌트 import
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import FindId from './pages/FindId';
import FindPassword from './pages/FindPassword';
import Menu1_1 from './pages/Menu1-1';
import Menu1_2 from './pages/Menu1-2';
import Menu1_3 from './pages/Menu1-3';
import Menu2 from './pages/Menu2';
import Menu3 from './pages/Menu3';
import Menu4 from './pages/Menu4';
import MemorialDetail from './pages/MemorialDetail';
import MemorialConfig from './pages/MemorialConfig';
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
                        <Route path="/findId" element={<FindId />} />
                        <Route path="/findPassword" element={<FindPassword />} />
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
                <Route path="/menu1-1" element={<Menu1_1 />} />
                <Route path="/menu1-2" element={<Menu1_2 />} />
                <Route path="/menu1-3" element={<Menu1_3 />} />
                <Route path="/menu1/*" element={<Navigate to="/menu1-1" replace />} />
                <Route path="/menu2" element={<Menu2 />} />
                <Route path="/menu3" element={<Menu3 />} />
                <Route path="/menu4" element={<Menu4 />} />
                <Route path="/memorial/:id" element={<MemorialDetail />} />
                <Route path="/memorial/:id/settings" element={<MemorialConfig />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default App;