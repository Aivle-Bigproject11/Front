import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { Form, Row, Col, Alert } from 'react-bootstrap';

registerLocale('ko', ko);

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

const calculateAge = (birthDate, deathDate) => {
  if (!birthDate || !deathDate) return '';

  const birth = new Date(birthDate);
  const death = new Date(deathDate);

  let age = death.getFullYear() - birth.getFullYear();
  const monthDifference = death.getMonth() - birth.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && death.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const Menu1_5 = () => {
  const navigate = useNavigate();
  const [animateCard, setAnimateCard] = useState(false);
  const [formData, setFormData] = useState({
    customerId: null,
    name: '',
    rrn: '',
    ageAtDeath: '',
    deceasedBirthOfDate: null,
    deathDate: null,
    deathDate_time: '',
    gender: '남성',
    placeOfDeath: '',
    funeralCompany: '',
    directorName: '',
    directorPhone: ''
  });
  
  const [popup, setPopup] = useState({ isOpen: false, message: '', onConfirm: () => {} });
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    setAnimateCard(true);
    const savedCustomer = localStorage.getItem('selectedCustomer');
    if (savedCustomer) {
      const customer = JSON.parse(savedCustomer);
      
      const rawBirthDate = customer.birthDate || customer.birthOfDate || customer.deceasedBirthOfDate;
      const birthDate = rawBirthDate ? new Date(rawBirthDate) : null;
      const deathDate = customer.deceasedDate ? new Date(customer.deceasedDate) : null;
      let deathTime = '';
      if (deathDate) {
        const hours = String(deathDate.getHours()).padStart(2, '0');
        const minutes = String(deathDate.getMinutes()).padStart(2, '0');
        deathTime = `${hours}:${minutes}`;
      }

      setFormData(prev => {
        const newFormData = {
          ...prev,
          customerId: customer.customerId || null,
          name: customer.name || '',
          rrn: customer.rrn || '',
          gender: customer.gender || '남성',
          deceasedBirthOfDate: birthDate,
          deathDate: deathDate,
          deathDate_time: deathTime,
        };
        newFormData.ageAtDeath = calculateAge(newFormData.deceasedBirthOfDate, newFormData.deathDate);
        return newFormData;
      });
    }
  }, []);

  

  const closePopup = () => {
    setPopup({ isOpen: false, message: '', onConfirm: () => {} });
  };

  const formatDateForDisplay = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
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

  const updateValidationError = (field, isValid) => {
    setValidationErrors(prev => {
        const newErrors = new Set(prev);
        if (isValid) {
            newErrors.delete(field);
        } else {
            newErrors.add(field);
        }

        const updatedErrors = [...newErrors];
        if (updatedErrors.length === 0) {
            setErrorMessage('');
        }

        return updatedErrors;
    });
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
    
    const finalValue = formattedPhone.slice(0, 13);
    const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
    updateValidationError('directorPhone', phoneRegex.test(finalValue));

    setFormData(prevState => ({ ...prevState, directorPhone: finalValue }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For simple text fields, validate right away
    if (name !== 'deathDate_time') {
        updateValidationError(name, value.trim() !== '');
        setFormData(prevState => ({ ...prevState, [name]: value }));
        return;
    }

    // Logic for deathDate_time
    const numbers = value.replace(/[^0-9]/g, '');
    let formattedTime = numbers;
    if (numbers.length > 2) {
        formattedTime = `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`;
    }
    
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    updateValidationError('deathDate_time', timeRegex.test(formattedTime));

    setFormData(prev => {
      const dateObj = prev.deathDate ? new Date(prev.deathDate) : new Date();
      if (timeRegex.test(formattedTime)) {
        const [hours, minutes] = formattedTime.split(':');
        dateObj.setHours(parseInt(hours, 10));
        dateObj.setMinutes(parseInt(minutes, 10));
        dateObj.setSeconds(0);
        dateObj.setMilliseconds(0);
      }
      return {
        ...prev,
        [name]: formattedTime,
        deathDate: dateObj,
        ageAtDeath: calculateAge(prev.deceasedBirthOfDate, dateObj)
      };
    });
  };

  const handleDateChange = (date) => {
    updateValidationError('deathDate', date !== null);
    setFormData(prev => {
      const newDeathDate = date;
      const newAge = calculateAge(prev.deceasedBirthOfDate, newDeathDate);
      return { ...prev, deathDate: newDeathDate, ageAtDeath: newAge };
    });
  };
  
  const fieldLabels = {
    name: '이름',
    rrn: '주민번호',
    deceasedBirthOfDate: '생년월일',
    deathDate: '별세일',
    deathDate_time: '별세 시간',
    placeOfDeath: '별세 장소',
    funeralCompany: '상조회사',
    directorName: '담당 장례지도사 이름',
    directorPhone: '담당 장례지도사 전화번호'
  };

  const validateForm = () => {
    const errors = [];
    const { name, rrn, deceasedBirthOfDate, deathDate, deathDate_time, placeOfDeath, funeralCompany, directorName, directorPhone } = formData;

    if (!name.trim()) errors.push('name');
    if (!rrn.trim()) errors.push('rrn');
    if (!deceasedBirthOfDate) errors.push('deceasedBirthOfDate');
    if (!deathDate) errors.push('deathDate');
    if (!deathDate_time.trim()) errors.push('deathDate_time');
    if (!placeOfDeath.trim()) errors.push('placeOfDeath');
    if (!funeralCompany.trim()) errors.push('funeralCompany');
    if (!directorName.trim()) errors.push('directorName');
    if (!directorPhone.trim()) errors.push('directorPhone');

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; 
    if (deathDate_time && !timeRegex.test(deathDate_time)) {
        if (!errors.includes('deathDate_time')) errors.push('deathDate_time');
    }

    const phoneRegex = /^\d{3}-\d{4}-\d{4}$/; 
    if (directorPhone && !phoneRegex.test(directorPhone)) {
        if (!errors.includes('directorPhone')) errors.push('directorPhone');
    }
    
    setValidationErrors(errors);

    if (errors.length > 0) {
        const errorFieldLabels = errors.map(field => fieldLabels[field] || field).filter(Boolean);
        setErrorMessage(`다음 필드의 형식이 올바르지 않거나, 비어있습니다.\n`);
        return false;
    }

    setErrorMessage('');
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
    const deceasedBirthOfDate = formData.deceasedBirthOfDate
      ? formData.deceasedBirthOfDate.toISOString()
      : null;

    let deceasedDate = null;
    if (formData.deathDate && formData.deathDate_time) {
      const date = new Date(formData.deathDate);
      const [hours, minutes] = formData.deathDate_time.split(':');
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      date.setSeconds(0);
      date.setMilliseconds(0);
      deceasedDate = date.toISOString();
    }

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
                    {errorMessage && (
            <Alert variant="danger" className="mx-4 mb-4" onClose={() => setErrorMessage('')} dismissible>
              <div>{errorMessage}</div>
              <strong>
                {validationErrors.map(field => fieldLabels[field] || field).join(', ')}
              </strong>
            </Alert>
          )}
          <div className="form-grid">
            {/* Column 1 */}
            <div className="form-column">
              <div className="form-group">
                <label className="form-label">고유 번호</label>
                <input type="text" name="customerId" value={formData.customerId || ''} className="form-input" readOnly />
                {/* <input type="text" name="customerId" value={formData.customerId || ''} onChange={handleChange} className="form-input" /> */}
              </div>
              <div className="form-group">
                <label className="form-label">이름</label>
                <input type="text" name="name" value={formData.name} className={`form-input ${validationErrors.includes("name") ? "is-invalid" : ""}`} readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">주민번호</label>
                <input type="text" name="rrn" value={formData.rrn} className={`form-input ${validationErrors.includes("rrn") ? "is-invalid" : ""}`} readOnly />
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
                <input
                  type="text"
                  name="deceasedBirthOfDate"
                  value={formatDateForDisplay(formData.deceasedBirthOfDate)}
                  className={`form-input ${validationErrors.includes("deceasedBirthOfDate") ? "is-invalid" : ""}`}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label">별세일</label>
                <Row>
                  <Col md={6}>
                    <DatePicker
                      selected={formData.deathDate}
                      onChange={(date) => handleDateChange(date)}
                      locale={ko}
                      dateFormat="yyyy/MM/dd"
                      placeholderText="날짜 선택"
                      customInput={<Form.Control className={`form-input ${validationErrors.includes("deathDate") ? "is-invalid" : ""}`} />}
                      renderCustomHeader={({
                        date,
                        changeYear,
                        changeMonth,
                        decreaseMonth,
                        increaseMonth,
                        prevMonthButtonDisabled,
                        nextMonthButtonDisabled,
                      }) => {
                        const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i);
                        const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
                        return (
                          <div style={{ margin: 10, display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} style={{border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2em'}}>{"<"}</button>
                            <Form.Select value={date.getFullYear()} onChange={({ target: { value } }) => changeYear(value)} style={{margin: '0 5px', width: '100px'}}>
                              {years.map((option) => (<option key={option} value={option}>{option}년</option>))}
                            </Form.Select>
                            <Form.Select value={months[date.getMonth()]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))} style={{margin: '0 5px', width: '80px'}}>
                              {months.map((option) => (<option key={option} value={option}>{option}</option>))}
                            </Form.Select>
                            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} style={{border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2em'}}>{">"}</button>
                          </div>
                        );
                      }}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Control
                      type="text"
                      name="deathDate_time"
                      value={formData.deathDate_time}
                      onChange={handleChange}
                      placeholder="시간 (HH:MM)"
                      maxLength="5"
                      className={`form-input ${validationErrors.includes("deathDate_time") ? "is-invalid" : ""}`}
                    />
                  </Col>
                </Row>
              </div>
              <div className="form-group">
                <label className="form-label">주소지</label>
                <input type="text" name="placeOfDeath" value={formData.placeOfDeath} onChange={handleChange} className={`form-input ${validationErrors.includes("placeOfDeath") ? "is-invalid" : ""}`} />
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
                <input type="text" name="funeralCompany" value={formData.funeralCompany} onChange={handleChange} className={`form-input ${validationErrors.includes("funeralCompany") ? "is-invalid" : ""}`} />
              </div>
              <div className="form-group">
                <label className="form-label">담당 장례지도사 이름</label>
                <input type="text" name="directorName" value={formData.directorName} onChange={handleChange} className={`form-input ${validationErrors.includes("directorName") ? "is-invalid" : ""}`} />
              </div>
              <div className="form-group">
                <label className="form-label">담당 장례지도사 전화번호</label>
                <input type="tel" name="directorPhone" value={formData.directorPhone} onChange={handlePhoneChange} className={`form-input ${validationErrors.includes("directorPhone") ? "is-invalid" : ""}`} placeholder="010-1234-5678" maxLength="13" />
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
        
        .form-input.is-invalid, .form-select.is-invalid,
        .form-input.is-invalid:focus, .form-select.is-invalid:focus {
          border-color: #dc3545 !important;
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