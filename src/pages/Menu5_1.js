import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { customerService } from '../services/customerService';

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
const CustomPopup = ({ message, type, onConfirm, onCancel }) => (
    <div className="popup-overlay">
        <div className="popup-content">
            <p>{message}</p>
            {type === 'confirm' ? (
                <div className="popup-button-group">
                    <button onClick={onCancel} className="popup-button cancel">취소</button>
                    <button onClick={onConfirm} className="popup-button confirm">확인</button>
                </div>
            ) : (
                <button onClick={onConfirm} className="popup-button confirm">확인</button>
            )}
        </div>
    </div>
);


const Menu5_1 = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // URL에서 고객 ID를 가져옴
  const [animateCard, setAnimateCard] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', rrn: '', birthYear: '', birthMonth: '', birthDay: '',
    occupation: '', address: '', gender: '남성', maritalStatus: '미혼', hasChildren: '무',
  });
  
  const [diseases, setDiseases] = useState([]);
  const [currentDisease, setCurrentDisease] = useState('');
  
  // 팝업 상태 관리
  const [popup, setPopup] = useState({
    isOpen: false,
    message: '',
    type: 'alert',
    onConfirm: () => {},
  });

  // 고객 데이터를 불러오는 함수
  const fetchCustomerData = useCallback(async () => {
    try {
        const response = await customerService.getCustomerById(id);
        const customer = response.data;

        // 생년월일 파싱
        const [year, month, day] = customer.birthDate ? customer.birthDate.split('T')[0].split('-') : ['', '', ''];

        setFormData({
            name: customer.name || '',
            email: customer.email || '',
            phone: customer.phone || '',
            rrn: customer.rrn || '',
            birthYear: year,
            birthMonth: month ? parseInt(month, 10).toString() : '',
            birthDay: day ? parseInt(day, 10).toString() : '',
            occupation: customer.job || '',
            address: customer.address || '',
            gender: customer.gender || '남성',
            maritalStatus: customer.isMarried ? '기혼' : '미혼',
            hasChildren: customer.hasChildren ? '유' : '무',
        });
        setDiseases(customer.diseaseList || []);
    } catch (error) {
        console.error("Failed to fetch customer data:", error);
        setPopup({
            isOpen: true,
            message: '고객 정보를 불러오는 데 실패했습니다.',
            type: 'alert',
            onConfirm: () => navigate(-1),
        });
    }
  }, [id, navigate]);

  useEffect(() => {
    setAnimateCard(true);
    fetchCustomerData();
  }, [fetchCustomerData]);

  const closePopup = () => {
    setPopup({ isOpen: false, message: '', type: 'alert', onConfirm: () => {} });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    let formattedValue = "";
    if (rawValue.length < 4) formattedValue = rawValue;
    else if (rawValue.length < 8) formattedValue = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
    else formattedValue = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7, 11)}`;
    setFormData(prevState => ({ ...prevState, phone: formattedValue }));
  };

  const handleRrnChange = (e) => {
    const { value } = e.target;
    const cleaned = value.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 6) formatted = `${cleaned.slice(0, 6)}-${cleaned.slice(6, 13)}`;
    setFormData(prevState => ({ ...prevState, rrn: formatted }));
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
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const { birthYear, birthMonth, birthDay } = formData;
    let age = null;
    if (birthYear && birthMonth && birthDay) {
        const today = new Date();
        const birthDate = new Date(parseInt(birthYear), parseInt(birthMonth) - 1, parseInt(birthDay));
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) calculatedAge--;
        age = calculatedAge;
    }

    const customerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        rrn: formData.rrn,
        birthDate: `${formData.birthYear}-${String(formData.birthMonth).padStart(2, '0')}-${String(formData.birthDay).padStart(2, '0')}`,
        age: age,
        job: formData.occupation,
        address: formData.address,
        gender: formData.gender,
        isMarried: formData.maritalStatus === '기혼',
        hasChildren: formData.hasChildren === '유',
        diseaseList: diseases,
    };

    try {
        await customerService.updateCustomer(id, customerData);
        setPopup({
            isOpen: true,
            message: '고객 정보가 수정되었습니다.',
            type: 'alert',
            onConfirm: () => {
                closePopup();
                navigate(-1);
            }
        });
    } catch (error) {
        console.error("Failed to update customer:", error);
        setPopup({ isOpen: true, message: '정보 수정에 실패했습니다.', type: 'alert', onConfirm: closePopup });
    }
  };

  const executeDelete = async () => {
    try {
        await customerService.deleteCustomer(id);
        setPopup({
            isOpen: true,
            message: '고객 정보가 삭제되었습니다.',
            type: 'alert',
            onConfirm: () => {
                closePopup();
                navigate('/menu5'); // 삭제 후 목록 페이지로 이동
            }
        });
    } catch (error) {
        console.error("Failed to delete customer:", error);
        setPopup({ isOpen: true, message: '정보 삭제에 실패했습니다.', type: 'alert', onConfirm: closePopup });
    }
  };

  const handleDeleteClick = () => {
    setPopup({
        isOpen: true,
        message: '정말로 이 고객 정보를 삭제하시겠습니까?',
        type: 'confirm',
        onConfirm: executeDelete,
        onCancel: closePopup
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
            type={popup.type}
            onConfirm={popup.onConfirm}
            onCancel={closePopup}
        />
      )}
      <div className={`form-card-container ${animateCard ? 'animate-in' : ''}`}>
        <div className="card-header">
            <button type="button" className="back-btn" onClick={() => navigate(-1)}>
                <BackArrowIcon />
                돌아가기
            </button>
            <h2 className="form-title">고객 수정</h2>
        </div>
        <form onSubmit={handleUpdate}>
          <div className="form-grid">
            {/* Column 1 */}
            <div className="form-column">
              <div className="form-group">
                <label className="form-label">이름</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">고유 번호 (수정 불가)</label>
                <input type="text" value={id} className="form-input-readonly" readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">이메일</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">전화번호</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handlePhoneChange} className="form-input" placeholder="010-1234-5678" maxLength="13" />
              </div>
              <div className="form-group">
                <label className="form-label">주민등록번호</label>
                <input type="text" name="rrn" value={formData.rrn} onChange={handleRrnChange} className="form-input" placeholder="xxxxxx-xxxxxxx" maxLength="14" />
              </div>
            </div>

            {/* Column 2 */}
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

            {/* Column 3 */}
            <div className="form-column">
              <div className="form-group">
                <label className="form-label">성별</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="form-select">
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
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
            <button type="submit" className="update-btn">수정하기</button>
            <button type="button" className="delete-btn" onClick={handleDeleteClick}>삭제하기</button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        /* 전역 및 레이아웃 */
        .page-wrapper {
          min-height: calc(100vh - 62px);
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

        .form-input, .form-select, .form-input-readonly {
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
        
        /* ▼▼▼ [수정] 읽기 전용 스타일 다시 추가 ▼▼▼ */
        .form-input-readonly {
          background-color: rgba(184, 134, 11, 0.1);
          color: #4A3728;
          cursor: not-allowed;
        }
        /* ▲▲▲ [수정] 읽기 전용 스타일 다시 추가 ▲▲▲ */

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

        .update-btn, .delete-btn {
          padding: 15px 30px;
          font-size: 16px;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .update-btn {
          color: #2C1F14;
          background: linear-gradient(135deg, #D4AF37, #F5C23E);
          box-shadow: 0 4px 15px rgba(184, 134, 11, 0.35);
        }

        .update-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(184, 134, 11, 0.45);
        }
        
        .delete-btn {
          color: white;
          background: linear-gradient(135deg, #b23a48, #932a38);
          box-shadow: 0 4px 15px rgba(178, 58, 72, 0.35);
        }

        .delete-btn:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #a13441, #822531);
          box-shadow: 0 8px 25px rgba(178, 58, 72, 0.45);
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
        .popup-button-group {
            display: flex;
            gap: 15px;
            justify-content: center;
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
        .popup-button.cancel {
            background-color: #e9ecef;
            color: #495057;
        }
        .popup-button.cancel:hover {
            background-color: #dee2e6;
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
            flex-direction: column;
            gap: 15px;
          }
           .update-btn, .delete-btn {
            width: 100%;
           }
        }
      `}</style>
    </div>
  );
};

export default Menu5_1;
