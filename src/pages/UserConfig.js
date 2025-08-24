// src/pages/UserConfig.js
import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import icon from '../assets/logo/lumora bgx.png';

const UserConfig = () => {
  const [userInfo, setUserInfo] = useState({
    loginId: '',
    username: '',
    email: '',
    phone: '',
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true); // New state
  const [isPhoneValid, setIsPhoneValid] = useState(true); // New state
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [animateCard, setAnimateCard] = useState(false);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setAnimateCard(true); // 카드 애니메이션 효과

    const fetchInitialUserData = async () => {
      if (authLoading) return; // AuthContext 로딩 중이면 기다림

      if (!isAuthenticated || !user || !user.id) {
        setError("사용자 정보를 불러올 수 없습니다. 로그인 상태를 확인해주세요.");
        setInitialLoading(false);
        return;
      }

      try {
        setInitialLoading(true);
        setError('');
        let response;
        if (user.userType === 'employee') {
          response = await apiService.getManagerById(user.id);
        } else if (user.userType === 'user') {
          response = await apiService.getFamilyById(user.id);
        } else {
          setError("알 수 없는 사용자 유형입니다.");
          setInitialLoading(false);
          return;
        }
        
        // 불러온 데이터로 userInfo 초기화
        setUserInfo(prev => ({
          ...prev,
          loginId: response.loginId,
          username: response.name,
          email: response.email,
          phone: response.phone,
        }));
      } catch (err) {
        console.error("초기 사용자 정보를 가져오는 데 실패했습니다:", err);
        setError("초기 사용자 정보를 가져오는 데 실패했습니다.");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitialUserData();
  }, [user, isAuthenticated, authLoading]); // user, isAuthenticated, authLoading이 변경될 때마다 실행

  const validatePassword = (pw) => {
    const hasLetters = /[a-zA-Z]/.test(pw);
    const hasNumbers = /\d/.test(pw);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(pw);
    const types = [hasLetters, hasNumbers, hasSymbols].filter(Boolean).length;
    if (types >= 3 && pw.length >= 8) return true;
    if (types >= 2 && pw.length >= 10) return true;
    return false;
  };

  const validatePhoneNumber = (phoneNumber) => {
    const re = /^\d{3}-\d{4}-\d{4}$/;
    return re.test(phoneNumber);
  };

  // 이메일 형식 검사 함수
  const validateEmail = (email) => {
    const re = /^(([^<>()[\\]\\.,;:\s@\"]+(\\.[^<>()[\\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\\[0-9]{1,3}\\[0-9]{1,3}\\[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  useEffect(() => {
    if (newPassword) {
      setIsPasswordValid(validatePassword(newPassword));
    } else {
      setIsPasswordValid(true);
    }

    if (confirmPassword) {
      setPasswordsMatch(newPassword === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [newPassword, confirmPassword]);

  const formatPhoneNumber = (value) => {
    if (!value) return "";
    value = value.replace(/[^0-9]/g, ""); // Remove all non-numeric characters
    let formattedValue = "";
    if (value.length > 0) {
      formattedValue += value.substring(0, 3);
    }
    if (value.length > 3) {
      formattedValue += "-" + value.substring(3, 7);
    }
    if (value.length > 7) {
      formattedValue += "-" + value.substring(7, 11);
    }
    return formattedValue;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const formattedValue = formatPhoneNumber(value);
      setUserInfo({ ...userInfo, phone: formattedValue });
      setIsPhoneValid(validatePhoneNumber(formattedValue)); // Update phone validation state
    } else if (name === 'email') {
      setUserInfo({ ...userInfo, email: value });
      setIsEmailValid(validateEmail(value)); // Update email validation state
    } else if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword) {
      if (!isPasswordValid) {
        return;
      }
      if (!passwordsMatch) {
        return;
      }
    }

    if (!isEmailValid) {
        return;
    }

    if (!isPhoneValid) {
      return;
    }
    
    setLoading(true);
    setPopupMessage(''); // Clear previous popup message
    setShowPopup(false); // Hide previous popup

    try {
        let updateData = {
            loginId: userInfo.loginId,
            name: userInfo.username, // username을 name으로 매핑
            email: userInfo.email,
            phone: userInfo.phone,
        };

        if (newPassword) { // 새 비밀번호가 입력된 경우에만 포함
            updateData.loginPassword = newPassword;
        }

        let response;
        if (user.userType === 'employee') {
            response = await apiService.updateManagerPatch(user.id, updateData); // updateManagerPatch 사용
        } else if (user.userType === 'user') {
         response = await apiService.updateFamilyPatch(user.id, updateData); // updateFamilyPatch 사용
        } else {
            setPopupMessage("알 수 없는 사용자 유형입니다.");
            setShowPopup(true);
            setLoading(false);
            return;
        }

      setPopupMessage('사용자 정보가 성공적으로 수정되었습니다.');
      setShowPopup(true);
      // navigate('/'); // Optionally navigate after popup confirmation, handled by closePopup if needed
    } catch (err) {
      console.error('사용자 정보 수정 실패:', err);
      setPopupMessage('정보 수정 중 오류가 발생했습니다.');
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    if (popupMessage === '사용자 정보가 성공적으로 수정되었습니다.') {
      navigate('/');
    }
  };

  if (initialLoading) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div>사용자 정보를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{
      '--navbar-height': '62px',
      minHeight: 'calc(100vh - var(--navbar-height))', // height -> minHeight
      background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)',
      padding: '20px',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'auto', // Changed to auto
    }}> 
      {/* 팝업 UI */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>{popupMessage}</p>
            <button onClick={closePopup} className="popup-button">확인</button>
          </div>
        </div>
      )}
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
        height: 'auto', // height: '100%' -> 'auto'
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
              overflow: 'hidden',
              padding: '40px 20px' // 패딩 조정
            }}>
              <div className="login-image-content" style={{
                textAlign: 'center',
                padding: '20px' // 패딩 조정
              }}>
                <div className="logo-circle" style={{
                  width: '120px', // 사이즈 조정
                  height: '120px', // 사이즈 조정
                  background: 'linear-gradient(135deg, #2C1F14 0%, #4A3728 100%)',
                  borderRadius: '50%',
                  margin: '0 auto 20px', // 마진 조정
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 15px 35px rgba(44, 31, 20, 0.5)',
                  border: '3px solid rgba(255, 255, 255, 0.35)',
                  overflow: 'hidden'
                }}>
                  <img
                    src={icon}
                    alt="Lumora Logo"
                    style={{
                      width: '90px', // 사이즈 조정
                      height: '90px', // 사이즈 조정
                      objectFit: 'contain',
                      filter: 'brightness(1.2) contrast(1.1)'
                    }}
                  />
                </div>
                <h3 className="logo-title" style={{
                  color: '#2C1F14',
                  fontWeight: '700',
                  marginBottom: '10px', // 마진 조정
                  fontSize: '1.6rem' // 폰트 사이즈 조정
                }}>Golden Gate</h3>
                <p className="logo-subtitle" style={{
                  color: '#4A3728',
                  fontSize: '15px', // 폰트 사이즈 조정
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
              padding: '20px 30px', // 패딩 조정
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)',
              boxShadow: '0 4px 20px rgba(44, 31, 20, 0.12)',
              border: '1px solid rgba(184, 134, 11, 0.2)'
            }}>
              <div style={{ marginBottom: '25px' }}>
                <h2 style={{
                  color: '#2C1F14',
                  fontWeight: '700',
                  fontSize: '24px', // 폰트 사이즈 조정
                  marginBottom: '8px'
                }}>사용자 정보</h2>
                <p style={{
                  color: '#4A3728',
                  fontSize: '14px',
                  margin: 0,
                  fontWeight: '500'
                }}>사용자 정보를 수정할 수 있습니다.</p>
              </div>

              <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flexGrow: 1 }}>
                  <div className="login-form-group" style={{ marginBottom: '20px' }}>
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
                        padding: '7px 15px', // 패딩 조정
                        border: '2px solid rgba(184, 134, 11, 0.35)',
                        borderRadius: '12px',
                        fontSize: '15px', // 폰트 사이즈 조정
                        backgroundColor: '#f8f9fa',
                        cursor: 'not-allowed'
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
                        padding: '7px 15px', // 패딩 조정
                        border: '2px solid rgba(184, 134, 11, 0.35)',
                        borderRadius: '12px',
                        fontSize: '15px', // 폰트 사이즈 조정
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
                    <div style={{ height: '22px' }}>
                        {!isEmailValid && userInfo.email && <p style={{ paddingLeft: 0, margin: '6px 0 0 0', color: '#dc3545', fontSize: '13px', fontWeight: '500' }}>올바른 이메일 형식이 아닙니다.</p>}
                    </div>
                  </div>

                  <div className="login-form-group" style={{ marginBottom: '20px' }}>
                    <label className="login-form-label" style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#2C1F14',
                      fontWeight: '700',
                      fontSize: '14px'
                    }}>전화번호</label>
                    <input
                      type="text"
                      name="phone"
                      className="login-form-control"
                      value={userInfo.phone}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '7px 15px', // 패딩 조정
                        border: '2px solid rgba(184, 134, 11, 0.35)',
                        borderRadius: '12px',
                        fontSize: '15px', // 폰트 사이즈 조정
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
                    <div style={{ height: '22px' }}>
                        {!isPhoneValid && userInfo.phone && <p style={{ paddingLeft: 0, margin: '6px 0 0 0', color: '#dc3545', fontSize: '13px', fontWeight: '500' }}>전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)</p>}
                    </div>
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
                      value={newPassword}
                      onChange={handleChange}
                      placeholder="새 비밀번호"
                      style={{
                        width: '100%',
                        padding: '7px 15px', // 패딩 조정
                        border: '2px solid rgba(184, 134, 11, 0.35)',
                        borderRadius: '12px',
                        fontSize: '15px', // 폰트 사이즈 조정
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
                    <p style={{ 
                        color: !isPasswordValid && newPassword ? '#dc3545' : '#4A3728',
                        fontSize: '12px',
                        marginTop: '6px',
                        fontWeight: '500',
                        lineHeight: '1.4',
                        transition: 'color 0.3s ease'
                    }}>
                        *영문, 숫자, 특수문자 중 2종류 조합 시 10자리, 3종류 조합 시 8자리 이상으로 구성해주세요.
                    </p>
                  </div>

                  <div className="login-form-group" style={{ marginBottom: '20px' }}>
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
                      value={confirmPassword}
                      onChange={handleChange}
                      placeholder="새 비밀번호 확인"
                      style={{
                        width: '100%',
                        padding: '7px 15px', // 패딩 조정
                        border: '2px solid rgba(184, 134, 11, 0.35)',
                        borderRadius: '12px',
                        fontSize: '15px', // 폰트 사이즈 조정
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
                    <div style={{ height: '22px' }}>
                        {!passwordsMatch && confirmPassword && <p style={{ paddingLeft: 0, margin: '6px 0 0 0', color: '#dc3545', fontSize: '13px', fontWeight: '500' }}>비밀번호가 일치하지 않습니다.</p>}
                    </div>
                  </div>
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
                    marginTop: 'auto', // 버튼을 하단에 고정
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
                      <span className="spinner-border spinner-border-sm me-2" role="status" style={{ width: '0.8rem', height: '0.8rem' }}></span>
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

        /* 반응형 스타일 추가 */
        @media (max-width: 768px) {
          .page-wrapper {
            padding: 10px !important;
            align-items: flex-start !important;
          }
          .dashboard-container {
            padding: 10px !important;
            max-height: none !important;
          }
          .login-content {
            flex-direction: column;
          }
          .login-left {
            padding: 30px 20px !important;
          }
          .logo-circle {
            width: 100px !important;
            height: 100px !important;
            margin-bottom: 15px !important;
          }
          .logo-circle img {
            width: 60px !important;
            height: 60px !important;
          }
          .logo-title {
            font-size: 1.4rem !important;
          }
          .logo-subtitle {
            font-size: 14px !important;
          }
          .login-right {
            padding: 30px 20px !important;
          }
          .login-right h2 {
            font-size: 22px !important;
          }
        }
        /* Popup styles */
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
          background-color: #fff;
          padding: 30px 40px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          text-align: center;
          min-width: 300px;
          border: 1px solid #B8860B;
        }
        .popup-content p {
          color: #2C1F14;
          font-weight: 500;
        }
        .popup-button {
          padding: 10px 25px;
          background: linear-gradient(135deg, #B8860B, #CD853F);
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 20px;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .popup-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(184, 134, 11, 0.4);
        }
      `}</style>
    </div>
  );
};

export default UserConfig;
