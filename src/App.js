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
import Menu1_4 from './pages/Menu1-4';
import Menu1_5 from './pages/Menu1-5';
import Menu2 from './pages/Menu2';
import Menu2F from './pages/Menu2F';
import Menu3 from './pages/Menu3';
import Menu4 from './pages/Menu4';
import Menu5 from './pages/Menu5';
import Menu5_1 from './pages/Menu5_1';
import Menu5_2 from './pages/Menu5_2';
import MemorialDetail from './pages/MemorialDetail';
import MemorialConfig from './pages/MemorialConfig';
import Lobby from './pages/Lobby';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';


// Login 컴포넌트와 SignUp 컴포넌트를 임포트합니다.
import SignUp from './pages/SignUp';
import UserConfig from './pages/UserConfig';
import PasswordCheck from './pages/PasswordCheck';
import PrivacyPolicy from './pages/privacyPolicy';
import TermsOfService from './pages/termsOfService';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/findId" element={<FindId />} />
                        <Route path="/findPassword" element={<FindPassword />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
                        <Route path="/termsOfService" element={<TermsOfService />} />
                        {/* Guest Layout (no auth required) */}
                        <Route path="/memorial/:id/guest" element={<GuestLayout><MemorialDetail /></GuestLayout>} />

                        {/* Employee Protected Routes */}
                        <Route element={<PrivateRoute allowedUserTypes={['employee']} />}>
                            <Route path="/" element={<NavbarWrapper><Home /></NavbarWrapper>} />
                            <Route path="/menu1-1" element={<NavbarWrapper><Menu1_1 /></NavbarWrapper>} />
                            <Route path="/menu1-2" element={<NavbarWrapper><Menu1_2 /></NavbarWrapper>} />
                            <Route path="/menu1-3" element={<NavbarWrapper><Menu1_3 /></NavbarWrapper>} />
                            <Route path="/menu1-4" element={<NavbarWrapper><Menu1_4 /></NavbarWrapper>} />
                            <Route path="/menu1-5" element={<NavbarWrapper><Menu1_5 /></NavbarWrapper>} />
                            <Route path="/menu1/*" element={<Navigate to="/menu1-1" replace />} />
                            <Route path="/menu2" element={<NavbarWrapper><Menu2 /></NavbarWrapper>} />
                            <Route path="/menu2f" element={<NavbarWrapper><Menu2F /></NavbarWrapper>} />
                            <Route path="/menu3" element={<NavbarWrapper><Menu3 /></NavbarWrapper>} />
                            <Route path="/menu4" element={<NavbarWrapper><Menu4 /></NavbarWrapper>} />
                            <Route path="/menu5" element={<NavbarWrapper><Menu5 /></NavbarWrapper>} />
                            <Route path="/menu5_1/:id" element={<NavbarWrapper><Menu5_1 /></NavbarWrapper>} />
                            <Route path="/menu5_2" element={<NavbarWrapper><Menu5_2 /></NavbarWrapper>} />
                            <Route path="/memorial/:id" element={<NavbarWrapper><MemorialDetail /></NavbarWrapper>} />
                            <Route path="/memorial/:id/settings" element={<NavbarWrapper><MemorialConfig /></NavbarWrapper>} />

                        </Route>

                        {/* User Protected Routes */}
                        <Route element={<PrivateRoute allowedUserTypes={['user']} />}>
                            <Route path="/lobby" element={<Lobby />} />
                            <Route path="/user-memorial/:id" element={<MemorialDetail />} />
                            <Route path="/user-memorial/:id/settings" element={<MemorialConfig />} />
                        </Route>

                        <Route element={<PrivateRoute allowedUserTypes={['employee', 'user']} />}>
                            <Route path="/password-check" element={<NavbarWrapper><PasswordCheck /></NavbarWrapper>} />
                            <Route path="/user-config" element={<NavbarWrapper><UserConfig /></NavbarWrapper>} />
                        </Route>

                        {/* Fallback for any unmatched routes */}
                        <Route path="*" element={<Navigate to="/login" replace />} />
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
                <Route path="/menu1-4" element={<Menu1_4 />} />
                <Route path="/menu1-5" element={<Menu1_5 />} />
                <Route path="/menu1/*" element={<Navigate to="/menu1-1" replace />} />
                <Route path="/menu2" element={<Menu2 />} />
                <Route path="/menu3" element={<Menu3 />} />
                <Route path="/menu4" element={<Menu4 />} />
                <Route path="/menu5" element={<Menu5 />} />
                <Route path="/menu5_1/:id" element={<Menu5_1 />} />
                <Route path="/menu5_2" element={<Menu5_2 />} />

                <Route path="/memorial/:id" element={<MemorialDetail />} />
                <Route path="/memorial/:id/settings" element={<MemorialConfig />} />
                <Route path="/password-check" element={<PasswordCheck />} />
                <Route path="/user-config" element={<UserConfig />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

const UserLayout = ({ children }) => {
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

    // 네비게이션 바 없이 직접 컴포넌트 렌더링
    return children;
};

const GuestLayout = ({ children }) => {
    // 로그인 없이 고유번호로 접근한 경우 - 네비게이션 바 없음
    return children;
};

const NavbarWrapper = ({ children }) => {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
};

export default App;