import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import icon from '../assets/logo/icon05_1.png';

const CustomPopup = ({ message, onConfirm }) => (
    <div className="popup-overlay">
        <div className="popup-content">
            <p>{message}</p>
            <button onClick={onConfirm} className="popup-button confirm">확인</button>
        </div>
    </div>
);

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loginError, setLoginError] = useState(''); // New state for login error
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('employee'); // 'employee' or 'user'
  const [rememberMe, setRememberMe] = useState(false);
  const [animateCard, setAnimateCard] = useState(false);
  const [joinCode, setJoinCode] = useState(''); // 고유번호 입력용
  const [joinLoading, setJoinLoading] = useState(false); // 고유번호 입장 로딩
  const [loginAttempts, setLoginAttempts] = useState({}); // 로그인 시도 횟수 상태
  const [popup, setPopup] = useState({ isOpen: false, message: '', onConfirm: () => {} }); // 팝업 상태
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

  // 탭 전환시 테스트 계정 정보 자동 입력 (제거됨)
  useEffect(() => {
    // if (activeTab === 'employee') {
    //   setCredentials({ username: 'admin', password: 'password' });
    // } else {
    //   setCredentials({ username: 'user', password: 'password' });
    // }
  }, [activeTab]);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setLoginError(''); // Clear login error on input change
  };

  const closePopup = () => {
    setPopup({ isOpen: false, message: '', onConfirm: () => {} });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("e.preventDefault() called in handleSubmit"); // Added for debugging
    setLoading(true);

    const result = await loginByType(credentials.username, credentials.password, activeTab);
    
    if (result.success) {
      // 로그인 성공 시, 해당 아이디의 시도 횟수 초기화
      // 실제 운영 시에는 백엔드에서 처리하는 것이 더 안전합니다.
      setLoginAttempts(prev => ({ ...prev, [credentials.username]: 0 }));
      setLoginError(''); // Clear login error on successful login

      if (activeTab === 'employee') {
        navigate('/');
      } else {
        navigate('/lobby');
      }
    } else {
        // 백엔드에서 "비밀번호" 관련 에러 메시지를 보냈다고 가정
        if (result.message && result.message.includes('비밀번호')) {
            // 실패 횟수는 보통 백엔드에서 관리하지만, 현재는 프론트엔드에서 테스트로 구현합니다.
            const currentAttempts = (loginAttempts[credentials.username] || 0) + 1;
            setLoginAttempts(prev => ({ ...prev, [credentials.username]: currentAttempts }));

            if (currentAttempts >= 5) {
                setPopup({
                isOpen: true,
                message: '일정 횟수 이상 로그인에 실패하였습니다. 비밀번호 재설정 화면으로 이동합니다.',
                onConfirm: () => {
                    closePopup();
                    navigate('/findPassword');
                }
                });
                setLoginAttempts(prev => ({ ...prev, [credentials.username]: 0 })); // 팝업 후 카운트 초기화
            } else {
                // setError(`${result.message} (남은 횟수: ${5 - currentAttempts}회)`); // 제거됨
                setLoginError('아이디 또는 비밀번호가 일치하지 않습니다.'); // 로그인 오류 설정
            }
        } else {
        // setError(result.message); // 제거됨
        setLoginError('아이디 또는 비밀번호가 일치하지 않습니다.'); // 로그인 오류 설정
        }
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
      
      console.log('🔍 고유번호로 추모관 검색 (게스트):', joinCode.trim());
      
      // memorialId로 직접 추모관 조회
      const memorial = await apiService.getMemorialById(joinCode.trim());
      
      if (memorial) {
        console.log('✅ 추모관 발견 (게스트 접근):', memorial);
        // 고유번호로 접근한 경우 guest 라우트로 이동
        navigate(`/memorial/${joinCode.trim()}/guest`);
      } else {
        setError('유효하지 않은 추모관 고유번호입니다.');
      }
    } catch (err) {
      console.error('❌ 추모관 조회 실패 (게스트):', err);
      if (err.response?.status === 404) {
        setError('존재하지 않는 추모관 고유번호입니다.');
      } else {
        setError('추모관을 찾는데 실패했습니다. 고유번호를 확인해주세요.');
      }
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      boxSizing: 'border-box'
    }}>
      {popup.isOpen && <CustomPopup message={popup.message} onConfirm={popup.onConfirm} />}
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
        maxWidth: '1600px',
        minHeight: '640px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        background: 'rgba(184, 134, 11, 0.18)',
        boxShadow: '0 12px 40px rgba(44, 31, 20, 0.35)',
        backdropFilter: 'blur(12px)',
        padding: '20px',
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
          border: '2px solid rgba(184, 134, 11, 0.35)',
          width: '100%',
          maxWidth: '1600px'
        }}>
          <div className="login-content" style={{
            display: 'flex',
            minHeight: '600px'
          }}>
            {/* 왼쪽 빈 공간 - Golden Gate 소개 및 기능 안내 */}
            {activeTab === 'employee' && (
              <div className="login-card-left" style={{
                flex: '1',
                background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)', // 밝은 배경
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '30px',
                textAlign: 'center',
                borderRight: '1px solid rgba(184, 134, 11, 0.2)',
                boxShadow: 'inset -5px 0 15px rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden'
              }}>


                <h3 style={{
                  color: '#2C1F14',
                  fontWeight: '700',
                  marginBottom: '20px',
                  fontSize: '1.8rem',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                }}>Golden Gate 관리 시스템</h3>
                <p style={{
                  color: '#4A3728',
                  fontSize: '16px',
                  lineHeight: '1.8',
                  marginBottom: '30px',
                  maxWidth: '400px'
                }}>
                  Golden Gate는 소중한 분들을 위한<br/> 
                  프리미엄 상조 서비스입니다.<br/>
                  <br/><span style={{ fontSize: '15px'}}>직원 관리 시스템을 통해 효율적인 업무 처리를 지원합니다.</span>
                </p>
                <div style={{
                  width: '100%',
                  maxWidth: '420px',
                  textAlign: 'left',
                  background: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '15px',
                  padding: '25px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(184, 134, 11, 0.15)'
                }}>
                  <h4 style={{
                    color: '#2C1F14',
                    fontWeight: '700',
                    marginBottom: '15px',
                    fontSize: '1.3rem'
                  }}>주요 기능</h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    <li style={{ marginBottom: '10px', color: '#4A3728', fontSize: '15px' }}>
                      <i className="fas fa-file-alt me-2" style={{ color: '#B8860B' }}></i>
                      <strong>장례 서류 작성:</strong> 장례 관련 서류를 자동으로 작성합니다.
                    </li>
                    <li style={{ marginBottom: '10px', color: '#4A3728', fontSize: '15px' }}>
                      <i className="fas fa-chart-line me-2" style={{ color: '#B8860B' }}></i>
                      <strong>대시보드:</strong> 지역별 월별 사망자 수를 예측하여 실시간 통계 및 분석을 제공합니다.
                    </li>
                    <li style={{ marginBottom: '10px', color: '#4A3728', fontSize: '15px' }}>
                      <i className="fas fa-comments-dollar me-2" style={{ color: '#B8860B' }}></i>
                      <strong>전환 서비스 추천:</strong> 고객에게 맞춤 전환 서비스 메시지를 자동으로 생성하고 기록을 조회합니다.
                    </li>
                    <li style={{ marginBottom: '10px', color: '#4A3728', fontSize: '15px' }}>
                      <i className="fas fa-book-open me-2" style={{ color: '#B8860B' }}></i>
                      <strong>디지털 추모관:</strong> 디지털 추모관을 관리합니다.
                    </li>
                    <li style={{ color: '#4A3728', fontSize: '15px' }}>
                      <i className="fas fa-users me-2" style={{ color: '#B8860B' }}></i>
                      <strong>고객 관리:</strong> 고객을 조회 및 관리합니다.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'user' && (
              <div className="login-card-left" style={{
                flex: '1',
                background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)', // 밝은 배경
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '30px',
                textAlign: 'center',
                borderRight: '1px solid rgba(184, 134, 11, 0.2)',
                boxShadow: 'inset -5px 0 15px rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden'
              }}>


                <h3 style={{
                  color: '#2C1F14',
                  fontWeight: '700',
                  marginBottom: '20px',
                  fontSize: '1.8rem',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                }}>Golden Gate 사용자 서비스</h3>
                <p style={{
                  color: '#4A3728',
                  fontSize: '16px',
                  lineHeight: '1.8',
                  marginBottom: '30px',
                  maxWidth: '400px'
                }}>
                  Golden Gate는 소중한 분들을 위한<br/>
                  프리미엄 상조 서비스입니다.<br/>
                  <br/><span style={{ fontSize: '15px'}}>사용자 서비스를 통해 추모관을 편리하게 이용하실 수 있습니다.</span>
                </p>
                <div style={{
                  width: '100%',
                  maxWidth: '420px',
                  textAlign: 'left',
                  background: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '15px',
                  padding: '25px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(184, 134, 11, 0.15)'
                }}>
                  <h4 style={{
                    color: '#2C1F14',
                    fontWeight: '700',
                    marginBottom: '15px',
                    fontSize: '1.3rem'
                  }}>주요 기능</h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    <li style={{ marginBottom: '10px', color: '#4A3728', fontSize: '15px' }}>
                      <i className="fas fa-book-open me-2" style={{ color: '#B8860B' }}></i>
                      <strong>디지털 추모관:</strong> 디지털 추모관을 관리합니다.
                    </li>
                    <li style={{ marginBottom: '10px', color: '#4A3728', fontSize: '15px' }}>
                      <i className="fas fa-door-open me-2" style={{ color: '#B8860B' }}></i>
                      <strong>추모관 입장:</strong> 고유번호로 추모관에 입장합니다.
                    </li>
                    <li style={{ marginBottom: '10px', color: '#4A3728', fontSize: '15px' }}>
                      <i className="fas fa-pen-alt me-2" style={{ color: '#B8860B' }}></i>
                      <strong>추모사 생성:</strong> 추모사 초안 및 키워드를 입력하면 추모사를 자동으로 생성합니다.
                    </li>
                    <li style={{ marginBottom: '10px', color: '#4A3728', fontSize: '15px' }}>
                      <i className="fas fa-video me-2" style={{ color: '#B8860B' }}></i>
                      <strong>추모영상 생성:</strong> 원하는 이미지와 키워드를 입력하면 추모영상을 자동으로 생성합니다.
                    </li>
                    <li style={{ color: '#4A3728', fontSize: '15px' }}>
                      <i className="fas fa-file-invoice me-2" style={{ color: '#B8860B' }}></i>
                      <strong>장례 서류 조회:</strong> 장례 관련 서류를 조회합니다.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* 왼쪽 이미지 영역 */}
            <div className="login-card-middle" style={{
              flex: '1',
              background: 'linear-gradient(135deg, #B8860B 0%, #CD853F 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
                              {/* 모서리 라인 장식 */}
              {/* 왼쪽 상단 */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                width: '60px',
                height: '2px',
                background: 'rgba(44, 31, 20, 0.3)'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                width: '2px',
                height: '60px',
                background: 'rgba(44, 31, 20, 0.3)'
              }}></div>
              
              {/* 오른쪽 상단 */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '60px',
                height: '2px',
                background: 'rgba(44, 31, 20, 0.3)'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '2px',
                height: '60px',
                background: 'rgba(44, 31, 20, 0.3)'
              }}></div>
              
              {/* 왼쪽 하단 */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                width: '60px',
                height: '2px',
                background: 'rgba(44, 31, 20, 0.3)'
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                width: '2px',
                height: '60px',
                background: 'rgba(44, 31, 20, 0.3)'
              }}></div>
              
              {/* 오른쪽 하단 */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                width: '60px',
                height: '2px',
                background: 'rgba(44, 31, 20, 0.3)'
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                width: '2px',
                height: '60px',
                background: 'rgba(44, 31, 20, 0.3)'
              }}></div>
              
              {/* 중앙 세로선들 */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '7%',
                transform: 'translateX(-50%)',
                width: '1px',
                height: '20%',
                background: 'rgba(255, 255, 255, 0.15)'
              }}></div>
              <div style={{
                position: 'absolute',
                left: '50%',
                bottom: '7%',
                transform: 'translateX(-50%)',
                width: '1px',
                height: '20%',
                background: 'rgba(255, 255, 255, 0.15)'
              }}></div>
              
              <div className="login-image-content" style={{
                textAlign: 'center',
                padding: '30px'
              }}>
                <div style={{
                  width: '180px',
                  height: '180px',
                  background: 'linear-gradient(135deg, #2C1F14 0%, #4A3728 100%)',
                  borderRadius: '50%',
                  margin: '0 auto 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 15px 35px rgba(44, 31, 20, 0.5)',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={icon} 
                    alt="Golden Gate Logo"
                    style={{
                      width: '170px',
                      height: '170px',
                      objectFit: 'contain',
                      filter: 'brightness(1.0) contrast(1.1)'
                    }}
                    onError={(e) => {
                      // 이미지 로드 실패시 폴백 아이콘
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <i className="fas fa-yin-yang" style={{ 
                    fontSize: '4rem', 
                    color: '#B8860B', 
                    display: 'none' 
                    }}></i>
                </div>
                <h3 style={{
                  color: '#2C1F14',
                  fontWeight: '700',
                  marginBottom: '15px',
                  fontSize: '1.6rem'
                }}>Golden Gate</h3>
                <p style={{
                  color: '#4A3728',
                  fontSize: '15px',
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
            <div className="login-card-right" style={{
              flex: '1',
              padding: '15px 40px 15px',
              display: 'flex',
              flexDirection: 'column',
              background: activeTab === 'employee' 
                ? 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)' 
                : 'linear-gradient(135deg, rgba(74, 55, 40, 0.12) 0%, rgba(139, 90, 43, 0.08) 100%)',
              boxShadow: '0 4px 20px rgba(44, 31, 20, 0.12)',
              border: '1px solid rgba(184, 134, 11, 0.2)',
              overflowY: 'auto'
            }}>
              {/* 탭 헤더 */}
              <div className="login-tabs" style={{
                display: 'flex',
                marginBottom: '25px',
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
                    padding: '8px 20px', 
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
                    padding: '8px 20px', 
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
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ 
                    color: '#2C1F14', 
                    fontWeight: '700', 
                    fontSize: '24px', 
                    marginBottom: '8px' 
                    }}>로그인</h2>
                <p style={{ 
                    color: '#4A3728', 
                    fontSize: '14px', 
                    margin: 0, 
                    fontWeight: '500' 
                    }}>계정 정보를 입력해주세요</p>
              </div>

              {/* 테스트 계정 안내 */}
              <div style={{ 
                textAlign: 'center', 
                padding: '12px', 
                background: 'rgba(184, 134, 11, 0.12)', 
                borderRadius: '8px', 
                border: '1px solid rgba(184, 134, 11, 0.3)', 
                marginBottom: '15px' 
                }}>
                <p style={{ 
                    fontSize: '12px', 
                    color: '#6B4423', 
                    margin: 0, 
                    fontWeight: '600' 
                    }}>
                  <i className="fas fa-info-circle me-2" style={{ color: '#B8860B' }}></i>
                  로그인하고자 하는 탭을 상단에서 확인하고 선택해 주세요.
                </p>
              </div>

              {/* 폼 */}
              <form onSubmit={handleSubmit}>
                <div className="login-form-group" style={{ marginBottom: '15px' }}>
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
                    padding: '12px 18px', 
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
                            {loginError && <p style={{ color: '#dc3545', fontSize: '13px', marginTop: '5px' }}>{loginError}</p>}
                </div>

                <div className="login-form-group" style={{ marginBottom: '15px' }}>
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
                    padding: '12px 18px', 
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
                    marginBottom: '15px' 
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
                    marginBottom: '20px',
                    justifyContent: 'center'
                    }}>
                  <button type="button" onClick={() => navigate('/findId', { state: { isEmployee: activeTab === 'employee' } })} className="login-link" style={{ 
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: '#B8860B', 
                    textDecoration: 'none', 
                    fontSize: '14px', 
                    fontWeight: '600' 
                    }}>아이디 찾기</button>
                  <button type="button" onClick={() => navigate('/findPassword', { state: { userType: activeTab } })} className="login-link" style={{ 
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: '#B8860B', 
                    textDecoration: 'none', 
                    fontSize: '14px', 
                    fontWeight: '600' 
                    }}>비밀번호 재설정</button>
                </div>

                <button 
                type="submit" 
                className="login-btn" 
                disabled={loading} 
                style={{ 
                    width: '100%', 
                    padding: '12px', 
                    background: loading 
                    ? '#e9ecef' 
                    : 'linear-gradient(135deg, #D4AF37, #F5C23E)', 
                    color: loading ? '#6c757d' : '#2C1F14', 
                    border: 'none', borderRadius: '12px', 
                    fontSize: '16px', 
                    fontWeight: '700', 
                    cursor: loading ? 'not-allowed' : 'pointer', 
                    transition: 'all 0.3s ease', 
                    marginBottom: '15px', 
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
                    <span className="spinner-border spinner-border-sm me-2"
                    style={{ width: '1rem', height:'1rem'  }} 
                    role="status"></span> 
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
                padding: '15px', 
                background: 'rgba(184, 134, 11, 0.12)', 
                borderRadius: '12px', 
                border: '1px solid rgba(184, 134, 11, 0.25)',
                visibility: activeTab === 'employee' ? 'hidden' : 'visible' 
                }}>
                <h6 style={{ 
                    color: '#2C1F14', 
                    marginBottom: '5px', 
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
                  placeholder="추모관 고유번호 (예: 1c1425e1-8f64-43ea-9798-f747e1a97c0e)" 
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
                marginBottom: '15px'
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

              {/* 개인정보처리방침 및 이용약관 */}
              <div className="privacy-links" style={{
                textAlign: 'center',
                paddingTop: '15px',
                borderTop: '1px solid rgba(184, 134, 11, 0.2)'
              }}>
                <a href="/privacyPolicy" style={{
                  color: '#6B4423',
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: '750'
                }}>Golden Gate 개인정보 처리방침</a>
                <span style={{ margin: '0 10px', color: '#6B4423', fontSize: '12px' }}>|</span>
                <a href="/termsOfService" style={{
                  color: '#6B4423',
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: '750'
                }}>이용약관</a>
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
        }
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .popup-content {
          background-color: #fff9f0;
          padding: 30px 40px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          text-align: center;
          min-width: 320px;
          border: 1px solid #B8860B;
        }
        .popup-content p {
          color: #2C1F14;
          font-weight: 500;
          font-size: 16px;
          margin: 0 0 25px 0;
        }
        .popup-button {
          padding: 10px 25px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
          min-width: 100px;
        }
        .popup-button.confirm {
          background: linear-gradient(135deg, #B8860B, #CD853F);
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default Login;