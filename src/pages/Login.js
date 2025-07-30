import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
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
      <div className="login-card card">
        <div className="login-content">
          <>
            {/* 왼쪽 이미지 영역 */}
            <div className="login-left">
              <div className="login-image-placeholder">
                관련 이미지
              </div>
            </div>

            {/* 오른쪽 탭과 폼 영역 */}
            <div className="login-right">
              {/* 탭 헤더 */}
              <div className="login-tabs">
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

              {/* 폼 영역 */}
              <div className="login-form-area">
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
                    <a href="/FindId" className="login-link">아이디 찾기</a>
                    <a href="/FindPassword" className="login-link">비밀번호 찾기</a>
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

                {/* 고유번호로 추모관 입장하기: 항상 노출 */}
                <div className="unique-number-info" style={{ marginTop: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="text" placeholder="고유번호 입력" className="login-form-control" style={{ flex: 1 }} />
                  <button className="login-btn" style={{ width: '120px' }}>입장</button>
                </div>

                {/* 회원가입 버튼: 탭에 따라 노출 */}
                <div className="login-links" style={{ marginTop: '20px' }}>
                  {activeTab === 'employee' && (
                    <a href="/SignUp" className="login-link">직원 회원가입</a>
                  )}
                  {activeTab === 'user' && (
                    <a href="/SignUp" className="login-link">사용자 회원가입</a>
                  )}
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#6c757d' }}>
                  테스트용 계정: user / password
                </div>
              </div>
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default Login;
