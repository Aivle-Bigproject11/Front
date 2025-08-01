import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMemorialByCode } from '../services/memorialService';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('employee'); // 'employee' or 'user'
  const [rememberMe, setRememberMe] = useState(false);
  const [animateCard, setAnimateCard] = useState(false);
  const [joinCode, setJoinCode] = useState(''); // 고유번호 입력용
  const [joinLoading, setJoinLoading] = useState(false); // 고유번호 입장 로딩
  const { loginByType, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      // 사용자 타입에 따른 리다이렉트
      if (user.userType === 'employee') {
        navigate('/'); // 직원은 홈으로
      } else {
        navigate('/lobby'); // 사용자는 로비로
      }
    }
    // 카드 애니메이션 효과
    setAnimateCard(true);
  }, [isAuthenticated, user, navigate]);

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

  const handleJoinByCode = async () => {
    if (!joinCode.trim()) {
      setError('고유 번호를 입력해주세요.예: MEM001');
      return;
    }
    
    try {
      setJoinLoading(true);
      setError('');
      
      // 실제 서비스 사용 - 고유번호로 추모관 검색
      const memorial = await getMemorialByCode(joinCode.trim());
      
      if (memorial) {
        // 고유번호로 접근한 경우 guest 라우트로 이동
        navigate(`/memorial/${memorial.id}/guest`);
      } else {
        setError('유효하지 않은 고유번호입니다.');
      }
    } catch (err) {
      setError('추모관을 찾는데 실패했습니다. 고유번호를 확인해주세요.');
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2C1F14 0%, #4A3728 30%, #6B4423 70%, #8B5A2B 100%)',
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
        background: 'url("data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23B8860B" fill-opacity="0.12"%3E%3Cpath d="M40 40L20 20v40h40V20L40 40zm0-20L60 0H20l20 20zm0 20L20 60h40L40 40z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
        opacity: 0.7
      }}></div>
      
      <div className={`login-container ${animateCard ? 'animate-in' : ''}`} style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '940px',
        minHeight: '640px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        background: 'rgba(184, 134, 11, 0.18)',
        boxShadow: '0 12px 40px rgba(44, 31, 20, 0.35)',
        backdropFilter: 'blur(12px)',
        padding: '24px',
        borderRadius: '28px',
        border: '1px solid rgba(184, 134, 11, 0.25)',
        transform: animateCard ? 'translateY(0)' : 'translateY(30px)',
        opacity: animateCard ? 1 : 0,
        transition: 'all 0.6s ease-out'
      }}>
        <div className="login-card" style={{
          background: 'rgba(255, 251, 235, 0.98)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(44, 31, 20, 0.4)',
          backdropFilter: 'blur(15px)',
          overflow: 'hidden',
          border: '2px solid rgba(184, 134, 11, 0.35)'
        }}>
          <div className="login-content" style={{
            display: 'flex',
            minHeight: '600px'
          }}>
            {/* 왼쪽 이미지 영역 */}
            <div className="login-left" style={{
              flex: '1',
              background: 'linear-gradient(135deg, #B8860B 0%, #CD853F 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* 장식 요소들 */}
              <div style={{
                position: 'absolute',
                top: '15%',
                left: '15%',
                width: '60px',
                height: '60px',
                background: 'rgba(44, 31, 20, 0.2)',
                borderRadius: '50%',
                transform: 'rotate(45deg)'
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '15%',
                width: '80px',
                height: '80px',
                background: 'rgba(44, 31, 20, 0.15)',
                borderRadius: '20px',
                transform: 'rotate(30deg)'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '40%',
                right: '20%',
                width: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.25)',
                borderRadius: '50%'
              }}></div>
              
              <div className="login-image-content" style={{
                textAlign: 'center',
                padding: '40px'
              }}>
                <div style={{
                  width: '150px',
                  height: '150px',
                  background: 'linear-gradient(135deg, #2C1F14 0%, #4A3728 100%)',
                  borderRadius: '50%',
                  margin: '0 auto 30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 15px 35px rgba(44, 31, 20, 0.5)',
                  border: '3px solid rgba(255, 255, 255, 0.35)'
                }}>
                  <i className="fas fa-yin-yang" style={{
                    fontSize: '4rem',
                    color: '#B8860B'
                  }}></i>
                </div>
                <h3 style={{
                  color: '#2C1F14',
                  fontWeight: '700',
                  marginBottom: '15px',
                  fontSize: '1.8rem'
                }}>Golden Gate</h3>
                <p style={{
                  color: '#4A3728',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  소중한 분들을 위한<br/>
                  전통과 품격을 갖춘<br/>
                  프리미엄 상조 서비스
                </p>
              </div>
            </div>

            {/* 오른쪽 폼 영역 */}
            <div className="login-right" style={{
              flex: '1',
              padding: '50px 40px',
              display: 'flex',
              flexDirection: 'column',
              background: activeTab === 'employee' 
                ? 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)' 
                : 'linear-gradient(135deg, rgba(74, 55, 40, 0.12) 0%, rgba(139, 90, 43, 0.08) 100%)',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(44, 31, 20, 0.12)',
              border: '1px solid rgba(184, 134, 11, 0.2)'
            }}>
              {/* 탭 헤더 */}
              <div className="login-tabs" style={{
                display: 'flex',
                marginBottom: '40px',
                borderRadius: '12px',
                background: 'rgba(184, 134, 11, 0.12)',
                padding: '4px',
                border: '1px solid rgba(184, 134, 11, 0.25)'
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
                      ? 'linear-gradient(135deg, #B8860B, #CD853F)' 
                      : 'transparent',
                    color: activeTab === 'employee' ? '#2C1F14' : '#4A3728',
                    fontWeight: '700',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    boxShadow: activeTab === 'employee' 
                      ? '0 2px 8px rgba(184, 134, 11, 0.35)' 
                      : 'none'
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
                      ? 'linear-gradient(135deg, #4A3728, #8B5A2B)' 
                      : 'transparent',
                    color: activeTab === 'user' ? '#FFF' : '#4A3728',
                    fontWeight: '700',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    boxShadow: activeTab === 'user' 
                      ? '0 2px 8px rgba(74, 55, 40, 0.35)' 
                      : 'none'
                  }}
                >
                  사용자 로그인
                </button>
              </div>

              {/* 제목 */}
              <div style={{ marginBottom: '30px' }}>
                <h2 style={{
                  color: '#2C1F14',
                  fontWeight: '700',
                  fontSize: '28px',
                  marginBottom: '8px'
                }}>로그인</h2>
                <p style={{
                  color: '#4A3728',
                  fontSize: '14px',
                  margin: 0,
                  fontWeight: '500'
                }}>계정 정보를 입력해주세요</p>
              </div>

              {/* 에러 메시지 */}
              {error && (
                <Alert variant="danger" style={{
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#fff5f5',
                  color: '#e53e3e',
                  marginBottom: '20px',
                  border: '1px solid #fed7d7'
                }}>
                  {error}
                </Alert>
              )}

              {/* 테스트 계정 안내 */}
              <div style={{
                textAlign: 'center',
                padding: '15px',
                background: 'rgba(184, 134, 11, 0.12)',
                borderRadius: '8px',
                border: '1px solid rgba(184, 134, 11, 0.3)',
                marginBottom: '25px'
              }}>
                <p style={{
                  fontSize: '12px',
                  color: '#6B4423',
                  margin: 0,
                  fontWeight: '600'
                }}>
                  <i className="fas fa-yin-yang me-2" style={{ color: '#B8860B' }}></i>
                  테스트용 계정: {activeTab === 'employee' ? 'admin / password' : 'user / password'}
                </p>
              </div>

              {/* 폼 */}
              <form onSubmit={handleSubmit} style={{ flex: 1 }}>
                <div className="login-form-group" style={{ marginBottom: '25px' }}>
                  <label className="login-form-label" style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#2C1F14',
                    fontWeight: '700',
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
                      border: '2px solid rgba(184, 134, 11, 0.35)',
                      borderRadius: '12px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#B8860B';
                      e.target.style.boxShadow = '0 0 0 3px rgba(184, 134, 11, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(184, 134, 11, 0.35)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div className="login-form-group" style={{ marginBottom: '20px' }}>
                  <label className="login-form-label" style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#2C1F14',
                    fontWeight: '700',
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
                      border: '2px solid rgba(184, 134, 11, 0.35)',
                      borderRadius: '12px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#B8860B';
                      e.target.style.boxShadow = '0 0 0 3px rgba(184, 134, 11, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(184, 134, 11, 0.35)';
                      e.target.style.boxShadow = 'none';
                    }}
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
                      accentColor: '#B8860B'
                    }}
                  />
                  <label htmlFor="rememberMe" style={{
                    color: '#4A3728',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}>아이디 기억하기</label>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '20px',
                  marginBottom: '30px'
                }}>
                  <a href="/FindId" className="login-link" style={{
                    color: '#B8860B',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>아이디 찾기</a>
                  <a href="/FindPassword" className="login-link" style={{
                    color: '#B8860B',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '600'
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
                      : 'linear-gradient(135deg, #D4AF37, #F5C23E)',
                    color: loading ? '#6c757d' : '#2C1F14',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    marginBottom: '25px',
                    boxShadow: loading ? 'none' : '0 4px 15px rgba(184, 134, 11, 0.35)'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(184, 134, 11, 0.45)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(184, 134, 11, 0.35)';
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
                background: 'rgba(184, 134, 11, 0.12)',
                borderRadius: '12px',
                marginBottom: '20px',
                border: '1px solid rgba(184, 134, 11, 0.25)'
              }}>
                <h6 style={{
                  color: '#2C1F14',
                  marginBottom: '15px',
                  fontSize: '14px',
                  fontWeight: '700'
                }}>
                  <i className="fas fa-yin-yang me-2" style={{ color: '#B8860B' }}></i>
                  고유번호로 추모관 입장
                </h6>
                <div style={{
                  display: 'flex',
                  gap: '10px'
                }}>
                  <input 
                    type="text" 
                    placeholder="고유번호 입력" 
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleJoinByCode();
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '10px 15px',
                      border: '2px solid rgba(184, 134, 11, 0.35)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#B8860B';
                      e.target.style.boxShadow = '0 0 0 2px rgba(184, 134, 11, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(184, 134, 11, 0.35)';
                      e.target.style.boxShadow = 'none';
                    }}
                    disabled={joinLoading}
                  />
                  <button 
                    onClick={handleJoinByCode}
                    disabled={joinLoading}
                    style={{
                      padding: '10px 20px',
                      background: joinLoading 
                        ? '#6c757d' 
                        : 'linear-gradient(135deg, #4A3728, #8B5A2B)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: joinLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      minWidth: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {joinLoading ? (
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid transparent',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                    ) : (
                      '입장'
                    )}
                  </button>
                </div>
                {joinCode && (
                  <div style={{
                    marginTop: '10px',
                    fontSize: '12px',
                    color: '#6B4423',
                    fontWeight: '500'
                  }}>
                    <i className="fas fa-info-circle me-1" style={{ color: '#B8860B' }}></i>
                    입력된 고유번호: {joinCode}
                  </div>
                )}
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
                      color: '#B8860B',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '700',
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
                      color: '#6B4423',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '700',
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
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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