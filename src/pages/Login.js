import React, { useState, useEffect } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('employee'); // 'employee' or 'user'
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(credentials.username, credentials.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <Container>
        <div className="login-card card">
          {/* 탭 헤더 */}
          <div className="login-tabs d-flex">
            <button 
              className={`login-tab ${activeTab === 'employee' ? 'active' : ''}`}
              onClick={() => setActiveTab('employee')}
            >
              직원 로그인
            </button>
            <button 
              className={`login-tab ${activeTab === 'user' ? 'active' : ''}`}
              onClick={() => setActiveTab('user')}
            >
              사용자 로그인
            </button>
          </div>

          {/* 로그인 콘텐츠 */}
          <div className="login-content">
            {/* 왼쪽 이미지 영역 */}
            <div className="login-left">
              <div className="login-image-placeholder">
                관련 이미지
              </div>
            </div>

            {/* 오른쪽 폼 영역 */}
            <div className="login-right">
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <div className="login-form-group">
                  <label className="login-form-label">아이디</label>
                  <input
                    type="text"
                    name="username"
                    className="login-form-control"
                    value={credentials.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="login-form-group">
                  <label className="login-form-label">비밀번호</label>
                  <input
                    type="password"
                    name="password"
                    className="login-form-control"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="login-checkbox">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="rememberMe">아이디 기억하기</label>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ fontSize: '14px', color: '#6c757d' }}>아이디 찾기</span>
                  <span style={{ fontSize: '14px', color: '#6c757d' }}>비밀번호 찾기</span>
                </div>

                <div style={{ marginTop: '30px' }}>
                  <button 
                    type="submit" 
                    className="login-btn"
                    disabled={loading}
                  >
                    {loading ? '로그인 중...' : '로그인'}
                  </button>
                </div>
              </form>

              {activeTab === 'user' && (
                <div className="unique-number-info">
                  고유 번호로 추모관 입장하기
                </div>
              )}

              <div className="login-links">
                {activeTab === 'employee' && (
                  <>
                    <a href="#" className="login-link">직원 회원가입</a>
                    <a href="#" className="login-link">사용자 회원가입</a>
                  </>
                )}
              </div>

              <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#6c757d' }}>
                테스트용 계정: user / password
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;
