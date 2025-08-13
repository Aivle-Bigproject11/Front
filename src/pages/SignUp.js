import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

// 메인 SignUp 컴포넌트
function SignUp() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isEmployee] = useState(location.state?.isEmployee ?? true);
  const [animateCard, setAnimateCard] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userId, setUserId] = useState('');
  const [isIdAvailable, setIsIdAvailable] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true); // New state

  useEffect(() => {
    setAnimateCard(true);
  }, []);

  // 비밀번호 유효성 검사 함수
  const validatePassword = (pw) => {
    const hasLetters = /[a-zA-Z]/.test(pw);
    const hasNumbers = /\d/.test(pw);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(pw);
    const types = [hasLetters, hasNumbers, hasSymbols].filter(Boolean).length;
    if (types >= 3 && pw.length >= 8) return true;
    if (types >= 2 && pw.length >= 10) return true;
    return false;
  };

  // 이메일 형식 검사 함수
  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhoneNumber = (phoneNumber) => {
    const re = /^\d{3}-\d{4}-\d{4}$/;
    return re.test(phoneNumber);
  };

  useEffect(() => {
    if (password) {
      setIsPasswordValid(validatePassword(password));
    } else {
      setIsPasswordValid(true);
    }

    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (email) {
      setIsEmailValid(validateEmail(email));
    } else {
      setIsEmailValid(true);
    }
  }, [email]);

  const handleIdCheck = () => {
    if (!userId) {
      setPopupMessage('아이디를 입력해주세요.');
      setShowPopup(true);
      return;
    }
    if (userId === 'testuser') {
      setIsIdAvailable(false);
      setPopupMessage('이미 사용 중인 아이디입니다.');
      setShowPopup(true);
    } else {
      setIsIdAvailable(true);
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ''); // Remove all non-digits
    let formattedValue = '';

    if (value.length > 0) {
      formattedValue += value.substring(0, 3);
      if (value.length > 3) {
        formattedValue += '-' + value.substring(3, 7);
        if (value.length > 7) {
          formattedValue += '-' + value.substring(7, 11);
        }
      }
    }
    setPhone(formattedValue);
    setIsPhoneValid(validatePhoneNumber(formattedValue)); // Update validation state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isIdAvailable !== true) {
      setPopupMessage('아이디 중복 확인을 해주세요.');
      setShowPopup(true);
      return;
    }
    if (!name.trim()) {
      setPopupMessage('이름을 입력해주세요.');
      setShowPopup(true);
      return;
    }
    if (!validateEmail(email)) {
      setPopupMessage('올바른 이메일 형식이 아닙니다.');
      setShowPopup(true);
      return;
    }
    if (!validatePhoneNumber(phone)) {
      return;
    }
    if (!validatePassword(password)) {
      setPopupMessage('비밀번호가 양식에 맞지 않습니다.');
      setShowPopup(true);
      return;
    }
    if (password !== confirmPassword) {
      setPopupMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      setShowPopup(true);
      return;
    }
    if (!agreedToTerms) {
      setPopupMessage('약관 동의가 필요합니다.');
      setShowPopup(true);
      return;
    }

    setLoading(true);

    if (isEmployee) {
      const managerData = {
        email: email,
        loginId: userId,
        loginPassword: password,
        name: name,
        phone: phone,
      };

      try {
        await apiService.createManager(managerData);
        setPopupMessage('직원 회원가입이 완료되었습니다!');
        setShowPopup(true);
        // navigate('/login'); // Optionally navigate after popup confirmation
      } catch (error) {
        console.error("Manager creation failed:", error);
        setPopupMessage('회원가입에 실패했습니다. 다시 시도해주세요.');
        setShowPopup(true);
      } finally {
        setLoading(false);
      }
    } else {
      const familyData = {
        name: name,
        loginId: userId,
        loginPassword: password,
        email: email,
        phone: phone,
      };

      try {
        await apiService.createFamily(familyData);
        setPopupMessage('사용자 회원가입이 완료되었습니다!');
        setShowPopup(true);
        // navigate('/login'); // Optionally navigate after popup confirmation
      } catch (error) {
        console.error("Family creation failed:", error);
        setPopupMessage('회원가입에 실패했습니다. 다시 시도해주세요.');
        setShowPopup(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    if (popupMessage === '직원 회원가입이 완료되었습니다!' || popupMessage === '사용자 회원가입이 완료되었습니다!') {
      navigate('/login');
    }
  };

  const theme = {
    employee: { headerColor: '#B8860B' },
    user: { headerColor: '#6B4423' }
  };
  const currentTheme = isEmployee ? theme.employee : theme.user;

  const handleInputFocus = (e) => {
    e.target.style.borderColor = '#B8860B';
    e.target.style.boxShadow = '0 0 0 3px rgba(184, 134, 11, 0.2)';
  };
  const handleInputBlur = (e) => {
    e.target.style.borderColor = 'rgba(184, 134, 11, 0.35)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="signup-page-wrapper">
      {/* 팝업 UI */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>{popupMessage}</p>
            <button onClick={closePopup} className="popup-button">확인</button>
          </div>
        </div>
      )}

      <div className={`signup-container ${animateCard ? 'animate-in' : ''}`}>
        <div className="signup-card">
          <div className="signup-content">
            <div className="header">
              <h1 style={{ color: currentTheme.headerColor }}>
                {isEmployee ? '직원' : '사용자'} 회원가입
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="form-container">
              {/* 입력 필드 섹션 */}
              <div className="input-section">

                <div className="signup-input-group">
                  <div className="id-layout-wrapper">
                    <label htmlFor="userId">아이디</label>
                    <input type="text" id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} onFocus={handleInputFocus} onBlur={handleInputBlur} required />
                    <button type="button" onClick={handleIdCheck} className="btn-golden">중복 확인</button>
                  </div>
                  <div className="feedback-wrapper">
                    {isIdAvailable === true && <p className="available-text">사용 가능한 아이디입니다.</p>}
                    {isIdAvailable === false && <p className="unavailable-text">사용할 수 없는 아이디입니다.</p>}
                  </div>
                </div>

                <div className="signup-input-group">
                  <label htmlFor="password">비밀번호</label>
                  <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={handleInputFocus} onBlur={handleInputBlur} required />
                  <p className="warning-text" style={{ color: !isPasswordValid && password ? '#dc3545' : '#4A3728' }}>
                    *영문, 숫자, 특수문자 중 2종류 조합 시 10자리, 3종류 조합 시 8자리 이상으로 구성해주세요.
                  </p>
                </div>

                <div className="signup-input-group">
                  <label htmlFor="confirmPassword">비밀번호 확인</label>
                  <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onFocus={handleInputFocus} onBlur={handleInputBlur} required />
                  <div className="feedback-wrapper">
                    {!passwordsMatch && confirmPassword && <p className="unavailable-text" style={{ paddingLeft: 0, margin: '6px 0 0 0' }}>비밀번호가 일치하지 않습니다.</p>}
                  </div>
                </div>

                <div className="signup-input-group">
                  <label htmlFor="name">이름</label>
                  <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} onFocus={handleInputFocus} onBlur={handleInputBlur} required placeholder="이름 입력" />
                  <div className="feedback-wrapper">
                    {<p className="unavailable-text" style={{ paddingLeft: 0, margin: '6px 0 0 0' }}></p>}
                  </div>
                </div>

                <div className="signup-input-group">
                  <label htmlFor="email">이메일</label>
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={handleInputFocus} onBlur={handleInputBlur} required placeholder="goldengate@example.com" />
                  <div className="feedback-wrapper">
                    {!isEmailValid && email && <p className="unavailable-text" style={{ paddingLeft: 0, margin: '6px 0 0 0' }}>올바른 이메일 형식이 아닙니다.</p>}
                  </div>
                </div>

                <div className="signup-input-group">
                  <label htmlFor="phone">전화번호</label>
                  <input type="tel" id="phone" value={phone} onChange={handlePhoneChange} placeholder="'-' 없이 숫자 11자리 입력" onFocus={handleInputFocus} onBlur={handleInputBlur} required />
                  <div className="feedback-wrapper">
                    {!isPhoneValid && phone && <p className="unavailable-text" style={{ paddingLeft: 0, margin: '6px 0 0 0' }}>전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)</p>}
                  </div>
                </div>
              </div>

              {/* 약관 동의 섹션 */}
              <div className="terms-section">
                <div className="terms-box">
                  <p className="terms-title">[필수] 개인정보 수집 및 이용 동의 안내</p>
                  <div className="terms-content-box">
                    <p>
                      <b>1. 수집하는 개인정보 항목</b><br />
                      - 성명, 아이디, 비밀번호, 이메일, 전화번호 등 회원가입 시 입력한 정보
                    </p>
                    <p>
                      <b>2. 개인정보의 수집 및 이용 목적</b><br />
                      - 회원 가입의사 확인, 본인 식별 및 인증, 회원자격 유지·관리, 서비스 제공 및 이용 통계, 민원처리, 고지사항 전달 등
                    </p>
                    <p>
                      <b>3. 개인정보의 보유 및 이용기간</b><br />
                      - 회원 탈퇴 시 또는 개인정보의 수집·이용 목적 달성 시까지 보관<br />
                      - 단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관
                    </p>
                    <p>
                      <b>4. 개인정보 수집에 대한 동의 거부 권리 및 불이익</b><br />
                      - 귀하는 개인정보 수집·이용을 거부할 권리가 있습니다.<br />
                      - 단, 필수정보 미제공 시 서비스 이용(회원가입)이 제한될 수 있습니다.
                    </p>
                    <hr />
                    <p>
                      <b>[상세]</b><br />
                      ▶ <b>수집항목</b>: 이름, 아이디, 비밀번호, 이메일, 전화번호 등 회원관리 필수항목<br />
                      ▶ <b>이용목적</b>: 회원 식별/인증 및 관리, 불량회원 방지, 공지/민원 안내 등<br />
                      ▶ <b>보유기간</b>: 회원 탈퇴 즉시 또는 관계 법령 기준(통신비밀보호법, 전자상거래법 등에서 명시된 기간)
                    </p>
                    <hr />
                    <p>
                      * 위 개인정보 수집 및 이용에 동의하지 않을 권리가 있으나, 미동의 시 회원가입이 불가합니다.
                    </p>
                  </div>
                </div>
                <div className="terms-agreement">
                  <input type="checkbox" id="agreeTerms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} />
                  <label htmlFor="agreeTerms">위 개인정보 수집 및 이용에 동의합니다.</label>
                </div>
              </div>
            </form>
            
            <div className="button-container">
              <button 
                type="submit" 
                onClick={handleSubmit}
                disabled={loading}
                className="submit-button"
              >
                {loading ? '가입 처리 중...' : '회원가입'}
              </button>

              <div className="link-container">
                <button onClick={() => navigate('/login')} className="login-link">
                  로그인 화면으로 돌아가기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .signup-page-wrapper {
          min-height: 100vh;
          height: auto;
          background: linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow: hidden; 
        }
        .signup-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 940px;
          height: 95%;
          max-height: 940px;
          margin: 0 auto;
          display: flex;
          box-sizing: border-box;
          background: rgba(184, 134, 11, 0.1);
          box-shadow: 0 12px 40px rgba(44, 31, 20, 0.25);
          backdrop-filter: blur(10px);
          padding: 20px;
          border-radius: 28px;
          border: 1px solid rgba(184, 134, 11, 0.2);
          transform: translateY(30px);
          opacity: 0;
          transition: all 0.6s ease-out;
        }
        .signup-container.animate-in {
          transform: translateY(0);
          opacity: 1;
        }
        .signup-card {
          width: 100%;
          height: 100%; 
          background: rgba(255, 251, 235, 0.95);
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(44, 31, 20, 0.3);
          overflow: hidden;
          border: 1px solid rgba(184, 134, 11, 0.3);
          display: flex; 
          flex-direction: column;
        }
        .signup-content {
          display: flex;
          flex-direction: column;
          height: 100%; 
          padding: 15px 0;
        }
        .header {
          width: 100%;
          text-align: center;
          margin-bottom: 15px;
          padding: 0 40px;
          box-sizing: border-box;
          flex-shrink: 0;
        }
        .header h1 {
          font-size: 20px;
          font-weight: 700;
        }
        .form-container {
          display: flex;
          flex: 1; 
          gap: 30px;
          padding: 0 40px;
          flex-wrap: wrap;
          overflow-y: hidden;
          min-height: 0;
        }
        .input-section {
          flex: 1;
          min-width: 320px;
          margin-left: 15px;
          margin-right: 40px; /* Adjust as needed */
        }
        .terms-section {
          flex: 1;
          min-width: 320px;
        }
        .terms-section {
            display: flex;
            flex-direction: column;
        }
        .signup-input-group {
          margin-bottom: 12px;
        }
        .signup-input-group:last-child {
            margin-bottom: 0;
        }
        .signup-input-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 700;
          color: #2C1F14;
          font-size: 14px;
        }
        .signup-input-group input { 
          width: 100%;
          padding: 0 20px;
          border: 2px solid rgba(184, 134, 11, 0.35);
          border-radius: 8px;
          font-size: 14px;
          box-sizing: border-box;
          height: 40px;
          transition: all 0.3s ease;
          outline: none;
          background-color: rgba(255, 255, 255, 0.95);
        }
        /* 아이디 입력 필드 레이아웃 */
        .id-layout-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .id-layout-wrapper label {
          margin-bottom: 0;
          flex-shrink: 0;
        }
        .id-layout-wrapper input {
          flex-grow: 1;
        }
        .id-layout-wrapper .btn-golden {
          flex-shrink: 0;
        }
        .feedback-wrapper {
          height: 22px; 
        }
        .feedback-wrapper .available-text {
          padding-left: 50px;
          margin: 6px 0 0 0;
          color: #28a745;
          font-size: 13px;
        }
        .feedback-wrapper .unavailable-text, .unavailable-text {
          padding-left: 50px;
          margin: 6px 0 0 0;
          color: #dc3545;
          font-size: 13px;
          font-weight: 500;
        }
        .warning-text {
          color: #4A3728;
          font-size: 12px;
          margin-top: 6px;
          font-weight: 500;
          line-height: 1.4;
          transition: color 0.3s ease;
        }

        .terms-box {
          flex: 1;
          border: 1px solid rgba(184, 134, 11, 0.2);
          border-radius: 12px;
          background-color: rgba(184, 134, 11, 0.05);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-height: 220px; 
          max-height: 540px;
        }
        .terms-title {
          font-size: 16px;
          font-weight: 700;
          text-align: center;
          padding: 15px;
          color: #2C1F14;
          border-bottom: 1px solid rgba(184, 134, 11, 0.2);
          background: rgba(255,255,234,0.85);
        }
        .terms-content-box {
          flex: 1;
          padding: 13px 18px;
          overflow-y: auto;
          font-size: 13px;
          line-height: 1.7;
          color: #4A3728;
          background: none;
        }
        /* 스크롤바 커스텀! */
        .terms-content-box::-webkit-scrollbar {
          width: 6px;
        }
        .terms-content-box::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .terms-content-box::-webkit-scrollbar-thumb {
          background-color: rgba(184, 134, 11, 0.5);
          border-radius: 10px;
        }
        .terms-agreement {
          display: flex;
          align-items: center;
          margin-top: 15px;
          justify-content: center;
        }
        .terms-agreement input[type="checkbox"] {
          margin-right: 8px;
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #B8860B;
        }
        .terms-agreement label {
          font-size: 15px;
          color: #4A3728;
          cursor: pointer;
          font-weight: 500;
        }

        /* 버튼, 팝업 등 아래 동일 */
        .button-container {
          width: 100%; 
          padding: 0 40px; 
          box-sizing: border-box;
          margin-top: 15px; 
          flex-shrink: 0;
        }
        .btn-golden {
          height: 45px;
          padding: 0 15px;
          box-sizing: border-box;
          background: linear-gradient(135deg, #4A3728, #8B5A2B); 
          border: none;
          color: white;
          font-weight: 700;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(74, 55, 40, 0.35); 
          transition: all 0.3s ease;
          border-radius: 8px; 
          cursor: pointer;
          white-space: nowrap;
        }
        .btn-golden:hover {
          background: linear-gradient(135deg, #3c2d20, #7a4e24);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(74, 55, 40, 0.45);
        }
        .submit-button {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #D4AF37, #F5C23E);
          color: #2C1F14;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(184, 134, 11, 0.35);
        }
        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(184, 134, 11, 0.45);
        }
        .submit-button:disabled {
          background: #e9ecef;
          color: #6c757d;
          cursor: not-allowed;
          box-shadow: none;
        }
        .link-container {
          margin-top: 15px; 
          text-align: center;
        }
        .login-link {
          background: none;
          border: none;
          color: #B8860B;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          padding: 5px;
        }
        .login-link:hover {
          text-decoration: underline;
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
        @media (max-width: 768px) {
          .signup-page-wrapper {
            height: auto;
            min-height: 100vh;
            padding: 10px;
          }
          .signup-container {
            height: auto;
            max-height: none;
            padding: 10px;
          }
          .signup-content {
            padding: 20px 0;
          }
          .form-container {
            flex-direction: column;
            padding: 0 20px;
            overflow-y: visible;
          }
          .header, .button-container {
            padding: 0 20px;
          }
        }
      `}
      </style>
    </div>
  );
}

export default SignUp;
