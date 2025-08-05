import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// 메인 SignUp 컴포넌트
function SignUp() {
  const location = useLocation();
  const navigate = useNavigate();

  // 로그인 페이지에서 전달받은 state.isEmployee 값을 사용하여 초기 isEmployee 상태 설정
  const [isEmployee] = useState(location.state?.isEmployee ?? true);
  
  // 카드 애니메이션을 위한 상태
  const [animateCard, setAnimateCard] = useState(false);
  // 제출 로딩 상태
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

  // 컴포넌트 마운트 시 애니메이션 활성화
  useEffect(() => {
    setAnimateCard(true);
  }, []);

  // 아이디 중복 확인 핸들러
  const handleIdCheck = () => {
    if (!userId) {
        setPopupMessage('아이디를 입력해주세요.');
        setShowPopup(true);
        return;
    }
    // 실제 백엔드 API 호출 대신 임시 로직 사용
    if (userId === 'testuser') {
      setIsIdAvailable(false);
      setPopupMessage('이미 사용 중인 아이디입니다.');
      setShowPopup(true);
    } else {
      setIsIdAvailable(true);
      setPopupMessage('사용 가능한 아이디입니다.');
      setShowPopup(true);
    }
  };

  // 전화번호 입력 핸들러 (숫자 11자리만 허용)
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 11) {
      setPhone(value);
    }
  };

  // 회원가입 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isIdAvailable !== true) {
        setPopupMessage('아이디 중복 확인을 해주세요.');
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
    // 여기에 실제 회원가입 로직 (API 호출 등)을 추가
    console.log({
      type: isEmployee ? '직원' : '사용자',
      userId,
      password,
      name,
      email,
      phone: phone,
      agreedToTerms,
    });

    // API 호출 시뮬레이션
    setTimeout(() => {
        setLoading(false);
        setPopupMessage('회원가입이 완료되었습니다!');
        setShowPopup(true);
        // 성공 시 로그인 페이지로 이동
        // navigate('/login'); 
    }, 1500);
  };

  // 팝업 닫기 핸들러
  const closePopup = () => {
    setShowPopup(false);
  };

  // 테마 색상 정의
  const theme = {
    employee: {
      headerColor: '#B8860B', // 직원 헤더 색상
    },
    user: {
      headerColor: '#6B4423', // 사용자 헤더 색상
    },
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

      {/* 메인 컨테이너 */}
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
                  {/* 라벨, 인풋, 버튼을 감싸는 컨테이너 추가 */}
                  <div className="id-layout-wrapper">
                    <label htmlFor="userId">아이디</label>
                    <input type="text" id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} onFocus={handleInputFocus} onBlur={handleInputBlur} required />
                    <button type="button" onClick={handleIdCheck} className="btn-golden">중복 확인</button>
                  </div>
                  {/* 중복 확인 결과 메시지 */}
                  <div className="feedback-wrapper">
                    {isIdAvailable === true && <p className="available-text">사용 가능한 아이디입니다.</p>}
                    {isIdAvailable === false && <p className="unavailable-text">사용할 수 없는 아이디입니다.</p>}
                  </div>
                </div>

                <div className="signup-input-group">
                  <label htmlFor="password">비밀번호</label>
                  <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={handleInputFocus} onBlur={handleInputBlur} required />
                  <p className="warning-text">*영문, 숫자, 특수문자 중 2종류 조합 시 10자리, 3종류 조합 시 8자리 이상으로 구성해주세요.</p>
                </div>

                <div className="signup-input-group">
                  <label htmlFor="confirmPassword">비밀번호 확인</label>
                  <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onFocus={handleInputFocus} onBlur={handleInputBlur} required />
                </div>

                <div className="signup-input-group">
                  <label htmlFor="name">이름</label>
                  <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} onFocus={handleInputFocus} onBlur={handleInputBlur} required />
                </div>

                <div className="signup-input-group">
                  <label htmlFor="email">이메일</label>
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={handleInputFocus} onBlur={handleInputBlur} required />
                </div>

                <div className="signup-input-group">
                  <label htmlFor="phone">전화번호</label>
                  <input type="tel" id="phone" value={phone} onChange={handlePhoneChange} placeholder="'-' 없이 숫자 11자리 입력" maxLength="11" onFocus={handleInputFocus} onBlur={handleInputBlur} required />
                </div>
              </div>

              {/* 약관 동의 섹션 */}
              <div className="terms-section">
                <div className="terms-box">
                  <p className="terms-title">약관 동의</p>
                  <div className="terms-content-box">
                    <p>제1조 (목적) 본 약관은 [회사명] (이하 "회사"라 한다)이 제공하는 서비스 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임 사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
                    <p>제2조 (정의) 이 약관에서 사용하는 용어의 정의는 다음과 같습니다. <br/>1. "서비스"라 함은 ...</p>
                    <p>제3조 (약관의 게시와 개정) <br/>1. 회사는 이 약관의 내용을 ...</p>
                    {/* ... (이하 약관 내용 생략) ... */}
                  </div>
                </div>
                <div className="terms-agreement">
                  <input type="checkbox" id="agreeTerms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} />
                  <label htmlFor="agreeTerms">약관에 동의합니다.</label>
                </div>
              </div>
            </form>
            
            {/* 회원가입 및 로그인으로 돌아가기 버튼 */}
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
        /* 전역 및 레이아웃 */
        .signup-page-wrapper {
          height: 100vh;
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
          max-height: 880px;
          margin: 0 auto;
          display: flex;
          box-sizing: border-box;
          background: rgba(184, 134, 11, 0.1);
          box-shadow: 0 12px 40px rgba(44, 31, 20, 0.25);
          backdrop-filter: blur(10px);
          padding: 24px;
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
          padding: 30px 0;
        }

        /* 헤더 */
        .header {
          width: 100%;
          text-align: center;
          margin-bottom: 20px;
          padding: 0 40px;
          box-sizing: border-box;
          flex-shrink: 0; /* Prevent header from shrinking */
        }
        .header h1 {
          font-size: 28px;
          font-weight: 700;
        }

        /* 폼 */
        .form-container {
          display: flex;
          flex: 1; 
          gap: 30px;
          padding: 0 40px;
          flex-wrap: wrap;
          overflow-y: auto; 
          min-height: 0; /* Fix for flexbox overflow issue */
        }
        
        .form-container::-webkit-scrollbar { width: 6px; }
        .form-container::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .form-container::-webkit-scrollbar-thumb { background-color: rgba(184, 134, 11, 0.5); border-radius: 10px; }

        .input-section, .terms-section {
          flex: 1;
          min-width: 320px;
        }
        .terms-section {
            display: flex;
            flex-direction: column;
        }
        .signup-input-group {
          margin-bottom: 18px;
        }
        .signup-input-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 700;
          color: #2C1F14;
          font-size: 14px;
        }
        .signup-input-group input { 
          width: 100%;
          padding: 0 20px;
          border: 2px solid rgba(184, 134, 11, 0.35);
          border-radius: 12px; /*입력창 모서리 둥글*/
          font-size: 16px;
          box-sizing: border-box;
          height: 55px; 
          transition: all 0.3s ease;
          outline: none;
          background-color: rgba(255, 255, 255, 0.95);
        }

        /* 아이디 입력 필드 특별 레이아웃 */
        .id-layout-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .id-layout-wrapper label {
          margin-bottom: 0; /* flex 정렬을 위해 margin 제거 */
          flex-shrink: 0; /* 라벨이 줄어들지 않도록 설정 */
        }
        .id-layout-wrapper input {
          flex-grow: 1; /* 입력창이 남는 공간을 모두 차지하도록 설정 */
        }
        .id-layout-wrapper .btn-golden {
          flex-shrink: 0; /* 버튼이 줄어들지 않도록 설정 */
        }
        .feedback-wrapper {
          /* 결과 메시지가 아래에 표시되도록 공간 확보 */
          height: 22px; 
        }
        .feedback-wrapper .available-text {
          padding-left: 50px;
          margin: 6px 0 0 0;
          color: #28a745;
          font-size: 13px;
        }
        .feedback-wrapper .unavailable-text {
          padding-left: 50px;
          margin: 6px 0 0 0;
          color: #dc3545;
          font-size: 13px;
        }
        
        .warning-text {
          color: #4A3728;
          font-size: 12px;
          margin-top: 6px;
          font-weight: 500;
        }

        /* 약관 */
        .terms-box {
          flex: 1;
          border: 1px solid rgba(184, 134, 11, 0.2);
          border-radius: 12px;
          background-color: rgba(184, 134, 11, 0.05);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .terms-title {
          font-size: 16px;
          font-weight: 700;
          text-align: center;
          padding: 15px;
          color: #2C1F14;
          border-bottom: 1px solid rgba(184, 134, 11, 0.2);
        }
        .terms-content-box {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
          font-size: 13px;
          line-height: 1.7;
          color: #4A3728;
        }
        .terms-content-box::-webkit-scrollbar { width: 6px; }
        .terms-content-box::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .terms-content-box::-webkit-scrollbar-thumb { background-color: rgba(184, 134, 11, 0.5); border-radius: 10px; }
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

        /* 버튼 */
        .button-container {
          width: 100%; 
          padding: 0 40px; 
          box-sizing: border-box;
          margin-top: 20px;
          flex-shrink: 0; /* Prevent button container from shrinking */
        }
         .btn-golden {
          height: 45px; /* 높이 줄이기 */
          padding: 0 15px; /* 좌우 패딩 줄이기 */
          box-sizing: border-box;
          background: linear-gradient(135deg, #4A3728, #8B5A2B); 
          border: none;
          color: white; /* 글자색 변경 */
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
          margin-top: 20px; 
          text-align: center;
        }
        .login-link {
          background: none;
          border: none;
          color: #B8860B;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          padding: 5px;
        }
        .login-link:hover {
          text-decoration: underline;
        }

        /* 팝업 */
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

        /* 반응형 */
        @media (max-width: 768px) {
          .signup-page-wrapper {
            height: auto;
            min-height: calc(100vh - 60px);
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
            overflow-y: visible; /* 모바일에서는 스크롤을 다시 외부로 */
          }
          .header, .button-container {
            padding: 0 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default SignUp;
