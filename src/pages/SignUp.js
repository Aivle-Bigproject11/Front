import React, { useState, useEffect } from 'react'; // useEffect 추가 (useLocation 사용 시 필요할 수 있음)
import { useLocation } from 'react-router-dom'; // useLocation 임포트

// 메인 SignUp 컴포넌트
function SignUp() {
  const location = useLocation();
  // 로그인 페이지에서 전달받은 state.isEmployee 값을 사용하여 초기 isEmployee 상태 설정
  // state가 없거나 isEmployee 값이 명시되지 않은 경우 기본값은 true (직원용)
  const [isEmployee, setIsEmployee] = useState(location.state?.isEmployee ?? true); 

  const [userId, setUserId] = useState(''); // 아이디 입력
  const [isIdAvailable, setIsIdAvailable] = useState(null); // 아이디 사용 가능 여부 (null: 확인 전, true: 사용 가능, false: 사용 불가)
  const [password, setPassword] = useState(''); // 비밀번호
  const [confirmPassword, setConfirmPassword] = useState(''); // 비밀번호 확인
  const [name, setName] = useState(''); // 이름
  const [email, setEmail] = useState(''); // 이메일
  const [phoneNumber, setPhoneNumber] = useState(''); // 전화번호
  const [agreedToTerms, setAgreedToTerms] = useState(false); // 약관 동의 여부
  const [showPopup, setShowPopup] = useState(false); // 팝업 표시 여부
  const [popupMessage, setPopupMessage] = useState(''); // 팝업 메시지

  // 아이디 중복 확인 핸들러
  const handleIdCheck = () => {
    // 실제 백엔드 API 호출 대신 임시 로직 사용
    // 예를 들어, 'testuser'는 중복된 아이디로 가정
    if (userId === 'testuser') {
      setIsIdAvailable(false);
      setPopupMessage('사용 불가 아이디입니다.');
      setShowPopup(true);
    } else {
      setIsIdAvailable(true);
      setPopupMessage('사용 가능한 아이디입니다.'); // 팝업 대신 텍스트로 표시
    }
  };

  // 전화번호 입력 핸들러 (숫자 11자리만 허용)
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 남김
    if (value.length <= 11) {
      setPhoneNumber(value);
    }
  };

  // 회원가입 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
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
    // 여기에 실제 회원가입 로직 (API 호출 등)을 추가
    console.log({
      type: isEmployee ? '직원' : '사용자',
      userId,
      password,
      name,
      email,
      phoneNumber,
      agreedToTerms,
    });
    setPopupMessage('회원가입이 완료되었습니다!');
    setShowPopup(true);
  };

  // 팝업 닫기 핸들러
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div style={styles.container}>
      {/* 팝업 UI */}
      {showPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupContent}>
            <p>{popupMessage}</p>
            <button onClick={closePopup} style={styles.popupButton}>확인</button>
          </div>
        </div>
      )}

      <div style={styles.header}>
        {/* isEmployee 값에 따라 제목을 조건부 렌더링 */}
        <h1 style={styles.headerText}>
          {isEmployee ? '직원' : '사용자'} 회원가입
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={styles.formContainer}>
        <div style={styles.inputSection}>
          <div style={styles.inputGroup}>
            <label htmlFor="userId" style={styles.label}>아이디</label>
            <div style={styles.idInputWrapper}>
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                style={styles.inputField}
                required
              />
              <button type="button" onClick={handleIdCheck} style={styles.checkButton}>
                중복 확인
              </button>
            </div>
            {isIdAvailable === true && (
              <p style={styles.availableText}>사용 가능한 아이디입니다.</p>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.inputField}
              required
            />
            <p style={styles.warningText}>
              *영문, 숫자, 특수문자 중 2종류를 조합하여 10자리(3종류는 8자리) 이상으로 구성해 주세요.
            </p>
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.inputField}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="name" style={styles.label}>이름</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.inputField}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.inputField}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="phoneNumber" style={styles.label}>전화번호</label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="숫자 11자리만 입력"
              maxLength="11"
              style={styles.inputField}
              required
            />
          </div>
        </div>

        <div style={styles.termsSection}>
          <div style={styles.termsBox}>
            <p style={styles.termsTitle}>약관 동의</p>
            <div style={styles.termsContent}>
              {/* 약관 내용 - 스크롤 가능 */}
              <p>
                제1조 (목적) 본 약관은 [회사명] (이하 "회사"라 한다)이 제공하는 서비스 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임 사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
              <p>
                제2조 (정의) 이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
                <br />1. "서비스"라 함은 구현되는 단말기(PC, 휴대용 단말기 등의 각종 유무선 장치를 포함)와 상관없이 회원이 이용할 수 있는 [회사명] 관련 제반 서비스를 의미합니다.
                <br />2. "회원"이라 함은 회사의 서비스에 접속하여 이 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.
                <br />3. "아이디(ID)"라 함은 회원의 식별과 서비스 이용을 위하여 회원이 정하고 회사가 승인하는 문자와 숫자의 조합을 의미합니다.
                <br />4. "비밀번호"라 함은 회원이 부여받은 아이디와 일치되는 회원임을 확인하고 비밀보호를 위해 회원 자신이 정한 문자 또는 숫자의 조합을 의미합니다.
              </p>
              <p>
                제3조 (약관의 게시와 개정)
                <br />1. 회사는 이 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.
                <br />2. 회사는 "약관의 규제에 관한 법률", "정보통신망 이용촉진 및 정보보호 등에 관한 법률" 등 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
                <br />3. 회사가 약관을 개정할 경우에는 적용일자 및 개정 사유를 명시하여 현행 약관과 함께 서비스 초기 화면에 그 적용일자 7일 전부터 적용일자 전일까지 공지합니다. 다만, 회원에게 불리하게 약관 내용을 변경하는 경우에는 최소한 30일 이상의 사전 유예기간을 두고 공지합니다. 이 경우 회사는 개정 전 내용과 개정 후 내용을 명확하게 비교하여 회원이 알기 쉽도록 표시합니다.
                <br />4. 회원이 개정 약관의 적용에 동의하지 않는 경우 회사는 개정 약관의 내용을 적용할 수 없으며, 이 경우 회원은 이용계약을 해지할 수 있습니다. 다만, 기존 약관을 적용할 수 없는 특별한 사정이 있는 경우에는 회사는 이용계약을 해지할 수 있습니다.
              </p>
              <p>
                제4조 (회원가입)
                <br />1. 회원가입은 회원이 되고자 하는 자가 약관의 내용에 대하여 동의를 한 다음 회사가 정한 가입 양식에 따라 회원정보를 기입하고 "회원가입" 버튼을 누르는 방식으로 신청합니다.
                <br />2. 회사는 제1항과 같이 회원으로 가입할 것을 신청한 자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.
                <br />  (1) 가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우. 다만, 회사의 회원 재가입 승낙을 얻은 경우에는 예외로 합니다.
                <br />  (2) 등록 내용에 허위, 기재 누락, 오기가 있는 경우
                <br />  (3) 기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우
                <br />3. 회원가입계약의 성립 시기는 회사의 승낙이 회원에게 도달한 시점으로 합니다.
              </p>
              <p>
                제5조 (개인정보보호 의무)
                <br />회사는 "정보통신망 이용촉진 및 정보보호 등에 관한 법률" 등 관계 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다. 개인정보의 보호 및 사용에 대해서는 관련 법령 및 회사의 개인정보처리방침이 적용됩니다.
              </p>
              <p>
                제6조 (회원의 아이디 및 비밀번호의 관리에 대한 의무)
                <br />1. 회원은 아이디와 비밀번호에 대한 관리 책임을 가집니다.
                <br />2. 회원은 자신의 아이디 및 비밀번호를 제3자가 이용하게 해서는 안 됩니다.
                <br />3. 회원이 아이디 및 비밀번호를 도난당하거나 제3자가 사용하고 있음을 인지한 경우에는 즉시 회사에 통보하고 회사의 안내에 따라야 합니다.
              </p>
              <p>
                제7조 (회원에 대한 통지)
                <br />1. 회사가 회원에 대한 통지를 하는 경우, 회원이 미리 지정한 전자우편 주소로 할 수 있습니다.
                <br />2. 회사는 불특정 다수 회원에 대한 통지의 경우 7일 이상 서비스 초기 화면에 게시함으로써 개별 통지에 갈음할 수 있습니다.
              </p>
              <p>
                제8조 (서비스의 변경)
                <br />회사는 상당한 이유가 있는 경우에 운영상, 기술상의 필요에 따라 제공하고 있는 전부 또는 일부 서비스를 변경할 수 있습니다.
              </p>
              <p>
                제9조 (이용계약 해지)
                <br />1. 회원은 언제든지 서비스 초기 화면의 고객센터 또는 내 정보 관리 메뉴 등을 통하여 이용계약 해지 신청을 할 수 있으며, 회사는 관련 법령 등이 정하는 바에 따라 이를 즉시 처리하여야 합니다.
                <br />2. 회원이 계약을 해지할 경우, 관련 법령 및 개인정보처리방침에 따라 회사가 회원 정보를 보유하는 경우를 제외하고는 해지 즉시 회원의 모든 데이터는 소멸됩니다.
              </p>
              <p>
                제10조 (손해배상)
                <br />회사는 서비스 이용과 관련하여 회원의 고의 또는 과실로 인하여 회원에게 발생한 손해에 대하여는 책임을 부담하지 않습니다.
              </p>
              <p>
                제11조 (관할법원)
                <br />서비스 이용과 관련하여 회사와 회원 간에 발생한 분쟁에 대하여는 대한민국 법을 준거법으로 하며, 본 분쟁으로 인한 소송은 민사소송법상의 관할법원에 제기합니다.
              </p>
            </div>
          </div>
          <div style={styles.termsAgreement}>
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              style={styles.checkbox}
            />
            <label htmlFor="agreeTerms" style={styles.checkboxLabel}>약관에 동의합니다.</label>
          </div>
        </div>

        <button type="submit" style={styles.submitButton}>
          회원가입
        </button>
      </form>
    </div>
  );
}

