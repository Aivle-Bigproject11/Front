import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
    </svg>
);

const CustomPopup = ({ message, onConfirm }) => (
    <div className="popup-overlay">
        <div className="popup-content">
            <p>{message}</p>
            <button onClick={onConfirm} className="popup-button confirm">확인</button>
        </div>
    </div>
);

const Menu1_5 = () => {
  const navigate = useNavigate();
  const [animateCard, setAnimateCard] = useState(false);
  const [formData, setFormData] = useState({
    customerId: null,
    name: '',
    rrn: '',
    ageAtDeath: '',
    birthYear: '', birthMonth: '', birthDay: '',
    deathYear: '', deathMonth: '', deathDay: '',
    gender: '남성',
    placeOfDeath: '',
    funeralCompany: '',
    directorName: '',
    directorPhone: ''
  });
  
  const [popup, setPopup] = useState({ isOpen: false, message: '', onConfirm: () => {} });

  useEffect(() => {
    setAnimateCard(true);
    const savedCustomer = localStorage.getItem('selectedCustomer');
    if (savedCustomer) {
      const customer = JSON.parse(savedCustomer);
      
      const birthDate = customer.birthOfDate ? new Date(customer.birthOfDate) : null;
      
      setFormData(prev => ({
        ...prev,
        customerId: customer.customerId || null,
        name: customer.name || '',
        rrn: customer.rrn || '',
        gender: customer.gender || '남성',
        birthYear: birthDate ? birthDate.getFullYear().toString() : '',
        birthMonth: birthDate ? (birthDate.getMonth() + 1).toString() : '',
        birthDay: birthDate ? birthDate.getDate().toString() : '',
      }));
    }
  }, []);

  // Age calculation effect
  useEffect(() => {
    const { birthYear, birthMonth, birthDay, deathYear, deathMonth, deathDay } = formData;
    if (birthYear && birthMonth && birthDay && deathYear && deathMonth && deathDay) {
      const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
      const deathDate = new Date(deathYear, deathMonth - 1, deathDay);
      
      if (birthDate instanceof Date && !isNaN(birthDate) && deathDate instanceof Date && !isNaN(deathDate)) {
        let age = deathDate.getFullYear() - birthDate.getFullYear();
        const monthDiff = deathDate.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && deathDate.getDate() < birthDate.getDate())) {
          age--;
        }
        setFormData(prev => ({ ...prev, ageAtDeath: age >= 0 ? age : '' }));
      }
    }
  }, [formData.birthYear, formData.birthMonth, formData.birthDay, formData.deathYear, formData.deathMonth, formData.deathDay]);

  const closePopup = () => {
    setPopup({ isOpen: false, message: '', onConfirm: () => {} });
  };

  const handleRrnChange = (e) => {
    const rawValue = e.target.value.replace(/-/g, '');
    const numbersOnly = rawValue.replace(/\D/g, '');
    let formattedRrn = numbersOnly;

    if (numbersOnly.length > 6) {
      formattedRrn = `${numbersOnly.slice(0, 6)}-${numbersOnly.slice(6, 13)}`;
    }
    
    setFormData(prevState => ({ ...prevState, rrn: formattedRrn }));
  };

  const handlePhoneChange = (e) => {
    const rawValue = e.target.value.replace(/-/g, '');
    const numbersOnly = rawValue.replace(/\D/g, '');
    let formattedPhone = numbersOnly;

    if (numbersOnly.length > 3 && numbersOnly.length <= 7) {
      formattedPhone = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
    } else if (numbersOnly.length > 7) {
      formattedPhone = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
    }

    setFormData(prevState => ({ ...prevState, directorPhone: formattedPhone }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };
  
  const validateForm = () => {
    const { 
      name, rrn, birthYear, birthMonth, birthDay, 
      deathYear, deathMonth, deathDay, 
      gender, placeOfDeath, funeralCompany, directorName, directorPhone 
    } = formData;

    // Check basic text/select fields
    if (!name.trim() || !rrn.trim() || !gender || !placeOfDeath.trim() || 
        !funeralCompany.trim() || !directorName.trim() || !directorPhone.trim()) {
      setPopup({
        isOpen: true,
        message: '모든 정보를 입력해주세요.',
        onConfirm: () => closePopup()
      });
      return false;
    }

    // Check birth date
    if (!birthYear || !birthMonth || !birthDay) {
      setPopup({
        isOpen: true,
        message: '생년월일을 정확히 입력해주세요.',
        onConfirm: () => closePopup()
      });
      return false;
    }

    // Check death date
    if (!deathYear || !deathMonth || !deathDay) {
      setPopup({
        isOpen: true,
        message: '별세일을 정확히 입력해주세요.',
        onConfirm: () => closePopup()
      });
      return false;
    }

    return true;
  };

  const handleRegisterDeceased = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop if validation fails
    }

    const { 
      customerId, name, rrn, ageAtDeath, 
      birthYear, birthMonth, birthDay, 
      deathYear, deathMonth, deathDay, 
      gender, placeOfDeath, funeralCompany, directorName, directorPhone 
    } = formData;

    // 데이터 형식 변환
    const deceasedBirthOfDate = (birthYear && birthMonth && birthDay) 
      ? `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}T00:00:00Z` 
      : null;

    const deceasedDate = (deathYear && deathMonth && deathDay) 
      ? `${deathYear}-${String(deathMonth).padStart(2, '0')}-${String(deathDay).padStart(2, '0')}T14:00:00Z` // 임의의 시간 설정
      : null;

    const apiData = {
      customerId,
      deceasedName: name,
      deceasedRrn: rrn,
      deceasedAge: parseInt(ageAtDeath, 10),
      deceasedBirthOfDate,
      deceasedGender: gender,
      deceasedAddress: placeOfDeath,
      deceasedDate,
      funeralCompanyName: funeralCompany,
      directorName,
      directorPhone
    };

    try {
      console.log('Sending data to API:', apiData);
      await apiService.createFuneralInfo(apiData);
      
      setPopup({
          isOpen: true,
          message: '고인 정보가 등록되었습니다.',
          onConfirm: () => {
              closePopup();
              navigate('/menu1-1');
          }
      });
    } catch (error) {
      console.error('Failed to register deceased:', error);
      setPopup({
        isOpen: true,
        message: `등록에 실패했습니다: ${error.message}`,
        onConfirm: () => closePopup()
      });
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="page-wrapper">
      {popup.isOpen && (
        <CustomPopup 
            message={popup.message}
            onConfirm={popup.onConfirm}
        />
      )}
      <div className={`form-card-container ${animateCard ? 'animate-in' : ''}`}>
        <div className="card-header">
            <button type="button" className="back-btn" onClick={() => navigate(-1)}>
                <BackArrowIcon />
                돌아가기
            </button>
            <h2 className="form-title">고인 정보 등록</h2>
        </div>
        <form onSubmit={handleRegisterDeceased}>
          <div className="form-grid">
            {/* Column 1 */}
            <div className="form-column">
              <div className="form-group">
                <label className="form-label">고유 번호</label>
                <input type="text" name="customerId" value={formData.customerId || ''} className="form-input" readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">이름</label>
                <input type="text" name="name" value={formData.name} className="form-input" readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">주민번호</label>
                <input type="text" name="rrn" value={formData.rrn} className="form-input" readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">성별</label>
                <select name="gender" value={formData.gender} className="form-select" disabled>
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
                </select>
              </div>
            </div>

            {/* Column 2 */}
            <div className="form-column">
              <div className="form-group">
                <label className="form-label">생년월일</label>
                <div className="birthdate-selects">
                  <select name="birthYear" value={formData.birthYear} className="form-select" disabled>
                    <option value="">년</option>
                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                  <select name="birthMonth" value={formData.birthMonth} className="form-select" disabled>
                    <option value="">월</option>
                    {months.map(month => <option key={month} value={month}>{month}</option>)}
                  </select>
                  <select name="birthDay" value={formData.birthDay} className="form-select" disabled>
                    <option value="">일</option>
                    {days.map(day => <option key={day} value={day}>{day}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">별세일</label>
                 <div className="birthdate-selects">
                  <select name="deathYear" value={formData.deathYear} onChange={handleChange} className="form-select">
                    <option value="">년</option>
                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                  <select name="deathMonth" value={formData.deathMonth} onChange={handleChange} className="form-select">
                    <option value="">월</option>
                    {months.map(month => <option key={month} value={month}>{month}</option>)}
                  </select>
                  <select name="deathDay" value={formData.deathDay} onChange={handleChange} className="form-select">
                    <option value="">일</option>
                    {days.map(day => <option key={day} value={day}>{day}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">별세 장소</label>
                <input type="text" name="placeOfDeath" value={formData.placeOfDeath} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">향년</label>
                <input type="number" name="ageAtDeath" value={formData.ageAtDeath} className="form-input" readOnly placeholder="자동 계산됩니다" />
              </div>
            </div>

            {/* Column 3 */}
            <div className="form-column">
               <div className="form-group">
                <label className="form-label">상조회사</label>
                <input type="text" name="funeralCompany" value={formData.funeralCompany} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">담당 장례지도사 이름</label>
                <input type="text" name="directorName" value={formData.directorName} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">담당 장례지도사 전화번호</label>
                <input type="tel" name="directorPhone" value={formData.directorPhone} onChange={handlePhoneChange} className="form-input" placeholder="010-1234-5678" maxLength="13" />
              </div>
            </div>
          </div>
          
          <div className="submit-button-container">
            <button type="submit" className="add-customer-btn">등록하기</button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        /* 전역 및 레이아웃 */
        .page-wrapper {
          min-height: calc(100vh - 62px);;
          background: linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          box-sizing: border-box;
          overflow: auto;
        }
        
        .form-card-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1200px;
          margin: 20px auto;
          background: rgba(255, 251, 235, 0.9);
          box-shadow: 0 12px 40px rgba(44, 31, 20, 0.25);
          backdrop-filter: blur(8px);
          padding: 30px 40px;
          border-radius: 28px;
          border: 1px solid rgba(184, 134, 11, 0.25);
          opacity: 0;
          transition: opacity 0.6s ease-out;
        }

        .form-card-container.animate-in {
          opacity: 1;
        }
        
        /* 헤더 */
        .card-header {
          position: relative;
          margin-bottom: 30px;
          text-align: center;
        }

        .back-btn {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          gap: 8px;
          height: 45px;
          padding: 0 20px;
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

        .back-btn:hover {
          background: linear-gradient(135deg, #3c2d20, #7a4e24);
          transform: translateY(-51%) scale(1.03);
          box-shadow: 0 4px 12px rgba(74, 55, 40, 0.45);
        }

        .form-title {
          font-size: 28px;
          font-weight: 700;
          color: #2C1F14;
          margin: 0;
          display: inline-block;
        }
        
        /* 폼 그리드 */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .form-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        /* 폼 요소 */
        .form-label {
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 700;
          color: #2C1F14;
        }

        .form-input, .form-select {
          width: 100%;
          padding: 0 20px;
          border: 2px solid rgba(184, 134, 11, 0.35);
          border-radius: 12px;
          font-size: 16px;
          box-sizing: border-box;
          height: 55px;
          transition: all 0.3s ease;
          outline: none;
          background-color: rgba(255, 255, 255, 0.95);
        }
        
        .form-input:focus, .form-select:focus {
          border-color: #D4AF37;
          box-shadow: 0 0 0 0.2rem rgba(212, 175, 55, 0.3);
        }
        
        .form-input::placeholder {
           color: #9e8a78;
        }

        .form-input[readOnly], .form-select[disabled] {
            background-color: #f3f0e9;
            color: #6c757d;
            cursor: not-allowed;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: none;
            padding-right: 20px; /* Adjust padding if needed */
        }

        .birthdate-selects {
          display: flex;
          gap: 10px;
        }
        
        .birthdate-selects > .form-select {
          flex: 1;
        }

        /* 하단 버튼 */
        .submit-button-container {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid rgba(184, 134, 11, 0.2);
        }

        .add-customer-btn {
          padding: 15px 30px;
          font-size: 16px;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #2C1F14;
          background: linear-gradient(135deg, #D4AF37, #F5C23E);
          box-shadow: 0 4px 15px rgba(184, 134, 11, 0.35);
        }

        .add-customer-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(184, 134, 11, 0.45);
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
        .popup-button.confirm:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(184, 134, 11, 0.4);
        }
        
        /* 반응형 */
        @media (max-width: 768px) {
          .form-card-container {
            padding: 20px;
          }
          .card-header {
            text-align: left;
            padding-left: 130px; /* Make space for back button */
            height: 45px;
            display: flex;
            align-items: center;
          }
          .back-btn {
            transform: translateY(-50%) scale(0.95);
          }
          .form-title {
            font-size: 24px;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
          .submit-button-container {
             justify-content: center;
          }
          .add-customer-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Menu1_5;