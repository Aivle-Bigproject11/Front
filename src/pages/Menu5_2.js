import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 아이콘 SVG 컴포넌트
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z"/>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
  </svg>
);

const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
    </svg>
);

// 커스텀 팝업 컴포넌트
const CustomPopup = ({ message, onConfirm }) => (
    <div className="popup-overlay">
        <div className="popup-content">
            <p>{message}</p>
            <button onClick={onConfirm} className="popup-button confirm">확인</button>
        </div>
    </div>
);


const Menu5_2 = () => {
  const navigate = useNavigate();
  const [animateCard, setAnimateCard] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', birthYear: '', birthMonth: '', birthDay: '',
    occupation: '', address: '', gender: '남', maritalStatus: '미혼', hasChildren: '무',
  });
  
  const [diseases, setDiseases] = useState([]);
  const [currentDisease, setCurrentDisease] = useState('');
  
  // 팝업 상태 관리
  const [popup, setPopup] = useState({
    isOpen: false,
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    setAnimateCard(true);
  }, []);

  const closePopup = () => {
    setPopup({ isOpen: false, message: '', onConfirm: () => {} });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };
  
  const handleDiseaseChange = (e) => setCurrentDisease(e.target.value);

  const handleAddDisease = () => {
    if (currentDisease.trim() !== '' && !diseases.includes(currentDisease.trim())) {
      setDiseases([...diseases, currentDisease.trim()]);
      setCurrentDisease('');
    }
  };

  const handleRemoveDisease = (diseaseToRemove) => {
    setDiseases(diseases.filter(disease => disease !== diseaseToRemove));
  };
  
  // 추가 핸들러
  const handleAddCustomer = (e) => {
    e.preventDefault();
    const completeFormData = { ...formData, diseases };
    console.log('추가된 고객 정보:', completeFormData);
    
    setPopup({
        isOpen: true,
        message: '고객 정보가 추가되었습니다.',
        onConfirm: () => {
            closePopup();
            navigate(-1);
        }
    });
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
            <h2 className="form-title">고객 추가</h2>
        </div>
        <form onSubmit={handleAddCustomer}>
          <div className="form-grid">
            <div className="form-column">
              <div className="form-group">
                <label className="form-label">이름</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">이메일</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">전화번호</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" placeholder="숫자 11자리만 입력" maxLength="11" />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label className="form-label">생년월일</label>
                <div className="birthdate-selects">
                  <select name="birthYear" value={formData.birthYear} onChange={handleChange} className="form-select">
                    <option value="">년</option>
                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                  <select name="birthMonth" value={formData.birthMonth} onChange={handleChange} className="form-select">
                    <option value="">월</option>
                    {months.map(month => <option key={month} value={month}>{month}</option>)}
                  </select>
                  <select name="birthDay" value={formData.birthDay} onChange={handleChange} className="form-select">
                    <option value="">일</option>
                    {days.map(day => <option key={day} value={day}>{day}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">직업</label>
                <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">주소</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-input" />
              </div>
            </div>

            <div className="form-column">
               <div className="form-group">
                <label className="form-label">성별</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="form-select">
                  <option value="남">남</option>
                  <option value="여">여</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">결혼여부</label>
                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="form-select">
                  <option value="미혼">미혼</option>
                  <option value="기혼">기혼</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">자녀유무</label>
                <select name="hasChildren" value={formData.hasChildren} onChange={handleChange} className="form-select">
                  <option value="무">무</option>
                  <option value="유">유</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">질병</label>
                <div className="disease-input-group">
                  <input 
                    type="text" 
                    value={currentDisease} 
                    onChange={handleDiseaseChange} 
                    className="form-input" 
                    placeholder="질병 입력 후 Enter"
                    onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddDisease(); }}}
                  />
                  <button type="button" onClick={handleAddDisease} className="add-btn"><PlusIcon /></button>
                </div>
                <div className="disease-list">
                  {diseases.map((disease, index) => (
                    <div key={index} className="disease-item">
                      <span>{disease}</span>
                      <button type="button" onClick={() => handleRemoveDisease(disease)} className="remove-btn"><XIcon /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="submit-button-container">
            <button type="submit" className="add-customer-btn">추가하기</button>
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

        .birthdate-selects {
          display: flex;
          gap: 10px;
        }
        
        .birthdate-selects > select {
          flex: 1;
        }
        
        /* 질병 입력 */
        .disease-input-group {
          display: flex;
          gap: 10px;
        }
        
        .disease-input-group .form-input {
          flex-grow: 1;
          height: 45px; /* 버튼과 높이 맞춤 */
        }

        .add-btn {
          flex-shrink: 0;
          width: 45px;
          height: 45px;
          border: 2px solid rgba(184, 134, 11, 0.35);
          background-color: rgba(255, 255, 255, 0.95);
          color: #4A3728;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .add-btn:hover {
          background-color: #f7f3e9;
          border-color: #D4AF37;
        }

        .disease-list {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 150px;
          overflow-y: auto;
          padding-right: 5px;
        }
        
        .disease-list::-webkit-scrollbar { width: 6px; }
        .disease-list::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .disease-list::-webkit-scrollbar-thumb { background-color: rgba(184, 134, 11, 0.5); border-radius: 10px; }

        .disease-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: rgba(184, 134, 11, 0.1);
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 14px;
          color: #4A3728;
        }

        .remove-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #8B5A2B;
          padding: 0;
          line-height: 1;
          transition: color 0.2s ease;
        }
        
        .remove-btn:hover {
          color: #c82333;
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

export default Menu5_2;
