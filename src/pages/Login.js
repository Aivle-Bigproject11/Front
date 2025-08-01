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
  const [animateCard, setAnimateCard] = useState(false);
  const { loginByType, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    // 카드 애니메이션 효과
    setAnimateCard(true);
  }, [isAuthenticated, navigate]);

  // 탭 전환시 테스트 계정 정보 자동 입력
  useEffect(() => {
    if (activeTab === 'employee') {
      setCredentials({ username: 'admin', password: 'password' });
    } else {
      setCredentials({ username: 'user', password: 'password' });
    }
  }, [activeTab]);

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

    const result = await loginByType(credentials.username, credentials.password, activeTab);
    
    if (result.success) {
      // 사용자 타입에 따른 리다이렉트
      if (activeTab === 'employee') {
        navigate('/'); // 직원은 기존 홈으로
      } else {
        navigate('/lobby'); // 사용자는 로비로
      }
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-page-wrapper" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 배경 패턴 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat'
      }}></div>
      
      <div className={`login-container ${animateCard ? 'animate-in' : ''}`} style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '940px', // 카드보다 40px 더 크게
        minHeight: '640px', // 카드보다 40px 더 크게
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        background: '#f8f9fa', // 연한 흰색 배경
        boxShadow: '0 8px 32px rgba(102,126,234,0.08)',
        padding: '24px', // 카드와의 여백
        borderRadius: '28px', // 카드보다 약간 더 둥글게
        transform: animateCard ? 'translateY(0)' : 'translateY(30px)',
        opacity: animateCard ? 1 : 0,
        transition: 'all 0.6s ease-out'
      }}>
        <div className="login-card" style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div className="login-content" style={{
            display: 'flex',
            minHeight: '600px'
          }}>
            {/* 왼쪽 이미지 영역 */}
            <div className="login-left" style={{
              flex: '1',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* 장식 요소들 */}
              <div style={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '50%',
                opacity: 0.1
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '15%',
                width: '120px',
                height: '120px',
                background: 'linear-gradient(135deg, #764ba2, #667eea)',
                borderRadius: '20px',
                opacity: 0.08,
                transform: 'rotate(45deg)'
              }}></div>
              
              <div className="login-image-content" style={{
                textAlign: 'center',
                padding: '40px'
              }}>
                <div style={{
                  width: '150px',
                  height: '150px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: '50%',
                  margin: '0 auto 30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                }}>
                  <i className="fas fa-heart" style={{
                    fontSize: '4rem',
                    color: 'white'
                  }}></i>
                </div>
                <h3 style={{
                  color: '#495057',
                  fontWeight: '700',
                  marginBottom: '15px'
                }}>사자 보이즈</h3>
                <p style={{
                  color: '#6c757d',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  소중한 분들을 위한<br/>
                  디지털 추모 공간과<br/>
                  전문 상조 서비스
                </p>
              </div>
            </div>

            {/* 오른쪽 폼 영역 */}
            <div className="login-right" style={{
              flex: '1',
              padding: '50px 40px',
              display: 'flex',
              flexDirection: 'column',
              background: activeTab === 'employee' ? '#dae7fcff' : '#e9deffff', // 탭에 따라 배경색 변경
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(102,126,234,0.04)'
            }}>
              {/* 탭 헤더 */}
              <div className="login-tabs" style={{
                display: 'flex',
                marginBottom: '40px',
                borderRadius: '12px',
                background: '#f8f9fa',
                padding: '4px'
              }}>
                <button 
                  className={`login-tab ${activeTab === 'employee' ? 'active' : ''}`}
                  onClick={() => setActiveTab('employee')}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    background: activeTab === 'employee' 
                      ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                      : 'transparent',
                    color: activeTab === 'employee' ? 'white' : '#6c757d',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  직원 로그인
                </button>
                <button 
                  className={`login-tab ${activeTab === 'user' ? 'active' : ''}`}
                  onClick={() => setActiveTab('user')}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    background: activeTab === 'user' 
                      ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                      : 'transparent',
                    color: activeTab === 'user' ? 'white' : '#6c757d',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  사용자 로그인
                </button>
              </div>

              {/* 제목 */}
              <div style={{ marginBottom: '30px' }}>
                <h2 style={{
                  color: '#495057',
                  fontWeight: '700',
                  fontSize: '28px',
                  marginBottom: '8px'
                }}>로그인</h2>
                <p style={{
                  color: '#6c757d',
                  fontSize: '14px',
                  margin: 0
                }}>계정 정보를 입력해주세요</p>
              </div>

              {/* 에러 메시지 */}
              {error && (
                <Alert variant="danger" style={{
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#fff5f5',
                  color: '#e53e3e',
                  marginBottom: '20px'
                }}>
                  {error}
                </Alert>
              )}

              {/* 테스트 계정 안내 */}
              <div style={{
                textAlign: 'center',
                padding: '15px',
                background: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(102, 126, 234, 0.2)'
              }}>
                <p style={{
                  fontSize: '12px',
                  color: '#667eea',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  <i className="fas fa-info-circle me-2"></i>
                  테스트용 계정: {activeTab === 'employee' ? 'admin / password' : 'user / password'}
                </p>
              </div>

              {/* 폼 */}
              <form onSubmit={handleSubmit} style={{ flex: 1 }}>
                <div className="login-form-group" style={{ marginBottom: '25px' }}>
                  <label className="login-form-label" style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#495057',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>아이디</label>
                  <input
                    type="text"
                    name="username"
                    className="login-form-control"
                    value={credentials.username}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      border: '2px solid #e9ecef',
                      borderRadius: '12px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  />
                </div>

                <div className="login-form-group" style={{ marginBottom: '20px' }}>
                  <label className="login-form-label" style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#495057',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>비밀번호</label>
                  <input
                    type="password"
                    name="password"
                    className="login-form-control"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      border: '2px solid #e9ecef',
                      borderRadius: '12px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  />
                </div>

                <div className="login-checkbox" style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '25px'
                }}>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{
                      marginRight: '10px',
                      width: '18px',
                      height: '18px',
                      accentColor: '#667eea'
                    }}
                  />
                  <label htmlFor="rememberMe" style={{
                    color: '#6c757d',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>아이디 기억하기</label>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '20px',
                  marginBottom: '30px'
                }}>
                  <a href="/FindId" className="login-link" style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>아이디 찾기</a>
                  <a href="/FindPassword" className="login-link" style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>비밀번호 찾기</a>
                </div>

                <button 
                  type="submit" 
                  className="login-btn"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: loading 
                      ? '#e9ecef' 
                      : 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    marginBottom: '25px'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      로그인 중...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      로그인
                    </>
                  )}
                </button>
              </form>

              {/* 고유번호 입장 */}
              <div className="unique-number-section" style={{
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '12px',
                marginBottom: '20px'
              }}>
                <h6 style={{
                  color: '#495057',
                  marginBottom: '15px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>고유번호로 추모관 입장</h6>
                <div style={{
                  display: 'flex',
                  gap: '10px'
                }}>
                  <input 
                    type="text" 
                    placeholder="고유번호 입력" 
                    style={{
                      flex: 1,
                      padding: '10px 15px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  />
                  <button style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}>입장</button>
                </div>
              </div>

              {/* 회원가입 링크 */}
              <div className="login-links" style={{
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                {activeTab === 'employee' && (
                  <button 
                    onClick={() => navigate('/SignUp', { state: { isEmployee: true } })}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#667eea',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-user-plus me-2"></i>직원 회원가입
                  </button>
                )}
                {activeTab === 'user' && (
                  <button 
                    onClick={() => navigate('/SignUp', { state: { isEmployee: false } })}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#667eea',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-user-plus me-2"></i>사용자 회원가입
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .login-link:hover {
          text-decoration: underline !important;
        }
        
        @media (max-width: 768px) {
          .login-content {
            flex-direction: column !important;
          }
          
          .login-left {
            min-height: 200px !important;
          }
          
          .login-right {
            padding: 30px 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;