// 인라인 스타일 정의
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
    boxSizing: 'border-box',
  },
  header: {
    width: '100%',
    maxWidth: '800px',
    display: 'flex',
    justifyContent: 'center', // 중앙 정렬로 변경
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  headerText: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  // toggleButton 스타일은 더 이상 필요 없으므로 삭제
  formContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '40px',
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '900px',
    flexWrap: 'wrap', // 반응형을 위해 추가
  },
  inputSection: {
    flex: 1,
    minWidth: '300px', // 최소 너비 설정
  },
  termsSection: {
    flex: 1,
    minWidth: '300px', // 최소 너비 설정
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#555',
  },
  inputField: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  idInputWrapper: {
    display: 'flex',
    gap: '10px',
  },
  checkButton: {
    padding: '12px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  availableText: {
    color: 'green',
    fontSize: '14px',
    marginTop: '5px',
  },
  warningText: {
    color: 'red',
    fontSize: '12px',
    marginTop: '5px',
  },
  termsBox: {
    width: '100%',
    height: '250px', // 이미지와 유사하게 높이 설정
    border: '1px solid #ddd',
    borderRadius: '5px',
    overflowY: 'scroll', // 스크롤 가능하게 설정
    padding: '20px',
    backgroundColor: '#fdfdfd',
    boxSizing: 'border-box',
    marginBottom: '20px',
  },
  termsTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '15px',
    color: '#333',
  },
  termsContent: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#666',
  },
  termsAgreement: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
  },
  checkbox: {
    marginRight: '10px',
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: '16px',
    color: '#555',
    cursor: 'pointer',
  },
  submitButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
    marginTop: '20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
    transition: 'background-color 0.3s ease',
  },
  submitButtonHover: {
    backgroundColor: '#218838',
  },
  // 팝업 스타일
  popupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popupContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    minWidth: '280px',
    maxWidth: '90%',
  },
  popupButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
    fontSize: '16px',
  },

  // 반응형 디자인을 위한 미디어 쿼리 (JavaScript에서 직접 적용할 수 없으므로, CSS 파일에 넣는 것이 더 좋습니다.
  // 레이아웃 화면 자동 변경(모바일,탭 환경 변경 시)- 필요 없으면 삭제 
  /*
  '@media (max-width: 768px)': {
    formContainer: {
      flexDirection: 'column',
    },
    inputSection: {
      minWidth: 'unset',
    },
    termsSection: {
      minWidth: 'unset',
    },
  },
  */
};

export default SignUp;
