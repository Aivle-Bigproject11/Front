
import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import icon from '../assets/logo/icon01.png';

const UserConfig = () => {
  const [userInfo, setUserInfo] = useState({
    username: '테스트관리자',
    email: 'test@example.com',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [animateCard, setAnimateCard] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 카드 애니메이션 효과
    setAnimateCard(true);
  }, []);

  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userInfo.newPassword !== userInfo.confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    setError('');

    // TODO: 사용자 정보 수정 API 호출
    console.log('수정된 사용자 정보:', userInfo);
    
    // 예시: 2초 후 성공 처리
    setTimeout(() => {
      setLoading(false);
      alert('사용자 정보가 성공적으로 수정되었습니다.');
      navigate('/'); // 수정 후 이동할 페이지
    }, 2000);
  };

  return (
    <div className="page-wrapper" style={{
      '--navbar-height': '62px',
      height: 'calc(100vh - var(--navbar-height))',
      background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)',
      padding: '20px',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 배경 패턴 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23B8860B" fill-opacity="0.1"%3E%3Cpath d="M40 40L20 20v40h40V20L40 40zm0-20L60 0H20l20 20zm0 20L20 60h40L40 40z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
        opacity: 0.7
      }}></div>

      <div className={`dashboard-container ${animateCard ? 'animate-in' : ''}`} style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '940px',
        height: '100%',
        overflowY: 'auto',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        background: 'rgba(255, 251, 235, 0.85)',
        boxShadow: '0 12px 40px rgba(44, 31, 20, 0.25)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(184, 134, 11, 0.25)',
        borderRadius: '20px',
        opacity: animateCard ? 1 : 0,
        transition: 'opacity 0.6s ease-out',
        padding: '20px',
        gap: '20px',
      }}>
        <div className="login-card" style={{
          background: 'rgba(255, 251, 235, 0.98)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(44, 31, 20, 0.4)',
          backdropFilter: 'blur(15px)',
          overflow: 'hidden',
          border: '2px solid rgba(184, 134, 11, 0.35)',
          height: '100%'
        }}>
          <div className="login-content" style={{
            display: 'flex',
            height: '100%'
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
                  border: '3px solid rgba(255, 255, 255, 0.35)',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={icon} 
                    alt="Golden Gate Logo"
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'contain',
                      filter: 'brightness(1.2) contrast(1.1)'
                    }}
                  />
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
                  사용자 정보 수정
                </p>
              </div>
            </div>

            {/* 오른쪽 폼 영역 */}
            <div className="login-right" style={{
              flex: '1',
              padding: '50px 40px',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(44, 31, 20, 0.12)',
              border: '1px solid rgba(184, 134, 11, 0.2)'
            }}>
              <div style={{ marginBottom: '30px' }}>
                <h2 style={{
                  color: '#2C1F14',
                  fontWeight: '700',
                  fontSize: '28px',
                  marginBottom: '8px'
                }}>사용자 정보</h2>
                <p style={{
                  color: '#4A3728',
                  fontSize: '14px',
                  margin: 0,
                  fontWeight: '500'
                }}>사용자 정보를 수정할 수 있습니다.</p>
              </div>

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

              <form onSubmit={handleSubmit} style={{ flex: 1 }}>
                <div className="login-form-group" style={{ marginBottom: '25px' }}>
                  <label className="login-form-label" style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#2C1F14',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>사용자명</label>
                  <input
                    type="text"
                    name="username"
                    className="login-form-control"
                    value={userInfo.username}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      border: '2px solid rgba(184, 134, 11, 0.35)',
                      borderRadius: '12px',
                      fontSize: '16px',
                      backgroundColor: '#f8f9fa',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                <div className="login-form-group" style={{ marginBottom: '25px' }}>
                  <label className="login-form-label" style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#2C1F14',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>이메일</label>
                  <input
                    type="email"
                    name="email"
                    className="login-form-control"
                    value={userInfo.email}
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
                  }}>새 비밀번호</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="login-form-control"
                    value={userInfo.newPassword}
                    onChange={handleChange}
                    placeholder="새 비밀번호"
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

                <div className="login-form-group" style={{ marginBottom: '25px' }}>
                  <label className="login-form-label" style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#2C1F14',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>새 비밀번호 확인</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="login-form-control"
                    value={userInfo.confirmPassword}
                    onChange={handleChange}
                    placeholder="새 비밀번호 확인"
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
                      수정 중...
                    </>
                  ) : (
                    '정보 수정'
                  )}
                </button>
              </form>
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
      `}</style>
    </div>
  );
};

export default UserConfig;
